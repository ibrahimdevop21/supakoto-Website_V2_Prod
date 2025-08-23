import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from '../icons/LightweightIcons';
import { OptimizedImage } from './OptimizedImage';

interface CarProject {
  id: number;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  images: string[];
  location: { en: string; ar: string };
  date: string;
  carModel: { en: string; ar: string };
}

interface CarGalleryProps {
  currentLocale: string;
  isRTL: boolean;
}

const AUTOPLAY_INTERVAL = 5000; // 5 seconds

const CarGallery: React.FC<CarGalleryProps> = ({ currentLocale, isRTL }) => {
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const isArabic = currentLocale === 'ar';

  // Sample car projects - Paint Protection Film showcase
  const carProjects: CarProject[] = [
    {
      id: 1,
      title: {
        en: "BMW M5 Paint Protection Film",
        ar: "فيلم حماية الطلاء BMW M5"
      },
      description: {
        en: "Full body paint protection film installation with precision cutting and seamless application.",
        ar: "تركيب فيلم حماية الطلاء للجسم بالكامل مع القطع الدقيق والتطبيق السلس."
      },
      images: [
        "/images/ceramic-coating.webp",
        "/images/luxury-detailing.webp",
        "/images/hero.webp"
      ],
      location: { en: "Dubai Marina", ar: "دبي مارينا" },
      date: "2024-01-15",
      carModel: { en: "BMW M5 Competition", ar: "BMW M5 كومبيتيشن" }
    },
    {
      id: 2,
      title: {
        en: "Mercedes-Benz S-Class PPF",
        ar: "فيلم حماية Mercedes-Benz S-Class"
      },
      description: {
        en: "Premium paint protection film for luxury sedan with full front coverage.",
        ar: "فيلم حماية طلاء مميز للسيدان الفاخرة مع تغطية أمامية كاملة."
      },
      images: [
        "/images/luxury-detailing.webp",
        "/images/ceramic-coating.webp",
        "/images/hero.webp"
      ],
      location: { en: "Business Bay", ar: "الخليج التجاري" },
      date: "2024-01-10",
      carModel: { en: "Mercedes-Benz S-Class", ar: "Mercedes-Benz S-Class" }
    },
    {
      id: 3,
      title: {
        en: "Porsche 911 Complete Protection",
        ar: "حماية كاملة لسيارة Porsche 911"
      },
      description: {
        en: "Full body paint protection film installation for this iconic sports car.",
        ar: "تركيب فيلم حماية الطلاء للجسم الكامل لهذه السيارة الرياضية الأيقونية."
      },
      images: [
        "/images/hero.webp",
        "/images/ceramic-coating.webp",
        "/images/luxury-detailing.webp"
      ],
      location: { en: "Downtown Dubai", ar: "وسط مدينة دبي" },
      date: "2024-01-05",
      carModel: { en: "Porsche 911 Turbo S", ar: "Porsche 911 Turbo S" }
    }
  ];

  const currentProject = carProjects[selectedProject];
  const currentImage = currentProject.images[selectedImageIndex];

  // Keyboard navigation effect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLightboxOpen) {
        switch (event.key) {
          case 'Escape':
            setIsLightboxOpen(false);
            break;
          case 'ArrowLeft':
            event.preventDefault();
            prevImage();
            break;
          case 'ArrowRight':
            event.preventDefault();
            nextImage();
            break;
        }
      } else {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            prevImage();
            break;
          case 'ArrowRight':
            event.preventDefault();
            nextImage();
            break;
          case 'ArrowUp':
            event.preventDefault();
            prevProject();
            break;
          case 'ArrowDown':
            event.preventDefault();
            nextProject();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedProject, carProjects.length]);

  // Autoplay effect
  useEffect(() => {
    const tick = () => {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % currentProject.images.length);
    };

    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }

    if (!isAutoplayPaused && !isLightboxOpen) {
      autoplayTimer.current = setInterval(tick, AUTOPLAY_INTERVAL);
    }

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [selectedProject, isAutoplayPaused, isLightboxOpen, currentProject.images.length]);

  // Navigation functions for images within current project
  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % currentProject.images.length);
    // Reset autoplay timer on manual navigation
    setIsAutoplayPaused(true);
    setTimeout(() => setIsAutoplayPaused(false), AUTOPLAY_INTERVAL);
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? currentProject.images.length - 1 : prevIndex - 1
    );
    // Reset autoplay timer on manual navigation
    setIsAutoplayPaused(true);
    setTimeout(() => setIsAutoplayPaused(false), AUTOPLAY_INTERVAL);
  };

  // Navigation functions for projects
  const nextProject = () => {
    if (selectedProject < carProjects.length - 1) {
      setSelectedProject(selectedProject + 1);
      setSelectedImageIndex(0);
    }
  };

  const prevProject = () => {
    if (selectedProject > 0) {
      setSelectedProject(selectedProject - 1);
      setSelectedImageIndex(0);
    }
  };

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
    // Reset autoplay timer on manual selection
    setIsAutoplayPaused(true);
    setTimeout(() => setIsAutoplayPaused(false), AUTOPLAY_INTERVAL * 2);
  };

  return (
    <div className={`gallery-container ${isArabic ? 'rtl' : 'ltr'} animate-fadeInUp`}>
      {/* Main Image Display */}
      <div 
        className="relative w-full h-[60vh] md:h-[70vh] mb-8 rounded-xl overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 shadow-2xl cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
        onMouseEnter={() => setIsAutoplayPaused(true)}
        onMouseLeave={() => setIsAutoplayPaused(false)}
      >
        <OptimizedImage
          src={currentImage}
          key={currentImage} // Add key to trigger re-render and animation on change
          alt={currentProject.title[isArabic ? 'ar' : 'en']}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 animate-fadeIn transition-all duration-300"
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
          priority={true}
        />
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/40">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400/60 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-red-300/40 rounded-full animate-pulse delay-2000" />
        </div>
        
        {/* Image Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          aria-label={isArabic ? 'الصورة السابقة' : 'Previous image'}
          title={isArabic ? 'الصورة السابقة (←)' : 'Previous image (←)'}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-6' : 'left-6'} bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 border border-white/10 z-10 group`}
        >
          {/* In RTL, "previous" should point right, in LTR it should point left */}
          {isRTL ? <ChevronRight className="w-6 h-6 group-hover:animate-pulse transition-all duration-300 hover:scale-105" /> : <ChevronLeft className="w-6 h-6 group-hover:animate-pulse transition-all duration-300 hover:scale-105" />}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          aria-label={isArabic ? 'الصورة التالية' : 'Next image'}
          title={isArabic ? 'الصورة التالية (→)' : 'Next image (→)'}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-6' : 'right-6'} bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 border border-white/10 z-10 group`}
        >
          {/* In RTL, "next" should point left, in LTR it should point right */}
          {isRTL ? <ChevronLeft className="w-6 h-6 group-hover:animate-pulse transition-all duration-300 hover:scale-105" /> : <ChevronRight className="w-6 h-6 group-hover:animate-pulse transition-all duration-300 hover:scale-105" />}
        </button>
        
        {/* Image Counter */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>{selectedImageIndex + 1} / {currentProject.images.length}</span>
          </div>
        </div>
        
        {/* Keyboard Hints */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs opacity-70 border border-white/10">
          {isArabic ? 'استخدم الأسهم للتنقل' : 'Use arrow keys to navigate'}
        </div>
        
        {/* Decorative accent line */}
        <div className={`absolute top-1/2 ${isRTL ? 'left-4' : 'right-4'} transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-red-500 to-red-700 rounded-full opacity-60`} />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex justify-center gap-4 mb-8 animate-fadeInUp delay-200">
        <div className="flex gap-3 p-2 rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-800 border border-neutral-700/50 shadow-inner">

        {currentProject.images.map((image, index) => (
          <div
            key={index}
            onClick={() => selectImage(index)}
            className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out group/thumb
              ${selectedImageIndex === index 
                ? 'border-2 border-rose-500 shadow-[0_0_15px_rgba(255,0,92,0.5)] scale-105'
                : 'border-2 border-transparent hover:border-neutral-600 hover:scale-105 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]'
              }`}
          >
            <OptimizedImage
              src={image}
              alt={`${currentProject.title[isArabic ? 'ar' : 'en']} - ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
              width={120}
              height={80}
              priority={false}
              sizes="120px"
            />
            <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/10 transition-colors duration-300" />
            {selectedImageIndex === index && (
              <div className="absolute inset-0 border-2 border-rose-500 rounded-xl bg-black/40" />
            )}
            <div className="absolute bottom-1 right-1 text-white text-xs font-bold drop-shadow-lg p-1 bg-black/20 rounded">
              プロテクション
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Project Information */}
      <div className={`bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl animate-fadeInUp delay-400 ${isArabic ? 'text-right' : 'text-left'} relative overflow-hidden`}>
        {/* Project Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-red-500/40">
            <span className="text-red-300 text-sm font-medium">
              {isArabic ? 'مشروع مميز' : 'Featured Project'}
            </span>
          </div>
        </div>
        
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white leading-tight ${isArabic ? 'font-arabic' : ''}`}>
          {currentProject.title[isArabic ? 'ar' : 'en']}
        </h2>
        
        <p className={`text-lg text-gray-300 mb-6 leading-relaxed ${isArabic ? 'font-arabic' : ''}`}>
          {currentProject.description[isArabic ? 'ar' : 'en']}
        </p>
        
        {/* Features/Details */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/10">
            <MapPin className="w-4 h-4 mr-2 text-red-400" />
            <span className={`text-sm font-medium ${isArabic ? 'font-arabic' : ''}`}>
              {currentProject.location[isArabic ? 'ar' : 'en']}
            </span>
          </div>
          
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/10">
            <Calendar className="w-4 h-4 mr-2 text-red-400" />
            <span className="text-sm font-medium">
              {new Date(currentProject.date).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US')}
            </span>
          </div>
          
          <div className={`bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/10 font-medium ${isArabic ? 'font-arabic' : ''}`}>
            {currentProject.carModel[isArabic ? 'ar' : 'en']}
          </div>
        </div>
        
        {/* Project Navigation Section */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          {/* Project Navigation Controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevProject}
              disabled={selectedProject === 0}
              className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              {/* In RTL, "previous" should point right, in LTR it should point left */}
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span className={`text-sm font-medium ${isArabic ? 'font-arabic' : ''}`}>
                {isArabic ? 'المشروع السابق' : 'Previous Project'}
              </span>
            </button>
            
            <div className={`text-center ${isArabic ? 'font-arabic' : ''}`}>
              <div className="text-sm text-gray-400 mb-1">
                {isArabic ? 'مشروع' : 'Project'}
              </div>
              <div className="text-2xl font-bold text-white">
                {selectedProject + 1} / {carProjects.length}
              </div>
            </div>
            
            <button
              onClick={nextProject}
              disabled={selectedProject === carProjects.length - 1}
              className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <span className={`text-sm font-medium ${isArabic ? 'font-arabic' : ''}`}>
                {isArabic ? 'المشروع التالي' : 'Next Project'}
              </span>
              {/* In RTL, "next" should point left, in LTR it should point right */}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Project Progress Bar */}
          <div className="mb-4">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
                style={{ width: `${((selectedProject + 1) / carProjects.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Project Navigation Dots */}
          <div className="flex justify-center gap-3">
            {carProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedProject(index);
                  setSelectedImageIndex(0);
                }}
                className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 border-2 ${
                  selectedProject === index 
                    ? 'bg-red-500 border-red-500 shadow-lg shadow-red-500/30' 
                    : 'bg-transparent border-gray-600 hover:border-gray-400 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img 
              src={currentImage} 
              alt={currentProject.title[isArabic ? 'ar' : 'en']}
              className="w-full h-full object-contain rounded-lg shadow-2xl shadow-red-500/20"
              width="1200"
              height="800"
            />
            <button 
              onClick={() => setIsLightboxOpen(false)} 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors transition-all duration-300 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarGallery;
