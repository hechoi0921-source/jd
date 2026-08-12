# 직무정보 SME 검토 웹앱

서연그룹 직무정보 90개, Task 365개, Activity 1,100개, Skill 988개를 한 화면에서 검토하는 Next.js 14 앱입니다.

## 실행

Node.js 20 이상에서 `npm install`, `npm run dev`를 실행합니다. 기준 Excel을 갱신할 때는:

```powershell
python scripts/import_excel.py "C:\Users\hecho\OneDrive\문서\seoyeon_stdjob_full_260708.xlsx"
```

현재 로컬 데모 로그인은 관리자 `admin@jd.local` / `0123`, 일반 SME는 임의 이메일/비밀번호입니다. `0123`은 요청된 초기값일 뿐이므로 운영 배포 전 반드시 강한 비밀번호로 바꾸고 Supabase Auth로 전환해야 합니다. `.env.example`을 `.env.local`로 복사해 Supabase 값을 설정하세요.

## 구현 범위

- `/review`: 직무 정의·목적·Task·Activity·Skill·종합의견 검토와 임시저장
- `/mypage`: SME 진행 현황
- `/admin`, `/admin/feedbacks`, `/admin/compare`, `/admin/users`
- Excel 원본 행 ID 보존 변환기 및 수량 assertion
- `supabase/schema.sql`: 원본/피드백 분리, RLS 기본 스키마

데모 저장소는 브라우저 localStorage를 사용합니다. 다중 사용자 운영 전에는 Supabase 프로젝트에서 스키마를 적용하고 저장 모듈을 Supabase adapter로 교체해야 합니다.
