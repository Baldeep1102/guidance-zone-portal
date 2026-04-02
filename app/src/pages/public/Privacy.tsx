export function Privacy() {
  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
              Legal
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-semibold text-[#111827] mb-4">
              Privacy Policy
            </h1>
            <p className="text-[#9CA3AF] text-sm">Last updated: April 2026</p>
          </div>

          <div className="bg-white rounded-[22px] card-shadow-light p-6 lg:p-10 prose prose-sm max-w-none text-[#374151]">
            <h2 className="font-heading text-lg font-semibold text-[#111827]">1. Introduction</h2>
            <p>Guidance Zone ("GuZo", "we", "us", or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit guzo.in and use our services.</p>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account.</li>
              <li><strong>Google OAuth Data:</strong> If you sign in with Google, we receive your name, email, and profile picture from Google. We do not access your Google contacts, calendar, or other data.</li>
              <li><strong>Contact Form Data:</strong> Name, email, phone, and message when you submit the "Ask Acharya Ji" form.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on the platform, and browser/device information for improving our service.</li>
              <li><strong>Course Registration:</strong> Information related to courses you register for and your enrollment status.</li>
            </ul>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create and manage your account</li>
              <li>Process course registrations and send confirmation emails</li>
              <li>Respond to your questions submitted via the contact form</li>
              <li>Send important updates about courses, satsang sessions, and platform changes</li>
              <li>Improve our website and services</li>
            </ul>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">4. Email Communications</h2>
            <p>We use email to send account verification, password reset links, course registration confirmations, and responses to your inquiries. We do not send unsolicited marketing emails. All transactional emails are sent through Resend, a secure email delivery service.</p>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">5. Data Storage and Security</h2>
            <p>Your data is stored on secure servers. Passwords are hashed and never stored in plain text. We use JWT-based authentication with HTTP-only cookies for session management. While we take reasonable measures to protect your data, no method of transmission over the internet is 100% secure.</p>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">6. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Google OAuth:</strong> For optional social login</li>
              <li><strong>Resend:</strong> For sending transactional emails</li>
              <li><strong>YouTube:</strong> For embedding talk videos</li>
            </ul>
            <p>These services have their own privacy policies, and we encourage you to review them.</p>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">7. Cookies</h2>
            <p>We use HTTP-only cookies for authentication purposes (session tokens). We do not use tracking cookies or third-party advertising cookies.</p>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">8. Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>When required by law or legal process</li>
              <li>To protect the rights, safety, or property of Guidance Zone or its users</li>
              <li>With service providers who assist in operating the platform (under strict confidentiality agreements)</li>
            </ul>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">9. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent for data processing at any time</li>
            </ul>
            <p>To exercise any of these rights, please contact us at amazingbaldeep@gmail.com.</p>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">10. Children's Privacy</h2>
            <p>Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children.</p>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this policy periodically.</p>

            <h2 className="font-heading text-lg font-semibold text-[#111827]">12. Contact</h2>
            <p>If you have questions about this Privacy Policy, please contact us at amazingbaldeep@gmail.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
