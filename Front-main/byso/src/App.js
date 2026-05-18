import React, { useState, useEffect } from 'react';
import Settings from './components/Settings';
import LoginModal from './components/LoginModal';
import { useDarkMode } from './hooks/useDarkMode';
import { useAuth } from './hooks/useAuth';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [termsText, setTermsText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentPage, setCurrentPage] = useState('main');
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [activeTab, setActiveTab] = useState('분석결과');
  const [sortOrder, setSortOrder] = useState('최신'); // 정렬 순서
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [editingId, setEditingId] = useState(null); // 수정 중인 항목 ID
  const [editingTitle, setEditingTitle] = useState(''); // 수정 중인 제목
  const [isLoadingTerms, setIsLoadingTerms] = useState(false); // 약관 목록 로딩 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false); // 약관 분석 중 상태
  const [isSaved, setIsSaved] = useState(false); // 저장 완료 상태

  const { isDarkMode, toggleDarkMode, colors } = useDarkMode();
  const { isLoggedIn, userInfo, setIsLoggedIn, setUserInfo, logout, kakaoWithdraw } = useAuth();

  const BACKEND_BASE_URL = "https://api.byso.kro.kr";

  // 디버깅: 로그인 상태 확인
  console.log("🔍 현재 로그인 상태:", isLoggedIn, "사용자 정보:", userInfo);

  // 토큰 재발급 함수
  const reissueToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log("⚠️ refreshToken 없음");
      return false;
    }

    try {
      console.log("🔄 토큰 재발급 시도...");
      const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (!response.ok) {
        console.log("❌ 토큰 재발급 실패:", response.status);
        return false;
      }

      const data = await response.json();
      console.log("✅ 토큰 재발급 성공");

      // 새 토큰 저장
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return true;
    } catch (error) {
      console.error("❌ 토큰 재발급 오류:", error);
      return false;
    }
  };

  // 백엔드에서 약관 목록 불러오기
  const fetchTermsList = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log("토큰 없음, 약관 목록을 불러올 수 없습니다.");
      return;
    }

    setIsLoadingTerms(true);
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
          // 토큰 재발급 실패, 로그아웃
          console.log("❌ 토큰 재발급 실패, 로그아웃");
          logout();
          return;
        }
      }

      if (!response.ok) {
        if (response.status === 500) {
          console.error("❌ 서버 오류 (500): 백엔드에서 내부 오류가 발생했습니다.");
          // 사용자에게 친절한 메시지 표시 (선택사항)
          // alert("서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
        throw new Error(`약관 목록 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("📋 약관 목록 조회 성공:", data);
      console.log("📋 약관 개수:", data.terms?.length);
      console.log("📋 전체 약관 데이터:", data.terms);

      // API 응답을 savedAnalyses 형식으로 변환
      const formattedTerms = (data.terms || []).map(term => {
        console.log("  - 약관 매핑:", {
          id: term.id,
          title: term.title,
          createdAt: term.createdAt,
          risk: term.risk,
          dangerousCount: term.dangerousCount
        });
        // 날짜 포맷팅
        let formattedDate = '날짜 없음';
        if (term.createdAt) {
          const date = new Date(term.createdAt);
          formattedDate = date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else if (term.date) {
          formattedDate = term.date;
        }

        // 위험도 판단
        let riskLevel = '미분류';
        if (term.risk) {
          riskLevel = term.risk;
        } else if (term.dangerousCount !== undefined) {
          // dangerousCount 기반 판단
          if (term.dangerousCount > 0) {
            riskLevel = '위험';
          } else if (term.warningCount > 0) {
            riskLevel = '주의';
          } else {
            riskLevel = '안전';
          }
        }

        return {
          id: term.id,
          title: term.title || `약관 ${term.id}`,
          date: formattedDate,
          risk: riskLevel,
          result: null // 상세 정보는 클릭 시 로드
        };
      });

      console.log("📋 formattedTerms:", formattedTerms);
      setSavedAnalyses(formattedTerms);
      console.log("✅ setSavedAnalyses 호출 완료");
    } catch (error) {
      console.error("❌ 약관 목록 조회 오류:", error);
    } finally {
      setIsLoadingTerms(false);
    }
  };

  // 로그인 상태가 변경되면 약관 목록 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchTermsList();
    } else {
      setSavedAnalyses([]);
    }
  }, [isLoggedIn]);

  // 약관 상세 정보 가져오기 (ID로)
  const fetchTermDetail = async (termId) => {
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
          logout();
          return null;
        }
      }

      if (!summaryResponse.ok) {
        throw new Error(`Summary API 호출 실패: ${summaryResponse.status}`);
      }

      const summaryData = await summaryResponse.json();
      console.log("✅ Summary API 응답:", summaryData);

      // 2. 하이라이트 API에서 원본 약관 텍스트와 하이라이트 데이터 가져오기 (재시도 로직 포함)
      console.log("🔄 하이라이트 API 호출 시작, termId:", termId);

      let fullTermsContent = "";
      let highlightsData = [];

      // 하이라이트 로딩 재시도 (최대 5번, 3초 간격)
      const maxRetries = 5;
      for (let i = 0; i < maxRetries; i++) {
        const highlightResponse = await fetchHighlights(termId);
        console.log(`🔄 하이라이트 API 응답 (시도 ${i + 1}/${maxRetries}):`, highlightResponse);

        if (!highlightResponse) {
          console.error("❌ 하이라이트 응답이 null입니다");
          if (i === maxRetries - 1) {
            alert('약관 데이터를 불러올 수 없습니다.');
            return null;
          }
        } else {
          fullTermsContent = highlightResponse.content || "";
          highlightsData = highlightResponse.highlights || [];

          console.log("✅ 하이라이트 API에서 데이터 가져옴");
          console.log("  - content 길이:", fullTermsContent.length);
          console.log("  - highlights 개수:", highlightsData.length);

          // 하이라이트가 있으면 성공
          if (highlightsData.length > 0) {
            console.log("✅ 하이라이트 로딩 성공!");
            break;
          }

          // 하이라이트가 없고 마지막 시도가 아니면 대기 후 재시도
          if (i < maxRetries - 1) {
            console.log(`⏳ 하이라이트가 아직 준비되지 않았습니다. ${3}초 후 재시도... (${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기
          } else {
            console.log("⚠️ 하이라이트를 불러오지 못했습니다. 약관 원문만 표시됩니다.");
          }
        }
      }

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

  // 하이라이트만 별도로 가져오기 (새로고침용)
  const fetchHighlights = async (termId) => {
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
          // 토큰 재발급 성공, 재시도
          return fetchHighlights(termId);
        } else {
          // 토큰 재발급 실패, 로그아웃
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          logout();
          return null;
        }
      }

      if (!response.ok) {
        let serverMessage = '';
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
      // fetchTermDetail 내부에서 호출되므로 alert 제거 (로그만 남김)
      return null;
    }
  };

  // OAuth 콜백 처리
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        // 이미 처리 중이거나 처리 완료된 코드인지 확인
        const processedCode = sessionStorage.getItem('processed_code');
        if (processedCode === code) {
          console.log("⏭️ 이미 처리된 인가 코드, 스킵");
          return;
        }

        // 처리 중으로 표시
        sessionStorage.setItem('processed_code', code);

        console.log("🎯 인가 코드 받음:", code);

        try {
          const payload = { authorizationCode: code };
          console.log("📤 백엔드로 전송할 payload:", payload);

          // 백엔드 로그인 요청
          const res = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          console.log("📥 백엔드 응답 상태:", res.status, res.statusText);

          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ 백엔드 로그인 실패:", errorText);
            throw new Error(`백엔드 로그인 실패: ${res.status} - ${errorText}`);
          }

          const data = await res.json();
          console.log("✅ 백엔드 응답 데이터:", data);

          // JWT 토큰 저장
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          // 백엔드 응답에 사용자 정보가 포함되어 있는지 확인
          let userData;

          if (data.user || data.userInfo || data.nickname) {
            // 백엔드에서 사용자 정보를 함께 보내주는 경우
            console.log("✅ 백엔드에서 사용자 정보 받음");
            userData = {
              id: data.user?.id || data.userId || data.id,
              nickname: data.user?.nickname || data.nickname || "사용자",
              email: data.user?.email || data.email || null,
              profileImage: data.user?.profileImage || data.profileImage || null
            };
          } else {
            // 백엔드에서 사용자 정보를 안 보내주면 카카오 API 직접 호출
            console.log("⚠️ 백엔드에 사용자 정보 없음, 카카오 API 직접 호출 시도");
            try {
              const resUserInfo = await new Promise((resolve, reject) => {
                window.Kakao.API.request({
                  url: "/v2/user/me",
                  success: resolve,
                  fail: reject
                });
              });

              userData = {
                id: resUserInfo.id,
                nickname: resUserInfo.properties?.nickname || "사용자",
                email: resUserInfo.kakao_account?.email || null,
                profileImage: resUserInfo.properties?.profile_image || null
              };
            } catch (kakaoError) {
              console.error("❌ 카카오 API 호출 실패:", kakaoError);
              // 카카오 API 실패 시 기본값 사용
              userData = {
                id: Date.now(),
                nickname: "사용자",
                email: null,
                profileImage: null
              };
            }
          }

          console.log("✅ 로그인 성공 - userInfo:", userData);
          localStorage.setItem("kakao_user_info", JSON.stringify(userData));

          // 상태 업데이트
          console.log("🔄 상태 업데이트 시작");
          setIsLoggedIn(true);
          setUserInfo(userData);
          console.log("✅ 상태 업데이트 완료");
          

          // URL에서 code 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);

          alert(`${userData.nickname}님, 환영합니다!`);

        } catch (error) {
          console.error("❌ 로그인 처리 오류:", error);
          alert(`로그인 중 오류가 발생했습니다: ${error.message}`);
          // 에러 발생 시 처리된 코드 제거 (재시도 가능하도록)
          sessionStorage.removeItem('processed_code');
          // URL에서 code 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleOAuthCallback();
  }, [setIsLoggedIn, setUserInfo, BACKEND_BASE_URL]);

  // 카카오 로그인 성공 시 추가 처리
  const handleKakaoLoginSuccess = (userInfo) => {
    console.log('App.js에서 카카오 로그인 성공 처리:', userInfo);
    // 필요한 경우 추가 상태 업데이트
    setShowLoginModal(false);
  };
  const handleKakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
        alert("카카오 SDK가 준비되지 않았습니다. 초기화 코드를 확인하세요.");
        return;
    }

    console.log("🚀 카카오 로그인 시작");

    const REDIRECT_URI = "https://byso.vercel.app/oauth/callback/kakao";
    console.log("📍 사용 중인 Redirect URI:", REDIRECT_URI);

    // authorize 방식으로 변경 (인가 코드 받기)
    window.Kakao.Auth.authorize({
        redirectUri: REDIRECT_URI,
        scope: "profile_nickname"  // 이메일 권한 제거
    });
};

  // 모달 관련 함수들
  const showLogin = () => {
    setCurrentPage('main'); 
    setShowLoginModal(true);
  }
  
  const closeLoginModal = () => setShowLoginModal(false);

    const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 분석 삭제 함수 (ID로 삭제)
  const deleteAnalysis = async (analysisId) => {
    // ID로 항목 찾기
    const analysis = savedAnalyses.find(item => item.id === analysisId);

    if (!analysis) {
      console.error("❌ 삭제할 항목이 없습니다. analysisId:", analysisId);
      alert('삭제할 항목을 찾을 수 없습니다.');
      return;
    }

    console.log("🗑️ 약관 삭제 시작:", analysis);
    console.log("  - analysis.id:", analysis.id);
    console.log("  - analysis.title:", analysis.title);

    if (!window.confirm(`'${analysis.title || '제목 없음'}'을(를) 삭제하시겠습니까?`)) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn("⚠️ 토큰이 없어서 삭제할 수 없습니다.");
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      console.log("🔄 DELETE 요청 시작:", `${BACKEND_BASE_URL}/api/v1/terms/${analysisId}`);

      const response = await fetch(`${BACKEND_BASE_URL}/api/v1/terms/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("📡 DELETE 응답 상태:", response.status);

      if (response.status === 401) {
        console.log("⚠️ 토큰 만료, 재발급 시도");
        const reissued = await reissueToken();
        if (reissued) {
          // 토큰 재발급 후 다시 삭제 시도
          return deleteAnalysis(analysisId);
        } else {
          alert('인증에 실패했습니다. 다시 로그인해주세요.');
          logout();
          return;
        }
      }

      if (response.ok) {
        console.log("✅ 백엔드에서 약관 삭제 성공:", analysisId);

        // 백엔드 삭제 성공 후 프론트엔드에서 ID로 제거
        const newAnalyses = savedAnalyses.filter(item => item.id !== analysisId);
        setSavedAnalyses(newAnalyses);

        // localStorage에서도 제거
        localStorage.removeItem(`terms_analysis_${analysisId}`);
        localStorage.removeItem(`terms_content_${analysisId}`);

        alert('삭제되었습니다.');
      } else if (response.status === 404) {
        console.log("ℹ️ 약관이 이미 삭제되었거나 존재하지 않습니다:", analysisId);

        // 프론트엔드에서도 ID로 제거
        const newAnalyses = savedAnalyses.filter(item => item.id !== analysisId);
        setSavedAnalyses(newAnalyses);

        alert('이미 삭제된 항목입니다.');
      } else {
        const errorText = await response.text();
        console.error("❌ 백엔드 삭제 실패:", response.status, errorText);
        alert(`삭제에 실패했습니다. (${response.status})`);
      }
    } catch (error) {
      console.error("❌ 약관 삭제 중 오류:", error);
      alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const analyzeTerms = async () => {
  if (!termsText.trim()) {
    alert("분석할 약관을 입력해주세요.");
    return;
  }

  setIsAnalyzing(true); // 로딩 시작
  setIsSaved(false); // 저장 상태 초기화

  try {
    const token = localStorage.getItem('accessToken');
    console.log("📤 약관 분석 요청");

    // 토큰 유효성 사전 체크
    if (isLoggedIn && !token) {
      console.error("❌ 로그인 상태이지만 토큰이 없습니다.");
      alert("로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.");
      logout();
      return;
    }

    if (token) {
      console.log("✅ 토큰 확인됨, 인증된 요청으로 진행");
    } else {
      console.log("⚠️ 토큰 없음, 비로그인 요청으로 진행 (분석 결과 저장 안 됨)");
    }

    const requestBody = { content: termsText };
    const bodyString = JSON.stringify(requestBody);

    console.log("➡️ POST /api/v1/terms 요청 정보:");
    console.log("  - URL:", `${BACKEND_BASE_URL}/api/v1/terms`);
    console.log("  - termsText 값:", termsText);
    console.log("  - termsText 길이:", termsText?.length);
    console.log("  - termsText 타입:", typeof termsText);
    console.log("  - requestBody 객체:", requestBody);
    console.log("  - bodyString:", bodyString);
    console.log("  - bodyString 길이:", bodyString.length);
    console.log("  - bodyString bytes:", new Blob([bodyString]).size);

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: bodyString
    };

    console.log("  - fetch options:", fetchOptions);
    console.log("  - headers:", fetchOptions.headers);
    console.log("  - token 존재:", !!token);
    console.log("  - token 앞 20자:", token?.substring(0, 20));

    console.log("🚀 fetch 요청 전송 중...");
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/terms`, fetchOptions);
    console.log("📡 응답 받음:", response.status, response.statusText);

    // 401 Unauthorized - 토큰 만료 또는 인증 실패
    if (response.status === 401) {
      console.log("⚠️ 401 인증 오류 발생");
      if (token) {
        console.log("🔄 토큰 재발급 시도");
        const reissued = await reissueToken();
        if (reissued) {
          console.log("✅ 토큰 재발급 성공, 분석 재시도");
          return analyzeTerms();
        } else {
          console.error("❌ 토큰 재발급 실패");
          alert('로그인 세션이 만료되었습니다.\n다시 로그인하여 분석 결과를 저장하세요.');
          logout();
          return;
        }
      } else {
        console.error("❌ 토큰 없이 401 에러 발생");
        alert('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
        return;
      }
    }

    // 403 Forbidden - 권한 없음
    if (response.status === 403) {
      console.error("❌ 403 권한 오류 발생");
      alert('접근 권한이 없습니다. 다시 로그인해주세요.');
      if (isLoggedIn) {
        logout();
      }
      return;
    }

    // 500 Internal Server Error
    if (response.status === 500) {
      console.error("❌ 500 서버 내부 오류 발생");
      alert('서버에 일시적인 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.\n\n문제가 계속되면 로그아웃 후 다시 로그인해보세요.');
      return;
    }

    if (!response.ok) {
      let errorText = "서버 응답 오류";
      try {
        const errorData = await response.json();
        errorText = errorData.message || errorData.error || `${response.status} - ${response.statusText}`;
      } catch {
        errorText = `${response.status} - ${response.statusText}`;
      }
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("✅ 서버 응답:", data);
    console.log("📋 약관 ID:", data.id);

    // 데이터 검증
    if (!data.id) {
      console.error("❌ 서버 응답에 약관 ID가 없습니다. 데이터가 제대로 저장되지 않았을 수 있습니다.");
      if (isLoggedIn) {
        alert('⚠️ 약관 분석은 완료되었으나 **저장하지 못했습니다**.\n\n가능한 원인:\n- 로그인 세션 만료\n- 서버 저장 오류\n\n해결방법:\n1. 로그아웃 후 다시 로그인\n2. 약관 재분석\n\n분석 결과는 현재 화면에서 확인 가능합니다.');
    }
    } else {
      console.log("✅ 약관 ID 확인:", data.id);
    }

    console.log("🎨 서버에서 받은 highlights:", data.highlights);
    console.log("🎨 highlights 타입:", typeof data.highlights);
    console.log("🎨 highlights 배열인가?:", Array.isArray(data.highlights));

    // 분석 결과 전체를 localStorage에 저장 (약관 ID를 키로 사용)
    if (data.id) {
      try {
        // 원본 약관 텍스트 저장
        localStorage.setItem(`terms_content_${data.id}`, termsText);
        console.log("💾 원본 약관을 localStorage에 저장:", data.id);

        // 분석 결과 전체 저장 (summary, evaluations, points 포함)
        const analysisData = {
          summary: data.summary,
          evaluations: data.evaluations,
          points: data.points,
          highlights: data.highlights
        };
        localStorage.setItem(`terms_analysis_${data.id}`, JSON.stringify(analysisData));
        console.log("💾 분석 결과를 localStorage에 저장:", data.id);
      } catch (e) {
        console.error("❌ localStorage 저장 실패:", e);
      }
    }

    // 백엔드 응답 데이터 구조 기반으로 state 구성
    const result = {
      id: data.id, // 서버에서 받은 약관 ID 저장
      summary: data.summary || "분석 요약이 없습니다.",
      risks: Array.isArray(data.evaluations)
        ? data.evaluations.map((item) => ({
            text: item.content,
            level:
              item.secureLevel === "DANGEROUS"
                ? "warning"
                : item.secureLevel === "SAFE"
                ? "good"
                : "neutral"
          }))
        : [],
      keyPoints: Array.isArray(data.points) ? data.points : [],
      fullTerms: termsText,
      highlights: Array.isArray(data.highlights) ? data.highlights : []
    };

    console.log("🎨 result에 저장된 highlights:", result.highlights);
    console.log("🎨 result에 저장된 highlights 개수:", result.highlights?.length);
    console.log("🎨 result 전체 객체:", result);

    // 분석 결과 표시
    setAnalysisResult(result);
    setActiveTab("분석결과");
    setCurrentPage("result");

    console.log("✅ 분석 완료 - 결과 화면에 표시됨");
    console.log("✅ analysisResult 상태 업데이트됨");

    // 다음 렌더링에서 확인하기 위해 setTimeout 사용
    setTimeout(() => {
      console.log("🔍 렌더링 후 analysisResult.highlights:", result.highlights);
      console.log("🔍 하이라이트 조건:", {
        exists: !!result.highlights,
        isArray: Array.isArray(result.highlights),
        length: result.highlights?.length,
        condition: result.highlights && result.highlights.length > 0
      });
    }, 100);

    // 비로그인 상태 안내
    if (!isLoggedIn || !token) {
      console.warn("⚠️ 비로그인 상태 - 로그인하면 분석 결과를 저장하고 다시 볼 수 있습니다");
    }
  } catch (error) {
    console.error("약관 분석 중 오류:", error);
    alert(`서버 통신 중 오류가 발생했습니다: ${error.message}. 다시 시도해주세요.`);
  } finally {
    setIsAnalyzing(false); // 로딩 종료
  }
};


  // 분석 결과 저장 함수 (사이드바에 추가)
  const saveAnalysis = async () => {
    console.log("💾 saveAnalysis 함수 호출됨");
    console.log("💾 isLoggedIn:", isLoggedIn);
    console.log("💾 analysisResult:", analysisResult);
    console.log("💾 analysisResult.id:", analysisResult?.id);

    if (!isLoggedIn) {
      alert('저장하려면 로그인이 필요합니다.');
      setShowLoginModal(true);
      return;
    }

    if (!analysisResult) {
      alert('저장할 분석 결과가 없습니다.');
      return;
    }

    if (!analysisResult.id) {
      alert('약관 ID가 없습니다. 분석을 다시 시도해주세요.');
      console.error("❌ analysisResult.id가 없습니다:", analysisResult);
      return;
    }

    try {
      console.log("💾 사이드바에 약관 추가 중... (약관 ID:", analysisResult.id, ")");

      // 사이드바 목록 새로고침
      await fetchTermsList();

      // 하이라이트 로딩 시도 (백그라운드에서 처리 중일 수 있음)
      const loadHighlights = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            const highlightData = await fetchHighlights(analysisResult.id);
            if (highlightData && highlightData.highlights && highlightData.highlights.length > 0) {
              // fullTerms는 유지하고 highlights만 업데이트
              setAnalysisResult(prev => ({
                ...prev,
                highlights: highlightData.highlights
              }));
              console.log("✅ 하이라이트 로딩 성공");
              return;
            }
            // 하이라이트가 아직 준비되지 않은 경우 짧은 대기 후 재시도
            if (i < retries - 1) {
              console.log(`⏳ 하이라이트 대기 중... (${i + 1}/${retries})`);
              await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
            }
          } catch (highlightError) {
            console.error(`하이라이트 로딩 실패 (시도 ${i + 1}/${retries}):`, highlightError);
            if (i < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        console.log("⚠️ 하이라이트를 불러오지 못했습니다. 나중에 다시 시도해주세요.");
      };

      await loadHighlights();

      setIsSaved(true); // 저장 완료 상태로 변경
      alert('저장되었습니다!');
      console.log("✅ 사이드바에 약관이 표시됩니다");

    } catch (error) {
      console.error("❌ 저장 중 오류:", error);
      alert(`저장에 실패했습니다: ${error.message}`);
    }
  };

  // 메인 페이지로 이동 함수
  const goToMain = () => {
    setCurrentPage('main');
    setTermsText('');
    setAnalysisResult(null);
  };

  // 하이라이트 적용 함수
  const applyHighlights = (text, highlights) => {
    if (!highlights || highlights.length === 0) {
      return text;
    }

    // 위험도별 색상 정의
    const getRiskColor = (riskLevel) => {
      switch(riskLevel) {
        case '상':
          return isDarkMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255, 205, 210, 0.6)';
        case '중':
          return isDarkMode ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 243, 205, 0.6)';
        case '하':
          return isDarkMode ? 'rgba(33, 150, 243, 0.3)' : 'rgba(187, 222, 251, 0.6)';
        default:
          return isDarkMode ? 'rgba(158, 158, 158, 0.3)' : 'rgba(224, 224, 224, 0.6)';
      }
    };

    // 하이라이트를 startIndex 기준으로 정렬
    const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex);

    const parts = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      const { startIndex, endIndex, riskLevel, reason } = highlight;

      // 하이라이트 이전 텍스트
      if (startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, startIndex)}
          </span>
        );
      }

      // 하이라이트 텍스트
      parts.push(
        <mark
          key={`highlight-${index}`}
          style={{
            backgroundColor: getRiskColor(riskLevel),
            padding: '2px 0',
            borderRadius: '3px',
            cursor: 'help'
          }}
          title={`위험도: ${riskLevel} - ${reason}`}
        >
          {text.substring(startIndex, endIndex)}
        </mark>
      );

      lastIndex = endIndex;
    });

    // 마지막 하이라이트 이후 남은 텍스트
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  // 하이라이트 새로고침 함수
  const refreshHighlights = async () => {
    if (!analysisResult || !analysisResult.id) {
      alert('약관 ID가 없습니다. 저장된 약관만 하이라이트를 새로고침할 수 있습니다.');
      return;
    }

    const retries = 3;
    for (let i = 0; i < retries; i++) {
      try {
        const highlightData = await fetchHighlights(analysisResult.id);
        if (highlightData) {
          // fullTerms는 그대로 유지하고 highlights만 업데이트
          setAnalysisResult({
            ...analysisResult,
            highlights: highlightData.highlights
          });
          alert('하이라이트가 새로고침되었습니다!');
          return;
        }
      } catch (e) {
        console.error(`하이라이트 새로고침 실패 (시도 ${i + 1}/${retries}):`, e);
      }
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    alert('하이라이트 새로고침에 실패했습니다. 잠시 후 다시 시도해주세요.');
  };

  // 탭 내용 렌더링 함수
  const renderTabContent = () => {
    if (!analysisResult) {
      return <p style={{ color: colors.textSecondary }}>아직 분석 결과가 없습니다.</p>;
    }

    // 방어적으로 각 필드도 검사
    const { summary, risks = [], keyPoints = [], personalInfo, financialInfo, fullTerms } = analysisResult;

    switch (activeTab) {
      case '분석결과':
        return (
          <div>
            <h4 style={{color: colors.textPrimary, marginBottom: '20px', fontSize: 'clamp(18px, 3vw, 20px)'}}>AI 요약</h4>
            <p style={{lineHeight: '1.7', fontSize: 'clamp(14px, 2.5vw, 16px)', color: colors.textSecondary, marginBottom: '30px'}}>{analysisResult.summary || "요약 결과 없음"}</p>
            
            <h4 style={{color: colors.textPrimary, marginBottom: '20px', fontSize: 'clamp(18px, 3vw, 20px)'}}>위험도 평가</h4>
            <div style={{
              display: "flex",
              gap: "15px",
              margin: "25px 0",
              flexWrap: "wrap"
            }}>
              {analysisResult.risks.map((risk, index) => (
                <div 
                  key={index} 
                  style={{
                    padding: "12px 20px",
                    borderRadius: "25px",
                    fontSize: "clamp(13px, 2vw, 15px)",
                    fontWeight: "600",
                    ...(risk.level === 'warning' ? 
                      {
                        background: isDarkMode ? "rgba(255, 193, 7, 0.2)" : "rgba(255, 243, 205, 0.8)", 
                        color: isDarkMode ? "#ffc107" : "#856404"
                      } : 
                      {
                        background: isDarkMode ? "rgba(76, 175, 80, 0.2)" : "rgba(212, 237, 218, 0.8)", 
                        color: isDarkMode ? "#4caf50" : "#155724"
                      })
                  }}
                >
                  {risk.text}
                </div>
              ))}
            </div>

            <h4 style={{color: colors.textPrimary, marginBottom: '20px', fontSize: 'clamp(18px, 3vw, 20px)', marginTop: '30px'}}>주요 포인트</h4>
            <ul style={{paddingLeft: '25px'}}>
              {analysisResult.keyPoints.map((point, index) => (
                <li key={index} style={{marginBottom: '12px', lineHeight: '1.6', fontSize: 'clamp(14px, 2.5vw, 16px)', color: colors.textSecondary}}>{point}</li>
              ))}
            </ul>

            {/* 주의해야 할 문구 섹션 */}
            <div style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{color: colors.textPrimary, margin: 0, fontSize: 'clamp(18px, 3vw, 20px)'}}>주의해야 할 문구</h4>
                {analysisResult.id && (
                  <button
                    onClick={refreshHighlights}
                    style={{
                      background: colors.buttonBg,
                      color: colors.textPrimary,
                      border: `2px solid ${colors.border}`,
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🔄 하이라이트 새로고침
                  </button>
                )}
              </div>
              {analysisResult.highlights && analysisResult.highlights.length > 0 ? (
                <>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '15px',
                  flexWrap: 'wrap',
                  padding: '10px',
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  borderRadius: '10px',
                  border: `1px solid ${colors.border}`,
                  fontSize: '12px'
                }}>
                  <span style={{ fontWeight: '600', color: colors.textPrimary }}>위험도:</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255, 205, 210, 0.6)',
                      borderRadius: '3px'
                    }}></span>
                    상
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      backgroundColor: isDarkMode ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 243, 205, 0.6)',
                      borderRadius: '3px'
                    }}></span>
                    중
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.3)' : 'rgba(187, 222, 251, 0.6)',
                      borderRadius: '3px'
                    }}></span>
                    하
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}>
                  {analysisResult.highlights.map((highlight, index) => {
                    const getRiskColor = (riskLevel) => {
                      switch(riskLevel) {
                        case '상':
                          return {
                            bg: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 205, 210, 0.8)',
                            border: isDarkMode ? 'rgba(244, 67, 54, 0.5)' : 'rgba(244, 67, 54, 0.4)',
                            text: isDarkMode ? '#f44336' : '#c62828'
                          };
                        case '중':
                          return {
                            bg: isDarkMode ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 243, 205, 0.8)',
                            border: isDarkMode ? 'rgba(255, 193, 7, 0.5)' : 'rgba(255, 193, 7, 0.4)',
                            text: isDarkMode ? '#ffc107' : '#856404'
                          };
                        case '하':
                          return {
                            bg: isDarkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(187, 222, 251, 0.8)',
                            border: isDarkMode ? 'rgba(33, 150, 243, 0.5)' : 'rgba(33, 150, 243, 0.4)',
                            text: isDarkMode ? '#2196f3' : '#1565c0'
                          };
                        default:
                          return {
                            bg: isDarkMode ? 'rgba(158, 158, 158, 0.2)' : 'rgba(224, 224, 224, 0.8)',
                            border: isDarkMode ? 'rgba(158, 158, 158, 0.5)' : 'rgba(158, 158, 158, 0.4)',
                            text: colors.textSecondary
                          };
                      }
                    };

                    const colors_highlight = getRiskColor(highlight.riskLevel);
                    const highlightedText = analysisResult.fullTerms.substring(highlight.startIndex, highlight.endIndex);

                    return (
                      <div
                        key={index}
                        style={{
                          background: colors_highlight.bg,
                          border: `2px solid ${colors_highlight.border}`,
                          borderRadius: '12px',
                          padding: '15px',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '10px'
                        }}>
                          <span style={{
                            background: colors_highlight.text,
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}>
                            위험도: {highlight.riskLevel}
                          </span>
                        </div>
                        <div style={{
                          fontSize: 'clamp(13px, 2.2vw, 15px)',
                          lineHeight: '1.6',
                          color: colors.textPrimary,
                          marginBottom: '10px',
                          fontWeight: '600',
                          fontStyle: 'italic'
                        }}>
                          "{highlightedText}"
                        </div>
                        {highlight.reason && (
                          <div style={{
                            fontSize: 'clamp(12px, 2vw, 14px)',
                            lineHeight: '1.5',
                            color: colors.textSecondary,
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: `1px solid ${colors.border}`
                          }}>
                            <strong>사유:</strong> {highlight.reason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                </>
              ) : (
                <div style={{
                  padding: '30px 20px',
                  background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                  borderRadius: '10px',
                  border: `1px solid ${colors.border}`,
                  textAlign: 'center',
                  color: colors.textSecondary
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>✓</div>
                  <p style={{
                    margin: '10px 0',
                    fontSize: 'clamp(16px, 2.5vw, 18px)',
                    fontWeight: '600',
                    color: colors.textPrimary
                  }}>
                    주의해야 할 문구가 없습니다
                  </p>
                  <p style={{
                    margin: '10px 0',
                    fontSize: 'clamp(13px, 2vw, 15px)',
                    color: colors.textSecondary
                  }}>
                    이 약관은 특별히 주의가 필요한 항목이 발견되지 않았습니다.
                  </p>
                  {analysisResult.id && (
                    <p style={{
                      margin: '15px 0 0 0',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      opacity: 0.8
                    }}>
                      하이라이트가 아직 분석 중이라면 위의 "🔄 하이라이트 새로고침" 버튼을 눌러주세요.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case '전체 약관':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{color: colors.textPrimary, margin: 0, fontSize: 'clamp(18px, 3vw, 20px)'}}>전체 약관 내용</h4>
              {analysisResult.id && (
                <button
                  onClick={refreshHighlights}
                  style={{
                    background: colors.buttonBg,
                    color: colors.textPrimary,
                    border: `2px solid ${colors.border}`,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔄 하이라이트 새로고침
                </button>
              )}
            </div>

            {/* 하이라이트 상태 안내 */}
            {analysisResult.highlights && analysisResult.highlights.length > 0 ? (
              // 하이라이트가 있으면 범례 표시
              <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '15px',
                flexWrap: 'wrap',
                padding: '15px',
                background: isDarkMode ? '#2a2a2a' : '#ffffff',
                borderRadius: '10px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>위험도:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255, 205, 210, 0.6)',
                    borderRadius: '3px'
                  }}></span>
                  <span style={{ fontSize: '14px', color: colors.textSecondary }}>상</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: isDarkMode ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 243, 205, 0.6)',
                    borderRadius: '3px'
                  }}></span>
                  <span style={{ fontSize: '14px', color: colors.textSecondary }}>중</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.3)' : 'rgba(187, 222, 251, 0.6)',
                    borderRadius: '3px'
                  }}></span>
                  <span style={{ fontSize: '14px', color: colors.textSecondary }}>하</span>
                </div>
              </div>
            ) : (
              // 하이라이트가 없으면 안내 메시지 표시
              <div style={{
                padding: '12px 15px',
                marginBottom: '15px',
                background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                fontSize: '14px',
                color: colors.textSecondary,
                textAlign: 'center'
              }}>
                ⏳ 하이라이트 분석 중입니다. 위의 "🔄 하이라이트 새로고침" 버튼을 눌러주세요.
              </div>
            )}

            <div style={{
              background: isDarkMode ? '#1a1a1a' : '#f5f5f5',
              padding: '20px',
              borderRadius: '10px',
              maxHeight: '400px',
              overflowY: 'auto',
              border: `1px solid ${colors.border}`
            }}>
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 'clamp(12px, 2vw, 14px)',
                color: colors.textSecondary,
                margin: 0,
                fontFamily: 'inherit',
                lineHeight: '1.8'
              }}>
                {analysisResult.highlights && analysisResult.highlights.length > 0
                  ? applyHighlights(analysisResult.fullTerms, analysisResult.highlights)
                  : analysisResult.fullTerms
                }
              </pre>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Settings 페이지로 전환
  if (currentPage === 'settings') {
    return (
      <Settings 
        onBack={() => setCurrentPage('main')}
        onShowLogin={showLogin}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        colors={colors}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        onWithdraw={kakaoWithdraw} //탈퇴 함수 
        onLogout={logout}
        onDeleteAnalyses={() => {
        if (window.confirm('정말 모든 분석 기록을 삭제하시겠습니까?')) {
          setSavedAnalyses([]);     // 저장된 분석 결과 모두 제거
          setCurrentPage('main');   // 홈으로 이동
          setSidebarOpen(false);    // 사이드바 닫기
          alert('모든 분석 기록이 삭제되었습니다.');
        }
      }}
        // 모든 데이터(로그인, 분석결과, 상태값 등) 초기화
        onResetData={() => {
          if (window.confirm('정말 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            logout();
            setSavedAnalyses([]);
            setSidebarOpen(false);
            setTermsText('');
            setAnalysisResult(null);
            setCurrentPage('main');
            alert('모든 데이터가 삭제되었습니다.');
          }
        }}
      />
    );
  }

  // 분석 결과 페이지
  if (currentPage === 'result') {
    return (
      <div style={{
        fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
        background: colors.background,
        minHeight: "100vh",
        color: colors.textPrimary,
        padding: "20px",
        position: "relative"
      }}>
        {/* 로딩 오버레이 */}
        {isAnalyzing && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(5px)"
          }}>
            <div style={{
              background: isDarkMode ? "#2a2a2a" : "#ffffff",
              padding: "40px 60px",
              borderRadius: "20px",
              boxShadow: "0 10px 50px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px"
            }}>
              <div className="spinner" style={{
                width: "60px",
                height: "60px",
                border: `5px solid ${isDarkMode ? '#444' : '#e0e0e0'}`,
                borderTop: `5px solid ${colors.textPrimary}`,
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
              <div style={{
                color: colors.textPrimary,
                fontSize: "20px",
                fontWeight: "600"
              }}>
                약관 분석 중...
              </div>
              <div style={{
                color: colors.textSecondary,
                fontSize: "14px",
                textAlign: "center"
              }}>
                AI가 약관을 분석하고 있습니다.<br/>
                잠시만 기다려주세요.
              </div>
            </div>
          </div>
        )}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box"
        }}>
          {/* 상단 헤더 */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px"
          }}>
            <h1 
              style={{
                color: colors.textPrimary,
                fontSize: "clamp(32px, 6vw, 48px)",
                fontWeight: "900",
                margin: 0,
                cursor: "pointer",
                letterSpacing: "4px"
              }}
              onClick={goToMain}
            >
              BYSO
            </h1>
            <div style={{display: "flex", gap: "15px"}}>
              <button style={{
                background: colors.buttonBg,
                border: `2px solid ${colors.border}`,
                padding: "12px 24px",
                borderRadius: "30px",
                color: colors.textPrimary,
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "700",
                transition: "all 0.3s ease"
              }}
              onClick={() => setCurrentPage('settings')}
              >설정</button>
              {isLoggedIn ? (
                <button style={{
                  background: colors.buttonBg,
                  border: `2px solid ${colors.border}`,
                  padding: "12px 24px",
                  borderRadius: "30px",
                  color: colors.textPrimary,
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "700",
                  transition: "all 0.3s ease"
                }} onClick={logout}>로그아웃</button>
              ) : (
                <button style={{
                  background: colors.buttonBg,
                  border: `2px solid ${colors.border}`,
                  padding: "12px 24px",
                  borderRadius: "30px",
                  color: colors.textPrimary,
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "700",
                  transition: "all 0.3s ease"
                }} onClick={showLogin}>로그인</button>
              )}
            </div>
          </div>

          {/* 탭 버튼들 */}
          <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            {['분석결과', '전체 약관'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: `2px solid ${colors.border}`,
                  ...(activeTab === tab ? {
                    background: colors.buttonBg,
                    color: colors.textPrimary
                  } : {
                    background: "transparent",
                    color: colors.textSecondary
                  })
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 분석 결과 */}
          {analysisResult && (
            <div style={{
              background: colors.cardBackground,
              borderRadius: "24px",
              padding: "clamp(20px, 4vw, 40px)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.08)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${colors.border}`,
              width: "100%",
              boxSizing: "border-box"
            }}>
              <h2 style={{
                fontSize: "clamp(28px, 5vw, 36px)",
                fontWeight: "700",
                marginBottom: "30px",
                color: colors.textPrimary,
                textAlign: "center"
              }}>분석 결과</h2>
              
              <div style={{
                background: isDarkMode ? '#2a2a2a' : '#f8fafc',
                borderRadius: "20px",
                padding: "clamp(20px, 4vw, 35px)",
                border: `1px solid ${colors.border}`
              }}>
                {renderTabContent()}
              </div>

              {/* 액션 버튼들 */}
              <div style={{
                display: "flex",
                gap: "15px",
                marginTop: "30px",
                flexWrap: "wrap",
                justifyContent: "center"
              }}>
                {isLoggedIn ? (
                  isSaved ? (
                    <div style={{
                      padding: "15px 35px",
                      background: isDarkMode ? "rgba(76, 175, 80, 0.2)" : "rgba(200, 230, 201, 0.5)",
                      color: isDarkMode ? "#4CAF50" : "#2e7d32",
                      borderRadius: "20px",
                      fontSize: "16px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}>
                      ✅ 저장됨
                    </div>
                  ) : (
                    <button
                      style={{
                        background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                        color: "white",
                        border: "none",
                        padding: "15px 35px",
                        borderRadius: "20px",
                        fontSize: "16px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)"
                      }}
                      onClick={() => {
                        console.log("🖱️ 저장하기 버튼 클릭됨!");
                        saveAnalysis();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.4)";
                      }}
                    >
                      💾 저장하기
                    </button>
                  )
                ) : (
                  <button
                    style={{
                      background: "linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)",
                      color: "white",
                      border: "none",
                      padding: "15px 35px",
                      borderRadius: "20px",
                      fontSize: "16px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(255, 167, 38, 0.4)"
                    }}
                    onClick={() => {
                      alert('저장하려면 로그인이 필요합니다.');
                      setShowLoginModal(true);
                    }}
                  >
                    🔐 로그인하고 저장하기
                  </button>
                )}
                <button
                  style={{
                    background: colors.buttonBg,
                    color: colors.textPrimary,
                    border: `2px solid ${colors.border}`,
                    padding: "15px 30px",
                    borderRadius: "20px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onClick={goToMain}
                >
                  새로운 분석하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      background: colors.background,
      minHeight: "100vh",
      color: colors.textPrimary,
      display: "flex",
      position: "relative"
    }}>
      {/* 로딩 오버레이 */}
      {isAnalyzing && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(5px)"
        }}>
          <div style={{
            background: isDarkMode ? "#2a2a2a" : "#ffffff",
            padding: "40px 60px",
            borderRadius: "20px",
            boxShadow: "0 10px 50px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px"
          }}>
            <div className="spinner" style={{
              width: "60px",
              height: "60px",
              border: `5px solid ${isDarkMode ? '#444' : '#e0e0e0'}`,
              borderTop: `5px solid ${colors.textPrimary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <div style={{
              color: colors.textPrimary,
              fontSize: "20px",
              fontWeight: "600"
            }}>
              약관 분석 중...
            </div>
            <div style={{
              color: colors.textSecondary,
              fontSize: "14px",
              textAlign: "center"
            }}>
              AI가 약관을 분석하고 있습니다.<br/>
              잠시만 기다려주세요.
            </div>
          </div>
        </div>
      )}

      {/* 사이드바 토글 버튼 */}
      <button 
        style={{
          position: "fixed",
          top: "20px",
          left: sidebarOpen ? "340px" : "20px",
          zIndex: 101,
          background: colors.cardBackground,
          border: `1px solid ${colors.border}`,
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: colors.textPrimary,
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease"
        }}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* 사이드바 */}
      <div style={{
        width: "320px",
        background: colors.cardBackground,
        backdropFilter: "blur(20px)",
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        zIndex: 100,
        boxShadow: "0 10px 50px rgba(0, 0, 0, 0.1)",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease"
      }}>
        <div style={{
          padding: "30px",
          borderBottom: `1px solid ${colors.border}`,
          background: colors.sidebarHeaderBg
        }}>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "8px"
          }}>나의 약관 분석</div>
          <div style={{
            fontSize: "16px",
            color: colors.textSecondary,
            marginBottom: "20px"
          }}>분석한 약관들을 확인하세요</div>

          {/* 검색 바 */}
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px",
              borderRadius: "10px",
              border: `1px solid ${colors.border}`,
              background: isDarkMode ? '#2a2a2a' : '#ffffff',
              color: colors.textPrimary,
              fontSize: "14px",
              marginBottom: "15px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />

          {/* 정렬 드롭다운 */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px",
              borderRadius: "10px",
              border: `1px solid ${colors.border}`,
              background: isDarkMode ? '#2a2a2a' : '#ffffff',
              color: colors.textPrimary,
              fontSize: "14px",
              cursor: "pointer",
              outline: "none",
              boxSizing: "border-box"
            }}
          >
            <option value="최신">최신순</option>
            <option value="가나다">가나다순</option>
            <option value="위험도">위험도순</option>
          </select>
        </div>
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "25px"
        }}>
          <div className="analysis-list">
            {isLoggedIn ? (
              (() => {
                console.log("🔍 사이드바 렌더링 - savedAnalyses:", savedAnalyses);
                console.log("🔍 savedAnalyses 개수:", savedAnalyses.length);

                // 검색 필터링
                let filteredAnalyses = savedAnalyses.filter(analysis =>
                  analysis.title.toLowerCase().includes(searchQuery.toLowerCase())
                );

                console.log("🔍 필터링 후 개수:", filteredAnalyses.length);

                // 정렬
                if (sortOrder === '최신') {
                  filteredAnalyses = [...filteredAnalyses].sort((a, b) => b.id - a.id);
                } else if (sortOrder === '가나다') {
                  filteredAnalyses = [...filteredAnalyses].sort((a, b) =>
                    a.title.localeCompare(b.title, 'ko')
                  );
                } else if (sortOrder === '위험도') {
                  filteredAnalyses = [...filteredAnalyses].sort((a, b) => {
                    const getRiskLevel = (analysis) => {
                      const risks = analysis.result?.risks || [];
                      const warningCount = risks.filter(r => r.level === 'warning').length;
                      return warningCount;
                    };
                    return getRiskLevel(b) - getRiskLevel(a);
                  });
                }

                console.log("🔍 정렬 후 filteredAnalyses:", filteredAnalyses);

                return filteredAnalyses.length > 0 ? (
                  filteredAnalyses.map((analysis) => (
                  <div key={analysis.id} style={{
                    background: colors.cardBackground,
                    borderRadius: "16px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                    marginBottom: "15px"
                  }}
                  onClick={async () => {
                    console.log("📋 사이드바 약관 클릭:", {
                      id: analysis.id,
                      title: analysis.title,
                      hasResult: !!analysis.result
                    });

                    // 이미 result가 있으면 바로 표시, 없으면 API에서 가져오기
                    if (analysis.result) {
                      console.log("✅ 캐시된 결과 사용");
                      setAnalysisResult(analysis.result);
                      setActiveTab('분석결과');
                      setCurrentPage('result');
                    } else {
                      console.log("🔍 백엔드에서 상세 정보 가져오기 시작...");
                      const detail = await fetchTermDetail(analysis.id);
                      if (detail) {
                        console.log("✅ 상세 정보 조회 성공, 캐싱 및 화면 표시");
                        // savedAnalyses에도 캐싱
                        const updatedAnalyses = savedAnalyses.map(a =>
                          a.id === analysis.id ? { ...a, result: detail } : a
                        );
                        setSavedAnalyses(updatedAnalyses);

                        setAnalysisResult(detail);
                        setActiveTab('분석결과');
                        setCurrentPage('result');
                      } else {
                        console.error("❌ 상세 정보 조회 실패 - detail이 null");
                      }
                    }
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
                      <div style={{
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '12px', 
                        background: colors.buttonBg, 
                        color: colors.textPrimary, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 'bold', 
                        fontSize: '16px', 
                        marginRight: '15px'
                      }}>BY</div>
                      <div style={{flex: 1}}>
                        {editingId === analysis.id ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => {
                              const updatedAnalyses = savedAnalyses.map(a =>
                                a.id === analysis.id ? { ...a, title: editingTitle } : a
                              );
                              setSavedAnalyses(updatedAnalyses);
                              setEditingId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const updatedAnalyses = savedAnalyses.map(a =>
                                  a.id === analysis.id ? { ...a, title: editingTitle } : a
                                );
                                setSavedAnalyses(updatedAnalyses);
                                setEditingId(null);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            style={{
                              margin: 0,
                              fontSize: '18px',
                              fontWeight: '600',
                              color: colors.textPrimary,
                              background: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                              border: `1px solid ${colors.border}`,
                              borderRadius: '6px',
                              padding: '4px 8px',
                              width: '100%',
                              outline: 'none'
                            }}
                          />
                        ) : (
                          <h4
                            style={{margin: 0, fontSize: '18px', fontWeight: '600', color: colors.textPrimary, cursor: 'text'}}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(analysis.id);
                              setEditingTitle(analysis.title);
                            }}
                          >
                            {analysis.title}
                          </h4>
                        )}
                        <div style={{fontSize: '14px', color: colors.textSecondary, marginTop: '4px'}}>{analysis.date}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnalysis(analysis.id);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        삭제
                      </button>
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: '600',
                      ...(analysis.risk === '안전' ? {
                        background: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(200, 230, 201, 0.3)',
                        color: isDarkMode ? '#4caf50' : '#2e7d32'
                      } : analysis.risk === '위험' ? {
                        background: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 205, 210, 0.8)',
                        color: isDarkMode ? '#f44336' : '#c62828'
                      } : {
                        background: isDarkMode ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 243, 205, 0.8)',
                        color: isDarkMode ? '#ffc107' : '#856404'
                      })
                    }}>{analysis.risk || '미분류'}</div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '30px', color: colors.textSecondary, fontSize: '16px'}}>
                  아직 분석한 약관이 없습니다.
                </div>
              );
            })()) : (
              <div style={{textAlign: 'center', padding: '30px', color: colors.textSecondary, fontSize: '16px'}}>
                로그인 후 분석 기록을 확인할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? "320px" : "0",
        transition: "margin-left 0.3s ease",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden"
      }}>
        {/* 헤더 */}
        <header style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "25px 20px",
          gap: "15px",
          flexWrap: "wrap"
        }}>
          <button style={{
            background: colors.buttonBg,
            border: `2px solid ${colors.border}`,
            padding: "12px 24px",
            borderRadius: "30px",
            color: colors.textPrimary,
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "700",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
          onClick={() => setCurrentPage('settings')}
          >설정</button>
          {isLoggedIn ? (
            <button style={{
              background: colors.buttonBg,
              border: `2px solid ${colors.border}`,
              padding: "12px 24px",
              borderRadius: "30px",
              color: colors.textPrimary,
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "700",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }} onClick={logout}>로그아웃</button>
          ) : (
            <button style={{
              background: colors.buttonBg,
              border: `2px solid ${colors.border}`,
              padding: "12px 24px",
              borderRadius: "30px",
              color: colors.textPrimary,
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "700",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }} onClick={showLogin}>로그인</button>
          )}
        </header>

        <div style={{
          flex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <h1 style={{
            textAlign: "center",
            color: colors.textPrimary,
            fontSize: "clamp(48px, 8vw, 72px)",
            fontWeight: "900",
            marginBottom: "15px",
            marginTop: "40px",
            textShadow: isDarkMode ? "0 6px 30px rgba(255, 255, 255, 0.1)" : "0 6px 30px rgba(0, 0, 0, 0.1)",
            letterSpacing: "clamp(4px, 1vw, 8px)",
            cursor: "pointer"
          }}
          onClick={goToMain}
          >BYSO</h1>
          <p style={{
            textAlign: "center",
            color: colors.textSecondary,
            fontSize: "clamp(18px, 3vw, 24px)",
            fontWeight: "400",
            marginBottom: "20px",
            letterSpacing: "clamp(1px, 0.3vw, 3px)",
            fontStyle: "italic"
          }}>Before You Seal On</p>
          <p style={{
            textAlign: "center",
            color: colors.textSecondary,
            fontSize: "clamp(16px, 2.5vw, 18px)",
            marginBottom: "60px",
            lineHeight: "1.8",
            maxWidth: "600px",
            margin: "0 auto 60px auto",
            fontWeight: "300",
            padding: "0 20px"
          }}>
            어려분이 사용하는 플랫폼의 약관 분석을 통해 잠재적인 위험 요소를 파악하세요.
          </p>

          {/* 약관 입력 영역 */}
          <div style={{
            background: colors.cardBackground,
            borderRadius: "24px",
            padding: "clamp(20px, 4vw, 40px)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.08)",
            marginBottom: "40px",
            backdropFilter: "blur(20px)",
            border: `1px solid ${colors.border}`,
            width: "100%",
            boxSizing: "border-box"
          }}>
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 28px)",
              fontWeight: "700",
              marginBottom: "15px",
              color: colors.textPrimary
            }}>약관 분석</h2>
            <p style={{
              fontSize: "clamp(16px, 2.5vw, 18px)",
              color: colors.textSecondary,
              marginBottom: "30px",
              lineHeight: "1.7"
            }}>
              분석하고 싶은 약관의 전체 텍스트를 아래에 붙여넣어 주세요. AI가 자동으로 위험 요소와 중요 문구를 분석해드립니다.
            </p>
            
            <textarea 
              style={{
                width: "100%",
                minHeight: "320px",
                border: `2px solid ${colors.border}`,
                borderRadius: "20px",
                padding: "clamp(20px, 3vw, 30px)",
                fontSize: "16px",
                lineHeight: "1.7",
                resize: "vertical",
                outline: "none",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                background: isDarkMode ? '#2a2a2a' : '#ffffff',
                color: colors.textPrimary,
                boxSizing: "border-box"
              }}
              placeholder="분석하고 싶은 약관을 여기에 입력하세요..."
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
            />
            <button
              style={{
                width: "100%",
                background: isAnalyzing
                  ? (isDarkMode ? '#555' : '#ccc')
                  : colors.buttonBg,
                color: colors.textPrimary,
                border: `2px solid ${colors.border}`,
                padding: "20px 35px",
                borderRadius: "20px",
                fontSize: "clamp(18px, 3vw, 20px)",
                fontWeight: "700",
                cursor: isAnalyzing ? "not-allowed" : "pointer",
                marginTop: "30px",
                transition: "all 0.3s ease",
                boxShadow: `0 8px 25px ${isDarkMode ? 'rgba(74, 85, 104, 0.4)' : 'rgba(143, 188, 143, 0.4)'}`,
                boxSizing: "border-box",
                opacity: isAnalyzing ? 0.7 : 1,
                position: "relative"
              }}
              onClick={analyzeTerms}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <span style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>
                  <span className="spinner" style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    border: `3px solid ${colors.textPrimary}`,
                    borderTop: "3px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}></span>
                  분석 중...
                </span>
              ) : (
                "분석하기"
              )}
            </button>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>

          {/* 크롬 익스텐션 안내 섹션 */}
          <div style={{
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(49, 130, 206, 0.15) 100%)"
              : "linear-gradient(135deg, rgba(191, 219, 254, 0.3) 0%, rgba(147, 197, 253, 0.3) 100%)",
            borderRadius: "24px",
            padding: "clamp(30px, 6vw, 50px)",
            backdropFilter: "blur(20px)",
            border: `2px solid ${isDarkMode ? 'rgba(66, 153, 225, 0.3)' : 'rgba(147, 197, 253, 0.5)'}`,
            marginBottom: "40px",
            width: "100%",
            boxSizing: "border-box"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              marginBottom: "20px"
            }}>
              <span style={{
                fontSize: "clamp(32px, 6vw, 48px)"
              }}>🧩</span>
              <h3 style={{
                color: colors.textPrimary,
                fontSize: "clamp(24px, 4vw, 32px)",
                margin: 0,
                fontWeight: "700"
              }}>크롬 익스텐션으로 더 편리하게</h3>
            </div>

            <p style={{
              color: colors.textSecondary,
              fontSize: "clamp(16px, 3vw, 18px)",
              marginBottom: "25px",
              lineHeight: "1.8",
              textAlign: "center"
            }}>
              웹사이트를 방문할 때마다 자동으로 약관을 분석해드립니다.<br/>
              복사 붙여넣기 없이 원클릭으로 위험 요소를 확인하세요!
            </p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              justifyContent: "center",
              marginBottom: "25px"
            }}>
              <div style={{
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
                padding: "15px 25px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span style={{fontSize: "20px"}}>⚡</span>
                <span style={{color: colors.textPrimary, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: "600"}}>
                  자동 분석
                </span>
              </div>
              <div style={{
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
                padding: "15px 25px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span style={{fontSize: "20px"}}>🔔</span>
                <span style={{color: colors.textPrimary, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: "600"}}>
                  실시간 알림
                </span>
              </div>
            </div>

            <button
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
                  : "linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)",
                color: "white",
                border: "none",
                padding: "18px 40px",
                borderRadius: "20px",
                fontSize: "clamp(16px, 3vw, 18px)",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "0 auto",
                boxShadow: "0 8px 25px rgba(66, 153, 225, 0.4)"
              }}
              onClick={() => {
                // 크롬 웹 스토어 링크로 이동 (나중에 실제 링크로 변경)
                window.open('https://chrome.google.com/webstore', '_blank');
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 35px rgba(66, 153, 225, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(66, 153, 225, 0.4)";
              }}
            >
              <span style={{fontSize: "24px"}}>🧩</span>
              <span>Chrome에 추가하기</span>
            </button>

            <p style={{
              color: colors.textSecondary,
              fontSize: "clamp(12px, 2vw, 14px)",
              marginTop: "20px",
              textAlign: "center",
              opacity: 0.8
            }}>
              * 무료로 제공되며, Chrome 브라우저에서 사용 가능합니다
            </p>
          </div>

          {/* 로그인 안내 섹션 */}
          {!isLoggedIn && (
            <div style={{
              background: isDarkMode ? "rgba(40, 40, 40, 0.6)" : "rgba(255, 255, 255, 0.2)",
              borderRadius: "24px",
              padding: "clamp(30px, 6vw, 60px)",
              textAlign: "center",
              backdropFilter: "blur(20px)",
              border: `1px solid ${colors.border}`,
              marginBottom: "40px",
              width: "100%",
              boxSizing: "border-box"
            }}>
              <h3 style={{
                color: colors.textPrimary,
                fontSize: "clamp(24px, 4vw, 32px)",
                marginBottom: "20px",
                fontWeight: "700"
              }}>💬 카카오로 간편하게 시작하세요</h3>
              <p style={{
                color: colors.textSecondary,
                fontSize: "clamp(16px, 3vw, 20px)",
                marginBottom: "35px",
                lineHeight: "1.7"
              }}>
                카카오 계정으로 로그인하여 분석 결과를 저장하고<br/>
                언제든지 다시 확인할 수 있습니다.
              </p>
              <button 
                style={{
                  background: "#FEE500",
                  color: "#000",
                  border: "none",
                  padding: "18px 40px",
                  borderRadius: "35px",
                  fontSize: "clamp(18px, 3vw, 20px)",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px"
                }}
                onClick={showLogin}
              >
                <span>💬</span>
                카카오로 시작하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LoginModal에 전달 */}
      <LoginModal 
        showLoginModal={showLoginModal}
        closeLoginModal={closeLoginModal}
        //showSignup={showSignup}
        colors={colors}
        isDarkMode={isDarkMode}
        setIsLoggedIn={setIsLoggedIn} 
        setUserInfo={setUserInfo}
        handleKakaoLogin={handleKakaoLogin} // 함수만 전달
        onKakaoLoginSuccess={handleKakaoLoginSuccess}
      />
    </div>
  );
}

export default App;
