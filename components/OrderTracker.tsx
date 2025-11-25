import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface OrderTrackerProps {
    order: Order | null;
    onClose: () => void;
}

// --- THEMATIC ICONS ---
const ScrollIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.5l6 2.25 6-2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.5v9.75l6 2.25 6-2.25V6.5" />
        <path strokeLinecap="round" d="M9.75 8.25v8" />
        <path strokeLinecap="round" d="M12.75 7.5v8" />
    </svg>
);

const BeakerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v4.5L7.2 15.24a2.75 2.75 0 002.37 4.26h4.86a2.75 2.75 0 002.37-4.26L14.25 8.25v-4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.85 12.75h6.3" />
    </svg>
);

const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
        <rect x="3" y="8.25" width="11" height="7.5" rx="1.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 11.25h3.15a1.5 1.5 0 011.2.6l1.65 2.1a1.5 1.5 0 01.3.9v0a1.5 1.5 0 01-1.5 1.5H14" />
        <circle cx="7.25" cy="17.5" r="1.75" />
        <circle cx="16.75" cy="17.5" r="1.75" />
    </svg>
);

const FlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5v15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 5.5h9.5a1.5 1.5 0 011.2 2.4L16.5 9.75l1.2 1.85a1.5 1.5 0 01-1.2 2.4H7" />
    </svg>
);


const deliveryStatuses = [
    { text: "Summoning the Owl Post", duration: 3000, icon: ScrollIcon },
    { text: "Brewing Your Potions", duration: 6000, icon: BeakerIcon },
    { text: "Dispatched via Knight Bus", duration: 8000, icon: TruckIcon },
    { text: "Mischief Managed & Delivered!", duration: Infinity, icon: FlagIcon },
];

const StatusNode: React.FC<{ text: string; icon: React.FC<any>; isActive: boolean; isCompleted: boolean; }> = ({ text, icon: Icon, isActive, isCompleted }) => (
    <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
            ${(isCompleted || isActive) ? 'bg-[var(--glow-color)] border-[var(--glow-color)]' : 'bg-stone-700 border-stone-600'}
            ${isActive ? 'scale-110 shadow-lg shadow-amber-900/50 animate-pulse' : ''}
        `}>
            <Icon className={`w-5 h-5 transition-colors duration-500 ${(isCompleted || isActive) ? 'text-black' : 'text-stone-400'}`} />
        </div>
        <span className={`ml-4 text-lg transition-colors duration-500 ${isActive || isCompleted ? 'text-[var(--text-color)] font-bold' : 'text-[var(--text-muted-color)]'}`}>{text}</span>
    </div>
);

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order, onClose }) => {
    const [statusIndex, setStatusIndex] = useState(0);

    useEffect(() => {
        if (order) {
            setStatusIndex(0);
            let cumulativeDelay = 0;
            const timeouts = deliveryStatuses.map((status, index) => {
                if (index < deliveryStatuses.length - 1) {
                   cumulativeDelay += status.duration;
                   return setTimeout(() => {
                        setStatusIndex(index + 1);
                    }, cumulativeDelay);
                }
                return null;
            });
            return () => { timeouts.forEach(t => t && clearTimeout(t)); };
        }
    }, [order]);

    if (!order) return null;

    const progressPercentage = (statusIndex / (deliveryStatuses.length - 1)) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl p-8 text-center relative animate-fadeInUp">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-3xl text-[var(--text-muted-color)] hover:text-white z-10"
                    aria-label="Close order tracker"
                >
                    &times;
                </button>
                <h2 className="font-magic text-4xl text-white mb-2">Order Tracking</h2>
                <p className="text-[var(--text-muted-color)] mb-8">Your order #{order.id.slice(-6)} is on its way!</p>

                <div className="relative pl-4">
                    {/* Vertical line background */}
                    <div className="absolute left-[15px] top-0 h-full w-0.5 bg-stone-700 rounded-full"></div>
                    {/* Vertical line progress */}
                    <div 
                        className="absolute left-[15px] top-0 w-0.5 bg-[var(--glow-color)] rounded-full transition-all duration-1000 ease-linear"
                        style={{ height: `${progressPercentage}%` }}
                    ></div>

                    <div className="relative space-y-8">
                        {deliveryStatuses.map((status, index) => (
                            <StatusNode 
                                key={index} 
                                text={status.text} 
                                icon={status.icon}
                                isActive={index === statusIndex} 
                                isCompleted={index < statusIndex} 
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-10">
                   {statusIndex === deliveryStatuses.length - 1 ? (
                     <button 
                        onClick={onClose} 
                        className="btn btn-primary w-full text-lg">
                        Excellent!
                    </button>
                   ) : (
                    <p className="text-[var(--glow-color)] animate-pulse">Your order is in progress...</p>
                   )}
                </div>
            </div>
        </div>
    );
};