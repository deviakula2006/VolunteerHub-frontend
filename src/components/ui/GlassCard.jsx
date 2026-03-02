const GlassCard = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-white/5 
        backdrop-blur-xl 
        border border-white/10 
        rounded-2xl 
        p-6 
        shadow-[0_0_30px_rgba(16,185,129,0.1)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;