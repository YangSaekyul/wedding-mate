'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { DDayList } from '@/components/dday/DDayList';
import { DDayFormModal } from '@/components/dday/DDayFormModal';
import { DDay, CreateDDayForm } from '@/types';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingDDay, setEditingDDay] = useState<DDay | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<DDay | null>(null);

    // D-DAY 목록 조회
    const {
        data: ddaysData,
        isLoading: isLoadingDDays,
        error: ddaysError
    } = useQuery('ddays', apiClient.ddays.getAll, {
        retry: 2,
        staleTime: 30000, // 30초
    });

    // D-DAY 생성 뮤테이션
    const createMutation = useMutation(apiClient.ddays.create, {
        onSuccess: () => {
            queryClient.invalidateQueries('ddays');
            toast.success('D-DAY가 성공적으로 등록되었습니다! 🎉');
            setShowFormModal(false);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        }
    });

    // D-DAY 수정 뮤테이션
    const updateMutation = useMutation(
        ({ id, data }: { id: number; data: CreateDDayForm }) =>
            apiClient.ddays.update(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('ddays');
                toast.success('D-DAY가 성공적으로 수정되었습니다! ✨');
                setEditingDDay(null);
                setShowFormModal(false);
            },
            onError: (error) => {
                toast.error(getErrorMessage(error));
            }
        }
    );

    // D-DAY 삭제 뮤테이션
    const deleteMutation = useMutation(apiClient.ddays.delete, {
        onSuccess: () => {
            queryClient.invalidateQueries('ddays');
            toast.success('D-DAY가 성공적으로 삭제되었습니다.');
            setDeleteConfirm(null);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        }
    });

    // 에러 처리
    useEffect(() => {
        if (ddaysError) {
            toast.error(getErrorMessage(ddaysError));
        }
    }, [ddaysError]);

    const handleAddDDay = () => {
        setEditingDDay(null);
        setShowFormModal(true);
    };

    const handleEditDDay = (dday: DDay) => {
        setEditingDDay(dday);
        setShowFormModal(true);
    };

    const handleDeleteDDay = (dday: DDay) => {
        setDeleteConfirm(dday);
    };

    const handleFormSubmit = async (data: CreateDDayForm) => {
        if (editingDDay) {
            await updateMutation.mutateAsync({ id: editingDDay.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
    };

    const handleConfirmDelete = () => {
        if (deleteConfirm) {
            deleteMutation.mutate(deleteConfirm.id);
        }
    };

    const ddays = ddaysData?.ddays || [];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="container mx-auto px-4 py-8">
                    <DDayList
                        ddays={ddays}
                        isLoading={isLoadingDDays}
                        onAdd={handleAddDDay}
                        onEdit={handleEditDDay}
                        onDelete={handleDeleteDDay}
                    />
                </main>

                {/* D-DAY 폼 모달 */}
                <DDayFormModal
                    isOpen={showFormModal}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingDDay(null);
                    }}
                    onSubmit={handleFormSubmit}
                    editingDDay={editingDDay}
                    isLoading={createMutation.isLoading || updateMutation.isLoading}
                />

                {/* 삭제 확인 모달 */}
                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
                                <div className="p-6">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                                            <span className="text-2xl">⚠️</span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            D-DAY 삭제
                                        </h3>

                                        <p className="text-gray-600 mb-6">
                                            &apos;<strong>{deleteConfirm.title}</strong>&apos; D-DAY를 정말 삭제하시겠습니까?
                                            <br />
                                            <span className="text-sm text-red-600">이 작업은 되돌릴 수 없습니다.</span>
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                disabled={deleteMutation.isLoading}
                                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                취소
                                            </button>

                                            <button
                                                onClick={handleConfirmDelete}
                                                disabled={deleteMutation.isLoading}
                                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {deleteMutation.isLoading ? '삭제중...' : '삭제'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
