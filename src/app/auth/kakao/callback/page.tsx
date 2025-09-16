'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function KakaoCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [isProcessing, setIsProcessing] = useState(true);
    const hasProcessedRef = useRef(false);

    useEffect(() => {
        // 이미 처리된 경우 중복 실행 방지
        if (hasProcessedRef.current) return;

        const handleCallback = async () => {
            try {
                hasProcessedRef.current = true;
                const code = searchParams.get('code');
                const error = searchParams.get('error');

                // 에러가 있는 경우
                if (error) {
                    console.error('카카오 로그인 에러:', error);
                    toast.error('로그인이 취소되었거나 오류가 발생했습니다.');
                    router.push('/');
                    return;
                }

                // 인증 코드가 없는 경우
                if (!code) {
                    toast.error('인증 코드를 받지 못했습니다.');
                    router.push('/');
                    return;
                }

                // 로그인 처리
                const success = await login(code);

                if (success) {
                    toast.success('로그인에 성공했습니다! 🎉');
                    router.push('/dashboard');
                } else {
                    toast.error('로그인에 실패했습니다. 다시 시도해 주세요.');
                    router.push('/');
                }
            } catch (error) {
                console.error('카카오 콜백 처리 중 오류:', error);
                toast.error('로그인 처리 중 오류가 발생했습니다.');
                router.push('/');
            } finally {
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [searchParams, login, router]);

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mb-4">
                            <span className="text-2xl font-bold text-white">💒</span>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            로그인 처리 중...
                        </h2>

                        <p className="text-gray-600 mb-6">
                            카카오 계정으로 로그인하고 있습니다.
                        </p>

                        <LoadingSpinner size="lg" />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
