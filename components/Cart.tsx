import React from 'react';
import { useCart } from '../contexts/CartContext';
import { CartItemType } from '../types';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    onProceedToCheckout: () => void;
}

const MinusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" /></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);


const CartItem: React.FC<{ item: CartItemType }> = ({ item }) => {
    const { updateQuantity } = useCart();
    return (
        <div className="flex gap-3 py-4 border-b border-white/5 transition-smooth hover:bg-white/[0.02] px-2 -mx-2 rounded-xl">
            <img src={item.image} alt={item.name} className="w-18 h-18 object-cover rounded-xl flex-shrink-0 transition-transform hover:scale-105" />
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{item.name}</p>
                <p className="text-xs text-slate-400 mt-1">₱{item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-3">
                    <button
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-[var(--glow-color)] hover:text-black text-white transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Decrease quantity"
                    >
                        <MinusIcon />
                    </button>
                    <span className="w-10 text-center font-bold text-white text-sm">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-[var(--glow-color)] hover:text-black text-white transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Increase quantity"
                    >
                        <PlusIcon />
                    </button>
                    <button
                        onClick={() => updateQuantity(item.name, 0)}
                        className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-md hover:bg-red-500/10"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, onProceedToCheckout }) => {
    const { cartItems, clearCart } = useCart();

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-md glass-panel shadow-2xl transform transition-all duration-500 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-gradient-to-r from-black/40 to-stone-900/30">
                        <div>
                            <h2 className="font-magic text-lg text-white tracking-wider">Your Order</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-1">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 text-slate-400 hover:text-white transition-all duration-200 rounded-full hover:bg-white/5 hover:rotate-90"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto px-6 py-2">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fadeIn">
                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold mb-1">Your cart is empty</p>
                                    <p className="text-slate-500 text-sm">Add items to get started</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {cartItems.map((item, idx) => <div key={item.name} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}><CartItem item={item} /></div>)}
                            </div>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-white/10 space-y-4 bg-gradient-to-t from-black/40 to-transparent">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-[var(--glow-color)] text-2xl" style={{ textShadow: '0 0 20px rgba(var(--glow-color-rgb), 0.5)' }}>₱{totalPrice.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={onProceedToCheckout}
                                className="btn btn-primary w-full py-4 text-base font-bold shadow-[0_20px_50px_-25px_rgba(229,181,62,0.7)] hover:shadow-[0_25px_60px_-30px_rgba(229,181,62,0.9)] animate-pulse"
                            >
                                Proceed to Checkout
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full text-center text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center gap-2 py-2 rounded-md hover:bg-red-500/5"
                            >
                                <TrashIcon /> Clear Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};