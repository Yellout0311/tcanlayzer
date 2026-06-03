// src/hooks/useNaverLogin.js
import { useState, useEffect } from 'react';

export const useNaverLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 페이지 로드 시 저장된 로그인 정보 확인
  useEffect(() => {
    const savedUser = localStorage.getItem('naver_login_success');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 네이버 로그인 시작
  const startNaverLogin = () => {
    const clientId = 'YOUR_NAVER_CLIENT_ID'; // 실제 클라이언트 ID로 변경
    const redirectUri = encodeURIComponent(window.location.origin + '/callback.html');
    const state = 'naver_login_' + Date.now();
    
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    
    setIsLoading(true);
    window.location.href = naverLoginUrl;
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('naver_login_success');
    setUser(null);
  };

  return {
    user,
    isLoading,
    startNaverLogin,
    logout
  };
};