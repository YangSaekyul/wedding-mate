// @ts-nocheck
import { db } from './database';

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

export interface CreateDDayData {
    user_id: number;
    title: string;
    target_date: string;
    description?: string;
}

export interface UpdateDDayData {
    title?: string;
    target_date?: string;
    description?: string;
}

export class DDayModel {
    // 사용자의 모든 D-Day 조회
    static findByUserId(userId: number): Promise<DDay[]> {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT *, 
         CAST((julianday(target_date) - julianday('now')) AS INTEGER) as days_remaining
         FROM ddays 
         WHERE user_id = ? 
         ORDER BY target_date ASC`,
                [userId],
                (err, rows: DDay[]) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    // ID로 D-Day 조회
    static findById(id: number): Promise<DDay | null> {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT *, 
         CAST((julianday(target_date) - julianday('now')) AS INTEGER) as days_remaining
         FROM ddays 
         WHERE id = ?`,
                [id],
                (err, row: DDay) => {
                    if (err) reject(err);
                    else resolve(row || null);
                }
            );
        });
    }

    // 새 D-Day 생성
    static create(ddayData: CreateDDayData): Promise<DDay> {
        return new Promise((resolve, reject) => {
            const { user_id, title, target_date, description } = ddayData;

            db.run(
                `INSERT INTO ddays (user_id, title, target_date, description) 
         VALUES (?, ?, ?, ?)`,
                [user_id, title, target_date, description],
                function (err) {
                    if (err) reject(err);
                    else {
                        DDayModel.findById(this.lastID)
                            .then(dday => resolve(dday!))
                            .catch(reject);
                    }
                }
            );
        });
    }

    // D-Day 정보 업데이트
    static update(id: number, ddayData: UpdateDDayData): Promise<DDay> {
        return new Promise((resolve, reject) => {
            const { title, target_date, description } = ddayData;

            db.run(
                `UPDATE ddays SET 
         title = COALESCE(?, title),
         target_date = COALESCE(?, target_date),
         description = COALESCE(?, description),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
                [title, target_date, description, id],
                (err) => {
                    if (err) reject(err);
                    else {
                        DDayModel.findById(id)
                            .then(dday => resolve(dday!))
                            .catch(reject);
                    }
                }
            );
        });
    }

    // D-Day 삭제
    static delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM ddays WHERE id = ?',
                [id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    // 사용자가 해당 D-Day의 소유자인지 확인
    static isOwner(ddayId: number, userId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM ddays WHERE id = ? AND user_id = ?',
                [ddayId, userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                }
            );
        });
    }
}
