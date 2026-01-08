import { User } from './models';

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status_code?: number;
}
