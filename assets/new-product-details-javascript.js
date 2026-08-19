/**
 * New Product Details & Image Carousel
 */

class ProductImageCarousel {
  constructor(container) {
    this.container = container;
    this.sectionId = container.id.replace('ProductCarousel-', '');
    this.mainSlider = container.querySelector('.product-carousel__main');
    this.track = container.querySelector('.product-carousel__track');
    this.slides = Array.from(container.querySelectorAll('.product-carousel__slide'));
    this.prevBtn = container.querySelector('.product-carousel__btn--prev');
    this.nextBtn = container.querySelector('.product-carousel__btn--next');
    this.thumbsContainer = container.querySelector('.product-carousel__thumbs');
    this.thumbs = Array.from(container.querySelectorAll('.product-carousel__thumb'));
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    
    this.enableAutoplay = container.dataset.autoplay === 'true';
    this.autoplaySpeed = parseInt(container.dataset.autoplaySpeed, 10) * 1000 || 5000;
    this.autoplayTimer = null;

    if (this.totalSlides <= 0) return;

    this.init();
  }

  init() {
    // Check if only 1 slide exists, hide arrows if so
    if (this.totalSlides <= 1) {
      if (this.prevBtn) this.prevBtn.style.display = 'none';
      if (this.nextBtn) this.nextBtn.style.display = 'none';
      if (this.thumbsContainer) this.thumbsContainer.style.display = 'none';
    }

    // Set initial position
    this.goTo(0, false);

    // Event listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prev();
        this.resetAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.next();
        this.resetAutoplay();
      });
    }

    // Thumbnail click handlers
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        this.goTo(index);
        this.resetAutoplay();
      });
    });

    // Touch & Swipe gestures
    this.initTouchGestures();

    // Keyboard navigation
    if (this.mainSlider) {
      this.mainSlider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
          this.resetAutoplay();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
          this.resetAutoplay();
        }
      });
    }

    // Autoplay
    if (this.enableAutoplay && this.totalSlides > 1) {
      this.startAutoplay();
      this.container.addEventListener('mouseenter', () => this.stopAutoplay());
      this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }

  goTo(index, smooth = true) {
    if (this.totalSlides === 0) return;

    // Wrap around index
    if (index >= this.totalSlides) {
      this.currentIndex = 0;
    } else if (index < 0) {
      this.currentIndex = this.totalSlides - 1;
    } else {
      this.currentIndex = index;
    }

    // Move track
    if (this.track) {
      this.track.style.transition = smooth ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    // Update active slide class
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === this.currentIndex);
    });

    // Update active thumbnail
    this.thumbs.forEach((thumb, i) => {
      const isActive = i === this.currentIndex;
      thumb.classList.toggle('is-active', isActive);
      thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
      
      if (isActive && this.thumbsContainer) {
        thumb.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'nearest',
          inline: 'center'
        });
      }
    });
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  initTouchGestures() {
    if (!this.mainSlider) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    this.mainSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
      this.stopAutoplay();
    }, { passive: true });

    this.mainSlider.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }, { passive: true });

    this.mainSlider.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const threshold = 40;

      // Ensure horizontal swipe is dominant
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX < 0) {
          // Swiped left -> next
          this.next();
        } else {
          // Swiped right -> prev
          this.prev();
        }
      }

      this.resetAutoplay();
    });
  }

  startAutoplay() {
    if (!this.enableAutoplay || this.totalSlides <= 1) return;
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.next();
    }, this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resetAutoplay() {
    if (this.enableAutoplay) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  goToMediaId(mediaId) {
    if (!mediaId) return;
    const targetIndex = this.slides.findIndex(slide => slide.dataset.mediaId === String(mediaId));
    if (targetIndex !== -1) {
      this.goTo(targetIndex);
    }
  }
}

/**
 * Initialize all new product details sections and interactions
 */
function initNewProductDetails() {
  // Initialize Carousels
  document.querySelectorAll('.product-image-carousel').forEach((carouselEl) => {
    if (!carouselEl._carouselInstance) {
      carouselEl._carouselInstance = new ProductImageCarousel(carouselEl);
    }
  });

  // Initialize Quantity Buttons
  document.querySelectorAll('.new-product-details__actions').forEach((actions) => {
    const qtyInput = actions.querySelector('.new-product-details__qty-input');
    const decreaseBtn = actions.querySelector('[data-action="decrease"]');
    const increaseBtn = actions.querySelector('[data-action="increase"]');

    if (qtyInput && decreaseBtn && !decreaseBtn._hasListener) {
      decreaseBtn._hasListener = true;
      decreaseBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    if (qtyInput && increaseBtn && !increaseBtn._hasListener) {
      increaseBtn._hasListener = true;
      increaseBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = val + 1;
        qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  });

  // Initialize Variant Pill Selectors
  document.querySelectorAll('.new-product-details__variants-box').forEach((box) => {
    const optionGroups = box.querySelectorAll('.new-product-details__option-group');
    
    optionGroups.forEach((group) => {
      const selectedValueLabel = group.querySelector('.new-product-details__option-selected-value');
      const pillButtons = group.querySelectorAll('.new-product-details__pill-btn');

      pillButtons.forEach((btn) => {
        if (!btn._hasListener) {
          btn._hasListener = true;
          btn.addEventListener('click', () => {
            pillButtons.forEach(b => b.classList.remove('is-selected'));
            btn.classList.add('is-selected');
            if (selectedValueLabel) {
              selectedValueLabel.textContent = btn.dataset.value;
            }
          });
        }
      });
    });
  });
}

// Auto init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNewProductDetails);
} else {
  initNewProductDetails();
}

// Theme editor re-init support
document.addEventListener('shopify:section:load', initNewProductDetails);
document.addEventListener('shopify:section:select', initNewProductDetails);
