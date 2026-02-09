/**
 * 출마자 등록 시스템 통합 스크립트
 * 설정: 스프레드시트 ID와 드라이브 폴더 ID를 확인하세요.
 */

const SPREADSHEET_ID = '1nPdF1o1HPVQ4f_Yzl-iq-HWCgJb7m47BN5U2UAm38c0';
const DRIVE_FOLDER_ID = '1q84w1_3XiH8JPa961Z85TdFxuYM61HKB';
const SHEET_NAME = '출마자 등록';

/**
 * 1. 파일 업로드 로직
 */
function uploadFileToDrive(base64Data, fileName, mimeType) {
  try {
    if (!base64Data || base64Data.trim() === '') throw new Error('Base64 데이터가 없습니다.');
    if (!fileName) throw new Error('파일명이 없습니다.');

    const decodedData = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decodedData, mimeType || 'application/octet-stream', fileName);
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const file = folder.createFile(blob);
    
    // 외부 접근을 위해 공유 설정
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (error) {
    Logger.log('Upload Error: ' + error.toString());
    throw error;
  }
}

/**
 * 2. 데이터 등록 (POST)
 */
function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // 시트가 없으면 생성 및 헤더 설정
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([
        '타임스탬프', '이름', '생년월일', '연락처', '이메일', '의회 종류', 
        '선거구', '사회복지사 자격', '회비 납부', '선거 사무소', '사무소 주소',
        '발대식 유무', '발대식 날짜', '발대식 정보', '경력 요약', '핵심 정책', '동의',
        '후보자 사진 URL', '선거공보물 URL', '노출 여부', '소속 정당', '현재 직책', 'SNS 주소'
      ]);
    }

    const data = JSON.parse(e.postData.contents);
    let photoUrl = '';
    let flyerUrl = '';

    // 사진 업로드 처리
    if (data.candidatePhoto && data.candidatePhoto.base64) {
      const photoName = `photo_${data.name}_${Date.now()}.${data.candidatePhoto.extension || 'jpg'}`;
      photoUrl = uploadFileToDrive(data.candidatePhoto.base64, photoName, data.candidatePhoto.mimeType);
    }

    // 공보물 업로드 처리
    if (data.electionFlyer && data.electionFlyer.base64) {
      const flyerName = `flyer_${data.name}_${Date.now()}.${data.electionFlyer.extension || 'pdf'}`;
      flyerUrl = uploadFileToDrive(data.electionFlyer.base64, flyerName, data.electionFlyer.mimeType);
    }

    // 데이터 기록
    // 헤더 순서와 정확히 일치해야 함:
    // 타임스탬프, 이름, 생년월일, 연락처, 이메일, 의회 종류, 선거구, 사회복지사 자격, 회비 납부, 
    // 선거 사무소, 사무소 주소, 발대식 유무, 발대식 날짜, 발대식 정보, 경력 요약, 핵심 정책, 동의, 
    // 후보자 사진 URL, 선거공보물 URL, 노출 여부, 소속 정당, 현재 직책, SNS 주소
    
    // 시트가 새로 생성될 때 헤더도 업데이트해야 하지만, 기존 시트에 추가 컬럼이 없다면 맨 뒤에 추가됨
    
    sheet.appendRow([
      new Date().toLocaleString('ko-KR'),
      data.name || '',
      data.birthDate || '',
      data.phone || '',
      data.email || '',
      data.councilType || '',
      data.district || '',
      data.hasSocialWorkerLicense || false,
      data.hasPaidMembershipFee || false,
      data.hasElectionOffice || false,
      data.electionOfficeAddress || '',
      data.hasKickoffEvent || false,
      data.kickoffEventDate || '',
      data.kickoffEventDetails || '',
      data.careerSummary || data.career || '', // 프론트엔드 필드명 확인 필요
      data.welfarePolicy || data.policies || '', // 프론트엔드 필드명 확인 필요
      data.agreed ? '동의' : '미동의',
      photoUrl,
      flyerUrl,
      false, // 기본값: 미승인(false)
      data.party || '',
      data.currentPosition || '',
      data.socialMediaUrl || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: '등록 완료' }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 3. 데이터 조회 (GET)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action !== 'getCandidates') {
      return ContentService.createTextOutput(JSON.stringify({ message: 'Invalid action' })).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    // 모든 필요한 필드의 인덱스 찾기
    const idx = {
      timestamp: headers.indexOf('타임스탬프'),
      name: headers.indexOf('이름'),
      birthDate: headers.indexOf('생년월일'),
      phone: headers.indexOf('연락처'),
      email: headers.indexOf('이메일'),
      councilType: headers.indexOf('의회 종류'),
      district: headers.indexOf('선거구'),
      socialWorker: headers.indexOf('사회복지사 자격'),
      membershipFee: headers.indexOf('회비 납부'),
      electionOffice: headers.indexOf('선거 사무소'),
      officeAddress: headers.indexOf('사무소 주소'),
      kickoffEvent: headers.indexOf('발대식 유무'),
      kickoffDate: headers.indexOf('발대식 날짜'),
      kickoffDetails: headers.indexOf('발대식 정보'),
      career: headers.indexOf('경력 요약'),
      policies: headers.indexOf('핵심 정책'),
      photo: headers.indexOf('후보자 사진 URL'),
      flyer: headers.indexOf('선거공보물 URL'),
      isVisible: headers.indexOf('노출 여부'),
      party: headers.indexOf('소속 정당'),
      currentPosition: headers.indexOf('현재 직책'),
      sns: headers.indexOf('SNS 주소')
    };

    // '노출 여부'가 TRUE인 데이터만 필터링하여 JSON 반환
    const result = rows
      .filter(row => row[idx.isVisible] === true || row[idx.isVisible] === 'TRUE')
      .map(row => ({
        name: row[idx.name] || '',
        birthDate: row[idx.birthDate] || '',
        phone: row[idx.phone] || '',
        email: row[idx.email] || '',
        councilType: row[idx.councilType] || 'si',
        district: row[idx.district] || '',
        party: idx.party > -1 ? row[idx.party] : '',
        currentPosition: idx.currentPosition > -1 ? row[idx.currentPosition] : '',
        socialMediaUrl: idx.sns > -1 ? row[idx.sns] : '',
        hasSocialWorkerLicense: row[idx.socialWorker] || '',
        hasPaidMembershipFee: row[idx.membershipFee] === 'TRUE' || row[idx.membershipFee] === true,
        hasElectionOffice: row[idx.electionOffice] === 'TRUE' || row[idx.electionOffice] === true,
        officeAddress: row[idx.officeAddress] || '',
        hasKickoffEvent: row[idx.kickoffEvent] === 'TRUE' || row[idx.kickoffEvent] === true,
        kickoffEventDate: row[idx.kickoffDate] || '',
        kickoffEventDetails: row[idx.kickoffDetails] || '',
        careerSummary: row[idx.career] || '',
        welfarePolicy: row[idx.policies] || '',
        candidatePhotoUrl: row[idx.photo] || '',
        electionFlyerUrl: row[idx.flyer] || '',
        isVisible: row[idx.isVisible] === true || row[idx.isVisible] === 'TRUE',
        timestamp: row[idx.timestamp] || ''
      }));

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 4. 관리자 메뉴 및 기능
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🔧 후보자 관리')
    .addItem('✅ 선택 항목 승인 (노출)', 'approveRows')
    .addItem('❌ 선택 항목 취소 (숨김)', 'disapproveRows')
    .addToUi();
}

function approveRows() { setVisibility(true); }
function disapproveRows() { setVisibility(false); }

function setVisibility(status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  
  if (!range) {
    SpreadsheetApp.getUi().alert('셀 범위를 선택해주세요.');
    return;
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colIdx = headers.indexOf('노출 여부') + 1;
  
  if (colIdx === 0) {
    SpreadsheetApp.getUi().alert('노출 여부 컬럼을 찾을 수 없습니다.');
    return;
  }
  
  for (let i = 0; i < range.getNumRows(); i++) {
    const row = range.getRow() + i;
    if (row === 1) continue; // 헤더 제외
    sheet.getRange(row, colIdx).setValue(status);
  }
  
  SpreadsheetApp.getUi().alert(status ? '승인되었습니다.' : '숨김 처리되었습니다.');
}

/**
 * 5. 자가 진단 테스트 (에러 발생 시 실행해 보세요)
 */
function runDiagnostics() {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    Logger.log("성공: 폴더 접근 가능 (" + folder.getName() + ")");
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log("성공: 스프레드시트 접근 가능 (" + ss.getName() + ")");
    
    Logger.log("진단 완료: 모든 권한이 정상입니다.");
  } catch (e) {
    Logger.log("진단 실패: " + e.toString());
  }
}