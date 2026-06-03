import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export const useCommonStore = create(
    persist(
        (set) => ({
            model: 'deepseek-v4-flash',
            deepSeekKey: null,
            douBaoKey: null,
            setModel: (model: string) => set({model}),
            setDeepSeekKey: (key: string) => set({deepSeekKey: key}),
            setDouBaoKey: (key: string) => set({douBaoKey: key}),
        }),
        {
            name: 'commonStore',
        }
    )
)