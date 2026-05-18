import React, { useState } from 'react';

function Settings({ 
  onBack, 
  onShowLogin,
  isDarkMode, 
  toggleDarkMode, 
  colors, 
  onDeleteAnalyses, 
  onResetData,
  isLoggedIn,    // 추가
  onWithdraw,    // 추가
  onLogout,  // 추가
  userInfo       // 추가 (사용자 정보 표시용)
}) {
  const [autoSave, setAutoSave] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const styles = {
    settingsContainer: {
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      background: colors.background,
      minHeight: "100vh",
      padding: "20px"
    },
    contentWrapper: {
      maxWidth: "800px",
      margin: "0 auto"
    },
    settingsHeader: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      background: colors.cardBackground,
      padding: "25px",
      borderRadius: "20px",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)"
    },
    backBtn: {
      background: colors.buttonBg,
      color: colors.textPrimary,
      border: `2px solid ${colors.border}`,
      padding: "12px 20px",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
    },
    headerTitle: {
      color: colors.textPrimary,
      fontSize: "32px",
      fontWeight: "700",
      margin: 0
    },
    settingsContent: {
      display: "flex",
      flexDirection: "column",
      gap: "25px"
    },
    settingCard: {
      background: colors.cardBackground,
      borderRadius: "20px",
      padding: "35px",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)"
    },
    cardTitle: {
      color: colors.textPrimary,
      marginBottom: "25px",
      fontSize: "24px",
      fontWeight: "700",
      borderBottom: `3px solid ${colors.buttonBg}`,
      paddingBottom: "12px"
    },
    settingItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 0",
      borderBottom: `1px solid ${colors.border}`
    },
    settingLabel: {
      fontSize: "16px",
      color: colors.textPrimary,
      fontWeight: "500"
    },
    switch: {
      position: "relative",
      display: "inline-block",
      width: "60px",
      height: "34px"
    },
    switchInput: {
      opacity: 0,
      width: 0,
      height: 0
    },
    slider: {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#ccc",
      transition: ".4s",
      borderRadius: "34px"
    },
    sliderBefore: {
      position: "absolute",
      content: '""',
      height: "26px",
      width: "26px",
      left: "4px",
      bottom: "4px",
      backgroundColor: "white",
      transition: ".4s",
      borderRadius: "50%"
    },
    settingBtn: {
      background: colors.buttonBg,
      color: colors.textPrimary,
      border: `2px solid ${colors.border}`,
      padding: "14px 28px",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      marginRight: "15px",
      marginBottom: "15px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
    },
    dangerBtn: {
      background: "#dc3545",
      color: "white",
      border: "2px solid #dc3545"
    },
    infoItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "18px 0",
      borderBottom: `1px solid ${colors.border}`,
      fontSize: "16px"
    },
    infoLabel: {
      color: colors.textPrimary,
      fontWeight: "500"
    },
    infoValue: {
      color: colors.textSecondary,
      fontWeight: "400"
    },
    modalOverlay: {
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
    },
    modalContent: {
      background: colors.modalBg,
      borderRadius: "24px",
      width: "100%",
      maxWidth: "500px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxSizing: "border-box"
    },
    helpModalContent: {
      maxWidth: "600px"
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "30px 35px 25px",
      borderBottom: `1px solid ${colors.border}`
    },
    modalTitle: {
      margin: 0,
      color: colors.textPrimary,
      fontSize: "28px",
      fontWeight: "700"
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: "32px",
      color: colors.textSecondary,
      cursor: "pointer",
      padding: 0,
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      transition: "all 0.3s ease"
    },
    modalBody: {
      padding: "35px"
    },
    helpSection: {
      marginBottom: "35px"
    },
    helpTitle: {
      color: colors.textPrimary,
      fontSize: "22px",
      marginBottom: "15px",
      paddingBottom: "10px",
      borderBottom: `2px solid ${colors.buttonBg}`,
      fontWeight: "600"
    },
    demoContainer: {
      background: isDarkMode ? "#2a2a2a" : "#f8fafc",
      borderRadius: "15px",
      padding: "25px",
      margin: "20px 0",
      border: `1px solid ${colors.border}`
    },
    checkListItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "8px",
      fontSize: "14px",
      color: colors.textPrimary
    },
    warningItem: {
      color: "#ff9800"
    },
    goodItem: {
      color: "#4caf50"
    },
    demoBtn: {
      background: colors.buttonBg,
      color: colors.textPrimary,
      border: `2px solid ${colors.border}`,
      padding: "12px 24px",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
    },
    demoResult: {
      marginTop: "20px",
      padding: "20px",
      background: colors.cardBackground,
      borderRadius: "12px",
      border: `2px solid ${colors.buttonBg}`,
      color: colors.textPrimary
    },
    termsSection: {
      margin: "25px 0"
    },
    termsContainer: {
      maxHeight: "250px",
      overflowY: "auto",
      border: `2px solid ${colors.border}`,
      borderRadius: "12px",
      padding: "20px",
      background: isDarkMode ? "#2a2a2a" : "#f8fafc",
      marginBottom: "20px",
      fontSize: "14px",
      lineHeight: "1.6",
      color: colors.textPrimary
    },
    agreementItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "12px 0",
      cursor: "pointer"
    },
    checkbox: {
      width: "20px",
      height: "20px",
      cursor: "pointer",
      marginTop: "2px"
    },
    agreementLabel: {
      cursor: "pointer",
      fontSize: "15px",
      color: colors.textPrimary,
      lineHeight: "1.5"
    },
    requiredLabel: {
      fontWeight: "600"
    },
    optionalLabel: {
      color: colors.textSecondary
    },
    agreementAll: {
      borderTop: `2px solid ${colors.border}`,
      marginTop: "20px",
      paddingTop: "20px"
    },
    signupBtn: {
      background: colors.buttonBg,
      color: colors.textPrimary,
      border: `2px solid ${colors.border}`,
      padding: "16px",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "700",
      cursor: "pointer",
      width: "100%",
      transition: "all 0.3s ease",
      marginTop: "15px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
    },
    input: {
      width: "100%",
      padding: "16px 20px",
      border: `2px solid ${colors.border}`,
      borderRadius: "12px",
      fontSize: "16px",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
      marginBottom: "20px",
      background: isDarkMode ? '#2a2a2a' : '#ffffff',
      color: colors.textPrimary,
      boxSizing: "border-box"
    }
  };

  const [demoVisible, setDemoVisible] = useState(false);
  // const [formData, setFormData] = useState({
  //   email: '',
  //   password: '',
  //   confirmPassword: '',
  //   name: '',
  //   agreeTerms: false,
  //   agreePrivacy: false,
  //   agreeMarketing: false,
  //   agreeAll: false
  // });

  const runDemo = () => {
    setDemoVisible(true);
  };

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value
  //   }));

  //   if (name === 'agreeAll') {
  //     setFormData(prev => ({
  //       ...prev,
  //       agreeTerms: checked,
  //       agreePrivacy: checked,
  //       agreeMarketing: checked
  //     }));
  //   }
  // };
// 탈퇴 처리 함수
  const handleWithdraw = async () => {
    const success = await onWithdraw();
    if (success) {
      // 탈퇴 성공 시 메인 페이지로 이동
      onBack();
    }
  };

  return (
    <div style={styles.settingsContainer}>
      <div style={styles.contentWrapper}>
        <header style={styles.settingsHeader}>
          <button style={styles.backBtn} onClick={onBack}>
            ← 홈으로
          </button>
          <h1 style={styles.headerTitle}>설정</h1>
        </header>
        
        <div style={styles.settingsContent}>
          {/* 기본 설정 */}
          <div style={styles.settingCard}>
            <h2 style={styles.cardTitle}>기본 설정</h2>
            
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>다크 모드</span>
              <label style={styles.switch}>
                <input 
                  style={styles.switchInput}
                  type="checkbox" 
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <span style={{
                  ...styles.slider,
                  backgroundColor: isDarkMode ? colors.buttonBg : '#ccc'
                }}>
                  <span style={{
                    ...styles.sliderBefore,
                    transform: isDarkMode ? 'translateX(26px)' : 'translateX(0)'
                  }}></span>
                </span>
              </label>
            </div>
            
            <div style={{...styles.settingItem, borderBottom: 'none'}}>
              <span style={styles.settingLabel}>분석 후 자동 저장</span>
              <label style={styles.switch}>
                <input 
                  style={styles.switchInput}
                  type="checkbox" 
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <span style={{
                  ...styles.slider,
                  backgroundColor: autoSave ? colors.buttonBg : '#ccc'
                }}>
                  <span style={{
                    ...styles.sliderBefore,
                    transform: autoSave ? 'translateX(26px)' : 'translateX(0)'
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          {/* 계정 정보 표시 */}
          {isLoggedIn && userInfo && (
            <div style={styles.settingCard}>
              <h2 style={styles.cardTitle}>계정 정보</h2>
              
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>닉네임</span>
                <span style={styles.infoValue}>{userInfo.nickname}</span>
              </div>
              
              {userInfo.email && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>이메일</span>
                  <span style={styles.infoValue}>{userInfo.email}</span>
                </div>
              )}
              
              <div style={{...styles.infoItem, borderBottom: 'none'}}>
                <span style={styles.infoLabel}>로그인 방식</span>
                <span style={styles.infoValue}>카카오 계정</span>
              </div>
            </div>
          )}
          
          {/* 계정 관리 - 탈퇴 버튼 */}
          {isLoggedIn && (
            <div style={styles.settingCard}>
              <h2 style={styles.cardTitle}>계정 관리</h2>
              
              <button
                onClick={onLogout}
                style={{
                  ...styles.settingBtn,
                  background: '#6c757d',
                  color: 'white',
                  border: '2px solid #6c757d',
                  marginBottom: '20px'
                }}
              >
                로그아웃
              </button>

              {/* 탈퇴 섹션 */}
              <div style={{
                background: isDarkMode ? '#2a2a2a' : '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h3 style={{color: '#856404', marginBottom: '10px', fontSize: '18px'}}>⚠️ 회원 탈퇴</h3>
                <p style={{color: '#856404', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5'}}>
                  탈퇴 시 모든 분석 데이터가 삭제되며 복구할 수 없습니다.<br/>
                  카카오 계정 연결도 해제됩니다.
                </p>
                <button
                  onClick={onWithdraw}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  회원 탈퇴하기
                </button>
              </div>
            </div>
          )}

          {/* 로그인 안내 (비로그인 시) */}
          {!isLoggedIn && (
            <div style={styles.settingCard}>
              <h2 style={styles.cardTitle}>계정</h2>
              
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{color: colors.textPrimary, marginBottom: '15px', fontSize: '18px'}}>
                  💬 로그인이 필요합니다
                </h3>
                <p style={{color: colors.textSecondary, marginBottom: '20px', lineHeight: '1.5'}}>
                  분석 결과 저장 및 관리 기능을 이용하려면<br/>
                  카카오 계정으로 로그인해주세요.
                </p>
                <button
                  onClick={onShowLogin}
                  style={{
                    background: '#FEE500',
                    color: '#000',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>💬</span>
                  카카오로 로그인
                </button>
              </div>
            </div>
          )}
          
          {/* 데이터 관리 */}
          <div style={styles.settingCard}>
            <h2 style={styles.cardTitle}>데이터 관리</h2>
            
            {isLoggedIn && (
              <button 
                style={styles.settingBtn} 
                onClick={onDeleteAnalyses}
              >
                분석 기록 삭제
              </button>
            )}
            
            <button 
              style={{...styles.settingBtn, ...styles.dangerBtn}} 
              onClick={onResetData}
            >
              모든 데이터 삭제
            </button>
          </div>
          
          {/* 정보 */}
          <div style={styles.settingCard}>
            <h2 style={styles.cardTitle}>정보</h2>
            
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>서비스명</span>
              <span style={styles.infoValue}>BYSO</span>
            </div>
            
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>버전</span>
              <span style={styles.infoValue}>v1.0.0</span>
            </div>
            
            <button style={styles.settingBtn} onClick={() => setShowHelpModal(true)}>
              도움말
            </button>
          </div>
        </div>
      </div>

      {/* 도움말 모달 */}
      {showHelpModal && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalContent, ...styles.helpModalContent}}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>BYSO 도움말</h2>
              <button style={styles.closeBtn} onClick={() => setShowHelpModal(false)}>
                &times;
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.helpSection}>
                <h3 style={styles.helpTitle}>서비스 소개</h3>
                <p style={{color: colors.textSecondary, lineHeight: '1.6', marginBottom: '20px'}}>
                  BYSO (Before You Seal On)는 각종 서비스의 약관을 AI가 분석하여<br/>
                  잠재적 위험 요소를 쉽게 파악할 수 있도록 도와주는 서비스입니다.
                </p>
                
                <div style={styles.demoContainer}>
                  <h4 style={{margin: '0 0 15px 0', color: colors.textPrimary}}>주요 기능</h4>
                  
                  <div style={styles.checkListItem}>
                    <span style={{...styles.goodItem, marginRight: '8px'}}>✅</span>
                    약관 텍스트 AI 분석
                  </div>
                  <div style={styles.checkListItem}>
                    <span style={{...styles.goodItem, marginRight: '8px'}}>✅</span>
                    위험도 평가 및 주요 포인트 추출
                  </div>
                  <div style={styles.checkListItem}>
                    <span style={{...styles.goodItem, marginRight: '8px'}}>✅</span>
                    분석 결과 저장 및 관리
                  </div>
                  <div style={styles.checkListItem}>
                    <span style={{...styles.goodItem, marginRight: '8px'}}>✅</span>
                    카카오 간편 로그인
                  </div>
                  
                  <button style={styles.demoBtn} onClick={runDemo}>
                    데모 체험하기
                  </button>
                  
                  {demoVisible && (
                    <div style={styles.demoResult}>
                      <h4 style={{margin: '0 0 10px 0', color: colors.textPrimary}}>분석 완료!</h4>
                      <div style={{marginBottom: '10px'}}>
                        위험도: <strong style={{color: '#4caf50'}}>낮음</strong>
                      </div>
                      <div style={{fontSize: '14px', lineHeight: '1.5'}}>
                        - 개인정보 보호: 우수<br/>
                        - 데이터 처리: 투명<br/>
                        - 사용자 권리: 명확<br/>
                      </div>
                      <p style={{margin: '15px 0 0 0', fontStyle: 'italic', color: colors.textSecondary}}>
                        BYSO는 안전하고 투명한 서비스입니다! 🎉
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={styles.helpSection}>
                <h3 style={styles.helpTitle}>이용 방법</h3>
                <div style={{color: colors.textSecondary, lineHeight: '1.8'}}>
                  <div style={{marginBottom: '8px'}}><strong>1단계:</strong> 카카오 계정으로 로그인</div>
                  <div style={{marginBottom: '8px'}}><strong>2단계:</strong> 분석하고 싶은 약관 텍스트 입력</div>
                  <div style={{marginBottom: '8px'}}><strong>3단계:</strong> AI 분석 결과 확인</div>
                  <div><strong>4단계:</strong> 결과 저장 및 관리</div>
                </div>
              </div>
              
              <div style={styles.helpSection}>
                <h3 style={styles.helpTitle}>주의사항</h3>
                <div style={{color: colors.textSecondary, lineHeight: '1.6'}}>
                  <div style={{marginBottom: '8px'}}>• AI 분석 결과는 참고용이며 법적 효력이 없습니다</div>
                  <div style={{marginBottom: '8px'}}>• 중요한 계약은 전문가와 상담하시기 바랍니다</div>
                  <div>• 개인정보가 포함된 약관은 입력하지 마세요</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;