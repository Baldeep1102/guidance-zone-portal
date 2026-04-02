import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'What is Guidance Zone (GuZo)?',
    answer: 'Guidance Zone is an online spiritual learning platform founded by Acharya Navneetji. It offers guided courses, live satsang sessions, talks, books, and downloadable resources to support your spiritual journey.',
  },
  {
    question: 'Can I reach Acharya Ji directly?',
    answer: 'Yes, you can write directly to Acharya Navneetji at aimseve@gmail.com. For general inquiries about courses and the platform, please use the "Ask Acharya Ji" form on our website.',
  },
  {
    question: 'How do I register for a course?',
    answer: 'Visit the Courses page, select the course you are interested in, and click "Register". You will need to create a free account first. Once registered, your enrollment will be reviewed and confirmed.',
  },
  {
    question: 'Are the courses free?',
    answer: 'Many of our resources, including talks and downloadable materials, are available for free. Some courses may have a fee to cover operational costs. The pricing is mentioned on each course page.',
  },
  {
    question: 'How do I attend live satsang sessions?',
    answer: 'Live satsang sessions are held online via Zoom. The schedule is available on the homepage and the Talks page. Register on the platform to receive session links and reminders.',
  },
  {
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Forgot Password" on the login page, enter your registered email, and you will receive a password reset link. The link is valid for 1 hour.',
  },
  {
    question: 'Can I download materials for offline use?',
    answer: 'Yes! Visit the Downloads section for free resources including guided meditations, mantras, journal templates, and more. All downloadable content is available in PDF and audio formats.',
  },
  {
    question: 'How do I contact the team for support?',
    answer: 'You can reach us through the "Ask Acharya Ji" page on this website, or email us at amazingbaldeep@gmail.com for technical support and platform-related questions.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
              Help
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-semibold text-[#111827] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-[#6B7280] text-base lg:text-lg">
              Find answers to common questions about Guidance Zone.
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-[18px] card-shadow-light overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 lg:p-6 text-left"
                >
                  <span className="font-heading text-base lg:text-lg font-medium text-[#111827] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#7B6CFF] flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 lg:px-6 pb-5 lg:pb-6">
                    <p className="text-[#6B7280] text-sm lg:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-[#6B7280] text-base mb-4">
              Still have questions?
            </p>
            <Link
              to="/ask-acharya-ji"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full text-sm font-medium transition-colors"
            >
              Ask Acharya Ji
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
