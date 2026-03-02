import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", delay = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.01 }}
      onClick={onClick}
      className={`
        bg-white/5 
        backdrop-blur-xl 
        border border-white/10 
        rounded-2xl 
        p-6 
        shadow-[0_0_30px_rgba(16,185,129,0.1)]
        transition-colors
        hover:border-emerald-500/30
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;