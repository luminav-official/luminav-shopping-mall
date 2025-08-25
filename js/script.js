document.addEventListener('DOMContentLoaded', function() {
    
    // --- 기존 부드러운 스크롤 기능 ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // 모달을 여는 버튼은 스크롤 기능을 적용하지 않도록 예외 처리
        if (!anchor.classList.contains('open-modal-btn')) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // --- 새로운 모달(팝업) 기능 ---

    // 필요한 요소들을 변수에 저장
    const modal = document.getElementById('consulting-modal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButton = document.querySelector('.close-btn');
    const consultingForm = document.getElementById('consulting-form');

    // 모달 여는 함수
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // 모달 닫는 함수
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // '무료 컨설팅 신청' 버튼들을 클릭하면 모달 열기
    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // a 태그의 기본 동작(페이지 이동) 방지
            openModal();
        });
    });

    // 'X' 버튼을 클릭하면 모달 닫기
    closeModalButton.addEventListener('click', closeModal);

    // 모달 바깥의 어두운 영역을 클릭하면 모달 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 폼 제출 시 이벤트 처리
    consultingForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작(새로고침) 방지
        
        // 여기에 나중에 Formspree, Netlify Forms 같은 백엔드 서비스나
        // 이메일 전송 API를 연동하여 실제 데이터 전송 로직을 구현할 수 있습니다.
        
        // 지금은 사용자에게 접수 완료 알림만 띄웁니다.
        alert('문의가 성공적으로 접수되었습니다. 확인 후 신속하게 연락드리겠습니다.');
        
        closeModal(); // 모달 닫기
        consultingForm.reset(); // 폼 내용 초기화
    });
});