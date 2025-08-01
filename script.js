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