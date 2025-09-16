const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'wedding-mate.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 데이터베이스 내용 확인\n');

// 사용자 데이터 확인
db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
        console.error('❌ 사용자 데이터 조회 오류:', err.message);
    } else {
        console.log('👥 사용자 데이터:');
        console.log('================');
        if (rows.length === 0) {
            console.log('등록된 사용자가 없습니다.');
        } else {
            rows.forEach((user, index) => {
                console.log(`${index + 1}. ID: ${user.id}`);
                console.log(`   카카오 ID: ${user.kakao_id}`);
                console.log(`   닉네임: ${user.nickname}`);
                console.log(`   이메일: ${user.email || 'N/A'}`);
                console.log(`   프로필 이미지: ${user.profile_image || 'N/A'}`);
                console.log(`   가입일: ${user.created_at}`);
                console.log('---');
            });
        }
    }

    // D-DAY 데이터 확인
    db.all("SELECT * FROM ddays", (err, rows) => {
        if (err) {
            console.error('❌ D-DAY 데이터 조회 오류:', err.message);
        } else {
            console.log('\n📅 D-DAY 데이터:');
            console.log('================');
            if (rows.length === 0) {
                console.log('등록된 D-DAY가 없습니다.');
            } else {
                rows.forEach((dday, index) => {
                    console.log(`${index + 1}. ID: ${dday.id}`);
                    console.log(`   사용자 ID: ${dday.user_id}`);
                    console.log(`   제목: ${dday.title}`);
                    console.log(`   날짜: ${dday.target_date}`);
                    console.log(`   생성일: ${dday.created_at}`);
                    console.log('---');
                });
            }
        }

        db.close();
    });
});
