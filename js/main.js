
//메뉴 이동 애니메이션
$(function () {
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();

        const target = $($(this).attr('href'));
        if (!target.length) return; // 대상 요소가 없으면 종료

        const offset = 8 * 16; // 6rem → px (기본 폰트 크기 16px 기준)
        const targetPosition = target.offset().top - offset;

        $('html, body').animate({
            scrollTop: targetPosition
        }, 500); // 0.5초 동안 부드럽게 스크롤
    });
});


//Hero 영역 슬라이드
document.addEventListener('DOMContentLoaded', function () {
    let isPlaying = true;

    const heroSwiper = new Swiper('.heroSwiper', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        loop: true,
        speed: 800,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.btn-next',
            prevEl: '.btn-prev'
        },
        pagination: {
            el: '.fraction',
            type: 'fraction',
            renderFraction: function (currentClass, totalClass) {
                return `<span class="${currentClass}"></span> / <span class="${totalClass}"></span>`;
            }
        }
    });

    // autoplay 버튼 제어
    const autoplayBtn = document.querySelector('.btn-autoplay');

    autoplayBtn.addEventListener('click', function () {
        if (isPlaying) {
            heroSwiper.autoplay.stop();
            autoplayBtn.classList.remove('pause');
            autoplayBtn.classList.add('play');
            autoplayBtn.setAttribute('aria-label', '자동재생시작');
        } else {
            heroSwiper.autoplay.start();
            autoplayBtn.classList.remove('play');
            autoplayBtn.classList.add('pause');
            autoplayBtn.setAttribute('aria-label', '자동재생정지');
        }
        isPlaying = !isPlaying;
    });
});


// ISP 슬라이드 드래그 기능 (Transform 기반)
function initISPSlider() {
    const contentWrap = document.querySelector('.isp-content-wrap');
    const slide = document.querySelector('.isp-slide');
    
    if (!contentWrap || !slide) return;
    
    let isDown = false;
    let startX;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    
    // 슬라이드 최대 이동 거리 계산
    function getMaxTranslate() {
        const containerWidth = contentWrap.offsetWidth;
        const slideWidth = slide.offsetWidth;
        return Math.min(0, containerWidth - slideWidth);
    }
    
    // Transform 적용
    function setSliderPosition() {
        slide.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    // 애니메이션 프레임
    function animation() {
        setSliderPosition();
        if (isDown) requestAnimationFrame(animation);
    }
    
    // 경계값 제한
    function clampTranslate(translate) {
        const maxTranslate = getMaxTranslate();
        return Math.max(maxTranslate, Math.min(0, translate));
    }
    
    // 마우스 이벤트
    contentWrap.addEventListener('mousedown', (e) => {
        isDown = true;
        slide.classList.add('dragging');
        contentWrap.style.cursor = 'grabbing';
        startX = e.clientX;
        prevTranslate = currentTranslate;
        animationID = requestAnimationFrame(animation);
        e.preventDefault();
    });
    
    contentWrap.addEventListener('mouseleave', () => {
        if (isDown) {
            isDown = false;
            slide.classList.remove('dragging');
            contentWrap.style.cursor = 'grab';
            cancelAnimationFrame(animationID);
        }
    });
    
    contentWrap.addEventListener('mouseup', () => {
        isDown = false;
        slide.classList.remove('dragging');
        contentWrap.style.cursor = 'grab';
        cancelAnimationFrame(animationID);
    });
    
    contentWrap.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const currentPosition = e.clientX;
        const diff = currentPosition - startX;
        currentTranslate = clampTranslate(prevTranslate + diff);
    });
    
    // 터치 이벤트 (모바일 대응)
    contentWrap.addEventListener('touchstart', (e) => {
        isDown = true;
        slide.classList.add('dragging');
        startX = e.touches[0].clientX;
        prevTranslate = currentTranslate;
        animationID = requestAnimationFrame(animation);
    });
    
    contentWrap.addEventListener('touchend', () => {
        isDown = false;
        slide.classList.remove('dragging');
        cancelAnimationFrame(animationID);
    });
    
    contentWrap.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - startX;
        currentTranslate = clampTranslate(prevTranslate + diff);
    });
    
    // 윈도우 리사이즈 시 최대 이동거리 재계산
    window.addEventListener('resize', () => {
        currentTranslate = clampTranslate(currentTranslate);
        setSliderPosition();
    });
    
    // 초기 커서 설정
    contentWrap.style.cursor = 'grab';
}


// 섹션3 배경 애니메이션
function initSection3Animation() {
    const section3 = document.getElementById('section3');
    const main = document.querySelector('main');
    
    if (!section3 || !main) return;
    
    // CSS 초기 상태 설정 - 화면 밖에서 시작
    const style = document.createElement('style');
    style.textContent = `
        main::after {
            display: block; 
            width: 89.7rem; 
            height: 25.2rem; 
            right: -89.7rem; /* 화면 밖에 숨김 */
            top: 24rem; 
            position: fixed; 
            content: ''; 
            background: url(./images/bg_section3.svg) no-repeat; 
            z-index: -1; 
            background-size: auto 100%;
            transition: right 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            opacity: 0;
        }
        
        main.animate::after {
            right: 0; /* 원래 위치로 이동 */
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer 설정
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 섹션이 화면에 들어오면 main에 애니메이션 클래스 추가
                main.classList.add('animate');
            }
        });
    }, {
        threshold: 0.4, // 40% 보일 때 애니메이션 시작
        rootMargin: '0px 0px -50px 0px' // 50px 일찍 트리거
    });
    
    observer.observe(section3);
}

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initISPSlider();
    initSection3Animation();
});



// 히스토리 아코디언 기능
$(function() {
    // 1. 초기 상태: 2025만 열고 나머지는 닫기
    $('.history-year').each(function() {
        if ($(this).find('> a').text().trim() === '2025') {
            $(this).addClass('open');
            $(this).find('.history-month').show(); // 열기
        } else {
            $(this).removeClass('open');
            $(this).find('.history-month').hide(); // 닫기
        }
    });

    // 2. 클릭 이벤트 (slideUp/slideDown 방식)
    $('.history-year > a').on('click', function(e) {
        e.preventDefault();

        const $clickedYear = $(this).parent();
        const $clickedMonth = $clickedYear.find('.history-month');

        if ($clickedYear.hasClass('open')) {
            // 이미 열려있으면 닫기
            $clickedMonth.stop(true, true).slideUp(300);
            $clickedYear.removeClass('open');
        } else {
            // 다른 모든 항목 닫기
            $('.history-year.open')
                .removeClass('open')
                .find('.history-month')
                .stop(true, true)
                .slideUp(300);

            // 클릭한 항목 열기
            $clickedYear.addClass('open');
            $clickedMonth.stop(true, true).slideDown(300);
        }
    });
});



//파트너스 슬라이드
$(function () {
    const $wrap = $('.partners-slide-wrap');
    const $list = $wrap.find('.partners-slide');

    // 1) 원본 복제
    const originalHTML = $list.html();
    $list.append(originalHTML); 

    let pos = 0;
    const SPEED = 0.5; // 이동 속도(px)
    let paused = false;

    function animate() {
        if (!paused) {
            pos -= SPEED;
            // 절반 이상 이동하면 처음으로 리셋
            if (Math.abs(pos) >= $list[0].scrollWidth / 2) {
                pos = 0;
            }
            $list.css('transform', 'translateX(' + pos + 'px)');
        }
        requestAnimationFrame(animate);
    }
    animate();
});

document.addEventListener('DOMContentLoaded', function () {
    const solutionSwiper = new Swiper('.solutionSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 600,
        navigation: {
            nextEl: '.control-area .btn-next',
            prevEl: '.control-area .btn-prev',
        }
    });

    // 모바일용 버튼도 동작하게 연결
    document.querySelectorAll('.mobile-controller .btn-next').forEach(btn => {
        btn.addEventListener('click', () => solutionSwiper.slideNext());
    });
    document.querySelectorAll('.mobile-controller .btn-prev').forEach(btn => {
        btn.addEventListener('click', () => solutionSwiper.slidePrev());
    });
});



//floating button
$(function () {
    /** ------------------------------
     * Floating 버튼 위치 제어 (footer 침범 방지)
     * ------------------------------ */
    const $floating = $('.floating-wrap');
    const $footer = $('footer');
    const defaultBottom = 4 * 10; // rem → px

    function updateFloating() {
        const winH = $(window).height();
        const scrollTop = $(window).scrollTop();
        const footerTop = $footer.offset().top;
        const viewportBottom = scrollTop + winH;

        if (viewportBottom - defaultBottom >= footerTop) {
            const overlap = viewportBottom - footerTop + defaultBottom;
            $floating.css('bottom', overlap + 'px');
        } else {
            $floating.css('bottom', defaultBottom + 'px');
        }
    }
    $(window).on('scroll resize', updateFloating);
    updateFloating();


    /** ------------------------------
     * Contact 버튼 hover → 열림/닫힘
     * ------------------------------ */
    $('.floating-btn.contact').hover(
        function () {
            $(this).find('.contact-open').stop(true, true).fadeIn(200);
        },
        function () {
            $(this).find('.contact-open').stop(true, true).fadeOut(200);
        }
    );


    /** ------------------------------
     * Toast 메시지 표시
     * ------------------------------ */
    function showToast(msg) {
        const $toast = $('<div class="toast">' + msg + '</div>');
        $('body').append($toast);

        setTimeout(() => $toast.addClass('show'), 10);
        setTimeout(() => {
            $toast.removeClass('show');
            setTimeout(() => $toast.remove(), 400);
        }, 1500);
    }

    $(function () {
        $('.contact-open .contact em').on('click', function () {
            const text = $(this).text().trim();
            navigator.clipboard.writeText(text).then(() => {
                showToast(text + ' 복사됨');
            });
        });
    });
});



