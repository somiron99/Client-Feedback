import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-3xl shadow-[#4B2182]/20 border border-white/50 animate-modal-in overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4B2182]/5 to-transparent rounded-full translate-x-12 -translate-y-12"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-[#4B2182]/5 text-[#4B2182]'
                        }`}>
                        {type === 'danger' ? <AlertCircle size={40} strokeWidth={2.5} /> : <CheckCircle2 size={40} strokeWidth={2.5} />}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">{title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed mb-10">{message}</p>

                    <div className="flex w-full gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-8 py-4 rounded-2xl font-black text-sm text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl ${type === 'danger'
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-[#4B2182] hover:bg-[#F58220] shadow-[#4B2182]/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
