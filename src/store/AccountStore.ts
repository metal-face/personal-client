import { defineStore } from "pinia";
import { Account, Role } from "@/models/Account";
import { computed, ComputedRef, Ref, ref } from "vue";

export const useAccountStore = defineStore("account", () => {
    const account: Ref<Account> = ref<Account>({
        account_id: "",
        username: "",
        role: Role.REGULAR,
        email: "",
        created_at: new Date(),
    });

    const blankAccount: Ref<Account> = ref<Account>({
        account_id: "",
        username: "",
        role: Role.REGULAR,
        email: "",
        created_at: new Date(),
    });

    function setAccount(payload: Account): void {
        account.value = payload;
    }

    function clearAccount(): void {
        account.value = blankAccount.value;
    }

    function determineFailureReason(rawReason: string): string {
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
    }

    const isAdmin: ComputedRef<boolean> = computed<boolean>(() => {
        return account.value.role === Role.ADMIN;
    });

    const getAccount: ComputedRef<Account> = computed<Account>(() => {
        return account.value;
    });

    const isLoggedIn: ComputedRef<boolean> = computed<boolean>(() => {
        return account.value.account_id !== "";
    });

    return {
        account,
        blankAccount,
        setAccount,
        clearAccount,
        determineFailureReason,
        isAdmin,
        getAccount,
        isLoggedIn,
    };
});
