'use client';

import React, { useState } from 'react';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

export const KakaoLogin = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleKakaoLogin = async () => {
        try {
            setIsLoading(true);

            // 카카오 로그인 URL 가져오기
            const { authUrl } = await apiClient.auth.getKakaoAuthUrl();

            // 카카오 로그인 페이지로 리다이렉트
            window.location.href = authUrl;
        } catch (error) {
            console.error('카카오 로그인 URL 가져오기 실패:', error);
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
                {/* 로고/제목 영역 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mb-4">
                        <span className="text-2xl font-bold text-white">💒</span>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Our Wedding Mate
                    </h1>

                    <p className="text-gray-600">
                        예비 신혼부부를 위한 초간단 웨딩 플래닝 도구
                    </p>
                </div>

                {/* 카카오 공식 로그인 버튼 */}
                <button
                    onClick={handleKakaoLogin}
                    disabled={isLoading}
                    className="w-full relative overflow-hidden rounded-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-3 bg-yellow-400">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span className="text-gray-900 font-medium">로그인 중...</span>
                        </div>
                    ) : (
                        <img
                            src="/assets/kakao/kakao_login_large_wide.png"
                            alt="카카오로 로그인"
                            className="w-full h-auto"
                        />
                    )}
                </button>

                {/* 서비스 소개 */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">주요 기능</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                            <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                            결혼식, 신혼여행 등 중요한 날짜 관리
                        </li>
                        <li className="flex items-center">
                            <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                            D-DAY 자동 계산 및 카운트다운
                        </li>
                        <li className="flex items-center">
                            <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                            개인 정보 보호 및 안전한 데이터 관리
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
