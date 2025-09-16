// @ts-nocheck
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { apiClient, getToken, setToken, removeToken } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (code: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 토큰이 있으면 사용자 정보 가져오기
    useEffect(() => {
        const initAuth = async () => {
            const token = getToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const { user: userData } = await apiClient.auth.getMe();
                setUser(userData);
            } catch (error) {
                console.error('사용자 정보 로드 실패:', error);
                removeToken();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    // 카카오 로그인 처리
    const login = async (code: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const { token, user: userData } = await apiClient.auth.kakaoCallback(code);

            setToken(token);
            setUser(userData);

            toast.success(`${userData.nickname}님, 환영합니다! 🎉`);
            return true;
        } catch (error) {
            console.error('로그인 실패:', error);
            toast.error('로그인에 실패했습니다. 다시 시도해 주세요.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // 로그아웃 처리
    const logout = async () => {
        try {
            await apiClient.auth.logout();
        } catch (error) {
            console.error('로그아웃 API 호출 실패:', error);
        } finally {
            removeToken();
            setUser(null);
            toast.success('로그아웃되었습니다.');
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth 커스텀 훅
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
    }
    return context;
};
