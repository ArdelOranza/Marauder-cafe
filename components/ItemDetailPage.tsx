import React, { useState } from 'react';
import { MenuItemType, MenuSectionType, PromotionType } from '../types';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { PROMOTIONS } from '../constants';

// --- ICONS ---
const FavoriteIconFilled = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const FavoriteIconOutline = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

const QuantitySelector: React.FC<{ quantity: number, setQuantity: (q: number) => void }> = ({ quantity, setQuantity }) => {
    const decrement = () => setQuantity(Math.max(1, quantity - 1));
    const increment = () => setQuantity(quantity + 1);

    return (
        <div className="flex items-center justify-between bg-stone-900 border border-[var(--border-color)] rounded-lg p-1">
            <button onClick={decrement} className="px-4 py-2 text-xl text-slate-300 hover:bg-stone-700 rounded-md transition-colors" aria-label="Decrease quantity">-</button>
            <span className="px-4 text-lg font-bold text-white" aria-live="polite">{quantity}</span>
            <button onClick={increment} className="px-4 py-2 text-xl text-slate-300 hover:bg-stone-700 rounded-md transition-colors" aria-label="Increase quantity">+</button>
        </div>
    );
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean }> = ({ title, children, icon, collapsible = false, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const HeaderWrapper = collapsible ? 'button' : 'div';
    const headerProps = collapsible
        ? { type: 'button', onClick: () => setIsOpen(prev => !prev) }
        : {};

    return (
        <div className="relative group rounded-3xl border border-white/10 bg-white/[0.035] overflow-hidden backdrop-blur-sm shadow-[0_30px_80px_-40px_rgba(0,0,0,0.85)]">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[var(--glow-color)]/12 via-transparent to-transparent" />
            <HeaderWrapper
                {...headerProps}
                className={`relative z-10 w-full flex items-center justify-between px-6 py-5 ${
                    collapsible ? 'cursor-pointer transition-colors duration-300 hover:bg-white/[0.05]' : ''
                }`}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--glow-color)]/10 text-[var(--glow-color)]">
                            {icon}
                        </span>
                    )}
                    <h3 className="font-semibold text-base text-white tracking-wide">{title}</h3>
                </div>
                {collapsible && (
                    <svg
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </HeaderWrapper>
            {(isOpen || !collapsible) && (
                <div className="relative z-10 px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed">{children}</div>
            )}
        </div>
    );
};

const SuggestedItemCard: React.FC<{item: MenuItemType, onNavigate: (page: string, params?: any) => void;}> = ({item, onNavigate}) => {
    return (
        <div 
            onClick={() => onNavigate('item', { id: item.id })} 
            className="group cursor-pointer bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 w-56 flex-shrink-0"
        >
           <div className="relative aspect-square overflow-hidden rounded-t-xl">
               <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
           </div>
           <div className="p-4 space-y-1">
               <h4 className="font-medium text-sm text-white line-clamp-1">{item.name}</h4>
               <p className="text-[var(--glow-color)] font-bold text-base">₱{item.price.toFixed(2)}</p>
           </div>
       </div>
   )
}

const PromoCard: React.FC<{ promo: PromotionType }> = ({ promo }) => {
    return (
        <div className="inline-flex flex-shrink-0 items-center gap-5 rounded-full border border-white/10 bg-white/[0.06] px-8 py-5 pr-10 text-base text-slate-200 hover:border-[var(--glow-color)]/40 transition-colors shadow-[0_16px_40px_-22px_rgba(229,181,62,0.5)]">
            <img
                src={promo.image}
                alt={promo.name}
                className="h-20 w-20 rounded-full object-cover border border-white/10"
            />
            <span className="font-semibold text-white truncate max-w-[14rem] sm:max-w-[18rem] text-lg">
                {promo.name}
            </span>
            <span className="hidden sm:inline text-slate-600 text-lg">•</span>
            <span className="text-[var(--glow-color)] font-semibold truncate max-w-[15rem] text-lg">
                {promo.tagline}
            </span>
        </div>
    );
};

interface ItemDetailPageProps {
    item: MenuItemType;
    sectionName: string;
    menuData: MenuSectionType[];
    promotions: PromotionType[];
    onNavigate: (page: string, params?: any) => void;
}

// --- HELPERS ---
const findItemsByNames = (names: string[], menu: MenuSectionType[]): MenuItemType[] => {
    const allItems = menu.flatMap(s => s.items);
    return names.map(name => allItems.find(item => item.name === name)).filter((i): i is MenuItemType => !!i);
};

// FIX: Pass sectionName as an argument to the function.
const findRelatedPromos = (item: MenuItemType, promotions: PromotionType[], sectionName: string): PromotionType[] => {
    const related: PromotionType[] = [];
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseDesc = item.description.toLowerCase();

    promotions.forEach(promo => {
        const lowerCasePromo = (promo.name + promo.description + promo.tagline).toLowerCase();
        if (lowerCasePromo.includes('butter brew') && lowerCaseName.includes('butter')) related.push(promo);
        if (lowerCasePromo.includes('pasta') && sectionName.toLowerCase() === 'pasta') related.push(promo);
        if (lowerCasePromo.includes('hot drink') && lowerCaseDesc.includes('hot')) related.push(promo);
        if ((lowerCasePromo.includes('burger') || lowerCasePromo.includes('slider')) && (sectionName.toLowerCase() === 'burgers & sliders')) related.push(promo);
        if (lowerCasePromo.includes('classic brew') && lowerCaseName.includes('butter')) related.push(promo);
    });

    return [...new Set(related)];
};


export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ item, sectionName, menuData, promotions, onNavigate }) => {
    const { addToCart } = useCart();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const isItemFavorite = isFavorite(item.name);

    const sectionId = sectionName.replace(/\s+/g, '-').toLowerCase();

    const galleryImages = Array.from(
        new Set(
            [item.image, ...(item.pairings ? findItemsByNames(item.pairings, menuData).map(p => p.image) : [])]
                .filter((img): img is string => Boolean(img))
        )
    );

    const tastingNotes = item.tasting_notes || [];
    const relatedPromos = findRelatedPromos(item, promotions, sectionName);
    const statusBadges = [
        item.is_recommended && {
            key: 'recommended',
            label: 'Recommended',
            className: 'bg-[var(--glow-color)] text-black border-amber-300/70 shadow-[0_10px_30px_-18px_rgba(229,181,62,0.7)]',
            icon: (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            )
        },
        item.is_best_seller && {
            key: 'best-seller',
            label: 'Best Seller',
            className: 'bg-amber-500/90 text-black border-amber-300/60 shadow-[0_10px_28px_-18px_rgba(218,165,32,0.7)]',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l3.09 6.26L22 13.27l-5 4.87L18.18 22 12 18.9 5.82 22 7 18.14l-5-4.87 6.91-1.01L12 6z" />
                </svg>
            )
        },
        item.is_customer_choice && {
            key: 'customer-choice',
            label: "Customer's Choice",
            className: 'bg-white/90 text-black border-white/40 shadow-[0_10px_26px_-20px_rgba(148,163,184,0.6)]',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )
        }
    ].filter(Boolean) as { key: string; label: string; className: string; icon: React.ReactNode; }[];
    const moreFromSection = menuData
        .find(section => section.section_name === sectionName)
        ?.items.filter(i => i.id !== item.id)
        .slice(0, 6) || [];

    if (galleryImages.length === 0 && item.image) {
        galleryImages.push(item.image);
    }

    const heroImage = galleryImages[selectedImage] ?? item.image;

    const highlightStats: { label: string; value: string }[] = [];
    highlightStats.push({ label: 'Category', value: sectionName });
    if (item.nutrition?.Calories) highlightStats.push({ label: 'Calories', value: item.nutrition.Calories });
    if (item.potential_allergens?.length) highlightStats.push({ label: 'Allergens', value: `${item.potential_allergens.length} noted` });
    if (relatedPromos.length) highlightStats.push({ label: 'Promotions', value: `${relatedPromos.length} active` });

    const handleFavoriteClick = () => {
        if (isItemFavorite) {
            removeFavorite(item.name);
            showToast('Removed from favorites', 'info');
        } else {
            addFavorite(item.name);
            showToast('Added to favorites!', 'success');
        }
    };

    const handleAddToCart = () => {
        addToCart(item, quantity);
        showToast(`Added ${quantity}× ${item.name} to cart!`, 'success');
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-black">
            <div className="absolute inset-0">
                {heroImage && (
                    <img
                        src={heroImage}
                        alt="Background texture"
                        className="h-full w-full object-cover opacity-20 blur-3xl"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-stone-950/90 to-black" />
            </div>

            <div className="relative">
                <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 py-16 lg:py-20 space-y-20">
                    <div className="grid gap-4 text-xs uppercase tracking-[0.35em] text-slate-500 sm:grid-cols-[auto,1fr] sm:items-center">
                        <button
                            onClick={() => onNavigate('home', { menuSectionId: sectionId })}
                            className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </span>
                            Back to Menu
                        </button>
                        <div className="flex items-center gap-5 text-[9px] sm:justify-end tracking-[0.45em] text-slate-600">
                            <span>MARAUDEUR'S BREW</span>
                            <span className="h-px w-10 bg-slate-700" />
                            <span>{sectionName.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(340px,1fr)] xl:grid-cols-[minmax(0,2.4fr)_minmax(380px,1fr)]">
                        <div className="space-y-10">
                            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] shadow-[0_25px_70px_-40px_rgba(0,0,0,0.85)]">
                                <div className="relative aspect-video sm:aspect-[3/2] lg:aspect-[16/9]">
                                    {heroImage && (
                                        <img
                                            src={heroImage}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                                    <div className="absolute left-6 top-6 flex flex-col gap-3 text-amber-200">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/40 px-3.5 py-1 text-[11px] font-semibold tracking-[0.25em] text-amber-200">
                                            SIGNATURE BREW
                                        </span>
                                        {statusBadges.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {statusBadges.map(badge => (
                                                    <span
                                                        key={badge.key}
                                                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold ${badge.className}`}
                                                    >
                                                        {badge.icon}
                                                        {badge.label}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="space-y-8 pb-12 lg:sticky lg:top-24 lg:space-y-10 lg:pb-16">
                            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-10 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.9)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-color)]/12 via-transparent to-transparent" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-4">
                                            <p className="font-magic text-xs uppercase tracking-[0.45em] text-[var(--glow-color)]">
                                                {sectionName.toUpperCase()}
                                            </p>
                                            <h1 className="font-magic text-4xl text-white sm:text-5xl">
                                                {item.name}
                                            </h1>
                                            <div className="space-y-3">
                                                <h2 className="font-magic text-xs uppercase tracking-[0.4em] text-slate-200">Brewmaster's Notes</h2>
                                                <p className="text-sm leading-relaxed text-slate-300">
                                                    {item.description}
                                                </p>
                                                {tastingNotes.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {tastingNotes.map(note => (
                                                            <span key={note} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                                                                <svg className="h-3 w-3 text-[var(--glow-color)]" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                {note}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleFavoriteClick}
                                            className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-white transition-colors hover:border-[var(--glow-color)]/60 hover:text-[var(--glow-color)]"
                                            aria-label="Toggle favorite"
                                        >
                                            {isItemFavorite ? <FavoriteIconFilled /> : <FavoriteIconOutline />}
                                        </button>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-[minmax(0,160px)_1fr] sm:items-center">
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Price</p>
                                            <p className="text-4xl font-semibold text-[var(--glow-color)]">
                                                ₱{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-[minmax(0,160px)_1fr] sm:items-stretch">
                                            <div className="sm:w-full">
                                                <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                                            </div>
                                            <button
                                                onClick={handleAddToCart}
                                                className="btn btn-primary w-full py-3.5 text-base font-semibold shadow-[0_20px_35px_-20px_rgba(229,181,62,0.65)]"
                                            >
                                                Add • ₱{(item.price * quantity).toFixed(2)}
                                            </button>
                                        </div>
                                    </div>

                                    {highlightStats.length > 0 && (
                                        <div className="grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-2">
                                            {highlightStats.map(stat => (
                                                <div key={stat.label} className="rounded-2xl border border-white/5 bg-black/40 px-4 py-3">
                                                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{stat.label}</p>
                                                    <p className="mt-1 text-sm font-semibold text-white">{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {item.potential_allergens?.length ? (
                                        <div className="rounded-2xl border border-white/5 bg-black/35 px-4 py-4 space-y-3">
                                            <p className="font-magic text-xs text-[var(--glow-color)]">Allergens Noted</p>
                                            <div className="flex flex-wrap gap-2">
                                                {item.potential_allergens.map(allergen => (
                                                    <span key={allergen} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                                                        <svg className="h-3 w-3 text-[var(--glow-color)]" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {allergen}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    {relatedPromos.length > 0 && (
                        <div className="space-y-10 border-t border-white/5 pt-10">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="font-magic text-2xl text-white tracking-tight">Related Promotions</h2>
                                    <span className="font-magic text-[10px] uppercase tracking-[0.35em] text-slate-500">Don't miss out</span>
                                </div>
                                <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-1">
                                    {relatedPromos.map(promo => (
                                        <PromoCard key={promo.name} promo={promo} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {moreFromSection.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className="font-magic text-2xl text-white tracking-tight">More from {sectionName}</h2>
                                <span className="font-magic text-[10px] uppercase tracking-[0.35em] text-slate-500">Curated by Marauder's Brew</span>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {moreFromSection.map(mItem => (
                                    <div
                                        key={mItem.id}
                                        onClick={() => onNavigate('item', { id: mItem.id })}
                                        className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-transform duration-300 hover:-translate-y-2 hover:border-[var(--glow-color)]/40"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img src={mItem.image} alt={mItem.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                        </div>
                                        <div className="space-y-2 px-4 py-4">
                                            <p className="text-sm font-semibold text-white line-clamp-1">{mItem.name}</p>
                                            <p className="text-xs text-slate-400 line-clamp-2">{mItem.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[var(--glow-color)] font-semibold">₱{mItem.price.toFixed(2)}</span>
                                                <svg className="h-4 w-4 text-slate-400 group-hover:text-[var(--glow-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}