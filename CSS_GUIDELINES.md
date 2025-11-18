# CSS 가이드라인 (메인페이지 기준)

## 1. 색상 팔레트

### Primary Colors
- **Primary Blue**: `#3284b1` (메인 브랜드 색상)
- **Secondary Blue**: `#3fc1ec` (강조 및 액센트)
- **White**: `#ffffff`

### Background Colors
- **Background Gray**: `#f8f9fa`, `#e9ecef`
- **Light Gray**: `#f1f1f1`
- **Medium Gray**: `#e0e0e0`, `#ddd`, `#f0f0f0`
- **Dark Gray**: `#2d2d2d`, `#444`

### Text Colors
- **Main Text**: `#333`
- **Secondary Text**: `#666`, `#555`
- **Light Text**: `#999`, `#aaa`, `#888`

### Border Colors
- **Default**: `#e0e0e0`, `#ddd`, `#f0f0f0`
- **Transparent**: `rgba(255, 255, 255, 0.2)`, `rgba(0, 0, 0, 0.1)`

### Special Colors
- **Error/Emergency**: `#dc3545`, `#c82333`, `#ff6b6b`
- **Accent Light Blue**: `#c3efff`, `#e3f2fd`, `#bbdefb`, `#90caf9`
- **Success/Highlight**: `#ffd43b` (별 아이콘)

---

## 2. 타이포그래피

### Font Family
```css
/* Primary Font */
font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;

/* Special Font (SeoulHangang) */
@font-face {
  font-family: "SeoulHangang";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/SeoulHangangM.woff") format("woff");
  font-weight: normal;
  font-display: swap;
}
font-family: "SeoulHangang", "Malgun Gothic", sans-serif;
```

### Font Sizes
| 용도 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| Hero (H1) | `56px` | `42px` | `32px` → `24px` |
| Section Title (H2) | `38px`, `36px` | `32px` | `28px` → `22px` |
| Subsection (H3) | `20px`, `18px`, `16px` | - | - |
| Body Large | `22px`, `18px` | `18px` | `16px` → `14px` |
| Body Medium | `16px`, `15px` | `15px` | `14px` |
| Body Small | `14px`, `13px` | - | - |

### Font Weights
- **Normal**: `400`, `500`
- **Semi-bold**: `600`
- **Bold**: `700`

### Letter Spacing
- **제목**: `-1px`
- **본문**: `-0.5px`
- **기본**: `normal`

### Line Height
- **Body**: `1.6`, `1.8`
- **Default**: `1`

---

## 3. 레이아웃

### Container Max-Width
- **Extra Large**: `1600px` (헤더)
- **Large**: `1400px` (드롭다운, 햄버거 메뉴)
- **Medium**: `1250px` (검색 섹션)
- **Standard**: `1200px` (일반 섹션)
- **Small**: `1100px` (신체 부위 그리드)

### Width Convention
```css
width: 90%;
max-width: 1200px;
margin: 0 auto;
```

### Section Structure
```css
.section {
  height: 100vh; /* 기본 전체 화면 높이 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* 콘텐츠가 많은 섹션 */
.section-search {
  position: relative;
  padding: 150px 0 80px 0;
  min-height: 100vh;
  height: auto;
}
```

### Section Padding
- **Standard**: `100px 0 40px 0` (상단 100px, 하단 40px)
- **Header**: `25px 50px`
- **Small Screen**: `20px 30px` → `15px 20px` → `12px 15px`

### Box Model
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

---

## 4. 간격(Spacing) 시스템

### Gap Sizes
```css
gap: 10px;  /* Extra small */
gap: 12px;  /* Small */
gap: 15px;  /* Small-medium */
gap: 20px;  /* Medium */
gap: 25px;  /* Medium-large */
gap: 30px;  /* Large */
gap: 40px;  /* Extra large */
gap: 50px;  /* XXL */
```

### Padding Scale
- **Micro**: `8px`, `10px`
- **Small**: `12px`, `14px`, `16px`
- **Medium**: `20px`, `25px`, `30px`
- **Large**: `35px`, `40px`, `45px`
- **Extra Large**: `50px`

### Margin Convention
- 일관된 간격 사용
- 상하 마진: `12px`, `15px`, `18px`, `20px`, `24px`, `30px`, `40px`

---

## 5. Border & Radius

### Border Width
```css
border: 1px solid;  /* Default */
border: 2px solid;  /* Emphasis */
border: 3px solid;  /* Strong emphasis */
```

### Border Radius
| 용도 | Radius |
|------|--------|
| Subtle | `4px` |
| Small | `8px` |
| Medium | `10px`, `12px` |
| Large | `14px`, `16px` |
| Tags/Pills | `20px`, `35px` |
| Circle | `50%` |

### Border Patterns
```css
/* Transparent borders for hover effects */
border: 2px solid transparent;

/* Active state */
border: 2px solid #3fc1ec;
```

---

## 6. 그림자(Shadow)

### Shadow Scale
```css
/* Light - Subtle elevation */
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);

/* Medium - Cards and dropdowns */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

/* Heavy - Modals and overlays */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Extra Heavy - Prominent elements */
box-shadow: 0 10px 30px rgba(63, 193, 236, 0.2);

/* Accent - Interactive highlights */
box-shadow: 0 5px 15px rgba(63, 193, 236, 0.3);
box-shadow: 0 4px 12px rgba(63, 193, 236, 0.35);
box-shadow: 0 6px 18px rgba(63, 193, 236, 0.5);

/* Glow effect */
box-shadow: 0 0 0 3px rgba(63, 193, 236, 0.1);
```

### Scroll to Top Button Shadow
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
/* Hover */
box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
```

---

## 7. Transition & Animation

### Transition Duration
- **Fast**: `0.15s`, `0.2s`
- **Standard**: `0.25s`, `0.3s`
- **Slow**: `0.5s`

### Easing Functions
```css
transition: all 0.3s ease;
transition: all 0.25s ease-in-out;
transition: opacity 0.15s ease;
transition: all 0.2s;
```

### Common Patterns
```css
/* Standard transition */
transition: all 0.3s;

/* Multiple properties */
transition: background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s;

/* Specific property */
transition: transform 0.3s ease;
transition: opacity 0.3s;
```

### Custom Animations
```css
/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
animation: spin 0.8s linear infinite;

/* Slide down */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slideDown 0.3s ease-out;

/* Pop in */
@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
animation: popIn 0.2s ease-out;
```

---

## 8. 그리드 시스템

### Grid Template Columns

#### Departments/Cards Grid
```css
/* Desktop */
grid-template-columns: repeat(3, 1fr);
gap: 25px;

/* Tablet (≤1400px, ≤992px) */
grid-template-columns: repeat(2, 1fr);

/* Mobile (≤768px) */
grid-template-columns: 1fr;
```

#### Symptom Categories
```css
/* Desktop */
grid-template-columns: repeat(5, 1fr);
gap: 10px;

/* Tablet (≤1200px) */
grid-template-columns: repeat(4, 1fr);

/* Medium (≤992px) */
grid-template-columns: repeat(3, 1fr);

/* Small (≤768px) */
grid-template-columns: repeat(2, 1fr);

/* Mobile (≤480px) */
grid-template-columns: 1fr;
```

#### Body Parts Grid
```css
/* Desktop */
grid-template-columns: repeat(9, 1fr);
gap: 10px;

/* Tablet (≤1200px) */
grid-template-columns: repeat(4, 1fr);

/* Medium (≤992px) */
grid-template-columns: repeat(3, 1fr);

/* Small (≤768px) */
grid-template-columns: repeat(2, 1fr);
```

#### Footer Grid
```css
/* Desktop */
grid-template-columns: 2fr 1fr 1fr 1fr;
gap: 50px;

/* Mobile (≤768px) */
grid-template-columns: 1fr;
gap: 30px;
```

#### Info Container
```css
/* Desktop */
grid-template-columns: 1fr 1fr;
gap: 30px;

/* Mobile (≤992px) */
grid-template-columns: 1fr;
```

#### Health Cards
```css
/* Desktop */
grid-template-columns: repeat(2, 1fr);
gap: 20px;

/* Mobile (≤480px) */
grid-template-columns: 1fr;
```

#### Symptom Selection
```css
grid-template-columns: 400px 1fr;
gap: 30px;
```

#### Checkbox/Popover Items
```css
grid-template-columns: repeat(3, 1fr);
gap: 10px-12px;
```

---

## 9. 상호작용 패턴

### Hover Effects

#### Card Lift
```css
.card:hover {
  transform: translateY(-2px);
  /* or */
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(63, 193, 236, 0.2);
}
```

#### Scale Up
```css
.element:hover {
  transform: scale(1.03);
  /* or */
  transform: scale(1.1);
}
```

#### Color Change
```css
.nav-link:hover {
  color: #3284b1;
}

.button:hover {
  background: #3fc1ec;
  border-color: #3fc1ec;
}
```

#### Combined Effects
```css
.card:hover {
  border-color: #3fc1ec;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(63, 193, 236, 0.3);
}
```

#### Slide Effect
```css
.dropdown-menu {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.15s ease, visibility 0.15s ease, transform 0.15s ease;
}

.nav-item:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

#### Underline Animation
```css
.button::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #3fc1ec;
  transition: width 0.3s;
}

.button:hover::after {
  width: 100%;
}
```

#### Icon Animation
```css
/* Arrow rotation */
.expand-icon {
  transition: transform 0.3s;
}

.active .expand-icon {
  transform: rotate(180deg);
}

/* Logout door animation */
.door {
  transition: transform 0.3s ease;
}

.logout-icon-btn:hover .door {
  transform: rotateY(-120deg);
}
```

### Active States
```css
.item.active {
  background: #c3efff;
  border: 2px solid #3fc1ec;
  color: #3284b1;
  font-weight: 700;
  box-shadow: 0 0 0 3px rgba(63, 193, 236, 0.1);
}

/* Check mark indicator */
.item.active::before {
  content: "✓";
  position: absolute;
  left: 8px-12px;
  font-size: 16px;
  font-weight: bold;
  color: #3fc1ec;
}
```

### Focus States
```css
.input:focus {
  outline: none;
  border-color: #3fc1ec;
  border-width: 3px;
}
```

### Disabled States
```css
.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## 10. 버튼 스타일

### Primary Button
```css
.slide-btn {
  padding: 16px 48px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}

.slide-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #3284b1;
  border-color: white;
  transform: translateY(-2px);
}
```

### Gradient Button (Highlight)
```css
.highlight-link {
  background: linear-gradient(135deg, #3fc1ec 0%, #3284b1 100%);
  color: white;
  font-weight: 700;
  padding: 12px 18px;
  border-radius: 0px;
  box-shadow: 0 4px 12px rgba(63, 193, 236, 0.35);
  transition: all 0.3s ease;
}

.highlight-link:hover {
  transform: translateX(5px) translateY(-2px);
  box-shadow: 0 6px 18px rgba(63, 193, 236, 0.5);
  background: linear-gradient(135deg, #3284b1 0%, #3fc1ec 100%);
}
```

### Text Button
```css
.search-submit-btn {
  padding: 0;
  background: transparent;
  color: #3284b1;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.search-submit-btn::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #3fc1ec;
  transition: width 0.3s;
}

.search-submit-btn:hover::after {
  width: 100%;
}
```

### Icon Button
```css
.icon-btn {
  width: 36px-50px;
  height: 36px-50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.6);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  transform: scale(1.1);
}
```

### Category/Tag Button
```css
.category-btn {
  padding: 13px 14px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.category-btn:hover {
  border-color: #3fc1ec;
  background: #c3efff;
  color: #3284b1;
}

.category-btn.active {
  background: #3fc1ec;
  border-color: #3fc1ec;
  color: white;
}
```

### Quick Link Button
```css
.quick-link-btn {
  padding: 10px 22px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-link-btn:hover {
  border-color: #3fc1ec;
  color: #3284b1;
  background: #c3efff;
  transform: translateY(-2px);
}
```

### Tab Button
```css
.tab-btn {
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.tab-btn:hover {
  color: #3284b1;
  border-bottom-color: rgba(63, 193, 236, 0.3);
}

.tab-btn.active {
  color: #3284b1;
  border-bottom-color: #3fc1ec;
  background: linear-gradient(to top, rgba(63, 193, 236, 0.05), transparent);
}
```

---

## 11. 헤더 특징

### Fixed Header
```css
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: transparent;
  padding: 25px 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  height: 100px;
}
```

### State Changes
```css
/* Hover state */
header:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* Menu open state */
header.menu-open {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
```

### Logo Switching
```css
.logo-white {
  display: block;
}

.logo-black {
  display: none;
}

header:hover .logo-white,
header.scrolled .logo-white,
header.menu-open .logo-white {
  display: none;
}

header:hover .logo-black,
header.scrolled .logo-black,
header.menu-open .logo-black {
  display: block;
}
```

### Navigation Color Transitions
```css
/* Default */
.nav-link {
  color: white;
}

/* Hover/Scrolled */
header:hover .nav-link,
header.scrolled .nav-link {
  color: #333;
}

header:hover .nav-link:hover,
header.scrolled .nav-link:hover {
  color: #3284b1;
}
```

---

## 12. 스크롤바 커스터마이징

### Standard Scrollbar
```css
/* Webkit browsers (Chrome, Safari, Edge) */
.element::-webkit-scrollbar {
  width: 8px;
}

.element::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.element::-webkit-scrollbar-thumb {
  background: #3fc1ec;
  border-radius: 10px;
}

.element::-webkit-scrollbar-thumb:hover {
  background: #3284b1;
}
```

### Small Scrollbar
```css
.element::-webkit-scrollbar {
  width: 6px;
}
```

### Hide Scrollbar (MainPage only)
```css
html:has(.main-page),
body:has(.main-page) {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

html:has(.main-page)::-webkit-scrollbar,
body:has(.main-page)::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
```

### Overscroll Behavior
```css
.scrollable-element {
  overscroll-behavior: contain;
}
```

---

## 13. 반응형 브레이크포인트

### Breakpoint Scale
```css
/* Extra Large Desktop */
@media (max-width: 1400px) {
  /* Layout adjustments */
}

/* Large Desktop */
@media (max-width: 1200px) {
  /* Navigation spacing reduction */
}

/* Medium Tablet/Desktop */
@media (max-width: 992px) {
  /* Medium screen optimization */
}

/* Tablet */
@media (max-width: 768px) {
  /* Vertical layout, simplified navigation */
}

/* Mobile */
@media (max-width: 480px) {
  /* Single column, stacked elements */
}
```

### Key Responsive Patterns

#### Container Width Reduction
```css
@media (max-width: 1400px) {
  .header-wrapper {
    max-width: 1200px;
  }
}
```

#### Grid Column Reduction
```css
/* 3 columns → 2 columns → 1 column */
@media (max-width: 1400px) {
  .departments-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .departments-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Spacing Reduction
```css
@media (max-width: 1200px) {
  nav {
    gap: 25px; /* from 50px */
  }
}

@media (max-width: 992px) {
  nav {
    gap: 20px;
  }
}
```

#### Font Size Scaling
```css
@media (max-width: 992px) {
  .slide h1 {
    font-size: 42px; /* from 56px */
  }
}

@media (max-width: 768px) {
  .slide h1 {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .slide h1 {
    font-size: 24px;
  }
}
```

---

## 14. 배경 이미지 패턴

### Parallax Background
```css
.section {
  position: relative;
}

.section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("image.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Parallax effect */
  opacity: 0.5;
  z-index: -1;
}
```

### Fixed Background (Section 1)
```css
.section-main {
  background: url("image.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  text-align: center;
}
```

### Gradient Backgrounds
```css
/* Card gradient */
background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);

/* Button gradient */
background: linear-gradient(135deg, #3fc1ec 0%, #3284b1 100%);

/* Hover gradient reverse */
background: linear-gradient(135deg, #3284b1 0%, #3fc1ec 100%);

/* Subtle hover */
background: linear-gradient(90deg, rgba(63, 193, 236, 0.1) 0%, rgba(63, 193, 236, 0.05) 100%);

/* Tab gradient */
background: linear-gradient(to top, rgba(63, 193, 236, 0.05), transparent);
```

---

## 15. 접근성 & UX

### Smooth Scrolling
```css
html {
  overflow-y: auto;
  scroll-behavior: smooth;
}
```

### Cursor Indicators
```css
.interactive-element {
  cursor: pointer;
}

.disabled-element {
  cursor: not-allowed;
}
```

### Minimum Touch Target
```css
/* 최소 터치 영역: 44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

### Focus States
```css
.input:focus {
  outline: none;
  border-color: #3fc1ec;
}

.button:focus {
  outline: 2px solid #3fc1ec;
  outline-offset: 2px;
}
```

### Backdrop Filter (Glassmorphism)
```css
.element {
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.1);
}

.scroll-to-top {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.85);
}
```

### Pointer Events Control
```css
.dropdown-menu {
  pointer-events: none;
}

.nav-item:hover .dropdown-menu {
  pointer-events: auto;
}
```

### Loading States
```css
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

---

## 16. 특수 컴포넌트 패턴

### Tag/Chip Component
```css
.symptom-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 8px 14px;
  background: #e3f2fd;
  color: #3284b1;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid #bbdefb;
}

.symptom-tag::before {
  content: "•";
  font-size: 18px;
  color: #3fc1ec;
}
```

### Hamburger Menu Animation
```css
#nav-icon2 span {
  display: block;
  position: absolute;
  height: 5px;
  width: 50%;
  background: white;
  transition: 0.25s ease-in-out;
}

#nav-icon2.open span:nth-child(1),
#nav-icon2.open span:nth-child(6) {
  transform: rotate(45deg);
}
```

### Expanding Search Input
```css
.header-search-input {
  width: 28px;
  height: 28px;
  padding: 10px;
  border: solid 3px white;
  border-radius: 35px;
  transition: all 0.5s;
  background: transparent;
}

.header-search-input:focus {
  width: 250px;
  background: white;
  color: #333;
  border-color: #3fc1ec;
  padding-left: 15px;
}
```

### Card Hover with Border Animation
```css
.card {
  border: 2px solid transparent;
  transition: all 0.3s;
}

.card:hover {
  border-color: #3fc1ec;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(63, 193, 236, 0.2);
}
```

---

## 17. 사용 예시

### 새로운 카드 컴포넌트 생성
```css
.my-card {
  /* Layout */
  padding: 25px;
  border-radius: 12px;

  /* Colors */
  background: white;
  color: #333;
  border: 2px solid transparent;

  /* Effects */
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  cursor: pointer;
}

.my-card:hover {
  border-color: #3fc1ec;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(63, 193, 236, 0.2);
}
```

### 새로운 버튼 생성
```css
.my-button {
  /* Layout */
  padding: 12px 24px;
  border-radius: 8px;

  /* Typography */
  font-size: 15px;
  font-weight: 600;

  /* Colors */
  background: #3fc1ec;
  color: white;
  border: 2px solid #3fc1ec;

  /* Interaction */
  cursor: pointer;
  transition: all 0.3s;
}

.my-button:hover {
  background: #3284b1;
  border-color: #3284b1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(63, 193, 236, 0.35);
}
```

### 새로운 섹션 생성
```css
.my-section {
  /* Layout */
  position: relative;
  padding: 100px 0 40px 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Background overlay */
.my-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("image.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0.5;
  z-index: -1;
}

.my-section-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}
```

---

## 18. 서브 페이지 헤더 스타일 오버라이드

메인 페이지가 아닌 서브 페이지(로그인, 회원가입, 검색 결과 등)에서는 헤더 스타일을 오버라이드해야 합니다.

### 기본 패턴
```css
/* 페이지 래퍼 - 고유한 클래스명 사용 */
.my-page-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
}

/* 헤더 배경을 흰색으로 오버라이드 */
.my-page-wrapper header {
  background: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

/* 로고 색상 변경 (흰색 숨기고 검정색 표시) */
.my-page-wrapper .logo-white {
  display: none !important;
}

.my-page-wrapper .logo-black {
  display: block !important;
}

/* 네비게이션 링크 색상 */
.my-page-wrapper .nav-link {
  color: #333 !important;
}

.my-page-wrapper .nav-link:hover {
  color: #3284b1 !important;
}

/* 유틸리티 버튼 (긴급 제외) */
.my-page-wrapper .utility-btn:not(.emergency-btn) {
  color: #333 !important;
}

.my-page-wrapper .utility-btn:not(.emergency-btn):hover {
  color: #3284b1 !important;
}

/* 구분선 */
.my-page-wrapper .utility-divider {
  background: rgba(0, 0, 0, 0.2) !important;
}

/* 검색 아이콘 화살표 */
.my-page-wrapper .header-search-container:after {
  background: #333 !important;
}

/* 검색 입력창 */
.my-page-wrapper .header-search-input {
  color: #333 !important;
  border-color: #333 !important;
}

/* 햄버거 메뉴 */
.my-page-wrapper #nav-icon2 span {
  background: #333 !important;
}
```

### 페이지 컨테이너 기본 구조
```css
/* 페이지 컨테이너 */
.my-page-container {
  min-height: 800px;
  padding-top: 140px; /* 헤더 높이 + 여백 */
  padding-bottom: 60px;
}
```

### 실제 사용 예시

#### 로그인 페이지
```css
.login-page-wrapper {
  min-height: 100vh;
  background: #f5f5f5;
}

.login-page-wrapper header {
  background: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.login-page-wrapper .logo-white {
  display: none !important;
}

.login-page-wrapper .logo-black {
  display: block !important;
}

.login-page-wrapper .page {
  min-height: 800px;
  padding-top: 200px;
  padding: 40px 20px;
}
```

#### 질병 검색 결과 페이지
```css
.disease-result-page-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
}

.disease-result-page-wrapper header {
  background: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.disease-result-page-container {
  min-height: 800px;
  padding-top: 140px;
  padding-bottom: 60px;
}
```

### 중요 사항
1. **Wrapper 클래스 필수**: 모든 헤더 오버라이드는 페이지 고유 wrapper 클래스 내에서 적용
2. **!important 사용**: 메인 페이지의 기본 스타일을 확실히 덮어쓰기 위해 필요
3. **긴급 버튼 제외**: `.emergency-btn`은 항상 빨간색 유지
4. **Padding-top**: 헤더 높이(100px) + 여백(40px~)을 고려하여 설정

---

## 마무리

이 가이드라인은 메인페이지 및 서브 페이지 CSS를 기반으로 작성되었습니다. 새로운 컴포넌트나 페이지를 만들 때 이 규칙을 따르면 플랫폼 전체에서 일관된 디자인과 사용자 경험을 유지할 수 있습니다.

### 핵심 원칙
1. **일관성**: 정의된 색상, 간격, 폰트 크기 사용
2. **반응형**: 모든 브레이크포인트 고려
3. **접근성**: 최소 터치 영역, focus states 구현
4. **성능**: 효율적인 transition과 animation 사용
5. **유지보수성**: 명확한 클래스명과 구조화된 CSS
6. **헤더 오버라이드**: 서브 페이지에서는 헤더 스타일을 적절히 오버라이드
