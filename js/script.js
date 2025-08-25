document.addEventListener('DOMContentLoaded', function() {
    
    // --- 부드러운 스크롤 기능 ---
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

    // --- 모달(팝업) 기능 ---

    // 필요한 요소들을 변수에 저장
    const modal = document.getElementById('consulting-modal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButton = document.querySelector('.close-btn');

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
    
    // ※※※ Formspree가 정상 작동하도록 기존 폼 제출(submit) 관련 코드를 완전히 제거했습니다. ※※※
});