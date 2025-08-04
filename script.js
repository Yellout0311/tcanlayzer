function switchTab(clickedTab, tabId) {
    // 모든 탭에서 active 클래스 제거
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 클릭된 탭에 active 클래스 추가
    clickedTab.classList.add('active');
    
    // 탭 내용 업데이트
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
        default:
            tabContent.innerHTML = '<p>이 기능은 현재 개발 중입니다.</p>';
    }
    
    console.log('Switched to tab:', tabId);
}

function analyzeTerms() {
    const textInput = document.querySelector('.text-input').value;
    
    if (textInput.trim() === '') {
        alert('약관 텍스트를 입력해주세요!');
        return;
    }
    
    // 결과 영역 보이기
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('tabContainer').style.display = 'block';
    
    // 분석 결과 표시
    document.getElementById('resultContent').innerHTML = `
        <div class="analysis-result">
            <h4>🔍 AI를 이용한 '${getTermsName(textInput)}' 약관의 분석 결과</h4>
            <p>이 약관은 <strong>보통</strong> 수준의 위험도를 가지고 있습니다.</p>
            
            <div class="risk-summary">
                <div class="risk-item danger">위험 문장: 3개</div>
                <div class="risk-item good">좋은 문장: 7개</div>
                <div class="risk-item warning">유의해야할 문장: 2개</div>
            </div>
            
            <h4>📋 AI를 이용한 분석 결과와 요약</h4>
            <ul>
                <li>개인정보 수집 범위가 명확하게 명시되어 있음</li>
                <li>데이터 보관 기간에 대한 설명이 부족함</li>
                <li>제3자 제공 조건을 주의 깊게 확인하세요</li>
                <li>사용자의 권리 행사 방법이 구체적으로 안내되어 있음</li>
                <li>약관 변경 시 사전 통지 절차가 명시되어 있음</li>
            </ul>
        </div>
    `;
    
    // 결과 영역으로 스크롤
    document.getElementById('resultSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function getTermsName(text) {
    // 간단한 로직으로 약관 이름 추출 (실제로는 더 정교한 분석이 필요)
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

function loadMyTerms(platform) {
    // 해당 플랫폼의 분석 결과를 시뮬레이션
    const platformData = {
        'instagram': {
            name: 'Instagram',
            risk: '보통',
            dangerCount: 5,
            goodCount: 12,
            warningCount: 3
        },
        'kakao': {
            name: '카카오톡',
            risk: '낮음',
            dangerCount: 1,
            goodCount: 18,
            warningCount: 2
        },
        'naver': {
            name: '네이버',
            risk: '낮음',
            dangerCount: 2,
            goodCount: 15,
            warningCount: 1
        },
        'youtube': {
            name: 'YouTube',
            risk: '높음',
            dangerCount: 8,
            goodCount: 5,
            warningCount: 7
        },
        'discord': {
            name: 'Discord',
            risk: '보통',
            dangerCount: 4,
            goodCount: 10,
            warningCount: 4
        },
        'spotify': {
            name: 'Spotify',
            risk: '낮음',
            dangerCount: 1,
            goodCount: 16,
            warningCount: 2
        }
    };

    const data = platformData[platform];
    if (!data) return;

    // 결과 영역 보이기
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('tabContainer').style.display = 'block';
    
    // 기존 분석 결과 표시...그냥 예시
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
    
    // 결과 영역으로 스크롤
    document.getElementById('resultSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function showLogin() {
    document.getElementById('loginModal').classList.add('show');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 새로운 함수들 추가
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.body.style.overflow = 'auto'; // 스크롤 복원
}

function handleLogin(event) {
    event.preventDefault(); // 폼 제출 방지
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // 여기서 실제 로그인 처리 하면 됨
    console.log('로그인 시도:', { email, password, remember });
    
    // 임시로 성공 메시지 표시
    alert(`${email}으로 로그인 시도 중...`);
    
    // 실제로는 서버에 로그인 요청을 보내고 성공시 모달을 닫음
    // closeLoginModal();
}

function socialLogin(provider) {
    alert(`${provider} 소셜 로그인 기능은 개발 중입니다.`);
}

function showSignup() {
    alert('회원가입 페이지는 개발 중입니다.');
}

// 모달 외부 클릭시 닫기
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeLoginModal();
            }
        });
    }
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLoginModal();
        }
    });
});

function showSettings() {
    alert('설정 페이지로 이동합니다.');
}

// 페이지 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 텍스트 입력 영역 실시간 높이 조절
    const textarea = document.querySelector('.text-input');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(300, this.scrollHeight) + 'px';
        });
    }
});
// 로그인 상태 관리
let isLoggedIn = false;
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드 완료');
    
    // 네이버 로그인 콜백 처리
    checkNaverLoginCallback();
    
    // 로그인 상태 확인
    checkLoginStatus();
    
    // 네이버 로그인 버튼 이벤트 설정
    setupNaverLoginButton();
    
    // 기존 초기화 코드들
    initializeTextarea();
    setupClickOutsideHandler();
    setupModalEventListeners();
});

// 네이버 로그인 콜백 처리
function checkNaverLoginCallback() {
    const naverLoginData = localStorage.getItem('naver_login_success');
    if (naverLoginData) {
        console.log('네이버 로그인 데이터 발견:', naverLoginData);
        const userData = JSON.parse(naverLoginData);
        localStorage.removeItem('naver_login_success'); // 사용 후 삭제
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
            
            const clientId = "WuMBjclze0E5qNkGCf7u"; // 실제 클라이언트 ID로 변경하세요
            
            // if (clientId === "YOUR_NAVER_CLIENT_ID") {
            //     alert('네이버 클라이언트 ID를 설정해주세요!\n\nscript.js 파일에서 YOUR_NAVER_CLIENT_ID를 실제 ID로 변경하세요.');
            //     return;
            // }
            
            const redirectURI = encodeURIComponent("http://127.0.0.1:5500/callback.html");
            const state = Math.random().toString(36).substring(2, 15);
            
            // 네이버 로그인 URL 생성
            const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectURI}&state=${state}`;
            
            console.log('네이버 로그인 URL:', naverAuthUrl);
            
            // 현재 창에서 네이버 로그인 페이지로 이동
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
    
    // 로컬스토리지에 저장
    localStorage.setItem('tcanalyzer_user', JSON.stringify(userData));
    
    // UI 업데이트
    updateUIForLoggedIn();
    
    // 모달 닫기
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
    
    // 사용자 정보 표시
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) userName.textContent = currentUser.name;
    
    if (userAvatar) {
        if (currentUser.profileImage) {
            userAvatar.innerHTML = `<img src="${currentUser.profileImage}" alt="프로필" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
    }
    
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
    
    console.log('로그아웃 UI 업데이트 완료');
}

// 사용자 메뉴 토글
function toggleUserMenu() {
    const profile = document.querySelector('.user-profile');
    const dropdown = document.getElementById('userDropdown');
    
    if (profile && dropdown) {
        profile.classList.toggle('open');
        dropdown.classList.toggle('show');
        console.log('사용자 메뉴 토글:', dropdown.classList.contains('show'));
    }
}

function closeUserMenu() {
    const profile = document.querySelector('.user-profile');
    const dropdown = document.getElementById('userDropdown');
    
    if (profile && dropdown) {
        profile.classList.remove('open');
        dropdown.classList.remove('show');
    }
}

// 로그아웃
function logout() {
    console.log('로그아웃 시작');
    
    // 로컬 데이터 삭제
    localStorage.removeItem('tcanalyzer_user');
    localStorage.removeItem('naver_login_success');
    currentUser = null;
    isLoggedIn = false;
    
    // UI 업데이트
    updateUIForLoggedOut();
    closeUserMenu();
    
    alert('로그아웃되었습니다.');
    console.log('로그아웃 완료');
}

// 기존 함수들
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
    
    // 간단한 로그인 처리
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

function showMyPage() {
    if (!isLoggedIn) {
        alert('로그인이 필요합니다.');
        showLogin();
        return;
    }
    
    const modal = document.getElementById('myPageModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        closeUserMenu();
        showMyTermsInModal();
        console.log('마이페이지 열기');
    }
}

function closeMyPageModal() {
    const modal = document.getElementById('myPageModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('마이페이지 닫기');
    }
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

function setupClickOutsideHandler() {
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            closeUserMenu();
        }
    });
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
    
    // 마이페이지 모달 외부 클릭
    const myPageModal = document.getElementById('myPageModal');
    if (myPageModal) {
        myPageModal.addEventListener('click', function(e) {
            if (e.target === myPageModal) {
                closeMyPageModal();
            }
        });
    }
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLoginModal();
            closeMyPageModal();
        }
    });
}

// 기존 분석 관련 함수들은 그대로 유지...
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
    
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('tabContainer').style.display = 'block';
    
    document.getElementById('resultContent').innerHTML = `
        <div class="analysis-result">
            <h4>🔍 AI를 이용한 '${getTermsName(textInput)}' 약관의 분석 결과</h4>
            <p>이 약관은 <strong>보통</strong> 수준의 위험도를 가지고 있습니다.</p>
            
            <div class="risk-summary">
                <div class="risk-item danger">위험 문장: 3개</div>
                <div class="risk-item good">좋은 문장: 7개</div>
                <div class="risk-item warning">유의해야할 문장: 2개</div>
            </div>
            
            <h4>📋 AI를 이용한 분석 결과와 요약</h4>
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

function getTermsName(text) {
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

// 마이페이지 관련 함수들
function switchMyPageTab(clickedTab, tabId) {
    document.querySelectorAll('.mypage-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    clickedTab.classList.add('active');
    
    switch(tabId) {
        case 'my-terms':
            showMyTermsInModal();
            break;
        case 'profile':
            showProfileInModal();
            break;
    }
}

function showMyTermsInModal() {
    const content = document.getElementById('myPageContent');
    if (content) {
        content.innerHTML = `
            <div class="my-terms-section-modal">
                <h3>내가 분석한 약관들</h3>
                <div class="my-terms-grid-modal">
                    <div class="my-terms-item-modal" onclick="loadMyTermsFromModal('instagram')">
                        <div class="my-terms-item-title">Instagram 이용약관</div>
                        <div class="my-terms-item-date">2024.07.15 분석</div>
                        <span class="my-terms-item-status status-warning">보통 위험</span>
                    </div>
                    <div class="my-terms-item-modal" onclick="loadMyTermsFromModal('kakao')">
                        <div class="my-terms-item-title">카카오톡 개인정보처리방침</div>
                        <div class="my-terms-item-date">2024.07.10 분석</div>
                        <span class="my-terms-item-status status-safe">안전</span>
                    </div>
                    <div class="my-terms-item-modal" onclick="loadMyTermsFromModal('naver')">
                        <div class="my-terms-item-title">네이버 서비스 약관</div>
                        <div class="my-terms-item-date">2024.07.08 분석</div>
                        <span class="my-terms-item-status status-safe">안전</span>
                    </div>
                    <div class="my-terms-item-modal" onclick="loadMyTermsFromModal('youtube')">
                        <div class="my-terms-item-title">YouTube 서비스 약관</div>
                        <div class="my-terms-item-date">2024.07.05 분석</div>
                        <span class="my-terms-item-status status-danger">위험</span>
                    </div>
                </div>
            </div>
        `;
    }
}

function showProfileInModal() {
    const content = document.getElementById('myPageContent');
    if (content && currentUser) {
        content.innerHTML = `
            <div class="profile-section">
                <h3>프로필 정보</h3>
                <div class="profile-info">
                    <div class="profile-item">
                        <label>이름</label>
                        <span>${currentUser.name}</span>
                    </div>
                    <div class="profile-item">
                        <label>이메일</label>
                        <span>${currentUser.email || '등록된 이메일이 없습니다'}</span>
                    </div>
                    <div class="profile-item">
                        <label>로그인 방식</label>
                        <span>${currentUser.provider === 'naver' ? '네이버' : currentUser.provider || 'email'}</span>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadMyTermsFromModal(platform) {
    closeMyPageModal();
    loadMyTerms(platform);
}

function loadMyTerms(platform) {
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

    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('tabContainer').style.display = 'block';
    
    document.getElementById('resultContent').innerHTML = `
        <div class="analysis-result">
            <h4>🔍 AI를 이용한 '${data.name}' 약관의 분석 결과</h4>
            <p>이 약관은 <strong>${data.risk}</strong> 수준의 위험도를 가지고 있습니다.</p>
            
            <div class="risk-summary">
                <div class="risk-item danger">위험 문장: ${data.dangerCount}개</div>
                <div class="risk-item good">좋은 문장: ${data.goodCount}개</div>
                <div class="risk-item-warning">유의해야할 문장: ${data.warningCount}개</div>
            </div>
            
            <h4>📋 AI를 이용한 분석 결과와 요약</h4>
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