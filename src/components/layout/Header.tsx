'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* 로고 */}
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
                            <span className="text-lg font-bold text-white">💒</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Our Wedding Mate</h1>
                            <p className="text-xs text-gray-600 hidden sm:block">예비 신혼부부를 위한 플래닝 도구</p>
                        </div>
                    </div>

                    {/* 사용자 메뉴 */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {user?.profile_image ? (
                                <img
                                    src={user.profile_image}
                                    alt={user.nickname}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-gray-600" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                {user?.nickname}
                            </span>
                        </button>

                        {/* 드롭다운 메뉴 */}
                        {showUserMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">{user?.nickname}</p>
                                    {user?.email && (
                                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 메뉴 외부 클릭 시 닫기 */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    );
};
