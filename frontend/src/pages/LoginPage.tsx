// @ts-nocheck
import React from 'react';
import { KakaoLogin } from '../components/auth/KakaoLogin';

export const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <KakaoLogin />
            </div>
        </div>
    );
};
