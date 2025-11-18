import React from 'react';
import { CAFE_INFO, CAFE_LOGO } from '../constants';

const InstagramIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.314.935 20.644.523 19.86.218 19.095-.08 18.225-.282 16.947-.34C15.667-.398 15.26-.413 12-.413h0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.056 1.17-.249 1.805-.415 2.227a3.48 3.48 0 01-.896 1.382c-.42.419-.82.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.85-.074c-1.17-.056-1.805-.249-2.227-.415a3.49 3.49 0 01-1.382-.896c-.42-.42-.679-.82-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.074-4.85c.056-1.17.249-1.805.415-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zm0 3.882c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

interface FooterProps {
    onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { label: 'Promotions', href: '#promotions' },
        { label: 'Drinks', href: '#drinks' },
        { label: 'Meals', href: '#meals' },
        { label: 'Desserts & Salads', href: '#desserts-salads' },
        { label: 'Group Packages', href: '#group-packages' }
    ];

    const guestServices = [
        { label: 'Order Tracker', action: () => onNavigate('home') },
        { label: 'View Favourites', action: () => onNavigate('home') },
        { label: 'Admin Portal', action: () => onNavigate('admin') }
    ];

    const visitingHours = [
        { day: 'Monday - Thursday', time: '8:00 AM – 10:00 PM' },
        { day: 'Friday - Saturday', time: '8:00 AM – 12:00 MN' },
        { day: 'Sunday', time: '9:00 AM – 9:00 PM' }
    ];

    const handleBackToTop = () => {
        onNavigate('home');
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    return (
        <footer className="relative mt-32 border-t border-white/5 bg-gradient-to-br from-black via-stone-950 to-black">
            <div className="relative z-10">

                <div className="py-16">
                    <div className="mx-auto w-full max-w-7xl px-0 space-y-14">
                        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 px-6 sm:px-8 lg:px-10">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-3">
                                    <img src={CAFE_LOGO} alt="Marauder's Brew Logo" className="h-10 w-10 object-contain" />
                                    <h3 className="font-semibold text-xl text-white">Marauder's Brew</h3>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                    Experience artistry and flavor in every cup and plate.
                                </p>
                                <div className="flex items-center gap-3">
                                    {[CAFE_INFO.social.instagram, CAFE_INFO.social.facebook, CAFE_INFO.social.twitter].map((link, index) => {
                                        const Icon = [InstagramIcon, FacebookIcon, TwitterIcon][index];
                                        const labels = ['Instagram', 'Facebook', 'Twitter'];
                                        return (
                                            <a
                                                key={link}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all duration-200 hover:bg-[var(--glow-color)] hover:text-black"
                                                aria-label={labels[index]}
                                            >
                                                <Icon />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-white font-semibold text-sm">Quick Links</h4>
                                <ul className="space-y-2.5">
                                    {quickLinks.map(link => (
                                        <li key={link.href}>
                                            <a href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-white font-semibold text-sm">Visit Us</h4>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-slate-500 text-xs mb-1 uppercase tracking-[0.2em]">Operating Hours</p>
                                        <p className="text-[var(--glow-color)] text-xs font-semibold">{CAFE_INFO.operatingHours.notice}</p>
                                        <p className="text-slate-300">{CAFE_INFO.operatingHours.schedule}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs mb-1 uppercase tracking-[0.2em]">Location</p>
                                        <p className="text-slate-300 leading-relaxed">{CAFE_INFO.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs mb-1 uppercase tracking-[0.2em]">Contact</p>
                                        <p className="text-slate-300">{CAFE_INFO.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div className="w-full px-6 sm:px-8 lg:px-10">
                            <h4 className="text-white font-semibold text-sm mb-4">Find Us</h4>
                            <div className="rounded-xl overflow-hidden border border-white/5 h-96">
                                <iframe
                                    src={CAFE_INFO.mapsEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Marauder's Brew Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5">
                    <div className="mx-auto w-full max-w-7xl px-0 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-2 px-6 sm:px-8 lg:px-10">
                            <span>&copy; {currentYear} Marauder's Brew. All rights reserved.</span>
                        </div>
                        <button onClick={handleBackToTop} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 pr-6 sm:pr-8 lg:pr-10">
                            Back to top <span>↑</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};