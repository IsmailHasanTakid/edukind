import { Menu, X } from "lucide-react";

export const MenuIcon = (p) => <Menu size={20} strokeWidth={1.75} aria-hidden="true" {...p} />;
export const CloseIcon = (p) => <X size={20} strokeWidth={1.75} aria-hidden="true" {...p} />;

export const BrandMark = (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...p}>
        <defs>
            <linearGradient id="nx-g" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="0.6" stopColor="#4f8cff" />
                <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        <path d="M5 20V4l14 16V4" stroke="url(#nx-g)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);