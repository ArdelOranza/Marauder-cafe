import React, { useState } from 'react';
import { MenuItemType } from '../types';
import { useCart } from '../contexts/CartContext';

interface MenuItemModalProps {
    item: MenuItemType;
    onClose: () => void;
    onNavigate: (page: string, params?: any) => void;
}

const QuantitySelector: React.FC<{ quantity: number, setQuantity: (q: number) => void }> = ({ quantity, setQuantity }) => {
    const decrement = () => setQuantity(Math.max(1, quantity - 1));
    const increment = () => setQuantity(quantity + 1);

    return (
        <div className="flex items-center justify-between bg-gradient-to-r from-stone-900 to-stone-800 rounded-xl p-1.5 border border-[var(--border-color)] shadow-inner">
            <button
                onClick={decrement}
                className="px-5 py-2.5 text-xl text-slate-300 hover:bg-[var(--glow-color)] hover:text-black rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 font-bold"
                aria-label="Decrease quantity"
            >
                −
            </button>
            <span className="px-6 text-lg font-bold text-white" aria-live="polite">{quantity}</span>
            <button
                onClick={increment}
                className="px-5 py-2.5 text-xl text-slate-300 hover:bg-[var(--glow-color)] hover:text-black rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 font-bold"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose, onNavigate }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleAddToCart = () => {
        addToCart(item, quantity);
        onClose();
    };

    const handleViewDetails = () => {
        onNavigate('item', { id: item.id });
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-name"
        >
            <div className="w-full max-w-lg max-h-[90vh] glass-panel rounded-3xl shadow-2xl relative flex flex-col overflow-hidden animate-scaleIn">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-30 text-3xl text-[var(--text-muted-color)] hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 bg-black/30 hover:bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                    aria-label="Close item details"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="aspect-video w-full relative flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="absolute w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="flex-grow overflow-y-auto hide-scrollbar p-8 space-y-5">
                    <h2 id="item-name" className="font-magic text-3xl text-white leading-tight">{item.name}</h2>
                    <div className="flex items-center gap-3">
                        <p className="text-[var(--glow-color)] font-bold text-3xl">{`₱${item.price.toFixed(2)}`}</p>
                        {item.is_recommended && (
                            <span className="bg-[var(--glow-color)] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Recommended</span>
                        )}
                    </div>
                    <p className="text-[var(--text-muted-color)] text-base leading-relaxed">{item.description}</p>
                    <button
                        onClick={handleViewDetails}
                        className="inline-flex items-center gap-2 text-sm text-[var(--glow-color)] hover:text-white transition-colors group"
                    >
                        View full details
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 border-t border-[var(--border-color)] bg-gradient-to-r from-black/40 to-stone-900/40 backdrop-blur-sm mt-auto flex items-center gap-4">
                    <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                    <button
                        onClick={handleAddToCart}
                        className="group btn btn-primary flex-grow text-base py-3.5 flex items-center justify-center gap-2 shadow-[0_20px_45px_-25px_rgba(229,181,62,0.7)] hover:shadow-[0_25px_55px_-30px_rgba(229,181,62,0.9)]"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {`Add - ₱${(item.price * quantity).toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};