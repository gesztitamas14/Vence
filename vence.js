
document.addEventListener('DOMContentLoaded', function () {
  // DOM elements
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  const sliderDotsContainer = document.querySelector('.slider-dots');

  const slidesPerView = slides.length;
  let currentIndex = 0;
  let updatedSlides;
  const slideWidth = slides[0].getBoundingClientRect().width;
  let totalSlides;
  let dots = [];

  function buildSlider() {
    sliderWrapper.innerHTML = '';
    
    // Map original slides, data-index for reference
    const originals = slides.map((slide, i) => {
      const cloned = slide.cloneNode(true);
      
      return cloned;
    });

    // Left clone: cloning last slide (peeking from the left)
    const leftClone = slides.slice(-1).map(slide => {
        const cloned = slide.cloneNode(true);
        return cloned;
      });

    // Right clone (peeking from the right)
    const rightClone = slides.slice(0, slidesPerView - 1).map((slide, i) => {
      const cloned = slide.cloneNode(true);
      return cloned;
    });
    
    // Appending all cloned + original slides to the wrapper
    leftClone.forEach(slide => sliderWrapper.appendChild(slide));
    originals.forEach(slide => sliderWrapper.appendChild(slide));
    rightClone.forEach(slide => sliderWrapper.appendChild(slide));

    updatedSlides = Array.from(sliderWrapper.querySelectorAll('.slide'));
    totalSlides = updatedSlides.length;
  }
  
  // For shifting the slider
  function updateSlider(instant = false) {
    if (!updatedSlides || updatedSlides.length === 0) return;
    
    const slideWidth = updatedSlides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(sliderWrapper).gap) || 0;
    // this will move the slider
    const offset = (slideWidth + gap +1) * (currentIndex-1);

    sliderWrapper.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
    sliderWrapper.style.transform = `translateX(${-offset}px)`;
    
    updateActiveDot();
  }

  // Tracking dots under slider
  function buildDots() {
    sliderDotsContainer.innerHTML = '';
    dots = [];

    // As many dots as many images
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        currentIndex = index
        updateSlider();
      });
      sliderDotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function updateActiveDot() {
    if (!dots.length){
      return;
    } 
    const realIndex = (currentIndex + slides.length) % slides.length;

    // Only the actual index dot is active
    dots.forEach(dot => dot.classList.remove('active'));
    dots[realIndex].classList.add('active');
  }

  // If we reach end of slides, we reset so we have infinite slider
  function handleLoop() {
    if (currentIndex >= slides.length) {
      currentIndex = 0;
      updateSlider(true);
    } else if (currentIndex < 0) {
      currentIndex = slides.length-1;
      updateSlider(true);
    }
  }
  // Arrow slides right/left
  rightArrow.addEventListener('click', function () {
    goNext();
  });
  leftArrow.addEventListener('click', function () {
    goPrev();
  });

  function goNext() {
    currentIndex++;
    updateSlider();
  }

  // Move to previous slide
  function goPrev() {
    currentIndex--;
    updateSlider();
  }

  sliderWrapper.addEventListener('transitionend', handleLoop);

  // Touch swipe for phone view
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 40;

  // When the user first touches the slider
  sliderWrapper.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].clientX;
  }, false);

  // When the user lifts their finger
  sliderWrapper.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    // Calculate swipe direction
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > minSwipeDistance) {
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  }
  
  // Initial build
  buildSlider();
  buildDots();
  updateSlider(true);
});






