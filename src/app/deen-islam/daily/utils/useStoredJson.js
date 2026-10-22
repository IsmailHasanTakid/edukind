"use client";

import { useCallback, useSyncExternalStore } from "react";

const SERVER_SNAPSHOT = Symbol("stored-json-server");

const listeners = new Map();
const snapshotCache = new Map();
const memoryStore = new Map();
let storageListenerBound = false;

function bindStorageListener() {
    if (storageListenerBound || typeof window === "undefined") return;

    window.addEventListener("storage", (event) => {
        if (!event.key) return;

        if (event.newValue === null) {
            memoryStore.delete(event.key);
        } else {
            memoryStore.set(event.key, event.newValue);
        }

        notify(event.key);
    });

    storageListenerBound = true;
}

function notify(key) {
    const subscribers = listeners.get(key);
    if (!subscribers) return;

    for (const callback of subscribers) callback();
}

function subscribe(key, callback) {
    bindStorageListener();

    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(callback);

    return () => {
        listeners.get(key)?.delete(callback);
    };
}

function readRaw(key) {
    if (memoryStore.has(key)) return memoryStore.get(key);

    try {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) memoryStore.set(key, raw);
        return raw;
    } catch {
        return null;
    }
}

function readValue(key, fallback) {
    const raw = readRaw(key);
    const cached = snapshotCache.get(key);

    if (cached && cached.raw === raw) return cached.value;

    let value = fallback;

    if (raw !== null) {
        try {
            value = JSON.parse(raw);
        } catch {
            value = fallback;
        }
    }

    snapshotCache.set(key, { raw, value });
    return value;
}

export function useStoredJson(key, fallback) {
    const getSnapshot = useCallback(
        () => readValue(key, fallback),
        [key, fallback]
    );

    const getServerSnapshot = useCallback(() => SERVER_SNAPSHOT, []);

    const snapshot = useSyncExternalStore(
        useCallback((callback) => subscribe(key, callback), [key]),
        getSnapshot,
        getServerSnapshot
    );

    const setValue = useCallback(
        (next) => {
            const current = readValue(key, fallback);
            const value =
                typeof next === "function" ? next(current) : next;
            const raw = JSON.stringify(value);

            memoryStore.set(key, raw);
            snapshotCache.set(key, { raw, value });

            try {
                window.localStorage.setItem(key, raw);
            } catch {
                // The in-memory snapshot still keeps the current session usable.
            }

            notify(key);
        },
        [key, fallback]
    );

    const ready = snapshot !== SERVER_SNAPSHOT;

    return [ready ? snapshot : fallback, ready, setValue];
}
