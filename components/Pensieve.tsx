import React from 'react';
import { Order } from '../types';
import { useCart } from '../contexts/CartContext';

interface PensieveProps {
    isOpen: boolean;
    onClose: () => void;
    orders: Order[];
}

const ReorderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
)

export const Pensieve: React.FC<PensieveProps> = ({ isOpen, onClose, orders }) => {
    const { addMultipleToCart } = useCart();

    const handleReorder = (order: Order) => {
        addMultipleToCart(order.items);
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[var(--panel-bg-color)] shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
                        <h2 className="font-magic text-2xl text-[var(--text-color)]">
                             Order History
                        </h2>
                        <button onClick={onClose} className="text-3xl text-[var(--text-muted-color)] hover:text-white">&times;</button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-6">
                        {orders.length === 0 ? (
                            <p className="text-[var(--text-muted-color)] text-center mt-8">You have no past orders. Place an order to see it here.</p>
                        ) : (
                            <div className="space-y-6">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-black/20 p-4 rounded-lg border border-[var(--border-color)] shadow-md">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-bold text-[var(--text-color)]">Order from {order.date}</p>
                                                <p className="text-sm text-[var(--glow-color)] font-bold">Total: ₱{order.totalPrice.toFixed(2)}</p>
                                                <p className="text-xs text-[var(--text-muted-color)]">Service: {order.serviceMode === 'dine-in' ? 'Dine-In' : 'Take-Out'}{order.queueNumber ? ` | Queue #${order.queueNumber}` : ''}</p>
                                            </div>
                                            <button onClick={() => handleReorder(order)} className="btn btn-secondary text-sm py-2 px-3 flex items-center gap-2">
                                                <ReorderIcon />
                                                Reorder
                                            </button>
                                        </div>
                                        <ul className="text-[var(--text-muted-color)] text-sm space-y-1">
                                           {order.items.map(item => (
                                               <li key={item.name} className="flex items-center gap-2">
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
            </div>
        </div>
    );
};