import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useUserStore = create(
	persist(
		(set) => ({
			token: null,
			isAuthenticated: false,
			activeWeight: null,
			login: (token, user, weight) => {
				set({ token, user, isAuthenticated: true, activeWeight: weight })
			},
			logout: () => {
				set({ token: null, user: null, isAuthenticated: false })
			},
			setActiveWeight: (weight) => {
				set({ activeWeight: weight })
			},
		}),
		{
			name: 'userAuth',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export default useUserStore
