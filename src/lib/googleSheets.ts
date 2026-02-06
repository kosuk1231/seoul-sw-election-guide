// Google Sheets 제출 유틸리티 함수

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
    }),
  });

  return response;
}

export async function submitPolicyToSheets(formData: any) {
  const scriptUrl = import.meta.env.VITE_POLICY_SCRIPT_URL;
  
  if (!scriptUrl) {
    throw new Error('Google Apps Script URL이 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }

  // 정책 제안 내용 통합
  const content = `현황: ${formData.currentIssue}\n\n제안 내용: ${formData.proposedSolution}${formData.expectedEffect ? `\n\n기대 효과: ${formData.expectedEffect}` : ''}`;

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
      content: content,
    }),
  });

  return response;
}
