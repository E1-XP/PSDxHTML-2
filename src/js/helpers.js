export const CSS_HIDDEN_WITH_TRANSITION = 'h-hidden-with-transition';
export const CSS_TRANSITION_NONE = 'h-transition-none';
export const CSS_OVERFLOW_HIDDEN = 'h-overflow-hidden';

export const createState = (initial = {}) => {
  let state = initial;

  return {
    get() {
      return state;
    },
    set(partial) {
      state = Object.assign({}, state, partial);
      Object.freeze(state);
    }
  };
};

export const enableTransition = elem =>
  elem.classList.remove(CSS_TRANSITION_NONE);

export const disableTransition = elem =>
  elem.classList.add(CSS_TRANSITION_NONE);

export const toggleVisibility = elem =>
  elem.classList.toggle(CSS_HIDDEN_WITH_TRANSITION);

export const toggleOverflow = elem =>
  elem.classList.toggle(CSS_OVERFLOW_HIDDEN);
