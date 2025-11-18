import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface OrderTrackerProps {
    order: Order | null;
    onClose: () => void;
}

// --- THEMATIC ICONS ---
const ScrollIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const BeakerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.512 1.422l-1.636 2.182a2.25 2.25 0 00.34 3.238l5.836 4.377a2.25 2.25 0 003.238-.34l1.636-2.182a2.25 2.25 0 00.512-1.422V3.104a2.25 2.25 0 00-2.25-2.25H12a2.25 2.25 0 00-2.25 2.25z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.25 12.75l.583 1.166a2.25 2.25 0 003.334 0l.583-1.166M12.75 3.104V2.25h-1.5v.854" />
    </svg>
);

const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeWidth="1.5" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 12V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5" />
    </svg>
);

const FlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
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