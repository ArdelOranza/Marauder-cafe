import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CAFE_LOGO } from '../constants';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady?: () => void;
        _heroYouTubeAPILoadPromise?: Promise<void>;
    }
}

interface HeroProps {
    mediaType: 'video' | 'image';
    videoUrl: string;
    posterUrl: string;
    imageUrl: string;
    tagline: string;
}

const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]\S*)?/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const loadYouTubeIframeAPI = (): Promise<void> => {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.YT && window.YT.Player) {
        return Promise.resolve();
    }
    if (!window._heroYouTubeAPILoadPromise) {
        window._heroYouTubeAPILoadPromise = new Promise<void>((resolve) => {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag?.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            } else {
                document.body.appendChild(tag);
            }
            const previousCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                previousCallback?.();
                resolve();
            };
        });
    }
    return window._heroYouTubeAPILoadPromise;
};

export const Hero: React.FC<HeroProps> = ({ mediaType, videoUrl, posterUrl, imageUrl, tagline }) => {
    const [scrollY, setScrollY] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const playerContainerId = useMemo(() => `hero-player-${Math.random().toString(36).slice(2)}`, []);

    useEffect(() => {
        const handleScroll = () => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const scrolled = window.scrollY;
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    setScrollY(scrolled);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mediaType !== 'video') {
            return () => { };
        }

        let isMounted = true;
        let resizeBound = false;

        const adjustPlayerSize = () => {
            if (typeof window === 'undefined') return;
            const iframe = playerRef.current?.getIframe?.();
            if (!iframe) return;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const videoRatio = 16 / 9;
            const viewportRatio = viewportWidth / viewportHeight;

            let width: number;
            let height: number;

            if (viewportRatio > videoRatio) {
                width = viewportWidth;
                height = viewportWidth / videoRatio;
            } else {
                width = viewportHeight * videoRatio;
                height = viewportHeight;
            }

            iframe.style.width = `${width}px`;
            iframe.style.height = `${height}px`;
            iframe.style.position = 'absolute';
            iframe.style.top = '50%';
            iframe.style.left = '50%';
            iframe.style.transform = 'translate(-50%, -50%)';
            iframe.style.pointerEvents = 'none';
        };

        const initializePlayer = async () => {
            const videoId = getYouTubeVideoId(videoUrl);
            if (!videoId) {
                console.warn('Invalid YouTube URL provided for hero background.');
                return;
            }
            await loadYouTubeIframeAPI();
            if (!isMounted || !window.YT) return;

            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }

            playerRef.current = new window.YT.Player(playerContainerId, {
                videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    loop: 1,
                    playlist: videoId,
                    fs: 0,
                    cc_load_policy: 0,
                    iv_load_policy: 3,
                    disablekb: 1,
                    playsinline: 1,
                    rel: 0,
                    mute: 1
                },
                events: {
                    onReady: (event: any) => {
                        event.target.mute();
                        event.target.playVideo();
                        if (!isMounted) return;
                        setIsPlayerReady(true);
                        setIsMuted(true);
                        adjustPlayerSize();
                        if (!resizeBound) {
                            window.addEventListener('resize', adjustPlayerSize);
                            resizeBound = true;
                        }
                    },
                    onStateChange: (event: any) => {
                        // Restart playback if it ends unexpectedly
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.playVideo();
                        }
                    }
                }
            });
        };

        initializePlayer();

        return () => {
            isMounted = false;
            if (resizeBound) {
                window.removeEventListener('resize', adjustPlayerSize);
            }
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [mediaType, videoUrl, playerContainerId]);

    const handleToggleMute = () => {
        if (!playerRef.current || !isPlayerReady) return;
        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const parallaxOffset = scrollY * 0.5;
    const opacityValue = Math.max(1 - scrollY / 600, 0);
    const scaleValue = 1 + scrollY / 3000;

    return (
        <div
            ref={heroRef}
            className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden"
        >
            {/* Parallax Media Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    transform: `translateY(${parallaxOffset}px) scale(${scaleValue})`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                {mediaType === 'video' ? (
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            id={playerContainerId}
                            className="absolute inset-0 pointer-events-none"
                        />
                    </div>
                ) : (
                    <img
                        key={imageUrl}
                        src={imageUrl}
                        alt="Cafe ambiance"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Gradient Overlays */}
            {mediaType === 'image' && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 z-[1]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20 z-[2]"></div>
                </>
            )}

            {/* Content with Parallax */}
            <div
                className="relative z-10 p-4 flex flex-col items-center max-w-5xl mx-auto"
                style={{
                    transform: `translateY(${-parallaxOffset * 0.3}px)`,
                    opacity: opacityValue,
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
                }}
            >
                {/* Logo with Enhanced Animation */}
                <div className="overflow-hidden mb-12 flex flex-col items-center gap-6">
                    <img
                        src={CAFE_LOGO}
                        alt="Marauder's Brew Cafe"
                        className="w-full max-w-2xl md:max-w-4xl animate-fadeInUp hover:scale-105 transition-transform duration-500 animate-float transform-gpu"
                        style={{ animationDelay: '0.2s', filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.3))' }}
                    />
                </div>

                {/* Tagline */}
                <div className="overflow-hidden mb-12">
                    <p
                        className="text-xl md:text-3xl text-amber-300 font-light animate-fadeInUp tracking-wide"
                        style={{ animationDelay: '0.5s', textShadow: '0 0 20px rgba(212, 175, 55, 0.4)' }}
                    >
                        {tagline}
                    </p>
                </div>

                {/* CTA Buttons */}
                <div
                    className="flex flex-col sm:flex-row gap-5 animate-fadeInUp"
                    style={{ animationDelay: '1.1s' }}
                >
                    <a
                        href="#promotions"
                        className="group btn btn-primary px-10 py-4 text-lg font-bold shadow-[0_25px_60px_-25px_rgba(212,175,55,0.7)] hover:shadow-[0_35px_80px_-30px_rgba(212,175,55,0.9)] flex items-center justify-center gap-2"
                    >
                        Explore Menu
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                    <a
                        href="#gallery"
                        className="group btn btn-secondary px-10 py-4 text-lg font-bold backdrop-blur-md flex items-center justify-center gap-2"
                    >
                        View Gallery
                        <svg className="w-5 h-5 transition-all group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-pulse"
                style={{ opacity: opacityValue }}
            >
                <p className="text-xs text-amber-300/80 uppercase tracking-[0.3em] font-semibold">Scroll Down</p>
                <svg
                    className="w-6 h-6 text-amber-300 animate-bounce"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </div>

            {mediaType === 'video' && (
                <div className="absolute top-8 right-8 z-20">
                    <button
                        type="button"
                        onClick={handleToggleMute}
                        disabled={!isPlayerReady}
                        className={`flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] transition-all ${isPlayerReady ? 'hover:border-white/40 hover:bg-black/60 text-white' : 'text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        <span className="inline-flex items-center justify-center w-5 h-5">
                            {isMuted ? (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15.54 8.46a5 5 0 010 7.07" />
                                    <path d="M17.94 5.94a8 8 0 010 11.31" />
                                    <path d="M3 9v6h3l4 4V5L6 9H3z" />
                                    <line x1="23" y1="1" x2="1" y2="23" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 5L6 9H3v6h3l5 4V5z" />
                                    <path d="M19 5a9 9 0 010 14" />
                                </svg>
                            )}
                        </span>
                        <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};