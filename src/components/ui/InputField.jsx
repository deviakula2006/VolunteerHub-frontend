import { motion } from "framer-motion";

export default function InputField({ label, type = "text", value, onChange, placeholder, required = false, className = "", icon: Icon }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-white/80 ml-1">
                    {label} {required && <span className="text-emerald-400">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`
            w-full p-3 rounded-xl bg-white/10 
            border border-white/10 text-white
            placeholder:text-white/40
            focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 
            outline-none transition-all
            ${Icon ? "pl-10" : ""}
          `}
                />
            </div>
        </div>
    );
}
