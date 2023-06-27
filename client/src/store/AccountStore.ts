import { defineStore } from "pinia";

interface State {
    account: Account;
}

export const useAccountStore = defineStore("account", {
    state: (): State => {
        return {
            account: {
                accountId: "",
                username: "",
                role: Role.REGULAR,
                createdAt: new Date(),
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
            return state.account.accountId !== "";
        },
        getAccount: (state: State) => {
            return state.account;
        }
    }
});

interface Account {
    accountId?: string;
    username?: string;
    role?: Role;
    createdAt?: Date;

}

enum Role {
    ADMIN = "admin",
    SUPER = "super",
    REGULAR = "regular"
}