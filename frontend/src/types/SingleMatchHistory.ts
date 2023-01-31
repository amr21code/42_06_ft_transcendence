interface ISingleMatchHistory {
	match_status: number,
	match_id: string,
	user1: string,
	user1_score: number,
	user2: string,
	user2_score: number,
}

export type { ISingleMatchHistory }