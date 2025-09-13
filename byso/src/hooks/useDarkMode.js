import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 페이지 로드 시 저장된 다크모드 설정 확인
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const darkModeEnabled = savedTheme === 'true';
      setIsDarkMode(darkModeEnabled);
      updateBodyClass(darkModeEnabled);
    }
  }, []);

  // 다크모드 변경 시 body 클래스와 localStorage 업데이트
  const updateBodyClass = (darkMode) => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.style.background = '#121212';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.style.background = '';
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    updateBodyClass(newDarkMode);
  };

  // 다크모드 색상 반환 함수
  const getColors = () => {
    if (isDarkMode) {
      return {
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        cardBackground: "rgba(40, 40, 40, 0.9)",
        sidebarHeaderBg: "#333333",
        buttonBg: "#4a5568",
        buttonHoverBg: "#2d3748",
        textPrimary: "#ffffff",
        textSecondary: "#a0a0a0",
        border: "#404040",
        modalBg: "#2d2d2d"
      };
    } else {
      return {
        background: "linear-gradient(135deg, #a8e6cf 0%, #f5deb3 100%)",
        cardBackground: "rgba(255, 255, 255, 0.9)",
        sidebarHeaderBg: "#90c695",
        buttonBg: "#8fbc8f",
        buttonHoverBg: "#7ba67b",
        textPrimary: "#2d4a2d",
        textSecondary: "#666666",
        border: "#f0f0f0",
        modalBg: "#ffffff"
      };
    }
  };

  return {
    isDarkMode,
    toggleDarkMode,
    colors: getColors()
  };
};