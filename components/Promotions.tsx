import React, { useState, useEffect, useCallback } from 'react';
import { PromotionType } from '../types';

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

interface PromotionsProps {
    promotions: PromotionType[];
}

export const Promotions: React.FC<PromotionsProps> = ({ promotions }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === promotions.length - 1 ? 0 : prev + 1));
    }, [promotions.length]);

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? promotions.length - 1 : prev - 1));
    };

    useEffect(() => {
        if(promotions.length > 1) {
            const slideInterval = setInterval(nextSlide, 5000);
            return () => clearInterval(slideInterval);
        }
    }, [nextSlide, promotions.length]);

    if (!promotions || promotions.length === 0) {
        return null;
    }

    return (
        <section id="promotions" className="py-24 px-4 scroll-mt-24">
            <div className="container mx-auto">
                 <div className="text-center mb-16">
                    <h2 className="font-magic text-4xl md:text-5xl text-[var(--text-color)]">What We Offer</h2>
                    <p className="text-[var(--text-muted-color)] mt-4 max-w-2xl mx-auto">Discover our latest promotions and special offers, crafted just for you.</p>
                </div>
                <div className="relative max-w-5xl mx-auto">
                    <div className="overflow-hidden relative rounded-2xl shadow-2xl shadow-amber-900/20">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {promotions.map((promo, index) => (
                                <div key={index} className="w-full flex-shrink-0 relative min-h-[450px] flex flex-col justify-end items-center text-center bg-cover bg-center" style={{backgroundImage: `url(${promo.image})`}}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="relative z-10 p-8 md:p-12">
                                        <h3 className="font-magic text-3xl md:text-4xl text-[var(--glow-color)] font-bold mb-3">{promo.name}</h3>
                                        <p className="text-slate-200 mb-4 max-w-2xl">{promo.description}</p>
                                        <p className="font-magic text-white text-xl italic mt-4">"{promo.tagline}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {promotions.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full focus:outline-none transition-all z-10 border border-white/20 hover:border-white/40"
                                aria-label="Previous promotion"
                            >
                                <ChevronLeftIcon />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full focus:outline-none transition-all z-10 border border-white/20 hover:border-white/40"
                                aria-label="Next promotion"
                            >
                                <ChevronRightIcon />
                            </button>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {promotions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-[var(--glow-color)]' : 'bg-stone-600/70'} transition-all duration-300`}
                                        aria-label={`Go to promotion ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};