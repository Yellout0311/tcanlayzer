// 페이지 로드 시 통합 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('설정 페이지 로드 완료');
    // 나머지 초기화
    initializeSettings();
    setupModalEventListeners();
    setupTermsAgreement();
});

// 설정 초기화 
function initializeSettings() {
    // 자동저장 설정만 처리
    const autoSave = localStorage.getItem('autoSave') !== 'false'; // 기본값: true
    document.getElementById('autoSave').checked = autoSave;
    
    // 자동저장 설정 변경 이벤트만
    document.getElementById('autoSave').addEventListener('change', function() {
        const enabled = this.checked;
        localStorage.setItem('autoSave', enabled);
        console.log('자동저장 설정 변경:', enabled);
    });
    
    // 다크모드는 darkmode.js에서 자동으로 처리됨
}

// 뒤로가기
function goBack() {
    window.location.href = 'index.html';
}

// 데이터 관리 함수들
function clearData() {
    if (confirm('분석 기록을 삭제하시겠습니까?')) {
        localStorage.removeItem('analysis_history');
        localStorage.removeItem('tcanalyzer_analysis_data');
        alert('분석 기록이 삭제되었습니다.');
        console.log('분석 기록 삭제됨');
    }
}

function resetData() {
    if (confirm('모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        if (confirm('정말로 모든 데이터를 삭제하시겠습니까?')) {
            localStorage.clear();
            alert('모든 데이터가 삭제되었습니다.');
            console.log('모든 데이터 삭제됨');
            // 페이지 새로고침하여 초기 상태로 복원
            location.reload();
        }
    }
}

// 회원가입 모달 관련 함수들
function showSignupModal() {
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
            updateSubmitButton();
        }
    }
}

function showLoginModal() {
    alert('로그인 기능은 메인 페이지에서 이용할 수 있습니다.');
    // 실제로는 메인 페이지로 이동하거나 로그인 모달을 여기서도 구현
}

// 도움말 모달 관련 함수들
function showHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('도움말 모달 열기');
    }
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('도움말 모달 닫기');
        
        // 데모 결과 숨기기
        const demoResult = document.getElementById('demoResult');
        if (demoResult) {
            demoResult.style.display = 'none';
        }
    }
}

// 프롤로그 데모 실행
function runDemo() {
    const demoResult = document.getElementById('demoResult');
    if (demoResult) {
        demoResult.style.display = 'block';
        console.log('프롤로그 데모 실행됨');
    }
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
    
    // 비밀번호 강도 체크 (최소 6자)
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
    
    // 회원가입 데이터 준비
    const signupData = {
        email: email,
        name: name,
        signupDate: new Date().toISOString(),
        agreeMarketing: document.getElementById('agreeMarketing').checked
    };
    
    // 실제로는 서버로 전송하지만, 여기서는 localStorage에 저장
    try {
        // 기존 사용자 목록 가져오기
        const existingUsers = JSON.parse(localStorage.getItem('tcanalyzer_users') || '[]');
        
        // 이메일 중복 체크
        if (existingUsers.some(user => user.email === email)) {
            alert('이미 가입된 이메일입니다.');
            return;
        }
        
        // 새 사용자 추가
        existingUsers.push(signupData);
        localStorage.setItem('tcanalyzer_users', JSON.stringify(existingUsers));
        
        console.log('회원가입 성공:', signupData);
        alert(`${name}님, 회원가입이 완료되었습니다!\n환영합니다! 🎉`);
        
        closeSignupModal();
        
    } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 약관 동의 체크박스 관리
function setupTermsAgreement() {
    const agreeAll = document.getElementById('agreeAll');
    const agreeTerms = document.getElementById('agreeTerms');
    const agreePrivacy = document.getElementById('agreePrivacy');
    const agreeMarketing = document.getElementById('agreeMarketing');
    const submitBtn = document.getElementById('signupSubmitBtn');
    
    if (!agreeAll || !agreeTerms || !agreePrivacy || !agreeMarketing || !submitBtn) {
        return;
    }
    
    // 전체 동의 체크박스
    agreeAll.addEventListener('change', function() {
        const checked = this.checked;
        agreeTerms.checked = checked;
        agreePrivacy.checked = checked;
        agreeMarketing.checked = checked;
        updateSubmitButton();
        console.log('전체 동의:', checked);
    });
    
    // 개별 체크박스들
    [agreeTerms, agreePrivacy, agreeMarketing].forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 전체 동의 체크박스 상태 업데이트
            agreeAll.checked = agreeTerms.checked && agreePrivacy.checked && agreeMarketing.checked;
            updateSubmitButton();
            console.log('약관 동의 상태 변경:', this.id, this.checked);
        });
    });
    
    // 회원가입 버튼 활성화/비활성화
    function updateSubmitButton() {
        // 필수 약관들이 모두 체크되었는지 확인
        const requiredChecked = agreeTerms.checked && agreePrivacy.checked;
        submitBtn.disabled = !requiredChecked;
        
        if (requiredChecked) {
            submitBtn.style.background = '#B2AC88';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.background = '#ccc';
            submitBtn.style.cursor = 'not-allowed';
        }
    }
    
    // 초기 상태 설정
    updateSubmitButton();
}

// 모달 이벤트 리스너 설정
function setupModalEventListeners() {
    // 모달 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const signupModal = document.getElementById('signupModal');
        const helpModal = document.getElementById('helpModal');
        
        if (e.target === signupModal) {
            closeSignupModal();
        }
        if (e.target === helpModal) {
            closeHelpModal();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSignupModal();
            closeHelpModal();
        }
    });
    
    // 엔터 키로 폼 제출
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const signupModal = document.getElementById('signupModal');
            if (signupModal && signupModal.classList.contains('show')) {
                const submitBtn = document.getElementById('signupSubmitBtn');
                if (submitBtn && !submitBtn.disabled) {
                    e.preventDefault();
                    handleSignup(e);
                }
            }
        }
    });
}

// 다크모드 CSS 추가 (동적)
function addDarkModeStyles() {
    if (!document.getElementById('darkModeStyles')) {
        const style = document.createElement('style');
        style.id = 'darkModeStyles';
        style.textContent = `
            body.dark-mode {
                background: #2c3e50 !important;
                color: #ecf0f1 !important;
            }
            
            body.dark-mode .settings-header,
            body.dark-mode .setting-card,
            body.dark-mode .modal-content {
                background: #34495e !important;
                color: #ecf0f1 !important;
            }
            
            body.dark-mode .setting-card h2,
            body.dark-mode .modal-header h2 {
                color: #ecf0f1 !important;
                border-bottom-color: #556983 !important;
            }
            
            body.dark-mode .setting-item,
            body.dark-mode .info-item {
                border-bottom-color: #556983 !important;
            }
            
            body.dark-mode .terms-container {
                background: #2c3e50 !important;
                color: #ecf0f1 !important;
                border-color: #556983 !important;
            }
            
            body.dark-mode .demo-container {
                background: #2c3e50 !important;
            }
            
            body.dark-mode .demo-terms {
                background: #34495e !important;
                color: #ecf0f1 !important;
            }
            
            body.dark-mode input {
                background: #34495e !important;
                color: #ecf0f1 !important;
                border-color: #556983 !important;
            }
            
            body.dark-mode input:focus {
                border-color: #B2AC88 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// 페이지 로드 시 다크모드 스타일 추가
addDarkModeStyles();

// 유틸리티 함수들
function showHelp() {
    showHelpModal();
}

// 설정 내보내기/가져오기 (추가 기능)
function exportSettings() {
    const settings = {
        darkMode: document.getElementById('darkMode').checked,
        autoSave: document.getElementById('autoSave').checked,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'tcanalyzer-settings.json';
    link.click();
    
    console.log('설정 내보내기 완료');
}

function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const settings = JSON.parse(e.target.result);
            
            if (typeof settings.darkMode !== 'undefined') {
                document.getElementById('darkMode').checked = settings.darkMode;
                localStorage.setItem('darkMode', settings.darkMode);
            }
            
            if (typeof settings.autoSave !== 'undefined') {
                document.getElementById('autoSave').checked = settings.autoSave;
                localStorage.setItem('autoSave', settings.autoSave);
            }
            
            alert('설정을 가져왔습니다.');
            initializeSettings(); // 설정 다시 적용
            
        } catch (error) {
            alert('설정 파일 형식이 올바르지 않습니다.');
            console.error('설정 가져오기 실패:', error);
        }
    };
    reader.readAsText(file);
}

// 개발자 도구 (디버그용)
window.tcanalyzerDebug = {
    clearAllData: () => {
        localStorage.clear();
        console.log('모든 데이터 삭제됨 (디버그)');
    },
    showStoredData: () => {
        console.log('저장된 데이터:', localStorage);
    },
    getUsers: () => {
        return JSON.parse(localStorage.getItem('tcanalyzer_users') || '[]');
    }
};