import { Link } from 'react-router-dom';
import { Mail, Youtube, Instagram, Music } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: 'Courses', path: '/courses' },
      { label: 'Talks', path: '/talks' },
      { label: 'Books', path: '/books' },
      { label: 'Downloads', path: '/downloads' },
      { label: 'Projects', path: '/projects' },
      { label: 'About', path: '/about' },
    ],
    community: [
      { label: 'Join Satsang', path: '/talks' },
      { label: 'My Dashboard', path: '/dashboard' },
      { label: 'Upcoming Events', path: '/courses' },
    ],
    support: [
      { label: 'Contact Us', path: 'mailto:hello@guzo.org' },
      { label: 'FAQ', path: '#' },
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Music, href: '#', label: 'Spotify' },
    { icon: Mail, href: 'mailto:hello@guzo.org', label: 'Email' },
  ];

  return (
    <footer className="bg-[#F6F7F9] grain-overlay pt-16 lg:pt-24 pb-8">
      <div className="px-6 lg:px-[6vw]">
        {/* Main Footer Card */}
        <div className="bg-white rounded-[28px] card-shadow-light p-8 lg:p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.png"
                  alt="GuZo"
                  className="w-10 h-10 object-contain"
                />
                <span className="font-heading text-xl font-semibold text-[#111827]">
                  GuZo
                </span>
              </Link>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                Practical spirituality for real life. Guided courses, live satsang, and a community walking the path together.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:bg-[#7B6CFF] hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Explore Column */}
            <div>
              <h3 className="font-heading text-sm font-semibold text-[#111827] uppercase tracking-wider mb-4">
                Explore
              </h3>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[#6B7280] text-sm hover:text-[#7B6CFF] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Column */}
            <div>
              <h3 className="font-heading text-sm font-semibold text-[#111827] uppercase tracking-wider mb-4">
                Community
              </h3>
              <ul className="space-y-3">
                {footerLinks.community.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[#6B7280] text-sm hover:text-[#7B6CFF] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="font-heading text-sm font-semibold text-[#111827] uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    {link.path.startsWith('mailto:') || link.path === '#' ? (
                      <a
                        href={link.path}
                        className="text-[#6B7280] text-sm hover:text-[#7B6CFF] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-[#6B7280] text-sm hover:text-[#7B6CFF] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E7EB]">
          <p className="text-[#9CA3AF] text-sm">
            {currentYear} GuZo - Guidance Zone. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-[#9CA3AF] text-sm hover:text-[#7B6CFF] transition-colors">
              Privacy
            </Link>
            <Link to="#" className="text-[#9CA3AF] text-sm hover:text-[#7B6CFF] transition-colors">
              Terms
            </Link>
            <a
              href="/admin/login"
              className="text-[#9CA3AF] text-sm hover:text-[#7B6CFF] transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
