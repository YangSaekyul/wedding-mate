import axios, { AxiosError } from 'axios';
import { ApiError, AuthResponse, DDaysResponse, DDayResponse, CreateDDayForm, UpdateDDayForm } from '../types';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 토큰 관리
export const getToken = (): string | null => {
    return localStorage.getItem('wedding_mate_token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('wedding_mate_token', token);
};

export const removeToken = (): void => {
    localStorage.removeItem('wedding_mate_token');
};

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
            // 인증 토큰 만료 또는 유효하지 않음
            removeToken();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// API 메서드들
export const apiClient = {
    // 인증 관련
    auth: {
        getKakaoAuthUrl: async (): Promise<{ authUrl: string }> => {
            const { data } = await api.get('/auth/kakao');
            return data;
        },

        kakaoCallback: async (code: string): Promise<AuthResponse> => {
            const { data } = await api.post('/auth/kakao/callback', { code });
            return data;
        },

        getMe: async (): Promise<{ user: any }> => {
            const { data } = await api.get('/auth/me');
            return data;
        },

        logout: async (): Promise<void> => {
            await api.post('/auth/logout');
        },
    },

    // D-DAY 관련
    ddays: {
        getAll: async (): Promise<DDaysResponse> => {
            const { data } = await api.get('/ddays');
            return data;
        },

        getById: async (id: number): Promise<DDayResponse> => {
            const { data } = await api.get(`/ddays/${id}`);
            return data;
        },

        create: async (dday: CreateDDayForm): Promise<DDayResponse> => {
            const { data } = await api.post('/ddays', dday);
            return data;
        },

        update: async (id: number, dday: UpdateDDayForm): Promise<DDayResponse> => {
            const { data } = await api.put(`/ddays/${id}`, dday);
            return data;
        },

        delete: async (id: number): Promise<{ message: string }> => {
            const { data } = await api.delete(`/ddays/${id}`);
            return data;
        },
    },
};

// 에러 메시지 추출 유틸리티
export const getErrorMessage = (error: any): string => {
    if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return apiError?.message || '알 수 없는 오류가 발생했습니다.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return '알 수 없는 오류가 발생했습니다.';
};
