import { defineStore } from "pinia";
import { Account, Role } from "@/models/Account";


interface State {
    account: Account;
}

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
        }
    },
    actions: {
        setAccount(account: Account) {
            Object.assign(this.account, account);
        }
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
        }
    }
});