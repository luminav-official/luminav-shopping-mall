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

    // --- 복합 서비스 애니메이션 스크롤 효과 ---
    const animationContainer = document.getElementById('service-animation-container');
    if (animationContainer) {
        const stickyContainer = animationContainer.querySelector('.sticky-container');
        const gridContainer = animationContainer.querySelector('.service-grid-container');
        const cards = Array.from(gridContainer.querySelectorAll('.service-card'));
        const contentItems = Array.from(animationContainer.querySelectorAll('.service-content-item'));

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const containerTop = animationContainer.offsetTop;
            const containerHeight = animationContainer.offsetHeight;
            const viewportHeight = window.innerHeight;

            if (scrollY >= containerTop && scrollY <= containerTop + containerHeight - viewportHeight) {
                const progress = (scrollY - containerTop) / (containerHeight - viewportHeight);
                animateServices(progress);
            } else {
                // Reset styles when not in view
                cards.forEach(card => {
                    card.style.transform = '';
                    card.style.opacity = '1';
                });
                contentItems.forEach(item => item.classList.remove('active'));
            }
        });

        function animateServices(progress) {
            const stackingEnd = 0.15;
            const contentStart = 0.2;
            const contentEnd = 0.8;
            const unstackStart = 0.85;

            if (progress < stackingEnd) {
                // Phase 1: Stacking
                const stackingProgress = progress / stackingEnd;
                cards.forEach((card, i) => {
                    const targetX = - (card.offsetLeft - 40);
                    const targetY = - (card.offsetTop - 150) + (i * 20);
                    const tx = targetX * stackingProgress;
                    const ty = targetY * stackingProgress;
                    const scale = 1 - (0.2 * stackingProgress);
                    card.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
                });
                contentItems.forEach(item => item.classList.remove('active'));

            } else if (progress >= contentStart && progress < contentEnd) {
                // Phase 2: Content Cycling
                cards.forEach((card, i) => {
                    card.style.transform = `translate(-${card.offsetLeft - 40}px, -${card.offsetTop - 150 + (i * 20)}px) scale(0.8)`;
                });

                const contentProgress = (progress - contentStart) / (contentEnd - contentStart);
                const itemIndex = Math.floor(contentProgress * contentItems.length);

                contentItems.forEach((item, i) => {
                    if (i === itemIndex) {
                        item.classList.add('active');
                        cards[i].style.opacity = '1';
                        cards[i].style.transform = `translate(-${cards[i].offsetLeft - 40}px, -${cards[i].offsetTop - 150 + (i * 20)}px) scale(0.85)`;
                    } else {
                        item.classList.remove('active');
                        if(i < itemIndex) {
                            cards[i].style.opacity = '0';
                        }
                    }
                });

            } else if (progress >= unstackStart) {
                // Phase 3: Un-stacking
                const unstackingProgress = (progress - unstackStart) / (1 - unstackStart);
                cards.forEach((card, i) => {
                    const targetX = - (card.offsetLeft - 40);
                    const targetY = - (card.offsetTop - 150) + (i * 20);
                    const tx = targetX * (1 - unstackingProgress);
                    const ty = targetY * (1 - unstackingProgress);
                    const scale = 0.8 + (0.2 * unstackingProgress);
                    card.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
                    card.style.opacity = '1';
                });
            } else {
                 // In-between states
                cards.forEach((card, i) => {
                    card.style.transform = `translate(-${card.offsetLeft - 40}px, -${card.offsetTop - 150 + (i * 20)}px) scale(0.8)`;
                });
            }
        }
    }
});