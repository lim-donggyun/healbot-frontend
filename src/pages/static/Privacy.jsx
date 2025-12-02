import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import "./Privacy.css";

function Privacy() {
  return (
    <div className="privacy-page-wrapper">
      <Header />
      <div className="page">
        <h1>개인정보처리방침</h1>
        <div className="privacy-updated">최종 수정일: 2025년 1월 1일</div>

        <section className="privacy-section">
          <h2>제1조 (개인정보의 처리 목적)</h2>
          <p>
            HealBot(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적
            이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할
            예정입니다.
          </p>
          <ol>
            <li>
              <strong>회원 가입 및 관리</strong>: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격
              유지·관리, 서비스 부정이용 방지
            </li>
            <li>
              <strong>서비스 제공</strong>: 맞춤형 의료정보 제공, 증상 검색 서비스, 병원 정보 제공, 커뮤니티 서비스 제공
            </li>
            <li>
              <strong>고충처리</strong>: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보
            </li>
            <li>
              <strong>마케팅 및 광고</strong>: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및
              참여기회 제공
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제2조 (처리하는 개인정보의 항목)</h2>
          <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>

          <div className="privacy-subsection">
            <h3>1. 필수항목</h3>
            <ul>
              <li>회원가입 시: 이메일 주소, 비밀번호, 이름, 생년월일, 성별, 휴대전화번호</li>
              <li>서비스 이용 시: 증상 검색 기록, 병원 검색 기록, 관심 질병 정보</li>
              <li>커뮤니티 이용 시: 게시글, 댓글 내용</li>
            </ul>
          </div>

          <div className="privacy-subsection">
            <h3>2. 선택항목</h3>
            <ul>
              <li>추가 프로필 정보: 프로필 사진, 주소</li>
              <li>건강 정보: 기저질환, 복용 중인 약물 (선택 시)</li>
            </ul>
          </div>

          <div className="privacy-subsection">
            <h3>3. 자동으로 수집되는 항목</h3>
            <ul>
              <li>접속 로그, IP 주소, 쿠키, 서비스 이용 기록, 불량 이용 기록</li>
              <li>기기 정보: 모바일 기기 정보, OS 버전, 브라우저 정보</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <h2>제3조 (개인정보의 처리 및 보유기간)</h2>
          <ol>
            <li>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
              보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </li>
            <li>
              각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
              <ul>
                <li>
                  <strong>회원 정보</strong>: 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인
                  경우에는 해당 수사·조사 종료 시까지)
                </li>
                <li>
                  <strong>서비스 이용 기록</strong>: 3년
                </li>
                <li>
                  <strong>결제 정보</strong>: 전자상거래법에 따라 5년
                </li>
                <li>
                  <strong>소비자 불만 또는 분쟁처리 기록</strong>: 3년
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제4조 (개인정보의 제3자 제공)</h2>
          <p>
            회사는 원칙적으로 이용자의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며,
            이용자의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
          </p>
          <p>다만, 다음의 경우에는 예외로 합니다:</p>
          <ol>
            <li>이용자가 사전에 동의한 경우</li>
            <li>
              법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제5조 (개인정보처리의 위탁)</h2>
          <p>회사는 서비스 향상을 위해 다음과 같이 개인정보 처리업무를 외부 전문업체에 위탁하여 운영하고 있습니다:</p>
          <table className="privacy-table">
            <thead>
              <tr>
                <th>수탁업체</th>
                <th>위탁업무 내용</th>
                <th>보유 및 이용기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AWS (Amazon Web Services)</td>
                <td>클라우드 서버 호스팅</td>
                <td>회원탈퇴 시 또는 위탁계약 종료 시</td>
              </tr>
              <tr>
                <td>NHN Cloud</td>
                <td>SMS 발송 서비스</td>
                <td>회원탈퇴 시 또는 위탁계약 종료 시</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="privacy-section">
          <h2>제6조 (정보주체의 권리·의무 및 행사방법)</h2>
          <ol>
            <li>
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
              <ul>
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
            </li>
            <li>
              제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해
              지체 없이 조치하겠습니다.
            </li>
            <li>
              정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할
              때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제7조 (개인정보의 파기)</h2>
          <ol>
            <li>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당
              개인정보를 파기합니다.
            </li>
            <li>
              개인정보 파기의 절차 및 방법은 다음과 같습니다:
              <ul>
                <li>
                  <strong>파기절차</strong>: 파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호책임자의 승인을 받아
                  개인정보를 파기합니다.
                </li>
                <li>
                  <strong>파기방법</strong>: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
                  종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제8조 (개인정보의 안전성 확보조치)</h2>
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
          <ol>
            <li>
              <strong>관리적 조치</strong>: 내부관리계획 수립·시행, 정기적 직원 교육
            </li>
            <li>
              <strong>기술적 조치</strong>: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 개인정보의
              암호화, 보안프로그램 설치
            </li>
            <li>
              <strong>물리적 조치</strong>: 전산실, 자료보관실 등의 접근통제
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부)</h2>
          <ol>
            <li>
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를
              사용합니다.
            </li>
            <li>
              쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자의
              PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
            </li>
            <li>
              쿠키 설정 거부 방법: 웹브라우저 옵션 설정을 통해 쿠키 허용, 쿠키 차단 등의 설정을 할 수 있습니다.
              <ul>
                <li>Chrome: 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터</li>
                <li>Edge: 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제10조 (개인정보 보호책임자)</h2>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제
            등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
          </p>
          <div className="contact-box">
            <h3>개인정보 보호책임자</h3>
            <ul>
              <li>성명: 홍길동</li>
              <li>직책: 개인정보보호팀장</li>
              <li>연락처: healbot.official@gmail.com</li>
              <li>전화번호: 1588-0000</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <h2>제11조 (개인정보 처리방침 변경)</h2>
          <ol>
            <li>이 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다.</li>
            <li>이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.</li>
          </ol>
        </section>

        <div className="privacy-footer">
          <p>개인정보 관련 문의사항이 있으시면 개인정보 보호책임자에게 연락 주시기 바랍니다.</p>
          <p>이메일: healbot.official@gmail.com | 전화: 1588-0000</p>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Privacy;
