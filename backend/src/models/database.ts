// @ts-nocheck
import sqlite3 from 'sqlite3';
import path from 'path';

// SQLite 데이터베이스 설정
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../wedding-mate.db');
export const db = new sqlite3.Database(dbPath);

// 데이터베이스 테이블 초기화
export const initDatabase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // 사용자 테이블
            db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          kakao_id TEXT UNIQUE NOT NULL,
          nickname TEXT NOT NULL,
          profile_image TEXT,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
                if (err) reject(err);
            });

            // D-DAY 테이블
            db.run(`
        CREATE TABLE IF NOT EXISTS ddays (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          target_date DATE NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

// 데이터베이스 연결 종료
export const closeDatabase = (): Promise<void> => {
    return new Promise((resolve) => {
        db.close((err) => {
            if (err) console.error('Database close error:', err);
            resolve();
        });
    });
};
