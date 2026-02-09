// Google Sheets 제출 및 데이터 가져오기 유틸리티 함수

export async function submitCandidateToSheets(formData: any, agreedToTerms: boolean) {
  const scriptUrl = import.meta.env.VITE_CANDIDATE_SCRIPT_URL;
  
  if (!scriptUrl) {
    throw new Error('Google Apps Script URL이 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }

  const response = await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors', // Google Apps Script는 no-cors 모드 필요
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      agreed: agreedToTerms,
      candidatePhoto: formData.candidatePhoto,
      electionFlyer: formData.electionFlyer,
    }),
  });

  return response;
}

export async function submitPolicyToSheets(formData: any) {
  const scriptUrl = import.meta.env.VITE_POLICY_SCRIPT_URL;
  
  if (!scriptUrl) {
    throw new Error('Google Apps Script URL이 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }


  const response = await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors', // Google Apps Script는 no-cors 모드 필요
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      title: formData.title,
      currentIssue: formData.currentIssue,
      proposedSolution: formData.proposedSolution,
      expectedEffect: formData.expectedEffect || '',
    }),
  });

  return response;
}

// 타입 정의
export interface Candidate {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  councilType: 'si' | 'gu';
  district: string;
  party?: string;
  currentPosition?: string;
  socialMediaUrl?: string;
  hasSocialWorkerLicense: string; // 'level1', 'level2', 'none', or boolean (legacy)
  hasPaidMembershipFee: boolean;
  hasElectionOffice: boolean;
  officeAddress?: string;
  hasKickoffEvent: boolean;
  kickoffEventDate?: string;
  kickoffEventDetails?: string;
  careerSummary: string;
  welfarePolicy?: string;
  candidatePhotoUrl?: string;
  electionFlyerUrl?: string;
  isVisible: boolean;
  approved: boolean;
  timestamp: string;
}

// 구글 드라이브 이미지 URL을 썸네일/다운로드 URL로 변환
// 구글 드라이브 이미지 URL을 썸네일/다운로드 URL로 변환
export function getGoogleDriveImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // 이미 변환된 경우
  if (url.includes('googleusercontent.com') || url.includes('export=view')) return url;

  // 1. /d/ID/ 패턴 확인
  const match1 = url.match(/\/d\/(.+?)(\/|$)/);
  if (match1 && match1[1]) {
    return `https://drive.google.com/uc?export=view&id=${match1[1]}`;
  }

  // 2. id=ID 패턴 확인
  const match2 = url.match(/id=([^&]+)/);
  if (match2 && match2[1]) {
    return `https://drive.google.com/uc?export=view&id=${match2[1]}`;
  }
  
  return url;
}

// 생년월일(YYMMDD)로 만 나이 계산
export function calculateAge(birthDate: string): string {
  if (!birthDate || birthDate.length !== 6) return birthDate;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  
  let yearPrefix = '19';
  const yearSuffix = parseInt(birthDate.substring(0, 2));
  
  // 30년생 이상은 1900년대, 그 외(00~29)는 2000년대로 가정 (혹은 현재 연도 기준 판단)
  // 여기서는 간단히 금년도 뒷자리보다 크면 1900년대, 작으면 2000년대로 가정
  if (yearSuffix <= (currentYear % 100)) {
    yearPrefix = '20';
  }
  
  const birthYear = parseInt(yearPrefix + birthDate.substring(0, 2));
  const birthMonth = parseInt(birthDate.substring(2, 4));
  const birthDay = parseInt(birthDate.substring(4, 6));
  
  let age = currentYear - birthYear;
  
  // 생일이 안 지났으면 1살 뺌
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }
  
  return `만 ${age}세`;
}

const CACHE_KEY = 'cached_candidates';
const CACHE_TIMESTAMP_KEY = 'cached_candidates_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Google Sheets에서 후보자 데이터를 가져옵니다
 * @param forceRefresh 캐시를 무시하고 새로고침 할지 여부
 * @returns 승인되고 노출 여부가 TRUE인 후보자 목록
 */
export async function fetchCandidatesFromSheets(forceRefresh = false): Promise<Candidate[]> {
  const scriptUrl = import.meta.env.VITE_CANDIDATE_SCRIPT_URL;
  
  if (!scriptUrl) {
    console.error('Google Apps Script URL이 설정되지 않았습니다.');
    return [];
  }

  // 1. Check Cache
  if (!forceRefresh) {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cachedData && cachedTimestamp) {
        const now = new Date().getTime();
        if (now - parseInt(cachedTimestamp) < CACHE_DURATION) {
          console.log('Serving candidates from cache');
          return JSON.parse(cachedData);
        }
      }
    } catch (e) {
      console.warn('Failed to read from cache', e);
    }
  }

  try {
    // URL 생성 (URL 생성자를 사용하여 쿼리 파라미터 안전하게 추가)
    const url = new URL(scriptUrl);
    url.searchParams.append('action', 'getCandidates');
    url.searchParams.append('t', String(new Date().getTime()));

    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store', // 브라우저 캐시 비활성화
    });

    if (!response.ok) {
      console.error('Failed to fetch candidates:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    // 데이터가 배열인지 확인
    if (!Array.isArray(data)) {
      console.error('Invalid data format received:', data);
      return [];
    }
    
    // 노출 여부가 TRUE인 후보자만 필터링
    const candidates: Candidate[] = data
      .filter((row: any) => row.isVisible === true || row.isVisible === 'TRUE')
      .map((row: any, index: number) => ({
        id: `candidate-${index}`,
        name: row.name || '',
        birthDate: String(row.birthDate || ''), // 문자열로 변환
        phone: row.phone || '',
        email: row.email || '',
        councilType: row.councilType || 'si',
        district: row.district || '',
        party: row.party || '',
        currentPosition: row.currentPosition || '',
        socialMediaUrl: row.socialMediaUrl || '',
        hasSocialWorkerLicense: String(row.hasSocialWorkerLicense || ''), // 문자열로 변환
        hasPaidMembershipFee: row.hasPaidMembershipFee === 'TRUE' || row.hasPaidMembershipFee === true,
        hasElectionOffice: row.hasElectionOffice === 'TRUE' || row.hasElectionOffice === true,
        officeAddress: row.officeAddress || '',
        hasKickoffEvent: row.hasKickoffEvent === 'TRUE' || row.hasKickoffEvent === true,
        kickoffEventDate: row.kickoffEventDate || '',
        kickoffEventDetails: row.kickoffEventDetails || '',
        careerSummary: row.careerSummary || '',
        welfarePolicy: row.welfarePolicy || '',
        candidatePhotoUrl: getGoogleDriveImageUrl(row.candidatePhotoUrl),
        electionFlyerUrl: row.electionFlyerUrl || '',
        isVisible: row.isVisible === 'TRUE' || row.isVisible === true,
        approved: true, // 노출 여부가 TRUE면 승인된 것으로 간주
        timestamp: row.timestamp || new Date().toISOString(),
      }));

    // 2. Save to Cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(candidates));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, String(new Date().getTime()));
    } catch (e) {
      console.warn('Failed to save to cache', e);
    }

    return candidates;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}
