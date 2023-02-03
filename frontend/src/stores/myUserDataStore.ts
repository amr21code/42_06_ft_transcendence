import type { IUser } from "@/types/User";
import type { SelectedSideWindow } from "@/types/SelectedSideWindow";
import { defineStore } from "pinia"
import type { IFriend } from "@/types/Friend";

export const useUserDataStore = defineStore('store', {
	state: () => ({
		user: {} as IUser,
		friends: [] as IFriend[],
		allUsers: [] as IUser[],
		loggedIn: true,
		userDataPopupTrigger: false,
		gotChallengedPopupTrigger: false,
		selected: {} as SelectedSideWindow,
	}),
	
});