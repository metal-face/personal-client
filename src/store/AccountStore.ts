import { defineStore } from "pinia";
import { Account, Role } from "@/models/Account";

interface State {
    account: Account;
    blankAccount: Account;
}

// TODO: REFACTOR TO USE COMPOSITION API

export const useAccountStore = defineStore("account", {
    state: (): State => {
        return {
            account: {
                account_id: "",
                username: "",
                role: Role.REGULAR,
                email: "",
                created_at: new Date(),
            },
            blankAccount: {
                account_id: "",
                username: "",
                role: Role.REGULAR,
                email: "",
                created_at: new Date(),
            },
        };
    },
    actions: {
        setAccount(account: Account) {
            Object.assign(this.account, account);
        },
        clearAccount(): void {
            Object.assign(this.account, this.blankAccount);
        },
        determineFailureReason(rawReason: string): string {
            switch (rawReason) {
                case "accounts.signup_failed":
                    return "Registration has failed.";
                case "accounts.deletion_failed":
                    return "Failed to delete this account!";
                case "accounts.not_found":
                    return "Account could not be found!";
                case "accounts.username_invalid":
                    return "The username you submitted is invalid!";
                case "accounts.password_invalid":
                    return "The password you submitted is invalid";
                case "accounts.email_not_found":
                    return "Email could not be found!";
                case "accounts.email_address_invalid":
                    return "The email you submitted is invalid";
                case "accounts.email_address_exists":
                    return "An account with that email already exists!";
                case "accounts.username_exists":
                    return "Username already exists!";
                default:
                    return "Error! Registration failure!";
            }
        },
    },
    getters: {
        isAdmin: (state: State) => {
            return state.account.role === Role.ADMIN;
        },
        isSuper: (state: State) => {
            return state.account.role === Role.SUPER;
        },
        isRegular: (state: State) => {
            return state.account.role === Role.REGULAR;
        },
        isLoggedIn: (state: State) => {
            return state.account.account_id !== "";
        },
        getAccount: (state: State) => {
            return state.account;
        },
    },
});
