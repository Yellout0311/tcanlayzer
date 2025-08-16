// 로그인 상태 관리
let isLoggedIn = false;
let currentUser = null;
let sidebarOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('메인 페이지 로드 완료');
    
    //다크 모드는 darkmode.js에서 자동처리됨.
    
    // 네이버 로그인 콜백 처리
    checkNaverLoginCallback();
    // 로그인 상태 확인
    checkLoginStatus();
    // 네이버 로그인 버튼 설정
    setupNaverLoginButton();
    // 기존 초기화 코드들
    initializeTextarea();
    setupModalEventListeners();
});

// 사이드바 토글
function toggleSidebar() {
    if (!isLoggedIn) {
        alert('로그인 후 이용할 수 있습니다.');
        showLogin();
        return;
    }
    
    sidebarOpen = !sidebarOpen;
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    if (sidebarOpen) {
        sidebar.classList.add('show');
        mainContent.classList.add('sidebar-open');
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '✕';
    } else {
        sidebar.classList.remove('show');
        mainContent.classList.remove('sidebar-open');
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '☰';
    }
}

// 사이드바에 분석 리스트 표시
function updateSidebarAnalysisList() {
    const analysisList = document.getElementById('analysisList');
    if (!analysisList) return;
    
    // 저장된 분석 결과들 가져오기
    const savedAnalyses = JSON.parse(localStorage.getItem('saved_analyses') || '[]');
    
    // 기본 데모 데이터와 합치기
    const demoData = [
        {
            id: 'instagram',
            name: 'Instagram 이용약관',
            date: '2024.07.15',
            status: 'warning',
            statusText: '보통 위험',
            icon: 'IG',
            iconColor: 'linear-gradient(135deg, #e1306c, #fd1d1d)',
            isDemo: true
        },
        // ... 다른 데모 데이터들
    ];
    
    const allAnalyses = [...savedAnalyses.map(item => ({
        ...item,
        id: item.id,
        statusText: item.risk === '높음' ? '위험' : item.risk === '보통' ? '보통 위험' : '안전',
        status: item.risk === '높음' ? 'danger' : item.risk === '보통' ? 'warning' : 'safe',
        icon: item.name.substring(0, 2),
        iconColor: '#B2AC88',
        isDemo: false
    })), ...demoData];
    
    analysisList.innerHTML = allAnalyses.map(item => `
        <div class="analysis-item" onclick="loadAnalysis('${item.id}')">
            <div class="analysis-item-header">
                <div class="analysis-item-icon" style="background: ${item.iconColor}; color: ${item.iconColor === '#ffeb00' ? '#333' : 'white'};">
                    ${item.icon}
                </div>
                <div class="analysis-item-info">
                    <h4>${item.name}</h4>
                    <div class="analysis-item-date">${item.date} 분석</div>
                </div>
            </div>
            <span class="analysis-item-status status-${item.status}">${item.statusText}</span>
            ${!item.isDemo ? `<button class="delete-analysis-btn" onclick="deleteAnalysis(event, '${item.id}')">🗑️</button>` : ''}
        </div>
    `).join('');
}

// 분석 결과 삭제 함수
function deleteAnalysis(event, resultId) {
    event.stopPropagation(); // 클릭 이벤트 전파 방지
    
    if (confirm('이 분석 결과를 삭제하시겠습니까?')) {
        const savedAnalyses = JSON.parse(localStorage.getItem('saved_analyses') || '[]');
        const filteredAnalyses = savedAnalyses.filter(item => item.id != resultId);
        localStorage.setItem('saved_analyses', JSON.stringify(filteredAnalyses));
        updateSidebarAnalysisList();
    }
}
// 분석 결과 로드
function loadAnalysis(platform) {
    const platformData = {
        'instagram': { name: 'Instagram', risk: '보통', dangerCount: 5, goodCount: 12, warningCount: 3 },
        'kakao': { name: '카카오톡', risk: '낮음', dangerCount: 1, goodCount: 18, warningCount: 2 },
        'naver': { name: '네이버', risk: '낮음', dangerCount: 2, goodCount: 15, warningCount: 1 },
        'youtube': { name: 'YouTube', risk: '높음', dangerCount: 8, goodCount: 5, warningCount: 7 },
        'discord': { name: 'Discord', risk: '보통', dangerCount: 4, goodCount: 10, warningCount: 4 },
        'spotify': { name: 'Spotify', risk: '낮음', dangerCount: 1, goodCount: 16, warningCount: 2 }
    };

    const data = platformData[platform];
    if (!data) return;

    // 사이드바 닫기
    if (sidebarOpen) {
        toggleSidebar();
    }

    // 결과 표시
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('tabContainer').style.display = 'block';
    
    document.getElementById('resultContent').innerHTML = `
        <div class="analysis-result">
            <h4> AI를 이용한 '${data.name}' 약관의 분석 결과</h4>
            <p>이 약관은 <strong>${data.risk}</strong> 수준의 위험도를 가지고 있습니다.</p>
            
            <div class="risk-summary">
                <div class="risk-item danger">위험 문장: ${data.dangerCount}개</div>
                <div class="risk-item good">좋은 문장: ${data.goodCount}개</div>
                <div class="risk-item warning">유의해야할 문장: ${data.warningCount}개</div>
            </div>
            
            <h4> AI를 이용한 분석 결과와 요약</h4>
            <p><em>저장된 ${data.name} 약관 분석 결과입니다.</em></p>
            <ul>
                <li>개인정보 수집 및 이용 목적이 명확히 제시됨</li>
                <li>서비스 이용 중단 시 데이터 처리 방법 확인 필요</li>
                <li>광고 및 마케팅 활용 동의 조항 주의</li>
                <li>제3자 서비스 연동 시 추가 약관 적용</li>
            </ul>
        </div>
    `;
    
    document.getElementById('resultSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// 네이버 로그인 콜백 처리
function checkNaverLoginCallback() {
    const naverLoginData = localStorage.getItem('naver_login_success');
    if (naverLoginData) {
        console.log('네이버 로그인 데이터 발견:', naverLoginData);
        const userData = JSON.parse(naverLoginData);
        localStorage.removeItem('naver_login_success');
        handleLoginSuccess(userData);
    }
}

// 네이버 로그인 버튼 설정
function setupNaverLoginButton() {
    const naverBtn = document.getElementById('naverLoginBtn');
    if (naverBtn) {
        naverBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('네이버 로그인 버튼 클릭');
            
            const clientId = "WuMBjclze0E5qNkGCf7u"; // 네이버 developer에서 받은 실제 클라이언트 ID
            
            const redirectURI = encodeURIComponent("http://127.0.0.1:5500/callback.html");
            const state = Math.random().toString(36).substring(2, 15);
            
            const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectURI}&state=${state}`;
            
            console.log('네이버 로그인 URL:', naverAuthUrl);
            window.location.href = naverAuthUrl;
        });
    }
}

// 로그인 상태 체크
function checkLoginStatus() {
    const saved = localStorage.getItem('tcanalyzer_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        isLoggedIn = true;
        console.log('저장된 사용자 정보:', currentUser);
        updateUIForLoggedIn();
    } else {
        console.log('저장된 사용자 정보 없음');
        updateUIForLoggedOut();
    }
}

// 로그인 성공 처리
function handleLoginSuccess(userData) {
    console.log('로그인 성공 처리:', userData);
    currentUser = userData;
    isLoggedIn = true;
    
    localStorage.setItem('tcanalyzer_user', JSON.stringify(userData));
    updateUIForLoggedIn();
    closeLoginModal();
    
    alert(`${userData.name}님, 환영합니다!`);
}

// 로그인 후 UI 업데이트
function updateUIForLoggedIn() {
    const headerOut = document.getElementById('headerLoggedOut');
    const headerIn = document.getElementById('headerLoggedIn');
    const loginNotice = document.getElementById('loginNoticeSection');
    
    if (headerOut) headerOut.style.display = 'none';
    if (headerIn) headerIn.style.display = 'flex';
    if (loginNotice) loginNotice.style.display = 'none';
    
    // 사이드바 분석 리스트 업데이트
    updateSidebarAnalysisList();
    
    console.log('로그인 UI 업데이트 완료');
}

// 로그아웃 후 UI 업데이트
function updateUIForLoggedOut() {
    const headerOut = document.getElementById('headerLoggedOut');
    const headerIn = document.getElementById('headerLoggedIn');
    const loginNotice = document.getElementById('loginNoticeSection');
    
    if (headerOut) headerOut.style.display = 'flex';
    if (headerIn) headerIn.style.display = 'none';
    if (loginNotice) loginNotice.style.display = 'block';
    
    // 사이드바 닫기
    if (sidebarOpen) {
        toggleSidebar();
    }
    
    console.log('로그아웃 UI 업데이트 완료');
}

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {  
        console.log('로그아웃 시작');
        
        localStorage.removeItem('tcanalyzer_user');
        localStorage.removeItem('naver_login_success');
        currentUser = null;
        isLoggedIn = false;
        
        updateUIForLoggedOut();
        alert('로그아웃되었습니다.');
        console.log('로그아웃 완료');
    }
}

// 로그인 모달 관련
function showLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('로그인 모달 열기');
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('로그인 모달 닫기');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('일반 로그인 시도:', email);
    
    handleLoginSuccess({
        name: email.split('@')[0],
        email: email,
        provider: 'email'
    });
}

function socialLogin(provider) {
    console.log('소셜 로그인 시도:', provider);
    
    if (provider === 'google') {
        alert('Google 로그인 기능은 개발 중입니다.');
    } else if (provider === 'kakao') {
        alert('카카오 로그인 기능은 개발 중입니다.');
    }
}

// 회원가입 모달 관련 함수들
function showSignup() {
    closeLoginModal(); // 로그인 모달이 열려있다면 닫기
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('회원가입 모달 열기');
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('회원가입 모달 닫기');
        
        // 폼 초기화
        const form = modal.querySelector('.signup-form');
        if (form) {
            form.reset();
            updateSignupSubmitButton();
        }
    }
}

function switchToLogin() {
    closeSignupModal();
    showLogin();
}

// 회원가입 처리
function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('userName').value;
    
    // 입력값 검증
    if (!email || !password || !confirmPassword || !name) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    // 비밀번호 확인
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    // 비밀번호 강도 체크
    if (password.length < 6) {
        alert('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
    }
    
    // 약관 동의 확인
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const agreePrivacy = document.getElementById('agreePrivacy').checked;
    
    if (!agreeTerms || !agreePrivacy) {
        alert('필수 약관에 동의해주세요.');
        return;
    }
    
    // 이메일 중복 체크 (간단한 로컬 체크)
    const existingUsers = JSON.parse(localStorage.getItem('tcanalyzer_users') || '[]');
    if (existingUsers.some(user => user.email === email)) {
        alert('이미 가입된 이메일입니다.');
        return;
    }
    
    // 회원가입 데이터 준비
    const signupData = {
        email: email,
        name: name,
        signupDate: new Date().toISOString(),
        agreeMarketing: document.getElementById('agreeMarketing').checked
    };
    
    try {
        // 새 사용자 추가
        existingUsers.push(signupData);
        localStorage.setItem('tcanalyzer_users', JSON.stringify(existingUsers));
        
        console.log('회원가입 성공:', signupData);
        alert(`${name}님, 환영합니다! 🎉\n회원가입이 완료되었습니다.`);
        
        // 회원가입 후 자동 로그인
        handleLoginSuccess({
            name: name,
            email: email,
            provider: 'email'
        });
        
        closeSignupModal();
        
    } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 약관 동의 체크박스 관리 (페이지 로드 시 이벤트 등록)
document.addEventListener('DOMContentLoaded', function() {
    // 기존 초기화 코드...
    
    setupSignupTermsAgreement();
});

function setupSignupTermsAgreement() {
    const agreeAll = document.getElementById('agreeAll');
    const agreeTerms = document.getElementById('agreeTerms');
    const agreePrivacy = document.getElementById('agreePrivacy');
    const agreeMarketing = document.getElementById('agreeMarketing');
    
    if (!agreeAll || !agreeTerms || !agreePrivacy || !agreeMarketing) {
        return;
    }
    
    // 전체 동의 체크박스
    agreeAll.addEventListener('change', function() {
        const checked = this.checked;
        agreeTerms.checked = checked;
        agreePrivacy.checked = checked;
        agreeMarketing.checked = checked;
        updateSignupSubmitButton();
    });
    
    // 개별 체크박스들
    [agreeTerms, agreePrivacy, agreeMarketing].forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 전체 동의 체크박스 상태 업데이트
            agreeAll.checked = agreeTerms.checked && agreePrivacy.checked && agreeMarketing.checked;
            updateSignupSubmitButton();
        });
    });
}

function updateSignupSubmitButton() {
    const agreeTerms = document.getElementById('agreeTerms');
    const agreePrivacy = document.getElementById('agreePrivacy');
    const submitBtn = document.getElementById('signupSubmitBtn');
    
    if (agreeTerms && agreePrivacy && submitBtn) {
        const requiredChecked = agreeTerms.checked && agreePrivacy.checked;
        submitBtn.disabled = !requiredChecked;
    }
}

// 기존 setupModalEventListeners 함수에 회원가입 모달 이벤트 추가
function setupModalEventListeners() {
    // 기존 로그인 모달 코드...
    
    // 회원가입 모달 외부 클릭
    const signupModal = document.getElementById('signupModal');
    if (signupModal) {
        signupModal.addEventListener('click', function(e) {
            if (e.target === signupModal) {
                closeSignupModal();
            }
        });
    }
    
    // ESC 키로 모달 닫기 (기존 함수에 추가)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLoginModal();
            closeSignupModal(); // 추가
            if (sidebarOpen) {
                toggleSidebar();
            }
        }
    });
}

function showSettings() {
    window.location.href = 'settings.html';
}



// 분석 관련 함수들
function switchTab(clickedTab, tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    clickedTab.classList.add('active');
    
    const tabContent = document.getElementById('tabContent');
    switch(tabId) {
        case 'summary':
            tabContent.innerHTML = '<p>AI 요약 기능은 현재 개발 중입니다.</p>';
            break;
        case 'key-phrases':
            tabContent.innerHTML = '<p>중요 문구 추출 기능은 현재 개발 중입니다.</p>';
            break;
        case 'expert-view':
            tabContent.innerHTML = '<p>전문 보기 + 타임라인 기능은 현재 개발 중입니다.</p>';
            break;
    }
}

function analyzeTerms() {
    const textInput = document.querySelector('.text-input').value;
    
    if (textInput.trim() === '') {
        alert('약관 텍스트를 입력해주세요!');
        return;
    }
    
    if (!isLoggedIn) {
        alert('로그인 후 분석 결과를 저장할 수 있습니다.');
    }
    
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('tabContainer').style.display = 'block';
    
    const analysisResult = {
        id: Date.now(),
        name: getTermsName(textInput),
        date: new Date().toLocaleDateString('ko-KR'),
        risk: '보통',
        dangerCount: 3,
        goodCount: 7,
        warningCount: 2,
        content: textInput.substring(0, 100) + '...' // 내용 일부 저장
    };
    
    document.getElementById('resultContent').innerHTML = `
        <div class="analysis-result">
            <div class="result-header">
                <h4>🔍 AI를 이용한 '${analysisResult.name}' 약관의 분석 결과</h4>
                ${isLoggedIn ? `<button class="save-result-btn" onclick="saveAnalysisResult('${analysisResult.id}')">💾 저장하기</button>` : ''}
            </div>
            <p>이 약관은 <strong>${analysisResult.risk}</strong> 수준의 위험도를 가지고 있습니다.</p>
            
            <div class="risk-summary">
                <div class="risk-item danger">위험 문장: ${analysisResult.dangerCount}개</div>
                <div class="risk-item good">좋은 문장: ${analysisResult.goodCount}개</div>
                <div class="risk-item warning">유의해야할 문장: ${analysisResult.warningCount}개</div>
            </div>
            
            <h4>📊 AI를 이용한 분석 결과와 요약</h4>
            <ul>
                <li>개인정보 수집 범위가 명확하게 명시되어 있음</li>
                <li>데이터 보관 기간에 대한 설명이 부족함</li>
                <li>제3자 제공 조건을 주의 깊게 확인하세요</li>
                <li>사용자의 권리 행사 방법이 구체적으로 안내되어 있음</li>
                <li>약관 변경 시 사전 통지 절차가 명시되어 있음</li>
            </ul>
        </div>
    `;
    
    // 임시로 현재 분석 결과 저장 (저장 버튼을 위해)
    window.currentAnalysisResult = analysisResult;
    
    document.getElementById('resultSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// 분석 결과 저장 함수
function saveAnalysisResult(resultId) {
    if (!isLoggedIn) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    const result = window.currentAnalysisResult;
    if (!result) {
        alert('저장할 분석 결과가 없습니다.');
        return;
    }
    
    // 기존 저장된 분석 결과들 가져오기
    const savedAnalyses = JSON.parse(localStorage.getItem('saved_analyses') || '[]');
    
    // 새 분석 결과 추가
    savedAnalyses.unshift(result); // 최신 것을 맨 앞에
    
    // 최대 20개까지만 저장
    if (savedAnalyses.length > 20) {
        savedAnalyses.splice(20);
    }
    
    localStorage.setItem('saved_analyses', JSON.stringify(savedAnalyses));
    
    // 사이드바 업데이트
    updateSidebarAnalysisList();
    
    alert('분석 결과가 저장되었습니다! 📁');
    
    // 저장 버튼 비활성화
    const saveBtn = document.querySelector('.save-result-btn');
    if (saveBtn) {
        saveBtn.innerHTML = '✅ 저장됨';
        saveBtn.disabled = true;
        saveBtn.style.background = '#28a745';
    }
}
function getTermsName(text) { //example case
    if (text.toLowerCase().includes('instagram')) return 'Instagram';
    if (text.toLowerCase().includes('google')) return 'Google';
    if (text.toLowerCase().includes('apple')) return 'Apple';
    if (text.toLowerCase().includes('kakao')) return '카카오';
    if (text.toLowerCase().includes('naver')) return '네이버';
    if (text.toLowerCase().includes('youtube')) return 'YouTube';
    if (text.toLowerCase().includes('discord')) return 'Discord';
    if (text.toLowerCase().includes('spotify')) return 'Spotify';
    return '업로드한';
}

// 초기화 함수들
function initializeTextarea() {
    const textarea = document.querySelector('.text-input');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(300, this.scrollHeight) + 'px';
        });
    }
}

function setupModalEventListeners() {
    // 로그인 모달 외부 클릭
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLoginModal();
            if (sidebarOpen) {
                toggleSidebar();
            }
        }
    });
    
    // 사이드바 외부 클릭으로 닫기
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebarToggle');
        
        if (sidebarOpen && !sidebar.contains(e.target) && e.target !== toggleBtn) {
            toggleSidebar();
        }
    });
}