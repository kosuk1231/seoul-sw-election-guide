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
  hasSocialWorkerLicense: boolean;
  hasPaidMembershipFee: boolean;
  hasElectionOffice: boolean;
  officeAddress?: string;
  hasKickoffEvent?: boolean;
  kickoffEventDate?: string;
  kickoffEventDetails?: string;
  careerSummary?: string;
  welfarePolicy?: string;
  candidatePhotoUrl?: string;
  electionFlyerUrl?: string;
  isVisible: boolean;
  approved: boolean;
  timestamp: string;
}

/**
 * Google Sheets에서 후보자 데이터를 가져옵니다
 * @returns 승인되고 노출 여부가 TRUE인 후보자 목록
 */
export async function fetchCandidatesFromSheets(): Promise<Candidate[]> {
  const scriptUrl = import.meta.env.VITE_CANDIDATE_SCRIPT_URL;
  
  if (!scriptUrl) {
    console.error('Google Apps Script URL이 설정되지 않았습니다.');
    return [];
  }

  try {
    // GET 요청으로 데이터 가져오기 (타임스탬프로 캐시 우회)
    const timestamp = new Date().getTime();
    const response = await fetch(scriptUrl + `?action=getCandidates&t=${timestamp}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store', // 브라우저 캐시 비활성화
    });

    if (!response.ok) {
      console.error('Failed to fetch candidates:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    // 노출 여부가 TRUE인 후보자만 필터링
    const candidates: Candidate[] = data
      .filter((row: any) => row.isVisible === true || row.isVisible === 'TRUE')
      .map((row: any, index: number) => ({
        id: `candidate-${index}`,
        name: row.name || '',
        birthDate: row.birthDate || '',
        phone: row.phone || '',
        email: row.email || '',
        councilType: row.councilType || 'si',
        district: row.district || '',
        hasSocialWorkerLicense: row.hasSocialWorkerLicense === 'TRUE' || row.hasSocialWorkerLicense === true,
        hasPaidMembershipFee: row.hasPaidMembershipFee === 'TRUE' || row.hasPaidMembershipFee === true,
        hasElectionOffice: row.hasElectionOffice === 'TRUE' || row.hasElectionOffice === true,
        officeAddress: row.officeAddress || '',
        hasKickoffEvent: row.hasKickoffEvent === 'TRUE' || row.hasKickoffEvent === true,
        kickoffEventDate: row.kickoffEventDate || '',
        kickoffEventDetails: row.kickoffEventDetails || '',
        careerSummary: row.careerSummary || '',
        welfarePolicy: row.welfarePolicy || '',
        candidatePhotoUrl: row.candidatePhotoUrl || '',
        electionFlyerUrl: row.electionFlyerUrl || '',
        isVisible: row.isVisible === 'TRUE' || row.isVisible === true,
        approved: true, // 노출 여부가 TRUE면 승인된 것으로 간주
        timestamp: row.timestamp || new Date().toISOString(),
      }));

    return candidates;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}
