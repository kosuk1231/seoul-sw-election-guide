// 파일 업로드 유틸리티 함수

/**
 * 파일을 Base64로 인코딩
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // "data:image/jpeg;base64," 부분 제거하고 순수 Base64만 반환
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * 파일의 MIME 타입과 확장자 추출
 */
export function getFileInfo(file: File) {
  const mimeType = file.type;
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return { mimeType, extension };
}

/**
 * 이미지 파일 유효성 검증
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 파일 크기 체크 (5MB 제한)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 5MB 이하여야 합니다.' };
  }

  // 이미지 형식 체크
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'JPG, PNG, WebP 형식만 업로드 가능합니다.' };
  }

  return { valid: true };
}

/**
 * PDF 또는 이미지 파일 유효성 검증 (공보물용)
 */
export function validateFlyerFile(file: File): { valid: boolean; error?: string } {
  // 파일 크기 체크 (10MB 제한)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 10MB 이하여야 합니다.' };
  }

  // 파일 형식 체크
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'JPG, PNG, WebP, PDF 형식만 업로드 가능합니다.' };
  }

  return { valid: true };
}
