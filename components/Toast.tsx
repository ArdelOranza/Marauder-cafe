import React from 'react';
import { useToast } from '../contexts/ToastContext';

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const InfoCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-0 right-0 p-4 space-y-3 z-[9999]">
            {toasts.map(toast => (
                <div 
                    key={toast.id}
                    className="panel-background rounded-lg shadow-2xl p-4 w-80 max-w-sm flex items-start gap-4 animate-fade-in-up"
                >
                    <div className="flex-shrink-0 mt-0.5">
                        {toast.type === 'success' ? <CheckCircleIcon /> : <InfoCircleIcon />}
                    </div>
                    <p className="flex-grow text-[var(--text-color)] text-sm">{toast.message}</p>
                    <button onClick={() => removeToast(toast.id)} className="text-[var(--text-muted-color)] hover:text-white flex-shrink-0">&times;</button>
                </div>
            ))}
        </div>
    );
};