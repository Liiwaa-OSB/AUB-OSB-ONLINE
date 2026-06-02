// carousel.js
// Implements an auto-sliding, infinite loop carousel with arrow controls.
// When all slides fit, the carousel becomes static (no buttons, no auto‑slide).

class Carousel {
  constructor(element) {
    this.carousel = element;
    this.container = this.carousel.querySelector('.js-carousel-container');
    this.track = this.carousel.querySelector('.js-carousel-track');
    this.prevBtn = this.carousel.querySelector('.js-carousel-prev');
    this.nextBtn = this.carousel.querySelector('.js-carousel-next');

    if (!this.track || !this.container) return;

    // Store original slides (clean copies for later rebuilds)
    this.originalSlideNodes = Array.from(this.track.children);
    this.slideCount = this.originalSlideNodes.length;
    if (this.slideCount === 0) return;

    // Deep copies to restore when rebuilding
    this.originalSlidesCopy = this.originalSlideNodes.map(slide => slide.cloneNode(true));

    // Configuration
    this.autoSlideInterval = 3000;   // 3 seconds
    this.transitionDuration = 300;   // ms (must match CSS transition)
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.isTransitioning = false;
    this.autoTimer = null;
    this.isInfiniteEnabled = false;
    this.visibleCount = 0;

    // Bind methods
    this.handlePrevClick = () => this.prevSlide();
    this.handleNextClick = () => this.nextSlide();
    this.handleTransitionEnd = this.onTransitionEnd.bind(this);
    this.handleResize = this.onWindowResize.bind(this);

    // Initial build (may clone or not depending on visible count)
    this.buildCarousel();

    // Event listeners (always attached, but guarded by isInfiniteEnabled)
    this.prevBtn.addEventListener('click', this.handlePrevClick);
    this.nextBtn.addEventListener('click', this.handleNextClick);
    this.track.addEventListener('transitionend', this.handleTransitionEnd);
    window.addEventListener('resize', this.handleResize);

    // Pause auto-slide on hover (only if infinite mode is active)
    this.carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());
  }

  // ----------------------------------------------------------------------
  //  Core: decide mode & build DOM
  // ----------------------------------------------------------------------
  buildCarousel() {
    // Reset track to original (clean) slides
    this.track.innerHTML = '';
    this.originalSlidesCopy.forEach(slide => this.track.appendChild(slide.cloneNode(true)));

    // Re‑query slides (they are fresh)
    this.allSlides = Array.from(this.track.children);
    this.slideCount = this.allSlides.length;  // same as original count

    // Measure slide width and visible count using current DOM
    this.recalculateSlideWidth();
    this.visibleCount = this.getVisibleCount();

    const allFit = this.slideCount <= this.visibleCount;

    if (allFit) {
      // ----- STATIC MODE: no scrolling, no clones -----
      this.isInfiniteEnabled = false;
      this.currentIndex = 0;
      this.updateTransform(false);
      this.disableCarouselMode();
    } else {
      // ----- INFINITE LOOP MODE: clone for seamless sliding -----
      this.isInfiniteEnabled = true;
      this.cloneSlidesForInfiniteLoop();
      this.recalculateSlideWidth();     // width may change after cloning
      // Start from the first original slide (after leading clones)
      this.currentIndex = this.slideCount;
      this.updateTransform(false);
      this.enableCarouselMode();
      this.startAutoSlide();
    }
  }

  // Rebuild when mode changes (e.g. resize across breakpoints)
  rebuildCarousel() {
    this.stopAutoSlide();
    this.isTransitioning = false;
    // Re‑build from scratch using the stored original slides
    this.buildCarousel();
  }

  // ----------------------------------------------------------------------
  //  DOM helpers for infinite loop
  // ----------------------------------------------------------------------
  cloneSlidesForInfiniteLoop() {
    // Clear track
    this.track.innerHTML = '';
    // Clone all original slides (before + after)
    const clonesBefore = this.originalSlidesCopy.map(slide => slide.cloneNode(true));
    const clonesAfter = this.originalSlidesCopy.map(slide => slide.cloneNode(true));

    clonesBefore.forEach(clone => this.track.appendChild(clone));
    this.originalSlidesCopy.forEach(original => this.track.appendChild(original.cloneNode(true)));
    clonesAfter.forEach(clone => this.track.appendChild(clone));

    this.allSlides = Array.from(this.track.children);
    this.totalSlidesWithClones = this.allSlides.length;
  }

  recalculateSlideWidth() {
    if (this.allSlides.length === 0) return;
    const slide = this.allSlides[0];
    const style = window.getComputedStyle(slide);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    const width = slide.offsetWidth;
    this.slideWidth = width + marginLeft + marginRight;
  }

  getVisibleCount() {
    if (!this.container || this.slideWidth === 0) return 0;
    const containerWidth = this.container.clientWidth;
    return Math.floor(containerWidth / this.slideWidth);
  }

  // ----------------------------------------------------------------------
  //  UI & mode switching
  // ----------------------------------------------------------------------
  disableCarouselMode() {
    // Hide buttons, disable auto‑slide, prevent any sliding action
    this.prevBtn.style.display = 'none';
    this.nextBtn.style.display = 'none';
    this.stopAutoSlide();
    // Ensure track is at start
    this.currentIndex = 0;
    this.updateTransform(false);
  }

  enableCarouselMode() {
    this.prevBtn.style.display = '';
    this.nextBtn.style.display = '';
    // Buttons are always interactive; infinite loop guard prevents invalid moves
    this.prevBtn.removeAttribute('disabled');
    this.nextBtn.removeAttribute('disabled');
  }

  // ----------------------------------------------------------------------
  //  Transform & sliding (guarded by isInfiniteEnabled)
  // ----------------------------------------------------------------------
  updateTransform(useTransition = true) {
    if (!this.track) return;
    const translateX = -this.currentIndex * this.slideWidth;
    if (useTransition) {
      this.track.style.transition = `transform ${this.transitionDuration}ms ease-out`;
    } else {
      this.track.style.transition = 'none';
    }
    this.track.style.transform = `translateX(${translateX}px)`;
  }

  goToSlide(index, useTransition = true) {
    if (!this.isInfiniteEnabled) return;          // No sliding in static mode
    if (this.isTransitioning || index === this.currentIndex) return;
    this.isTransitioning = true;
    this.currentIndex = index;
    this.updateTransform(useTransition);
  }

  nextSlide() {
    if (!this.isInfiniteEnabled || this.isTransitioning) return;
    this.goToSlide(this.currentIndex + 1, true);
    this.resetAutoTimer();
  }

  prevSlide() {
    if (!this.isInfiniteEnabled || this.isTransitioning) return;
    this.goToSlide(this.currentIndex - 1, true);
    this.resetAutoTimer();
  }

  // Infinite loop correction after transition ends
  onTransitionEnd() {
    if (!this.isInfiniteEnabled) {
      this.isTransitioning = false;
      return;
    }
    this.isTransitioning = false;

    const firstOriginalIdx = this.slideCount;
    const lastOriginalIdx = this.slideCount + this.slideCount - 1;

    if (this.currentIndex > lastOriginalIdx) {
      // Moved into trailing clones → jump back to the beginning
      const newIndex = firstOriginalIdx + (this.currentIndex - lastOriginalIdx - 1);
      this.currentIndex = newIndex;
      this.updateTransform(false);
    } else if (this.currentIndex < firstOriginalIdx) {
      // Moved into leading clones → jump to the end
      const offset = firstOriginalIdx - this.currentIndex;
      const newIndex = lastOriginalIdx - (offset - 1);
      this.currentIndex = newIndex;
      this.updateTransform(false);
    }
  }

  // ----------------------------------------------------------------------
  //  Auto‑slide control
  // ----------------------------------------------------------------------
  startAutoSlide() {
    if (!this.isInfiniteEnabled) return;
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.autoTimer = setInterval(() => {
      if (!this.isTransitioning && document.contains(this.carousel)) {
        this.nextSlide();
      }
    }, this.autoSlideInterval);
  }

  stopAutoSlide() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  resetAutoTimer() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // ----------------------------------------------------------------------
  //  Resize handling – rebuild if mode changes
  // ----------------------------------------------------------------------
  onWindowResize() {
    if (!this.container) return;
    // Re‑measure slide width and visible count
    this.recalculateSlideWidth();
    const newVisibleCount = this.getVisibleCount();
    const nowAllFit = this.slideCount <= newVisibleCount;

    if (nowAllFit !== !this.isInfiniteEnabled) {
      // Mode changed → complete rebuild
      this.rebuildCarousel();
    } else {
      // Same mode, just reposition
      this.updateTransform(false);
      this.visibleCount = newVisibleCount;
    }
  }

  // ----------------------------------------------------------------------
  //  Cleanup
  // ----------------------------------------------------------------------
  destroy() {
    this.stopAutoSlide();
    window.removeEventListener('resize', this.handleResize);
    this.prevBtn.removeEventListener('click', this.handlePrevClick);
    this.nextBtn.removeEventListener('click', this.handleNextClick);
    if (this.track) {
      this.track.removeEventListener('transitionend', this.handleTransitionEnd);
    }
    this.carousel.removeEventListener('mouseenter', () => this.stopAutoSlide());
    this.carousel.removeEventListener('mouseleave', () => this.startAutoSlide());
  }
}

// ----------------------------------------------------------------------
//  Initialize all carousels on page load
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.js-carousel');
  carousels.forEach(carouselEl => {
    if (!carouselEl.carouselInstance) {
      carouselEl.carouselInstance = new Carousel(carouselEl);
    }
  });
});

// ----------------------------------------------------------------------
//  Continuous logos carousel (unchanged)
// ----------------------------------------------------------------------
(function initContinuousCarousel() {
  const carousel = document.getElementById('logoCarousel');
  if (!carousel) return;

  const track = document.getElementById('logoTrack');
  if (!track) return;

  const originalSlides = Array.from(track.children);
  if (originalSlides.length === 0) return;

  // Duplicate slides to create seamless infinite effect
  const slidesToAdd = [...originalSlides];
  for (let i = 0; i < 2; i++) {
    slidesToAdd.forEach(slide => {
      track.appendChild(slide.cloneNode(true));
    });
  }

  function getOriginalSetWidth() {
    let width = 0;
    for (let i = 0; i < originalSlides.length; i++) {
      const slide = track.children[i];
      const style = window.getComputedStyle(slide);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      width += slide.offsetWidth + marginLeft + marginRight;
    }
    return width;
  }

  function updateSpeed() {
    const setWidth = getOriginalSetWidth();
    const duration = setWidth / 1500;   // adjust speed as desired
    track.style.animationDuration = `${Math.max(5, duration)}s`;
  }

  window.addEventListener('resize', () => {
    updateSpeed();
    track.style.animation = 'none';
    track.offsetHeight; // force reflow
    track.style.animation = null;
  });

  updateSpeed();
})();