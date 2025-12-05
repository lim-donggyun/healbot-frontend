import { useEffect } from "react";

export const useScrollNavigation = () => {
  useEffect(() => {
    let currentSection = 0;
    let isScrolling = false;

    const sections = document.querySelectorAll(".section");
    const footer = document.getElementById("footer");
    const allScrollSections = footer ? [...sections, footer] : [...sections];
    const scrollToTopBtn = document.querySelector(".scroll-to-top");
    const header = document.querySelector("header");
    const mainSection = document.getElementById("main");
    const searchSection = document.getElementById("search");

    // 맨 위 버튼 표시/숨김
    function updateScrollToTopButton(index) {
      if (!scrollToTopBtn) return;
      if (index > 0) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    }

    // 섹션 단위 스크롤
    function scrollToSectionSmooth(index) {
      if (index < 0 || index >= allScrollSections.length) return;
      isScrolling = true;
      currentSection = index;

      allScrollSections[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      updateScrollToTopButton(index);

      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }

    // 휠로 섹션 이동
    const handleWheel = (e) => {
      // 모달이 열려있으면 스크롤 막기
      if (document.body.classList.contains('modal-open')) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      if (isScrolling) return;

      if (e.deltaY > 0 && currentSection < allScrollSections.length - 1) {
        scrollToSectionSmooth(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        scrollToSectionSmooth(currentSection - 1);
      }
    };

    // 키보드 스크롤 완전 차단
    const handleKeyDown = (e) => {
      // 스크롤 관련 키보드 입력 차단
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    // 맨 위로 버튼 클릭
    const handleScrollToTop = () => {
      scrollToSectionSmooth(0);
    };

    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener("click", handleScrollToTop);
    }

    // 스크롤 시 헤더 색상 및 섹션 위치 감지
    const handleScroll = () => {
      if (!mainSection || !searchSection || !header) return;

      const searchSectionEnd =
        searchSection.offsetTop + searchSection.offsetHeight;

      if (window.scrollY >= searchSectionEnd - 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      if (isScrolling) return;

      let current = 0;
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      allScrollSections.forEach((section, index) => {
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const checkPosition = scrollPosition + windowHeight / 2;

        if (
          checkPosition >= sectionTop &&
          checkPosition < sectionTop + sectionHeight
        ) {
          current = index;
        }
      });

      if (scrollPosition + windowHeight >= documentHeight - 50) {
        current = allScrollSections.length - 1;
      }

      updateScrollToTopButton(current);
      currentSection = current;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (scrollToTopBtn)
        scrollToTopBtn.removeEventListener("click", handleScrollToTop);
    };
  }, []);
};
