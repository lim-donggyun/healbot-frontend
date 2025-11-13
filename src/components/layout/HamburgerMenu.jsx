import React from "react";

const menuData = [
  {
    title: "고객지원",
    items: [
      { label: "FAQ", href: "/faq" },
      { label: "고객센터", href: "/customer-service" },
      { label: "1:1 문의", href: "/inquiry" },
    ],
  },
  {
    title: "서비스",
    items: [
      { label: "서비스 소개", href: "/about" },
      { label: "공지사항", href: "/notice" },
      { label: "이벤트", href: "/event" },
    ],
  },
  {
    title: "정보",
    items: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
      { label: "제휴 문의", href: "/partners" },
    ],
  },
];

function HamburgerMenu() {
  return (
    <div className="hamburger-menu" id="hamburgerMenu">
      <div className="hamburger-menu-content">
        {menuData.map((column, index) => (
          <div key={index} className="hamburger-menu-column">
            <div className="hamburger-menu-title">{column.title}</div>
            {column.items.map((item, itemIndex) => (
              <a key={itemIndex} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HamburgerMenu;
