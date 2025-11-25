import React, { useMemo, useState } from 'react';
import { MenuSectionType, MenuItemType, GalleryImage, WebsiteSettings, PromotionType, Order, ExpenseEntry } from '../types';

interface AdminPanelProps {
    menuData: MenuSectionType[];
    setMenuData: React.Dispatch<React.SetStateAction<MenuSectionType[]>>;
    promotions: PromotionType[];
    setPromotions: React.Dispatch<React.SetStateAction<PromotionType[]>>;
    galleryImages: GalleryImage[];
    setGalleryImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
    settings: WebsiteSettings;
    setSettings: React.Dispatch<React.SetStateAction<WebsiteSettings>>;
    onNavigate: (page: string, params?: any) => void;
    onLogout: () => void;
    orders: Order[];
    onClearOrders: () => void;
    expenseEntries: ExpenseEntry[];
    onAddExpense: (payload: { description: string; amount: number; category: 'materials' | 'operations'; date?: string }) => void;
    onDeleteExpense: (id: string) => void;
}

interface GalleryFormData {
    url: string;
    title: string;
    category: string;
    description: string;
}


const ItemForm: React.FC<{
    item: Partial<MenuItemType>;
    onSave: (item: MenuItemType, targetSection: string, originalSection: string) => void;
    onCancel: () => void;
    sections: string[];
    initialSection: string;
    isEditing: boolean;
}> = ({ item: initialItem, onSave, onCancel, sections, initialSection, isEditing }) => {
    const [item, setItem] = useState<Partial<MenuItemType>>(initialItem);
    const [selectedSection, setSelectedSection] = useState<string>(initialSection || sections[0] || '');
    const [enableVariants, setEnableVariants] = useState<boolean>(
        Boolean(initialItem.priceHot !== undefined || initialItem.priceCold !== undefined)
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as (HTMLInputElement & HTMLTextAreaElement);
        if (type === 'checkbox') {
            setItem(prev => ({ ...prev, [name]: checked }));
            return;
        }
        const isNumber = type === 'number';
        if (isNumber) {
            setItem(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
        } else {
            setItem(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTastingNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const notes = e.target.value
            .split('\n')
            .map(note => note.trim())
            .filter(Boolean);
        setItem({ ...item, tasting_notes: notes });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setItem({ ...item, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!item.name || !item.id) {
            alert('ID and Name are required.');
            return;
        }

        const updatedItem: MenuItemType = {
            ...item,
            price: item.price ?? 0
        } as MenuItemType;

        if (enableVariants) {
            if (typeof updatedItem.priceHot !== 'number') {
                alert('Please provide a Hot price when variant pricing is enabled.');
                return;
            }
            updatedItem.price = updatedItem.priceHot;
        } else {
            updatedItem.priceHot = undefined;
            updatedItem.priceCold = undefined;
            if (typeof updatedItem.price !== 'number' || Number.isNaN(updatedItem.price)) {
                alert('Please provide a base price.');
                return;
            }
        }

        if (typeof updatedItem.price === 'number' && Number.isNaN(updatedItem.price)) {
            alert('Please provide a valid price.');
            return;
        }

        onSave(updatedItem, selectedSection, initialSection);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="panel-background p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="font-magic text-2xl mb-6">{item.name ? `Editing ${item.name}` : 'Add New Item'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">ID</label>
                            <input 
                                type="text" 
                                name="id" 
                                value={item.id || ''} 
                                onChange={handleChange} 
                                required 
                                className="form-input" 
                                disabled={isEditing} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Name</label>
                            <input type="text" name="name" value={item.name || ''} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Base Price</label>
                            <input
                                type="number"
                                name="price"
                                value={item.price ?? ''}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Default price"
                                disabled={enableVariants}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Menu Section</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="form-input"
                            >
                                {sections.map(section => (
                                    <option key={section} value={section}>{section}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Image</label>
                             <input 
                                type="file" 
                                onChange={handleImageChange} 
                                accept="image/jpeg, image/png" 
                                className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--glow-color)] file:text-[var(--bg-color)] hover:file:opacity-90 cursor-pointer"
                            />
                            {item.image && <img src={item.image} alt="Preview" className="mt-4 w-full h-32 object-cover rounded-lg border border-[var(--border-color)]" />}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Description</label>
                        <textarea name="description" value={item.description || ''} onChange={handleChange} rows={4} className="form-input"></textarea>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-white">Variant Pricing (Hot / Cold)</h4>
                            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={enableVariants}
                                    onChange={() => {
                                        setEnableVariants(prev => {
                                            const next = !prev;
                                            if (!next) {
                                                setItem(prevItem => ({
                                                    ...prevItem,
                                                    priceHot: undefined,
                                                    priceCold: undefined
                                                }));
                                            }
                                            return next;
                                        });
                                    }}
                                    className="h-4 w-4 rounded border-white/20 bg-black"
                                />
                                Enable
                            </label>
                        </div>
                        {enableVariants && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hot Price</label>
                                    <input
                                        type="number"
                                        name="priceHot"
                                        value={item.priceHot ?? ''}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="₱"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cold Price</label>
                                    <input
                                        type="number"
                                        name="priceCold"
                                        value={item.priceCold ?? ''}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="₱"
                                    />
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-slate-400">
                            Use variant pricing for drinks with different hot and cold rates. Leave disabled for single-price items.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Brewmaster's Notes</label>
                        <textarea
                            value={(item.tasting_notes && item.tasting_notes.length > 0) ? item.tasting_notes.join('\n') : ''}
                            onChange={handleTastingNotesChange}
                            rows={3}
                            className="form-input"
                            placeholder="One note per line"
                        ></textarea>
                        <p className="text-xs text-slate-400 mt-1">Enter each note on a new line to showcase in the Brewmaster's Notes section.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
                            <input
                                type="checkbox"
                                name="is_recommended"
                                checked={Boolean(item.is_recommended)}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-white/20 bg-black"
                            />
                            Recommended
                        </label>
                        <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
                            <input
                                type="checkbox"
                                name="is_best_seller"
                                checked={Boolean(item.is_best_seller)}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-white/20 bg-black"
                            />
                            Best Seller
                        </label>
                        <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
                            <input
                                type="checkbox"
                                name="is_customer_choice"
                                checked={Boolean(item.is_customer_choice)}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-white/20 bg-black"
                            />
                            Customer Choice
                        </label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const AdminPanel: React.FC<AdminPanelProps> = ({
    menuData,
    setMenuData,
    promotions,
    setPromotions,
    galleryImages,
    setGalleryImages,
    settings,
    setSettings,
    onNavigate,
    onLogout,
    orders,
    onClearOrders,
    expenseEntries,
    onAddExpense,
    onDeleteExpense
}) => {
    const [editingItem, setEditingItem] = useState<Partial<MenuItemType> | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'promotions' | 'settings' | 'import-export' | 'analytics'>('menu');
    const [newPromo, setNewPromo] = useState<Partial<PromotionType>>({ name: '', description: '', tagline: '', image: '' });
    const [editingPromoIndex, setEditingPromoIndex] = useState<number | null>(null);
    const [newGalleryItem, setNewGalleryItem] = useState<GalleryFormData>({ url: '', title: '', category: 'Ambiance', description: '' });
    const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
    const [editingItemSection, setEditingItemSection] = useState<string>(() => menuData[0]?.section_name || '');
    const [calculatorInputs, setCalculatorInputs] = useState({
        goodsCost: '',
        operatingExpenses: '',
        deductibleRate: '10'
    });
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: 'materials' as 'materials' | 'operations',
        date: ''
    });

    const orderMetrics = useMemo(() => {
        if (!orders || orders.length === 0) {
            return {
                totalRevenue: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                totalItemsSold: 0
            };
        }

        const revenue = orders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0);
        const itemsSold = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + (item.quantity ?? 0), 0), 0);

        return {
            totalRevenue: revenue,
            totalOrders: orders.length,
            averageOrderValue: revenue / orders.length,
            totalItemsSold: itemsSold
        };
    }, [orders]);

    const calculatorResults = useMemo(() => {
        const goodsCost = parseFloat(calculatorInputs.goodsCost) || 0;
        const operatingExpenses = parseFloat(calculatorInputs.operatingExpenses) || 0;
        const deductibleRate = Math.min(Math.max(parseFloat(calculatorInputs.deductibleRate) || 0, 0), 100);

        const deductibleAmount = orderMetrics.totalRevenue * (deductibleRate / 100);
        const netProfit = orderMetrics.totalRevenue - goodsCost - operatingExpenses - deductibleAmount;

        return {
            deductibleRate,
            deductibleAmount,
            netProfit
        };
    }, [calculatorInputs, orderMetrics.totalRevenue]);

    const expenseMetrics = useMemo(() => {
        if (!expenseEntries || expenseEntries.length === 0) {
            return {
                materialsTotal: 0,
                operationsTotal: 0,
                totalExpenses: 0,
                netProfitAfterExpenses: orderMetrics.totalRevenue
            };
        }

        const materialsTotal = expenseEntries
            .filter(entry => entry.category === 'materials')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const operationsTotal = expenseEntries
            .filter(entry => entry.category === 'operations')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const totalExpenses = materialsTotal + operationsTotal;

        return {
            materialsTotal,
            operationsTotal,
            totalExpenses,
            netProfitAfterExpenses: orderMetrics.totalRevenue - totalExpenses
        };
    }, [expenseEntries, orderMetrics.totalRevenue]);

    const serviceModeStats = useMemo(() => {
        if (!orders || orders.length === 0) {
            return {
                dineInCount: 0,
                takeOutCount: 0,
                dineInRevenue: 0,
                takeOutRevenue: 0
            };
        }

        const dineInOrders = orders.filter(order => order.serviceMode === 'dine-in');
        const takeOutOrders = orders.filter(order => order.serviceMode === 'take-out');

        const dineInRevenue = dineInOrders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0);
        const takeOutRevenue = takeOutOrders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0);

        return {
            dineInCount: dineInOrders.length,
            takeOutCount: takeOutOrders.length,
            dineInRevenue,
            takeOutRevenue
        };
    }, [orders]);

    const topItems = useMemo(() => {
        if (!orders || orders.length === 0) return [] as { name: string; quantity: number; revenue: number }[];

        const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();
        orders.forEach(order => {
            order.items.forEach(item => {
                const prev = itemMap.get(item.id) || { name: item.name, quantity: 0, revenue: 0 };
                const quantity = prev.quantity + (item.quantity ?? 0);
                const revenue = prev.revenue + (item.price ?? 0) * (item.quantity ?? 0);
                itemMap.set(item.id, { name: prev.name, quantity, revenue });
            });
        });

        return Array.from(itemMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }, [orders]);

    const recentRevenueByDate = useMemo(() => {
        if (!orders || orders.length === 0) return [] as { date: string; total: number }[];
        const dateMap = new Map<string, number>();
        orders.slice().forEach(order => {
            const dateKey = new Date(order.date).toLocaleDateString();
            dateMap.set(dateKey, (dateMap.get(dateKey) ?? 0) + (order.totalPrice ?? 0));
        });

        return Array.from(dateMap.entries())
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7);
    }, [orders]);

    const formatCurrency = (value: number) => `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const serviceModeTotalCount = serviceModeStats.dineInCount + serviceModeStats.takeOutCount;
    const dineInPercent = serviceModeTotalCount === 0 ? 0 : (serviceModeStats.dineInCount / serviceModeTotalCount) * 100;
    const takeOutPercent = serviceModeTotalCount === 0 ? 0 : (serviceModeStats.takeOutCount / serviceModeTotalCount) * 100;

    const handleExpenseSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const amountValue = parseFloat(newExpense.amount);
        if (!newExpense.description.trim() || Number.isNaN(amountValue) || amountValue <= 0) {
            return;
        }

        onAddExpense({
            description: newExpense.description.trim(),
            amount: amountValue,
            category: newExpense.category,
            date: newExpense.date || undefined
        });

        setNewExpense({ description: '', amount: '', category: 'materials', date: '' });
    };

    const handleCalculatorChange = (field: keyof typeof calculatorInputs, value: string) => {
        setCalculatorInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleDelete = (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setMenuData(prevData =>
                prevData.map(section => ({
                    ...section,
                    items: section.items.filter(item => item.id !== itemId),
                }))
            );
        }
    };
    
    const handleSave = (updatedItem: MenuItemType, targetSection: string, originalSection: string) => {
        setMenuData(prevData =>
            prevData.map(section => {
                if (section.section_name === targetSection) {
                    const exists = section.items.some(item => item.id === updatedItem.id);
                    const items = exists
                        ? section.items.map(item => (item.id === updatedItem.id ? updatedItem : item))
                        : [...section.items, updatedItem];
                    return { ...section, items };
                }

                if (!isCreating && originalSection && originalSection !== targetSection && section.section_name === originalSection) {
                    return { ...section, items: section.items.filter(item => item.id !== updatedItem.id) };
                }

                return section;
            })
        );

        setEditingItem(null);
        setIsCreating(false);
        setEditingItemSection(targetSection);
    };

    const resetGalleryForm = () => {
        setNewGalleryItem({ url: '', title: '', category: 'Ambiance', description: '' });
        setEditingGalleryId(null);
    };

    const handleSubmitGalleryImage = () => {
        if (!newGalleryItem.url || !newGalleryItem.title) {
            alert('Please provide at least a title and an image.');
            return;
        }

        if (editingGalleryId) {
            setGalleryImages(prev => prev.map(img => img.id === editingGalleryId ? { ...img, ...newGalleryItem } : img));
        } else {
            const newImage: GalleryImage = {
                id: 'g' + Date.now(),
                ...newGalleryItem
            };
            setGalleryImages(prev => [...prev, newImage]);
        }

        resetGalleryForm();
    };

    const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewGalleryItem(prev => ({ ...prev, url: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleEditGalleryImage = (id: string) => {
        const image = galleryImages.find(img => img.id === id);
        if (!image) return;
        setNewGalleryItem({ url: image.url, title: image.title, category: image.category, description: image.description ?? '' });
        setEditingGalleryId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteGalleryImage = (id: string) => {
        if (window.confirm('Remove this image from gallery?')) {
            setGalleryImages(prev => prev.filter(img => img.id !== id));
            if (editingGalleryId === id) {
                resetGalleryForm();
            }
        }
    };

    const handleSettingChange = (key: keyof WebsiteSettings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value } as WebsiteSettings));
        if (key === 'primaryColor') {
            document.documentElement.style.setProperty('--glow-color', value);
        }
    };

    const applySettings = () => {
        alert('Settings saved! (In a real app, this would persist to a database)');
    };

    const resetPromoForm = () => {
        setNewPromo({ name: '', description: '', tagline: '', image: '' });
        setEditingPromoIndex(null);
    };

    const handlePromoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewPromo(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitPromo = () => {
        if (!newPromo.name || !newPromo.description || !newPromo.tagline || !newPromo.image) {
            alert('Please complete all promotion fields, including an image.');
            return;
        }

        if (editingPromoIndex !== null) {
            setPromotions(prev => prev.map((promo, idx) => (idx === editingPromoIndex ? newPromo as PromotionType : promo)));
        } else {
            setPromotions(prev => [...prev, newPromo as PromotionType]);
        }

        resetPromoForm();
    };

    const handleEditPromo = (index: number) => {
        const promo = promotions[index];
        setNewPromo({ ...promo });
        setEditingPromoIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelPromoEdit = () => {
        resetPromoForm();
    };

    const handleDeletePromo = (index: number) => {
        const promo = promotions[index];
        if (!promo) return;
        if (window.confirm(`Delete the "${promo.name}" promotion?`)) {
            setPromotions(prev => prev.filter((_, idx) => idx !== index));
            if (editingPromoIndex === index) {
                resetPromoForm();
            } else if (editingPromoIndex !== null && editingPromoIndex > index) {
                setEditingPromoIndex(editingPromoIndex - 1);
            }
        }
    };

    const handleHeroPosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setSettings(prev => ({ ...prev, heroPosterUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSaveSettings = () => {
        alert('Settings saved! (In a real app, this would persist to a backend)');
    };

    const handleExportConfig = () => {
        const config = {
            menuData,
            promotions,
            galleryImages,
            settings,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `marauders-brew-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('Configuration exported successfully!');
    };

    const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const config = JSON.parse(event.target?.result as string);

                if (config.menuData) setMenuData(config.menuData);
                if (config.promotions) setPromotions(config.promotions);
                if (config.galleryImages) setGalleryImages(config.galleryImages);
                if (config.settings) setSettings(prev => ({ ...prev, ...config.settings }));

                alert(`Configuration imported successfully!\nVersion: ${config.version || 'Unknown'}\nExported: ${config.exportDate ? new Date(config.exportDate).toLocaleDateString() : 'Unknown'}`);
            } catch (error) {
                alert('Error importing configuration. Please check the file format.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-color)] to-stone-900">
            <div className="container mx-auto py-12 px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="font-magic text-5xl text-white mb-2">Admin Control Panel</h1>
                        <p className="text-[var(--text-muted-color)]">Manage your café's digital presence</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setActiveTab('analytics')} className={`btn btn-secondary ${activeTab === 'analytics' ? 'ring-2 ring-[var(--glow-color)]' : ''}`}>
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A8.957 8.957 0 0120.488 9z" />
                            </svg>
                            View Analytics
                        </button>
                        <button onClick={onLogout} className="btn btn-secondary">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v8a4 4 0 004 4h3" />
                            </svg>
                            Logout
                        </button>
                        <button onClick={() => onNavigate('home')} className="btn btn-secondary">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Shop
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-[var(--border-color)] overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${
                            activeTab === 'menu'
                                ? 'border-[var(--glow-color)] text-[var(--glow-color)]'
                                : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Menu
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${
                            activeTab === 'gallery'
                                ? 'border-[var(--glow-color)] text-[var(--glow-color)]'
                                : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Gallery
                    </button>
                    <button
                        onClick={() => setActiveTab('promotions')}
                        className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${
                            activeTab === 'promotions'
                                ? 'border-[var(--glow-color)] text-[var(--glow-color)]'
                                : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Promotions
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'settings' ? 'bg-[var(--glow-color)] text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('import-export')} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'import-export' ? 'bg-[var(--glow-color)] text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Import/Export
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'analytics' ? 'bg-[var(--glow-color)] text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A8.957 8.957 0 0120.488 9z" />
                            </svg>
                            Analytics
                        </span>
                    </button>
                </div>

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        <div className="glass-panel rounded-2xl p-8 border border-[var(--border-color)]">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--glow-color)]">Executive Overview</p>
                                    <h2 className="font-magic text-3xl text-white">Revenue & Performance Pulse</h2>
                                    <p className="text-sm text-[var(--text-muted-color)] mt-1">Live summary of café performance including revenue, service mix, and bestseller insights.</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button onClick={onClearOrders} className="btn btn-secondary">
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2z" />
                                        </svg>
                                        Clear History
                                    </button>
                                </div>
                            </div>

                            {orders.length === 0 ? (
                                <p className="text-sm text-[var(--text-muted-color)]">No orders captured yet. Encourage guests to place an order to unlock analytics.</p>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="panel-background rounded-2xl border border-white/5 p-6 shadow-[0_22px_50px_-40px_rgba(229,181,62,0.45)]">
                                            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted-color)]">Total Revenue</p>
                                            <p className="text-4xl font-bold text-[var(--glow-color)] mt-2">{formatCurrency(orderMetrics.totalRevenue)}</p>
                                            <p className="text-[11px] text-[var(--text-muted-color)] mt-3">Average check: <span className="text-white font-semibold">{formatCurrency(orderMetrics.averageOrderValue)}</span></p>
                                        </div>
                                        <div className="panel-background rounded-2xl border border-white/5 p-6">
                                            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted-color)]">Orders Served</p>
                                            <p className="text-4xl font-bold text-white mt-2">{orderMetrics.totalOrders}</p>
                                            <p className="text-[11px] text-[var(--text-muted-color)] mt-3">Items moved: <span className="text-white font-semibold">{orderMetrics.totalItemsSold}</span></p>
                                        </div>
                                        <div className="panel-background rounded-2xl border border-white/5 p-6">
                                            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted-color)]">Expense Footprint</p>
                                            <div className="mt-3 space-y-2">
                                                <p className="flex justify-between text-sm text-slate-300"><span>Materials</span><span>{formatCurrency(expenseMetrics.materialsTotal)}</span></p>
                                                <p className="flex justify-between text-sm text-slate-300"><span>Operations</span><span>{formatCurrency(expenseMetrics.operationsTotal)}</span></p>
                                                <p className="flex justify-between text-sm text-white font-semibold border-t border-white/10 pt-2"><span>Total</span><span>{formatCurrency(expenseMetrics.totalExpenses)}</span></p>
                                            </div>
                                        </div>
                                        <div className="panel-background rounded-2xl border border-white/5 p-6">
                                            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted-color)]">Net Profit After Expenses</p>
                                            <p className={`text-3xl font-bold ${expenseMetrics.netProfitAfterExpenses >= 0 ? 'text-emerald-400' : 'text-red-400'} mt-2`}>
                                                {formatCurrency(expenseMetrics.netProfitAfterExpenses)}
                                            </p>
                                            <p className="text-[11px] text-[var(--text-muted-color)] mt-3">Excludes manual deductions below.</p>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 panel-background rounded-2xl border border-white/5 p-6 flex flex-col">
                                        <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted-color)]">Service Mix</p>
                                        <div className="relative flex-1 flex items-center justify-center my-6">
                                            <div
                                                className="w-40 h-40 rounded-full border border-white/5 shadow-inner shadow-black/40"
                                                style={{
                                                    background: `conic-gradient(${getComputedStyle(document.documentElement).getPropertyValue('--glow-color') || '#EAB308'} 0deg ${dineInPercent}deg, rgba(94,129,244,0.85) ${dineInPercent}deg 360deg)`
                                                }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-20 h-20 rounded-full bg-black/70 border border-white/5 flex flex-col items-center justify-center">
                                                        <span className="text-xs text-[var(--text-muted-color)]">Total</span>
                                                        <span className="text-lg font-bold text-white">{serviceModeTotalCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm text-slate-300">
                                                <span className="flex items-center gap-2">
                                                    <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--glow-color') || '#EAB308' }}></span>
                                                    Dine-In
                                                </span>
                                                <span>{serviceModeStats.dineInCount} orders · {dineInPercent.toFixed(0)}%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-slate-300">
                                                <span className="flex items-center gap-2">
                                                    <span className="inline-block h-3 w-3 rounded-full bg-indigo-400"></span>
                                                    Take-Out
                                                </span>
                                                <span>{serviceModeStats.takeOutCount} orders · {takeOutPercent.toFixed(0)}%</span>
                                            </div>
                                            <div className="mt-3 text-[11px] text-[var(--text-muted-color)]">
                                                Dine-In Revenue: <span className="text-white font-semibold">{formatCurrency(serviceModeStats.dineInRevenue)}</span><br />
                                                Take-Out Revenue: <span className="text-white font-semibold">{formatCurrency(serviceModeStats.takeOutRevenue)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div className="glass-panel rounded-2xl p-8 border border-[var(--border-color)]">
                                <p className="text-xs uppercase tracking-[0.35em] text-[var(--glow-color)]">Revenue Trend</p>
                                <h3 className="font-magic text-2xl text-white mb-6">Last 7 Serving Days</h3>
                                {recentRevenueByDate.length === 0 ? (
                                    <p className="text-sm text-[var(--text-muted-color)]">Trend data becomes available when orders span multiple days.</p>
                                ) : (
                                    <div className="space-y-5">
                                        <div className="flex items-end gap-3 h-40">
                                            {(() => {
                                                const maxVal = Math.max(...recentRevenueByDate.map(entry => entry.total)) || 1;
                                                return recentRevenueByDate.map(entry => {
                                                    const heightPercent = (entry.total / maxVal) * 100;
                                                    return (
                                                        <div key={entry.date} className="flex-1 flex flex-col items-center gap-2">
                                                            <div className="w-full bg-gradient-to-t from-[var(--glow-color)]/15 via-[var(--glow-color)]/70 to-[var(--glow-color)] rounded-t-lg" style={{ height: `${heightPercent}%` }}></div>
                                                            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted-color)]">{entry.date}</span>
                                                            <span className="text-[11px] text-white font-medium">{formatCurrency(entry.total)}</span>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                        <div className="panel-background rounded-xl border border-white/5 p-4">
                                            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted-color)] mb-2">Top Performers</p>
                                            {topItems.length === 0 ? (
                                                <p className="text-sm text-[var(--text-muted-color)]">Top sellers will surface once orders are recorded.</p>
                                            ) : (
                                                <ul className="space-y-2">
                                                    {topItems.map(item => (
                                                        <li key={item.name} className="flex items-center justify-between text-sm text-slate-200">
                                                            <span className="flex items-center gap-3">
                                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">{item.quantity}</span>
                                                                {item.name}
                                                            </span>
                                                            <span className="text-[var(--glow-color)] font-semibold">{formatCurrency(item.revenue)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="glass-panel rounded-2xl p-8 border border-[var(--border-color)] space-y-6">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--glow-color)]">Profit Tools</p>
                                    <h3 className="font-magic text-2xl text-white">Profitability & Deductions</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <form onSubmit={handleExpenseSubmit} className="panel-background rounded-xl border border-white/5 p-5 space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-2">Description</label>
                                            <input
                                                type="text"
                                                value={newExpense.description}
                                                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                                                className="form-input"
                                                placeholder="e.g., Coffee beans restock"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-2">Amount (₱)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={newExpense.amount}
                                                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                                                    className="form-input"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-2">Category</label>
                                                <select
                                                    value={newExpense.category}
                                                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as 'materials' | 'operations' }))}
                                                    className="form-input"
                                                >
                                                    <option value="materials">Materials</option>
                                                    <option value="operations">Operations</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-2">Date (optional)</label>
                                            <input
                                                type="date"
                                                value={newExpense.date}
                                                onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                                                className="form-input"
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-full">Log Expense</button>
                                    </form>

                                    <div className="panel-background rounded-xl border border-white/5 p-5 space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted-color)]">Deductible Inputs</p>
                                            <div className="grid grid-cols-1 gap-3">
                                                <label className="text-xs text-slate-400">Cost of Goods Sold (₱)
                                                    <input
                                                        type="number"
                                                        value={calculatorInputs.goodsCost}
                                                        onChange={(e) => handleCalculatorChange('goodsCost', e.target.value)}
                                                        className="form-input mt-1"
                                                        placeholder="Enter total goods cost"
                                                    />
                                                </label>
                                                <label className="text-xs text-slate-400">Operating Expenses (₱)
                                                    <input
                                                        type="number"
                                                        value={calculatorInputs.operatingExpenses}
                                                        onChange={(e) => handleCalculatorChange('operatingExpenses', e.target.value)}
                                                        className="form-input mt-1"
                                                        placeholder="Rent, utilities, salaries, etc."
                                                    />
                                                </label>
                                                <label className="text-xs text-slate-400">Deductible Rate (%)
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={calculatorInputs.deductibleRate}
                                                        onChange={(e) => handleCalculatorChange('deductibleRate', e.target.value)}
                                                        className="form-input mt-1"
                                                        placeholder="Suggested: 10%"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-white/5 bg-black/40 p-4 space-y-2">
                                            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted-color)]">Projected Net Profit</p>
                                            <p className="text-3xl font-bold text-[var(--glow-color)]">{formatCurrency(calculatorResults.netProfit)}</p>
                                            <p className="text-[11px] text-[var(--text-muted-color)]">Deductible impact: {formatCurrency(calculatorResults.deductibleAmount)} ({calculatorResults.deductibleRate.toFixed(1)}%)</p>
                                            <p className="text-[11px] text-slate-400">Net = Revenue − Goods Cost − Operating Expenses − Deductible</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="panel-background rounded-xl border border-white/5 p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.35em] text-[var(--glow-color)]">Expense Ledger</p>
                                            <h4 className="text-lg font-semibold text-white">Materials & Operations Spend</h4>
                                        </div>
                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300">
                                            Total Logged: {expenseEntries.length}
                                        </span>
                                    </div>
                                    {expenseEntries.length === 0 ? (
                                        <p className="text-sm text-[var(--text-muted-color)]">No expenses recorded yet. Capture material purchases and operations costs to keep profit calculations automatic.</p>
                                    ) : (
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                            {expenseEntries.map(entry => (
                                                <div key={entry.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{entry.description}</p>
                                                        <p className="text-xs text-[var(--text-muted-color)] mt-1">{entry.date}</p>
                                                        <span className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${entry.category === 'materials' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/40' : 'bg-sky-500/10 text-sky-300 border border-sky-400/40'}`}>
                                                            {entry.category === 'materials' ? 'Materials' : 'Operations'}
                                                        </span>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-2">
                                                        <p className="text-lg font-bold text-[var(--glow-color)]">{formatCurrency(entry.amount)}</p>
                                                        <button
                                                            onClick={() => onDeleteExpense(entry.id)}
                                                            className="text-[10px] uppercase tracking-[0.3em] text-red-300 hover:text-red-200"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel rounded-2xl p-8 border border-[var(--border-color)]">
                            <h3 className="font-magic text-2xl text-white mb-5">Latest Orders</h3>
                            {orders.length === 0 ? (
                                <p className="text-sm text-[var(--text-muted-color)]">No recent orders.</p>
                            ) : (
                                <div className="space-y-4">
                                    {orders.slice(0, 10).map(order => (
                                        <div key={order.id} className="panel-background rounded-xl border border-white/5 p-4">
                                            <div className="flex flex-wrap justify-between gap-2 mb-3">
                                                <div>
                                                    <p className="text-sm text-[var(--text-muted-color)]">Order ID</p>
                                                    <p className="font-semibold text-white">{order.id}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-[var(--text-muted-color)]">Date</p>
                                                    <p className="font-semibold text-white">{order.date}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-[var(--text-muted-color)]">Total</p>
                                                    <p className="font-bold text-[var(--glow-color)]">{formatCurrency(order.totalPrice)}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap justify-between gap-2 text-xs text-[var(--text-muted-color)]">
                                                <span className="inline-flex items-center gap-2">
                                                    <span className="inline-block h-2 w-2 rounded-full bg-[var(--glow-color)]"></span>
                                                    {order.serviceMode === 'dine-in' ? 'Dine-In' : 'Take-Out'}
                                                </span>
                                                {order.queueNumber && (
                                                    <span>Queue #{order.queueNumber}</span>
                                                )}
                                            </div>
                                            <ul className="text-xs text-[var(--text-muted-color)] grid sm:grid-cols-2 gap-2 mt-3">
                                                {order.items.map(item => (
                                                    <li key={item.id} className="flex items-center gap-2">
                                                        <span className="font-semibold text-white/70">{item.quantity}x</span>
                                                        <span>{item.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Menu Management Tab */}
                {activeTab === 'menu' && (
                    <div>
                        <div className="mb-6">
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setIsCreating(true);
                                    setEditingItemSection(menuData[0]?.section_name || '');
                                }}
                                className="btn btn-primary shadow-lg shadow-amber-500/30"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Menu Item
                            </button>
                        </div>

                        <div className="space-y-6">
                            {menuData.map(section => (
                                <div key={section.section_name} className="glass-panel rounded-2xl p-6 border border-[var(--border-color)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="font-magic text-2xl text-white">{section.section_name}</h2>
                                        <span className="bg-stone-800 px-3 py-1 rounded-full text-sm text-slate-300">
                                            {section.items.length} items
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {section.items.map(item => (
                                            <div key={item.id} className="bg-stone-900/50 rounded-xl p-4 border border-stone-700 hover:border-[var(--glow-color)] transition-all duration-300 group">
                                                <div className="flex gap-4">
                                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                                                    <div className="flex-grow min-w-0">
                                                        <p className="font-bold text-white truncate group-hover:text-[var(--glow-color)] transition-colors">{item.name}</p>
                                                        <p className="text-sm text-[var(--text-muted-color)] mb-2">₱{item.price}</p>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingItem(item);
                                                                    setEditingItemSection(section.section_name);
                                                                    setIsCreating(false);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md transition-colors"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md transition-colors">
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery Management Tab */}
                {activeTab === 'gallery' && (
                    <div>
                        <div className="glass-panel rounded-2xl p-8 border border-[var(--border-color)] mb-8">
                            <h2 className="font-magic text-3xl text-white mb-6">Add New Gallery Image</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        value={newGalleryItem.url}
                                        onChange={(e) => setNewGalleryItem(prev => ({ ...prev, url: e.target.value }))}
                                        className="form-input"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">Upload Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleGalleryImageUpload}
                                        className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--glow-color)] file:text-[var(--bg-color)] hover:file:opacity-90 cursor-pointer"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Upload images directly or paste a URL.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={newGalleryItem.title}
                                        onChange={(e) => setNewGalleryItem(prev => ({ ...prev, title: e.target.value }))}
                                        className="form-input"
                                        placeholder="Image title"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-200 mb-2">Description</label>
                                    <textarea
                                        value={newGalleryItem.description}
                                        onChange={(e) => setNewGalleryItem(prev => ({ ...prev, description: e.target.value }))}
                                        className="form-input h-24"
                                        placeholder="Tell guests what this scene captures."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">Category</label>
                                    <select
                                        value={newGalleryItem.category}
                                        onChange={(e) => setNewGalleryItem(prev => ({ ...prev, category: e.target.value }))}
                                        className="form-input"
                                    >
                                        <option value="Ambiance">Ambiance</option>
                                        <option value="Drinks">Drinks</option>
                                        <option value="Events">Events</option>
                                    </select>
                                </div>
                                {newGalleryItem.url && (
                                    <div className="md:col-span-2">
                                        <p className="text-xs text-slate-400 mb-2">Preview</p>
                                        <img src={newGalleryItem.url} alt="Gallery Preview" className="w-full h-48 object-cover rounded-lg border border-[var(--border-color)]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <button onClick={handleSubmitGalleryImage} className="btn btn-primary shadow-lg shadow-amber-500/30">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {editingGalleryId ? 'Save Image' : 'Add Image'}
                                </button>
                                {editingGalleryId && (
                                    <button onClick={resetGalleryForm} className="btn btn-secondary">
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="glass-panel rounded-2xl p-6 border border-[var(--border-color)]">
                            <h2 className="font-magic text-2xl text-white mb-4">Gallery Images ({galleryImages.length})</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {galleryImages.map(image => (
                                    <div key={image.id} className="group relative bg-stone-900/50 rounded-xl overflow-hidden border border-stone-700 hover:border-[var(--glow-color)] transition-all duration-300">
                                        <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
                                        <div className="p-3 space-y-2">
                                            <div>
                                                <p className="font-bold text-white text-sm truncate">{image.title}</p>
                                                <p className="text-xs text-slate-400">{image.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <button
                                                    onClick={() => handleEditGalleryImage(image.id)}
                                                    className="text-[11px] uppercase tracking-[0.25em] text-slate-200 border border-white/10 bg-white/[0.05] px-3 py-1 rounded-md transition-colors hover:border-white/30 hover:text-white"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGalleryImage(image.id)}
                                                    className="text-[11px] uppercase tracking-[0.25em] text-white bg-red-600 px-3 py-1 rounded-md transition-colors hover:bg-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Promotions Management Tab */}
                {activeTab === 'promotions' && (
                    <div>
                        <div className="glass-panel rounded-2xl p-8 border border-[var(--border-color)] mb-8">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--glow-color)]">Promotion Manager</p>
                                    <h2 className="font-magic text-3xl text-white">
                                        {editingPromoIndex !== null ? 'Edit Promotion' : 'Create New Promotion'}
                                    </h2>
                                </div>
                                {editingPromoIndex !== null && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                                        Editing #{editingPromoIndex + 1}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">Promotion Name</label>
                                    <input
                                        type="text"
                                        value={newPromo.name || ''}
                                        onChange={(e) => setNewPromo(prev => ({ ...prev, name: e.target.value }))}
                                        className="form-input"
                                        placeholder="e.g., Happy Hour Special"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">Tagline</label>
                                    <input
                                        type="text"
                                        value={newPromo.tagline || ''}
                                        onChange={(e) => setNewPromo(prev => ({ ...prev, tagline: e.target.value }))}
                                        className="form-input"
                                        placeholder="e.g., 50% off all drinks"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-200 mb-2">Description</label>
                                    <textarea
                                        value={newPromo.description || ''}
                                        onChange={(e) => setNewPromo(prev => ({ ...prev, description: e.target.value }))}
                                        className="form-input"
                                        rows={3}
                                        placeholder="Detailed description of the promotion..."
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-200 mb-2">Image URL</label>
                                        <input
                                            type="url"
                                            value={newPromo.image || ''}
                                            onChange={(e) => setNewPromo(prev => ({ ...prev, image: e.target.value }))}
                                            className="form-input"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-200 mb-2">Upload Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePromoImageUpload}
                                            className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--glow-color)] file:text-[var(--bg-color)] hover:file:opacity-90 cursor-pointer"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Uploads convert to base64 previews for quick staging.</p>
                                    </div>
                                    {newPromo.image && (
                                        <div className="lg:col-span-2">
                                            <p className="text-xs text-slate-400 mb-2">Preview</p>
                                            <img src={newPromo.image} alt="Promotion Preview" className="w-full h-48 object-cover rounded-lg border border-[var(--border-color)]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button onClick={handleSubmitPromo} className="btn btn-primary shadow-lg shadow-amber-500/30">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {editingPromoIndex !== null ? 'Save Promotion' : 'Add Promotion'}
                                </button>
                                {editingPromoIndex !== null && (
                                    <button onClick={handleCancelPromoEdit} className="btn btn-secondary">
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="glass-panel rounded-2xl p-6 border border-[var(--border-color)]">
                            <h2 className="font-magic text-2xl text-white mb-4">Active Promotions ({promotions.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {promotions.map((promo, index) => (
                                    <div key={promo.name + index} className="group relative bg-stone-900/50 rounded-xl overflow-hidden border border-stone-700 hover:border-[var(--glow-color)] transition-all duration-300">
                                        <div className="relative h-48">
                                            <img src={promo.image} alt={promo.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className="font-bold text-white text-lg mb-1">{promo.name}</h3>
                                                <p className="text-[var(--glow-color)] text-sm font-semibold">{promo.tagline}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <p className="text-slate-300 text-sm line-clamp-3">{promo.description}</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => handleEditPromo(index)}
                                                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition-colors hover:border-white/30 hover:text-white"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePromo(index)}
                                                    className="w-full rounded-lg bg-red-600 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Website Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-4xl">
                        <div className="glass-panel rounded-2xl p-8 border border-[var(--border-color)]">
                            <h2 className="font-magic text-3xl text-white mb-6">Customize Your Website</h2>
                            
                            <div className="space-y-6">
                                {/* Branding Section */}
                                <div className="border-b border-[var(--border-color)] pb-6">
                                    <h3 className="font-bold text-xl text-white mb-4">Branding</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-200 mb-2">Café Name</label>
                                            <input
                                                type="text"
                                                value={settings.cafeName}
                                                onChange={(e) => handleSettingChange('cafeName', e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-200 mb-2">Primary Color</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={settings.primaryColor}
                                                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                                                    className="h-12 w-20 rounded-lg cursor-pointer border-2 border-[var(--border-color)]"
                                                />
                                                <input
                                                    type="text"
                                                    value={settings.primaryColor}
                                                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                                                    className="form-input flex-grow"
                                                    placeholder="#EAB308"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-200 mb-2">Tagline</label>
                                            <input
                                                type="text"
                                                value={settings.tagline}
                                                onChange={(e) => handleSettingChange('tagline', e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Section */}
                                <div className="border-b border-[var(--border-color)] pb-6">
                                    <h3 className="font-bold text-xl text-white mb-4">Hero Section</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-200 mb-2">Media Type</label>
                                            <select
                                                value={settings.heroMediaType}
                                                onChange={(e) => handleSettingChange('heroMediaType', e.target.value)}
                                                className="form-input"
                                            >
                                                <option value="video">Video Background</option>
                                                <option value="image">Static Image</option>
                                            </select>
                                        </div>
                                        {settings.heroMediaType === 'video' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-200 mb-2">Background Video URL</label>
                                                    <input
                                                        type="url"
                                                        value={settings.heroVideoUrl}
                                                        onChange={(e) => handleSettingChange('heroVideoUrl', e.target.value)}
                                                        className="form-input"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-200 mb-2">Poster Image URL</label>
                                                    <input
                                                        type="url"
                                                        value={settings.heroPosterUrl}
                                                        onChange={(e) => handleSettingChange('heroPosterUrl', e.target.value)}
                                                        className="form-input"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {settings.heroMediaType === 'image' && (
                                            <div>
                                                <label className="block text-sm font-bold text-slate-200 mb-2">Hero Image URL</label>
                                                <input
                                                    type="url"
                                                    value={settings.heroImageUrl}
                                                    onChange={(e) => handleSettingChange('heroImageUrl', e.target.value)}
                                                    className="form-input"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        )}
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--border-color)] pt-6 mt-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-200 mb-2">Menu Background Mode</label>
                                                <select
                                                    value={settings.menuBackgroundMode}
                                                    onChange={(e) => handleSettingChange('menuBackgroundMode', e.target.value)}
                                                    className="form-input"
                                                >
                                                    <option value="image">Image</option>
                                                    <option value="video">YouTube Video</option>
                                                </select>
                                            </div>
                                            {settings.menuBackgroundMode === 'image' && (
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-200 mb-2">Menu Background Image URL</label>
                                                    <input
                                                        type="url"
                                                        value={settings.menuBackgroundImageUrl}
                                                        onChange={(e) => handleSettingChange('menuBackgroundImageUrl', e.target.value)}
                                                        className="form-input"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            )}
                                            {settings.menuBackgroundMode === 'video' && (
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-200 mb-2">Menu Background YouTube URL</label>
                                                    <input
                                                        type="url"
                                                        value={settings.menuBackgroundVideoUrl}
                                                        onChange={(e) => handleSettingChange('menuBackgroundVideoUrl', e.target.value)}
                                                        className="form-input"
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                    />
                                                </div>
                                            )}
                                            {settings.menuBackgroundMode === 'image' && settings.menuBackgroundImageUrl && (
                                                <div className="md:col-span-2">
                                                    <p className="text-xs text-slate-400 mb-2">Menu Background Preview</p>
                                                    <div className="relative h-40 overflow-hidden rounded-xl border border-white/10">
                                                        <img src={settings.menuBackgroundImageUrl} alt="Menu background preview" className="h-full w-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Allergen Notice */}
                                <div className="border-b border-[var(--border-color)] pb-6">
                                    <h3 className="font-bold text-xl text-white mb-4">Guest Guidance</h3>
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-200 mb-2">Allergen Notice</label>
                                        <textarea
                                            value={settings.allergenNotice}
                                            onChange={(e) => handleSettingChange('allergenNotice', e.target.value)}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Share a reminder about allergy disclosures for your guests."
                                        />
                                        <p className="text-xs text-slate-400">This message appears above the menu to prompt guests to mention dietary restrictions.</p>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div>
                                    <h3 className="font-bold text-xl text-white mb-4">Color Preview</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-stone-800 p-4 rounded-lg text-center">
                                            <div className="w-full h-12 rounded-md mb-2" style={{ backgroundColor: settings.primaryColor }}></div>
                                            <p className="text-xs text-slate-400">Primary</p>
                                        </div>
                                        <div className="bg-stone-800 p-4 rounded-lg text-center">
                                            <div className="w-full h-12 rounded-md mb-2 flex items-center justify-center text-black font-bold" style={{ backgroundColor: settings.primaryColor }}>
                                                Button
                                            </div>
                                            <p className="text-xs text-slate-400">CTA Button</p>
                                        </div>
                                        <div className="bg-stone-800 p-4 rounded-lg text-center">
                                            <div className="w-full h-12 rounded-md mb-2 border-2 flex items-center justify-center" style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}>
                                                Text
                                            </div>
                                            <p className="text-xs text-slate-400">Accent Text</p>
                                        </div>
                                        <div className="bg-stone-800 p-4 rounded-lg text-center">
                                            <div className="w-full h-12 rounded-md mb-2" style={{ boxShadow: `0 0 20px ${settings.primaryColor}80` }}></div>
                                            <p className="text-xs text-slate-400">Glow Effect</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="pt-4">
                                    <button onClick={applySettings} className="btn btn-primary w-full md:w-auto px-8 py-4 text-lg shadow-2xl shadow-amber-500/40">
                                        <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Import/Export Tab */}
                {activeTab === 'import-export' && (
                    <div className="space-y-6">
                        <div className="panel-background p-8 rounded-lg">
                            <h2 className="font-magic text-3xl text-white mb-6">Configuration Management</h2>
                            <p className="text-slate-400 mb-8">Export your entire website configuration to migrate to another system or create backups. Import configurations to restore or update your site.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Export Section */}
                                <div className="bg-white/[0.02] p-6 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <svg className="w-8 h-8 text-[var(--glow-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <h3 className="font-bold text-xl text-white">Export Configuration</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-6">Download all your menu items, promotions, gallery images, and settings as a JSON file.</p>
                                    <ul className="text-sm text-slate-400 mb-6 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Menu items & categories
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Promotions & offers
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Gallery images
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Website settings
                                        </li>
                                    </ul>
                                    <button onClick={handleExportConfig} className="btn btn-primary w-full">
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export Configuration
                                    </button>
                                </div>

                                {/* Import Section */}
                                <div className="bg-white/[0.02] p-6 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-12" />
                                        </svg>
                                        <h3 className="font-bold text-xl text-white">Import Configuration</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-6">Upload a previously exported JSON configuration file to restore or migrate your website data.</p>
                                    <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-6">
                                        <div className="flex gap-3">
                                            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <div className="text-sm text-amber-200">
                                                <p className="font-semibold mb-1">Warning</p>
                                                <p className="text-xs">Importing will replace all current data. Make sure to export your current configuration first as a backup.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <label className="block">
                                        <input 
                                            type="file" 
                                            accept=".json,application/json"
                                            onChange={handleImportConfig}
                                            className="block w-full text-sm text-slate-400
                                                file:mr-4 file:py-3 file:px-6
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-500 file:text-white
                                                hover:file:bg-blue-600
                                                file:cursor-pointer cursor-pointer
                                                border border-white/10 rounded-lg
                                                bg-white/[0.02] p-2"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
                                <div className="flex gap-3">
                                    <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-sm text-blue-200">
                                        <p className="font-semibold mb-2">Migration Guide</p>
                                        <ol className="list-decimal list-inside space-y-1 text-xs">
                                            <li>Export configuration from your current system</li>
                                            <li>Transfer the JSON file to your new system</li>
                                            <li>Import the configuration file in the new system's admin panel</li>
                                            <li>Verify all data has been migrated correctly</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(editingItem || isCreating) && (
                    <ItemForm 
                        item={isCreating ? { id: 'new-item-' + Date.now() } : editingItem!}
                        onSave={handleSave}
                        onCancel={() => { setEditingItem(null); setIsCreating(false); }}
                        sections={menuData.map(s => s.section_name)}
                    />
                )}
            </div>
        </div>
    );
};
