// settings.js

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    setupEventListeners();
});

// 설정 불러오기
function loadSettings() {
    // 다크모드 설정 불러오기
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.getElementById('darkMode').checked = darkMode;
    if (darkMode) {
        document.body.classList.add('dark');
    }
    
    // 자동저장 설정 불러오기
    const autoSave = localStorage.getItem('autoSave') !== 'false'; // 기본값 true
    document.getElementById('autoSave').checked = autoSave;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 다크모드 토글
    document.getElementById('darkMode').addEventListener('change', function() {
        const isDark = this.checked;
        localStorage.setItem('darkMode', isDark);
        
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });
    
    // 자동저장 토글
    document.getElementById('autoSave').addEventListener('change', function() {
        localStorage.setItem('autoSave', this.checked);
    });
}

// 홈으로 돌아가기
function goBack() {
    window.location.href = 'index.html';
}

// 분석 기록 삭제
function clearData() {
    if (confirm('모든 분석 기록을 삭제하시겠습니까?')) {
        // 분석 관련 데이터만 삭제 (로그인 정보는 유지)
        const keysToKeep = ['tcanalyzer_user', 'darkMode', 'autoSave'];
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !keysToKeep.includes(key)) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        alert('분석 기록이 삭제되었습니다.');
    }
}

// 초기화
function resetData() {
    if (confirm('모든 데이터를 삭제하고 앱을 초기화하시겠습니까?\n로그인 정보도 함께 삭제됩니다.')) {
        if (confirm('정말로 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            //이 자리에 서버에 계정 삭제 요청 넣으면 굿. (fetch해서)
            // 서버에 저장된 데이터나 실제 계정 정보 같은 거 
            localStorage.clear(); // 브라우저 로컬 스토리지 삭제 (로그인 정보, 다크모드 설정, 자동저장 설정, 분석 기록들이 삭제됨)
            alert('모든 데이터가 삭제되었습니다.');
            window.location.href = 'index.html';
        }
    }
}

// 도움말
function showHelp() {
    alert(`TCAnalyzer 사용법

📝 약관 분석하기:
1. 메인 페이지에서 약관 텍스트를 입력창에 붙여넣기
2. '분석하기' 버튼 클릭
3. 결과 확인

💾 데이터 관리:
- 자동저장: 분석 결과를 자동으로 저장
- 로그인 시 사이드바에서 기록 확인 가능

⚙️ 설정:
- 다크모드: 어두운 테마 사용
- 데이터 삭제: 분석 기록 또는 전체 데이터 삭제

문의사항이 있으시면 support@tcanalyzer.com으로 연락주세요.`);
}