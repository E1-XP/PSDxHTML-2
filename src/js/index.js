import Siema from 'siema';
import initMap from './map';

const mainNav = document.getElementById('main-nav');
const navList = document.getElementById('nav-list');
const navButton = document.getElementById('nav-btn');
const lightbox = document.querySelector('#gallery #lightbox');
const lightboxBtn = lightbox.querySelector('.carousel__toggle-button');
const galleryItems = document.querySelectorAll(
  '#gallery .section-gallery__item'
);
const lightboxBtns = lightbox.querySelectorAll('.carousel__button');
const carouselBtns = document.querySelectorAll(
  '#testimonials .carousel__button'
);

const isNavOpen = () => mainNav.classList.contains('js-is-open');
const blockScroll = () => window.scrollTo(0, 0);
const enableTransition = elem => elem.classList.remove('h-transition-none');
const disableTransition = (elem, predicate = true) => {
  const should = typeof predicate === 'function' ? predicate() : predicate;
  if (should) elem.classList.add('h-transition-none');
};

const onNavClick = () => {
  mainNav.classList.toggle('js-is-open');
  const isOpen = isNavOpen();
  if (isOpen) enableTransition(navList);
  navButton.setAttribute('aria-expanded', `${isOpen}`);

  const methods = ['removeEventListener', 'addEventListener'];
  window[methods[+isOpen]]('scroll', blockScroll);
};

navButton.addEventListener('click', onNavClick);
navList.addEventListener('transitionend', () => disableTransition(navList));

document.querySelectorAll('a[href^="#"]').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();

    if (navList.contains(item) && isNavOpen()) onNavClick();
    document.querySelector(item.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

const updateSliderControls = (idx, elemArr) => {
  elemArr.forEach(el => el.classList.remove('carousel__button--active'));
  elemArr[idx].classList.add('carousel__button--active');
};

const lightboxSlider = new Siema({
  selector: '#gallery .carousel--lightbox .carousel__list',
  loop: true,
  duration: 300,
  onChange: () =>
    updateSliderControls(lightboxSlider.currentSlide, lightboxBtns)
});

const handleKeyDown = e => {
  switch (e.which) {
    case 27:
      return toggleLightbox();
    case 37:
      return lightboxSlider.prev();
    case 39:
      return lightboxSlider.next();
    default:
      return null;
  }
};

const toggleLightbox = (evt, idx) => {
  const methods = ['removeEventListener', 'addEventListener'];

  const toggleLightboxKboardCtrl = isOpen => {
    document[methods[+isOpen]]('keydown', handleKeyDown);
  };
  const isClosed = lightbox.classList.contains('h-hidden-with-transition');

  const toggleVisibility = () =>
    lightbox.classList.toggle('h-hidden-with-transition');
  const waitForTransition = fn => setTimeout(fn, 200);

  if (isClosed && idx !== undefined) {
    enableTransition(lightbox);

    if (lightboxSlider.currentSlide !== idx) {
      lightboxSlider.goTo(idx, () => waitForTransition(toggleVisibility));
    } else waitForTransition(toggleVisibility);

    waitForTransition(() => toggleLightboxKboardCtrl(isClosed));
  } else {
    const disableTransitionOffEvt = () => {
      disableTransition(lightbox);
      lightbox[methods[0]]('transitionend', disableTransitionOffEvt);
    };

    toggleLightboxKboardCtrl(isClosed);
    lightbox[methods[1]]('transitionend', disableTransitionOffEvt);
    toggleVisibility();
  }
};

galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => toggleLightbox(undefined, idx));
});
lightboxBtn.addEventListener('click', toggleLightbox);

const testimonialsCarousel = new Siema({
  selector: '#testimonials .carousel__list',
  loop: true,
  duration: 300,
  onChange: () =>
    updateSliderControls(testimonialsCarousel.currentSlide, carouselBtns)
});

const enableCarouselBtns = (carousel, btns) => {
  btns.forEach((elem, i) =>
    elem.addEventListener('click', () => {
      carousel.goTo(i);
      updateSliderControls(i, btns);
    })
  );
};

enableCarouselBtns(lightboxSlider, lightboxBtns);
enableCarouselBtns(testimonialsCarousel, carouselBtns);
