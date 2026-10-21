import {
    Hind_Siliguri,
    Amiri,
    Cormorant_Garamond,
    Noto_Serif_Bengali,
} from "next/font/google";

export const bangla = Hind_Siliguri({
    subsets: ["bengali", "latin"],
    weight: ["400", "500", "600", "700"],
});
export const bnSerif = Noto_Serif_Bengali({
    subsets: ["bengali"],
    weight: ["600", "700"],
});
export const arabic = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });
export const serif = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
});