import { Role } from "@/types/auth";

export const getRedirectPath = (role: Role): string => {
    console.log('getRedirectPath - role:', role);

    switch (role) {
        case "SUPER_ADMIN":
            return "/super-admin";
        case "ADMIN":
            return "/admin";
        case "DOCTOR":
            return "/doctor";
        default:
            return "/";
    }
};