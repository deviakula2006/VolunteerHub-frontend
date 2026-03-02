import { motion } from "framer-motion";

export default function PrimaryButton({ children, onClick, disabled, className = "", type = "button" }) {
    return (
        <motion.button
            type={type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={disabled}
            className={`
        bg-emerald-500 hover:bg-emerald-600 
        transition-colors p-3 rounded-xl 
        font-semibold shadow-lg shadow-emerald-500/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {children}
        </motion.button>
    );
}
