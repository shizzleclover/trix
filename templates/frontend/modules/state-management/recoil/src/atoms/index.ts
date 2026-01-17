import { atom, selector } from 'recoil';

// Counter atom
export const countState = atom({
    key: 'countState',
    default: 0,
});

// Derived selector (computed value)
export const doubleCountState = selector({
    key: 'doubleCountState',
    get: ({ get }) => get(countState) * 2,
});

// User atom
export const userState = atom<{ name: string; email: string } | null>({
    key: 'userState',
    default: null,
});

// Async selector example
export const userDataState = selector({
    key: 'userDataState',
    get: async () => {
        // Replace with actual API call
        const response = await fetch('/api/user');
        return response.json();
    },
});
