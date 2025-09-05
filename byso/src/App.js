import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [termsText, setTermsText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showLogin = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const showSignup = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const analyzeTerms = () => {
    if (!termsText.trim()) {
      alert('분석할 약관을 입력해주세요.');
      return;
    }

    // 임시 분석 결과 (나중에 API 연동)
    const mockResult = {
      summary: "입력하신 약관을 분석한 결과입니다.",
      risks: [
        { level: "warning", text: "데이터 수집 범위가 광범위합니다" },
        { level: "good", text: "사용자 권리에 대한 명시가 적절합니다" }
      ],
      keyPoints: [
        "개인정보 수집 및 이용 동의",
        "서비스 이용 제한 조건",
        "데이터 보관 기간 명시"
      ]
    };

    setAnalysisResult(mockResult);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // 임시 로그인 처리
    setIsLoggedIn(true);
    setShowLoginModal(false);
    alert('로그인되었습니다!');
  };

  const logout = () => {
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
  };

  return (
    <div className="App">
      {/* 사이드바 토글 버튼 */}
      <button 
        className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* 사이드바 */}
      <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">나의 약관 분석</div>
          <div className="sidebar-subtitle">분석한 약관들을 확인하세요</div>
        </div>
        <div className="sidebar-content">
          <div className="analysis-list">
            {isLoggedIn ? (
              <div className="analysis-item">
                <div className="analysis-item-header">
                  <div className="analysis-item-icon" style={{backgroundColor: '#28a745'}}>TC</div>
                  <div className="analysis-item-info">
                    <h4>샘플 약관 분석</h4>
                    <div className="analysis-item-date">2024-01-01</div>
                  </div>
                </div>
                <div className="analysis-item-status status-safe">안전</div>
              </div>
            ) : (
              <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                로그인 후 분석 기록을 확인할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* 헤더 */}
        <header className={`header ${isLoggedIn ? 'header-logged-in' : 'header-logged-out'}`}>
          <button>settings</button>
          {isLoggedIn ? (
            <button onClick={logout}>log out</button>
          ) : (
            <button onClick={showLogin}>log in</button>
          )}
        </header>

        <div className="container">
          <h1 className="title">TCAnalyzer</h1>
          <p className="subtitle">
            어려분이 사용하는 플랫폼의 <a href="#">약관 분석</a>을 통해 잠재적인 위험 요소를 파악하세요.
          </p>

          {/* 약관 입력 영역 */}
          <div className="input-section">
            <h2 className="input-title">약관 분석</h2>
            <p className="input-description">
              분석하고 싶은 약관의 전체 텍스트를 아래에 붙여넣어 주세요. AI가 자동으로 위험 요소와 중요 문구를 분석해드립니다.
            </p>
            
            <textarea 
              className="text-input" 
              placeholder="분석하고 싶은 약관을 여기에 입력하세요..."
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
            />
            <button className="analyze-button" onClick={analyzeTerms}>
              분석하기
            </button>
          </div>

          {/* 분석 결과 영역 */}
          {analysisResult && (
            <div className="result-section">
              <div className="result-header">
                <h3 className="result-title">분석 결과</h3>
              </div>
              <div className="analysis-result">
                <h4>AI 요약</h4>
                <p>{analysisResult.summary}</p>
                
                <h4>위험도 평가</h4>
                <div className="risk-summary">
                  {analysisResult.risks.map((risk, index) => (
                    <div key={index} className={`risk-item ${risk.level}`}>
                      {risk.text}
                    </div>
                  ))}
                </div>

                <h4>주요 포인트</h4>
                <ul>
                  {analysisResult.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 로그인 안내 섹션 */}
          {!isLoggedIn && (
            <div className="login-notice-section">
              <div className="login-notice">
                <h3>🔒 로그인하고 더 많은 기능을 이용하세요</h3>
                <p>
                  분석한 약관들을 저장하고 관리하려면 로그인이 필요합니다.<br/>
                  로그인 후 왼쪽 사이드바에서 분석 기록을 확인할 수 있습니다.
                </p>
                <button className="login-notice-btn" onClick={showLogin}>
                  로그인하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="modal-overlay show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>로그인</h2>
              <button className="close-btn" onClick={closeLoginModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label htmlFor="email">이메일</label>
                  <input type="email" id="email" name="email" required placeholder="example@email.com" />
                </div>
                <div className="input-group">
                  <label htmlFor="password">비밀번호</label>
                  <input type="password" id="password" name="password" required placeholder="비밀번호를 입력하세요" />
                </div>
                <div className="login-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>로그인 상태 유지</span>
                  </label>
                  <a href="#" className="forgot-password">비밀번호 찾기</a>
                </div>
                <button type="button" className="login-btn" onClick={handleLogin}>로그인</button>
              </div>
              <div className="divider">
                <span>또는</span>
              </div>
              <div className="social-login">
                <button className="social-btn naver-btn">
                  <span>네이버로 로그인</span>
                </button>
              </div>
              <div className="signup-link">
                <p>계정이 없으신가요? <a href="#" onClick={showSignup}>회원가입</a></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {showSignupModal && (
        <div className="modal-overlay show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>회원가입</h2>
              <button className="close-btn" onClick={closeSignupModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="signup-form">
                <div className="input-group">
                  <label htmlFor="signupEmail">이메일</label>
                  <input type="email" id="signupEmail" name="email" required placeholder="example@email.com" />
                </div>
                <div className="input-group">
                  <label htmlFor="signupPassword">비밀번호</label>
                  <input type="password" id="signupPassword" name="password" required placeholder="비밀번호 (6자 이상)" />
                </div>
                <div className="input-group">
                  <label htmlFor="confirmPassword">비밀번호 확인</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="비밀번호를 다시 입력하세요" />
                </div>
                <div className="input-group">
                  <label htmlFor="userName">이름</label>
                  <input type="text" id="userName" name="name" required placeholder="실명을 입력하세요" />
                </div>

                <div className="terms-section">
                  <h3>이용약관 및 개인정보처리방침</h3>
                  <div className="terms-agreement">
                    <label className="agreement-item required">
                      <input type="checkbox" required />
                      <span>[필수] 이용약관에 동의합니다</span>
                    </label>
                    <label className="agreement-item required">
                      <input type="checkbox" required />
                      <span>[필수] 개인정보 수집 및 이용에 동의합니다</span>
                    </label>
                    <label className="agreement-item optional">
                      <input type="checkbox" />
                      <span>[선택] 서비스 개선을 위한 익명 통계 수집에 동의합니다</span>
                    </label>
                  </div>
                </div>

                <button type="button" className="signup-btn">회원가입</button>
              </div>

              <div className="login-link">
                <p>이미 계정이 있으신가요? <a href="#" onClick={switchToLogin}>로그인</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;