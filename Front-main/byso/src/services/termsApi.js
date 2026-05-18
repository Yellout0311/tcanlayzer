// 약관 관련 API 호출 함수들
const BACKEND_BASE_URL = "https://api.byso.kro.kr";

// 토큰 재발급
export const reissueToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error("❌ Refresh Token이 없습니다.");
      return false;
    }

    console.log("🔄 토큰 재발급 시도 중...");

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error("❌ 토큰 재발급 실패:", response.status);
      return false;
    }

    const data = await response.json();
    console.log("✅ 토큰 재발급 성공:", data);

    // 새 토큰 저장
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return true;
  } catch (error) {
    console.error("❌ 토큰 재발급 오류:", error);
    return false;
  }
};

// 약관 목록 조회
export const fetchTermsList = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.log("토큰 없음, 약관 목록을 불러올 수 없습니다.");
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/terms/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      console.log("⚠️ 토큰 만료, 재발급 시도");
      const reissued = await reissueToken();
      if (reissued) {
        // 토큰 재발급 성공, 재시도
        return fetchTermsList();
      } else {
        // 토큰 재발급 실패
        console.log("❌ 토큰 재발급 실패");
        return null;
      }
    }

    if (!response.ok) {
      if (response.status === 500) {
        console.log("⚠️ 서버 오류 (500), 빈 목록 반환");
        return [];
      }
      throw new Error(`약관 목록 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ 약관 목록 조회 성공:", data);

    // 백엔드 응답을 프론트엔드 형식으로 변환
    const formattedTerms = data.map(item => {
      // localStorage에 저장된 분석 결과 확인
      let cachedAnalysis = null;
      try {
        const cached = localStorage.getItem(`terms_analysis_${item.id}`);
        if (cached) {
          cachedAnalysis = JSON.parse(cached);
        }
      } catch (e) {
        console.warn("⚠️ localStorage 파싱 실패:", e);
      }

      return {
        id: item.id,
        title: item.title || '제목 없음',
        date: item.createdAt ? new Date(item.createdAt).toLocaleString('ko-KR') : '날짜 없음',
        summary: cachedAnalysis?.summary || "저장된 약관입니다.",
        risks: cachedAnalysis?.evaluations
          ? cachedAnalysis.evaluations.map(ev => ({
              text: ev.content,
              level: ev.secureLevel === "DANGEROUS" ? "warning"
                   : ev.secureLevel === "SAFE" ? "good"
                   : "neutral"
            }))
          : [],
        keyPoints: cachedAnalysis?.points || []
      };
    });

    console.log("📋 formattedTerms:", formattedTerms);
    return formattedTerms;
  } catch (error) {
    console.error("❌ 약관 목록 조회 오류:", error);
    return null;
  }
};

// 약관 상세 정보 조회
export const fetchTermDetail = async (termId) => {
  console.log("🔍 약관 상세 조회 시작:", termId);
  console.log("  - termId 타입:", typeof termId);
  console.log("  - termId 값:", termId);

  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    return null;
  }

  try {
    // 1. GET /api/v1/terms/{id}/summary API로 요약 정보 가져오기
    console.log("🔄 Summary API 호출 시작, termId:", termId);
    const summaryResponse = await fetch(`${BACKEND_BASE_URL}/api/v1/terms/${termId}/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (summaryResponse.status === 401) {
      console.log("⚠️ 토큰 만료, 재발급 시도");
      const reissued = await reissueToken();
      if (reissued) {
        return fetchTermDetail(termId);
      } else {
        return null;
      }
    }

    if (!summaryResponse.ok) {
      throw new Error(`Summary API 호출 실패: ${summaryResponse.status}`);
    }

    const summaryData = await summaryResponse.json();
    console.log("✅ Summary API 응답:", summaryData);

    // 2. 하이라이트 API에서 원본 약관 텍스트와 하이라이트 데이터 가져오기
    console.log("🔄 하이라이트 API 호출 시작, termId:", termId);
    const highlightResponse = await fetchHighlights(termId);
    console.log("🔄 하이라이트 API 응답:", highlightResponse);

    if (!highlightResponse) {
      console.error("❌ 하이라이트 응답이 null입니다");
      alert('약관 데이터를 불러올 수 없습니다.');
      return null;
    }

    const fullTermsContent = highlightResponse.content || "";
    const highlightsData = highlightResponse.highlights || [];

    console.log("✅ 하이라이트 API에서 데이터 가져옴");
    console.log("  - content 길이:", fullTermsContent.length);
    console.log("  - highlights 개수:", highlightsData.length);

    // localStorage에 캐싱
    try {
      localStorage.setItem(`terms_analysis_${termId}`, JSON.stringify(summaryData));
      localStorage.setItem(`terms_content_${termId}`, fullTermsContent);
      console.log("💾 분석 결과를 localStorage에 캐싱");
    } catch (e) {
      console.error("❌ localStorage 저장 실패:", e);
    }

    // 3. 분석 결과 형식으로 변환
    return {
      id: termId,
      summary: summaryData.summary || "저장된 약관입니다.",
      risks: summaryData.evaluations
        ? summaryData.evaluations.map((item) => ({
            text: item.content,
            level:
              item.secureLevel === "DANGEROUS"
                ? "warning"
                : item.secureLevel === "SAFE"
                ? "good"
                : "neutral"
          }))
        : [],
      keyPoints: summaryData.points || [],
      fullTerms: fullTermsContent,
      highlights: highlightsData
    };
  } catch (error) {
    console.error("❌ 약관 상세 조회 오류:", error);
    alert(`약관을 불러오는 중 오류가 발생했습니다: ${error.message}`);
    return null;
  }
};

// 하이라이트 조회
export const fetchHighlights = async (termId) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/terms/${termId}/highlights`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      console.log("⚠️ 토큰 만료, 재발급 시도");
      const reissued = await reissueToken();
      if (reissued) {
        return fetchHighlights(termId);
      }
    }

    if (!response.ok) {
      let serverMessage = "";
      try {
        serverMessage = await response.text();
      } catch (e) {
        // ignore
      }
      const detail = serverMessage ? ` - ${serverMessage}` : '';
      throw new Error(`하이라이트 조회 실패: ${response.status}${detail}`);
    }

    const data = await response.json();
    console.log("🎨 하이라이트 조회 성공:", data);
    console.log("🎨 data.content 길이:", data.content?.length);
    console.log("🎨 data.content 앞부분:", data.content?.substring(0, 200));
    console.log("🎨 data.highlights 개수:", data.highlights?.length);

    return {
      content: data.content || "",
      highlights: Array.isArray(data.highlights) ? data.highlights : []
    };
  } catch (error) {
    console.error("❌ 하이라이트 조회 오류:", error);
    return null;
  }
};

// 약관 삭제
export const deleteTerms = async (termId) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.warn("⚠️ 토큰이 없어서 백엔드 삭제를 건너뜁니다.");
    return false;
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/terms/${termId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      console.log("⚠️ 토큰 만료, 재발급 시도");
      const reissued = await reissueToken();
      if (reissued) {
        return deleteTerms(termId);
      }
    }

    if (response.ok) {
      console.log("✅ 백엔드에서 약관 삭제 성공:", termId);
      return true;
    } else if (response.status === 404) {
      console.log("ℹ️ 약관이 이미 삭제되었거나 존재하지 않습니다:", termId);
      return true;
    } else {
      console.error("❌ 백엔드 삭제 실패:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ 백엔드 삭제 오류:", error);
    return false;
  }
};

// 약관 분석
export const analyzeTermsApi = async (termsText) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/terms/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: termsText })
    });

    if (response.status === 401) {
      console.log("⚠️ 토큰 만료, 재발급 시도");
      const reissued = await reissueToken();
      if (reissued) {
        return analyzeTermsApi(termsText);
      } else {
        throw new Error('토큰 재발급 실패');
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 분석 실패 응답:", errorText);
      throw new Error(`분석 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ 약관 분석 성공:", data);
    return data;
  } catch (error) {
    console.error("❌ 약관 분석 오류:", error);
    throw error;
  }
};
