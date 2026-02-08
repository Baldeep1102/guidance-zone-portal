import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Heart, BookOpen, Users, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-image', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 0.4,
        },
        x: '-10vw',
        opacity: 0,
        scale: 0.95,
      });

      gsap.from('.about-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'top 35%',
          scrub: 0.4,
        },
        x: '10vw',
        opacity: 0,
      });

      gsap.from('.stat-card', {
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
          end: 'top 50%',
          scrub: 0.4,
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
      });
    });

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: BookOpen, value: '15+', label: 'Years of Teaching' },
    { icon: Users, value: '50K+', label: 'Students Worldwide' },
    { icon: Heart, value: '500+', label: 'Satsangs Conducted' },
    { icon: Sparkles, value: '12', label: 'Books Published' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] grain-overlay pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        {/* Hero Section */}
        <div ref={sectionRef} className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20 lg:mb-32">
          {/* Image */}
          <div className="about-image w-full lg:w-[45vw] h-[50vh] lg:h-[70vh] rounded-[28px] overflow-hidden card-shadow-light flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80"
              alt="Acharya Navneetji"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="about-content flex-1 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4">
              About
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-[#111827] mb-6 leading-tight">
              Acharya<br />Navneetji
            </h1>
            <p className="text-[#6B7280] text-base lg:text-lg leading-relaxed mb-6">
              Acharya Navneetji is a contemporary spiritual teacher dedicated to making ancient wisdom accessible to modern seekers. With over 15 years of teaching experience, he has guided thousands of students on their journey of self-discovery.
            </p>
            <p className="text-[#6B7280] text-base lg:text-lg leading-relaxed mb-6">
              His teachings blend traditional meditation practices with practical insights for daily life, emphasizing that spirituality is not about escaping the world but engaging with it more fully and consciously.
            </p>
            <p className="text-[#6B7280] text-base lg:text-lg leading-relaxed">
              Through courses, satsangs, and writings, he offers a path that is both profound and practical—one that meets you where you are and guides you toward deeper understanding and inner peace.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mb-20 lg:mb-32">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-12 h-12 text-[#7B6CFF] mx-auto mb-6 opacity-50" />
            <blockquote className="font-heading text-2xl lg:text-3xl xl:text-4xl font-medium text-[#111827] leading-relaxed mb-6">
              "The journey inward is the greatest adventure you will ever undertake. It requires courage, patience, and a willingness to let go of everything you think you know about yourself."
            </blockquote>
            <cite className="text-[#6B7280] text-sm not-italic">— Acharya Navneetji</cite>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section mb-20 lg:mb-32">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card bg-white rounded-[22px] card-shadow-light p-6 lg:p-8 text-center"
              >
                <stat.icon className="w-8 h-8 text-[#7B6CFF] mx-auto mb-4" />
                <div className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Philosophy */}
        <div className="mb-20 lg:mb-32">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
              Approach
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827]">
              Teaching Philosophy
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Practical Wisdom',
                description: 'Spirituality is not about escaping life but engaging with it more fully. Every teaching is designed to be applied in daily life.',
              },
              {
                title: 'Direct Experience',
                description: 'True understanding comes from direct experience, not mere intellectual knowledge. Practices are designed to lead you to your own insights.',
              },
              {
                title: 'Compassionate Guidance',
                description: 'The path is walked with gentleness and patience. Each seeker is met where they are, with understanding and support.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[22px] card-shadow-light p-6 lg:p-8"
              >
                <div className="w-10 h-10 rounded-full bg-[#7B6CFF]/10 flex items-center justify-center mb-4">
                  <span className="text-[#7B6CFF] font-heading font-semibold">{index + 1}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#111827] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4 block">
              Timeline
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827]">
              The Journey
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {[
              { year: '2008', event: 'Began teaching meditation in small groups' },
              { year: '2012', event: 'Published first book, "The Silent Path"' },
              { year: '2015', event: 'Established GuZo as a spiritual learning platform' },
              { year: '2018', event: 'Launched first online courses' },
              { year: '2022', event: 'Reached 50,000 students worldwide' },
              { year: '2026', event: 'Continuing to guide seekers on the path' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-6 lg:gap-10 pb-8 last:pb-0"
              >
                <div className="w-20 lg:w-24 flex-shrink-0 text-right">
                  <span className="font-heading text-lg lg:text-xl font-semibold text-[#7B6CFF]">
                    {item.year}
                  </span>
                </div>
                <div className="relative flex-1 pb-8 last:pb-0 border-l-2 border-[#E5E7EB] pl-6 lg:pl-10">
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-[#7B6CFF] -translate-x-[7px]" />
                  <p className="text-[#374151] text-sm lg:text-base">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
