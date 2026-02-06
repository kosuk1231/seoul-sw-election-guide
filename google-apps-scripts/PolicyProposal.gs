// 정책 제안용 Google Apps Script
// 스프레드시트 ID: 1SFORB19gn_EeQSgd7HhllFMtiKnpw-laHBkM-o1_pMg

function doPost(e) {
  try {
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById('1SFORB19gn_EeQSgd7HhllFMtiKnpw-laHBkM-o1_pMg');
    
    // "정책 제안" 시트 가져오기 (없으면 생성)
    let sheet = spreadsheet.getSheetByName('정책 제안');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('정책 제안');
      // 헤더 추가
      sheet.appendRow([
        '타임스탬프', '이름', '연락처', '이메일', '카테고리', '정책 제목', 
        '현황 및 문제점', '정책 제안 내용', '기대 효과'
      ]);
    }
    
    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 새 행 추가
    sheet.appendRow([
      new Date(), // 타임스탬프
      data.name || '',
      data.phone || '',
      data.email || '',
      data.category || '',
      data.title || '',
      data.currentIssue || '',
      data.proposedSolution || '',
      data.expectedEffect || ''
    ]);
    
    // 성공 응답
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: '정책 제안이 등록되었습니다.' })
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
