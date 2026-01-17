import { atom } from 'jotai';

// Counter atom
export const countAtom = atom(0);

// Derived atom (computed value)
export const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Async atom example
export const userAtom = atom<{ name: string; email: string } | null>(null);

// Writable derived atom
export const incrementAtom = atom(
    (get) => get(countAtom),
    (get, set, _arg) => set(countAtom, get(countAtom) + 1)
);
