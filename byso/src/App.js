import React, { useState, useEffect } from 'react';
import Settings from './components/Settings';
import { useDarkMode } from './hooks/useDarkMode';

const NAVER_CLIENT_ID = "WuMBjclze0E5qNkGCf7u";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [termsText, setTermsText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentPage, setCurrentPage] = useState('main');
  
  const { isDarkMode, toggleDarkMode, colors } = useDarkMode();

  useEffect(() => {
  // 네이버 로그인 성공 확인
  const naverLoginData = localStorage.getItem('naver_login_success');
  if (naverLoginData) {
    const userInfo = JSON.parse(naverLoginData);
    console.log('네이버 로그인 성공:', userInfo);
    
    // 로그인 상태 변경
    setIsLoggedIn(true);
    
    // 성공 메시지
    alert(`${userInfo.name}님, 환영합니다!`);
    
    // 사용된 데이터 삭제
    localStorage.removeItem('naver_login_success');
  }
  }, []);

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
  setCurrentPage('result'); // 결과 페이지로 이동
};

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
    alert('로그인되었습니다!');
  };

  const logout = () => {
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
  };

  // Settings 페이지로 전환
  if (currentPage === 'settings') {
    return (
      <Settings 
        onBack={() => setCurrentPage('main')}
        onShowLogin={showLogin}
        onShowSignup={showSignup}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        colors={colors}
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
        padding: "20px"
      }}>
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
              onClick={() => setCurrentPage('main')}
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
                <h3 style={{color: colors.textPrimary, marginBottom: '20px', fontSize: 'clamp(20px, 3vw, 24px)'}}>AI 요약</h3>
                <p style={{lineHeight: '1.7', fontSize: 'clamp(16px, 2.5vw, 18px)', color: colors.textSecondary, marginBottom: '30px'}}>{analysisResult.summary}</p>
                
                <h3 style={{color: colors.textPrimary, marginBottom: '20px', fontSize: 'clamp(20px, 3vw, 24px)'}}>위험도 평가</h3>
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
                        fontSize: "clamp(14px, 2vw, 16px)",
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

                <h3 style={{color: colors.textPrimary, marginBottom: '20px', fontSize: 'clamp(20px, 3vw, 24px)', marginTop: '30px'}}>주요 포인트</h3>
                <ul style={{paddingLeft: '25px'}}>
                  {analysisResult.keyPoints.map((point, index) => (
                    <li key={index} style={{marginBottom: '15px', lineHeight: '1.6', fontSize: 'clamp(16px, 2.5vw, 18px)', color: colors.textSecondary}}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* 액션 버튼들 */}
              <div style={{
                display: "flex",
                gap: "15px",
                marginTop: "30px",
                flexWrap: "wrap",
                justifyContent: "center"
              }}>
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
                  onClick={() => setCurrentPage('main')}
                >
                  새로운 분석하기
                </button>
                {isLoggedIn && (
                  <button 
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "2px solid #28a745",
                      padding: "15px 30px",
                      borderRadius: "20px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onClick={() => {
                      alert('분석 결과가 저장되었습니다!');
                    }}
                  >
                    결과 저장하기
                  </button>
                )}
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
            color: colors.textSecondary
          }}>분석한 약관들을 확인하세요</div>
        </div>
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "25px"
        }}>
          <div className="analysis-list">
            {isLoggedIn ? (
              <div style={{
                background: colors.cardBackground,
                borderRadius: "16px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `1px solid ${colors.border}`,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)"
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
                  <div>
                    <h4 style={{margin: 0, fontSize: '18px', fontWeight: '600', color: colors.textPrimary}}>샘플 약관 분석</h4>
                    <div style={{fontSize: '14px', color: colors.textSecondary, marginTop: '4px'}}>2024-01-01</div>
                  </div>
                </div>
                <div style={{
                  display: 'inline-block', 
                  padding: '6px 12px', 
                  borderRadius: '15px', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  background: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(200, 230, 201, 0.3)', 
                  color: isDarkMode ? '#4caf50' : '#2e7d32'
                }}>안전</div>
              </div>
            ) : (
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
          onClick={() => setCurrentPage('main')}
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
                background: colors.buttonBg,
                color: colors.textPrimary,
                border: `2px solid ${colors.border}`,
                padding: "20px 35px",
                borderRadius: "20px",
                fontSize: "clamp(18px, 3vw, 20px)",
                fontWeight: "700",
                cursor: "pointer",
                marginTop: "30px",
                transition: "all 0.3s ease",
                boxShadow: `0 8px 25px ${isDarkMode ? 'rgba(74, 85, 104, 0.4)' : 'rgba(143, 188, 143, 0.4)'}`,
                boxSizing: "border-box"
              }}
              onClick={analyzeTerms}
            >
              분석하기
            </button>
          </div>

          {/* 분석 결과 영역 */}
          {analysisResult && (
            <div style={{
              background: colors.cardBackground,
              borderRadius: "24px",
              padding: "clamp(20px, 4vw, 40px)",
              marginBottom: "40px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.08)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${colors.border}`,
              width: "100%",
              boxSizing: "border-box"
            }}>
              <h3 style={{
                fontSize: "clamp(24px, 4vw, 28px)",
                fontWeight: "700",
                marginBottom: "25px",
                color: colors.textPrimary
              }}>분석 결과</h3>
              <div style={{
                background: isDarkMode ? '#2a2a2a' : '#f8fafc',
                borderRadius: "20px",
                padding: "clamp(20px, 4vw, 35px)",
                border: `1px solid ${colors.border}`
              }}>
                <h4 style={{color: colors.textPrimary, marginBottom: '20px', fontSize: 'clamp(18px, 3vw, 20px)'}}>AI 요약</h4>
                <p style={{lineHeight: '1.7', fontSize: 'clamp(14px, 2.5vw, 16px)', color: colors.textSecondary}}>{analysisResult.summary}</p>
                
                <h4 style={{color: colors.textPrimary, marginBottom: '20px', fontSize: 'clamp(18px, 3vw, 20px)', marginTop: '30px'}}>위험도 평가</h4>
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
              </div>
            </div>
          )}

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
              }}>🔒 로그인하고 더 많은 기능을 이용하세요</h3>
              <p style={{
                color: colors.textSecondary,
                fontSize: "clamp(16px, 3vw, 20px)",
                marginBottom: "35px",
                lineHeight: "1.7"
              }}>
                분석한 약관들을 저장하고 관리하려면 로그인이 필요합니다.<br/>
                로그인 후 왼쪽 사이드바에서 분석 기록을 확인할 수 있습니다.
              </p>
              <button 
                style={{
                  background: colors.buttonBg,
                  color: colors.textPrimary,
                  border: `2px solid ${colors.border}`,
                  padding: "18px 40px",
                  borderRadius: "35px",
                  fontSize: "clamp(18px, 3vw, 20px)",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: `0 8px 25px ${isDarkMode ? 'rgba(74, 85, 104, 0.4)' : 'rgba(143, 188, 143, 0.4)'}`
                }}
                onClick={showLogin}
              >
                로그인하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 로그인 모달 */}
      {showLoginModal && (
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
            {/* 닫기 버튼 */}
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
                  padding: "0",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onClick={closeLoginModal}
              >
                ×
              </button>
            </div>

            {/* 이메일 입력 */}
            <div style={{marginBottom: "20px"}}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: colors.textPrimary,
                fontSize: "16px",
                fontWeight: "500"
              }}>이메일</label>
              <input 
                type="email" 
                placeholder="example@email.com"
                style={{
                  width: "100%", 
                  padding: "15px", 
                  borderRadius: "8px", 
                  border: `1px solid ${colors.border}`,
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  color: colors.textPrimary,
                  boxSizing: "border-box",
                  fontSize: "16px"
                }} 
              />
            </div>

            {/* 비밀번호 입력 */}
            <div style={{marginBottom: "20px"}}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: colors.textPrimary,
                fontSize: "16px",
                fontWeight: "500"
              }}>비밀번호</label>
              <input 
                type="password" 
                placeholder="비밀번호를 입력하세요"
                style={{
                  width: "100%", 
                  padding: "15px", 
                  borderRadius: "8px", 
                  border: `1px solid ${colors.border}`,
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  color: colors.textPrimary,
                  boxSizing: "border-box",
                  fontSize: "16px"
                }} 
              />
            </div>

            {/* 로그인 상태 유지 및 비밀번호 찾기 */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px"
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: colors.textSecondary,
                fontSize: "14px"
              }}>
                <input type="checkbox" style={{marginRight: "8px"}} />
                로그인 상태 유지
              </label>
              <button style={{
                background: "none",
                border: "none",
                color: colors.textSecondary,
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline"
              }}>
                비밀번호 찾기
              </button>
            </div>

            {/* 로그인 버튼 */}
            <button 
              style={{
                width: "100%",
                background: colors.buttonBg,
                color: colors.textPrimary,
                border: `2px solid ${colors.border}`,
                padding: "15px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "20px",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onClick={handleLogin}
            >
              로그인
            </button>

            {/* 구분선 */}
            <div style={{
              textAlign: "center",
              margin: "20px 0",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "1px",
                background: colors.border
              }}></div>
              <span style={{
                background: colors.modalBg,
                padding: "0 15px",
                color: colors.textSecondary,
                fontSize: "14px"
              }}>또는</span>
            </div>

            {/* 네이버 로그인 버튼 */}
            <button 
              style={{
                width: "100%",
                background: "#03c75a",
                color: "white",
                border: "none",
                padding: "15px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "20px",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onClick={() => {
                // 네이버 로그인 API 연결 부분
                const state = Math.random().toString(36).substring(2, 15);
                window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + "/callback.html")}&state=${state}`;
              }}
            >
              네이버로 로그인
            </button>

            {/* 회원가입 링크 */}
            <div style={{
              textAlign: "center"
            }}>
              <span style={{color: colors.textSecondary, fontSize: "14px"}}>
                계정이 없으신가요? 
              </span>
              <button 
                style={{
                  background: "none",
                  border: "none",
                  color: colors.buttonBg,
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginLeft: "5px"
                }}
                onClick={showSignup}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {showSignupModal && (
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
            maxWidth: "480px",
            padding: "40px",
            border: `1px solid ${colors.border}`,
            boxSizing: "border-box",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{color: colors.textPrimary, marginBottom: "20px", textAlign: "center"}}>회원가입</h2>

            {/* 이메일 회원가입 */}
            <input 
              type="text" 
              placeholder="이름" 
              style={{
                width: "100%", 
                padding: "15px", 
                marginBottom: "15px", 
                borderRadius: "10px", 
                border: `2px solid ${colors.border}`,
                background: isDarkMode ? '#2a2a2a' : '#ffffff',
                color: colors.textPrimary,
                boxSizing: "border-box"
              }} 
            />
            <input 
              type="email" 
              placeholder="이메일" 
              style={{
                width: "100%", 
                padding: "15px", 
                marginBottom: "15px", 
                borderRadius: "10px", 
                border: `2px solid ${colors.border}`,
                background: isDarkMode ? '#2a2a2a' : '#ffffff',
                color: colors.textPrimary,
                boxSizing: "border-box"
              }} 
            />
            <input 
              type="password" 
              placeholder="비밀번호" 
              style={{
                width: "100%", 
                padding: "15px", 
                marginBottom: "15px", 
                borderRadius: "10px", 
                border: `2px solid ${colors.border}`,
                background: isDarkMode ? '#2a2a2a' : '#ffffff',
                color: colors.textPrimary,
                boxSizing: "border-box"
              }} 
            />
            <input 
              type="password" 
              placeholder="비밀번호 확인" 
              style={{
                width: "100%", 
                padding: "15px", 
                marginBottom: "20px", 
                borderRadius: "10px", 
                border: `2px solid ${colors.border}`,
                background: isDarkMode ? '#2a2a2a' : '#ffffff',
                color: colors.textPrimary,
                boxSizing: "border-box"
              }} 
            />

            {/* 약관 동의 */}
            <div style={{
              background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: `1px solid ${colors.border}`
            }}>
              <h3 style={{
                margin: "0 0 15px 0",
                color: colors.textPrimary,
                fontSize: "16px",
                fontWeight: "600"
              }}>약관 동의</h3>
              
              <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: colors.textPrimary,
                  fontSize: "14px"
                }}>
                  <input type="checkbox" style={{marginRight: "8px"}} />
                  (필수) 서비스 이용약관 동의
                </label>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: colors.textPrimary,
                  fontSize: "14px"
                }}>
                  <input type="checkbox" style={{marginRight: "8px"}} />
                  (필수) 개인정보 처리방침 동의
                </label>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: colors.textSecondary,
                  fontSize: "14px"
                }}>
                  <input type="checkbox" style={{marginRight: "8px"}} />
                  (선택) 마케팅 정보 수신 동의
                </label>
              </div>
            </div>

            <button 
              style={{
                width: "100%",
                background: colors.buttonBg,
                color: colors.textPrimary,
                border: `2px solid ${colors.border}`,
                padding: "15px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "20px",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onClick={() => {
                // 임시 회원가입 처리
                alert('회원가입이 완료되었습니다!');
                setShowSignupModal(false);
              }}
            >
              회원가입
            </button>

            {/* 하단 버튼들 */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <button 
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: colors.textSecondary,
                  fontSize: "14px"
                }}
                onClick={switchToLogin}
              >
                이미 계정이 있으신가요? 로그인
              </button>
              <button 
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: colors.textSecondary,
                  fontSize: "14px"
                }}
                onClick={closeSignupModal}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;