import React, { useEffect } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import "./Terms.css";

function Terms() {
  useEffect(() => {
    // 드래그 방지
    document.body.style.setProperty('user-select', 'none', 'important');
    document.body.style.setProperty('-webkit-user-select', 'none', 'important');
  }, []);

  return (
    <div className="terms-page-wrapper">
      <Header />
      <div className="page">
        <h1>이용약관</h1>
        <div className="terms-updated">최종 수정일: 2025년 1월 1일</div>

        <section className="terms-section">
          <h2>제1조 (목적)</h2>
          <p>
            본 약관은 HealBot(이하 "회사")이 제공하는 의료 정보 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자
            간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="terms-section">
          <h2>제2조 (용어의 정의)</h2>
          <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
          <ol>
            <li>"서비스"란 회사가 제공하는 모든 온라인 의료 정보 제공 서비스를 의미합니다.</li>
            <li>"회원"이란 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 의미합니다.</li>
            <li>
              "아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 문자와 숫자의 조합을
              의미합니다.
            </li>
            <li>
              "비밀번호"란 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 비밀보호를 위해 회원 자신이 설정한 문자
              또는 숫자의 조합을 의미합니다.
            </li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제3조 (약관의 효력 및 변경)</h2>
          <ol>
            <li>본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.</li>
            <li>
              회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 안에서 본 약관을 변경할 수 있습니다.
            </li>
            <li>
              회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스 초기화면에 그
              적용일자 7일 이전부터 공지합니다.
            </li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제4조 (이용계약의 체결)</h2>
          <ol>
            <li>
              이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 본 약관의 내용에 동의를 한 다음 회원가입신청을 하고
              회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
            </li>
            <li>
              회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:
              <ul>
                <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제5조 (서비스의 제공)</h2>
          <ol>
            <li>
              회사는 다음과 같은 서비스를 제공합니다:
              <ul>
                <li>증상 검색 및 의료 정보 제공</li>
                <li>병원 및 응급실 위치 정보 제공</li>
                <li>건강 정보 및 질병 백과</li>
                <li>커뮤니티 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
            </li>
            <li>회사는 서비스를 일정범위로 분할하여 각 범위별로 이용가능시간을 별도로 지정할 수 있습니다.</li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제6조 (서비스의 중단)</h2>
          <p>
            회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우
            서비스의 제공을 일시적으로 중단할 수 있습니다. 이 경우 회사는 사전 또는 사후에 이를 공지합니다.
          </p>
        </section>

        <section className="terms-section">
          <h2>제7조 (회원의 의무)</h2>
          <ol>
            <li>
              회원은 다음 행위를 하여서는 안 됩니다:
              <ul>
                <li>신청 또는 변경 시 허위내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제8조 (의료 정보의 한계)</h2>
          <ol>
            <li>
              본 서비스에서 제공하는 모든 정보는 일반적인 의료 정보 제공을 목적으로 하며, 의사의 진단이나 치료를 대체할
              수 없습니다.
            </li>
            <li>
              회원은 본 서비스의 정보를 참고자료로만 활용해야 하며, 정확한 진단 및 치료는 반드시 의료 전문가와 상담해야
              합니다.
            </li>
            <li>
              회사는 서비스에서 제공하는 정보의 정확성, 완전성, 신뢰성에 대해 최선을 다하나, 이에 대한 법적 책임을 지지
              않습니다.
            </li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제9조 (저작권의 귀속 및 이용제한)</h2>
          <ol>
            <li>회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</li>
            <li>
              회원은 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제,
              송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
            </li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제10조 (분쟁해결)</h2>
          <ol>
            <li>
              회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를
              설치·운영합니다.
            </li>
            <li>
              회사와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 공정거래위원회
              또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
            </li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제11조 (재판권 및 준거법)</h2>
          <ol>
            <li>회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 서울중앙지방법원을 관할법원으로 합니다.</li>
            <li>회사와 이용자 간에 제기된 전자상거래 소송에는 대한민국법을 적용합니다.</li>
          </ol>
        </section>

        <div className="terms-footer">
          <p>문의사항이 있으시면 고객센터로 연락 주시기 바랍니다.</p>
          <p>이메일: healbot.official@gmail.com | 전화: 1588-0000</p>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Terms;
