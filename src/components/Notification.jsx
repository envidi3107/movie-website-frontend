import { useEffect, useState } from 'react';

export default function Notification({ message, type, onClose }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 6000); // Auto close after 6s matching the progress bar

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for exit animation
    };

    return (
        <div
            className={`fixed top-4 right-4 z-9999 flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white dark:bg-[#1f1629] divide-x divide-gray-200 dark:divide-gray-700 rounded-lg shadow-2xl dark:text-gray-400 border border-gray-100 dark:border-white/5 transition-all duration-300 ease-in-out ${isExiting ? 'translate-x-[120%] opacity-0' : 'animate-slide-in-right'}`}
        >
            <div
                className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${type === 'error' ? 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200' : 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200'}`}
            >
                <span className="material-symbols-outlined text-xl">
                    {type === 'error' ? 'error' : 'check_circle'}
                </span>
            </div>
            <div className="pl-4 text-sm font-normal dark:text-gray-200 w-full relative">
                <div className="mb-1 pr-4">{message}</div>
                <div className="absolute bottom-0 left-0 h-0.5 bg-gray-200 dark:bg-gray-700 w-full mt-2 overflow-hidden rounded-full">
                    <div
                        className={`h-full ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} animate-progress-6s`}
                    ></div>
                </div>
            </div>
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-white dark:bg-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex h-8 w-8 transition-colors"
                onClick={handleClose}
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    );
}