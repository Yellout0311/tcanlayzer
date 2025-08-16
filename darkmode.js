// 즉시 실행되는 다크모드 초기 적용 (깜빡임 방지)
(function() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.style.background = '#000000';
        document.documentElement.style.color = '#ffffff';
        document.documentElement.classList.add('dark-mode-loading');
    }
})();

// 다크모드 유틸리티 객체
window.DarkModeUtils = {
    // 다크모드 상태 확인
    isDarkMode: function() {
        return localStorage.getItem('darkMode') === 'true';
    },
    
    // 다크모드 적용
    applyDarkMode: function() {
        const isDark = this.isDarkMode();
        if (isDark) {
            document.body.classList.add('dark-mode');
            document.documentElement.style.background = '#000000';
            document.documentElement.style.color = '#ffffff';
            console.log('다크모드 적용됨');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.style.background = '';
            document.documentElement.style.color = '';
            console.log('라이트모드 적용됨');
        }
        
        // 로딩 클래스 제거
        document.documentElement.classList.remove('dark-mode-loading');
        return isDark;
    },
    
    // 다크모드 토글
    toggleDarkMode: function() {
        const currentState = this.isDarkMode();
        const newState = !currentState;
        this.setDarkMode(newState);
        return newState;
    },
    
    // 다크모드 설정
    setDarkMode: function(enabled) {
        localStorage.setItem('darkMode', enabled);
        this.applyDarkMode();
        
        // 설정 페이지의 체크박스도 업데이트 (있으면)
        const darkModeCheckbox = document.getElementById('darkMode');
        if (darkModeCheckbox) {
            darkModeCheckbox.checked = enabled;
        }
        
        console.log('다크모드 설정:', enabled ? '활성화' : '비활성화');
    },
    
    // 페이지 로드 시 초기화
    initialize: function() {
        this.applyDarkMode();
        
        // 설정 페이지에서 체크박스 이벤트 바인딩 (있으면)
        const darkModeCheckbox = document.getElementById('darkMode');
        if (darkModeCheckbox) {
            // 현재 상태로 체크박스 설정
            darkModeCheckbox.checked = this.isDarkMode();
            
            // 이벤트 리스너 추가 (기존 것이 있으면 제거 후 추가)
            darkModeCheckbox.removeEventListener('change', this._handleCheckboxChange);
            darkModeCheckbox.addEventListener('change', this._handleCheckboxChange.bind(this));
        }
    },
    
    // 체크박스 변경 핸들러
    _handleCheckboxChange: function(event) {
        this.setDarkMode(event.target.checked);
    }
};

// DOM 로드 완료 시 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.DarkModeUtils.initialize();
});