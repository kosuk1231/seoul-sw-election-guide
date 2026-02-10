/**
 * 출마자 등록 시스템 통합 스크립트 (최종_연락처비공개_수정판)
 * 기능: 후보자 노출 로직 유지 + 이미지 영구 링크 + [수정] 연락처 정보 웹 노출 차단
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
    
    // lh3.googleusercontent.com 형식의 영구 이미지 링크 반환
    const directLink = "https://lh3.googleusercontent.com/d/" + file.getId();
    
    return directLink;
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

    // 사진 업로드
    if (data.candidatePhoto && data.candidatePhoto.base64) {
      const photoName = `photo_${data.name}_${Date.now()}.${data.candidatePhoto.extension || 'jpg'}`;
      photoUrl = uploadFileToDrive(data.candidatePhoto.base64, photoName, data.candidatePhoto.mimeType);
    }

    // 공보물 업로드
    if (data.electionFlyer && data.electionFlyer.base64) {
      const flyerName = `flyer_${data.name}_${Date.now()}.${data.electionFlyer.extension || 'pdf'}`;
      const decodedData = Utilities.base64Decode(data.electionFlyer.base64);
      const blob = Utilities.newBlob(decodedData, data.electionFlyer.mimeType, flyerName);
      const file = DriveApp.getFolderById(DRIVE_FOLDER_ID).createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      flyerUrl = "https://drive.google.com/uc?export=view&id=" + file.getId();
    }

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
      data.careerSummary || data.career || '',
      data.welfarePolicy || data.policies || '',
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
 * 3. 데이터 조회 (GET) - 연락처 정보 삭제 적용됨
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

    const result = rows
      .filter(row => row[idx.isVisible] === true || String(row[idx.isVisible]).toUpperCase() === 'TRUE')
      .map(row => ({
        name: row[idx.name] || '',
        birthDate: row[idx.birthDate] || '',
        
        // [수정] 연락처 정보를 빈 값('')으로 보내서 화면에 나오지 않게 함
        phone: '', 
        
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
 * 4. 관리자 메뉴
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🔧 후보자 관리')
    .addItem('✅ 선택 항목 승인 (노출)', 'approveRows')
    .addItem('❌ 선택 항목 취소 (숨김)', 'disapproveRows')
    .addItem('🔄 이미지 주소 영구링크로 변경', 'fixExistingLinks')
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
    if (row === 1) continue; 
    sheet.getRange(row, colIdx).setValue(status);
  }
  
  SpreadsheetApp.getUi().alert(status ? '승인되었습니다.' : '숨김 처리되었습니다.');
}

function fixExistingLinks() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const photoIdx = data[0].indexOf('후보자 사진 URL');

  if (photoIdx === -1) {
    SpreadsheetApp.getUi().alert("'후보자 사진 URL' 컬럼을 찾을 수 없습니다.");
    return;
  }

  let count = 0;
  for (let i = 1; i < data.length; i++) {
    let url = data[i][photoIdx];
    
    if (url && typeof url === 'string') {
      let fileId = null;
      if (url.includes('id=')) {
        fileId = url.split('id=')[1].split('&')[0];
      } else if (url.includes('file/d/')) {
        fileId = url.split('file/d/')[1].split('/')[0];
      }

      if (fileId && !url.includes('lh3.googleusercontent.com')) {
        let newLink = "https://lh3.googleusercontent.com/d/" + fileId;
        sheet.getRange(i + 1, photoIdx + 1).setValue(newLink);
        count++;
      }
    }
  }
  SpreadsheetApp.getUi().alert(count + '개의 이미지 링크를 영구 링크(lh3)로 변환했습니다.');
}
