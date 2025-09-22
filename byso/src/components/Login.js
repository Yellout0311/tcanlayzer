// 로그인 부분 App.js에서 따로 빼올 생각 중
import React, { useState } from 'react';

// 외부에서 전달받을 props를 정의합니다.
// onLoginSuccess: 로그인 성공 시 실행될 함수
// onClose: 모달을 닫는 함수
// onSwitchToSignup: 회원가입 모달로 전환하는 함수
// colors: App.js로부터 전달받은 색상 테마 객체

const Login = ({ onLoginSuccess, onClose, onSwitchToSignup, isDarkMode, colors }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. API 연결을 위한 함수
  const handleLogin = async (e) => {
    e.preventDefault();

    // 입력값 유효성 검사 (선택 사항)
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('백엔드_서버_주소/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인 실패');
      }

      const data = await response.json();
      console.log('로그인 성공:', data);

      // 로그인 성공 시 부모 컴포넌트(App.js)의 상태를 업데이트하는 함수 호출
      onLoginSuccess(); 
      onClose(); // 모달 닫기
    } catch (error) {
      alert(`로그인 중 에러가 발생했습니다: ${error.message}`);
    }
  };

  return (
    // 기존 App.js에 있던 로그인 모달 JSX를 그대로 옮겨옵니다.
    <div style={{
      /* 기존 모달 스타일 */
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0, 0, 0, 0.6)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000, backdropFilter: "blur(8px)", padding: "20px",
      boxSizing: "border-box"
    }}>
      <div style={{
        /* 기존 모달 내용 스타일 */
        background: colors.modalBg, borderRadius: "24px", width: "100%",
        maxWidth: "400px", padding: "40px", border: `1px solid ${colors.border}`,
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{color: colors.textPrimary, margin: 0, fontSize: "24px"}}>로그인</h2>
          <button style={{/* 닫기 버튼 스타일 */}} onClick={onClose}>×</button>
        </div>

        {/* 이메일 입력 필드 */}
        <div style={{marginBottom: "20px"}}>
          <label style={{/* 레이블 스타일 */}}>이메일</label>
          <input 
            type="email" 
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 상태 업데이트 추가
            style={{/* input 스타일 */}} 
          />
        </div>

        {/* 비밀번호 입력 필드 */}
        <div style={{marginBottom: "20px"}}>
          <label style={{/* 레이블 스타일 */}}>비밀번호</label>
          <input 
            type="password" 
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 상태 업데이트 추가
            style={{/* input 스타일 */}} 
          />
        </div>
        
        {/* 로그인 버튼 */}
        <button style={{/* 로그인 버튼 스타일 */}} onClick={handleLogin}>
          로그인
        </button>

        {/* 나머지 UI 요소 (네이버 로그인, 회원가입 링크 등) */}
        {/* ... */}
      </div>
    </div>
  );
};

export default Login;