# Google Apps Script 배포 가이드

## 출마자 등록 스크립트 설정

1. [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0/edit) 열기

2. 상단 메뉴: **확장 프로그램** > **Apps Script** 클릭

3. `CandidateRegistration.gs` 파일의 코드를 복사하여 붙여넣기

4. **배포** > **새 배포** 클릭

5. 배포 설정:
   - 유형: **웹 앱**
   - 설명: "출마자 등록 웹앱"
   - Execute as: **Me**
   - Who has access: **Anyone**

6. **배포** 클릭 후 웹 앱 URL 복사
   - 예: `https://script.google.com/macros/s/AKfycby.../exec`

7. `.env.local` 파일에 다음 추가:
   ```
   VITE_CANDIDATE_SCRIPT_URL=복사한_URL
   ```

---

## 정책 제안 스크립트 설정

1. 같은 스프레드시트에서 **Apps Script** 다시 열기

2. 좌측 **파일** 메뉴에서 **+** 버튼으로 새 스크립트 파일 추가
   - 파일명: `PolicyProposal`

3. `PolicyProposal.gs` 파일의 코드를 복사하여 붙여넣기

4. **배포** > **새 배포** 클릭

5. 배포 설정:
   - 유형: **웹 앱**
   - 설명: "정책 제안 웹앱"
   - Execute as: **Me**
   - Who has access: **Anyone**

6. **배포** 클릭 후 웹 앱 URL 복사

7. `.env.local` 파일에 다음 추가:
   ```
   VITE_POLICY_SCRIPT_URL=복사한_URL
   ```

---

## 중요 참고사항

- 두 개의 **별도** 배포가 필요합니다 (출마자 등록용, 정책 제안용)
- 각 배포는 고유한 웹 앱 URL을 갖습니다
- 스프레드시트에 "출마자 등록"과 "정책 제안" 두 개의 시트가 자동으로 생성됩니다
- 배포 후 권한 승인이 필요할 수 있습니다
