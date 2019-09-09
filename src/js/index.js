import enableSliders from './carousel';
import initAndMoveMapIntoGlobalScope from './map';
import {
  enableTransition,
  disableTransition,
  toggleVisibility,
  toggleOverflow
} from './helpers';

const preloader = document.getElementById('main-loader');
const mainNav = document.getElementById('main-nav');
const navList = document.getElementById('nav-list');
const navButton = document.getElementById('nav-btn');

const isNavOpen = () => mainNav.classList.contains('js-is-open');

const onNavClick = () => {
  mainNav.classList.toggle('js-is-open');

  const isOpen = isNavOpen();
  if (isOpen) enableTransition(navList);
  navButton.setAttribute('aria-expanded', `${isOpen}`);

  window.scrollTo(0, 0);
};

const checkBeforeDisabling = () => !isNavOpen() && disableTransition(navList);

navButton.addEventListener('click', onNavClick);
navList.addEventListener('transitionend', checkBeforeDisabling);

document.querySelectorAll('a[href^="#"]').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();

    if (navList.contains(item) && isNavOpen()) onNavClick();
    document.querySelector(item.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

enableSliders();
initAndMoveMapIntoGlobalScope();

window.addEventListener('load', () => {
  toggleVisibility(preloader);
  toggleOverflow(document.body);
});
