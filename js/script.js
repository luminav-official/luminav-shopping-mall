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
        const formContainer = document.getElementById("modal-form-container");
        const status = document.getElementById("form-status");
        if (formContainer) formContainer.style.display = 'block';
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
        
        const formContainer = document.getElementById("modal-form-container");
        const status = document.getElementById("form-status");
        const data = new FormData(event.target);
        
        const submitButton = form.querySelector('.fs-button');
        submitButton.disabled = true;
        submitButton.textContent = '전송 중...';

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                formContainer.style.display = 'none'; // 폼과 카톡 버튼을 모두 포함한 컨테이너를 숨김
                status.innerHTML = "문의가 성공적으로 접수되었습니다. 감사합니다!";
                status.className = 'success';
                status.style.display = 'block';
                form.reset();
            } else {
                response.json().then(data => {
                    status.innerHTML = data.errors ? data.errors.map(error => error.message).join(", ") : "죄송합니다. 양식 제출 중 오류가 발생했습니다.";
                    status.className = 'error';
                    status.style.display = 'block';
                })
            }
        }).catch(error => {
            status.innerHTML = "죄송합니다. 네트워크 오류가 발생했습니다.";
            status.className = 'error';
            status.style.display = 'block';
        }).finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = '제출';
        });
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    // --- 다크모드 기능 ---
    const darkModeToggle = document.getElementById('darkmode-toggle');

    // 페이지 로드 시 저장된 테마 확인 및 적용
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // 토글 스위치 클릭 이벤트
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark'); // 테마 선택 저장
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light'); // 테마 선택 저장
        }
    });

    // --- 이미지 비교 슬라이더 기능 ---
    const slider = document.querySelector('.comparison-slider');
    if (slider) {
        const sliderInput = slider.querySelector('.slider-range');
        const afterImage = slider.querySelector('.after-image');

        sliderInput.addEventListener('input', (e) => {
            afterImage.style.clipPath = `polygon(${e.target.value}% 0, 100% 0, 100% 100%, ${e.target.value}% 100%)`;
        });
    }

    // --- 맨 위로 가기 버튼 기능 ---
    const backToTopButton = document.querySelector('.back-to-top-btn');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 인터랙티브 서비스 섹션 스크롤 효과 ---
    const interactiveServices = document.querySelector('#interactive-services');
    if (interactiveServices) {
        const serviceCards = interactiveServices.querySelectorAll('.service-card-stack .service-card');
        const contentItems = interactiveServices.querySelectorAll('.service-content-item');
        const contentScroll = interactiveServices.querySelector('.service-content-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const correspondingCard = interactiveServices.querySelector(`.service-card[data-service-id="${id}"]`);

                if (entry.isIntersecting) {
                    // Remove active class from all cards and items
                    serviceCards.forEach(card => card.classList.remove('active'));
                    contentItems.forEach(item => item.classList.remove('active'));

                    // Add active class to the current one
                    if (correspondingCard) {
                        correspondingCard.classList.add('active');
                    }
                    entry.target.classList.add('active');
                }
            });
        }, { root: contentScroll, threshold: 0.5 });

        contentItems.forEach(item => {
            observer.observe(item);
        });

        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-service-id');
                const correspondingItem = interactiveServices.querySelector(`.service-content-item#${id}`);
                if (correspondingItem) {
                    correspondingItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
    }
});