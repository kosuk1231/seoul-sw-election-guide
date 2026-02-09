// 출마자 등록용 Google Apps Script (파일 업로드 포함)
// 스프레드시트 ID: 1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0

// Google Drive 폴더 ID (업로드할 폴더)
// 사용 전에 실제 Google Drive 폴더 ID로 변경 필요
const DRIVE_FOLDER_ID = '1q84w1_3XiH8JPa961Z85TdFxuYM61HKB'; // 폴더 우클릭 > 공유 > 링크복사에서 ID 확인

/**
 * 파일을 Google Drive에 업로드
 * @param {string} base64Data - Base64로 인코딩된 파일 데이터
 * @param {string} fileName - 파일명
 * @param {string} mimeType - MIME 타입 (예: image/jpeg, image/png, application/pdf)
 * @returns {string} 업로드된 파일의 공개 URL
 */
function uploadFileToDrive(base64Data, fileName, mimeType) {
  try {
    // Base64 데이터를 Blob으로 변환
    const decodedData = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decodedData, mimeType, fileName);
    
    // Google Drive 폴더 가져오기
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // 파일 생성
    const file = folder.createFile(blob);
    
    // 파일을 공개로 설정 (누구나 링크로 접근 가능)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // 공개 URL 반환
    return file.getUrl();
  } catch (error) {
    Logger.log('File upload error: ' + error.toString());
    throw new Error('파일 업로드 실패: ' + error.toString());
  }
}

function doPost(e) {
  try {
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById('1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0');
    
    // "출마자 등록" 시트 가져오기 (없으면 생성)
    let sheet = spreadsheet.getSheetByName('출마자 등록');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('출마자 등록');
      // 헤더 추가 (사진 URL, 공보물 URL 컬럼 추가)
      sheet.appendRow([
        '타임스탬프', '이름', '생년월일', '연락처', '이메일', '의회 종류', 
        '선거구', '사회복지사 자격', '회비 납부', '선거 사무소', '사무소 주소',
        '발대식 유무', '발대식 날짜', '발대식 정보', '경력 요약', '핵심 정책', '동의',
        '후보자 사진 URL', '선거공보물 URL', '노출 여부'
      ]);
    }
    
    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 파일 업로드 처리
    let photoUrl = '';
    let flyerUrl = '';
    
    // 후보자 사진 업로드
    if (data.candidatePhoto && data.candidatePhoto.base64) {
      const photoFileName = `candidate_${data.name}_${new Date().getTime()}.${data.candidatePhoto.extension || 'jpg'}`;
      photoUrl = uploadFileToDrive(
        data.candidatePhoto.base64,
        photoFileName,
        data.candidatePhoto.mimeType || 'image/jpeg'
      );
    }
    
    // 선거 공보물 업로드
    if (data.electionFlyer && data.electionFlyer.base64) {
      const flyerFileName = `flyer_${data.name}_${new Date().getTime()}.${data.electionFlyer.extension || 'pdf'}`;
      flyerUrl = uploadFileToDrive(
        data.electionFlyer.base64,
        flyerFileName,
        data.electionFlyer.mimeType || 'application/pdf'
      );
    }
    
    // 스프레드시트에 데이터 추가
    sheet.appendRow([
      new Date().toLocaleString('ko-KR'),
      data.name || '',
      data.birthDate || '',
      data.phone || '',
      data.email || '',
      data.councilType || '',
      data.district || '',
      data.hasSocialWorkerLicense || '',
      data.hasPaidMembershipFee || '',
      data.hasElectionOffice  || '',
      data.electionOfficeAddress || '',
      data.hasKickoffEvent || '',
      data.kickoffEventDate || '',
      data.kickoffEventDetails || '',
      data.career || '',
      data.policies || '',
      data.agreed ? '동의' : '미동의',
      photoUrl,
      flyerUrl,
      false  // 노출 여부 (기본값: false, 관리자가 true로 변경)
    ]);
    
    // 성공 응답
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: true, 
        message: '출마자 정보가 등록되었습니다.',
        photoUrl: photoUrl,
        flyerUrl: flyerUrl
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // 에러 응답
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET 요청 처리 - 후보자 데이터 조회
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    // 후보자 데이터 조회
    if (action === 'getCandidates') {
      const spreadsheet = SpreadsheetApp.openById('1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0');
      const sheet = spreadsheet.getSheetByName('출마자 등록');
      
      if (!sheet) {
        return ContentService.createTextOutput(
          JSON.stringify([])
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      // 모든 데이터 가져오기
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1);
      
      // 헤더 인덱스 찾기
      const nameIndex = headers.indexOf('이름');
      const birthDateIndex = headers.indexOf('생년월일');
      const phoneIndex = headers.indexOf('연락처');
      const emailIndex = headers.indexOf('이메일');
      const councilTypeIndex = headers.indexOf('의회 종류');
      const districtIndex = headers.indexOf('선거구');
      const socialWorkerIndex = headers.indexOf('사회복지사 자격');
      const membershipFeeIndex = headers.indexOf('회비 납부');
      const electionOfficeIndex = headers.indexOf('선거 사무소');
      const officeAddressIndex = headers.indexOf('사무소 주소');
      const kickoffEventIndex = headers.indexOf('발대식 유무');
      const kickoffDateIndex = headers.indexOf('발대식 날짜');
      const kickoffDetailsIndex = headers.indexOf('발대식 정보');
      const careerIndex = headers.indexOf('경력 요약');
      const policiesIndex = headers.indexOf('핵심 정책');
      const photoUrlIndex = headers.indexOf('후보자 사진 URL');
      const flyerUrlIndex = headers.indexOf('선거공보물 URL');
      const isVisibleIndex = headers.indexOf('노출 여부');
      const timestampIndex = headers.indexOf('타임스탬프');
      
      // JSON 변환
      const candidates = rows
        .filter(row => row[isVisibleIndex] === true || row[isVisibleIndex] === 'TRUE')
        .map(row => ({
          name: row[nameIndex] || '',
          birthDate: row[birthDateIndex] || '',
          phone: row[phoneIndex] || '',
          email: row[emailIndex] || '',
          councilType: row[councilTypeIndex] || 'si',
          district: row[districtIndex] || '',
          hasSocialWorkerLicense: row[socialWorkerIndex] === 'TRUE' || row[socialWorkerIndex] === true,
          hasPaidMembershipFee: row[membershipFeeIndex] === 'TRUE' || row[membershipFeeIndex] === true,
          hasElectionOffice: row[electionOfficeIndex] === 'TRUE' || row[electionOfficeIndex] === true,
          officeAddress: row[officeAddressIndex] || '',
          hasKickoffEvent: row[kickoffEventIndex] === 'TRUE' || row[kickoffEventIndex] === true,
          kickoffEventDate: row[kickoffDateIndex] || '',
          kickoffEventDetails: row[kickoffDetailsIndex] || '',
          careerSummary: row[careerIndex] || '',
          welfarePolicy: row[policiesIndex] || '',
          candidatePhotoUrl: row[photoUrlIndex] || '',
          electionFlyerUrl: row[flyerUrlIndex] || '',
          isVisible: row[isVisibleIndex] === true || row[isVisibleIndex] === 'TRUE',
          timestamp: row[timestampIndex] || ''
        }));
      
      return ContentService.createTextOutput(
        JSON.stringify(candidates)
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 기본 응답
    return ContentService.createTextOutput(
      JSON.stringify({ message: 'Please specify action=getCandidates' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ========================================
 * 관리자 도구 - Google Sheets 커스텀 메뉴
 * ========================================
 */

/**
 * 스프레드시트가 열릴 때 자동으로 실행되어 커스텀 메뉴를 추가합니다
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 관리자 도구')
    .addItem('✅ 선택한 행 승인 (노출)', 'approveSelectedRows')
    .addItem('❌ 선택한 행 승인 취소 (숨김)', 'disapproveSelectedRows')
    .addSeparator()
    .addItem('📊 승인 통계 보기', 'showApprovalStatus')
    .addToUi();
}

/**
 * 선택된 행들의 노출 여부를 TRUE로 변경
 */
function approveSelectedRows() {
  const spreadsheet = SpreadsheetApp.openById('1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0');
  const sheet = spreadsheet.getSheetByName('출마자 등록');
  const ui = SpreadsheetApp.getUi();
  
  if (!sheet) {
    ui.alert('오류', '"출마자 등록" 시트를 찾을 수 없습니다.', ui.ButtonSet.OK);
    return;
  }
  
  // 선택된 범위 가져오기
  const range = sheet.getActiveRange();
  if (!range) {
    ui.alert('안내', '승인할 행을 선택해주세요.\n(행 번호를 클릭하여 선택)', ui.ButtonSet.OK);
    return;
  }
  
  const startRow = range.getRow();
  const numRows = range.getNumRows();
  
  // 헤더 행은 제외
  if (startRow === 1) {
    ui.alert('오류', '헤더 행은 승인할 수 없습니다.\n데이터 행을 선택해주세요.', ui.ButtonSet.OK);
    return;
  }
  
  // 노출 여부 열 찾기
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const visibilityColumnIndex = headers.indexOf('노출 여부') + 1;
  
  if (visibilityColumnIndex === 0) {
    ui.alert('오류', '"노출 여부" 열을 찾을 수 없습니다.', ui.ButtonSet.OK);
    return;
  }
  
  // 확인 대화상자
  const response = ui.alert(
    '승인 확인',
    `선택한 ${numRows}개 행의 노출 여부를 TRUE로 변경하시겠습니까?`,
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  // 선택된 행들의 노출 여부를 TRUE로 변경
  let updatedCount = 0;
  for (let i = 0; i < numRows; i++) {
    const currentRow = startRow + i;
    const cell = sheet.getRange(currentRow, visibilityColumnIndex);
    cell.setValue(true);
    updatedCount++;
  }
  
  ui.alert('완료', `${updatedCount}개 행이 승인되었습니다.\n웹사이트에서 새로고침하면 반영됩니다.`, ui.ButtonSet.OK);
}

/**
 * 선택된 행들의 노출 여부를 FALSE로 변경
 */
function disapproveSelectedRows() {
  const spreadsheet = SpreadsheetApp.openById('1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0');
  const sheet = spreadsheet.getSheetByName('출마자 등록');
  const ui = SpreadsheetApp.getUi();
  
  if (!sheet) {
    ui.alert('오류', '"출마자 등록" 시트를 찾을 수 없습니다.', ui.ButtonSet.OK);
    return;
  }
  
  // 선택된 범위 가져오기
  const range = sheet.getActiveRange();
  if (!range) {
    ui.alert('안내', '승인 취소할 행을 선택해주세요.\n(행 번호를 클릭하여 선택)', ui.ButtonSet.OK);
    return;
  }
  
  const startRow = range.getRow();
  const numRows = range.getNumRows();
  
  // 헤더 행은 제외
  if (startRow === 1) {
    ui.alert('오류', '헤더 행은 승인 취소할 수 없습니다.\n데이터 행을 선택해주세요.', ui.ButtonSet.OK);
    return;
  }
  
  // 노출 여부 열 찾기
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const visibilityColumnIndex = headers.indexOf('노출 여부') + 1;
  
  if (visibilityColumnIndex === 0) {
    ui.alert('오류', '"노출 여부" 열을 찾을 수 없습니다.', ui.ButtonSet.OK);
    return;
  }
  
  // 확인 대화상자
  const response = ui.alert(
    '승인 취소 확인',
    `선택한 ${numRows}개 행의 노출 여부를 FALSE로 변경하시겠습니까?`,
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  // 선택된 행들의 노출 여부를 FALSE로 변경
  let updatedCount = 0;
  for (let i = 0; i < numRows; i++) {
    const currentRow = startRow + i;
    const cell = sheet.getRange(currentRow, visibilityColumnIndex);
    cell.setValue(false);
    updatedCount++;
  }
  
  ui.alert('완료', `${updatedCount}개 행의 승인이 취소되었습니다.\n웹사이트에서 새로고침하면 반영됩니다.`, ui.ButtonSet.OK);
}

/**
 * 현재 승인 통계를 팝업으로 표시
 */
function showApprovalStatus() {
  const spreadsheet = SpreadsheetApp.openById('1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0');
  const sheet = spreadsheet.getSheetByName('출마자 등록');
  const ui = SpreadsheetApp.getUi();
  
  if (!sheet) {
    ui.alert('오류', '"출마자 등록" 시트를 찾을 수 없습니다.', ui.ButtonSet.OK);
    return;
  }
  
  // 전체 데이터 가져오기
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  // 노출 여부 열 찾기
  const visibilityColumnIndex = headers.indexOf('노출 여부');
  
  if (visibilityColumnIndex === -1) {
    ui.alert('오류', '"노출 여부" 열을 찾을 수 없습니다.', ui.ButtonSet.OK);
    return;
  }
  
  // 통계 계산
  const totalCandidates = rows.filter(row => row[headers.indexOf('이름')]).length;
  const approvedCandidates = rows.filter(row => 
    row[visibilityColumnIndex] === true || row[visibilityColumnIndex] === 'TRUE'
  ).length;
  const pendingCandidates = totalCandidates - approvedCandidates;
  
  // 의회 종류별 통계
  const councilTypeIndex = headers.indexOf('의회 종류');
  const siCandidates = rows.filter(row => row[councilTypeIndex] === '시의원').length;
  const guCandidates = rows.filter(row => row[councilTypeIndex] === '구의원').length;
  
  // 승인된 의회 종류별 통계
  const approvedSi = rows.filter(row => 
    row[councilTypeIndex] === '시의원' && 
    (row[visibilityColumnIndex] === true || row[visibilityColumnIndex] === 'TRUE')
  ).length;
  const approvedGu = rows.filter(row => 
    row[councilTypeIndex] === '구의원' && 
    (row[visibilityColumnIndex] === true || row[visibilityColumnIndex] === 'TRUE')
  ).length;
  
  // 결과 표시
  const message = 
    `📊 후보자 승인 통계\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `전체 등록: ${totalCandidates}명\n` +
    `✅ 승인됨 (노출): ${approvedCandidates}명\n` +
    `⏳ 승인 대기: ${pendingCandidates}명\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `의회 종류별 현황:\n\n` +
    `시의원: ${siCandidates}명 (승인: ${approvedSi}명)\n` +
    `구의원: ${guCandidates}명 (승인: ${approvedGu}명)`;
  
  ui.alert('승인 통계', message, ui.ButtonSet.OK);
}

