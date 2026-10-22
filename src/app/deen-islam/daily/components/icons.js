import {
    Bath,
    BookOpen,
    CloudSun,
    DoorOpen,
    Droplets,
    HandHeart,
    Heart,
    Landmark,
    Moon,
    MoonStar,
    Plane,
    Sparkles,
    Sun,
    Sunrise,
    Sunset,
    Utensils,
} from "lucide-react";

const ICONS = {
    sunrise: Sunrise,
    sun: Sun,
    "cloud-sun": CloudSun,
    sunset: Sunset,
    "moon-star": MoonStar,
    moon: Moon,
    utensils: Utensils,
    door: DoorOpen,
    plane: Plane,
    sparkles: Sparkles,
    droplets: Droplets,
    bath: Bath,
    prayer: Landmark,
    heart: Heart,
    book: BookOpen,
    "hand-heart": HandHeart,
};

export function getIcon(name) {
    return ICONS[name] ?? Sparkles;
}

export function DeenIcon({ name, ...props }) {
    const Component = ICONS[name] ?? Sparkles;
    return <Component {...props} />;
}
