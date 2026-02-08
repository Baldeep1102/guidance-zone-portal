import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, ArrowRight, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Starfield } from '@/components/ui-custom/Starfield';
import { OrbitIcon } from '@/components/ui-custom/OrbitIcon';
import { PlanetIcon } from '@/components/ui-custom/PlanetIcon';
import { StarIcon } from '@/components/ui-custom/StarIcon';
import { useApi } from '@/hooks/useApi';
import { talksApi } from '@/api/talks';
import { booksApi } from '@/api/books';
import { coursesApi } from '@/api/courses';
import type { Talk, Book, Course } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleCardRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const satsangRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { data: talks } = useApi<Talk[]>(talksApi.getAll);
  const { data: books } = useApi<Book[]>(booksApi.getAll);
  const { data: coursesData } = useApi<Course[]>(coursesApi.getAll);

  const featuredTalks = (talks || []).filter(t => t.featured).slice(0, 3);
  const featuredBooks = (books || []).filter(b => b.featured).slice(0, 3);
  const upcomingCourses = (coursesData || []).filter(c => c.isActive).slice(0, 3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Section Animations
      const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      heroTl
        .from('.hero-portrait', {
          opacity: 0,
          x: '-10vw',
          scale: 0.98,
          duration: 1,
        })
        .from('.hero-headline', {
          opacity: 0,
          y: 24,
          duration: 0.8,
        }, '-=0.6')
        .from('.hero-paragraph', {
          opacity: 0,
          y: 18,
          duration: 0.8,
        }, '-=0.5')
        .from('.hero-cta', {
          opacity: 0,
          y: 14,
          duration: 0.6,
        }, '-=0.4')
        .from('.hero-label', {
          opacity: 0,
          y: -10,
          duration: 0.6,
        }, '-=0.8');

      // Hero Scroll Exit Animation
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0.7) {
            const exitProgress = (progress - 0.7) / 0.3;
            gsap.set('.hero-portrait', {
              x: -18 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.75,
              scale: 1 - exitProgress * 0.02,
            });
            gsap.set('.hero-text-block', {
              x: 12 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.8,
            });
          }
        },
      });

      // Title Card Section
      ScrollTrigger.create({
        trigger: titleCardRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          const card = titleCardRef.current?.querySelector('.title-card');
          const orbit = titleCardRef.current?.querySelector('.orbit-icon');
          const headline = titleCardRef.current?.querySelector('.title-headline');
          const subheadline = titleCardRef.current?.querySelector('.title-subheadline');
          const cta = titleCardRef.current?.querySelector('.title-cta');

          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3;
            if (card) gsap.set(card, {
              y: 100 * (1 - entranceProgress) + 'vh',
              scale: 0.92 + entranceProgress * 0.08,
              opacity: entranceProgress,
            });
            if (orbit) gsap.set(orbit, {
              y: -12 * (1 - entranceProgress) + 'vh',
              opacity: entranceProgress,
              rotate: -10 * (1 - entranceProgress),
            });
            if (headline) gsap.set(headline, {
              y: 40 * (1 - entranceProgress),
              opacity: entranceProgress,
            });
            if (subheadline) gsap.set(subheadline, {
              y: 18 * (1 - entranceProgress),
              opacity: entranceProgress,
            });
            if (cta) gsap.set(cta, {
              y: 14 * (1 - entranceProgress),
              opacity: entranceProgress,
            });
          } else if (progress <= 0.7) {
            if (card) gsap.set(card, { y: 0, scale: 1, opacity: 1 });
            if (orbit) gsap.set(orbit, { y: 0, opacity: 1, rotate: 0 });
            if (headline) gsap.set(headline, { y: 0, opacity: 1 });
            if (subheadline) gsap.set(subheadline, { y: 0, opacity: 1 });
            if (cta) gsap.set(cta, { y: 0, opacity: 1 });
          } else {
            const exitProgress = (progress - 0.7) / 0.3;
            if (card) gsap.set(card, {
              y: -70 * exitProgress + 'vh',
              scale: 1 - exitProgress * 0.04,
              opacity: 1 - exitProgress * 0.75,
            });
            if (orbit) gsap.set(orbit, {
              y: -10 * exitProgress + 'vh',
              opacity: 1 - exitProgress * 0.8,
            });
            if (headline) gsap.set(headline, {
              y: -24 * exitProgress,
              opacity: 1 - exitProgress * 0.75,
            });
          }
        },
      });

      // Featured Section (Flowing)
      gsap.from('.featured-header', {
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 80%',
          end: 'top 55%',
          scrub: 0.4,
        },
        x: '-6vw',
        opacity: 0,
      });

      gsap.from('.featured-video', {
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 75%',
          end: 'top 50%',
          scrub: 0.4,
        },
        x: '-10vw',
        opacity: 0,
        scale: 0.98,
      });

      gsap.from('.featured-article', {
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 70%',
          end: 'top 45%',
          scrub: 0.4,
        },
        x: '10vw',
        opacity: 0,
        rotateZ: 1.5,
        stagger: 0.12,
      });

      // Satsang Section
      ScrollTrigger.create({
        trigger: satsangRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          const leftCard = satsangRef.current?.querySelector('.satsang-left');
          const rightCard = satsangRef.current?.querySelector('.satsang-right');
          const content = satsangRef.current?.querySelector('.satsang-content');
          const planet = satsangRef.current?.querySelector('.satsang-planet');

          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3;
            if (leftCard) gsap.set(leftCard, {
              x: -60 * (1 - entranceProgress) + 'vw',
              opacity: entranceProgress,
            });
            if (rightCard) gsap.set(rightCard, {
              x: 60 * (1 - entranceProgress) + 'vw',
              opacity: entranceProgress,
            });
            if (content) gsap.set(content, {
              y: 24 * (1 - entranceProgress),
              opacity: entranceProgress,
            });
            if (planet) gsap.set(planet, {
              scale: 0.6 + entranceProgress * 0.4,
              opacity: entranceProgress,
            });
          } else if (progress <= 0.7) {
            if (leftCard) gsap.set(leftCard, { x: 0, opacity: 1 });
            if (rightCard) gsap.set(rightCard, { x: 0, opacity: 1 });
            if (content) gsap.set(content, { y: 0, opacity: 1 });
            if (planet) gsap.set(planet, { scale: 1, opacity: 1 });
          } else {
            const exitProgress = (progress - 0.7) / 0.3;
            if (leftCard) gsap.set(leftCard, {
              x: -18 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.75,
            });
            if (rightCard) gsap.set(rightCard, {
              x: 18 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.75,
            });
            if (content) gsap.set(content, {
              y: -12 * exitProgress,
              opacity: 1 - exitProgress * 0.75,
            });
          }
        },
      });

      // Courses Section
      ScrollTrigger.create({
        trigger: coursesRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          const leftCard = coursesRef.current?.querySelector('.courses-left');
          const rightCard = coursesRef.current?.querySelector('.courses-right');
          const list = coursesRef.current?.querySelectorAll('.courses-list-item');
          const star = coursesRef.current?.querySelector('.courses-star');

          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3;
            if (leftCard) gsap.set(leftCard, {
              x: -60 * (1 - entranceProgress) + 'vw',
              opacity: entranceProgress,
            });
            if (rightCard) gsap.set(rightCard, {
              x: 60 * (1 - entranceProgress) + 'vw',
              opacity: entranceProgress,
            });
            if (star) gsap.set(star, {
              scale: 0.6 + entranceProgress * 0.4,
              opacity: entranceProgress,
            });
            list?.forEach((item, i) => {
              gsap.set(item, {
                y: 16 * (1 - entranceProgress),
                opacity: entranceProgress,
                delay: i * 0.06,
              });
            });
          } else if (progress <= 0.7) {
            if (leftCard) gsap.set(leftCard, { x: 0, opacity: 1 });
            if (rightCard) gsap.set(rightCard, { x: 0, opacity: 1 });
            if (star) gsap.set(star, { scale: 1, opacity: 1 });
            list?.forEach((item) => gsap.set(item, { y: 0, opacity: 1 }));
          } else {
            const exitProgress = (progress - 0.7) / 0.3;
            if (leftCard) gsap.set(leftCard, {
              x: -18 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.75,
            });
            if (rightCard) gsap.set(rightCard, {
              x: 18 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.75,
            });
          }
        },
      });

      // CTA Section
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          const card = ctaRef.current?.querySelector('.cta-card');
          const headline = ctaRef.current?.querySelector('.cta-headline');
          const form = ctaRef.current?.querySelector('.cta-form');

          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3;
            if (card) gsap.set(card, {
              y: 100 * (1 - entranceProgress) + 'vh',
              scale: 0.92 + entranceProgress * 0.08,
              opacity: entranceProgress,
            });
            if (headline) gsap.set(headline, {
              y: 24 * (1 - entranceProgress),
              opacity: entranceProgress,
            });
            if (form) gsap.set(form, {
              y: 16 * (1 - entranceProgress),
              opacity: entranceProgress,
            });
          } else if (progress <= 0.7) {
            if (card) gsap.set(card, { y: 0, scale: 1, opacity: 1 });
            if (headline) gsap.set(headline, { y: 0, opacity: 1 });
            if (form) gsap.set(form, { y: 0, opacity: 1 });
          } else {
            const exitProgress = (progress - 0.7) / 0.3;
            if (card) gsap.set(card, {
              y: -40 * exitProgress + 'vh',
              opacity: 1 - exitProgress * 0.65,
            });
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative">
      {/* Section 1: Hero */}
      <section
        ref={heroRef}
        className="relative w-full h-screen bg-[#F6F7F9] grain-overlay z-10"
      >
        <div className="absolute inset-0 flex items-center px-6 lg:px-[6vw]">
          {/* Portrait Card */}
          <div className="hero-portrait absolute left-[6vw] top-[14vh] w-[40vw] h-[72vh] rounded-[28px] overflow-hidden card-shadow-light hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
              alt="Acharya Navneetji"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mobile Portrait */}
          <div className="hero-portrait lg:hidden absolute left-1/2 -translate-x-1/2 top-[12vh] w-[70vw] h-[35vh] rounded-[28px] overflow-hidden card-shadow-light">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
              alt="Acharya Navneetji"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Block */}
          <div className="hero-text-block absolute left-[6vw] lg:left-[54vw] top-[50vh] lg:top-[34vh] w-[88vw] lg:w-[38vw]">
            <span className="hero-label hidden lg:block text-xs font-semibold tracking-[0.18em] uppercase text-[#6B7280] mb-6">
              Welcome to GuZo
            </span>
            <h1 className="hero-headline font-heading text-4xl lg:text-6xl xl:text-7xl font-semibold text-[#111827] leading-[0.95] tracking-[-0.02em] mb-6">
              A space for<br />seekers.
            </h1>
            <p className="hero-paragraph text-base lg:text-lg text-[#6B7280] leading-relaxed mb-8 max-w-md">
              Guided courses, live satsang, and a community walking the path—practically, together.
            </p>
            <div className="hero-cta flex flex-wrap gap-4">
              <Link to="/courses">
                <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-6 py-5 text-sm font-medium">
                  Explore Courses
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/talks">
                <Button
                  variant="outline"
                  className="border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6] rounded-full px-6 py-5 text-sm font-medium"
                >
                  Join Satsang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Title Card */}
      <section
        ref={titleCardRef}
        className="relative w-full h-screen z-20"
      >
        <Starfield />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="title-card w-[90vw] lg:w-[86vw] h-[70vh] lg:h-[62vh] rounded-[28px] bg-[rgba(16,20,34,0.72)] border border-[rgba(255,255,255,0.08)] card-shadow-dark flex flex-col items-center justify-center p-8 lg:p-12">
            <div className="orbit-icon orbit-float mb-6 lg:mb-8">
              <OrbitIcon size={100} />
            </div>
            <h2 className="title-headline font-heading text-4xl lg:text-6xl xl:text-7xl font-semibold text-white text-center leading-[0.95] tracking-[-0.02em] mb-4 lg:mb-6">
              Guidance Zone
            </h2>
            <p className="title-subheadline text-sm lg:text-base text-[rgba(255,255,255,0.7)] text-center tracking-wide mb-8 lg:mb-10">
              Online courses · Live satsang · Practical spirituality
            </p>
            <Link to="/courses" className="title-cta">
              <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-8 py-5 text-sm font-medium">
                Start your journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Featured Content */}
      <section
        ref={featuredRef}
        className="relative w-full min-h-screen bg-[#F6F7F9] grain-overlay py-20 lg:py-32 z-30"
      >
        <div className="px-6 lg:px-[6vw]">
          {/* Header */}
          <div className="featured-header mb-12 lg:mb-16">
            <h2 className="font-heading text-3xl lg:text-5xl font-semibold text-[#111827] mb-3">
              Featured
            </h2>
            <p className="text-[#6B7280] text-base lg:text-lg">
              A few doors to open today.
            </p>
          </div>

          {/* Content Grid */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Featured Video */}
            <div className="featured-video w-full lg:w-[54vw] h-[40vh] lg:h-[56vh] rounded-[28px] overflow-hidden card-shadow-light relative group">
              <img
                src={featuredTalks[0]?.thumbnail || 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80'}
                alt="Featured teaching"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Link to="/talks">
                  <button className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#7B6CFF] flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Play className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1" fill="white" />
                  </button>
                </Link>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[rgba(255,255,255,0.7)] mb-2 block">
                  Latest teaching
                </span>
                <h3 className="font-heading text-xl lg:text-2xl font-semibold text-white mb-2">
                  {featuredTalks[0]?.title || 'The Art of Letting Go'}
                </h3>
                <Link to="/talks" className="text-sm text-[#7B6CFF] hover:underline flex items-center gap-1">
                  Watch now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Article Cards */}
            <div className="flex flex-col gap-4 lg:gap-[2.2vh] w-full lg:w-[30vw]">
              {featuredBooks.slice(0, 3).map((book) => (
                <Link
                  key={book.id}
                  to="/books"
                  className="featured-article w-full h-[16vh] rounded-[22px] bg-white border border-[rgba(0,0,0,0.06)] card-shadow-light p-5 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={book.coverImage ?? undefined}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading text-sm lg:text-base font-medium text-[#111827] truncate mb-1">
                      {book.title}
                    </h4>
                    <span className="text-xs text-[#7B6CFF] flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Read
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Live Satsang */}
      <section
        ref={satsangRef}
        className="relative w-full h-screen z-40"
      >
        <Starfield />
        <div className="absolute inset-0 flex items-center px-6 lg:px-[6vw]">
          {/* Left Info Card */}
          <div className="satsang-left w-full lg:w-[40vw] h-auto lg:h-[64vh] rounded-[28px] bg-[rgba(16,20,34,0.72)] border border-[rgba(255,255,255,0.08)] card-shadow-dark p-8 lg:p-10 flex flex-col justify-center">
            <div className="satsang-planet mb-6">
              <PlanetIcon size={64} />
            </div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4">
              Live Satsang
            </span>
            <h2 className="satsang-content font-heading text-3xl lg:text-4xl xl:text-5xl font-semibold text-white mb-4 leading-tight">
              Join the circle.
            </h2>
            <p className="text-[rgba(255,255,255,0.7)] text-base leading-relaxed mb-6 max-w-md">
              An open session on what you're carrying—and how to set it down. Bring a question, or just listen.
            </p>
            <div className="flex items-center gap-2 text-[rgba(255,255,255,0.6)] text-sm mb-8">
              <Calendar className="w-4 h-4" />
              <span>Sunday · 8:00 PM IST · Zoom</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/talks">
                <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-6 py-5 text-sm font-medium">
                  Save your seat
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] rounded-full px-6 py-5 text-sm font-medium"
              >
                Add to Calendar
              </Button>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="satsang-right hidden lg:block w-[42vw] h-[64vh] rounded-[28px] overflow-hidden card-shadow-dark ml-auto">
            <img
              src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80"
              alt="Satsang session"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Courses */}
      <section
        ref={coursesRef}
        className="relative w-full h-screen z-50"
      >
        <Starfield />
        <div className="absolute inset-0 flex items-center px-6 lg:px-[6vw]">
          {/* Left Image Card */}
          <div className="courses-left hidden lg:block w-[42vw] h-[64vh] rounded-[28px] overflow-hidden card-shadow-dark">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
              alt="Courses"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Info Card */}
          <div className="courses-right w-full lg:w-[42vw] h-auto lg:h-[64vh] rounded-[28px] bg-[rgba(16,20,34,0.72)] border border-[rgba(255,255,255,0.08)] card-shadow-dark p-8 lg:p-10 flex flex-col justify-center lg:ml-auto">
            <div className="courses-star absolute top-[22vh] right-[8vw] hidden lg:block">
              <StarIcon size={64} className="star-pulse" />
            </div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-4">
              Courses
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-semibold text-white mb-4 leading-tight">
              Go deeper.
            </h2>
            <p className="text-[rgba(255,255,255,0.7)] text-base leading-relaxed mb-8 max-w-md">
              Short, practical programs on meditation, relationships, and daily discipline—designed for busy lives.
            </p>
            <div className="space-y-4 mb-8">
              {upcomingCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses`}
                  className="courses-list-item flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors group"
                >
                  <span className="text-white text-sm font-medium">{course.title}</span>
                  <ArrowRight className="w-4 h-4 text-[#7B6CFF] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
            <Link to="/courses">
              <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-6 py-5 text-sm font-medium w-fit">
                Browse all courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Community CTA */}
      <section
        ref={ctaRef}
        className="relative w-full h-screen bg-[#F6F7F9] grain-overlay z-[60]"
      >
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="cta-card w-[90vw] lg:w-[86vw] h-[70vh] lg:h-[62vh] rounded-[28px] bg-white border border-[rgba(0,0,0,0.06)] card-shadow-light flex flex-col items-center justify-center p-8 lg:p-12 text-center">
            <div className="orbit-float mb-6 lg:mb-8">
              <OrbitIcon size={100} />
            </div>
            <h2 className="cta-headline font-heading text-3xl lg:text-5xl xl:text-6xl font-semibold text-[#111827] mb-4 leading-tight">
              Be part of the orbit.
            </h2>
            <p className="text-[#6B7280] text-base lg:text-lg mb-8 lg:mb-10 max-w-md">
              Get weekly notes, new course alerts, and satsang reminders.
            </p>
            <form className="cta-form flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-5 py-4 rounded-full border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7B6CFF] focus:border-transparent text-sm"
              />
              <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-6 py-4 text-sm font-medium whitespace-nowrap">
                Join the list
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
