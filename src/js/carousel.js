import Siema from 'siema';
import {
  enableTransition,
  toggleVisibility,
  createState,
  CSS_HIDDEN_WITH_TRANSITION
} from './helpers';

const lightbox = document.querySelector('#gallery #lightbox');
const lightboxBtn = lightbox.querySelector('.carousel__toggle-button');
const galleryItems = document.querySelectorAll(
  '#gallery .section-gallery__item'
);
const lightboxBtns = lightbox.querySelectorAll('.carousel__button');
const carouselBtns = document.querySelectorAll(
  '#testimonials .carousel__button'
);

const state = createState({
  lightboxSlider: null,
  testimonialsCarousel: null
});

const updateSliderControls = (idx, elemArr) => {
  elemArr.forEach(el => el.classList.remove('carousel__button--active'));
  elemArr[idx].classList.add('carousel__button--active');
};

const handleKeyUp = e => {
  switch (e.key) {
    case 'Escape':
      return requestAnimationFrame(toggleLightbox);
    case 'ArrowLeft':
      return state.get().lightboxSlider.prev();
    case 'ArrowRight':
      return state.get().lightboxSlider.next();
    default:
      return null;
  }
};

const toggleLightbox = idx => {
  const { lightboxSlider } = state.get();

  const checkIsClosed = () =>
    lightbox.classList.contains(CSS_HIDDEN_WITH_TRANSITION);

  const toggleLightboxKBoardCtrl = isOpen => {
    const evtMethods = ['removeEventListener', 'addEventListener'];
    document[evtMethods[+isOpen]]('keyup', handleKeyUp);
  };

  const defer = fn => setTimeout(fn, 200);

  const isClosed = checkIsClosed();

  if (isClosed) {
    enableTransition(lightbox);

    if (!Number.isNaN(idx) && lightboxSlider.currentSlide !== idx) {
      lightboxSlider.goTo(idx, () => defer(() => toggleVisibility(lightbox)));
    } else defer(() => toggleVisibility(lightbox));

    defer(() => toggleLightboxKBoardCtrl(!checkIsClosed()));
  } else {
    toggleLightboxKBoardCtrl(!isClosed);
    toggleVisibility(lightbox);
  }
};

const enableCarouselBtns = (carousel, btns) => {
  btns.forEach((elem, i) =>
    elem.addEventListener('click', () => {
      carousel.goTo(i);
      updateSliderControls(i, btns);
    })
  );
};

const createSliderInstances = () => {
  const lightboxSlider = new Siema({
    selector: '#gallery .carousel--lightbox .carousel__list',
    loop: true,
    duration: 300,
    onChange: () =>
      updateSliderControls(lightboxSlider.currentSlide, lightboxBtns)
  });

  const testimonialsCarousel = new Siema({
    selector: '#testimonials .carousel__list',
    loop: true,
    duration: 300,
    onChange: () =>
      updateSliderControls(testimonialsCarousel.currentSlide, carouselBtns)
  });

  return { lightboxSlider, testimonialsCarousel };
};

const listenForGalleryThumbsClicks = () => {
  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => toggleLightbox(idx));
  });
};

const listenForLightboxBtnClick = () => {
  lightboxBtn.addEventListener('click', () => toggleLightbox());
};

const enableSliders = () => {
  state.set(createSliderInstances());

  listenForGalleryThumbsClicks();
  listenForLightboxBtnClick();

  enableCarouselBtns(state.get().lightboxSlider, lightboxBtns);
  enableCarouselBtns(state.get().testimonialsCarousel, carouselBtns);
};

export default enableSliders;
