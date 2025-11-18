import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Order } from '../types';

interface CheckoutPageProps {
    onOrderSuccess: (order: Order) => void;
    onBackToShop: () => void;
}
// --- ICONS ---
const CreditCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const CashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const DigitalWalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
        <path d="M15 12h6v4h-6z" />
    </svg>
);

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onBackToShop }) => {
    const { cartItems, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('Cash on Delivery');
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<{code: string, discount: number} | null>(null);
    const [voucherError, setVoucherError] = useState('');

    // Sample vouchers - in real app, fetch from backend
    const validVouchers = [
        { code: 'BREW10', discount: 0.10, minOrder: 100 },
        { code: 'MAGIC20', discount: 0.20, minOrder: 500 },
        { code: 'FIRST50', discount: 50, minOrder: 200, isFixed: true }
    ];

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = appliedVoucher ? (appliedVoucher.discount <= 1 ? subtotal * appliedVoucher.discount : appliedVoucher.discount) : 0;
    const totalPrice = subtotal - discount;

    const handleApplyVoucher = () => {
        setVoucherError('');
        const voucher = validVouchers.find(v => v.code.toUpperCase() === voucherCode.toUpperCase());
        
        if (!voucher) {
            setVoucherError('Invalid voucher code');
            return;
        }
        
        if (subtotal < voucher.minOrder) {
            setVoucherError(`Minimum order of ₱${voucher.minOrder} required`);
            return;
        }
        
        setAppliedVoucher({ 
            code: voucher.code, 
            discount: voucher.isFixed ? voucher.discount : voucher.discount 
        });
        setVoucherCode('');
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherError('');
    };
    const paymentOptions = [
        { name: 'Credit/Debit Card', icon: CreditCardIcon },
        { name: 'Cash on Delivery', icon: CashIcon },
        { name: 'Digital Wallet', icon: DigitalWalletIcon }
    ];

    const progressSteps = [
        { label: 'Cart', description: 'Review items' },
        { label: 'Details', description: 'Add delivery info' },
        { label: 'Payment', description: 'Choose your method' },
        { label: 'Confirm', description: 'Place your order' }
    ];

    const currentStep = 2;
    const progressPercent = (currentStep / (progressSteps.length - 1)) * 100;

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        const newOrder: Order = { id: new Date().toISOString(), date: new Date().toLocaleString(), items: [...cartItems], totalPrice: totalPrice };

        setTimeout(() => {
            clearCart();
            onOrderSuccess(newOrder);
        }, 3000);
    };

    if (isProcessing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 bg-gradient-to-b from-[var(--bg-color)] to-stone-900">
                <div className="glass-panel rounded-3xl p-12 text-center max-w-md">
                    <div className="w-20 h-20 border-4 border-[var(--glow-color)] border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
                    <p className="font-magic text-3xl text-[var(--glow-color)] mb-3">Processing Your Order...</p>
                    <p className="text-[var(--text-muted-color)] text-lg">Please wait a moment while we prepare your magical experience.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-950 via-black to-stone-950 pt-10 pb-16">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col gap-8 mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                        <div className="space-y-3 max-w-2xl">
                            <p className="text-xs uppercase tracking-[0.4em] text-[var(--glow-color)]">Checkout</p>
                            <h1 className="font-magic text-3xl sm:text-4xl text-white">Complete Your Order</h1>
                            <p className="text-slate-400 text-sm">Review your details, lock in a payment method, and well brew your favorites straight away.</p>
                        </div>
                        <button
                            onClick={onBackToShop}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300 transition-all duration-200 hover:border-white/40 hover:text-white"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to shop
                        </button>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_60px_-48px_rgba(229,181,62,0.45)] backdrop-blur-lg">
                        <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--glow-color)]" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className="mt-6 grid gap-6 text-center sm:grid-cols-2 md:grid-cols-4">
                            {progressSteps.map((step, idx) => {
                                const isActive = idx <= currentStep;
                                return (
                                    <div key={step.label} className="flex flex-col items-center gap-2">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition duration-300 ${
                                                isActive
                                                    ? 'border-[var(--glow-color)] bg-[var(--glow-color)] text-black shadow-[0_15px_35px_-20px_rgba(229,181,62,0.7)]'
                                                    : 'border-white/15 bg-white/5 text-slate-300'
                                            }`}
                                        >
                                            {idx + 1}
                                        </div>
                                        <p
                                            className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${
                                                isActive ? 'text-[var(--glow-color)]' : 'text-slate-500'
                                            }`}
                                        >
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-slate-400 max-w-[160px]">{step.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <form onSubmit={handlePlaceOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                        {/* Left Column: Form Details */}
                        <div className="lg:col-span-4 space-y-6">
                             <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_55px_-46px_rgba(0,0,0,0.7)] backdrop-blur-lg">
                                <h2 className="font-magic text-lg text-white tracking-[0.3em] mb-4">Delivery Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="firstName" className="block text-xs font-semibold text-slate-300 mb-1.5">First Name</label>
                                        <input type="text" id="firstName" className="form-input" required />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name</label>
                                        <input type="text" id="lastName" className="form-input" required />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                                        <input type="email" id="email" className="form-input" required />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                                        <input type="tel" id="phone" className="form-input" required />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address" className="block text-xs font-semibold text-slate-300 mb-1.5">Delivery Address</label>
                                        <input type="text" id="address" className="form-input" required />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="instructions" className="block text-xs font-semibold text-slate-300 mb-1.5">Delivery Instructions (Optional)</label>
                                        <textarea id="instructions" rows={2} className="form-input text-sm" placeholder="e.g., Ring the doorbell twice..."></textarea>
                                    </div>
                                </div>
                            </div>

                             <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_55px_-46px_rgba(0,0,0,0.7)] backdrop-blur-lg">
                                <h2 className="font-magic text-lg text-white tracking-[0.3em] mb-4">Payment Method</h2>
                                <div className="space-y-2">
                                    {paymentOptions.map(option => (
                                        <button 
                                            key={option.name} 
                                            type="button" 
                                            onClick={() => setSelectedPayment(option.name)} 
                                            className={`group w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 shadow-[0_18px_36px_-32px_rgba(0,0,0,0.7)] ${
                                                selectedPayment === option.name 
                                                    ? 'bg-white/5 border-[var(--glow-color)]' 
                                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-md ${
                                                selectedPayment === option.name 
                                                    ? 'bg-[var(--glow-color)] text-black' 
                                                    : 'bg-stone-800 text-slate-300 group-hover:bg-stone-700'
                                            }`}>
                                                <option.icon />
                                            </div>
                                            <span className={`flex-grow font-medium text-sm ${
                                                selectedPayment === option.name 
                                                    ? 'text-white' 
                                                    : 'text-slate-300'
                                            }`}>{option.name}</span>
                                            {selectedPayment === option.name && (
                                                <svg className="w-5 h-5 text-[var(--glow-color)]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-24">
                                <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-6 flex flex-col shadow-[0_24px_60px_-50px_rgba(0,0,0,0.75)] backdrop-blur-lg" style={{maxHeight: 'calc(100vh - 6rem)'}}>
                                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                        <div>
                                            <h3 className="font-magic text-lg text-white tracking-[0.3em]">Order Summary</h3>
                                            <p className="mt-1 text-[11px] uppercase tracking-[0.35em] text-slate-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready</p>
                                        </div>
                                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">Step 3 of 4</span>
                                    </div>
                                    <div className="mt-4 space-y-3 overflow-y-auto pr-2 grow hide-scrollbar">
                                        {cartItems.map(item => (
                                            <div key={item.name} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                                                <div className="flex-grow overflow-hidden">
                                                    <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                                                    <p className="text-slate-400 text-xs">{item.quantity} × ₱{item.price.toFixed(2)}</p>
                                                </div>
                                                <span className="text-white font-semibold text-sm whitespace-nowrap">₱{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="shrink-0 pt-4 border-t border-white/5 space-y-4">
                                        {/* Voucher Input */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Voucher Code</label>
                                            {appliedVoucher ? (
                                                <div className="flex items-center justify-between bg-green-900/20 border border-green-600/30 rounded-lg p-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-xs font-semibold text-green-300">{appliedVoucher.code}</span>
                                                    </div>
                                                    <button type="button" onClick={handleRemoveVoucher} className="text-xs text-red-400 hover:text-red-300">
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <div className="flex gap-1.5">
                                                        <input 
                                                            type="text" 
                                                            value={voucherCode}
                                                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                                            placeholder="Enter code"
                                                            className="form-input text-sm flex-grow"
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={handleApplyVoucher}
                                                            className="px-3 py-2 rounded-lg bg-[var(--glow-color)] text-black text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                    {voucherError && (
                                                        <p className="text-xs text-red-400">{voucherError}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3 pt-2 border-t border-white/5">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400">Subtotal</span>
                                                <span className="text-white font-medium">₱{subtotal.toFixed(2)}</span>
                                            </div>
                                            {appliedVoucher && (
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-green-400">Discount ({appliedVoucher.code})</span>
                                                    <span className="text-green-400 font-medium">-₱{discount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400">Delivery</span>
                                                <span className="text-green-400 font-medium">FREE</span>
                                            </div>
                                            <div className="flex justify-between items-center text-base font-bold text-white pt-2 border-t border-white/5">
                                                <span>Total</span>
                                                <span className="text-[var(--glow-color)]">₱{totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <button type="submit" className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--glow-color)] via-amber-400 to-yellow-500 py-3.5 text-base font-semibold text-black shadow-[0_22px_55px_-25px_rgba(229,181,62,0.55)] transition-transform duration-300 hover:-translate-y-0.5">
                                            <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.3em]">
                                                Place Order
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                            <span className="absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                                        </button>
                                        <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-2">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11.5v-2m0 8.5a9 9 0 100-18 9 9 0 000 18zm0-4.5h.01" />
                                            </svg>
                                            Transactions sealed with enchanted encryption.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};