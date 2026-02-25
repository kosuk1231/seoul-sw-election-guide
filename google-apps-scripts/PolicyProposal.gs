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
      data.expectedEffect || '',
      (data.agreed === 'true' || data.agreed === true) ? '동의함' : '동의안함',
      JSON.stringify(data) // Debug: 수신된 전체 데이터 저장
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
  try {
    const action = e.parameter.action;

    if (action === 'getStats') {
      const spreadsheet = SpreadsheetApp.openById('1SFORB19gn_EeQSgd7HhllFMtiKnpw-laHBkM-o1_pMg');
      const sheet = spreadsheet.getSheetByName('정책 제안');
      
      if (!sheet || sheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(
          JSON.stringify({ total: 0, categories: {} })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const categoryIdx = headers.indexOf('카테고리');

      if (categoryIdx === -1) {
        return ContentService.createTextOutput(
          JSON.stringify({ total: 0, categories: {} })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const categories = {};
      let total = 0;

      for (let i = 1; i < data.length; i++) {
        const cat = data[i][categoryIdx];
        if (cat && String(cat).trim() !== '') {
          const catName = String(cat).trim();
          categories[catName] = (categories[catName] || 0) + 1;
          total++;
        }
      }

      return ContentService.createTextOutput(
        JSON.stringify({ total: total, categories: categories })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ message: 'Invalid action. Use action=getStats.' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
