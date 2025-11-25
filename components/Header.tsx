import React, { useState, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { HEADER_LOGO } from '../constants';

interface HeaderProps {
    onCartClick: () => void;
    onPensieveClick: () => void;
    onHorcruxClick: () => void;
    onNavigate: (page: string, params?: any) => void;
}

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const PensieveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const HorcruxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ onCartClick, onPensieveClick, onHorcruxClick, onNavigate }) => {
    const { totalItems } = useCart();
    const { favoritesCount } = useFavorites();
    const [adminClickCount, setAdminClickCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const adminClickTimer = useRef<number | null>(null);

    const handleLogoClick = () => {
        if (adminClickTimer.current) {
            window.clearTimeout(adminClickTimer.current);
        }

        const newCount = adminClickCount + 1;
        setAdminClickCount(newCount);

        if (newCount >= 5) {
            setAdminClickCount(0);
            onNavigate('admin');
        } else {
            adminClickTimer.current = window.setTimeout(() => {
                setAdminClickCount(0);
            }, 2000); // Reset after 2 seconds
        }
    };

    const navLinks = [
        { href: "#promotions", label: "Promotions" },
        { href: "#drinks", label: "Drinks" },
        { href: "#meals", label: "Meals" },
        { href: "#desserts-salads", label: "Desserts & Salads" },
        { href: "#group-packages", label: "Group Packages" },
    ];

    return (
        <header className="bg-black/55 backdrop-blur-2xl sticky top-0 z-40 border-b border-white/5 shadow-[0_12px_32px_-26px_rgba(229,181,62,0.4)]">
            <div className="container mx-auto flex justify-between items-center px-5 sm:px-8 py-3">
                <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick} title="Admin Access">
                    <img src={HEADER_LOGO} alt="Marauder's Brew Logo" className="h-10 sm:h-12 lg:h-14 hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(229,181,62,0.12)]" />
                    <h1 className="font-magic text-base sm:text-xl text-white tracking-[0.35em] hidden sm:block drop-shadow-[0_0_14px_rgba(229,181,62,0.18)]">Marauder's Brew</h1>
                </div>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1.5">
                    {navLinks.map(link => (
                        <a href={link.href} key={link.href} className="text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs font-semibold py-2 px-3.5 rounded-xl whitespace-nowrap">
                           {link.label}
                        </a>
                    ))}
                </nav>
                
                <div className="flex items-center gap-1.5">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2.5 text-slate-300 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={onHorcruxClick}
                        className="relative p-2 text-slate-400 hover:text-white transition-colors duration-200"
                        aria-label="View Favorites"
                    >
                        <HorcruxIcon />
                        {favoritesCount > 0 && (
                             <span className="absolute -top-0.5 -right-0.5 bg-[var(--glow-color)] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {favoritesCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={onPensieveClick}
                        className="relative p-2 text-slate-400 hover:text-white transition-colors duration-200"
                        aria-label="View Order History"
                    >
                        <PensieveIcon />
                    </button>
                    <button
                        onClick={onCartClick}
                        className="relative p-2 text-slate-400 hover:text-white transition-colors duration-200"
                        aria-label="Open Your Order"
                    >
                        <CartIcon />
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-[var(--glow-color)] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl">
                    <nav className="container mx-auto px-4 py-4 space-y-2">
                        {navLinks.map(link => (
                            <a 
                                key={link.href} 
                                href={link.href} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium py-3 px-4 rounded-lg"
                            >
                               {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};