import { create } from 'zustand'

{{#if typescript}}
interface CounterState {
    count: number
    increment: () => void
    decrement: () => void
}
{{/if}}

export const useStore = create{{#if typescript}}<CounterState>{{/if}}((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
}))
