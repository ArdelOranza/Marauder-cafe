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
        <div className="flex gap-3 py-4 border-b border-white/5">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate">{item.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">₱{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors"><MinusIcon /></button>
                    <span className="w-8 text-center font-medium text-white text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors"><PlusIcon /></button>
                    <button onClick={() => updateQuantity(item.name, 0)} className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
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
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[var(--bg-color)] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
                        <h2 className="font-semibold text-lg text-white">Your Order</h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto px-6">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-slate-400 text-sm">Your cart is empty</p>
                            </div>
                        ) : (
                            cartItems.map(item => <CartItem key={item.name} item={item} />)
                        )}
                    </div>

                    {cartItems.length > 0 && (
                         <div className="p-6 border-t border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-lg font-bold text-white">
                                <span>Total</span>
                                <span className="text-[var(--glow-color)]">₱{totalPrice.toFixed(2)}</span>
                            </div>
                            <button onClick={onProceedToCheckout} className="btn btn-primary w-full py-3.5">
                                Checkout
                            </button>
                             <button onClick={clearCart} className="w-full text-center text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center gap-2">
                                <TrashIcon /> Clear Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};