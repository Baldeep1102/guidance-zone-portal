import type { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/database.js';
import { env } from '../config/env.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';
import type { AuthRequest } from '../middleware/auth.js';
import crypto from 'crypto';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        emailVerifyToken,
        authProvider: 'EMAIL',
      },
    });

    // Send verification email (don't block response)
    sendVerificationEmail(email, name, emailVerifyToken).catch(err =>
      console.error('Failed to send verification email:', err)
    );

    res.status(201).json({
      message: 'Account created. Please check your email to verify your account.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function googleAuth(req: Request, res: Response) {
  try {
    const { idToken } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();
    if (!googlePayload || !googlePayload.email) {
      res.status(400).json({ error: 'Invalid Google token' });
      return;
    }

    const { email, name, picture, sub: googleId } = googlePayload;

    // Upsert user
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: {
          googleId: googleId || undefined,
          avatarUrl: picture || user.avatarUrl,
          emailVerified: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: name || 'User',
          email,
          googleId,
          avatarUrl: picture,
          authProvider: 'GOOGLE',
          emailVerified: true,
        },
      });
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ error: 'Refresh token not found' });
      return;
    }

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || user.refreshToken !== token) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    const newPayload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(newPayload);
    const refreshToken = signRefreshToken(newPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Invalid verification token' });
      return;
    }

    const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired verification token' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null },
    });

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ error: 'Email verification failed' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      res.json({ message: 'If an account exists, a reset link has been sent.' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken: resetToken },
    });

    sendPasswordResetEmail(email, user.name, resetToken).catch(err =>
      console.error('Failed to send reset email:', err)
    );

    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, emailVerifyToken: null },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatarUrl: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
