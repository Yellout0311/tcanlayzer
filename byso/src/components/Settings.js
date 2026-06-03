import React, { useState } from 'react';

function Settings({ onBack, onShowLogin, onShowSignup, isDarkMode, toggleDarkMode, colors }) {
  const [autoSave, setAutoSave] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
    agreeAll: false
  });

  const runDemo = () => {
    setDemoVisible(true);
  };

  const clearData = () => {
    if (window.confirm('분석 기록을 모두 삭제하시겠습니까?')) {
      localStorage.removeItem('saved_analyses');
      alert('분석 기록이 삭제되었습니다.');
    }
  };

  const resetData = () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.clear();
      alert('모든 데이터가 삭제되었습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'agreeAll') {
      setFormData(prev => ({
        ...prev,
        agreeTerms: checked,
        agreePrivacy: checked,
        agreeMarketing: checked
      }));
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    
    alert('회원가입이 완료되었습니다!');
    setShowSignupModal(false);
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
          
          {/* 계정 관리 - 로그인 버튼 제거 */}
          <div style={styles.settingCard}>
            <h2 style={styles.cardTitle}>계정 관리</h2>
            
            <button style={styles.settingBtn} onClick={() => setShowSignupModal(true)}>
              회원가입
            </button>
          </div>
          
          {/* 데이터 관리 */}
          <div style={styles.settingCard}>
            <h2 style={styles.cardTitle}>데이터 관리</h2>
            
            <button style={styles.settingBtn} onClick={clearData}>
              분석 기록 삭제
            </button>
            
            <button style={{...styles.settingBtn, ...styles.dangerBtn}} onClick={resetData}>
              모든 데이터 삭제
            </button>
          </div>
          
          {/* 정보 */}
          <div style={styles.settingCard}>
            <h2 style={styles.cardTitle}>정보</h2>
            
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

      {/* 회원가입 모달 */}
      {showSignupModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>회원가입</h2>
              <button style={styles.closeBtn} onClick={() => setShowSignupModal(false)}>
                &times;
              </button>
            </div>
            <div style={styles.modalBody}>
              <form onSubmit={handleSignup}>
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  placeholder="이메일"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                
                <input
                  style={styles.input}
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                
                <div style={styles.termsSection}>
                  <h3 style={styles.helpTitle}>이용약관 및 개인정보처리방침</h3>
                  
                  <div style={styles.termsContainer}>
                    <strong>BYSO 이용약관</strong><br/><br/>
                    <strong>제1조 (목적)</strong><br/>
                    본 약관은 BYSO가 제공하는 AI 기반 약관 분석 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                    <br/><br/>
                    
                    <strong>제2조 (개인정보 처리)</strong><br/>
                    1. 회사는 서비스 제공을 위해 최소한의 개인정보만을 수집합니다.<br/>
                    2. 수집하는 개인정보: 이메일, 이름, 로그인 정보<br/>
                    3. 이용자가 입력한 약관 텍스트는 분석 완료 후 즉시 삭제됩니다.<br/>
                    4. 분석 결과는 이용자의 기기에만 저장되며, 서버에 보관되지 않습니다.
                    <br/><br/>
                    
                    <strong>제3조 (서비스 이용)</strong><br/>
                    1. 본 서비스는 무료로 제공됩니다.<br/>
                    2. AI 분석 결과는 참고용이며, 법적 효력을 갖지 않습니다.<br/>
                    3. 정확한 법적 해석이 필요한 경우 법무 전문가와 상담하시기 바랍니다.
                  </div>
                  
                  <div>
                    <div style={styles.agreementItem}>
                      <input
                        style={styles.checkbox}
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        required
                      />
                      <label style={{...styles.agreementLabel, ...styles.requiredLabel}}>
                        [필수] BYSO 이용약관에 동의합니다
                      </label>
                    </div>
                    
                    <div style={styles.agreementItem}>
                      <input
                        style={styles.checkbox}
                        type="checkbox"
                        name="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onChange={handleInputChange}
                        required
                      />
                      <label style={{...styles.agreementLabel, ...styles.requiredLabel}}>
                        [필수] 개인정보 수집 및 이용에 동의합니다
                      </label>
                    </div>
                    
                    <div style={styles.agreementItem}>
                      <input
                        style={styles.checkbox}
                        type="checkbox"
                        name="agreeMarketing"
                        checked={formData.agreeMarketing}
                        onChange={handleInputChange}
                      />
                      <label style={{...styles.agreementLabel, ...styles.optionalLabel}}>
                        [선택] 서비스 개선을 위한 익명 통계 수집에 동의합니다
                      </label>
                    </div>
                    
                    <div style={{...styles.agreementItem, ...styles.agreementAll}}>
                      <input
                        style={styles.checkbox}
                        type="checkbox"
                        name="agreeAll"
                        checked={formData.agreeAll}
                        onChange={handleInputChange}
                      />
                      <label style={{...styles.agreementLabel, ...styles.requiredLabel}}>
                        위 약관에 모두 동의합니다
                      </label>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  style={{
                    ...styles.signupBtn,
                    opacity: (!formData.agreeTerms || !formData.agreePrivacy) ? 0.5 : 1,
                    cursor: (!formData.agreeTerms || !formData.agreePrivacy) ? 'not-allowed' : 'pointer'
                  }}
                  disabled={!formData.agreeTerms || !formData.agreePrivacy}
                >
                  회원가입
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 간단한 도움말 모달 */}
      {showHelpModal && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalContent, ...styles.helpModalContent}}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>TCAnalyzer 도움말</h2>
              <button style={styles.closeBtn} onClick={() => setShowHelpModal(false)}>
                &times;
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.helpSection}>
                <h3 style={styles.helpTitle}>프롤로그: 우리 서비스 약관 체험하기</h3>
                <p style={{color: colors.textSecondary, lineHeight: '1.6', marginBottom: '20px'}}>
                  TCAnalyzer가 어떻게 작동하는지 우리 자체 약관으로 먼저 체험해보세요!
                </p>
                
                <div style={styles.demoContainer}>
                  <h4 style={{margin: '0 0 15px 0', color: colors.textPrimary}}>TCAnalyzer 약관 요약</h4>
                  
                  <div style={styles.checkListItem}>
                    <span style={{...styles.goodItem, marginRight: '8px'}}>✅</span>
                    최소한의 개인정보만 수집 (이메일, 이름)
                  </div>
                  <div style={styles.checkListItem}>
                    <span style={{...styles.goodItem, marginRight: '8px'}}>✅</span>
                    입력한 약관은 분석 후 즉시 삭제
                  </div>
                  <div style={styles.checkListItem}>
                    <span style={{...styles.goodItem, marginRight: '8px'}}>✅</span>
                    분석 결과는 사용자 기기에만 저장
                  </div>
                  <div style={styles.checkListItem}>
                    <span style={{...styles.goodItem, marginRight: '8px'}}>✅</span>
                    무료 서비스 제공
                  </div>
                  <div style={styles.checkListItem}>
                    <span style={{...styles.warningItem, marginRight: '8px'}}>⚠️</span>
                    AI 결과는 참고용 (법적 효력 없음)
                  </div>
                  
                  <button style={styles.demoBtn} onClick={runDemo}>
                    이 약관 분석 체험하기
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
                        TCAnalyzer는 안전하고 투명한 서비스입니다! 🎉
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={styles.helpSection}>
                <h3 style={styles.helpTitle}>서비스 이용 방법</h3>
                <div style={{color: colors.textSecondary, lineHeight: '1.8'}}>
                  <div style={{marginBottom: '8px'}}><strong>1단계:</strong> 로그인 또는 회원가입</div>
                  <div style={{marginBottom: '8px'}}><strong>2단계:</strong> 분석하고 싶은 약관 텍스트 입력</div>
                  <div style={{marginBottom: '8px'}}><strong>3단계:</strong> AI 분석 결과 확인</div>
                  <div><strong>4단계:</strong> 결과 저장 및 관리 (로그인 시)</div>
                </div>
              </div>
              
              <div style={styles.helpSection}>
                <h3 style={styles.helpTitle}>자주 묻는 질문</h3>
                
                <div style={{marginBottom: '15px'}}>
                  <p style={{color: colors.textPrimary, lineHeight: '1.6', margin: 0}}>
                    <strong>Q:</strong> 분석 결과를 법적 근거로 사용할 수 있나요?<br/>
                    <strong>A:</strong> 참고용이며, 법적 효력은 없습니다.
                  </p>
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