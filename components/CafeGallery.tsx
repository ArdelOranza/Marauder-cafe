import React, { useState, useRef, useEffect } from 'react';
import { GALLERY_IMAGES, GalleryImage } from '../constants';

const categories = ['All', 'Ambiance', 'Drinks', 'Events'];

interface CafeGalleryProps {
    images: GalleryImage[];
}

export const CafeGallery: React.FC<CafeGalleryProps> = ({ images }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const gallerySource = images.length > 0 ? images : GALLERY_IMAGES;

    const filteredImages = selectedCategory === 'All'
        ? gallerySource
        : gallerySource.filter(img => img.category === selectedCategory);

    useEffect(() => {
        if (selectedIndex === null) {
            return;
        }

        if (!filteredImages.length) {
            setSelectedIndex(null);
            return;
        }

        if (selectedIndex > filteredImages.length - 1) {
            setSelectedIndex(filteredImages.length - 1);
        }
    }, [filteredImages, selectedIndex]);

    useEffect(() => {
        if (selectedIndex === null) {
            document.body.classList.remove('overflow-hidden');
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedIndex(null);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                handleNavigate('next');
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                handleNavigate('prev');
            }
        };

        document.body.classList.add('overflow-hidden');
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.classList.remove('overflow-hidden');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 600;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleNavigate = (direction: 'next' | 'prev') => {
        if (selectedIndex === null || !filteredImages.length) {
            return;
        }

        setSelectedIndex(prev => {
            if (prev === null) {
                return prev;
            }

            const delta = direction === 'next' ? 1 : -1;
            const nextIndex = (prev + delta + filteredImages.length) % filteredImages.length;
            return nextIndex;
        });
    };

    const currentImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

    return (
        <section id="gallery" className="py-32 px-4 scroll-mt-24 bg-black relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black opacity-90"></div>
            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="font-magic text-6xl md:text-7xl text-white mb-6 tracking-tight">
                        Café Gallery
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[var(--glow-color)] to-yellow-600 rounded-full mx-auto mb-6"></div>
                    <p className="text-slate-400 max-w-2xl mx-auto text-base">
                        Step into our world of comfort, creativity, and culinary excellence
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((category, idx) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 animate-fadeInUp ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-[var(--glow-color)] to-yellow-600 text-black shadow-[0_20px_45px_-25px_rgba(229,181,62,0.7)] scale-110'
                                    : 'bg-black border-2 border-[var(--glow-color)]/30 text-slate-300 hover:border-[var(--glow-color)] hover:text-[var(--glow-color)] hover:scale-105'
                                }`}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Carousel */}
                <div className="relative group">
                    {/* Navigation Arrows */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/90 hover:bg-[var(--glow-color)] text-white p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-6 group-hover:translate-x-0 shadow-2xl border border-[var(--glow-color)]/30 hover:scale-110 transform-gpu"
                        aria-label="Scroll left"
                        style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/90 hover:bg-[var(--glow-color)] text-white p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-6 group-hover:translate-x-0 shadow-2xl border border-[var(--glow-color)]/30 hover:scale-110 transform-gpu"
                        aria-label="Scroll right"
                        style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Carousel Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar scroll-smooth snap-x snap-mandatory"
                    >
                        {filteredImages.map((image, index) => (
                            <div
                                key={image.id}
                                onClick={() => setSelectedIndex(index)}
                                className="group/item relative overflow-hidden rounded-3xl cursor-pointer bg-black border-2 border-[var(--border-color)] hover:border-[var(--glow-color)] transition-all duration-500 flex-shrink-0 w-[360px] h-[240px] snap-start transform-gpu hover:scale-[1.03] hover:shadow-[0_20px_50px_-30px_rgba(229,181,62,0.6)] animate-fadeInUp"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover/item:scale-115 group-hover/item:brightness-75"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-500">
                                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                                        <p className="text-white font-bold text-xl mb-2 line-clamp-1">{image.title}</p>
                                        <p className="text-[var(--glow-color)] text-sm font-semibold uppercase tracking-[0.35em]">{image.category}</p>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform group-hover/item:scale-110">
                                    <div className="bg-[var(--glow-color)] text-black rounded-full p-3 shadow-2xl">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lightbox Modal */}
                {currentImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-fadeIn"
                        onClick={() => setSelectedIndex(null)}
                    >
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-8 right-10 bg-white/10 hover:bg-[var(--glow-color)]/90 text-white p-3 rounded-full transition-all duration-300 shadow-[0_30px_80px_-40px_rgba(229,181,62,0.6)] hover:rotate-90 hover:scale-110 transform-gpu"
                            aria-label="Close"
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="relative w-full max-w-6xl" onClick={e => e.stopPropagation()}>
                            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-black/40 shadow-[0_45px_120px_-50px_rgba(0,0,0,0.9)]">
                                <div className="absolute inset-0 opacity-40">
                                    <img src={currentImage.url} alt="" className="h-full w-full object-cover blur-3xl scale-110" />
                                </div>
                                <div className="relative flex flex-col lg:flex-row gap-6 p-6 lg:p-10">
                                    <div className="flex-1 flex items-center justify-center bg-black/30 rounded-3xl border border-white/10 min-h-[280px]">
                                        <img
                                            src={currentImage.url}
                                            alt={currentImage.title}
                                            className="max-h-[70vh] w-full object-contain rounded-2xl shadow-[0_30px_90px_-50px_rgba(229,181,62,0.45)]"
                                        />
                                    </div>
                                    <div className="w-full lg:w-[320px] flex flex-col justify-between gap-6">
                                        <div className="space-y-3">
                                            <p className="inline-flex items-center gap-2 text-[9px] tracking-[0.5em] uppercase text-[var(--glow-color)]/70">
                                                {currentImage.category}
                                                <span className="h-[1px] w-10 bg-[var(--glow-color)]/40" />
                                                Gallery Highlight
                                            </p>
                                            <h3 className="font-magic text-3xl text-white leading-tight">{currentImage.title}</h3>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                Immerse yourself in the atmosphere of Marauder&apos;s Brew. Swipe or use the arrows to explore every angle of our enchanted café.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <button
                                                onClick={() => handleNavigate('prev')}
                                                className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--glow-color)] hover:text-[var(--glow-color)]"
                                                aria-label="Previous image"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => handleNavigate('next')}
                                                className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/90 px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-white"
                                                aria-label="Next image"
                                            >
                                                Next
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                {filteredImages.map((image, thumbIndex) => (
                                    <button
                                        key={`thumb-${image.id}`}
                                        onClick={() => setSelectedIndex(thumbIndex)}
                                        className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-2xl border transition-all transform-gpu ${thumbIndex === selectedIndex
                                                ? 'border-[var(--glow-color)]/80 shadow-[0_18px_35px_-20px_rgba(229,181,62,0.7)] scale-110'
                                                : 'border-white/10 hover:border-[var(--glow-color)]/40 hover:scale-105'
                                            }`}
                                    >
                                        <img src={image.url} alt={image.title} className="h-full w-full object-cover" />
                                        <span className="absolute inset-x-2 bottom-2 truncate text-xs font-semibold text-white/90 drop-shadow">{image.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
