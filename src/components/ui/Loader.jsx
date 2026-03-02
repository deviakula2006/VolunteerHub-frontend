import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-white/60 text-sm">{text}</p>
        </div>
    );
}

export function SkeletonLoader({ className = "" }) {
    return (
        <div className={`animate-pulse bg-white/10 rounded-xl ${className}`}></div>
    );
}
