import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
