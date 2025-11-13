import { useEffect } from "react";

export const useHamburgerMenu = () => {
  useEffect(() => {
    const hamburgerIcon = document.getElementById("nav-icon2");
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const header = document.querySelector("header");

    const handleHamburgerClick = () => {
      if (!hamburgerIcon || !hamburgerMenu || !header) return;
      hamburgerIcon.classList.toggle("open");
      hamburgerMenu.classList.toggle("show");
      header.classList.toggle("menu-open");
    };

    const handleDocumentClick = (event) => {
      if (!hamburgerIcon || !hamburgerMenu || !header) return;
      if (
        !hamburgerIcon.contains(event.target) &&
        !hamburgerMenu.contains(event.target)
      ) {
        hamburgerIcon.classList.remove("open");
        hamburgerMenu.classList.remove("show");
        header.classList.remove("menu-open");
      }
    };

    if (hamburgerIcon) {
      hamburgerIcon.addEventListener("click", handleHamburgerClick);
    }
    document.addEventListener("click", handleDocumentClick);

    return () => {
      if (hamburgerIcon)
        hamburgerIcon.removeEventListener("click", handleHamburgerClick);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
};
