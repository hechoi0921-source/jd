# 직무정보 SME 검토 웹앱

서연그룹 직무정보 90개, Task 365개, Activity 1,100개, Skill 988개를 한 화면에서 검토하는 Next.js 14 앱입니다.

## 실행

Node.js 20 이상에서 `npm install`, `npm run dev`를 실행합니다. 기준 Excel을 갱신할 때는:

```powershell
python scripts/import_excel.py "C:\Users\hecho\OneDrive\문서\seoyeon_stdjob_full_260708.xlsx"
```

접속 주소는 `https://hechoi0921-source.github.io/jd/`입니다. 관리자 계정은 `admin@jd.local` / `0123`, 일반 SME는 임의 이메일/비밀번호로 접속합니다.

## 구현 범위

- `/review`: 직무 정의·목적·Task·Activity·Skill·종합의견 검토와 임시저장
- `/mypage`: SME 진행 현황
- `/admin`, `/admin/feedbacks`, `/admin/compare`, `/admin/users`
- `/admin/data`: Excel 표준 양식 다운로드, 업로드 검증, Diff, 데이터 버전 교체
- `/admin/settings`: 검토 기간과 마감 설정
- `/account`, `/guide`: 계정 관리와 SME 검토 가이드
- Excel 원본 행 ID 보존 변환기 및 수량 assertion
- GitHub Actions 기반 GitHub Pages 자동 배포

서버나 외부 DB 없이 동작하며 검토 결과는 접속한 브라우저의 `localStorage`에 저장됩니다. 브라우저나 PC가 다르면 데이터가 공유되지 않으며, 사이트 데이터 삭제 시 검토 결과도 삭제됩니다.

v2의 중앙 피드백 공유, 실제 사용자 인증, 이메일 리마인드, 서버 트랜잭션 롤백은 백엔드가 필요한 요구사항이라 GitHub Pages 단독 운영 범위에는 포함되지 않습니다.
