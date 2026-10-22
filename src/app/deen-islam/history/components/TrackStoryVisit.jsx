"use client";

import { useEffect } from "react";
import {
    MAX_RECENT_STORIES,
    RECENT_EVENT,
    RECENT_STORAGE_KEY,
} from "../data/prophets";

export default function TrackStoryVisit({ slug }) {
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            const current = Array.isArray(parsed)
                ? parsed.filter((item) => typeof item === "string")
                : [];

            const next = [slug, ...current.filter((item) => item !== slug)].slice(
                0,
                MAX_RECENT_STORIES
            );

            window.localStorage.setItem(
                RECENT_STORAGE_KEY,
                JSON.stringify(next)
            );
            window.dispatchEvent(new Event(RECENT_EVENT));
        } catch {
            // Storage can be unavailable in private browsing; reading still works.
        }
    }, [slug]);

    return null;
}
