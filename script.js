function switchTab(clickedTab, tabId) {
    // 모든 탭에서 active 클래스 제거
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 클릭된 탭에 active 클래스 추가
    clickedTab.classList.add('active');
    
    // 여기서 각 탭에 따른 콘텐츠 변경 로직을 추가할 수 있습니다
    console.log('Switched to tab:', tabId);
}

function analyzeTerms() {
    const textInput = document.querySelector('.text-input').value;
    
    if (textInput.trim() === '') {
        alert('약관 텍스트를 입력해주세요!');
        return;
    }
    
    // 기본 안내 숨기기
    document.getElementById('guideSection').style.display = 'none';
    
    // 결과 영역 보이기
    document.getElementById('resultSection').style.display = 'block';
    
    // 분석 결과 표시
    document.getElementById('resultContent').innerHTML = `
        <div class="analysis-result">
            <h4>전체적인 평가</h4>
            <p>이 약관은 <strong>보통</strong> 수준의 위험도를 가지고 있습니다.</p>
            
            <div class="risk-summary">
                <div class="risk-item danger">위험 문장: 3개</div>
                <div class="risk-item good">좋은 문장: 7개</div>
                <div class="risk-item warning">유의해야할 문장: 2개</div>
            </div>
            
            <h4>주요 발견사항</h4>
            <ul>
                <li>개인정보 수집 범위가 명확하게 명시되어 있음</li>
                <li>데이터 보관 기간에 대한 설명 필요</li>
                <li>제3자 제공 조건을 확인하세요</li>
            </ul>
        </div>
    `;
}

function showLogin() {
    alert('로그인 페이지로 이동합니다.');
}

function showSettings() {
    alert('설정 페이지로 이동합니다.');
}

// 텍스트 입력 영역 실시간 높이 조절
const textarea = document.querySelector('.text-input');
textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.max(200, this.scrollHeight) + 'px';
});