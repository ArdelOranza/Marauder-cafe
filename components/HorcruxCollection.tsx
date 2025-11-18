import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { MenuItemType, MenuSectionType } from '../types';

interface HorcruxCollectionProps {
    isOpen: boolean;
    onClose: () => void;
    menuData: MenuSectionType[];
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const HorcruxItem: React.FC<{ item: MenuItemType }> = ({ item }) => {
    const { addToCart } = useCart();
    const { removeFavorite } = useFavorites();

    return (
         <div className="flex items-center justify-between py-4 border-b border-[var(--border-color)]">
            <div className="flex items-center min-w-0">
                 <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
                <div className="min-w-0">
                    <p className="font-bold text-[var(--text-color)] truncate">{item.name}</p>
                    <p className="text-sm text-[var(--text-muted-color)]">₱{item.price}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
                <button onClick={() => addToCart(item)} className="btn btn-secondary text-sm py-2 px-3 flex items-center gap-2">
                    <PlusIcon /> Add
                </button>
                <button onClick={() => removeFavorite(item.name)} className="text-red-500/70 hover:text-red-500 transition-colors p-2"><TrashIcon /></button>
            </div>
        </div>
    );
}

export const HorcruxCollection: React.FC<HorcruxCollectionProps> = ({ isOpen, onClose, menuData }) => {
    const { favoriteItems } = useFavorites();
    
    const allItems = menuData.flatMap(section => section.items);
    const favoriteMenuItems = favoriteItems.map(favName => allItems.find(item => item.name === favName)).filter((item): item is MenuItemType => !!item);

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[var(--panel-bg-color)] shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
                        <h2 className="font-magic text-2xl text-[var(--text-color)]">
                            Favorites
                        </h2>
                        <button onClick={onClose} className="text-3xl text-[var(--text-muted-color)] hover:text-white">&times;</button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-6">
                        {favoriteMenuItems.length === 0 ? (
                            <p className="text-[var(--text-muted-color)] text-center mt-8">Your favorites list is empty. Save items you love to see them here.</p>
                        ) : (
                            favoriteMenuItems.map(item => <HorcruxItem key={item.name} item={item} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};