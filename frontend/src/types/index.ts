// 사용자 타입
export interface User {
    id: number;
    nickname: string;
    profile_image?: string;
    email?: string;
    created_at: string;
}

// D-DAY 타입
export interface DDay {
    id: number;
    user_id: number;
    title: string;
    target_date: string;
    description?: string;
    created_at: string;
    updated_at: string;
    days_remaining?: number;
}

// API 응답 타입
export interface ApiResponse<T = any> {
    message?: string;
    data?: T;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface DDaysResponse {
    ddays: DDay[];
}

export interface DDayResponse {
    dday: DDay;
}

// 폼 데이터 타입
export interface CreateDDayForm {
    title: string;
    target_date: string;
    description?: string;
}

export interface UpdateDDayForm {
    title?: string;
    target_date?: string;
    description?: string;
}

// API 에러 타입
export interface ApiError {
    error: string;
    message: string;
}
