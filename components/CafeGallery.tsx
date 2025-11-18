import React, { useState, useRef } from 'react';
import { GALLERY_IMAGES, GalleryImage } from '../constants';

const categories = ['All', 'Ambiance', 'Drinks', 'Events'];

interface CafeGalleryProps {
    images: GalleryImage[];
}

export const CafeGallery: React.FC<CafeGalleryProps> = ({ images }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const gallerySource = images.length > 0 ? images : GALLERY_IMAGES;

    const filteredImages = selectedCategory === 'All' 
        ? gallerySource
        : gallerySource.filter(img => img.category === selectedCategory);
    
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 600;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="gallery" className="py-32 px-4 scroll-mt-24 bg-black relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black opacity-90"></div>
            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="font-magic text-6xl md:text-7xl text-white mb-6 tracking-tight">
                        Café Gallery
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[var(--glow-color)] to-yellow-600 rounded-full mx-auto mb-6"></div>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Step into our world of comfort, creativity, and culinary excellence
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                                selectedCategory === category
                                    ? 'bg-gradient-to-r from-[var(--glow-color)] to-yellow-600 text-black shadow-2xl shadow-[var(--glow-color)]/50 scale-105'
                                    : 'bg-black border-2 border-[var(--glow-color)]/30 text-slate-300 hover:border-[var(--glow-color)] hover:text-[var(--glow-color)]'
                            }`}
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
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/90 hover:bg-[var(--glow-color)] text-white p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-6 group-hover:translate-x-0 shadow-2xl border border-[var(--glow-color)]/30"
                        aria-label="Scroll left"
                    >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/90 hover:bg-[var(--glow-color)] text-white p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-6 group-hover:translate-x-0 shadow-2xl border border-[var(--glow-color)]/30"
                        aria-label="Scroll right"
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
                                onClick={() => setSelectedImage(image)}
                                className="group/item relative overflow-hidden rounded-3xl cursor-pointer bg-black border-2 border-[var(--border-color)] hover:border-[var(--glow-color)] transition-all duration-500 flex-shrink-0 w-[400px] h-[400px] snap-start"
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover/item:scale-110 group-hover/item:brightness-75"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-500">
                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                                        <p className="text-white font-bold text-2xl mb-3">{image.title}</p>
                                        <p className="text-[var(--glow-color)] text-base font-semibold uppercase tracking-wider">{image.category}</p>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
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
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/98 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 bg-black/50 hover:bg-[var(--glow-color)] text-white p-3 rounded-full transition-all duration-300 shadow-2xl"
                            aria-label="Close"
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="max-w-6xl w-full" onClick={e => e.stopPropagation()}>
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.title}
                                className="w-full h-auto rounded-3xl shadow-2xl shadow-[var(--glow-color)]/30 animate-fadeIn border border-[var(--glow-color)]/20"
                            />
                            <div className="text-center mt-8">
                                <h3 className="text-white font-magic text-4xl mb-3">{selectedImage.title}</h3>
                                <p className="text-[var(--glow-color)] text-xl font-semibold">{selectedImage.category}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
