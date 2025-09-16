import { db } from '../database';

export interface User {
    id: number;
    kakao_id: string;
    nickname: string;
    profile_image?: string;
    email?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserData {
    kakao_id: string;
    nickname: string;
    profile_image?: string;
    email?: string;
}

export class UserModel {
    // 카카오 ID로 사용자 조회
    static findByKakaoId(kakaoId: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE kakao_id = ?',
                [kakaoId],
                (err, row: User) => {
                    if (err) reject(err);
                    else resolve(row || null);
                }
            );
        });
    }

    // ID로 사용자 조회
    static findById(id: number): Promise<User | null> {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE id = ?',
                [id],
                (err, row: User) => {
                    if (err) reject(err);
                    else resolve(row || null);
                }
            );
        });
    }

    // 새 사용자 생성
    static create(userData: CreateUserData): Promise<User> {
        return new Promise((resolve, reject) => {
            const { kakao_id, nickname, profile_image, email } = userData;

            db.run(
                `INSERT INTO users (kakao_id, nickname, profile_image, email) 
                 VALUES (?, ?, ?, ?)`,
                [kakao_id, nickname, profile_image, email],
                function (err) {
                    if (err) reject(err);
                    else {
                        // 생성된 사용자 정보 반환
                        UserModel.findById(this.lastID)
                            .then(user => resolve(user!))
                            .catch(reject);
                    }
                }
            );
        });
    }

    // 사용자 정보 업데이트
    static update(id: number, userData: Partial<CreateUserData>): Promise<User> {
        return new Promise((resolve, reject) => {
            const { nickname, profile_image, email } = userData;

            db.run(
                `UPDATE users SET 
                 nickname = COALESCE(?, nickname),
                 profile_image = COALESCE(?, profile_image),
                 email = COALESCE(?, email),
                 updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [nickname, profile_image, email, id],
                (err) => {
                    if (err) reject(err);
                    else {
                        UserModel.findById(id)
                            .then(user => resolve(user!))
                            .catch(reject);
                    }
                }
            );
        });
    }
}
