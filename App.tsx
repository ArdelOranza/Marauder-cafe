
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ToastProvider } from './contexts/ToastContext';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { Pensieve } from './components/Pensieve';
import { HorcruxCollection } from './components/HorcruxCollection';
import { Hero } from './components/Hero';
import { OrderTracker } from './components/OrderTracker';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { Order, MenuSectionType, PromotionType, MenuItemType, GalleryImage, WebsiteSettings, ExpenseEntry } from './types';
import { MENU_DATA, PROMOTIONS, GALLERY_IMAGES } from './constants';
import { CheckoutPage } from './components/CheckoutPage';
import { Promotions } from './components/Promotions';
import { ItemDetailPage } from './components/ItemDetailPage';
import { AdminPanel } from './components/AdminPanel';
import { CafeGallery } from './components/CafeGallery';


type View = {
    page: 'home' | 'checkout' | 'item' | 'admin';
    params?: any;
}

const CONFIG_STORAGE_KEY = 'marauders-config';
const ADMIN_AUTH_STORAGE_KEY = 'marauders-admin-authed';
const ORDER_HISTORY_STORAGE_KEY = 'marauders-pensieve';
const EXPENSES_STORAGE_KEY = 'marauders-expenses';
const QUEUE_COUNTER_STORAGE_KEY = 'marauders-queue-counter';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Hello Love';

const DEFAULT_SETTINGS: WebsiteSettings = {
    cafeName: "Marauder's Brew Cafe",
    tagline: 'Experience a unique blend of artistry and flavor',
    primaryColor: '#D4AF37',
    secondaryColor: '#EAB308',
    backgroundStart: '#000000',
    backgroundMid: '#0A0A0A',
    backgroundEnd: '#141414',
    backgroundMode: 'gradient',
    backgroundColor: '#0A0A0A',
    backgroundImageUrl: '',
    textColor: '#FFFFFF',
    mutedTextColor: '#94A3B8',
    borderColor: '#1F1F1F',
    panelColor: '#141414',
    heroMediaType: 'video',
    heroVideoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    heroPosterUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80',
    menuBackgroundMode: 'image',
    menuBackgroundImageUrl: 'https://static.wikia.nocookie.net/harrypotter/images/2/27/Marauders_map.jpg/revision/latest/scale-to-width-down/1920?cb=20141005112503',
    menuBackgroundVideoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    allergenNotice: 'Kindly inform our baristas of any allergies or dietary restrictions before ordering.'
};

const applySettingsToDocument = (settings: Partial<WebsiteSettings>) => {
    const root = document.documentElement;
    if (settings.primaryColor) {
        root.style.setProperty('--glow-color', settings.primaryColor);
    }
    if (settings.textColor) {
        root.style.setProperty('--text-color', settings.textColor);
    }
    if (settings.mutedTextColor) {
        root.style.setProperty('--text-muted-color', settings.mutedTextColor);
    }
    if (settings.borderColor) {
        root.style.setProperty('--border-color', settings.borderColor);
    }
    if (settings.panelColor) {
        root.style.setProperty('--panel-bg-color', settings.panelColor);
    }
    if (settings.backgroundStart) {
        root.style.setProperty('--background-start', settings.backgroundStart);
    }
    if (settings.backgroundMid) {
        root.style.setProperty('--background-mid', settings.backgroundMid);
    }
    if (settings.backgroundEnd) {
        root.style.setProperty('--background-end', settings.backgroundEnd);
    }
    if (settings.backgroundColor) {
        root.style.setProperty('--bg-color', settings.backgroundColor);
    }

    const body = document.body;
    const mode = settings.backgroundMode || 'gradient';
    if (mode === 'gradient') {
        const start = settings.backgroundStart ?? DEFAULT_SETTINGS.backgroundStart;
        const mid = settings.backgroundMid ?? DEFAULT_SETTINGS.backgroundMid;
        const end = settings.backgroundEnd ?? DEFAULT_SETTINGS.backgroundEnd;
        body.style.backgroundImage = `linear-gradient(180deg, ${start} 0%, ${mid} 50%, ${end} 100%)`;
        body.style.backgroundColor = start;
        body.style.backgroundSize = 'cover';
        body.style.backgroundAttachment = 'fixed';
    } else if (mode === 'solid') {
        const color = settings.backgroundColor ?? DEFAULT_SETTINGS.backgroundColor;
        body.style.backgroundImage = 'none';
        body.style.backgroundColor = color;
    } else if (mode === 'image') {
        const imageUrl = settings.backgroundImageUrl ?? DEFAULT_SETTINGS.backgroundImageUrl;
        if (imageUrl) {
            body.style.backgroundImage = `url(${imageUrl})`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundAttachment = 'fixed';
        }
    }
};

const findItemById = (menu: MenuSectionType[], id: string): [MenuItemType, string] | [null, null] => {
    for (const section of menu) {
        const item = section.items.find(i => i.id === id);
        if (item) {
            return [item, section.section_name];
        }
    }
    return [null, null];
}

interface ExportedConfig {
    menuData?: MenuSectionType[];
    promotions?: PromotionType[];
    galleryImages?: GalleryImage[];
    settings?: Partial<WebsiteSettings>;
    exportDate?: string;
    version?: string;
}

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>({ page: 'home' });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPensieveOpen, setIsPensieveOpen] = useState(false);
    const [isHorcruxOpen, setIsHorcruxOpen] = useState(false);
    const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

    const [menuData, setMenuData] = useState<MenuSectionType[]>(MENU_DATA);
    const [promotions, setPromotions] = useState<PromotionType[]>(PROMOTIONS);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(GALLERY_IMAGES);
    const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);

    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    const [configError, setConfigError] = useState<string | null>(null);
    const [skipClicks, setSkipClicks] = useState(0);
    const [skipUnlocked, setSkipUnlocked] = useState(false);
    const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
        try {
            const stored = window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to read order history', error);
            return [];
        }
    });
    const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>(() => {
        try {
            const stored = window.localStorage.getItem(EXPENSES_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to read expense ledger', error);
            return [];
        }
    });
    const [nextQueueNumber, setNextQueueNumber] = useState<number>(() => {
        try {
            const stored = window.localStorage.getItem(QUEUE_COUNTER_STORAGE_KEY);
            return stored ? Number(stored) || 1 : 1;
        } catch (error) {
            console.error('Failed to read queue counter', error);
            return 1;
        }
    });
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
        try {
            return window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true';
        } catch (error) {
            console.error('Failed to read admin auth state', error);
            return false;
        }
    });
    const [isAdminLoginVisible, setIsAdminLoginVisible] = useState(false);
    const [adminPasswordInput, setAdminPasswordInput] = useState('');
    const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

    const navigate = (page: View['page'], params: any = {}) => {
        if (page === 'admin' && !isAdminAuthenticated) {
            setIsAdminLoginVisible(true);
            setAdminAuthError(null);
            return;
        }
        setView({ page, params });

        if (page === 'home' && params?.menuSectionId) {
            requestAnimationFrame(() => {
                const sectionElement = document.getElementById(params.menuSectionId);
                if (sectionElement) {
                    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        } else {
            window.scrollTo(0, 0);
        }
    };

    const applyConfig = useCallback((config: ExportedConfig) => {
        if (config.menuData && Array.isArray(config.menuData)) {
            setMenuData(config.menuData);
        }
        if (config.promotions && Array.isArray(config.promotions)) {
            setPromotions(config.promotions);
        }
        if (config.galleryImages && Array.isArray(config.galleryImages)) {
            setGalleryImages(config.galleryImages);
        }
        if (config.settings) {
            setSettings(prev => ({ ...prev, ...DEFAULT_SETTINGS, ...config.settings! }));
            applySettingsToDocument(config.settings);
        } else {
            setSettings(DEFAULT_SETTINGS);
            applySettingsToDocument(DEFAULT_SETTINGS);
        }
    }, []);

    useEffect(() => {
        applySettingsToDocument(settings);
    }, [settings]);

    useEffect(() => {
        try {
            if (orderHistory.length > 0) {
                window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orderHistory));
            } else {
                window.localStorage.removeItem(ORDER_HISTORY_STORAGE_KEY);
            }
        } catch (error) {
            console.error('Failed to persist order history', error);
        }
    }, [orderHistory]);

    useEffect(() => {
        try {
            if (expenseEntries.length > 0) {
                window.localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenseEntries));
            } else {
                window.localStorage.removeItem(EXPENSES_STORAGE_KEY);
            }
        } catch (error) {
            console.error('Failed to persist expense ledger', error);
        }
    }, [expenseEntries]);

    useEffect(() => {
        try {
            window.localStorage.setItem(QUEUE_COUNTER_STORAGE_KEY, String(nextQueueNumber));
        } catch (error) {
            console.error('Failed to persist queue counter', error);
        }
    }, [nextQueueNumber]);

    useEffect(() => {
        try {
            const storedConfig = window.localStorage.getItem(CONFIG_STORAGE_KEY);
            if (storedConfig) {
                const parsed = JSON.parse(storedConfig) as ExportedConfig;
                applyConfig(parsed);
                setIsConfigLoaded(true);
            } else {
                // Automatically initialize with default config on first load
                const defaultConfig: ExportedConfig = {
                    menuData: MENU_DATA,
                    promotions: PROMOTIONS,
                    galleryImages: GALLERY_IMAGES,
                    settings: DEFAULT_SETTINGS,
                    version: '1.0.0',
                    exportDate: new Date().toISOString()
                };
                applyConfig(defaultConfig);
                window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(defaultConfig));
                setIsConfigLoaded(true);
            }
        } catch (error) {
            console.error('Failed to load configuration from storage.', error);
            window.localStorage.removeItem(CONFIG_STORAGE_KEY);
            // Still initialize with defaults even on error
            const defaultConfig: ExportedConfig = {
                menuData: MENU_DATA,
                promotions: PROMOTIONS,
                galleryImages: GALLERY_IMAGES,
                settings: DEFAULT_SETTINGS,
                version: '1.0.0',
                exportDate: new Date().toISOString()
            };
            applyConfig(defaultConfig);
            setIsConfigLoaded(true);
        }
    }, [applyConfig]);

    useEffect(() => {
        if (!isConfigLoaded) return;
        const configToPersist: ExportedConfig = {
            menuData,
            promotions,
            galleryImages,
            settings,
            version: '1.0.0',
            exportDate: new Date().toISOString()
        };
        try {
            window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configToPersist));
        } catch (error) {
            console.error('Failed to persist configuration.', error);
        }
    }, [isConfigLoaded, menuData, promotions, galleryImages, settings]);

    const handleConfigImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string) as ExportedConfig;
                if (!parsed.menuData || !parsed.promotions || !parsed.galleryImages) {
                    throw new Error('Configuration file is missing required sections.');
                }
                applyConfig(parsed);
                setIsConfigLoaded(true);
                setConfigError(null);
                window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(parsed));
            } catch (error) {
                console.error('Failed to import configuration.', error);
                setConfigError('Unable to import configuration. Please ensure you selected the exported JSON file.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleConfigTitleClick = () => {
        setSkipClicks(prev => {
            const next = prev + 1;
            if (next >= 5) {
                setSkipUnlocked(true);
                return 0;
            }
            return next;
        });
    };

    const handleSkipConfig = () => {
        const fallbackConfig: ExportedConfig = {
            menuData: MENU_DATA,
            promotions: PROMOTIONS,
            galleryImages: GALLERY_IMAGES,
            settings: DEFAULT_SETTINGS,
            version: '1.0.0',
            exportDate: new Date().toISOString()
        };

        applyConfig(fallbackConfig);
        setIsConfigLoaded(true);
        setConfigError(null);
        setSkipUnlocked(false);
        setSkipClicks(0);
        try {
            window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(fallbackConfig));
        } catch (error) {
            console.error('Failed to persist default configuration.', error);
        }
    };

    const handleAdminLogin = (password: string) => {
        if (password === ADMIN_PASSWORD) {
            setIsAdminAuthenticated(true);
            setIsAdminLoginVisible(false);
            setAdminAuthError(null);
            setAdminPasswordInput('');
            try {
                window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
            } catch (error) {
                console.error('Failed to persist admin auth state', error);
            }
            setView({ page: 'admin' });
        } else {
            setAdminAuthError('Incorrect password. Please try again.');
        }
    };

    const handleAdminLogout = () => {
        setIsAdminAuthenticated(false);
        setView({ page: 'home' });
        try {
            window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear admin auth state', error);
        }
    };

    const handleOrderSuccess = (order: Order) => {
        navigate('home');

        const orderWithQueue: Order = {
            ...order,
            queueNumber: order.queueNumber ?? nextQueueNumber,
        };

        setOrderHistory(prev => [orderWithQueue, ...prev].slice(0, 20));
        setNextQueueNumber(prev => prev + 1);

        setTimeout(() => {
            setTrackedOrder(orderWithQueue);
        }, 300);
    };

    const clearOrderHistory = () => {
        setOrderHistory([]);
        setNextQueueNumber(1);
    };

    const handleAddExpense = (entry: { description: string; amount: number; category: 'materials' | 'operations'; date?: string }) => {
        if (!entry.description.trim() || Number.isNaN(entry.amount) || entry.amount <= 0) {
            return;
        }
        const newEntry: ExpenseEntry = {
            id: `exp-${Date.now()}`,
            description: entry.description.trim(),
            amount: Number(entry.amount),
            category: entry.category,
            date: entry.date && entry.date.trim() ? entry.date : new Date().toLocaleString(),
        };
        setExpenseEntries(prev => [newEntry, ...prev]);
    };

    const handleDeleteExpense = (expenseId: string) => {
        setExpenseEntries(prev => prev.filter(entry => entry.id !== expenseId));
    };

    if (!isConfigLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black text-white flex items-center justify-center px-4">
                <div className="max-w-xl w-full space-y-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl shadow-[0_22px_60px_-35px_rgba(229,181,62,0.55)]">
                    <div className="space-y-3 text-center">
                        <h1
                            className="font-magic text-3xl cursor-pointer select-none"
                            onClick={handleConfigTitleClick}
                        >
                            Configuration Required
                        </h1>
                        <p className="text-sm text-slate-300">
                            Upload the exported Marauder&apos;s Brew configuration JSON file to unlock the full experience.
                        </p>
                    </div>
                    <label className="block">
                        <input
                            type="file"
                            accept="application/json,.json"
                            onChange={handleConfigImport}
                            className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-slate-200 transition hover:border-white/30"
                        />
                    </label>
                    {configError && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                            {configError}
                        </div>
                    )}
                    {skipUnlocked && (
                        <button
                            type="button"
                            onClick={handleSkipConfig}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/40 hover:text-white"
                        >
                            Skip for now (load default data)
                        </button>
                    )}
                    <p className="text-xs text-slate-500 text-center">
                        Need the file? Open the Admin Portal from your previous setup and use <span className="text-[var(--glow-color)]">Export Configuration</span>.
                    </p>
                </div>
            </div>
        );
    }

    const handleCheckoutClick = () => {
        setIsCartOpen(false);
        navigate('checkout');
    };

    const renderPage = () => {
        switch (view.page) {
            case 'item':
                const [item, sectionName] = findItemById(menuData, view.params.id);
                if (item) {
                    return <ItemDetailPage
                        item={item}
                        sectionName={sectionName!}
                        menuData={menuData}
                        promotions={promotions}
                        onNavigate={navigate}
                    />;
                }
                // Fallback to home if item not found
                navigate('home');
                return null;
            case 'checkout':
                return <CheckoutPage onOrderSuccess={handleOrderSuccess} onBackToShop={() => navigate('home')} />;
            case 'admin':
                return (
                    <AdminPanel
                        menuData={menuData}
                        setMenuData={setMenuData}
                        promotions={promotions}
                        setPromotions={setPromotions}
                        galleryImages={galleryImages}
                        setGalleryImages={setGalleryImages}
                        settings={settings}
                        setSettings={setSettings}
                        onNavigate={navigate}
                        onLogout={handleAdminLogout}
                        orders={orderHistory}
                        onClearOrders={clearOrderHistory}
                        expenseEntries={expenseEntries}
                        onAddExpense={handleAddExpense}
                        onDeleteExpense={handleDeleteExpense}
                    />
                );
            case 'home':
            default:
                return (
                    <>
                        <Hero
                            mediaType={settings.heroMediaType}
                            videoUrl={settings.heroVideoUrl}
                            posterUrl={settings.heroPosterUrl}
                            imageUrl={settings.heroImageUrl}
                            tagline={settings.tagline}
                        />
                        <Promotions promotions={promotions} />
                        <CafeGallery images={galleryImages} />
                        <Menu menuData={menuData} onNavigate={navigate} settings={settings} />
                    </>
                );
        }
    }

    return (
        <div className="min-h-screen text-gray-200 flex flex-col">
            <Header
                onCartClick={() => setIsCartOpen(true)}
                onPensieveClick={() => setIsPensieveOpen(true)}
                onHorcruxClick={() => setIsHorcruxOpen(true)}
                onNavigate={navigate}
            />

            <main className="flex-grow">
                {renderPage()}
            </main>

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onProceedToCheckout={handleCheckoutClick}
            />
            <Pensieve isOpen={isPensieveOpen} onClose={() => setIsPensieveOpen(false)} orders={orderHistory} />
            <HorcruxCollection isOpen={isHorcruxOpen} onClose={() => setIsHorcruxOpen(false)} menuData={menuData} />
            <OrderTracker order={trackedOrder} onClose={() => setTrackedOrder(null)} />

            <Footer onNavigate={navigate} />

            <ToastContainer />

            {isAdminLoginVisible && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-[var(--panel-bg-color)] p-8 shadow-2xl border border-[var(--border-color)]">
                        <h2 className="font-magic text-2xl mb-4 text-white text-center">Admin Access</h2>
                        <p className="text-sm text-[var(--text-muted-color)] mb-6 text-center">Enter the administrator password to continue.</p>
                        <input
                            type="password"
                            value={adminPasswordInput}
                            onChange={(e) => setAdminPasswordInput(e.target.value)}
                            className="form-input mb-4"
                            placeholder="Password"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAdminLogin(adminPasswordInput);
                                }
                            }}
                            autoFocus
                        />
                        {adminAuthError && (
                            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 text-center">
                                {adminAuthError}
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                className="btn btn-primary flex-1"
                                onClick={() => handleAdminLogin(adminPasswordInput)}
                            >
                                Unlock Panel
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary flex-1"
                                onClick={() => {
                                    setIsAdminLoginVisible(false);
                                    setAdminPasswordInput('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-center text-[var(--text-muted-color)]">
                            Tip: Configure <span className="text-[var(--glow-color)]">VITE_ADMIN_PASSWORD</span> in your environment.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <CartProvider>
                <FavoritesProvider>
                    <AppContent />
                </FavoritesProvider>
            </CartProvider>
        </ToastProvider>
    )
}

export default App;