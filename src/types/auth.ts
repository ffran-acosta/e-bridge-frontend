export type Role = "doctor" | "admin";

export type User = {
    id: string;
    email: string;
    full_name: string;
    role: Role;
};

export type LoginResponse = {
    user: User;
    token?: string;
};
