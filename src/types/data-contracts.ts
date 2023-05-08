export interface IUserData {
	login: string
	password: string
}

export interface IRequestBase {
	token: string
}

export interface ILoginResponse {
	user: string
	token: string
}
