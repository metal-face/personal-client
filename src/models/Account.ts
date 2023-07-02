export enum Role {
    ADMIN = "ADMIN",
    SUPER = "SUPER",
    REGULAR = "REGULAR",
}
export interface Account {
    account_id?: string;
    username?: string;
    email?: string;
    role?: Role;
    created_at?: Date;
}