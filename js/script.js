document.addEventListener('DOMContentLoaded', function() {
    
    // --- 부드러운 스크롤 기능 ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    const modal = document.getElementById('consulting-modal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButton = document.querySelector('.close-btn');

    const openModal = () => {
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        // 모달을 닫을 때 폼과 상태 메시지를 초기 상태로 되돌립니다.
        const form = document.querySelector(".fs-form");
        const status = document.getElementById("form-status");
        if (form) form.style.display = 'block';
        if (status) {
            status.style.display = 'none';
            status.innerHTML = '';
        }
    };

    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Formspree 제출 기능 (AJAX) ---
    const form = document.querySelector(".fs-form");
    
    async function handleSubmit(event) {
        event.preventDefault(); // 기본 제출 동작(페이지 이동)을 막습니다.
        
        const status = document.getElementById("form-status");
        const data = new FormData(event.target);
        
        // 제출 버튼 비활성화
        const submitButton = form.querySelector('.fs-button');
        submitButton.disabled = true;
        submitButton.textContent = '전송 중...';

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // 성공했을 때
                form.style.display = 'none'; // 폼 숨기기
                status.innerHTML = "문의가 성공적으로 접수되었습니다. 감사합니다!";
                status.className = 'success';
                status.style.display = 'block';
                form.reset();
            } else {
                // 서버에서 에러 응답이 왔을 때
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "죄송합니다. 양식 제출 중 오류가 발생했습니다.";
                    }
                    status.className = 'error';
                    status.style.display = 'block';
                })
            }
        }).catch(error => {
            // 네트워크 에러 등
            status.innerHTML = "죄송합니다. 양식 제출 중 오류가 발생했습니다.";
            status.className = 'error';
            status.style.display = 'block';
        }).finally(() => {
            // 성공/실패 여부와 관계없이 제출 버튼 다시 활성화
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        });
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }
});