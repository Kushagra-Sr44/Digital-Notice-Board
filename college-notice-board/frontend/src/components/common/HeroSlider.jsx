import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CategoryBadge from '../common/CategoryBadge';

Swiper.use([Navigation, Pagination, Autoplay]);

const slides = [
  {
    id: 1,
    category: 'Academic',
    title: 'Annual Examination Schedule 2024–25 Released',
    description: 'The examination committee has published the complete schedule for semester-end examinations. Students are advised to check their hall ticket details and report 30 minutes early.',
    gradient: 'from-primary-800 to-primary-600',
    date: 'Jun 20, 2025',
    emoji: '📅',
  },
  {
    id: 2,
    category: 'Event',
    title: 'National Science & Technology Symposium — Register Now',
    description: 'Join us for a two-day symposium featuring keynote speakers, workshops, and project exhibitions. Open to students from all departments.',
    gradient: 'from-indigo-800 to-purple-600',
    date: 'Jun 18, 2025',
    emoji: '🔬',
  },
  {
    id: 3,
    category: 'Sports',
    title: 'Inter-College Sports Meet 2025 — Nominations Open',
    description: 'Students interested in representing the college in athletics, cricket, basketball, and kabaddi are invited to submit nominations through the sports office by June 30.',
    gradient: 'from-emerald-800 to-teal-600',
    date: 'Jun 15, 2025',
    emoji: '🏆',
  },
];

export default function HeroSlider() {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiper = new Swiper(swiperRef.current, {
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
    return () => swiper.destroy();
  }, []);

  return (
    <div className="swiper mt-16" ref={swiperRef}>
      <div className="swiper-wrapper">
        {slides.map((slide) => (
          <div key={slide.id} className="swiper-slide">
            <div className={`bg-gradient-to-br ${slide.gradient} min-h-[480px] md:min-h-[560px] flex items-center relative overflow-hidden`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-20 w-48 h-48 bg-white rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-white rounded-full opacity-20" />
              </div>

              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 relative z-10 w-full">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl">{slide.emoji}</span>
                    <CategoryBadge label={slide.category} />
                    <span className="flex items-center gap-1.5 text-white/70 text-sm">
                      <FaCalendarAlt className="text-xs" /> {slide.date}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight mb-5">
                    {slide.title}
                  </h2>
                  <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/announcements" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl">
                      Read More <FaArrowRight className="text-sm" />
                    </Link>
                    <Link to="/notices" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl backdrop-blur-sm transition-all border border-white/30">
                      View Notices
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="swiper-pagination" />
      <div className="swiper-button-next" />
      <div className="swiper-button-prev" />
    </div>
  );
}
