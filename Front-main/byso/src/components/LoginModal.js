import React from 'react';

const LoginModal = ({
  showLoginModal,
  closeLoginModal,
  colors,
  isDarkMode,
  handleKakaoLogin,//App.js에서 정의한 새로운 로그인 함수
  onKakaoLoginSuccess
}) => {
  if (!showLoginModal) return null;

  // 🚨 불필요한 중간 함수 제거 및 콜백 로직 통합
    const onLoginButtonClick = () => {
        // App.js에서 정의된 handleKakaoLogin 함수를 호출합니다.
        // 이 함수는 App.js의 setIsLoggedIn, setUserInfo를 사용합니다.

        handleKakaoLogin((userInfo) => {
            // 로그인 성공 시 최종적으로 실행되는 콜백입니다.
            closeLoginModal(); // 모달 닫기
            if (onKakaoLoginSuccess) {
                onKakaoLoginSuccess(userInfo);
            }
        });
    };

    // 테스트 로그인 함수
    const onTestLoginClick = () => {
        // 백엔드에서 받은 공모전용 실제 토큰
        const testAccessToken = "eyJKV1QiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1dWlkIjo0LCJyb2xlIjoiVVNFUiIsImlhdCI6MTc2MTg5OTUwMiwiZXhwIjoxNzYzMTA5MTAyfQ.wt6zJr80n3zsj59TeIMvfC0alop0X8Eb5D_PyZXeysHOqnkH8x7U9Nij26k_AVgeWUqGbxeLRyPsOj5JQupo1g";
        const testRefreshToken = "test_refresh_token_for_demo";
        const testUserInfo = {
            id: 4,
            nickname: "공모전 심사위원",
            email: "demo@byso.com"
        };

        console.log("🔐 테스트 로그인 시작");
        console.log("  - accessToken 길이:", testAccessToken.length);
        console.log("  - refreshToken 길이:", testRefreshToken.length);

        // 로컬 스토리지에 저장 (accessToken과 refreshToken 모두 저장)
        localStorage.setItem('accessToken', testAccessToken);
        localStorage.setItem('refreshToken', testRefreshToken);
        localStorage.setItem('kakao_user_info', JSON.stringify(testUserInfo));

        // 저장 확인
        const savedAccessToken = localStorage.getItem('accessToken');
        const savedRefreshToken = localStorage.getItem('refreshToken');

        console.log("✅ 테스트 로그인 토큰 저장 완료");
        console.log("  - 저장된 accessToken 확인:", savedAccessToken === testAccessToken);
        console.log("  - 저장된 refreshToken 확인:", savedRefreshToken === testRefreshToken);
        console.log("  - accessToken 앞부분:", savedAccessToken?.substring(0, 50) + "...");
        console.log("  - refreshToken 앞부분:", savedRefreshToken?.substring(0, 50) + "...");
        console.log("  - userInfo:", testUserInfo);

        alert(`${testUserInfo.nickname}님, 공모전용 계정으로 로그인되었습니다!`);

        // 로컬 스토리지 저장이 완료된 후 새로고침
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

   return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(8px)",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <div style={{
        background: colors.modalBg,
        borderRadius: "24px",
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        border: `1px solid ${colors.border}`,
        boxSizing: "border-box"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <h2 style={{color: colors.textPrimary, margin: 0, fontSize: "24px"}}>로그인</h2>
          <button 
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              color: colors.textSecondary,
              cursor: "pointer",
              padding: "0"
            }}
            onClick={closeLoginModal}
          >
            ×
          </button>
        </div>

        {/* 안내 메시지 */}
        <div style={{
          textAlign: "center",
          marginBottom: "30px",
          padding: "20px",
          background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
          borderRadius: "12px",
          border: `1px solid ${colors.border}`
        }}>
          <p style={{
            color: colors.textPrimary,
            fontSize: "16px",
            lineHeight: "1.6",
            margin: 0
          }}>
            카카오 계정으로 간편하게<br/>
            로그인하고 서비스를 이용하세요!
          </p>
        </div>

        {/* 테스트 로그인 버튼 */}
        <button
          type="button"
          style={{
            width: "100%",
            background: isDarkMode ? "#4a4a4a" : "#6c757d",
            color: "#fff",
            border: "none",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "12px"
          }}
          onClick={onTestLoginClick}
          onMouseEnter={(e) => {
            e.target.style.background = isDarkMode ? "#5a5a5a" : "#5a6268";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDarkMode ? "#4a4a4a" : "#6c757d";
          }}
        >
          <span style={{fontSize: "18px"}}>🧪</span>
          테스트 로그인 (공모전용)
        </button>

        {/* 카카오 로그인 버튼 */}
        <button
          type="button"
          style={{
            width: "100%",
            background: "#FEE500",
            color: "#000",
            border: "none",
            padding: "18px",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
          onClick={onLoginButtonClick}
        >
          <span style={{fontSize: "20px"}}>💬</span>
          카카오로 시작하기
        </button>

        {/* 추가 안내 */}
        <div style={{
          textAlign: "center",
          marginTop: "20px"
        }}>
          <p style={{
            color: colors.textSecondary,
            fontSize: "12px",
            lineHeight: "1.4"
          }}>
            카카오 로그인 시 자동으로 회원가입이 완료됩니다.<br/>
            서비스 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;