export interface IUser {
    _id?: string,
    username: string,
    email: string,
    password: string,
    profilePic?: any,
    bio: string,
    token?: string
    role?: string
}