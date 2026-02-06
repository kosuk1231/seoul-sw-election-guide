// 출마자 등록용 Google Apps Script
// 스프레드시트 ID: 1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0

function doPost(e) {
  try {
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById('1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0');
    
    // "출마자 등록" 시트 가져오기 (없으면 생성)
    let sheet = spreadsheet.getSheetByName('출마자 등록');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('출마자 등록');
      // 헤더 추가
      sheet.appendRow([
        '타임스탬프', '이름', '생년월일', '연락처', '이메일', '의회 종류', 
        '선거구', '사회복지사 자격', '회비 납부', '선거 사무소', '사무소 주소',
        '발대식 유무', '발대식 날짜', '발대식 정보', '경력 요약', '핵심 정책', '동의'
      ]);
    }
    
    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 새 행 추가
    sheet.appendRow([
      new Date(), // 타임스탬프
      data.name || '',
      data.birthDate || '',
      data.phone || '',
      data.email || '',
      data.councilType || '',
      data.district || '',
      data.hasSocialWorkerLicense || '',
      data.hasPaidMembershipFee || '',
      data.hasElectionOffice || '',
      data.electionOfficeAddress || '',
      data.hasKickoffEvent || '',
      data.kickoffEventDate || '',
      data.kickoffEventDetails || '',
      data.career || '',
      data.policies || '',
      data.agreed ? '동의' : '미동의'
    ]);
    
    // 성공 응답
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: '출마자 정보가 등록되었습니다.' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // 에러 응답
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ message: 'This endpoint accepts POST requests only.' })
  ).setMimeType(ContentService.MimeType.JSON);
}
