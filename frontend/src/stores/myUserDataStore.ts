import type { IUser } from "@/types/User";
import type { SelectedSideWindow } from "@/types/SelectedSideWindow";
import { defineStore } from "pinia"
import type { IFriend } from "@/types/Friend";
import DataService from "@/services/DataService";
import type { ResponseData } from "@/types/ResponseData";

export const useUserDataStore = defineStore('store', {
	state: () => ({
		user: {} as IUser,
		friends: [] as IFriend[],
		allUsers: [] as IUser[],
		loggedIn: true,
		userDataPopupTrigger: false,
		gotChallengedPopupTrigger: false,
		selected: 'game' as SelectedSideWindow,
	}),
	actions: {
		async getUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data[0];
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
		async getFriends() {
			await DataService.getFriends()
			.then((response: ResponseData) => {
				this.friends = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
		async getAllUsers() {
			await DataService.getAll()
			.then((response: ResponseData) => {
				this.allUsers = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
	}
});