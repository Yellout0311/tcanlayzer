import { useState, useEffect } from 'react';

const BACKEND_BASE_URL = "https://api.byso.kro.kr";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 카카오 로그인 체크
    const kakaoLoginData = localStorage.getItem("kakao_login_success");
    if (kakaoLoginData) {
      const userInfo = JSON.parse(kakaoLoginData);
      console.log("카카오 로그인 성공:", userInfo);
      setIsLoggedIn(true);
      alert(`${userInfo.nickname}님, 환영합니다!`);
      localStorage.removeItem("kakao_login_success");
      return;
    }

    const savedAccessToken = localStorage.getItem("accessToken");
    const savedUserInfo = localStorage.getItem("kakao_user_info"); // 유저 정보는 보조적으로 사용

    if (savedAccessToken && savedUserInfo) {
        // 엑세스 토큰이 있고, 저장된 유저 정보가 있다면 로그인 상태로 간주
        setIsLoggedIn(true);
        setUserInfo(JSON.parse(savedUserInfo));

        // 참고: 이 시점에 토큰이 만료되었을 수 있으므로, 
        // 실제 API 호출은 `apiCall` 함수에서 `refreshToken` 로직이 처리합니다.
    } else {
        // 토큰이 없거나 유저 정보가 없으면 로그아웃 상태
        setIsLoggedIn(false);
        setUserInfo(null);
    }
}, []);

  // 로그아웃， ＡＰＩ연동
  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // 서버에 로그아웃 요청
        const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/logout`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('서버 로그아웃 실패:', response.status);
          // 서버 요청이 실패해도 로컬 로그아웃은 진행
        }
      }

      // 로컬 상태 및 저장소 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUserInfo(null);
      
      alert('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 에러가 발생해도 로컬 로그아웃은 진행
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUserInfo(null);
      alert('로그아웃되었습니다.');
    }
  };

  // 회원탈퇴， API 연동
  const kakaoWithdraw = async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/withdraw`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // 탈퇴 성공
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        setUserInfo(null);
        
        alert('회원탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');
        
        // 메인 페이지로 리디렉션하거나 추가 처리
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '탈퇴 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('회원탈퇴 중 오류:', error);
      alert(error.message || '탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      return false;
    }
  };

const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) throw new Error('No refresh token');

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refresh}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    // 토큰 갱신 실패 시 로그아웃
    logout();
    return null;
  }
};

const apiCall = async (url, options = {}) => {
  let token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    // 토큰 만료 시 갱신 시도
    token = await refreshToken();
    if (token) {
      // 갱신된 토큰으로 재시도
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        }
      });
    }
  }

  return response;
};


  return {
    isLoggedIn, 
    userInfo,
    setIsLoggedIn, // 👈 추가
    setUserInfo, 
    logout,
    kakaoWithdraw,
    refreshToken,
    apiCall
  };
};
