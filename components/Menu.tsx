import React, { useMemo, useState } from 'react';
import { MenuSectionType, MenuItemType, WebsiteSettings } from '../types';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { ALLERGENS_LIST } from '../constants';

// --- ICONS ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293-1.293a1 1 0 010-1.414L15 6m-5 14l2.293-2.293a1 1 0 011.414 0L17 18m-5-14l-2.293 2.293a1 1 0 000 1.414L7 12l1.293-1.293a1 1 0 000-1.414L5 6m14 12l-2.293-2.293a1 1 0 00-1.414 0L13 18m2.293-7.293l1.414 1.414a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 0z" /></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;


// --- COMBO BUILDER MODAL ---
interface ComboBuilderModalProps {
    item: MenuItemType;
    menuData: MenuSectionType[];
    onClose: () => void;
}

const ComboBuilderModal: React.FC<ComboBuilderModalProps> = ({ item, menuData, onClose }) => {
    const { addToast } = useToast();
    const { addToCart } = useCart();
    
    const [selectedDrink, setSelectedDrink] = useState<MenuItemType | null>(null);
    const [selectedSide, setSelectedSide] = useState<MenuItemType | null>(null);
    
    const drinks = menuData.find(s => s.section_name === "Refreshers")?.items ?? [];
    const sides = menuData.find(s => s.section_name === "Bites")?.items ?? [];
    
    const discount = 50;
    const comboPrice = item.price + (selectedDrink?.price ?? 0) + (selectedSide?.price ?? 0);
    const finalPrice = comboPrice - discount;

    const handleAddToCart = () => {
        if (!selectedDrink || !selectedSide) {
            addToast('Please select a drink and a side.', 'info');
            return;
        }
        addToCart(item, 1);
        addToCart(selectedDrink, 1);
        addToCart(selectedSide, 1);
        addToast(`Combo added! You saved ₱${discount}.`, 'success');
        onClose();
    };

    const ComboOption: React.FC<{option: MenuItemType, isSelected: boolean, onSelect: () => void}> = ({ option, isSelected, onSelect }) => (
        <div onClick={onSelect} className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${isSelected ? 'bg-amber-500/10 border-[var(--glow-color)]' : 'border-stone-700 hover:border-stone-500'}`}>
            <img src={option.image} alt={option.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-semibold text-white text-sm">{option.name}</p>
                <p className="text-xs text-[var(--text-muted-color)]">₱{option.price}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[var(--glow-color)] bg-[var(--glow-color)]' : 'border-stone-500'}`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-black"></div>}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-3xl glass-panel rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h2 className="font-magic text-2xl text-white">Make it a Combo</h2>
                    <p className="text-[var(--text-muted-color)]">With your {item.name}</p>
                </div>
                <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                    <div>
                        <h3 className="font-bold text-lg text-white mb-3">1. Choose a Drink</h3>
                        <div className="space-y-3 pr-2 h-80 overflow-y-auto hide-scrollbar">{drinks.map(d => <ComboOption key={d.id} option={d} isSelected={selectedDrink?.id === d.id} onSelect={() => setSelectedDrink(d)} />)}</div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white mb-3">2. Choose a Side</h3>
                        <div className="space-y-3 pr-2 h-80 overflow-y-auto hide-scrollbar">{sides.map(s => <ComboOption key={s.id} option={s} isSelected={selectedSide?.id === s.id} onSelect={() => setSelectedSide(s)} />)}</div>
                    </div>
                </div>
                <div className="p-6 border-t border-[var(--border-color)] bg-black/20 mt-auto flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-400">Combo Price:</p>
                        <p className="font-bold text-2xl text-[var(--glow-color)]">
                            {selectedDrink && selectedSide ? `₱${finalPrice.toFixed(2)}` : '---'}
                        </p>
                        {selectedDrink && selectedSide && <p className="text-sm text-green-400 line-through">₱{comboPrice.toFixed(2)}</p>}
                    </div>
                    <button onClick={handleAddToCart} disabled={!selectedDrink || !selectedSide} className="btn btn-primary text-base disabled:opacity-50 disabled:cursor-not-allowed">
                        Add Combo to Order
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- ALLERGEN FILTER ---
interface AllergenFilterProps {
    excludedAllergens: string[];
    onAllergenToggle: (allergen: string) => void;
    onClear: () => void;
}

const AllergenFilter: React.FC<AllergenFilterProps> = ({ excludedAllergens, onAllergenToggle, onClear }) => {
    return (
        <div className="bg-white/[0.02] backdrop-blur-sm p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-lg text-white">Filter Allergens</h3>
                {excludedAllergens.length > 0 && (
                    <button onClick={onClear} className="text-xs text-[var(--glow-color)] hover:text-amber-300 font-medium transition-colors">
                        Clear
                    </button>
                )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {ALLERGENS_LIST.map(allergen => (
                    <label 
                        key={allergen} 
                        className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-200"
                    >
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded bg-transparent border-white/20 text-[var(--glow-color)] focus:ring-[var(--glow-color)] focus:ring-offset-0 cursor-pointer"
                            checked={excludedAllergens.includes(allergen)}
                            onChange={() => onAllergenToggle(allergen)}
                        />
                        <span className="text-xs text-slate-300 font-medium">{allergen}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};


// --- SUB-COMPONENTS ---
interface MenuItemProps {
    item: MenuItemType;
    onNavigate: (page: string, params?: any) => void;
    onMakeCombo: (item: MenuItemType) => void;
    isMealItem: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onNavigate, onMakeCombo, isMealItem }) => {
    const { addToCart } = useCart();

    const formatPrice = (value: number) => `₱${value.toFixed(2)}`;
    const basePrice = typeof item.priceHot === 'number' ? item.priceHot : item.price;
    const hasVariantPricing = typeof item.priceHot === 'number' || typeof item.priceCold === 'number';
    const variantSummary = (() => {
        const parts: string[] = [];
        if (typeof item.priceHot === 'number') parts.push(`Hot ${formatPrice(item.priceHot)}`);
        if (typeof item.priceCold === 'number') parts.push(`Cold ${formatPrice(item.priceCold)}`);
        return parts.join(' • ');
    })();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(item, 1);
    };

    return (
        <div 
            onClick={() => onNavigate('item', { id: item.id })}
            className="group relative overflow-hidden cursor-pointer bg-white/[0.02] rounded-2xl border border-white/5 hover:border-[var(--glow-color)]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--glow-color)]/10 flex flex-col h-full backdrop-blur-sm"
        >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Badge */}
                {item.is_recommended && (
                    <div className="absolute top-3 left-3 bg-[var(--glow-color)] text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Recommended
                    </div>
                )}
                
                {/* Quick Add Button */}
                <button 
                    onClick={handleAddToCart}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-black opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110" 
                    aria-label="Add to cart"
                >
                    <PlusIcon />
                </button>
            </div>
            
            {/* Content */}
            <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-base text-white leading-tight line-clamp-1">{item.name}</h4>
                    {item.description && (
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex flex-col">
                        <p className="text-[var(--glow-color)] font-bold text-xl leading-tight">{formatPrice(basePrice)}</p>
                        {hasVariantPricing && variantSummary && (
                            <p className="text-[11px] text-slate-400 font-medium tracking-wide leading-tight">{variantSummary}</p>
                        )}
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('item', { id: item.id }); }}
                        className="text-xs font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        View →
                    </button>
                </div>
                
                {isMealItem && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onMakeCombo(item); }} 
                        className="w-full group relative overflow-hidden rounded-xl border border-[var(--glow-color)]/30 bg-gradient-to-r from-white/5 via-white/10 to-white/5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_-20px_rgba(229,181,62,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--glow-color)]/60 hover:shadow-[0_25px_45px_-22px_rgba(229,181,62,0.75)]"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                            <svg className="h-4 w-4 text-[var(--glow-color)] transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Make it a Combo
                            <span className="text-[var(--glow-color)] text-xs font-bold uppercase tracking-[0.3em]">Save ₱50</span>
                        </span>
                        <span className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--glow-color)]/10 blur-sm"></span>
                    </button>
                )}
            </div>
        </div>
    );
};

interface MenuSectionProps {
    section: MenuSectionType;
    onNavigate: (page: string, params?: any) => void;
    onMakeCombo: (item: MenuItemType) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ section, onNavigate, onMakeCombo }) => {
    const sectionId = section.section_name.replace(/\s+/g, '-').toLowerCase();
    const mealSections = ["Burgers & Sliders", "Pasta", "Rice Meals"];
    const isMealSection = mealSections.includes(section.section_name);
    
    return (
        <section id={sectionId} className="scroll-mt-24 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-2">
                    <h3 className="font-magic text-4xl text-white tracking-tight">{section.section_name}</h3>
                    <div className="h-0.5 w-16 bg-[var(--glow-color)] rounded-full"></div>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.items.map(item => (
                    <MenuItem 
                        key={item.id} 
                        item={item} 
                        onNavigate={onNavigate} 
                        onMakeCombo={onMakeCombo}
                        isMealItem={isMealSection}
                    />
                ))}
            </div>
        </section>
    );
};

// --- MAIN COMPONENT ---
interface MenuProps {
    menuData: MenuSectionType[];
    onNavigate: (page: string, params?: any) => void;
    settings?: WebsiteSettings;
}

const menuGroups = [
    {
        title: "Drinks",
        id: "drinks",
        sections: [
            "Butter Brew Series", "Coffee", "Non-Coffee", "Signatures",
            "Matcha Series", "Refreshers", "Milkshakes"
        ]
    },
    {
        title: "Meals",
        id: "meals",
        sections: [
            "Bites", "Burgers & Sliders", "Pasta", "Rice Meals"
        ]
    },
    {
        title: "",
        id: "desserts-salads",
        sections: [ "Desserts & Salads" ]
    },
    {
        title: "Group Packages",
        id: "group-packages",
        sections: [ "Group Packages" ]
    }
];

const getYouTubeVideoId = (url?: string): string | null => {
    if (!url) return null;
    const regex = /(?:v=|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export const Menu: React.FC<MenuProps> = ({ menuData, onNavigate, settings }) => {
    const [comboItem, setComboItem] = useState<MenuItemType | null>(null);
    const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const menuBackgroundMode = settings?.menuBackgroundMode ?? 'image';
    const menuBackgroundImage = settings?.menuBackgroundImageUrl;
    const menuBackgroundVideoId = useMemo(() => getYouTubeVideoId(settings?.menuBackgroundVideoUrl), [settings?.menuBackgroundVideoUrl]);
    const menuBackgroundImageStyle = useMemo(() => {
        if (!menuBackgroundImage) return undefined;
        return {
            backgroundImage: `url(${menuBackgroundImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'top center',
            backgroundRepeat: 'repeat-y'
        } as React.CSSProperties;
    }, [menuBackgroundImage]);

    const handleMakeCombo = (item: MenuItemType) => {
        setComboItem(item);
    };

    const handleAllergenToggle = (allergen: string) => {
        setExcludedAllergens(prev =>
            prev.includes(allergen)
                ? prev.filter(a => a !== allergen)
                : [...prev, allergen]
        );
    };

    const clearAllergens = () => {
        setExcludedAllergens([]);
    };
    
    const filteredMenuData = excludedAllergens.length === 0
        ? menuData
        : menuData.map(section => ({
            ...section,
            items: section.items.filter(item => 
                !item.potential_allergens || !item.potential_allergens.some(allergen => excludedAllergens.includes(allergen))
            )
        })).filter(section => section.items.length > 0);
    
    const hasResults = filteredMenuData.some(section => section.items.length > 0);

    return (
        <section className="relative w-full">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {menuBackgroundMode === 'video' && menuBackgroundVideoId ? (
                    <div className="absolute inset-0">
                        <iframe
                            className="w-full h-full pointer-events-none"
                            src={`https://www.youtube.com/embed/${menuBackgroundVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${menuBackgroundVideoId}&modestbranding=1&rel=0&fs=0`}
                            title="Menu Background Video"
                            allow="autoplay; encrypted-media"
                            allowFullScreen={false}
                            frameBorder="0"
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                ) : menuBackgroundImage ? (
                    <div className="absolute inset-0 bg-black">
                        <div className="absolute inset-0" style={menuBackgroundImageStyle} />
                        <div className="absolute inset-0 bg-black/70" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-stone-950 to-black" />
                )}
            </div>

            <main className="relative w-full pt-6 pb-16 px-4 sm:px-6 lg:px-10">
             {settings?.allergenNotice && (
                <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-sm text-amber-100 shadow-[0_22px_60px_-40px_rgba(229,181,62,0.55)]">
                    <div className="flex items-start gap-3">
                        <svg className="mt-1 h-5 w-5 text-amber-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="font-magic text-xs uppercase tracking-[0.35em] text-amber-300">Allergen Notice</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-amber-100/90">
                        {settings.allergenNotice}
                    </p>
                </div>
             )}
             <div className="mb-10">
                <div className="flex justify-end">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)} 
                        className="px-4 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-lg flex items-center gap-2 transition-all duration-200"
                    >
                        {isFilterOpen ? <XIcon/> : <FilterIcon />}
                        <span className="text-white text-sm font-medium">Filters</span>
                        {excludedAllergens.length > 0 && (
                            <span className="bg-[var(--glow-color)] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {excludedAllergens.length}
                            </span>
                        )}
                    </button>
                </div>
                {isFilterOpen && (
                    <div className="mt-4 animate-fadeIn">
                        <AllergenFilter 
                            excludedAllergens={excludedAllergens}
                            onAllergenToggle={handleAllergenToggle}
                            onClear={clearAllergens}
                        />
                    </div>
                )}
            </div>

            <div className="space-y-16">
                {hasResults ? (
                    menuGroups.map(group => {
                        const sectionsInGroup = filteredMenuData.filter(section => group.sections.includes(section.section_name));
                        if (sectionsInGroup.length === 0) return null;

                        const primarySectionName = sectionsInGroup[0]?.section_name;
                        const showGroupTitle = Boolean(
                            group.title && (
                                group.title !== primarySectionName || sectionsInGroup.length > 1
                            )
                        );

                        return (
                            <div id={group.id} key={group.id} className="scroll-mt-24 space-y-12">
                                {showGroupTitle && (
                                    <div className="text-center">
                                        <h2 className="font-magic text-5xl text-white tracking-tight mb-2">{group.title}</h2>
                                        <div className="mx-auto w-20 h-1 bg-[var(--glow-color)] rounded-full"></div>
                                    </div>
                                )}
                                <div className="space-y-12">
                                    {sectionsInGroup.map(section => 
                                        <MenuSection 
                                            key={section.section_name} 
                                            section={section} 
                                            onNavigate={onNavigate}
                                            onMakeCombo={handleMakeCombo}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5">
                        <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="font-semibold text-xl text-white mb-2">No Matching Items</h3>
                        <p className="text-slate-400 text-sm">Try adjusting your filters</p>
                    </div>
                )}
            </div>
            
            {comboItem && (
                <ComboBuilderModal 
                    item={comboItem}
                    menuData={menuData}
                    onClose={() => setComboItem(null)}
                />
            )}
        </main>
    </section>
);
};