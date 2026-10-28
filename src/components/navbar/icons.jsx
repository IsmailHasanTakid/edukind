import { Menu, X } from "lucide-react";

export const MenuIcon = (p) => <Menu size={20} strokeWidth={1.75} aria-hidden="true" {...p} />;
export const CloseIcon = (p) => <X size={20} strokeWidth={1.75} aria-hidden="true" {...p} />;



export const BrandMark = (p) => (
    <svg
        width="26"
        height="26"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        focusable="false"
        {...p}
    >
        <defs>
            <linearGradient
                id="ek-premium-gradient"
                x1="2"
                y1="2"
                x2="34"
                y2="34"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#67E8F9" />
                <stop offset="0.35" stopColor="#38BDF8" />
                <stop offset="0.7" stopColor="#818CF8" />
                <stop offset="1" stopColor="#D8B4FE" />
            </linearGradient>
        </defs>

        {/* E */}

        {/* Stylish E */}
        <path
            d="M14 7H5V29H14M5 18H12"
            stroke="url(#ek-premium-gradient)"
            strokeWidth="3.2"
            strokeLinecap="square"
            strokeLinejoin="round"
        />

        {/* Futuristic K */}
        <path
            d="M22 7V29M22 18L31 7M22 18L31 29"
            stroke="url(#ek-premium-gradient)"
            strokeWidth="3.2"
            strokeLinecap="square"
            strokeLinejoin="round"
        />

    </svg>
);

