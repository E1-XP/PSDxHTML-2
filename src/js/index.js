import 'lazysizes';

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
const toggleScrollBlock = () =>
  document.body.parentElement.classList.toggle('h-block-page-scroll');

const onNavClick = () => {
  mainNav.classList.toggle('js-is-open');

  const isOpen = isNavOpen();
  if (isOpen) enableTransition(navList);
  navButton.setAttribute('aria-expanded', `${isOpen}`);

  toggleScrollBlock();
};

const lazyLoadCSSBackground = () => {
  document.addEventListener('lazybeforeunveil', e => {
    const bg = e.target.getAttribute('data-bg');
    if (bg) e.target.style.backgroundImage = `url(${bg})`;
  });
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
  lazyLoadCSSBackground();
});
