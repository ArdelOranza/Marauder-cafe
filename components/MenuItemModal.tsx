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
        <div className="flex items-center justify-between bg-stone-900 rounded-lg p-1 border border-[var(--border-color)]">
            <button onClick={decrement} className="px-4 py-2 text-xl text-slate-300 hover:bg-stone-700 rounded-md transition-colors" aria-label="Decrease quantity">-</button>
            <span className="px-4 text-lg font-bold text-white" aria-live="polite">{quantity}</span>
            <button onClick={increment} className="px-4 py-2 text-xl text-slate-300 hover:bg-stone-700 rounded-md transition-colors" aria-label="Increase quantity">+</button>
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
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fadeIn"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-name"
        >
            <div className="w-full max-w-lg max-h-[90vh] glass-panel rounded-2xl shadow-2xl relative flex flex-col overflow-hidden animate-fadeInUp">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-3xl text-[var(--text-muted-color)] hover:text-white z-20"
                    aria-label="Close item details"
                >&times;</button>
                
                <div className="aspect-video w-full relative flex-shrink-0">
                     <img src={item.image} alt={item.name} className="absolute w-full h-full object-cover" />
                </div>

                <div className="flex-grow overflow-y-auto hide-scrollbar p-8 space-y-4">
                    <h2 id="item-name" className="font-magic text-3xl text-white">{item.name}</h2>
                    <p className="text-[var(--glow-color)] font-bold text-2xl">{`₱${item.price.toFixed(2)}`}</p>
                    <p className="text-[var(--text-muted-color)] text-base leading-relaxed line-clamp-3">{item.description}</p>
                    <button onClick={handleViewDetails} className="text-sm text-[var(--glow-color)] hover:underline">
                        View full details &rarr;
                    </button>
                </div>

                <div className="p-6 border-t border-[var(--border-color)] bg-black/20 mt-auto flex items-center gap-4">
                    <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                    <button onClick={handleAddToCart} className="btn btn-primary flex-grow text-base">
                        {`Add - ₱${(item.price * quantity).toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};