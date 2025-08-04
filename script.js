// 로그인 상태 관리
let isLoggedIn = false;
let currentUser = null;
let sidebarOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드 완료');
    
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
    
    const analysisData = [
        {
            id: 'instagram',
            name: 'Instagram 이용약관',
            date: '2024.07.15',
            status: 'warning',
            statusText: '보통 위험',
            icon: 'IG',
            iconColor: 'linear-gradient(135deg, #e1306c, #fd1d1d)'
        },
        {
            id: 'kakao',
            name: '카카오톡 개인정보처리방침',
            date: '2024.07.10',
            status: 'safe',
            statusText: '안전',
            icon: 'K',
            iconColor: '#ffeb00'
        },
        {
            id: 'naver',
            name: '네이버 서비스 약관',
            date: '2024.07.08',
            status: 'safe',
            statusText: '안전',
            icon: 'N',
            iconColor: '#03c75a'
        },
        {
            id: 'youtube',
            name: 'YouTube 서비스 약관',
            date: '2024.07.05',
            status: 'danger',
            statusText: '위험',
            icon: 'YT',
            iconColor: '#ff0000'
        },
        {
            id: 'discord',
            name: 'Discord 개인정보처리방침',
            date: '2024.07.03',
            status: 'warning',
            statusText: '보통 위험',
            icon: 'DC',
            iconColor: '#5865f2'
        },
        {
            id: 'spotify',
            name: 'Spotify 이용약관',
            date: '2024.07.01',
            status: 'safe',
            statusText: '안전',
            icon: 'SP',
            iconColor: '#1db954'
        }
    ];
    
    analysisList.innerHTML = analysisData.map(item => `
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
        </div>
    `).join('');
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
    console.log('로그아웃 시작');
    
    localStorage.removeItem('tcanalyzer_user');
    localStorage.removeItem('naver_login_success');
    currentUser = null;
    isLoggedIn = false;
    
    updateUIForLoggedOut();
    alert('로그아웃되었습니다.');
    console.log('로그아웃 완료');
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

function showSignup() {
    alert('회원가입 페이지는 개발 중입니다.');
}

function showSettings() {
    alert('설정 페이지는 개발 중입니다.');
}

// function showMyPage() {
//     alert('마이페이지 기능은 개발 중입니다.');
// }

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

function analyzeTerms() { //텍스트 읽고 분석
    const textInput = document.querySelector('.text-input').value;
    
    if (textInput.trim() === '') {
        alert('약관 텍스트를 입력해주세요!');
        return;
    }
    
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('tabContainer').style.display = 'block';
    
    document.getElementById('resultContent').innerHTML = `
        <div class="analysis-result">
            <h4> AI를 이용한 '${getTermsName(textInput)}' 약관의 분석 결과</h4>
            <p>이 약관은 <strong>보통</strong> 수준의 위험도를 가지고 있습니다.</p>
            
            <div class="risk-summary">
                <div class="risk-item danger">위험 문장: 3개</div>
                <div class="risk-item good">좋은 문장: 7개</div>
                <div class="risk-item warning">유의해야할 문장: 2개</div>
            </div>
            
            <h4> AI를 이용한 분석 결과와 요약</h4>
            <ul>
                <li>개인정보 수집 범위가 명확하게 명시되어 있음</li>
                <li>데이터 보관 기간에 대한 설명이 부족함</li>
                <li>제3자 제공 조건을 주의 깊게 확인하세요</li>
                <li>사용자의 권리 행사 방법이 구체적으로 안내되어 있음</li>
                <li>약관 변경 시 사전 통지 절차가 명시되어 있음</li>
            </ul>
        </div>
    `;
    
    document.getElementById('resultSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
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