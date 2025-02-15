const etUI = {}
window.etUI = etUI
;


/**
 * Check if the value is an array
 * @param value {any}
 * @returns {arg is any[]}
 */
function isArray(value) {
  return Array.isArray(value);
}
;


// boolean 관련 기능
;


// 날짜 관련 기능
;


// ex) string to querySelector convert logic

/**
 * 기능 설명 들어감
 */

/**
 * set attribute
 * @param { Element } parent
 * @param opts
 */
function setProperty(parent, ...opts) {
  if(opts.length === 2){
    const [property, value] = opts;

    parent?.setAttribute(property, value);
  }else if(opts.length === 3){
    const [selector, property, value] = opts;

    parent.querySelector(selector)?.setAttribute(property, value);
  }
}

/**
 * get attribute
 * @param { Element } parent
 * @param { String } selector
 * @param { String } property
 */
function getProperty(parent, selector, property) {
  parent.querySelector(selector)?.getAttribute(property);
}

/**
 * set style
 * @param { Element } parent
 * @param { String } selector
 * @param { String } property
 * @param { any } value
 */
function setStyle(parent, selector, property, value) {
  if (parent.querySelector(selector)) {
    parent.querySelector(selector).style[property] = value;
  }
}

/**
 * gsap의 SplitText를 활용하여 문자를 분리하여 마스크 가능하게 해준다.
 * @param selector  {string}
 * @param type  {'lines'|'words'|'chars'}
 * @returns [HTMLElement[], HTMLElement[]]
 */
function splitTextMask(selector, type = 'lines'){
  function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  const $quote = document.querySelector(selector),
    mySplitText = new SplitText($quote, {type})

  const $splitted = mySplitText[type];
  const $lineWrap = [];
  $splitted.forEach(($el, index) => {
    const $div = document.createElement('div');
    $div.style.overflow = 'hidden';
    $div.style.position = 'relative';
    $div.style.display = 'inline-block';
    wrap($el, $div);
    $lineWrap.push($div);
  })

  return [$splitted, $lineWrap]
}
;


// 연산 관련 (자료형Number + number)
function getBlendOpacity(opacity, length) {
  if(length === 1){
    return opacity
  }

  return 1 - Math.pow(1 - opacity, 1/length)
}
;


// object 관련 기능

/**
 * compare obj
 * @param { Object } obj1
 * @param { Object } obj2
 * @returns Boolean
 */
function shallowCompare(obj1, obj2) {
  const keys = [...Object.keys(obj1), Object.keys(obj2)];

  for (const key of keys) {
    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      if (!etUI.utils.shallowCompare(obj1[key], obj2[key])) {
        return false;
      }
    } else {
      const role = !obj2[key] || typeof obj1[key] === "function";
      if (!role && obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }
  return true;
}
;


/**
 * Reverse a string
 * @param str {string}
 * @returns {string}
 */
function reverseString(str) {
  return str.split('').reverse().join('');
}

/**
 * Get a random id
 * @returns {string}
 */
function getRandomId() {
  return Math.random().toString(36).substring(2);
}

/**
 *
 * @param prefix
 * @returns {string}
 */
function getRandomUIID(prefix = 'ui') {
  return `${prefix}-${getRandomId()}`;
}

/**
 * 첫글자만 대문자로 변환
 * @param word
 * @returns {string}
 */
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * 첫글자만 소문자로 변환
 * @param word
 * @returns {string}
 */
function uncapitalize(word) {
  return word.charAt(0).toLowerCase() + word.slice(1)
}

function addPrefixCamelString(str, prefix){
  // dimmClick => propsDimmClick
  return prefix + etUI.utils.capitalize(str)
}

function removePrefixCamelString(str, prefix){
  const regExp = new RegExp(`^${prefix}`, 'g')
  return etUI.utils.uncapitalize(str.replaceAll(regExp, ''))

}

;



etUI.utils = {
	isArray,
	setProperty,
	getProperty,
	setStyle,
	splitTextMask,
	getBlendOpacity,
	shallowCompare,
	reverseString,
	getRandomId,
	getRandomUIID,
	capitalize,
	uncapitalize,
	addPrefixCamelString,
	removePrefixCamelString
}
;


/**
 * target)의 외부를 클릭했을 때 콜백 함수를 실행
 * 예외적으로 클릭을 허용할 요소들의 선택자를 포함하는 배열을 옵션으로 받을 수 있습니다.
 *
 * @param {Element} target - 클릭 이벤트의 외부 클릭 감지를 수행할 대상 DOM 요소입니다.(필수)
 * @param {Function} callback - 외부 클릭이 감지되었을 때 실행할 콜백 함수입니다.(필수)
 * @param {Array<string>} exceptions - 외부 클릭 감지에서 예외 처리할 요소들의 선택자를 포함하는 배열입니다.(옵션)
 */

// blur 도 염두
function useClickOutside(target, callback, exceptions = []) {
  document.addEventListener("click", (event) => {
    let isClickInsideException = exceptions.some((selector) => {
      const exceptionElement = document.querySelector(selector);
      return exceptionElement && exceptionElement.contains(event.target);
    });

    if (!target.contains(event.target) && !isClickInsideException) {
      callback(target);
    }
  });
}

// 부모 요소는 parents
// 선택 요
;


function useCore(
  initialProps = {},
  initialValue = {},
  render,
  options = {
    dataset: true
}) {
  const actions = {};
  let $target;
  const cleanups = [];
  const NO_BUBBLING_EVENTS = [
    'blur',
    'focus',
    'focusin',
    'focusout',
    'pointerleave'
  ];

  const props = new Proxy(initialProps, {
    set: (target, key, value) => {
      Reflect.set(target, key, value);
    }
  });

  const state = new Proxy(initialValue, {
    set: (target, key, value) => {
      Reflect.set(target, key, value);
    },
  });

  function setTarget(_$target) {
    $target = _$target;

    if(options.dataset){
      const { getPropsFromDataset } = etUI.hooks.useDataset($target);
      const datasetProps = getPropsFromDataset();

      setProps({ ...props, ...datasetProps });
    }
  }

  function setProps(newProps) {
    Object.keys(newProps).forEach((key) => {
      props[key] = newProps[key];
    });
  }

  function setState(newState) {
    if(etUI.utils.shallowCompare(state, newState)) return;

    Object.keys(newState).forEach((key) => {
      state[key] = newState[key];
    });

    if (render) {
      render();
    }

    if (options.dataset) {
      const { setVarsFromDataset } = etUI.hooks.useDataset($target);
      setVarsFromDataset(state);
    }
  }

  function addEvent(eventType, selector, callback) {
    const $eventTarget = selector ? $target.querySelector(selector) : $target;

    if (NO_BUBBLING_EVENTS.includes(eventType)) {
      const cleanup = etUI.hooks.useEventListener($eventTarget, eventType, callback);
      return cleanups.push(cleanup);
    }

    const eventHandler = (event) => {
      let $eventTarget = event.target.closest(selector);

      if (!selector) {
        $eventTarget = event.target;
      }

      if ($eventTarget) {
        callback(event);
      }
    };

    $target.addEventListener(eventType, eventHandler);
    const cleanup = () => $target.removeEventListener(eventType, eventHandler);
    cleanups.push(cleanup);
  }

  function removeEvent() {
    cleanups.forEach((cleanup) => cleanup());
  }

  return {
    setTarget,
    actions,
    state,
    props,
    setState,
    setProps,
    addEvent,
    removeEvent,
  };
}
;


/**
 * useDataset
 * @param $target {HTMLElement}
 */
function useDataset($target) {
  let datasetProps = {},
    datasetVars = {};

  function getDatasetByPrefix(prefix) {
    const dataset = {};
    Object.keys($target.dataset).forEach((key) => {
      let value = $target.dataset[key];

      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if(typeof value === 'string' && value.includes('{')){
        value = JSON.parse(value);
      }

      dataset[etUI.utils.removePrefixCamelString(key, prefix)] = value;
    });

    return dataset;
  }

  function getDatasetExceptPrefix(prefix) {
    const dataset = {};
    Object.keys($target.dataset).forEach((key) => {
      let value = $target.dataset[key];

      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      dataset[etUI.utils.removePrefixCamelString(key, prefix)] = value;
    });

    return dataset;
  }

  function setDatasetByPrefix(data, prefix) {
    Object.keys(data).forEach((key) => {
      if(prefix){
        $target.dataset[`${prefix}${etUI.utils.capitalize(key)}`] = data[key];
      }else{
        $target.dataset[key] = data[key];
      }
    });
  }

  function getPropsFromDataset() {
    datasetProps = getDatasetByPrefix('props');

    return datasetProps;
  }

  function getVarsFromDataset() {
    datasetVars = getDatasetExceptPrefix('props');

    return datasetVars;
  }

  function setPropsFromDataset(props) {
    setDatasetByPrefix(props, 'props');
  }

  function setVarsFromDataset(vars) {
    setDatasetByPrefix(vars, '');
  }

  function setStringToObject(props) {
    // dataset에서 객체 형태인 스트링값 타입 객체로 바꿔줌
    for (const key in props) {
      if (!(typeof props[key] === 'boolean') && props[key].includes('{')) {
        props[key] = JSON.parse(props[key]);
      }
    }

    return props;
  }

  return {
    getPropsFromDataset,
    setPropsFromDataset,
    getVarsFromDataset,
    setVarsFromDataset,
    setStringToObject,
  };
}
;


function useDialog() {
  const alert = (...opts) => {
    const $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();

    if(typeof opts[0] === 'string'){
      dialog.core.init($layerWrap, { dialogType: 'alert', message: opts[0], callback: opts[1] });
    }else if(typeof opts[0] === 'object'){
      dialog.core.init($layerWrap, { dialogType: 'alert', ...opts[0] });
    }

    dialog.open();
  };

  const confirm = (...opts) => {
    const $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();

    if(typeof opts[0] === 'string'){
      dialog.core.init($layerWrap, { dialogType: 'confirm', message: opts[0], positiveCallback: opts[1] });
    }else if(typeof opts[0] === 'object'){
      dialog.core.init($layerWrap, { dialogType: 'confirm', ...opts[0] });
    }

    dialog.open();
  };

  const previewImage = (...opts) => {
    const $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();


    dialog.core.init($layerWrap, { dialogType: 'previewImage', ...opts[0] });

    dialog.open();
  }

  return {
    alert,
    confirm,
    previewImage
  };
}
;


function useDialogTmpl() {
  const $templateHTML = ({ dialogType, type, title, message, positiveText, negativeText }) => `
      <div class="dialog-dimm"></div>
      <div class="dialog-frame">
        <div class="dialog-container">
          <div class="dialog-header">
            ${title ? `<h3 class="dialog-tit">${title}</h3>` : ''}
          </div>
          <div class="dialog-content">
            ${dialogType === 'alert' ? `<span class="${type}">icon</span>` : ''}
            
            <p class="dialog-info">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="btn-group">
            ${dialogType === 'confirm' ? `<button type="button" class="btn dialog-negative">${negativeText}</button>` : ''}
            ${positiveText ? `<button type="button" class="btn dialog-positive btn-primary">${positiveText}</button>` : ''}
          </div>
        </div>
      </div>
    `;

    const $templatePreviewImageHTML = ({dialogType, images, title}) => `
      <div class="dialog-dimm"></div>
      <div class="dialog-frame">
        <div class="dialog-container">
          <div class="dialog-header">
            ${title ? `<h3 class="dialog-tit">${title}</h3>` : ''}
          </div>
          <div class="dialog-content">
            <div class="component-swiper" data-component="swiper">
              <!-- Additional required wrapper -->
              <div class="swiper-wrapper">
                ${images.map((image) => (`
                  <div class="swiper-slide">
                    <img src="${image.src}" alt="${image.alt}" />
                  </div>
                `)).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    return {
      $templateHTML,
      $templatePreviewImageHTML
    }
}
;


/**
 * useEventListener
 * @param target  {HTMLElement}
 * @param type  {string}
 * @param listener  {function}
 * @param options {object}
 * @returns {function(): *}
 */
function useEventListener(target, type, listener, options = {}){
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}
;


/**
 * getBoundingClientRect
 * @param { Element } parent
 * @param { String } selector
 * @returns
 */
function useGetClientRect(parent, selector) {
  const rect = parent.querySelector(selector)?.getBoundingClientRect();
  if (!rect) return {};
  else
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
    };
}
;


function useLayer(type = 'modal'){
  function getVisibleLayer(){
    const $layerComponents = Array.from(document.querySelector('.layer-wrap').children).filter(($el) => {
      const isModalComponent = $el.classList.contains('component-modal')
      const isDialogComponent = $el.classList.contains('component-dialog')

      return isModalComponent || isDialogComponent
    })

    return $layerComponents.filter(($el) => {
      const style = window.getComputedStyle($el);
      return style.display !== 'none'
    })
  }

  function getTopDepth(){
    const $visibleLayerComponents = getVisibleLayer()
    return 100 + $visibleLayerComponents.length
  }

  function setLayerOpacity(defaultOpacity = 0.5){
    const $visibleLayerComponents = getVisibleLayer()
    $visibleLayerComponents.forEach(($el, index) => {

      const opacity = etUI.utils.getBlendOpacity(defaultOpacity, $visibleLayerComponents.length)

      if($el.querySelector(`.modal-dimm`)){
        $el.querySelector(`.modal-dimm`).style.backgroundColor = `rgba(0, 0, 0, ${opacity})`
      }

      if($el.querySelector(`.dialog-dimm`)){
        $el.querySelector(`.dialog-dimm`).style.backgroundColor = `rgba(0, 0, 0, ${opacity})`
      }
    })
  }

  return {
    getVisibleLayer,
    getTopDepth,
    setLayerOpacity
  }
}
;


function useMutationState(){
  let $target, $ref = {
    $state: {}
  }, mutationObserver, render;

  function initMutationState(_$target, _render){
    $target = _$target
    render = _render;

    setMutationObserver()
    setStateByDataset()
  }

  function setStateByDataset(){
    const filteredDataset = {};
    const dataset = $target.dataset;

    Object.keys(dataset).forEach((key) => {
      if(key.startsWith('vars')){
        filteredDataset[key.replace('vars', '').toLowerCase()] = dataset[key];
      }
    })

    setState(filteredDataset)
    render();
  }

  function setMutationObserver(){
    const config = { attributes: true, childList: false, subtree: false };

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes"
          && mutation.attributeName !== 'style'
          && mutation.attributeName !== 'class'
        ) {
          setStateByDataset()
        }
      }
    };

    mutationObserver = new MutationObserver(callback);
    mutationObserver.observe($target, config);
  }

  function setState(newState){
    $ref.$state = { ...$ref.$state, ...newState };
  }

  function setDataState(newState) {
    const $newState = { ...$ref.$state, ...newState };

    Object.keys($newState).forEach((key) => {
      $target.dataset[`vars${etUI.utils.capitalize(key)}`] = $newState[key];
    })
  }

  return {
    $ref,
    setState,
    setDataState,
    initMutationState
  }
}
;


function useSelectBoxTemp() {
  const $templateCustomHTML = {
    label(text) {
      return `
        <div id="combo1-label" class="combo-label">${text}</div>
      `;
    },
    selectBtn(text) {
      return `
      <button type="button" id="combo1" class="select-box" role="combobox" aria-controls="listbox1" aria-expanded="false" aria-labelledby="combo1-label" aria-activedescendant="">
        <span style="pointer-events: none;">${text}</span>
      </button>
      `;
    },
    itemsWrap(itemsHTML) {
      return `
        <ul id="listbox1" class="select-options" role="listbox" aria-labelledby="combo1-label" tabindex="-1">
          ${itemsHTML}
        </ul>
      `;
    },
    items(item, selected = false) {
      return `
        <li role="option" class="option" aria-selected="${selected}" data-value="${item.value}">
          ${item.text}
        </li>
      `;
    },
  };

  const $templateBasicHTML = {
    label(text) {
      return `
        <div id="combo1-label" class="combo-label">${text}</div>
      `;
    },
    selectBtn(text) {
      return `
        <option value="" selected disabled hidden>${text}</option>
      `;
    },
    itemsWrap(itemsHTML) {
      return `
        <select class="select-list" required>
          ${itemsHTML}
        </select>
      `;
    },
    items(item, selected = false) {
      return `
        <option value="${item.value}">${item.text}</option>
      `;
    },
  };

  return {
    $templateCustomHTML,
    $templateBasicHTML,
  };
}
;


function useState(initialValue = {}, callback) {
  const state = new Proxy(initialValue, {
    set: (target, key, value) => {
      target[key] = value;

      if (callback) {
        callback(target);
      }
    }
  });

  const setState = (newState) => {
    Object.keys(newState).forEach((key) => {
      state[key] = newState[key];
    })
  }

  return [state, setState];
}
;


function useSwiperTmpl() {
  const $templateHTML = {
    navigation() {
      return `
        <button type="button" class="swiper-button-prev">이전</button>
        <button type="button" class="swiper-button-next">다음</button>
      `;
    },
    pagination() {
      return `
        <div class="swiper-pagination"></div>
      `;
    },
    autoplay() {
      return `
      <button type="button" class="swiper-autoplay play"></button>
      `;
    },

  };

  return {
    $templateHTML,
  };
}
;


/**
 * temp timeline
 * @returns
 */
function useTransition() {
  // select
  const useSelectShow = (target, type, option) => {
    if (!target) return;

    const timeline = gsap.timeline({ paused: true });

    const optionList = {
      fast: { duration: 0.1 },
      normal: { duration: 0.3 },
      slow: { duration: 0.7 },
    };
    let gsapOption = { ...optionList[type], ...option };

    timeline.to(target, {
      alpha: 0,
      ease: "linear",
      onComplete() {
        target.style.display = "none";
      },
      ...gsapOption,
    });

    return {
      timelineEl: timeline._recent.vars,
      timeline: (state) => {
        state ? ((target.style.display = "block"), timeline.reverse()) : timeline.play();
      },
    };
  };

  return {
    useSelectShow,
  };
}
;



etUI.hooks = {
	useClickOutside,
	useCore,
	useDataset,
	useDialog,
	useDialogTmpl,
	useEventListener,
	useGetClientRect,
	useLayer,
	useMutationState,
	useSelectBoxTemp,
	useState,
	useSwiperTmpl,
	useTransition
}
;


/**
 * @typedef {Object} PropsConfig
 * @property {boolean} disabled - 요소가 비활성화 상태인지를 나타냅니다.
 * @property {boolean} once - 이벤트나 액션을 한 번만 실행할지 여부를 결정합니다.
 * @property {false | number} duration - 애니메이션 또는 이벤트 지속 시간을 밀리초 단위로 설정합니다. 'false'일 경우 지속 시간을 무시합니다.
 * @property {Object} origin - 원점 또는 시작 지점을 나타내는 객체입니다.
 */

/**
 * @typedef {Object} StateConfig
 * @property {'close' | 'open'} state - 아코디언의 상태값. close, open 둘 중에 하나입니다.
 */

/** @type {PropsConfig} */
/** @type {StateConfig} */

function Accordion() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      defaultValue: 0,
      collapsible: false,
      animation: {
        duration: 0.5,
        easing: "power4.out",
      },
      type: "multiple",
    },
    {},
    render,
  );

  // constant

  // variable
  const name = "accordion";
  let component = {};
  // element, selector
  let accordionToggleBtn, accordionItem;
  let $target, $accordionContents, $accordionItem;

  {
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");

      // console.log($target);
    }

    function setup() {
      setupSelector();
      setupElement();
      setupActions();

      // state
      setState({ setting: "custom" });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute("data-init")) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  function setupSelector() {
    // selector
    accordionToggleBtn = ".accordion-tit";
    accordionItem = ".accordion-item";

    // element
    $accordionItem = $target.querySelector(accordionItem);
    $accordionContents = $target.querySelector(".accordion-content");
  }

  function setupElement() {
    // id
    const id = etUI.utils.getRandomUIID(name);

    $target.setAttribute("aria-expanded", false);
    $accordionContents.setAttribute("aria-hidden", true);
    $accordionContents.setAttribute("role", "region");
    $target.setAttribute("id", id);
    $target.setAttribute("aria-labelledby", id);
  }

  function setupActions() {
    const isCustom = props.setting === "custom";
    const { duration, easeing } = props.animation;

    actions.open = (target = $accordionItem) => {
      target.setAttribute("aria-expanded", true);
      if (!isCustom) {
        target.classList.add("show");
      } else {
        gsap.timeline().to(target, { duration: duration, ease: easeing, padding: "3rem" });
      }
    };

    actions.close = (target = $accordionItem) => {
      target.setAttribute("aria-expanded", false);
      if (!isCustom) {
        target.classList.remove("show");
      } else {
        gsap.timeline().to(target, { duration: duration, padding: "0 3rem" });
      }
    };

    actions.arrowUp = () => {
      console.log("keyup 콜백");
    };

    actions.arrowDown = () => {
      console.log("keyup 콜백");
    };
  }

  function setEvent() {
    const { type } = props;
    if (type === "single") {
      addEvent("click", accordionToggleBtn, ({ target }) => {
        const { parentElement } = target;
        singleToggleAccordion(parentElement);
      });
    } else {
      addEvent("click", accordionToggleBtn, ({ target }) => {
        toggleAccordion(target.parentElement);
      });
    }
  }

  function toggleAccordion(ele) {
    console.log(ele);
    const isOpen = state.state === "open";
    if (isOpen) {
      actions.close(ele);
      close();
    } else {
      actions.open(ele);
      open();
    }
  }

  function singleToggleAccordion(target) {
    const $clickedItem = target.parentElement;
    const $allTitles = $clickedItem.querySelectorAll(accordionToggleBtn);
    const $allItems = Array.from($allTitles).map((title) => title.parentElement);

    $allItems.forEach(($item) => {
      const $title = $item.querySelector(accordionToggleBtn);
      const $content = $title.nextElementSibling;
      if ($item === target) {
        if ($content.getAttribute("aria-hidden") === "true") {
          $content.setAttribute("aria-hidden", "false");
          $title.setAttribute("aria-expanded", "true");
          $item.classList.add("show");
          open();
        } else {
          $content.setAttribute("aria-hidden", "true");
          $title.setAttribute("aria-expanded", "false");
          $item.classList.remove("show");
          close();
        }
      } else {
        $content.setAttribute("aria-hidden", "true");
        $title.setAttribute("aria-expanded", "false");
        $item.classList.remove("show");
      }
    });
  }

  function render() {
    const isShow = state.state === "open";
    // etUI.utils.setProperty($target, accordionItem, "aria-expanded", isShow);
    isShow ? open() : close();
  }

  function open() {
    setState({ state: "open" });
  }

  function close() {
    setState({ state: "close" });
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    update,
    open,
    close,
  };

  return component;
}
;


/**
 *  Modal
 */
function Dialog() {
  const {
    actions, props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({
      // props
      dimmClick: true,
      esc: true,
      title: null,
      message: '',
      type: 'alert',
      positiveText: '확인',
      negativeText: '취소',
    }, {
      state: 'close',
      trigger: null
    }, render, {
      dataset: false,
    },
  );

  // constant
  const DIMM_OPACITY = 0.6;

  // variable
  const name = 'dialog';
  let component = {};
  let modalDimmSelector,
    modalCloseBtnSelector,
    modalBtnPositive,
    modalBtnNegative;
  let $target,
    $modal,
    $modalTitle, $modalContainer, $modalDimm,
    $modalBtnPositive, $modalBtnNegative,
    focusTrapInstance,
    callback;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === 'string') {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error('target이 존재하지 않습니다.');
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      // $target.setAttribute('data-init', 'true');
    }

    function setup() {
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // focus trap
      focusTrapInstance = focusTrap.createFocusTrap($target, {
        escapeDeactivates: props.esc,
        onActivate: actions.focusActivate,
        onDeactivate: actions.focusDeactivate
      });

      // state
      // setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
    }
  }

  // frequency
  function setupTemplate() {
    const { $templateHTML, $templatePreviewImageHTML } = etUI.hooks.useDialogTmpl()
    const template = document.createElement('div');


    if(props.dialogType === 'alert' || props.dialogType === 'confirm'){
      template.classList.add('component-dialog');
      template.innerHTML = $templateHTML(props);
    }else if(props.dialogType === 'previewImage'){
      template.classList.add('component-dialog');
      template.classList.add('dialog-preview-image');
      template.innerHTML = $templatePreviewImageHTML(props);
    }

    $modal = template;
    $target.appendChild(template);
    // $target.innerHTML = ``;
  }

  function setupSelector() {
    // selector
    modalCloseBtnSelector = '.dialog-close';
    modalDimmSelector = '.dialog-dimm';

    // element
    $modalTitle = $modal.querySelector('.dialog-tit');
    $modalDimm = $modal.querySelector(modalDimmSelector);
    $modalContainer = $modal.querySelector('.dialog-container');

    modalBtnPositive = '.dialog-positive';
    modalBtnNegative = '.dialog-negative';
    $modalBtnPositive = $modal.querySelector('.dialog-positive');
    $modalBtnNegative = $modal.querySelector('.dialog-negative');
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit');
    // // a11y

    if(props.dialogType === 'alert' || props.dialogType === 'confirm'){
      etUI.utils.setProperty($modal, 'role', 'alertdialog');
    }else if(props.dialogType === 'previewImage'){
      etUI.utils.setProperty($modal, 'role', 'dialog');

      const $swiper = $modal.querySelector('.component-swiper')
      const swiper = new etUI.components.SwiperComp();
      swiper.core.init($swiper, {
        navigation: true,
        pagination: true
      })
    }

    etUI.utils.setProperty($modal, 'aria-modal', 'true');
    etUI.utils.setProperty($modal, 'id', id);
    if ($modalTitle) etUI.utils.setProperty($modalTitle, 'id', titleId);
    etUI.utils.setProperty($modal, 'aria-labelledby', titleId);
    etUI.utils.setProperty($modal, 'tabindex', '-1');
  }

  function setupActions() {
    const { getTopDepth, setLayerOpacity } = etUI.hooks.useLayer('dialog');

    actions.focusActivate = () => {
    }

    actions.focusDeactivate = () => {
      if(!state.trigger){
        callback = props.negativeCallback
      }
      actions.close();
    }

    actions.open = () => {
      const zIndex = getTopDepth();

      $modal.style.display = 'block';
      $modal.style.zIndex = zIndex

      setLayerOpacity(DIMM_OPACITY);

      gsap.timeline().to($modalDimm, { duration: 0, display: 'block', opacity: 0 }).to($modalDimm, {
        duration: 0.15,
        opacity: 1,
      });

      gsap
        .timeline()
        .to($modalContainer, {
          duration: 0,
          display: 'block',
          opacity: 0,
          scale: 0.95,
          yPercent: 2,
        })
        .to($modalContainer, { duration: 0.15, opacity: 1, scale: 1, yPercent: 0, ease: 'Power2.easeOut' });
    };

    actions.close = () => {
      gsap.timeline().to($modalDimm, {
        duration: 0.15,
        opacity: 0,
        onComplete() {
          $modalDimm.style.display = 'none';
        },
      });

      gsap.timeline().to($modalContainer, {
        duration: 0.15,
        opacity: 0,
        scale: 0.95,
        yPercent: 2,
        ease: 'Power2.easeOut',
        onComplete() {
          $modalContainer.style.display = 'none';
          $modal.style.display = 'none';
          $modal.style.zIndex = null

          setLayerOpacity(DIMM_OPACITY);

          if (callback) {
            callback();
          }
          destroy();

          $target.removeChild($modal);
        },
      });
    };
  }

  function setEvent() {
    addEvent('click', modalCloseBtnSelector, close);

    if (props.dimmClick) {
      addEvent('click', modalDimmSelector, close);
    }

    addEvent('click', modalBtnPositive, () => {
      if (props.callback) {
        callback = props.callback;
      } else if (props.positiveCallback) {
        callback = props.positiveCallback;
      }

      close('btnPositive');
    });
    addEvent('click', modalBtnNegative, () => {
      callback = props.negativeCallback;

      close('btnNegative');
    });
  }

  function render() {
    const isOpened = state.state === 'open';

    if (isOpened) {
      actions.open();

      focusTrapInstance.activate();
    } else {
      focusTrapInstance.deactivate();
    }
  }

  function open() {
    setState({ state: 'open' });
  }

  function close(trigger) {
    setState({ state: 'close', trigger });
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },
    update,
    open,
    close,
  };

  return component;
}
;


/**
 *  Modal
 */
function Modal() {
  const {
    actions,
    props,
    state,
    setProps,
    setState,
    setTarget,
    addEvent,
    removeEvent,
  } = etUI.hooks.useCore(
    {
      // props
      dimmClick: true,
      esc: true,
    },
    {
      // state
    },
    render,
  );

  // constant
  const DIMM_OPACITY = 0.6;

  // variable
  const name = "modal";
  let component = {};

  let focusTrapInstance, modalDimmSelector, modalCloseBtnSelector;
  let $target, $html, $modalTitle, $modalContainer, $modalDimm;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");
    }

    function setup() {
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // focus trap
      focusTrapInstance = focusTrap.createFocusTrap($target, {
        escapeDeactivates: props.esc,
        onActivate: actions.focusActivate,
        onDeactivate: actions.focusDeactivate,
      });

      // state
      // setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (
        _props &&
        etUI.utils.shallowCompare(props, _props) &&
        !$target.getAttribute("data-init")
      )
        return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector() {
    // selector
    modalCloseBtnSelector = ".modal-close";
    modalDimmSelector = ".modal-dimm";

    // element
    $modalTitle = $target.querySelector(".modal-tit");
    $modalDimm = $target.querySelector(modalDimmSelector);
    $modalContainer = $target.querySelector(".modal-container");
    $html = document.documentElement;
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + "-tit");

    // a11y
    etUI.utils.setProperty($target, "role", "dialog");
    etUI.utils.setProperty($target, "aria-modal", "true");
    etUI.utils.setProperty($target, "id", id);
    if ($modalTitle) etUI.utils.setProperty($modalTitle, "id", titleId);
    etUI.utils.setProperty($target, "aria-labelledby", titleId);
    etUI.utils.setProperty($target, "tabindex", "-1");
  }

  function setupActions() {
    const { getTopDepth, setLayerOpacity } = etUI.hooks.useLayer("modal");

    actions.focusActivate = () => {};

    actions.focusDeactivate = () => {
      close();
      // actions.close();
    };

    actions.open = () => {
      const zIndex = getTopDepth();

      document.body.style.overflow = "hidden";

      $target.style.display = "block";
      $target.style.zIndex = zIndex;

      setLayerOpacity(DIMM_OPACITY);

      gsap
        .timeline()
        .to($modalDimm, { duration: 0, display: "block", opacity: 0 })
        .to($modalDimm, { duration: 0.15, opacity: 1 });

      gsap
        .timeline()
        .to($modalContainer, {
          duration: 0,
          display: "block",
          opacity: 0,
          scale: 0.95,
          yPercent: 2,
        })
        .to($modalContainer, {
          duration: 0.15,
          opacity: 1,
          scale: 1,
          yPercent: 0,
          ease: "Power2.easeOut",
        });
    };

    actions.close = () => {
      document.body.style.overflow = "";

      gsap.timeline().to($modalDimm, {
        duration: 0.15,
        opacity: 0,
        onComplete() {
          $modalDimm.style.display = "none";
        },
      });

      gsap.timeline().to($modalContainer, {
        duration: 0.15,
        opacity: 0,
        scale: 0.95,
        yPercent: 2,
        ease: "Power2.easeOut",
        onComplete() {
          $modalContainer.style.display = "none";
          $target.style.display = "none";
          $target.style.zIndex = null;

          setLayerOpacity(DIMM_OPACITY);
        },
      });
    };
  }

  function setEvent() {
    addEvent("click", modalCloseBtnSelector, close);

    if (props.dimmClick) {
      addEvent("click", modalDimmSelector, close);
    }
  }

  function render() {
    const isOpened = state.state === "open";

    if (isOpened) {
      actions.open();

      focusTrapInstance.activate();
    } else {
      actions.close();

      focusTrapInstance.deactivate();
    }
  }

  function open() {
    setState({ state: "open" });
  }

  function close() {
    setState({ state: "close" });
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },
    update,
    open,
    close,
  };

  return component;
}
;


function SelectBox() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      type: "custom",
      label: "",
      default: "",
      items: [],
      selectedIndex: 0,
      transition: "normal",
      scrollTo: false,
      gsapOption: {},
      state: "close",
    },
    {},
    render,
  );
  const { $templateCustomHTML, $templateBasicHTML } = useSelectBoxTemp();
  const { useSelectShow } = useTransition();

  // constant
  const MARGIN = 20;

  // variable
  const name = "select";
  // eslint-disable-next-line prefer-const
  let component = {};
  let $target,
    // 요소관련 변수들
    selectLabel,
    selectComboBox,
    selectListBox,
    selectOption,
    timeline;

  {
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");
    }

    function setup() {
      setupTemplate();

      if (props.type === "basic") return;

      setupSelector();
      setupElement();
      setupActions();

      // effect
      timeline = useSelectShow($target.querySelector(selectListBox), props.transition, props.gsapOption).timeline;

      // state
      actions[props.state || state.state]?.();
    }

    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute("data-init")) return;
      destroy();
      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  // frequency
  function setupTemplate() {
    if (props.items.length < 1) return;
    if (props.type === "custom") {
      const { selectedIndex } = props;
      const itemListTemp = props.items.map((item) => $templateCustomHTML.items(item)).join("");

      $target.innerHTML = `
        ${props.label && $templateCustomHTML.label(props.label)}
        ${props.default ? $templateCustomHTML.selectBtn(props.default) : $templateCustomHTML.selectBtn(props.items.find((item) => item.value == props.items[selectedIndex].value).text)}
        ${props.items && $templateCustomHTML.itemsWrap(itemListTemp)}
      `;
    } else {
      const selectBtnTemp = $templateBasicHTML.selectBtn(props.default);
      const itemListTemp = props.items.map((item) => $templateBasicHTML.items(item)).join("");

      $target.innerHTML = `
        ${props.label && $templateBasicHTML.label(props.label)}
        ${props.items && $templateBasicHTML.itemsWrap(selectBtnTemp + itemListTemp)}
      `;
    }
  }
  function setupSelector() {
    selectLabel = ".combo-label";
    selectComboBox = ".select-box";
    selectListBox = ".select-options";
    selectOption = ".option";
  }

  function setupElement() {
    // id
    const labelId = etUI.utils.getRandomUIID(name);
    const comboBoxId = etUI.utils.getRandomUIID("combobox");
    const listBoxId = etUI.utils.getRandomUIID("listbox");

    // a11y
    etUI.utils.setProperty($target, selectLabel, "id", labelId);
    etUI.utils.setProperty($target, selectComboBox, "id", comboBoxId);
    etUI.utils.setProperty($target, selectComboBox, "role", "combobox");
    etUI.utils.setProperty($target, selectComboBox, "aria-labelledby", labelId);
    etUI.utils.setProperty($target, selectComboBox, "aria-controls", listBoxId);
    etUI.utils.setProperty($target, selectListBox, "id", listBoxId);
    etUI.utils.setProperty($target, selectListBox, "role", "listbox");
    etUI.utils.setProperty($target, selectListBox, "aria-labelledby", labelId);
    etUI.utils.setProperty($target, selectListBox, "tabindex", -1);

    // select property
    const options = $target.querySelectorAll(selectOption);
    options.forEach((el, index) => {
      const optionId = etUI.utils.getRandomUIID("option");

      $target[index] = el;
      el["index"] = index;
      el.setAttribute("id", optionId);
      el.setAttribute("role", "option");
      el.setAttribute("aria-selected", false);

      props.items[index]?.disabled && el.setAttribute("disabled", "");

      if (!$target["options"]) $target["options"] = [];
      $target["options"][index] = el;
    });

    !props.default && selectItem(options[props.selectedIndex]);
  }

  function setupActions() {
    let selectIndex = isNaN($target.selectedIndex) ? -1 : $target.selectedIndex;

    function updateIndex(state) {
      if (!state) return;
      selectIndex = isNaN($target.selectedIndex) ? -1 : $target.selectedIndex;
      updateCurrentClass($target[selectIndex]);
    }

    function keyEventCallback() {
      updateCurrentClass($target[selectIndex]);
      etUI.utils.setProperty($target, selectComboBox, "aria-activedescendant", $target[selectIndex].id);
      $target.querySelector(`${selectComboBox} :last-child`).textContent = $target[selectIndex].textContent;
    }

    actions.open = () => {
      $target.querySelector(selectComboBox)?.focus();
      openState();
      updateIndex(true);
    };
    actions.close = () => {
      $target.querySelector(`${selectComboBox} :last-child`).textContent = $target["options"][$target.selectedIndex]?.textContent ?? props.default;
      closeState();
    };
    actions.select = () => {
      const currentEl = $target.querySelector(".current");
      selectItem(currentEl);
      closeState();
    };

    actions.first = () => {
      selectIndex = 0;
      keyEventCallback();
    };
    actions.last = () => {
      selectIndex = $target["options"].length - 1;
      keyEventCallback();
    };
    actions.up = () => {
      selectIndex = Math.max(--selectIndex, 0);
      keyEventCallback();
    };
    actions.down = () => {
      selectIndex = Math.min(++selectIndex, $target["options"].length - 1);
      keyEventCallback();
    };

    component.open = actions.open;
    component.close = actions.close;
  }

  function setEvent() {
    if (props.type === "basic") return;

    // a11y
    const actionList = {
      up: ["ArrowUp"],
      down: ["ArrowDown"],
      first: ["Home", "PageUp"],
      last: ["End", "PageDown"],
      close: ["Escape"],
      select: ["Enter", " "],
    };

    addEvent("blur", selectComboBox, (e) => {
      if (e.relatedTarget?.role === "listbox") return;
      actions.close();
    });

    addEvent("click", selectComboBox, ({ target }) => {
      const toggleState = state.state === "open" ? "close" : "open";
      actions[toggleState]?.();
    });

    // a11y
    addEvent("keydown", selectComboBox, (e) => {
      if (state.state === "close") return;

      const { key } = e;
      const action = Object.entries(actionList).find(([_, keys]) => keys.includes(key));

      if (action) {
        e.preventDefault();
        const [actionName] = action;
        actions[actionName]?.();
      }
    });

    addEvent("click", selectListBox, ({ target }) => {
      if (!target.role === "option") return;
      updateCurrentClass(target);
      actions.select();
    });
  }

  function render() {
    const isOpened = state.state === "open";

    props.transition && timeline(isOpened);
    checkOpenDir(isOpened);

    etUI.utils.setProperty($target, selectComboBox, "aria-expanded", isOpened);

    const selectedEl = $target.querySelector('[aria-selected="true"]');
    if (isOpened) etUI.utils.setProperty($target, selectComboBox, "aria-activedescendant", selectedEl?.id ?? "");
    else etUI.utils.setProperty($target, selectComboBox, "aria-activedescendant", "");
  }

  // custom
  function checkOpenDir(state) {
    if (!state || props.scrollTo) return; // false이거나 scrollTo 기능 있을 때 - 아래로 열림

    const { height: listHeight } = etUI.hooks.useGetClientRect($target, selectListBox);
    const { height: comboHeight, bottom: comboBottom } = etUI.hooks.useGetClientRect($target, selectComboBox);
    const role = window.innerHeight - MARGIN < comboBottom + listHeight;

    etUI.utils.setStyle($target, selectListBox, "bottom", role ? comboHeight + "px" : "");
  }

  // update .current class
  function updateCurrentClass(addClassEl) {
    $target.querySelector(".current")?.classList.remove("current");
    addClassEl?.classList.add("current");
  }

  // select item
  function selectItem(target) {
    const targetOption = target?.closest(selectOption);

    if (!targetOption) return;

    $target.selectedIndex = targetOption["index"];
    $target.value = targetOption.getAttribute("data-value");

    etUI.utils.setProperty($target, '[aria-selected="true"]', "aria-selected", false);
    targetOption.setAttribute("aria-selected", true);

    updateCurrentClass($target.querySelector('[aria-selected="true"]'));
    $target.querySelector(`${selectComboBox} :last-child`).textContent = targetOption.textContent;
  }

  // select state
  function openState() {
    setState({ state: "open" });
  }

  function closeState() {
    setState({ state: "close" });
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },

    update,
    open,
    close,
  };

  return component;
}
;


/**
 * Skel
 * // init, setup, update, destroy
 * // setupTemplate, setupSelector, setupElement, setupActions,
 *      setEvent, render, customFn, callable
 *
 *      dom만 이용해서 ui 초기화
 *        data-props-opt1, data-props-opt2, data-props-opt3
 *      고급옵션
 *        data-init=false
 *        const instance = new Skel();
 *        instance.core.init('.selector', { opt1: 'value' })
 *
 *      data-init 처리
 */
function Skel() {
  const {
    actions, props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({
    // props

  }, {
    // state

  }, render);

  // constant
  const MARGIN = 20;

  // variable
  const name = 'skel';
  // eslint-disable-next-line prefer-const
  let component = {};
    // element, selector
  let $target,
    someSelector, otherSelector,
    $targetEls1, $targetEls2

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if(typeof _$target === 'string'){
        $target = document.querySelector(_$target)
      }else{
        $target = _$target;
      }

      if(!$target){
        throw Error('target이 존재하지 않습니다.');
      }

      setTarget($target)
      setProps({...props, ..._props});

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute('data-init', 'true');
    }

    function setup() {
      // template, selector, element, actions
      setupTemplate();
      setupSelector()
      setupElement();
      setupActions();

      // state
      setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute('data-init');
    }
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector(){
    $targetEls2 = '.el2';
    $targetEls1 = '.el1';
  }

  function setupElement() {
    // id
    const labelId = etUI.utils.getRandomUIID(name);

    // a11y
    utils.setProperty($target, $selectLabel, 'id', labelId);

    // component custom element
  }

  function setupActions(){
    actions.open = () => {

    }

    actions.close = () => {

    }
  }

  function setEvent() {
    addEvent('click', $targetEls1, ({ target }) => {
      // handler
    });
  }

  function render() {
    // render
  }

  function open() {
  }

  function close() {
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    // callable
    update,
    open,
    close,
  }

  return component;
}
;


function SwiperComp() {
  const {
    actions, props, state, setState, setProps, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore(
    {
      loop: true,
      on: {
        slideChangeTransitionEnd() {
          // console.log(`${this.realIndex + 1}번 째 slide`);
          setState({ activeIndex: this.realIndex + 1 });
        },
      },
    },
    {
      state: "",
      running: "",
      activeIndex: 0,
    },
    render,
  );

  /**
   * data-props 리스트
   */

  // constant
  const MARGIN = 20;

  // variable
  const name = "swiper";
  let component = {};
  // element, selector
  let $target, $swiper, $swiperNavigation, $swiperPagination, $swiperAutoplay, $swiperSlideToButton;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");
    }

    function setup() {
      // template, selector, element, actions
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // state
      setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (props && utils.shallowCompare(props, _props) && !$target.getAttribute("data-init")) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  // frequency
  function setupTemplate() {
    const { navigation, pagination, autoplay } = props;
    const { $templateHTML } = useSwiperTmpl();
    let navigationEl, paginationEl, autoplayEl;

    function createHTMLElement(_className, htmlString) {
      const template = document.createElement("div");
      template.classList.add(_className);
      template.innerHTML = htmlString;
      return template;
    }

    if (navigation) {
      navigationEl = createHTMLElement("swiper-navigation", $templateHTML.navigation());
      $target.querySelector(".swiper-wrapper").after(navigationEl);
      typeof navigation === "boolean" &&
        setProps({
          navigation: {
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          },
        });
    }

    if (pagination) {
      paginationEl = createHTMLElement("swiper-pagination-wrap", $templateHTML.pagination());
      $target.querySelector(".swiper-wrapper").after(paginationEl);
      typeof pagination === "boolean" &&
        setProps({
          pagination: {
            el: ".swiper-pagination",
          },
        });
    }

    if (autoplay) {
      autoplayEl = createHTMLElement("swiper-autoplay-wrap", $templateHTML.autoplay());
      $target.querySelector(".swiper-wrapper").after(autoplayEl);
    }
  }

  function setupSelector() {
    $swiperPagination = ".swiper-pagination";
    $swiperNavigation = ".swiper-navigation";
    $swiperAutoplay = ".swiper-autoplay";
  }

  function setupElement() {
    // id

    // a11y

    // new Swiper 생성
    $swiper = new Swiper($target, { ...props });
  }

  function setupActions() {
    // actions.start = () => {
    //   play();
    // };
    //
    // actions.stop = () => {
    //   stop();
    // };
  }

  function setEvent() {
    // autoplay 버튼
    if (props.autoplay) {
      addEvent("click", $swiperAutoplay, (event) => {
        const $eventTarget = event.target.closest($swiperAutoplay);
        handleAutoplay($eventTarget);
      });
    }
  }

  function render() {
    // render
  }

  // autoplay 관련 커스텀 함수
  function handleAutoplay($target) {
    $target.classList.toggle("play");
    $target.classList.toggle("stop");

    if ($target.classList.contains("stop")) {
      stop();
    } else if ($target.classList.contains("play")) {
      play();
    }
  }

  function play() {
    $swiper.autoplay.start();
  }

  function stop() {
    $swiper.autoplay.stop();
  }

  // 특정 슬라이드로 이동
  function moveToSlide(index, speed, runCallbacks) {
    if (props.loop) {
      $swiper.slideToLoop(index, speed, runCallbacks);
    } else {
      $swiper.slideTo(index);
    }
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },
    // callable
    update,
    getSwiperInstance() {
      return $swiper; // $swiper 인스턴스 반환
    },
  };

  return component;
}
;


/**
 * Skel
 * // init, setup, update, destroy
 * // setupTemplate, setupSelector, setupElement, setupActions,
 *      setEvent, render, customFn, callable
 */
function Tab() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      // props
    },
    {
      // state
    },
    render,
  );

  // variable
  const name = "tab";
  // eslint-disable-next-line prefer-const
  let component = {};
  // element, selector
  let $target, tabHead, $tabHeadEl, tabBtn, $tabBtnEl, tabContent, $tabContentEl;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");
    }

    function setup() {
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // effect
      props.sticky && stickyTab();

      // state
      setState({ activeValue: props.active ?? $tabBtnEl[0].getAttribute("data-tab-value") });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute("data-init")) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector() {
    // selector
    tabHead = ".tab-head";
    tabBtn = ".tab-label";
    tabContent = ".tab-content";

    // element
    $tabHeadEl = $target.querySelector(tabHead);
    $tabBtnEl = $target.querySelectorAll(tabBtn);
    $tabContentEl = $target.querySelectorAll(tabContent);
  }

  function setupElement() {
    // id
    // a11y
    etUI.utils.setProperty($target, tabHead, "role", "tablist");

    // component custom element
    $tabHeadEl.style.touchAction = "none";
    $tabBtnEl.forEach((tab, index) => {
      const tabBtnId = etUI.utils.getRandomUIID(name);
      const tabContentId = etUI.utils.getRandomUIID("tabpanel");

      tab.setAttribute("id", tabBtnId);
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", false);

      if ($tabContentEl[index]) {
        $tabContentEl[index].setAttribute("id", tabContentId);
        $tabContentEl[index].setAttribute("role", "tabpanel");
      }

      const tabValue = tab.getAttribute("data-tab-value");
      const tabContentValue = $tabContentEl[index].getAttribute("data-tab-value");
      etUI.utils.setProperty($target, `${tabContent}[data-tab-value="${tabValue}"]`, "aria-labelledby", tab.id);
      etUI.utils.setProperty($target, `${tabBtn}[data-tab-value="${tabContentValue}"]`, "aria-controls", $tabContentEl[index].id);
    });
  }

  function setupActions() {
    let startX = 0;
    let endX = 0;
    let moveX = 0;
    let scrollLeft = 0;
    let isReadyMove = false;
    let clickable = true;

    actions.select = (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest(tabBtn);
      if (!targetBtn) return;
      if (!clickable) return;
      setState({ activeValue: targetBtn.getAttribute("data-tab-value") });
      gsap.to($tabHeadEl, {
        duration: 0.5,
        scrollLeft: targetBtn.offsetLeft,
        overwrite: true,
      });
    };

    actions.dragStart = (e) => {
      e.stopPropagation();
      if (isReadyMove) return;
      isReadyMove = true;
      startX = e.x;
      scrollLeft = $tabHeadEl.scrollLeft;
    };
    actions.dragMove = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;
      moveX = e.x;
      $tabHeadEl.scrollLeft = scrollLeft + (startX - moveX);
    };
    actions.dragEnd = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;
      endX = e.x;
      if (Math.abs(startX - endX) < 10) clickable = true;
      else clickable = false;
      isReadyMove = false;
    };
    actions.dragLeave = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;

      // gsap.to($tabHeadEl, {
      //   scrollLeft: $target.querySelector('[aria-selected="true"]').offsetLeft,
      //   overwrite: true,
      // });

      clickable = true;
      isReadyMove = false;
    };

    actions.up = (e) => {
      if (!e.target.previousElementSibling) return;
      setState({ activeValue: e.target.previousElementSibling.getAttribute("data-tab-value") });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.down = (e) => {
      if (!e.target.nextElementSibling) return;
      setState({ activeValue: e.target.nextElementSibling.getAttribute("data-tab-value") });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.first = () => {
      setState({ activeValue: $tabBtnEl[0].getAttribute("data-tab-value") });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.last = () => {
      setState({ activeValue: $tabBtnEl[$tabBtnEl.length - 1].getAttribute("data-tab-value") });
      focusTargetValue(tabBtn, state.activeValue);
    };

    function focusTargetValue(el, value) {
      const focusTarget = $target.querySelector(`${el}[data-tab-value="${value}"]`);
      focusTarget?.focus();
    }
  }

  function setEvent() {
    const actionList = {
      up: ["ArrowLeft"],
      down: ["ArrowRight"],
      first: ["Home"],
      last: ["End"],
      select: ["Enter", " "],
    };

    addEvent("click", tabHead, actions.select);
    addEvent("pointerdown", tabHead, actions.dragStart);
    addEvent("pointermove", tabHead, actions.dragMove);
    addEvent("pointerup", tabHead, actions.dragEnd);
    addEvent("pointerleave", tabHead, actions.dragLeave);

    addEvent("keydown", tabHead, (e) => {
      const { key } = e;
      const action = Object.entries(actionList).find(([_, keys]) => keys.includes(key));

      if (action) {
        e.preventDefault();
        e.stopPropagation();
        const [actionName] = action;
        actions[actionName]?.(e);
      }
    });
  }

  function render() {
    const getId = $target.querySelector(`${tabBtn}[aria-selected="true"]`)?.id;

    etUI.utils.setProperty($target, '[aria-selected="true"]', "aria-selected", false);
    etUI.utils.setProperty($target, `${tabBtn}[data-tab-value="${state.activeValue}"]`, "aria-selected", true);

    $target.querySelector(`${tabContent}[aria-labelledby="${getId}"]`)?.classList.remove("show");
    $target.querySelector(`${tabContent}[data-tab-value="${state.activeValue}"]`)?.classList.add("show");
  }

  // custom
  function stickyTab() {
    const { bottom } = etUI.hooks.useGetClientRect(document, props.sticky);

    $target.style.position = "relative";
    $tabHeadEl.style.position = "sticky";
    if (!bottom) $tabHeadEl.style.top = 0 + "px";
    else $tabHeadEl.style.top = bottom + "px";
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },
    update,
  };

  return component;
}

/*
document.addEventListener("DOMContentLoaded", function () {
  const $tabBox = document.querySelectorAll('[data-component="tab"]');
  $tabBox.forEach((tabBox) => {
    const tab = Tab();
    tab.core.init(tabBox);
  });
});
*/
;


// props는 유저(작업자)가 정의할 수 있는 옵션
// state는 내부 로직에서 작동되는 로직 (ex: state open close aria 등등.... )

// 타입 정의

/**
 * @typedef {Object} TooltipPropsConfig
 * @property {boolean} disabled - 요소가 비활성화 상태인지를 나타냅니다.
 * @property {boolean} once - 이벤트나 액션을 한 번만 실행할지 여부를 결정합니다.
 * @property {false | number} duration - 애니메이션 또는 이벤트 지속 시간을 밀리초 단위로 설정합니다. 'false'일 경우 지속 시간을 무시합니다.
 * @property {Object} origin - 원점 또는 시작 지점을 나타내는 객체입니다.
 */

/**
 * @typedef {Object} TooltipStateConfig
 * @property {'close' | 'open'} state - 툴팁의 상태값. close, open 둘 중에 하나입니다.
 * @property {'bottom' | 'top' | 'left' | 'right'} position - 툴팁의 위치값. bottom, top, left, right 중에 하나입니다.
 */

function Tooltip() {
  const {
    props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({

  }, {

  }, render);

  // state 변경 시 랜더 재호출
  const name = 'tooltip';
  let component = {};
    /** @type {TooltipPropsConfig} */
    /** @type {TooltipStateConfig} */
    // 요소관련 변수들
  let $target,
    $tooltipTriggerBtn,
    $tooltipCloseBtn,
    $tooltipContainer;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === 'string') {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error('target이 존재하지 않습니다.');
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = this;

      setup();
      setEvent();

      $target.setAttribute('data-init', 'true');
    }

    function setup() {
      setupSelector();
      setupElement();

      // focus trap
      focusTrapInstance = focusTrap.createFocusTrap($target, {
        onActivate: () => {},
        onDeactivate: () => {
          close();
        },
      });

      // state
      setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
    }
  }

  // frequency
  function setupSelector() {
    // element
    $tooltipContainer = $target.querySelector('.tooltip-container');

    // selecotr
    $tooltipTriggerBtn = '.tooltip-btn';
    $tooltipCloseBtn = '.btn-close';
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit');

    // a11y
    $target.setAttribute('id', id);
    $target.setAttribute('aria-expanded', 'false');
    $target.setAttribute('aria-controls', titleId);
  }

  function setEvent() {
    addEvent('click', $tooltipTriggerBtn, open);
    addEvent('click', $tooltipCloseBtn, close);
  }

  function render() {
    const { type } = props;
    const isShow = state.state === 'open';
    const expanded = $tooltipContainer.getAttribute('aria-expanded') === 'true';
    const $closeBtn = $target.querySelector($tooltipCloseBtn);

    $tooltipContainer.setAttribute('aria-expanded', !expanded);
    $tooltipContainer.setAttribute('aria-hidden', expanded);
    if (isShow) {
      handleOpenAnimation(type);
      $closeBtn.focus();
    } else {
      handleCloseAnimation(type);
      $closeBtn.setAttribute('aria-expanded', 'false');
      $tooltipContainer.setAttribute('aria-hidden', 'true');
    }
  }

  function handleOpenAnimation(type) {
    const setAnimation = { duration: 0, display: 'none', opacity: 0 };
    const scale = props.transform.scale.x;
    if (type === 'default') {
      gsap.timeline().to($tooltipContainer, setAnimation).to($tooltipContainer, { duration: props.duration, display: 'block', opacity: 1 });
    }

    if (type === 'custom') {
      gsap.timeline().to($tooltipContainer, setAnimation).to($tooltipContainer, { duration: props.duration, scale: 1, display: 'block', opacity: 1 });
    }
  }

  function handleCloseAnimation(type) {
    const scale = props.transform.scale.x;
    if (type === 'default') {
      gsap.timeline().to($tooltipContainer, { duration: props.duration, display: 'none', opacity: 0 });
    }
    if (type === 'custom') {
      gsap.timeline().to($tooltipContainer, { duration: props.duration, scale: scale, display: 'none', opacity: 0 });
    }
  }

  function open() {
    if (state.state !== 'open') {
      setState({ state: 'open' });
    }
  }

  function close() {
    if (state.state !== 'close') {
      setState({ state: 'close' });
    }
  }

  component = {
    core: {
      init,
      destroy,
      removeEvent,
    },

    update,
    open,
    close,
  }

  return component;
}

// document.addEventListener("DOMContentLoaded", function () {
//   const $tooltipSelector = document?.querySelectorAll(".component-tooltip");
//   $tooltipSelector.forEach((tooltip) => {
//     const tooltipComponent = Tooltip();
//     tooltipComponent.init(tooltip);
//   });
// });

// 기타 옵션들...
// duration: 300,
// height: 200,
// transform: {
//   scale: {
//     x: 1,
//     y: 1,
//   },
//   translate: {
//     x: 0,
//     y: 90,
//   },
//   delay: 0,
//   easeing: "ease-out",
// },

/**
 * Skel
 * // init, setup, update, addEvent, removeEvent, destroy
 * // template, setupSelector, setupElement, setEvent, render, customFn, callable
 */
;



etUI.components = {
	Accordion,
	Dialog,
	Modal,
	SelectBox,
	Skel,
	SwiperComp,
	Tab,
	Tooltip
}
;


// init js
function initUI() {
  const componentList = [
    {
      selector: ".component-modal",
      fn: etUI.components.Modal,
    },
    {
      selector: ".component-accordion",
      fn: etUI.components.Accordion,
    },
    {
      selector: ".component-tooltip",
      fn: etUI.components.Tooltip,
    },
    {
      selector: '[data-component="tab"]',
      fn: etUI.components.Tab,
    },
    {
      selector: '[data-component="select-box"]',
      fn: etUI.components.SelectBox,
    },
    {
      selector: '[data-component="swiper"]',
      fn: etUI.components.SwiperComp,
    },
  ];

  componentList.forEach(({ selector, fn }) => {
    // console.log(fn);
    document.querySelectorAll(selector).forEach((el) => {
      if (el.dataset.init) {
        return;
      }

      const component = new fn();
      component.core.init(el, {}, selector);
    });
  });

  // etUI.dialog = etUI.hooks.useDialog();
}

etUI.initUI = initUI;

(function autoInit() {
  const $scriptBlock = document.querySelector("[data-init]");
  if ($scriptBlock) {
    document.addEventListener("DOMContentLoaded", function () {
      initUI();
    });
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwidXRpbHMvYXJyYXkuanMiLCJ1dGlscy9ib29sZWFuLmpzIiwidXRpbHMvZGF0ZS5qcyIsInV0aWxzL2RvbS5qcyIsInV0aWxzL21hdGguanMiLCJ1dGlscy9vYmplY3QuanMiLCJ1dGlscy9zdHJpbmcuanMiLCJ1dGlscy9pbmRleC5janMiLCJob29rcy91c2VDbGlja091dHNpZGUuanMiLCJob29rcy91c2VDb3JlLmpzIiwiaG9va3MvdXNlRGF0YXNldC5qcyIsImhvb2tzL3VzZURpYWxvZy5qcyIsImhvb2tzL3VzZURpYWxvZ1RtcGwuanMiLCJob29rcy91c2VFdmVudExpc3RlbmVyLmpzIiwiaG9va3MvdXNlR2V0Q2xpZW50UmVjdC5qcyIsImhvb2tzL3VzZUxheWVyLmpzIiwiaG9va3MvdXNlTXV0YXRpb25TdGF0ZS5qcyIsImhvb2tzL3VzZVNlbGVjdEJveFRtcGwuanMiLCJob29rcy91c2VTdGF0ZS5qcyIsImhvb2tzL3VzZVN3aXBlclRtcGwuanMiLCJob29rcy91c2VUcmFuc2l0aW9uLmpzIiwiaG9va3MvaW5kZXguY2pzIiwiY29tcG9uZW50cy9BY2NvcmRpb24uanMiLCJjb21wb25lbnRzL0RpYWxvZy5qcyIsImNvbXBvbmVudHMvTW9kYWwuanMiLCJjb21wb25lbnRzL1NlbGVjdGJveC5qcyIsImNvbXBvbmVudHMvU2tlbC5qcyIsImNvbXBvbmVudHMvU3dpcGVyLmpzIiwiY29tcG9uZW50cy9UYWIuanMiLCJjb21wb25lbnRzL1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL2luZGV4LmNqcyIsImluaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7OztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhc3NldHMvc2NyaXB0cy9jb21tb24udWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBldFVJID0ge31cbndpbmRvdy5ldFVJID0gZXRVSVxuIiwiLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgaXMgYW4gYXJyYXlcbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHJldHVybnMge2FyZyBpcyBhbnlbXX1cbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59XG4iLCIvLyBib29sZWFuIOq0gOugqCDquLDriqVcbiIsIi8vIOuCoOynnCDqtIDroKgg6riw64qlXG4iLCIvLyBleCkgc3RyaW5nIHRvIHF1ZXJ5U2VsZWN0b3IgY29udmVydCBsb2dpY1xuXG4vKipcbiAqIOq4sOuKpSDshKTrqoUg65Ok7Ja06rCQXG4gKi9cblxuLyoqXG4gKiBzZXQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0gb3B0c1xuICovXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShwYXJlbnQsIC4uLm9wdHMpIHtcbiAgaWYob3B0cy5sZW5ndGggPT09IDIpe1xuICAgIGNvbnN0IFtwcm9wZXJ0eSwgdmFsdWVdID0gb3B0cztcblxuICAgIHBhcmVudD8uc2V0QXR0cmlidXRlKHByb3BlcnR5LCB2YWx1ZSk7XG4gIH1lbHNlIGlmKG9wdHMubGVuZ3RoID09PSAzKXtcbiAgICBjb25zdCBbc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZV0gPSBvcHRzO1xuXG4gICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5zZXRBdHRyaWJ1dGUocHJvcGVydHksIHZhbHVlKTtcbiAgfVxufVxuXG4vKipcbiAqIGdldCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7IEVsZW1lbnQgfSBwYXJlbnRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBwcm9wZXJ0eVxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eShwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSkge1xuICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik/LmdldEF0dHJpYnV0ZShwcm9wZXJ0eSk7XG59XG5cbi8qKlxuICogc2V0IHN0eWxlXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0geyBTdHJpbmcgfSBzZWxlY3RvclxuICogQHBhcmFtIHsgU3RyaW5nIH0gcHJvcGVydHlcbiAqIEBwYXJhbSB7IGFueSB9IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHNldFN0eWxlKHBhcmVudCwgc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAocGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogZ3NhcOydmCBTcGxpdFRleHTrpbwg7Zmc7Jqp7ZWY7JesIOusuOyekOulvCDrtoTrpqztlZjsl6wg66eI7Iqk7YGsIOqwgOuKpe2VmOqyjCDtlbTspIDri6QuXG4gKiBAcGFyYW0gc2VsZWN0b3IgIHtzdHJpbmd9XG4gKiBAcGFyYW0gdHlwZSAgeydsaW5lcyd8J3dvcmRzJ3wnY2hhcnMnfVxuICogQHJldHVybnMgW0hUTUxFbGVtZW50W10sIEhUTUxFbGVtZW50W11dXG4gKi9cbmZ1bmN0aW9uIHNwbGl0VGV4dE1hc2soc2VsZWN0b3IsIHR5cGUgPSAnbGluZXMnKXtcbiAgZnVuY3Rpb24gd3JhcChlbCwgd3JhcHBlcikge1xuICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGVsKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuXG4gIGNvbnN0ICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLFxuICAgIG15U3BsaXRUZXh0ID0gbmV3IFNwbGl0VGV4dCgkcXVvdGUsIHt0eXBlfSlcblxuICBjb25zdCAkc3BsaXR0ZWQgPSBteVNwbGl0VGV4dFt0eXBlXTtcbiAgY29uc3QgJGxpbmVXcmFwID0gW107XG4gICRzcGxpdHRlZC5mb3JFYWNoKCgkZWwsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgJGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICRkaXYuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAkZGl2LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAkZGl2LnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICB3cmFwKCRlbCwgJGRpdik7XG4gICAgJGxpbmVXcmFwLnB1c2goJGRpdik7XG4gIH0pXG5cbiAgcmV0dXJuIFskc3BsaXR0ZWQsICRsaW5lV3JhcF1cbn1cbiIsIi8vIOyXsOyCsCDqtIDroKggKOyekOujjO2YlU51bWJlciArIG51bWJlcilcbmZ1bmN0aW9uIGdldEJsZW5kT3BhY2l0eShvcGFjaXR5LCBsZW5ndGgpIHtcbiAgaWYobGVuZ3RoID09PSAxKXtcbiAgICByZXR1cm4gb3BhY2l0eVxuICB9XG5cbiAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0gb3BhY2l0eSwgMS9sZW5ndGgpXG59XG4iLCIvLyBvYmplY3Qg6rSA66CoIOq4sOuKpVxuXG4vKipcbiAqIGNvbXBhcmUgb2JqXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmoxXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmoyXG4gKiBAcmV0dXJucyBCb29sZWFuXG4gKi9cbmZ1bmN0aW9uIHNoYWxsb3dDb21wYXJlKG9iajEsIG9iajIpIHtcbiAgY29uc3Qga2V5cyA9IFsuLi5PYmplY3Qua2V5cyhvYmoxKSwgT2JqZWN0LmtleXMob2JqMildO1xuXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICBpZiAodHlwZW9mIG9iajFba2V5XSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqMltrZXldID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBpZiAoIWV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUob2JqMVtrZXldLCBvYmoyW2tleV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgcm9sZSA9ICFvYmoyW2tleV0gfHwgdHlwZW9mIG9iajFba2V5XSA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgaWYgKCFyb2xlICYmIG9iajFba2V5XSAhPT0gb2JqMltrZXldKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iLCIvKipcbiAqIFJldmVyc2UgYSBzdHJpbmdcbiAqIEBwYXJhbSBzdHIge3N0cmluZ31cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHJldmVyc2VTdHJpbmcoc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBHZXQgYSByYW5kb20gaWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldFJhbmRvbUlkKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gcHJlZml4XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRSYW5kb21VSUlEKHByZWZpeCA9ICd1aScpIHtcbiAgcmV0dXJuIGAke3ByZWZpeH0tJHtnZXRSYW5kb21JZCgpfWA7XG59XG5cbi8qKlxuICog7LKr6riA7J6Q66eMIOuMgOusuOyekOuhnCDrs4DtmZhcbiAqIEBwYXJhbSB3b3JkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBjYXBpdGFsaXplKHdvcmQpIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpXG59XG5cbi8qKlxuICog7LKr6riA7J6Q66eMIOyGjOusuOyekOuhnCDrs4DtmZhcbiAqIEBwYXJhbSB3b3JkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiB1bmNhcGl0YWxpemUod29yZCkge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHdvcmQuc2xpY2UoMSlcbn1cblxuZnVuY3Rpb24gYWRkUHJlZml4Q2FtZWxTdHJpbmcoc3RyLCBwcmVmaXgpe1xuICAvLyBkaW1tQ2xpY2sgPT4gcHJvcHNEaW1tQ2xpY2tcbiAgcmV0dXJuIHByZWZpeCArIGV0VUkudXRpbHMuY2FwaXRhbGl6ZShzdHIpXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVByZWZpeENhbWVsU3RyaW5nKHN0ciwgcHJlZml4KXtcbiAgY29uc3QgcmVnRXhwID0gbmV3IFJlZ0V4cChgXiR7cHJlZml4fWAsICdnJylcbiAgcmV0dXJuIGV0VUkudXRpbHMudW5jYXBpdGFsaXplKHN0ci5yZXBsYWNlQWxsKHJlZ0V4cCwgJycpKVxuXG59XG5cbiIsIlxuZXRVSS51dGlscyA9IHtcblx0aXNBcnJheSxcblx0c2V0UHJvcGVydHksXG5cdGdldFByb3BlcnR5LFxuXHRzZXRTdHlsZSxcblx0c3BsaXRUZXh0TWFzayxcblx0Z2V0QmxlbmRPcGFjaXR5LFxuXHRzaGFsbG93Q29tcGFyZSxcblx0cmV2ZXJzZVN0cmluZyxcblx0Z2V0UmFuZG9tSWQsXG5cdGdldFJhbmRvbVVJSUQsXG5cdGNhcGl0YWxpemUsXG5cdHVuY2FwaXRhbGl6ZSxcblx0YWRkUHJlZml4Q2FtZWxTdHJpbmcsXG5cdHJlbW92ZVByZWZpeENhbWVsU3RyaW5nXG59XG4iLCIvKipcbiAqIHRhcmdldCnsnZgg7Jm467aA66W8IO2BtOumre2WiOydhCDrlYwg7L2c67CxIO2VqOyImOulvCDsi6TtlolcbiAqIOyYiOyZuOyggeycvOuhnCDtgbTrpq3snYQg7ZeI7Jqp7ZWgIOyalOyGjOuTpOydmCDshKDtg53snpDrpbwg7Y+s7ZWo7ZWY64qUIOuwsOyXtOydhCDsmLXshZjsnLzroZwg67Cb7J2EIOyImCDsnojsirXri4jri6QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXQgLSDtgbTrpq0g7J2067Kk7Yq47J2YIOyZuOu2gCDtgbTrpq0g6rCQ7KeA66W8IOyImO2Wie2VoCDrjIDsg4EgRE9NIOyalOyGjOyeheuLiOuLpC4o7ZWE7IiYKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSDsmbjrtoAg7YG066at7J20IOqwkOyngOuQmOyXiOydhCDrlYwg7Iuk7ZaJ7ZWgIOy9nOuwsSDtlajsiJjsnoXri4jri6QuKO2VhOyImClcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZXhjZXB0aW9ucyAtIOyZuOu2gCDtgbTrpq0g6rCQ7KeA7JeQ7IScIOyYiOyZuCDsspjrpqztlaAg7JqU7IaM65Ok7J2YIOyEoO2DneyekOulvCDtj6ztlajtlZjripQg67Cw7Je07J6F64uI64ukLijsmLXshZgpXG4gKi9cblxuLy8gYmx1ciDrj4Qg7Je865GQXG5mdW5jdGlvbiB1c2VDbGlja091dHNpZGUodGFyZ2V0LCBjYWxsYmFjaywgZXhjZXB0aW9ucyA9IFtdKSB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBsZXQgaXNDbGlja0luc2lkZUV4Y2VwdGlvbiA9IGV4Y2VwdGlvbnMuc29tZSgoc2VsZWN0b3IpID0+IHtcbiAgICAgIGNvbnN0IGV4Y2VwdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIHJldHVybiBleGNlcHRpb25FbGVtZW50ICYmIGV4Y2VwdGlvbkVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIGlmICghdGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgIWlzQ2xpY2tJbnNpZGVFeGNlcHRpb24pIHtcbiAgICAgIGNhbGxiYWNrKHRhcmdldCk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8g67aA66qoIOyalOyGjOuKlCBwYXJlbnRzXG4vLyDshKDtg50g7JqUXG4iLCJmdW5jdGlvbiB1c2VDb3JlKFxuICBpbml0aWFsUHJvcHMgPSB7fSxcbiAgaW5pdGlhbFZhbHVlID0ge30sXG4gIHJlbmRlcixcbiAgb3B0aW9ucyA9IHtcbiAgICBkYXRhc2V0OiB0cnVlXG59KSB7XG4gIGNvbnN0IGFjdGlvbnMgPSB7fTtcbiAgbGV0ICR0YXJnZXQ7XG4gIGNvbnN0IGNsZWFudXBzID0gW107XG4gIGNvbnN0IE5PX0JVQkJMSU5HX0VWRU5UUyA9IFtcbiAgICAnYmx1cicsXG4gICAgJ2ZvY3VzJyxcbiAgICAnZm9jdXNpbicsXG4gICAgJ2ZvY3Vzb3V0JyxcbiAgICAncG9pbnRlcmxlYXZlJ1xuICBdO1xuXG4gIGNvbnN0IHByb3BzID0gbmV3IFByb3h5KGluaXRpYWxQcm9wcywge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHN0YXRlID0gbmV3IFByb3h5KGluaXRpYWxWYWx1ZSwge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICB9LFxuICB9KTtcblxuICBmdW5jdGlvbiBzZXRUYXJnZXQoXyR0YXJnZXQpIHtcbiAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG5cbiAgICBpZihvcHRpb25zLmRhdGFzZXQpe1xuICAgICAgY29uc3QgeyBnZXRQcm9wc0Zyb21EYXRhc2V0IH0gPSBldFVJLmhvb2tzLnVzZURhdGFzZXQoJHRhcmdldCk7XG4gICAgICBjb25zdCBkYXRhc2V0UHJvcHMgPSBnZXRQcm9wc0Zyb21EYXRhc2V0KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLmRhdGFzZXRQcm9wcyB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQcm9wcyhuZXdQcm9wcykge1xuICAgIE9iamVjdC5rZXlzKG5ld1Byb3BzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHByb3BzW2tleV0gPSBuZXdQcm9wc1trZXldO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGUobmV3U3RhdGUpIHtcbiAgICBpZihldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHN0YXRlLCBuZXdTdGF0ZSkpIHJldHVybjtcblxuICAgIE9iamVjdC5rZXlzKG5ld1N0YXRlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHN0YXRlW2tleV0gPSBuZXdTdGF0ZVtrZXldO1xuICAgIH0pO1xuXG4gICAgaWYgKHJlbmRlcikge1xuICAgICAgcmVuZGVyKCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YXNldCkge1xuICAgICAgY29uc3QgeyBzZXRWYXJzRnJvbURhdGFzZXQgfSA9IGV0VUkuaG9va3MudXNlRGF0YXNldCgkdGFyZ2V0KTtcbiAgICAgIHNldFZhcnNGcm9tRGF0YXNldChzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkRXZlbnQoZXZlbnRUeXBlLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCAkZXZlbnRUYXJnZXQgPSBzZWxlY3RvciA/ICR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiAkdGFyZ2V0O1xuXG4gICAgaWYgKE5PX0JVQkJMSU5HX0VWRU5UUy5pbmNsdWRlcyhldmVudFR5cGUpKSB7XG4gICAgICBjb25zdCBjbGVhbnVwID0gZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKCRldmVudFRhcmdldCwgZXZlbnRUeXBlLCBjYWxsYmFjayk7XG4gICAgICByZXR1cm4gY2xlYW51cHMucHVzaChjbGVhbnVwKTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudEhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGxldCAkZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdChzZWxlY3Rvcik7XG5cbiAgICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgICAgJGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoJGV2ZW50VGFyZ2V0KSB7XG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRIYW5kbGVyKTtcbiAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4gJHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRIYW5kbGVyKTtcbiAgICBjbGVhbnVwcy5wdXNoKGNsZWFudXApO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRXZlbnQoKSB7XG4gICAgY2xlYW51cHMuZm9yRWFjaCgoY2xlYW51cCkgPT4gY2xlYW51cCgpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2V0VGFyZ2V0LFxuICAgIGFjdGlvbnMsXG4gICAgc3RhdGUsXG4gICAgcHJvcHMsXG4gICAgc2V0U3RhdGUsXG4gICAgc2V0UHJvcHMsXG4gICAgYWRkRXZlbnQsXG4gICAgcmVtb3ZlRXZlbnQsXG4gIH07XG59XG4iLCIvKipcbiAqIHVzZURhdGFzZXRcbiAqIEBwYXJhbSAkdGFyZ2V0IHtIVE1MRWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gdXNlRGF0YXNldCgkdGFyZ2V0KSB7XG4gIGxldCBkYXRhc2V0UHJvcHMgPSB7fSxcbiAgICBkYXRhc2V0VmFycyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldERhdGFzZXRCeVByZWZpeChwcmVmaXgpIHtcbiAgICBjb25zdCBkYXRhc2V0ID0ge307XG4gICAgT2JqZWN0LmtleXMoJHRhcmdldC5kYXRhc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9ICR0YXJnZXQuZGF0YXNldFtrZXldO1xuXG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5pbmNsdWRlcygneycpKXtcbiAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZGF0YXNldFtldFVJLnV0aWxzLnJlbW92ZVByZWZpeENhbWVsU3RyaW5nKGtleSwgcHJlZml4KV0gPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhc2V0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YXNldEV4Y2VwdFByZWZpeChwcmVmaXgpIHtcbiAgICBjb25zdCBkYXRhc2V0ID0ge307XG4gICAgT2JqZWN0LmtleXMoJHRhcmdldC5kYXRhc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9ICR0YXJnZXQuZGF0YXNldFtrZXldO1xuXG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGRhdGFzZXRbZXRVSS51dGlscy5yZW1vdmVQcmVmaXhDYW1lbFN0cmluZyhrZXksIHByZWZpeCldID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldERhdGFzZXRCeVByZWZpeChkYXRhLCBwcmVmaXgpIHtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmKHByZWZpeCl7XG4gICAgICAgICR0YXJnZXQuZGF0YXNldFtgJHtwcmVmaXh9JHtldFVJLnV0aWxzLmNhcGl0YWxpemUoa2V5KX1gXSA9IGRhdGFba2V5XTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkdGFyZ2V0LmRhdGFzZXRba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByb3BzRnJvbURhdGFzZXQoKSB7XG4gICAgZGF0YXNldFByb3BzID0gZ2V0RGF0YXNldEJ5UHJlZml4KCdwcm9wcycpO1xuXG4gICAgcmV0dXJuIGRhdGFzZXRQcm9wcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZhcnNGcm9tRGF0YXNldCgpIHtcbiAgICBkYXRhc2V0VmFycyA9IGdldERhdGFzZXRFeGNlcHRQcmVmaXgoJ3Byb3BzJyk7XG5cbiAgICByZXR1cm4gZGF0YXNldFZhcnM7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQcm9wc0Zyb21EYXRhc2V0KHByb3BzKSB7XG4gICAgc2V0RGF0YXNldEJ5UHJlZml4KHByb3BzLCAncHJvcHMnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFZhcnNGcm9tRGF0YXNldCh2YXJzKSB7XG4gICAgc2V0RGF0YXNldEJ5UHJlZml4KHZhcnMsICcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0cmluZ1RvT2JqZWN0KHByb3BzKSB7XG4gICAgLy8gZGF0YXNldOyXkOyEnCDqsJ3ssrQg7ZiV7YOc7J24IOyKpO2KuOungeqwkiDtg4DsnoUg6rCd7LK066GcIOuwlOq/lOykjFxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XG4gICAgICBpZiAoISh0eXBlb2YgcHJvcHNba2V5XSA9PT0gJ2Jvb2xlYW4nKSAmJiBwcm9wc1trZXldLmluY2x1ZGVzKCd7JykpIHtcbiAgICAgICAgcHJvcHNba2V5XSA9IEpTT04ucGFyc2UocHJvcHNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRQcm9wc0Zyb21EYXRhc2V0LFxuICAgIHNldFByb3BzRnJvbURhdGFzZXQsXG4gICAgZ2V0VmFyc0Zyb21EYXRhc2V0LFxuICAgIHNldFZhcnNGcm9tRGF0YXNldCxcbiAgICBzZXRTdHJpbmdUb09iamVjdCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZURpYWxvZygpIHtcbiAgY29uc3QgYWxlcnQgPSAoLi4ub3B0cykgPT4ge1xuICAgIGNvbnN0ICRsYXllcldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XG5cbiAgICBpZih0eXBlb2Ygb3B0c1swXSA9PT0gJ3N0cmluZycpe1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdhbGVydCcsIG1lc3NhZ2U6IG9wdHNbMF0sIGNhbGxiYWNrOiBvcHRzWzFdIH0pO1xuICAgIH1lbHNlIGlmKHR5cGVvZiBvcHRzWzBdID09PSAnb2JqZWN0Jyl7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2FsZXJ0JywgLi4ub3B0c1swXSB9KTtcbiAgICB9XG5cbiAgICBkaWFsb2cub3BlbigpO1xuICB9O1xuXG4gIGNvbnN0IGNvbmZpcm0gPSAoLi4ub3B0cykgPT4ge1xuICAgIGNvbnN0ICRsYXllcldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XG5cbiAgICBpZih0eXBlb2Ygb3B0c1swXSA9PT0gJ3N0cmluZycpe1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdjb25maXJtJywgbWVzc2FnZTogb3B0c1swXSwgcG9zaXRpdmVDYWxsYmFjazogb3B0c1sxXSB9KTtcbiAgICB9ZWxzZSBpZih0eXBlb2Ygb3B0c1swXSA9PT0gJ29iamVjdCcpe1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdjb25maXJtJywgLi4ub3B0c1swXSB9KTtcbiAgICB9XG5cbiAgICBkaWFsb2cub3BlbigpO1xuICB9O1xuXG4gIGNvbnN0IHByZXZpZXdJbWFnZSA9ICguLi5vcHRzKSA9PiB7XG4gICAgY29uc3QgJGxheWVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJyk7XG4gICAgY29uc3QgZGlhbG9nID0gbmV3IGV0VUkuY29tcG9uZW50cy5EaWFsb2coKTtcblxuXG4gICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdwcmV2aWV3SW1hZ2UnLCAuLi5vcHRzWzBdIH0pO1xuXG4gICAgZGlhbG9nLm9wZW4oKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYWxlcnQsXG4gICAgY29uZmlybSxcbiAgICBwcmV2aWV3SW1hZ2VcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZURpYWxvZ1RtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSAoeyBkaWFsb2dUeXBlLCB0eXBlLCB0aXRsZSwgbWVzc2FnZSwgcG9zaXRpdmVUZXh0LCBuZWdhdGl2ZVRleHQgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1kaW1tXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWZyYW1lXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgICAgICR7dGl0bGUgPyBgPGgzIGNsYXNzPVwiZGlhbG9nLXRpdFwiPiR7dGl0bGV9PC9oMz5gIDogJyd9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+XG4gICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdhbGVydCcgPyBgPHNwYW4gY2xhc3M9XCIke3R5cGV9XCI+aWNvbjwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxwIGNsYXNzPVwiZGlhbG9nLWluZm9cIj4ke21lc3NhZ2UucmVwbGFjZSgvXFxuL2csICc8YnI+Jyl9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGRpYWxvZy1uZWdhdGl2ZVwiPiR7bmVnYXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgICR7cG9zaXRpdmVUZXh0ID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGRpYWxvZy1wb3NpdGl2ZSBidG4tcHJpbWFyeVwiPiR7cG9zaXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgY29uc3QgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTCA9ICh7ZGlhbG9nVHlwZSwgaW1hZ2VzLCB0aXRsZX0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZGltbVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1mcmFtZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgICAgICAke3RpdGxlID8gYDxoMyBjbGFzcz1cImRpYWxvZy10aXRcIj4ke3RpdGxlfTwvaDM+YCA6ICcnfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1zd2lwZXJcIiBkYXRhLWNvbXBvbmVudD1cInN3aXBlclwiPlxuICAgICAgICAgICAgICA8IS0tIEFkZGl0aW9uYWwgcmVxdWlyZWQgd3JhcHBlciAtLT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgJHtpbWFnZXMubWFwKChpbWFnZSkgPT4gKGBcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItc2xpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2ltYWdlLnNyY31cIiBhbHQ9XCIke2ltYWdlLmFsdH1cIiAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgYCkpLmpvaW4oJycpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGBcblxuICAgIHJldHVybiB7XG4gICAgICAkdGVtcGxhdGVIVE1MLFxuICAgICAgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTFxuICAgIH1cbn1cbiIsIi8qKlxuICogdXNlRXZlbnRMaXN0ZW5lclxuICogQHBhcmFtIHRhcmdldCAge0hUTUxFbGVtZW50fVxuICogQHBhcmFtIHR5cGUgIHtzdHJpbmd9XG4gKiBAcGFyYW0gbGlzdGVuZXIgIHtmdW5jdGlvbn1cbiAqIEBwYXJhbSBvcHRpb25zIHtvYmplY3R9XG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oKTogKn1cbiAqL1xuZnVuY3Rpb24gdXNlRXZlbnRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zID0ge30pe1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG59XG4iLCIvKipcbiAqIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIHsgU3RyaW5nIH0gc2VsZWN0b3JcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHVzZUdldENsaWVudFJlY3QocGFyZW50LCBzZWxlY3Rvcikge1xuICBjb25zdCByZWN0ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgaWYgKCFyZWN0KSByZXR1cm4ge307XG4gIGVsc2VcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgIGJvdHRvbTogcmVjdC5ib3R0b20sXG4gICAgICBsZWZ0OiByZWN0LmxlZnQsXG4gICAgICByaWdodDogcmVjdC5yaWdodCxcbiAgICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlTGF5ZXIodHlwZSA9ICdtb2RhbCcpe1xuICBmdW5jdGlvbiBnZXRWaXNpYmxlTGF5ZXIoKXtcbiAgICBjb25zdCAkbGF5ZXJDb21wb25lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpLmNoaWxkcmVuKS5maWx0ZXIoKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXNNb2RhbENvbXBvbmVudCA9ICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbXBvbmVudC1tb2RhbCcpXG4gICAgICBjb25zdCBpc0RpYWxvZ0NvbXBvbmVudCA9ICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbXBvbmVudC1kaWFsb2cnKVxuXG4gICAgICByZXR1cm4gaXNNb2RhbENvbXBvbmVudCB8fCBpc0RpYWxvZ0NvbXBvbmVudFxuICAgIH0pXG5cbiAgICByZXR1cm4gJGxheWVyQ29tcG9uZW50cy5maWx0ZXIoKCRlbCkgPT4ge1xuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSgkZWwpO1xuICAgICAgcmV0dXJuIHN0eWxlLmRpc3BsYXkgIT09ICdub25lJ1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBnZXRUb3BEZXB0aCgpe1xuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKClcbiAgICByZXR1cm4gMTAwICsgJHZpc2libGVMYXllckNvbXBvbmVudHMubGVuZ3RoXG4gIH1cblxuICBmdW5jdGlvbiBzZXRMYXllck9wYWNpdHkoZGVmYXVsdE9wYWNpdHkgPSAwLjUpe1xuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKClcbiAgICAkdmlzaWJsZUxheWVyQ29tcG9uZW50cy5mb3JFYWNoKCgkZWwsIGluZGV4KSA9PiB7XG5cbiAgICAgIGNvbnN0IG9wYWNpdHkgPSBldFVJLnV0aWxzLmdldEJsZW5kT3BhY2l0eShkZWZhdWx0T3BhY2l0eSwgJHZpc2libGVMYXllckNvbXBvbmVudHMubGVuZ3RoKVxuXG4gICAgICBpZigkZWwucXVlcnlTZWxlY3RvcihgLm1vZGFsLWRpbW1gKSl7XG4gICAgICAgICRlbC5xdWVyeVNlbGVjdG9yKGAubW9kYWwtZGltbWApLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2JhKDAsIDAsIDAsICR7b3BhY2l0eX0pYFxuICAgICAgfVxuXG4gICAgICBpZigkZWwucXVlcnlTZWxlY3RvcihgLmRpYWxvZy1kaW1tYCkpe1xuICAgICAgICAkZWwucXVlcnlTZWxlY3RvcihgLmRpYWxvZy1kaW1tYCkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYmEoMCwgMCwgMCwgJHtvcGFjaXR5fSlgXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0VmlzaWJsZUxheWVyLFxuICAgIGdldFRvcERlcHRoLFxuICAgIHNldExheWVyT3BhY2l0eVxuICB9XG59XG4iLCJmdW5jdGlvbiB1c2VNdXRhdGlvblN0YXRlKCl7XG4gIGxldCAkdGFyZ2V0LCAkcmVmID0ge1xuICAgICRzdGF0ZToge31cbiAgfSwgbXV0YXRpb25PYnNlcnZlciwgcmVuZGVyO1xuXG4gIGZ1bmN0aW9uIGluaXRNdXRhdGlvblN0YXRlKF8kdGFyZ2V0LCBfcmVuZGVyKXtcbiAgICAkdGFyZ2V0ID0gXyR0YXJnZXRcbiAgICByZW5kZXIgPSBfcmVuZGVyO1xuXG4gICAgc2V0TXV0YXRpb25PYnNlcnZlcigpXG4gICAgc2V0U3RhdGVCeURhdGFzZXQoKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGVCeURhdGFzZXQoKXtcbiAgICBjb25zdCBmaWx0ZXJlZERhdGFzZXQgPSB7fTtcbiAgICBjb25zdCBkYXRhc2V0ID0gJHRhcmdldC5kYXRhc2V0O1xuXG4gICAgT2JqZWN0LmtleXMoZGF0YXNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZihrZXkuc3RhcnRzV2l0aCgndmFycycpKXtcbiAgICAgICAgZmlsdGVyZWREYXRhc2V0W2tleS5yZXBsYWNlKCd2YXJzJywgJycpLnRvTG93ZXJDYXNlKCldID0gZGF0YXNldFtrZXldO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICBzZXRTdGF0ZShmaWx0ZXJlZERhdGFzZXQpXG4gICAgcmVuZGVyKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRNdXRhdGlvbk9ic2VydmVyKCl7XG4gICAgY29uc3QgY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IGZhbHNlLCBzdWJ0cmVlOiBmYWxzZSB9O1xuXG4gICAgY29uc3QgY2FsbGJhY2sgPSAobXV0YXRpb25MaXN0LCBvYnNlcnZlcikgPT4ge1xuICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbkxpc3QpIHtcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiYXR0cmlidXRlc1wiXG4gICAgICAgICAgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSAhPT0gJ3N0eWxlJ1xuICAgICAgICAgICYmIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcydcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0U3RhdGVCeURhdGFzZXQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKCR0YXJnZXQsIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZShuZXdTdGF0ZSl7XG4gICAgJHJlZi4kc3RhdGUgPSB7IC4uLiRyZWYuJHN0YXRlLCAuLi5uZXdTdGF0ZSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RGF0YVN0YXRlKG5ld1N0YXRlKSB7XG4gICAgY29uc3QgJG5ld1N0YXRlID0geyAuLi4kcmVmLiRzdGF0ZSwgLi4ubmV3U3RhdGUgfTtcblxuICAgIE9iamVjdC5rZXlzKCRuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAkdGFyZ2V0LmRhdGFzZXRbYHZhcnMke2V0VUkudXRpbHMuY2FwaXRhbGl6ZShrZXkpfWBdID0gJG5ld1N0YXRlW2tleV07XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJHJlZixcbiAgICBzZXRTdGF0ZSxcbiAgICBzZXREYXRhU3RhdGUsXG4gICAgaW5pdE11dGF0aW9uU3RhdGVcbiAgfVxufVxuIiwiZnVuY3Rpb24gdXNlU2VsZWN0Qm94VGVtcCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlQ3VzdG9tSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiY29tYm8xXCIgY2xhc3M9XCJzZWxlY3QtYm94XCIgcm9sZT1cImNvbWJvYm94XCIgYXJpYS1jb250cm9scz1cImxpc3Rib3gxXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgYXJpYS1hY3RpdmVkZXNjZW5kYW50PVwiXCI+XG4gICAgICAgIDxzcGFuIHN0eWxlPVwicG9pbnRlci1ldmVudHM6IG5vbmU7XCI+JHt0ZXh0fTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDx1bCBpZD1cImxpc3Rib3gxXCIgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uc1wiIHJvbGU9XCJsaXN0Ym94XCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICR7aXRlbXNIVE1MfVxuICAgICAgICA8L3VsPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxsaSByb2xlPVwib3B0aW9uXCIgY2xhc3M9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPVwiJHtzZWxlY3RlZH1cIiBkYXRhLXZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPlxuICAgICAgICAgICR7aXRlbS50ZXh0fVxuICAgICAgICA8L2xpPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZUJhc2ljSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbj4ke3RleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXNXcmFwKGl0ZW1zSFRNTCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHNlbGVjdCBjbGFzcz1cInNlbGVjdC1saXN0XCIgcmVxdWlyZWQ+XG4gICAgICAgICAgJHtpdGVtc0hUTUx9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCIke2l0ZW0udmFsdWV9XCI+JHtpdGVtLnRleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVDdXN0b21IVE1MLFxuICAgICR0ZW1wbGF0ZUJhc2ljSFRNTCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWxWYWx1ZSA9IHt9LCBjYWxsYmFjaykge1xuICBjb25zdCBzdGF0ZSA9IG5ldyBQcm94eShpbml0aWFsVmFsdWUsIHtcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcbiAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayh0YXJnZXQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgc2V0U3RhdGUgPSAobmV3U3RhdGUpID0+IHtcbiAgICBPYmplY3Qua2V5cyhuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzdGF0ZVtrZXldID0gbmV3U3RhdGVba2V5XTtcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIFtzdGF0ZSwgc2V0U3RhdGVdO1xufVxuIiwiZnVuY3Rpb24gdXNlU3dpcGVyVG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9IHtcbiAgICBuYXZpZ2F0aW9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLXByZXZcIj7snbTsoIQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLW5leHRcIj7ri6TsnYw8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBwYWdpbmF0aW9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1wYWdpbmF0aW9uXCI+PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgYXV0b3BsYXkoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYXV0b3BsYXkgcGxheVwiPjwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVIVE1MLFxuICB9O1xufVxuIiwiLyoqXG4gKiB0ZW1wIHRpbWVsaW5lXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiB1c2VUcmFuc2l0aW9uKCkge1xuICAvLyBzZWxlY3RcbiAgY29uc3QgdXNlU2VsZWN0U2hvdyA9ICh0YXJnZXQsIHR5cGUsIG9wdGlvbikgPT4ge1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IGdzYXAudGltZWxpbmUoeyBwYXVzZWQ6IHRydWUgfSk7XG5cbiAgICBjb25zdCBvcHRpb25MaXN0ID0ge1xuICAgICAgZmFzdDogeyBkdXJhdGlvbjogMC4xIH0sXG4gICAgICBub3JtYWw6IHsgZHVyYXRpb246IDAuMyB9LFxuICAgICAgc2xvdzogeyBkdXJhdGlvbjogMC43IH0sXG4gICAgfTtcbiAgICBsZXQgZ3NhcE9wdGlvbiA9IHsgLi4ub3B0aW9uTGlzdFt0eXBlXSwgLi4ub3B0aW9uIH07XG5cbiAgICB0aW1lbGluZS50byh0YXJnZXQsIHtcbiAgICAgIGFscGhhOiAwLFxuICAgICAgZWFzZTogXCJsaW5lYXJcIixcbiAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICB9LFxuICAgICAgLi4uZ3NhcE9wdGlvbixcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICB0aW1lbGluZUVsOiB0aW1lbGluZS5fcmVjZW50LnZhcnMsXG4gICAgICB0aW1lbGluZTogKHN0YXRlKSA9PiB7XG4gICAgICAgIHN0YXRlID8gKCh0YXJnZXQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIiksIHRpbWVsaW5lLnJldmVyc2UoKSkgOiB0aW1lbGluZS5wbGF5KCk7XG4gICAgICB9LFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB1c2VTZWxlY3RTaG93LFxuICB9O1xufVxuIiwiXG5ldFVJLmhvb2tzID0ge1xuXHR1c2VDbGlja091dHNpZGUsXG5cdHVzZUNvcmUsXG5cdHVzZURhdGFzZXQsXG5cdHVzZURpYWxvZyxcblx0dXNlRGlhbG9nVG1wbCxcblx0dXNlRXZlbnRMaXN0ZW5lcixcblx0dXNlR2V0Q2xpZW50UmVjdCxcblx0dXNlTGF5ZXIsXG5cdHVzZU11dGF0aW9uU3RhdGUsXG5cdHVzZVNlbGVjdEJveFRlbXAsXG5cdHVzZVN0YXRlLFxuXHR1c2VTd2lwZXJUbXBsLFxuXHR1c2VUcmFuc2l0aW9uXG59XG4iLCIvKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb3BzQ29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGRpc2FibGVkIC0g7JqU7IaM6rCAIOu5hO2ZnOyEse2ZlCDsg4Htg5zsnbjsp4Drpbwg64KY7YOA64OF64uI64ukLlxuICogQHByb3BlcnR5IHtib29sZWFufSBvbmNlIC0g7J2067Kk7Yq464KYIOyVoeyFmOydhCDtlZwg67KI66eMIOyLpO2Wie2VoOyngCDsl6zrtoDrpbwg6rKw7KCV7ZWp64uI64ukLlxuICogQHByb3BlcnR5IHtmYWxzZSB8IG51bWJlcn0gZHVyYXRpb24gLSDslaDri4jrqZTsnbTshZgg65iQ64qUIOydtOuypO2KuCDsp4Dsho0g7Iuc6rCE7J2EIOuwgOumrOy0iCDri6jsnITroZwg7ISk7KCV7ZWp64uI64ukLiAnZmFsc2Un7J28IOqyveyasCDsp4Dsho0g7Iuc6rCE7J2EIOustOyLnO2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvcmlnaW4gLSDsm5DsoJAg65iQ64qUIOyLnOyekSDsp4DsoJDsnYQg64KY7YOA64K064qUIOqwneyytOyeheuLiOuLpC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN0YXRlQ29uZmlnXG4gKiBAcHJvcGVydHkgeydjbG9zZScgfCAnb3Blbid9IHN0YXRlIC0g7JWE7L2U65SU7Ja47J2YIOyDge2DnOqwki4gY2xvc2UsIG9wZW4g65GYIOykkeyXkCDtlZjrgpjsnoXri4jri6QuXG4gKi9cblxuLyoqIEB0eXBlIHtQcm9wc0NvbmZpZ30gKi9cbi8qKiBAdHlwZSB7U3RhdGVDb25maWd9ICovXG5cbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgICBjb2xsYXBzaWJsZTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgICAgZWFzaW5nOiBcInBvd2VyNC5vdXRcIixcbiAgICAgIH0sXG4gICAgICB0eXBlOiBcIm11bHRpcGxlXCIsXG4gICAgfSxcbiAgICB7fSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gXCJhY2NvcmRpb25cIjtcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgYWNjb3JkaW9uVG9nZ2xlQnRuLCBhY2NvcmRpb25JdGVtO1xuICBsZXQgJHRhcmdldCwgJGFjY29yZGlvbkNvbnRlbnRzLCAkYWNjb3JkaW9uSXRlbTtcblxuICB7XG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICAgIHRocm93IEVycm9yKFwidGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuXCIpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIiwgXCJ0cnVlXCIpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygkdGFyZ2V0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHNldHRpbmc6IFwiY3VzdG9tXCIgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1pbml0XCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBhY2NvcmRpb25Ub2dnbGVCdG4gPSBcIi5hY2NvcmRpb24tdGl0XCI7XG4gICAgYWNjb3JkaW9uSXRlbSA9IFwiLmFjY29yZGlvbi1pdGVtXCI7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJGFjY29yZGlvbkl0ZW0gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYWNjb3JkaW9uSXRlbSk7XG4gICAgJGFjY29yZGlvbkNvbnRlbnRzID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLmFjY29yZGlvbi1jb250ZW50XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpO1xuICAgICRhY2NvcmRpb25Db250ZW50cy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCB0cnVlKTtcbiAgICAkYWNjb3JkaW9uQ29udGVudHMuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInJlZ2lvblwiKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCBpZCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgaXNDdXN0b20gPSBwcm9wcy5zZXR0aW5nID09PSBcImN1c3RvbVwiO1xuICAgIGNvbnN0IHsgZHVyYXRpb24sIGVhc2VpbmcgfSA9IHByb3BzLmFuaW1hdGlvbjtcblxuICAgIGFjdGlvbnMub3BlbiA9ICh0YXJnZXQgPSAkYWNjb3JkaW9uSXRlbSkgPT4ge1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgdHJ1ZSk7XG4gICAgICBpZiAoIWlzQ3VzdG9tKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdzYXAudGltZWxpbmUoKS50byh0YXJnZXQsIHsgZHVyYXRpb246IGR1cmF0aW9uLCBlYXNlOiBlYXNlaW5nLCBwYWRkaW5nOiBcIjNyZW1cIiB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICh0YXJnZXQgPSAkYWNjb3JkaW9uSXRlbSkgPT4ge1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpO1xuICAgICAgaWYgKCFpc0N1c3RvbSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnc2FwLnRpbWVsaW5lKCkudG8odGFyZ2V0LCB7IGR1cmF0aW9uOiBkdXJhdGlvbiwgcGFkZGluZzogXCIwIDNyZW1cIiB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5hcnJvd1VwID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJrZXl1cCDsvZzrsLFcIik7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuYXJyb3dEb3duID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJrZXl1cCDsvZzrsLFcIik7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gcHJvcHM7XG4gICAgaWYgKHR5cGUgPT09IFwic2luZ2xlXCIpIHtcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgYWNjb3JkaW9uVG9nZ2xlQnRuLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgICBjb25zdCB7IHBhcmVudEVsZW1lbnQgfSA9IHRhcmdldDtcbiAgICAgICAgc2luZ2xlVG9nZ2xlQWNjb3JkaW9uKHBhcmVudEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgYWNjb3JkaW9uVG9nZ2xlQnRuLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgICB0b2dnbGVBY2NvcmRpb24odGFyZ2V0LnBhcmVudEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uKGVsZSkge1xuICAgIGNvbnNvbGUubG9nKGVsZSk7XG4gICAgY29uc3QgaXNPcGVuID0gc3RhdGUuc3RhdGUgPT09IFwib3BlblwiO1xuICAgIGlmIChpc09wZW4pIHtcbiAgICAgIGFjdGlvbnMuY2xvc2UoZWxlKTtcbiAgICAgIGNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnMub3BlbihlbGUpO1xuICAgICAgb3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNpbmdsZVRvZ2dsZUFjY29yZGlvbih0YXJnZXQpIHtcbiAgICBjb25zdCAkY2xpY2tlZEl0ZW0gPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICBjb25zdCAkYWxsVGl0bGVzID0gJGNsaWNrZWRJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoYWNjb3JkaW9uVG9nZ2xlQnRuKTtcbiAgICBjb25zdCAkYWxsSXRlbXMgPSBBcnJheS5mcm9tKCRhbGxUaXRsZXMpLm1hcCgodGl0bGUpID0+IHRpdGxlLnBhcmVudEVsZW1lbnQpO1xuXG4gICAgJGFsbEl0ZW1zLmZvckVhY2goKCRpdGVtKSA9PiB7XG4gICAgICBjb25zdCAkdGl0bGUgPSAkaXRlbS5xdWVyeVNlbGVjdG9yKGFjY29yZGlvblRvZ2dsZUJ0bik7XG4gICAgICBjb25zdCAkY29udGVudCA9ICR0aXRsZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICBpZiAoJGl0ZW0gPT09IHRhcmdldCkge1xuICAgICAgICBpZiAoJGNvbnRlbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgJGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAkdGl0bGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XG4gICAgICAgICAgJGl0ZW0uY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgICAgb3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRjb250ZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAkdGl0bGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xuICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRjb250ZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgJHRpdGxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNTaG93ID0gc3RhdGUuc3RhdGUgPT09IFwib3BlblwiO1xuICAgIC8vIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYWNjb3JkaW9uSXRlbSwgXCJhcmlhLWV4cGFuZGVkXCIsIGlzU2hvdyk7XG4gICAgaXNTaG93ID8gb3BlbigpIDogY2xvc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogXCJvcGVuXCIgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcImNsb3NlXCIgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqICBNb2RhbFxuICovXG5mdW5jdGlvbiBEaWFsb2coKSB7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnRcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZSh7XG4gICAgICAvLyBwcm9wc1xuICAgICAgZGltbUNsaWNrOiB0cnVlLFxuICAgICAgZXNjOiB0cnVlLFxuICAgICAgdGl0bGU6IG51bGwsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICAgIHR5cGU6ICdhbGVydCcsXG4gICAgICBwb3NpdGl2ZVRleHQ6ICftmZXsnbgnLFxuICAgICAgbmVnYXRpdmVUZXh0OiAn7Leo7IaMJyxcbiAgICB9LCB7XG4gICAgICBzdGF0ZTogJ2Nsb3NlJyxcbiAgICAgIHRyaWdnZXI6IG51bGxcbiAgICB9LCByZW5kZXIsIHtcbiAgICAgIGRhdGFzZXQ6IGZhbHNlLFxuICAgIH0sXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgRElNTV9PUEFDSVRZID0gMC42O1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnZGlhbG9nJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICBsZXQgbW9kYWxEaW1tU2VsZWN0b3IsXG4gICAgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLFxuICAgIG1vZGFsQnRuUG9zaXRpdmUsXG4gICAgbW9kYWxCdG5OZWdhdGl2ZTtcbiAgbGV0ICR0YXJnZXQsXG4gICAgJG1vZGFsLFxuICAgICRtb2RhbFRpdGxlLCAkbW9kYWxDb250YWluZXIsICRtb2RhbERpbW0sXG4gICAgJG1vZGFsQnRuUG9zaXRpdmUsICRtb2RhbEJ0bk5lZ2F0aXZlLFxuICAgIGZvY3VzVHJhcEluc3RhbmNlLFxuICAgIGNhbGxiYWNrO1xuXG4gIHtcbiAgICAvKipcbiAgICAgKiBpbml0XG4gICAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ3RhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLicpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgLy8gJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBmb2N1cyB0cmFwXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxuICAgICAgICBvbkFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzQWN0aXZhdGUsXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgLy8gc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MLCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MIH0gPSBldFVJLmhvb2tzLnVzZURpYWxvZ1RtcGwoKVxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblxuICAgIGlmKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdhbGVydCcgfHwgcHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nKXtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2NvbXBvbmVudC1kaWFsb2cnKTtcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICR0ZW1wbGF0ZUhUTUwocHJvcHMpO1xuICAgIH1lbHNlIGlmKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdwcmV2aWV3SW1hZ2UnKXtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2NvbXBvbmVudC1kaWFsb2cnKTtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2RpYWxvZy1wcmV2aWV3LWltYWdlJyk7XG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MKHByb3BzKTtcbiAgICB9XG5cbiAgICAkbW9kYWwgPSB0ZW1wbGF0ZTtcbiAgICAkdGFyZ2V0LmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciA9ICcuZGlhbG9nLWNsb3NlJztcbiAgICBtb2RhbERpbW1TZWxlY3RvciA9ICcuZGlhbG9nLWRpbW0nO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRtb2RhbFRpdGxlID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctdGl0Jyk7XG4gICAgJG1vZGFsRGltbSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKG1vZGFsRGltbVNlbGVjdG9yKTtcbiAgICAkbW9kYWxDb250YWluZXIgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250YWluZXInKTtcblxuICAgIG1vZGFsQnRuUG9zaXRpdmUgPSAnLmRpYWxvZy1wb3NpdGl2ZSc7XG4gICAgbW9kYWxCdG5OZWdhdGl2ZSA9ICcuZGlhbG9nLW5lZ2F0aXZlJztcbiAgICAkbW9kYWxCdG5Qb3NpdGl2ZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLXBvc2l0aXZlJyk7XG4gICAgJG1vZGFsQnRuTmVnYXRpdmUgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1uZWdhdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG4gICAgLy8gLy8gYTExeVxuXG4gICAgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyB8fCBwcm9wcy5kaWFsb2dUeXBlID09PSAnY29uZmlybScpe1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdyb2xlJywgJ2FsZXJ0ZGlhbG9nJyk7XG4gICAgfWVsc2UgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3ByZXZpZXdJbWFnZScpe1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdyb2xlJywgJ2RpYWxvZycpO1xuXG4gICAgICBjb25zdCAkc3dpcGVyID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5jb21wb25lbnQtc3dpcGVyJylcbiAgICAgIGNvbnN0IHN3aXBlciA9IG5ldyBldFVJLmNvbXBvbmVudHMuU3dpcGVyQ29tcCgpO1xuICAgICAgc3dpcGVyLmNvcmUuaW5pdCgkc3dpcGVyLCB7XG4gICAgICAgIG5hdmlnYXRpb246IHRydWUsXG4gICAgICAgIHBhZ2luYXRpb246IHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2lkJywgaWQpO1xuICAgIGlmICgkbW9kYWxUaXRsZSkgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWxUaXRsZSwgJ2lkJywgdGl0bGVJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdhcmlhLWxhYmVsbGVkYnknLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3RhYmluZGV4JywgJy0xJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgeyBnZXRUb3BEZXB0aCwgc2V0TGF5ZXJPcGFjaXR5IH0gPSBldFVJLmhvb2tzLnVzZUxheWVyKCdkaWFsb2cnKTtcblxuICAgIGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSA9ICgpID0+IHtcbiAgICB9XG5cbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICAgIGlmKCFzdGF0ZS50cmlnZ2VyKXtcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrXG4gICAgICB9XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgekluZGV4ID0gZ2V0VG9wRGVwdGgoKTtcblxuICAgICAgJG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgJG1vZGFsLnN0eWxlLnpJbmRleCA9IHpJbmRleFxuXG4gICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHsgZHVyYXRpb246IDAsIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDAgfSkudG8oJG1vZGFsRGltbSwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgIH0pO1xuXG4gICAgICBnc2FwXG4gICAgICAgIC50aW1lbGluZSgpXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgc2NhbGU6IDAuOTUsXG4gICAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIH0pXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHsgZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5UGVyY2VudDogMCwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyB9KTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxEaW1tLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICRtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsQ29udGFpbmVyLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBzY2FsZTogMC45NSxcbiAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIGVhc2U6ICdQb3dlcjIuZWFzZU91dCcsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJG1vZGFsLnN0eWxlLnpJbmRleCA9IG51bGxcblxuICAgICAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXN0cm95KCk7XG5cbiAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNoaWxkKCRtb2RhbCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBjbG9zZSk7XG5cbiAgICBpZiAocHJvcHMuZGltbUNsaWNrKSB7XG4gICAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbERpbW1TZWxlY3RvciwgY2xvc2UpO1xuICAgIH1cblxuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQnRuUG9zaXRpdmUsICgpID0+IHtcbiAgICAgIGlmIChwcm9wcy5jYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrO1xuICAgICAgfSBlbHNlIGlmIChwcm9wcy5wb3NpdGl2ZUNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMucG9zaXRpdmVDYWxsYmFjaztcbiAgICAgIH1cblxuICAgICAgY2xvc2UoJ2J0blBvc2l0aXZlJyk7XG4gICAgfSk7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxCdG5OZWdhdGl2ZSwgKCkgPT4ge1xuICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrO1xuXG4gICAgICBjbG9zZSgnYnRuTmVnYXRpdmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG5cbiAgICBpZiAoaXNPcGVuZWQpIHtcbiAgICAgIGFjdGlvbnMub3BlbigpO1xuXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSh0cmlnZ2VyKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJywgdHJpZ2dlciB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogIE1vZGFsXG4gKi9cbmZ1bmN0aW9uIE1vZGFsKCkge1xuICBjb25zdCB7XG4gICAgYWN0aW9ucyxcbiAgICBwcm9wcyxcbiAgICBzdGF0ZSxcbiAgICBzZXRQcm9wcyxcbiAgICBzZXRTdGF0ZSxcbiAgICBzZXRUYXJnZXQsXG4gICAgYWRkRXZlbnQsXG4gICAgcmVtb3ZlRXZlbnQsXG4gIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICAgIGRpbW1DbGljazogdHJ1ZSxcbiAgICAgIGVzYzogdHJ1ZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgRElNTV9PUEFDSVRZID0gMC42O1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSBcIm1vZGFsXCI7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcblxuICBsZXQgZm9jdXNUcmFwSW5zdGFuY2UsIG1vZGFsRGltbVNlbGVjdG9yLCBtb2RhbENsb3NlQnRuU2VsZWN0b3I7XG4gIGxldCAkdGFyZ2V0LCAkaHRtbCwgJG1vZGFsVGl0bGUsICRtb2RhbENvbnRhaW5lciwgJG1vZGFsRGltbTtcblxuICB7XG4gICAgLyoqXG4gICAgICogaW5pdFxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBmb2N1cyB0cmFwXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxuICAgICAgICBvbkFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzQWN0aXZhdGUsXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUsXG4gICAgICB9KTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIC8vIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIF9wcm9wcyAmJlxuICAgICAgICBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmXG4gICAgICAgICEkdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKVxuICAgICAgKVxuICAgICAgICByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciA9IFwiLm1vZGFsLWNsb3NlXCI7XG4gICAgbW9kYWxEaW1tU2VsZWN0b3IgPSBcIi5tb2RhbC1kaW1tXCI7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJG1vZGFsVGl0bGUgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtdGl0XCIpO1xuICAgICRtb2RhbERpbW0gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IobW9kYWxEaW1tU2VsZWN0b3IpO1xuICAgICRtb2RhbENvbnRhaW5lciA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1jb250YWluZXJcIik7XG4gICAgJGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgXCItdGl0XCIpO1xuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgXCJyb2xlXCIsIFwiZGlhbG9nXCIpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgXCJhcmlhLW1vZGFsXCIsIFwidHJ1ZVwiKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIFwiaWRcIiwgaWQpO1xuICAgIGlmICgkbW9kYWxUaXRsZSkgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWxUaXRsZSwgXCJpZFwiLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGNvbnN0IHsgZ2V0VG9wRGVwdGgsIHNldExheWVyT3BhY2l0eSB9ID0gZXRVSS5ob29rcy51c2VMYXllcihcIm1vZGFsXCIpO1xuXG4gICAgYWN0aW9ucy5mb2N1c0FjdGl2YXRlID0gKCkgPT4ge307XG5cbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICAgIGNsb3NlKCk7XG4gICAgICAvLyBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHpJbmRleCA9IGdldFRvcERlcHRoKCk7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuXG4gICAgICAkdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAkdGFyZ2V0LnN0eWxlLnpJbmRleCA9IHpJbmRleDtcblxuICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG5cbiAgICAgIGdzYXBcbiAgICAgICAgLnRpbWVsaW5lKClcbiAgICAgICAgLnRvKCRtb2RhbERpbW0sIHsgZHVyYXRpb246IDAsIGRpc3BsYXk6IFwiYmxvY2tcIiwgb3BhY2l0eTogMCB9KVxuICAgICAgICAudG8oJG1vZGFsRGltbSwgeyBkdXJhdGlvbjogMC4xNSwgb3BhY2l0eTogMSB9KTtcblxuICAgICAgZ3NhcFxuICAgICAgICAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7XG4gICAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgICAgZGlzcGxheTogXCJibG9ja1wiLFxuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgc2NhbGU6IDAuOTUsXG4gICAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIH0pXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgIHNjYWxlOiAxLFxuICAgICAgICAgIHlQZXJjZW50OiAwLFxuICAgICAgICAgIGVhc2U6IFwiUG93ZXIyLmVhc2VPdXRcIixcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJcIjtcblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHtcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsRGltbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgc2NhbGU6IDAuOTUsXG4gICAgICAgIHlQZXJjZW50OiAyLFxuICAgICAgICBlYXNlOiBcIlBvd2VyMi5lYXNlT3V0XCIsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAkdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAkdGFyZ2V0LnN0eWxlLnpJbmRleCA9IG51bGw7XG5cbiAgICAgICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudChcImNsaWNrXCIsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciwgY2xvc2UpO1xuXG4gICAgaWYgKHByb3BzLmRpbW1DbGljaykge1xuICAgICAgYWRkRXZlbnQoXCJjbGlja1wiLCBtb2RhbERpbW1TZWxlY3RvciwgY2xvc2UpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSBcIm9wZW5cIjtcblxuICAgIGlmIChpc09wZW5lZCkge1xuICAgICAgYWN0aW9ucy5vcGVuKCk7XG5cbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmFjdGl2YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcblxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuZGVhY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogXCJvcGVuXCIgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcImNsb3NlXCIgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcblxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCJmdW5jdGlvbiBTZWxlY3RCb3goKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgdHlwZTogXCJjdXN0b21cIixcbiAgICAgIGxhYmVsOiBcIlwiLFxuICAgICAgZGVmYXVsdDogXCJcIixcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIHNlbGVjdGVkSW5kZXg6IDAsXG4gICAgICB0cmFuc2l0aW9uOiBcIm5vcm1hbFwiLFxuICAgICAgc2Nyb2xsVG86IGZhbHNlLFxuICAgICAgZ3NhcE9wdGlvbjoge30sXG4gICAgICBzdGF0ZTogXCJjbG9zZVwiLFxuICAgIH0sXG4gICAge30sXG4gICAgcmVuZGVyLFxuICApO1xuICBjb25zdCB7ICR0ZW1wbGF0ZUN1c3RvbUhUTUwsICR0ZW1wbGF0ZUJhc2ljSFRNTCB9ID0gdXNlU2VsZWN0Qm94VGVtcCgpO1xuICBjb25zdCB7IHVzZVNlbGVjdFNob3cgfSA9IHVzZVRyYW5zaXRpb24oKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gXCJzZWxlY3RcIjtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQgY29tcG9uZW50ID0ge307XG4gIGxldCAkdGFyZ2V0LFxuICAgIC8vIOyalOyGjOq0gOugqCDrs4DsiJjrk6RcbiAgICBzZWxlY3RMYWJlbCxcbiAgICBzZWxlY3RDb21ib0JveCxcbiAgICBzZWxlY3RMaXN0Qm94LFxuICAgIHNlbGVjdE9wdGlvbixcbiAgICB0aW1lbGluZTtcblxuICB7XG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICAgIHRocm93IEVycm9yKFwidGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuXCIpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIiwgXCJ0cnVlXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgc2V0dXBUZW1wbGF0ZSgpO1xuXG4gICAgICBpZiAocHJvcHMudHlwZSA9PT0gXCJiYXNpY1wiKSByZXR1cm47XG5cbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIGVmZmVjdFxuICAgICAgdGltZWxpbmUgPSB1c2VTZWxlY3RTaG93KCR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3RMaXN0Qm94KSwgcHJvcHMudHJhbnNpdGlvbiwgcHJvcHMuZ3NhcE9wdGlvbikudGltZWxpbmU7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBhY3Rpb25zW3Byb3BzLnN0YXRlIHx8IHN0YXRlLnN0YXRlXT8uKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1pbml0XCIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIGlmIChwcm9wcy5pdGVtcy5sZW5ndGggPCAxKSByZXR1cm47XG4gICAgaWYgKHByb3BzLnR5cGUgPT09IFwiY3VzdG9tXCIpIHtcbiAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbmRleCB9ID0gcHJvcHM7XG4gICAgICBjb25zdCBpdGVtTGlzdFRlbXAgPSBwcm9wcy5pdGVtcy5tYXAoKGl0ZW0pID0+ICR0ZW1wbGF0ZUN1c3RvbUhUTUwuaXRlbXMoaXRlbSkpLmpvaW4oXCJcIik7XG5cbiAgICAgICR0YXJnZXQuaW5uZXJIVE1MID0gYFxuICAgICAgICAke3Byb3BzLmxhYmVsICYmICR0ZW1wbGF0ZUN1c3RvbUhUTUwubGFiZWwocHJvcHMubGFiZWwpfVxuICAgICAgICAke3Byb3BzLmRlZmF1bHQgPyAkdGVtcGxhdGVDdXN0b21IVE1MLnNlbGVjdEJ0bihwcm9wcy5kZWZhdWx0KSA6ICR0ZW1wbGF0ZUN1c3RvbUhUTUwuc2VsZWN0QnRuKHByb3BzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT0gcHJvcHMuaXRlbXNbc2VsZWN0ZWRJbmRleF0udmFsdWUpLnRleHQpfVxuICAgICAgICAke3Byb3BzLml0ZW1zICYmICR0ZW1wbGF0ZUN1c3RvbUhUTUwuaXRlbXNXcmFwKGl0ZW1MaXN0VGVtcCl9XG4gICAgICBgO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZWxlY3RCdG5UZW1wID0gJHRlbXBsYXRlQmFzaWNIVE1MLnNlbGVjdEJ0bihwcm9wcy5kZWZhdWx0KTtcbiAgICAgIGNvbnN0IGl0ZW1MaXN0VGVtcCA9IHByb3BzLml0ZW1zLm1hcCgoaXRlbSkgPT4gJHRlbXBsYXRlQmFzaWNIVE1MLml0ZW1zKGl0ZW0pKS5qb2luKFwiXCIpO1xuXG4gICAgICAkdGFyZ2V0LmlubmVySFRNTCA9IGBcbiAgICAgICAgJHtwcm9wcy5sYWJlbCAmJiAkdGVtcGxhdGVCYXNpY0hUTUwubGFiZWwocHJvcHMubGFiZWwpfVxuICAgICAgICAke3Byb3BzLml0ZW1zICYmICR0ZW1wbGF0ZUJhc2ljSFRNTC5pdGVtc1dyYXAoc2VsZWN0QnRuVGVtcCArIGl0ZW1MaXN0VGVtcCl9XG4gICAgICBgO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIHNlbGVjdExhYmVsID0gXCIuY29tYm8tbGFiZWxcIjtcbiAgICBzZWxlY3RDb21ib0JveCA9IFwiLnNlbGVjdC1ib3hcIjtcbiAgICBzZWxlY3RMaXN0Qm94ID0gXCIuc2VsZWN0LW9wdGlvbnNcIjtcbiAgICBzZWxlY3RPcHRpb24gPSBcIi5vcHRpb25cIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuICAgIGNvbnN0IGxhYmVsSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgY29tYm9Cb3hJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChcImNvbWJvYm94XCIpO1xuICAgIGNvbnN0IGxpc3RCb3hJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChcImxpc3Rib3hcIik7XG5cbiAgICAvLyBhMTF5XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMYWJlbCwgXCJpZFwiLCBsYWJlbElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImlkXCIsIGNvbWJvQm94SWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwicm9sZVwiLCBcImNvbWJvYm94XCIpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIGxhYmVsSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1jb250cm9sc1wiLCBsaXN0Qm94SWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgXCJpZFwiLCBsaXN0Qm94SWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgXCJyb2xlXCIsIFwibGlzdGJveFwiKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIGxhYmVsSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgXCJ0YWJpbmRleFwiLCAtMSk7XG5cbiAgICAvLyBzZWxlY3QgcHJvcGVydHlcbiAgICBjb25zdCBvcHRpb25zID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdE9wdGlvbik7XG4gICAgb3B0aW9ucy5mb3JFYWNoKChlbCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbklkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKFwib3B0aW9uXCIpO1xuXG4gICAgICAkdGFyZ2V0W2luZGV4XSA9IGVsO1xuICAgICAgZWxbXCJpbmRleFwiXSA9IGluZGV4O1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwiaWRcIiwgb3B0aW9uSWQpO1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcIm9wdGlvblwiKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgZmFsc2UpO1xuXG4gICAgICBwcm9wcy5pdGVtc1tpbmRleF0/LmRpc2FibGVkICYmIGVsLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuXG4gICAgICBpZiAoISR0YXJnZXRbXCJvcHRpb25zXCJdKSAkdGFyZ2V0W1wib3B0aW9uc1wiXSA9IFtdO1xuICAgICAgJHRhcmdldFtcIm9wdGlvbnNcIl1baW5kZXhdID0gZWw7XG4gICAgfSk7XG5cbiAgICAhcHJvcHMuZGVmYXVsdCAmJiBzZWxlY3RJdGVtKG9wdGlvbnNbcHJvcHMuc2VsZWN0ZWRJbmRleF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGxldCBzZWxlY3RJbmRleCA9IGlzTmFOKCR0YXJnZXQuc2VsZWN0ZWRJbmRleCkgPyAtMSA6ICR0YXJnZXQuc2VsZWN0ZWRJbmRleDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUluZGV4KHN0YXRlKSB7XG4gICAgICBpZiAoIXN0YXRlKSByZXR1cm47XG4gICAgICBzZWxlY3RJbmRleCA9IGlzTmFOKCR0YXJnZXQuc2VsZWN0ZWRJbmRleCkgPyAtMSA6ICR0YXJnZXQuc2VsZWN0ZWRJbmRleDtcbiAgICAgIHVwZGF0ZUN1cnJlbnRDbGFzcygkdGFyZ2V0W3NlbGVjdEluZGV4XSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga2V5RXZlbnRDYWxsYmFjaygpIHtcbiAgICAgIHVwZGF0ZUN1cnJlbnRDbGFzcygkdGFyZ2V0W3NlbGVjdEluZGV4XSk7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiLCAkdGFyZ2V0W3NlbGVjdEluZGV4XS5pZCk7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7c2VsZWN0Q29tYm9Cb3h9IDpsYXN0LWNoaWxkYCkudGV4dENvbnRlbnQgPSAkdGFyZ2V0W3NlbGVjdEluZGV4XS50ZXh0Q29udGVudDtcbiAgICB9XG5cbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0Q29tYm9Cb3gpPy5mb2N1cygpO1xuICAgICAgb3BlblN0YXRlKCk7XG4gICAgICB1cGRhdGVJbmRleCh0cnVlKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7c2VsZWN0Q29tYm9Cb3h9IDpsYXN0LWNoaWxkYCkudGV4dENvbnRlbnQgPSAkdGFyZ2V0W1wib3B0aW9uc1wiXVskdGFyZ2V0LnNlbGVjdGVkSW5kZXhdPy50ZXh0Q29udGVudCA/PyBwcm9wcy5kZWZhdWx0O1xuICAgICAgY2xvc2VTdGF0ZSgpO1xuICAgIH07XG4gICAgYWN0aW9ucy5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudFwiKTtcbiAgICAgIHNlbGVjdEl0ZW0oY3VycmVudEVsKTtcbiAgICAgIGNsb3NlU3RhdGUoKTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5maXJzdCA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gMDtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuICAgIGFjdGlvbnMubGFzdCA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gJHRhcmdldFtcIm9wdGlvbnNcIl0ubGVuZ3RoIC0gMTtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuICAgIGFjdGlvbnMudXAgPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9IE1hdGgubWF4KC0tc2VsZWN0SW5kZXgsIDApO1xuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xuICAgIH07XG4gICAgYWN0aW9ucy5kb3duID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSBNYXRoLm1pbigrK3NlbGVjdEluZGV4LCAkdGFyZ2V0W1wib3B0aW9uc1wiXS5sZW5ndGggLSAxKTtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuXG4gICAgY29tcG9uZW50Lm9wZW4gPSBhY3Rpb25zLm9wZW47XG4gICAgY29tcG9uZW50LmNsb3NlID0gYWN0aW9ucy5jbG9zZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGlmIChwcm9wcy50eXBlID09PSBcImJhc2ljXCIpIHJldHVybjtcblxuICAgIC8vIGExMXlcbiAgICBjb25zdCBhY3Rpb25MaXN0ID0ge1xuICAgICAgdXA6IFtcIkFycm93VXBcIl0sXG4gICAgICBkb3duOiBbXCJBcnJvd0Rvd25cIl0sXG4gICAgICBmaXJzdDogW1wiSG9tZVwiLCBcIlBhZ2VVcFwiXSxcbiAgICAgIGxhc3Q6IFtcIkVuZFwiLCBcIlBhZ2VEb3duXCJdLFxuICAgICAgY2xvc2U6IFtcIkVzY2FwZVwiXSxcbiAgICAgIHNlbGVjdDogW1wiRW50ZXJcIiwgXCIgXCJdLFxuICAgIH07XG5cbiAgICBhZGRFdmVudChcImJsdXJcIiwgc2VsZWN0Q29tYm9Cb3gsIChlKSA9PiB7XG4gICAgICBpZiAoZS5yZWxhdGVkVGFyZ2V0Py5yb2xlID09PSBcImxpc3Rib3hcIikgcmV0dXJuO1xuICAgICAgYWN0aW9ucy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgYWRkRXZlbnQoXCJjbGlja1wiLCBzZWxlY3RDb21ib0JveCwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIGNvbnN0IHRvZ2dsZVN0YXRlID0gc3RhdGUuc3RhdGUgPT09IFwib3BlblwiID8gXCJjbG9zZVwiIDogXCJvcGVuXCI7XG4gICAgICBhY3Rpb25zW3RvZ2dsZVN0YXRlXT8uKCk7XG4gICAgfSk7XG5cbiAgICAvLyBhMTF5XG4gICAgYWRkRXZlbnQoXCJrZXlkb3duXCIsIHNlbGVjdENvbWJvQm94LCAoZSkgPT4ge1xuICAgICAgaWYgKHN0YXRlLnN0YXRlID09PSBcImNsb3NlXCIpIHJldHVybjtcblxuICAgICAgY29uc3QgeyBrZXkgfSA9IGU7XG4gICAgICBjb25zdCBhY3Rpb24gPSBPYmplY3QuZW50cmllcyhhY3Rpb25MaXN0KS5maW5kKChbXywga2V5c10pID0+IGtleXMuaW5jbHVkZXMoa2V5KSk7XG5cbiAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBbYWN0aW9uTmFtZV0gPSBhY3Rpb247XG4gICAgICAgIGFjdGlvbnNbYWN0aW9uTmFtZV0/LigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkRXZlbnQoXCJjbGlja1wiLCBzZWxlY3RMaXN0Qm94LCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgaWYgKCF0YXJnZXQucm9sZSA9PT0gXCJvcHRpb25cIikgcmV0dXJuO1xuICAgICAgdXBkYXRlQ3VycmVudENsYXNzKHRhcmdldCk7XG4gICAgICBhY3Rpb25zLnNlbGVjdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzT3BlbmVkID0gc3RhdGUuc3RhdGUgPT09IFwib3BlblwiO1xuXG4gICAgcHJvcHMudHJhbnNpdGlvbiAmJiB0aW1lbGluZShpc09wZW5lZCk7XG4gICAgY2hlY2tPcGVuRGlyKGlzT3BlbmVkKTtcblxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1leHBhbmRlZFwiLCBpc09wZW5lZCk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKTtcbiAgICBpZiAoaXNPcGVuZWQpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIsIHNlbGVjdGVkRWw/LmlkID8/IFwiXCIpO1xuICAgIGVsc2UgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiwgXCJcIik7XG4gIH1cblxuICAvLyBjdXN0b21cbiAgZnVuY3Rpb24gY2hlY2tPcGVuRGlyKHN0YXRlKSB7XG4gICAgaWYgKCFzdGF0ZSB8fCBwcm9wcy5zY3JvbGxUbykgcmV0dXJuOyAvLyBmYWxzZeydtOqxsOuCmCBzY3JvbGxUbyDquLDriqUg7J6I7J2EIOuVjCAtIOyVhOuemOuhnCDsl7TrprxcblxuICAgIGNvbnN0IHsgaGVpZ2h0OiBsaXN0SGVpZ2h0IH0gPSBldFVJLmhvb2tzLnVzZUdldENsaWVudFJlY3QoJHRhcmdldCwgc2VsZWN0TGlzdEJveCk7XG4gICAgY29uc3QgeyBoZWlnaHQ6IGNvbWJvSGVpZ2h0LCBib3R0b206IGNvbWJvQm90dG9tIH0gPSBldFVJLmhvb2tzLnVzZUdldENsaWVudFJlY3QoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gpO1xuICAgIGNvbnN0IHJvbGUgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBNQVJHSU4gPCBjb21ib0JvdHRvbSArIGxpc3RIZWlnaHQ7XG5cbiAgICBldFVJLnV0aWxzLnNldFN0eWxlKCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwiYm90dG9tXCIsIHJvbGUgPyBjb21ib0hlaWdodCArIFwicHhcIiA6IFwiXCIpO1xuICB9XG5cbiAgLy8gdXBkYXRlIC5jdXJyZW50IGNsYXNzXG4gIGZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnRDbGFzcyhhZGRDbGFzc0VsKSB7XG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRcIik/LmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyZW50XCIpO1xuICAgIGFkZENsYXNzRWw/LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50XCIpO1xuICB9XG5cbiAgLy8gc2VsZWN0IGl0ZW1cbiAgZnVuY3Rpb24gc2VsZWN0SXRlbSh0YXJnZXQpIHtcbiAgICBjb25zdCB0YXJnZXRPcHRpb24gPSB0YXJnZXQ/LmNsb3Nlc3Qoc2VsZWN0T3B0aW9uKTtcblxuICAgIGlmICghdGFyZ2V0T3B0aW9uKSByZXR1cm47XG5cbiAgICAkdGFyZ2V0LnNlbGVjdGVkSW5kZXggPSB0YXJnZXRPcHRpb25bXCJpbmRleFwiXTtcbiAgICAkdGFyZ2V0LnZhbHVlID0gdGFyZ2V0T3B0aW9uLmdldEF0dHJpYnV0ZShcImRhdGEtdmFsdWVcIik7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nLCBcImFyaWEtc2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgIHRhcmdldE9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIHRydWUpO1xuXG4gICAgdXBkYXRlQ3VycmVudENsYXNzKCR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykpO1xuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtzZWxlY3RDb21ib0JveH0gOmxhc3QtY2hpbGRgKS50ZXh0Q29udGVudCA9IHRhcmdldE9wdGlvbi50ZXh0Q29udGVudDtcbiAgfVxuXG4gIC8vIHNlbGVjdCBzdGF0ZVxuICBmdW5jdGlvbiBvcGVuU3RhdGUoKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogXCJvcGVuXCIgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZVN0YXRlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6IFwiY2xvc2VcIiB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiBTa2VsXG4gKiAvLyBpbml0LCBzZXR1cCwgdXBkYXRlLCBkZXN0cm95XG4gKiAvLyBzZXR1cFRlbXBsYXRlLCBzZXR1cFNlbGVjdG9yLCBzZXR1cEVsZW1lbnQsIHNldHVwQWN0aW9ucyxcbiAqICAgICAgc2V0RXZlbnQsIHJlbmRlciwgY3VzdG9tRm4sIGNhbGxhYmxlXG4gKlxuICogICAgICBkb23rp4wg7J207Jqp7ZW07IScIHVpIOy0iOq4sO2ZlFxuICogICAgICAgIGRhdGEtcHJvcHMtb3B0MSwgZGF0YS1wcm9wcy1vcHQyLCBkYXRhLXByb3BzLW9wdDNcbiAqICAgICAg6rOg6riJ7Ji17IWYXG4gKiAgICAgICAgZGF0YS1pbml0PWZhbHNlXG4gKiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgU2tlbCgpO1xuICogICAgICAgIGluc3RhbmNlLmNvcmUuaW5pdCgnLnNlbGVjdG9yJywgeyBvcHQxOiAndmFsdWUnIH0pXG4gKlxuICogICAgICBkYXRhLWluaXQg7LKY66asXG4gKi9cbmZ1bmN0aW9uIFNrZWwoKSB7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnRcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZSh7XG4gICAgLy8gcHJvcHNcblxuICB9LCB7XG4gICAgLy8gc3RhdGVcblxuICB9LCByZW5kZXIpO1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnc2tlbCc7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAgIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0LFxuICAgIHNvbWVTZWxlY3Rvciwgb3RoZXJTZWxlY3RvcixcbiAgICAkdGFyZ2V0RWxzMSwgJHRhcmdldEVsczJcblxuICB7XG4gICAgLyoqXG4gICAgICogaW5pdFxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpe1xuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldClcbiAgICAgIH1lbHNle1xuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmKCEkdGFyZ2V0KXtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ3RhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLicpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldClcbiAgICAgIHNldFByb3BzKHsuLi5wcm9wcywgLi4uX3Byb3BzfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICAvLyB0ZW1wbGF0ZSwgc2VsZWN0b3IsIGVsZW1lbnQsIGFjdGlvbnNcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICAgIHNldHVwU2VsZWN0b3IoKVxuICAgICAgc2V0dXBFbGVtZW50KCk7XG4gICAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCl7XG4gICAgJHRhcmdldEVsczIgPSAnLmVsMic7XG4gICAgJHRhcmdldEVsczEgPSAnLmVsMSc7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICBjb25zdCBsYWJlbElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuXG4gICAgLy8gYTExeVxuICAgIHV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICRzZWxlY3RMYWJlbCwgJ2lkJywgbGFiZWxJZCk7XG5cbiAgICAvLyBjb21wb25lbnQgY3VzdG9tIGVsZW1lbnRcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpe1xuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcblxuICAgIH1cblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XG5cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCAkdGFyZ2V0RWxzMSwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIC8vIGhhbmRsZXJcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXJcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgLy8gY2FsbGFibGVcbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfVxuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCJmdW5jdGlvbiBTd2lwZXJDb21wKCkge1xuICBjb25zdCB7XG4gICAgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRTdGF0ZSwgc2V0UHJvcHMsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50XG4gIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgIG9uOiB7XG4gICAgICAgIHNsaWRlQ2hhbmdlVHJhbnNpdGlvbkVuZCgpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHt0aGlzLnJlYWxJbmRleCArIDF967KIIOynuCBzbGlkZWApO1xuICAgICAgICAgIHNldFN0YXRlKHsgYWN0aXZlSW5kZXg6IHRoaXMucmVhbEluZGV4ICsgMSB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGF0ZTogXCJcIixcbiAgICAgIHJ1bm5pbmc6IFwiXCIsXG4gICAgICBhY3RpdmVJbmRleDogMCxcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvKipcbiAgICogZGF0YS1wcm9wcyDrpqzsiqTtirhcbiAgICovXG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9IFwic3dpcGVyXCI7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsICRzd2lwZXIsICRzd2lwZXJOYXZpZ2F0aW9uLCAkc3dpcGVyUGFnaW5hdGlvbiwgJHN3aXBlckF1dG9wbGF5LCAkc3dpcGVyU2xpZGVUb0J1dHRvbjtcblxuICB7XG4gICAgLyoqXG4gICAgICogaW5pdFxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICAvLyB0ZW1wbGF0ZSwgc2VsZWN0b3IsIGVsZW1lbnQsIGFjdGlvbnNcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKHByb3BzICYmIHV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIik7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyBuYXZpZ2F0aW9uLCBwYWdpbmF0aW9uLCBhdXRvcGxheSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MIH0gPSB1c2VTd2lwZXJUbXBsKCk7XG4gICAgbGV0IG5hdmlnYXRpb25FbCwgcGFnaW5hdGlvbkVsLCBhdXRvcGxheUVsO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlSFRNTEVsZW1lbnQoX2NsYXNzTmFtZSwgaHRtbFN0cmluZykge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgdGVtcGxhdGUuY2xhc3NMaXN0LmFkZChfY2xhc3NOYW1lKTtcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxTdHJpbmc7XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaWYgKG5hdmlnYXRpb24pIHtcbiAgICAgIG5hdmlnYXRpb25FbCA9IGNyZWF0ZUhUTUxFbGVtZW50KFwic3dpcGVyLW5hdmlnYXRpb25cIiwgJHRlbXBsYXRlSFRNTC5uYXZpZ2F0aW9uKCkpO1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci13cmFwcGVyXCIpLmFmdGVyKG5hdmlnYXRpb25FbCk7XG4gICAgICB0eXBlb2YgbmF2aWdhdGlvbiA9PT0gXCJib29sZWFuXCIgJiZcbiAgICAgICAgc2V0UHJvcHMoe1xuICAgICAgICAgIG5hdmlnYXRpb246IHtcbiAgICAgICAgICAgIHByZXZFbDogXCIuc3dpcGVyLWJ1dHRvbi1wcmV2XCIsXG4gICAgICAgICAgICBuZXh0RWw6IFwiLnN3aXBlci1idXR0b24tbmV4dFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChwYWdpbmF0aW9uKSB7XG4gICAgICBwYWdpbmF0aW9uRWwgPSBjcmVhdGVIVE1MRWxlbWVudChcInN3aXBlci1wYWdpbmF0aW9uLXdyYXBcIiwgJHRlbXBsYXRlSFRNTC5wYWdpbmF0aW9uKCkpO1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci13cmFwcGVyXCIpLmFmdGVyKHBhZ2luYXRpb25FbCk7XG4gICAgICB0eXBlb2YgcGFnaW5hdGlvbiA9PT0gXCJib29sZWFuXCIgJiZcbiAgICAgICAgc2V0UHJvcHMoe1xuICAgICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgICAgIGVsOiBcIi5zd2lwZXItcGFnaW5hdGlvblwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhdXRvcGxheSkge1xuICAgICAgYXV0b3BsYXlFbCA9IGNyZWF0ZUhUTUxFbGVtZW50KFwic3dpcGVyLWF1dG9wbGF5LXdyYXBcIiwgJHRlbXBsYXRlSFRNTC5hdXRvcGxheSgpKTtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5zd2lwZXItd3JhcHBlclwiKS5hZnRlcihhdXRvcGxheUVsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgICRzd2lwZXJQYWdpbmF0aW9uID0gXCIuc3dpcGVyLXBhZ2luYXRpb25cIjtcbiAgICAkc3dpcGVyTmF2aWdhdGlvbiA9IFwiLnN3aXBlci1uYXZpZ2F0aW9uXCI7XG4gICAgJHN3aXBlckF1dG9wbGF5ID0gXCIuc3dpcGVyLWF1dG9wbGF5XCI7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcblxuICAgIC8vIGExMXlcblxuICAgIC8vIG5ldyBTd2lwZXIg7IOd7ISxXG4gICAgJHN3aXBlciA9IG5ldyBTd2lwZXIoJHRhcmdldCwgeyAuLi5wcm9wcyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICAvLyBhY3Rpb25zLnN0YXJ0ID0gKCkgPT4ge1xuICAgIC8vICAgcGxheSgpO1xuICAgIC8vIH07XG4gICAgLy9cbiAgICAvLyBhY3Rpb25zLnN0b3AgPSAoKSA9PiB7XG4gICAgLy8gICBzdG9wKCk7XG4gICAgLy8gfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIC8vIGF1dG9wbGF5IOuyhO2KvFxuICAgIGlmIChwcm9wcy5hdXRvcGxheSkge1xuICAgICAgYWRkRXZlbnQoXCJjbGlja1wiLCAkc3dpcGVyQXV0b3BsYXksIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCAkZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgkc3dpcGVyQXV0b3BsYXkpO1xuICAgICAgICBoYW5kbGVBdXRvcGxheSgkZXZlbnRUYXJnZXQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIHJlbmRlclxuICB9XG5cbiAgLy8gYXV0b3BsYXkg6rSA66CoIOy7pOyKpO2FgCDtlajsiJhcbiAgZnVuY3Rpb24gaGFuZGxlQXV0b3BsYXkoJHRhcmdldCkge1xuICAgICR0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShcInBsYXlcIik7XG4gICAgJHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwic3RvcFwiKTtcblxuICAgIGlmICgkdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInN0b3BcIikpIHtcbiAgICAgIHN0b3AoKTtcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicGxheVwiKSkge1xuICAgICAgcGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgJHN3aXBlci5hdXRvcGxheS5zdGFydCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAkc3dpcGVyLmF1dG9wbGF5LnN0b3AoKTtcbiAgfVxuXG4gIC8vIO2KueyglSDsiqzrnbzsnbTrk5zroZwg7J2064+ZXG4gIGZ1bmN0aW9uIG1vdmVUb1NsaWRlKGluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzKSB7XG4gICAgaWYgKHByb3BzLmxvb3ApIHtcbiAgICAgICRzd2lwZXIuc2xpZGVUb0xvb3AoaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc3dpcGVyLnNsaWRlVG8oaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIGdldFN3aXBlckluc3RhbmNlKCkge1xuICAgICAgcmV0dXJuICRzd2lwZXI7IC8vICRzd2lwZXIg7J247Iqk7YS07IqkIOuwmO2ZmFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogU2tlbFxuICogLy8gaW5pdCwgc2V0dXAsIHVwZGF0ZSwgZGVzdHJveVxuICogLy8gc2V0dXBUZW1wbGF0ZSwgc2V0dXBTZWxlY3Rvciwgc2V0dXBFbGVtZW50LCBzZXR1cEFjdGlvbnMsXG4gKiAgICAgIHNldEV2ZW50LCByZW5kZXIsIGN1c3RvbUZuLCBjYWxsYWJsZVxuICovXG5mdW5jdGlvbiBUYWIoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9IFwidGFiXCI7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCwgdGFiSGVhZCwgJHRhYkhlYWRFbCwgdGFiQnRuLCAkdGFiQnRuRWwsIHRhYkNvbnRlbnQsICR0YWJDb250ZW50RWw7XG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICAgIHRocm93IEVycm9yKFwidGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuXCIpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIiwgXCJ0cnVlXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgICAgc2V0dXBTZWxlY3RvcigpO1xuICAgICAgc2V0dXBFbGVtZW50KCk7XG4gICAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgICAgLy8gZWZmZWN0XG4gICAgICBwcm9wcy5zdGlja3kgJiYgc3RpY2t5VGFiKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBwcm9wcy5hY3RpdmUgPz8gJHRhYkJ0bkVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIpKSByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIHRhYkhlYWQgPSBcIi50YWItaGVhZFwiO1xuICAgIHRhYkJ0biA9IFwiLnRhYi1sYWJlbFwiO1xuICAgIHRhYkNvbnRlbnQgPSBcIi50YWItY29udGVudFwiO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICR0YWJIZWFkRWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IodGFiSGVhZCk7XG4gICAgJHRhYkJ0bkVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHRhYkJ0bik7XG4gICAgJHRhYkNvbnRlbnRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCh0YWJDb250ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuICAgIC8vIGExMXlcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHRhYkhlYWQsIFwicm9sZVwiLCBcInRhYmxpc3RcIik7XG5cbiAgICAvLyBjb21wb25lbnQgY3VzdG9tIGVsZW1lbnRcbiAgICAkdGFiSGVhZEVsLnN0eWxlLnRvdWNoQWN0aW9uID0gXCJub25lXCI7XG4gICAgJHRhYkJ0bkVsLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHRhYkJ0bklkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgICAgY29uc3QgdGFiQ29udGVudElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKFwidGFicGFuZWxcIik7XG5cbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0YWJCdG5JZCk7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYlwiKTtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIGZhbHNlKTtcblxuICAgICAgaWYgKCR0YWJDb250ZW50RWxbaW5kZXhdKSB7XG4gICAgICAgICR0YWJDb250ZW50RWxbaW5kZXhdLnNldEF0dHJpYnV0ZShcImlkXCIsIHRhYkNvbnRlbnRJZCk7XG4gICAgICAgICR0YWJDb250ZW50RWxbaW5kZXhdLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJ0YWJwYW5lbFwiKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFiVmFsdWUgPSB0YWIuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIik7XG4gICAgICBjb25zdCB0YWJDb250ZW50VmFsdWUgPSAkdGFiQ29udGVudEVsW2luZGV4XS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKTtcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYCR7dGFiQ29udGVudH1bZGF0YS10YWItdmFsdWU9XCIke3RhYlZhbHVlfVwiXWAsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIHRhYi5pZCk7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkJ0bn1bZGF0YS10YWItdmFsdWU9XCIke3RhYkNvbnRlbnRWYWx1ZX1cIl1gLCBcImFyaWEtY29udHJvbHNcIiwgJHRhYkNvbnRlbnRFbFtpbmRleF0uaWQpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGxldCBzdGFydFggPSAwO1xuICAgIGxldCBlbmRYID0gMDtcbiAgICBsZXQgbW92ZVggPSAwO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gMDtcbiAgICBsZXQgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICBsZXQgY2xpY2thYmxlID0gdHJ1ZTtcblxuICAgIGFjdGlvbnMuc2VsZWN0ID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCB0YXJnZXRCdG4gPSBlLnRhcmdldC5jbG9zZXN0KHRhYkJ0bik7XG4gICAgICBpZiAoIXRhcmdldEJ0bikgcmV0dXJuO1xuICAgICAgaWYgKCFjbGlja2FibGUpIHJldHVybjtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IHRhcmdldEJ0bi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcbiAgICAgIGdzYXAudG8oJHRhYkhlYWRFbCwge1xuICAgICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgICBzY3JvbGxMZWZ0OiB0YXJnZXRCdG4ub2Zmc2V0TGVmdCxcbiAgICAgICAgb3ZlcndyaXRlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuZHJhZ1N0YXJ0ID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoaXNSZWFkeU1vdmUpIHJldHVybjtcbiAgICAgIGlzUmVhZHlNb3ZlID0gdHJ1ZTtcbiAgICAgIHN0YXJ0WCA9IGUueDtcbiAgICAgIHNjcm9sbExlZnQgPSAkdGFiSGVhZEVsLnNjcm9sbExlZnQ7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRyYWdNb3ZlID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG4gICAgICBtb3ZlWCA9IGUueDtcbiAgICAgICR0YWJIZWFkRWwuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQgKyAoc3RhcnRYIC0gbW92ZVgpO1xuICAgIH07XG4gICAgYWN0aW9ucy5kcmFnRW5kID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG4gICAgICBlbmRYID0gZS54O1xuICAgICAgaWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMTApIGNsaWNrYWJsZSA9IHRydWU7XG4gICAgICBlbHNlIGNsaWNrYWJsZSA9IGZhbHNlO1xuICAgICAgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZHJhZ0xlYXZlID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG5cbiAgICAgIC8vIGdzYXAudG8oJHRhYkhlYWRFbCwge1xuICAgICAgLy8gICBzY3JvbGxMZWZ0OiAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpLm9mZnNldExlZnQsXG4gICAgICAvLyAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICAgIC8vIH0pO1xuXG4gICAgICBjbGlja2FibGUgPSB0cnVlO1xuICAgICAgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy51cCA9IChlKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHJldHVybjtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5kb3duID0gKGUpID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nKSByZXR1cm47XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5maXJzdCA9ICgpID0+IHtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6ICR0YWJCdG5FbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmxhc3QgPSAoKSA9PiB7XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiAkdGFiQnRuRWxbJHRhYkJ0bkVsLmxlbmd0aCAtIDFdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZm9jdXNUYXJnZXRWYWx1ZShlbCwgdmFsdWUpIHtcbiAgICAgIGNvbnN0IGZvY3VzVGFyZ2V0ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke2VsfVtkYXRhLXRhYi12YWx1ZT1cIiR7dmFsdWV9XCJdYCk7XG4gICAgICBmb2N1c1RhcmdldD8uZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBjb25zdCBhY3Rpb25MaXN0ID0ge1xuICAgICAgdXA6IFtcIkFycm93TGVmdFwiXSxcbiAgICAgIGRvd246IFtcIkFycm93UmlnaHRcIl0sXG4gICAgICBmaXJzdDogW1wiSG9tZVwiXSxcbiAgICAgIGxhc3Q6IFtcIkVuZFwiXSxcbiAgICAgIHNlbGVjdDogW1wiRW50ZXJcIiwgXCIgXCJdLFxuICAgIH07XG5cbiAgICBhZGRFdmVudChcImNsaWNrXCIsIHRhYkhlYWQsIGFjdGlvbnMuc2VsZWN0KTtcbiAgICBhZGRFdmVudChcInBvaW50ZXJkb3duXCIsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ1N0YXJ0KTtcbiAgICBhZGRFdmVudChcInBvaW50ZXJtb3ZlXCIsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ01vdmUpO1xuICAgIGFkZEV2ZW50KFwicG9pbnRlcnVwXCIsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ0VuZCk7XG4gICAgYWRkRXZlbnQoXCJwb2ludGVybGVhdmVcIiwgdGFiSGVhZCwgYWN0aW9ucy5kcmFnTGVhdmUpO1xuXG4gICAgYWRkRXZlbnQoXCJrZXlkb3duXCIsIHRhYkhlYWQsIChlKSA9PiB7XG4gICAgICBjb25zdCB7IGtleSB9ID0gZTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5lbnRyaWVzKGFjdGlvbkxpc3QpLmZpbmQoKFtfLCBrZXlzXSkgPT4ga2V5cy5pbmNsdWRlcyhrZXkpKTtcblxuICAgICAgaWYgKGFjdGlvbikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IFthY3Rpb25OYW1lXSA9IGFjdGlvbjtcbiAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXT8uKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IGdldElkID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3RhYkJ0bn1bYXJpYS1zZWxlY3RlZD1cInRydWVcIl1gKT8uaWQ7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nLCBcImFyaWEtc2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYCR7dGFiQnRufVtkYXRhLXRhYi12YWx1ZT1cIiR7c3RhdGUuYWN0aXZlVmFsdWV9XCJdYCwgXCJhcmlhLXNlbGVjdGVkXCIsIHRydWUpO1xuXG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3RhYkNvbnRlbnR9W2FyaWEtbGFiZWxsZWRieT1cIiR7Z2V0SWR9XCJdYCk/LmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHt0YWJDb250ZW50fVtkYXRhLXRhYi12YWx1ZT1cIiR7c3RhdGUuYWN0aXZlVmFsdWV9XCJdYCk/LmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICB9XG5cbiAgLy8gY3VzdG9tXG4gIGZ1bmN0aW9uIHN0aWNreVRhYigpIHtcbiAgICBjb25zdCB7IGJvdHRvbSB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KGRvY3VtZW50LCBwcm9wcy5zdGlja3kpO1xuXG4gICAgJHRhcmdldC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICAkdGFiSGVhZEVsLnN0eWxlLnBvc2l0aW9uID0gXCJzdGlja3lcIjtcbiAgICBpZiAoIWJvdHRvbSkgJHRhYkhlYWRFbC5zdHlsZS50b3AgPSAwICsgXCJweFwiO1xuICAgIGVsc2UgJHRhYkhlYWRFbC5zdHlsZS50b3AgPSBib3R0b20gKyBcInB4XCI7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICB1cGRhdGUsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cblxuLypcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgJHRhYkJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbXBvbmVudD1cInRhYlwiXScpO1xuICAkdGFiQm94LmZvckVhY2goKHRhYkJveCkgPT4ge1xuICAgIGNvbnN0IHRhYiA9IFRhYigpO1xuICAgIHRhYi5jb3JlLmluaXQodGFiQm94KTtcbiAgfSk7XG59KTtcbiovXG4iLCIvLyBwcm9wc+uKlCDsnKDsoIAo7J6R7JeF7J6QKeqwgCDsoJXsnZjtlaAg7IiYIOyeiOuKlCDsmLXshZhcbi8vIHN0YXRl64qUIOuCtOu2gCDroZzsp4Hsl5DshJwg7J6R64+Z65CY64qUIOuhnOyngSAoZXg6IHN0YXRlIG9wZW4gY2xvc2UgYXJpYSDrk7Hrk7EuLi4uIClcblxuLy8g7YOA7J6FIOygleydmFxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRvb2x0aXBQcm9wc0NvbmZpZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBkaXNhYmxlZCAtIOyalOyGjOqwgCDruYTtmZzshLHtmZQg7IOB7YOc7J247KeA66W8IOuCmO2DgOuDheuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb25jZSAtIOydtOuypO2KuOuCmCDslaHshZjsnYQg7ZWcIOuyiOunjCDsi6TtlontlaDsp4Ag7Jes67aA66W8IOqysOygle2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7ZmFsc2UgfCBudW1iZXJ9IGR1cmF0aW9uIC0g7JWg64uI66mU7J207IWYIOuYkOuKlCDsnbTrsqTtirgg7KeA7IaNIOyLnOqwhOydhCDrsIDrpqzstIgg64uo7JyE66GcIOyEpOygle2VqeuLiOuLpC4gJ2ZhbHNlJ+ydvCDqsr3smrAg7KeA7IaNIOyLnOqwhOydhCDrrLTsi5ztlanri4jri6QuXG4gKiBAcHJvcGVydHkge09iamVjdH0gb3JpZ2luIC0g7JuQ7KCQIOuYkOuKlCDsi5zsnpEg7KeA7KCQ7J2EIOuCmO2DgOuCtOuKlCDqsJ3ssrTsnoXri4jri6QuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBUb29sdGlwU3RhdGVDb25maWdcbiAqIEBwcm9wZXJ0eSB7J2Nsb3NlJyB8ICdvcGVuJ30gc3RhdGUgLSDtiLTtjIHsnZgg7IOB7YOc6rCSLiBjbG9zZSwgb3BlbiDrkZgg7KSR7JeQIO2VmOuCmOyeheuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7J2JvdHRvbScgfCAndG9wJyB8ICdsZWZ0JyB8ICdyaWdodCd9IHBvc2l0aW9uIC0g7Yi07YyB7J2YIOychOy5mOqwki4gYm90dG9tLCB0b3AsIGxlZnQsIHJpZ2h0IOykkeyXkCDtlZjrgpjsnoXri4jri6QuXG4gKi9cblxuZnVuY3Rpb24gVG9vbHRpcCgpIHtcbiAgY29uc3Qge1xuICAgIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudFxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKHtcblxuICB9LCB7XG5cbiAgfSwgcmVuZGVyKTtcblxuICAvLyBzdGF0ZSDrs4Dqsr0g7IucIOuenOuNlCDsnqztmLjstpxcbiAgY29uc3QgbmFtZSA9ICd0b29sdGlwJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7VG9vbHRpcFByb3BzQ29uZmlnfSAqL1xuICAgIC8qKiBAdHlwZSB7VG9vbHRpcFN0YXRlQ29uZmlnfSAqL1xuICAgIC8vIOyalOyGjOq0gOugqCDrs4DsiJjrk6RcbiAgbGV0ICR0YXJnZXQsXG4gICAgJHRvb2x0aXBUcmlnZ2VyQnRuLFxuICAgICR0b29sdGlwQ2xvc2VCdG4sXG4gICAgJHRvb2x0aXBDb250YWluZXI7XG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghJHRhcmdldCkge1xuICAgICAgICB0aHJvdyBFcnJvcigndGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuJyk7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSB0aGlzO1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcblxuICAgICAgLy8gZm9jdXMgdHJhcFxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBmb2N1c1RyYXAuY3JlYXRlRm9jdXNUcmFwKCR0YXJnZXQsIHtcbiAgICAgICAgb25BY3RpdmF0ZTogKCkgPT4ge30sXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogKCkgPT4ge1xuICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBlbGVtZW50XG4gICAgJHRvb2x0aXBDb250YWluZXIgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50b29sdGlwLWNvbnRhaW5lcicpO1xuXG4gICAgLy8gc2VsZWNvdHJcbiAgICAkdG9vbHRpcFRyaWdnZXJCdG4gPSAnLnRvb2x0aXAtYnRuJztcbiAgICAkdG9vbHRpcENsb3NlQnRuID0gJy5idG4tY2xvc2UnO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG5cbiAgICAvLyBhMTF5XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCB0aXRsZUlkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsICR0b29sdGlwVHJpZ2dlckJ0biwgb3Blbik7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgJHRvb2x0aXBDbG9zZUJ0biwgY2xvc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgaXNTaG93ID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcbiAgICBjb25zdCBleHBhbmRlZCA9ICR0b29sdGlwQ29udGFpbmVyLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZSc7XG4gICAgY29uc3QgJGNsb3NlQnRuID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCR0b29sdGlwQ2xvc2VCdG4pO1xuXG4gICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgIWV4cGFuZGVkKTtcbiAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZXhwYW5kZWQpO1xuICAgIGlmIChpc1Nob3cpIHtcbiAgICAgIGhhbmRsZU9wZW5BbmltYXRpb24odHlwZSk7XG4gICAgICAkY2xvc2VCdG4uZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFuZGxlQ2xvc2VBbmltYXRpb24odHlwZSk7XG4gICAgICAkY2xvc2VCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPcGVuQW5pbWF0aW9uKHR5cGUpIHtcbiAgICBjb25zdCBzZXRBbmltYXRpb24gPSB7IGR1cmF0aW9uOiAwLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfTtcbiAgICBjb25zdCBzY2FsZSA9IHByb3BzLnRyYW5zZm9ybS5zY2FsZS54O1xuICAgIGlmICh0eXBlID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwgc2V0QW5pbWF0aW9uKS50bygkdG9vbHRpcENvbnRhaW5lciwgeyBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDEgfSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICdjdXN0b20nKSB7XG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHNldEFuaW1hdGlvbikudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBzY2FsZTogMSwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMSB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbG9zZUFuaW1hdGlvbih0eXBlKSB7XG4gICAgY29uc3Qgc2NhbGUgPSBwcm9wcy50cmFuc2Zvcm0uc2NhbGUueDtcbiAgICBpZiAodHlwZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfSk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnY3VzdG9tJykge1xuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7IGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbiwgc2NhbGU6IHNjYWxlLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBpZiAoc3RhdGUuc3RhdGUgIT09ICdvcGVuJykge1xuICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGlmIChzdGF0ZS5zdGF0ZSAhPT0gJ2Nsb3NlJykge1xuICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgaW5pdCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgICByZW1vdmVFdmVudCxcbiAgICB9LFxuXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH1cblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuXG4vLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4vLyAgIGNvbnN0ICR0b29sdGlwU2VsZWN0b3IgPSBkb2N1bWVudD8ucXVlcnlTZWxlY3RvckFsbChcIi5jb21wb25lbnQtdG9vbHRpcFwiKTtcbi8vICAgJHRvb2x0aXBTZWxlY3Rvci5mb3JFYWNoKCh0b29sdGlwKSA9PiB7XG4vLyAgICAgY29uc3QgdG9vbHRpcENvbXBvbmVudCA9IFRvb2x0aXAoKTtcbi8vICAgICB0b29sdGlwQ29tcG9uZW50LmluaXQodG9vbHRpcCk7XG4vLyAgIH0pO1xuLy8gfSk7XG5cbi8vIOq4sO2DgCDsmLXshZjrk6QuLi5cbi8vIGR1cmF0aW9uOiAzMDAsXG4vLyBoZWlnaHQ6IDIwMCxcbi8vIHRyYW5zZm9ybToge1xuLy8gICBzY2FsZToge1xuLy8gICAgIHg6IDEsXG4vLyAgICAgeTogMSxcbi8vICAgfSxcbi8vICAgdHJhbnNsYXRlOiB7XG4vLyAgICAgeDogMCxcbi8vICAgICB5OiA5MCxcbi8vICAgfSxcbi8vICAgZGVsYXk6IDAsXG4vLyAgIGVhc2Vpbmc6IFwiZWFzZS1vdXRcIixcbi8vIH0sXG5cbi8qKlxuICogU2tlbFxuICogLy8gaW5pdCwgc2V0dXAsIHVwZGF0ZSwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50LCBkZXN0cm95XG4gKiAvLyB0ZW1wbGF0ZSwgc2V0dXBTZWxlY3Rvciwgc2V0dXBFbGVtZW50LCBzZXRFdmVudCwgcmVuZGVyLCBjdXN0b21GbiwgY2FsbGFibGVcbiAqL1xuIiwiXG5ldFVJLmNvbXBvbmVudHMgPSB7XG5cdEFjY29yZGlvbixcblx0RGlhbG9nLFxuXHRNb2RhbCxcblx0U2VsZWN0Qm94LFxuXHRTa2VsLFxuXHRTd2lwZXJDb21wLFxuXHRUYWIsXG5cdFRvb2x0aXBcbn1cbiIsIi8vIGluaXQganNcbmZ1bmN0aW9uIGluaXRVSSgpIHtcbiAgY29uc3QgY29tcG9uZW50TGlzdCA9IFtcbiAgICB7XG4gICAgICBzZWxlY3RvcjogXCIuY29tcG9uZW50LW1vZGFsXCIsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLk1vZGFsLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6IFwiLmNvbXBvbmVudC1hY2NvcmRpb25cIixcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuQWNjb3JkaW9uLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6IFwiLmNvbXBvbmVudC10b29sdGlwXCIsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlRvb2x0aXAsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJ1tkYXRhLWNvbXBvbmVudD1cInRhYlwiXScsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlRhYixcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnW2RhdGEtY29tcG9uZW50PVwic2VsZWN0LWJveFwiXScsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlNlbGVjdEJveCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnW2RhdGEtY29tcG9uZW50PVwic3dpcGVyXCJdJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuU3dpcGVyQ29tcCxcbiAgICB9LFxuICBdO1xuXG4gIGNvbXBvbmVudExpc3QuZm9yRWFjaCgoeyBzZWxlY3RvciwgZm4gfSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKGZuKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgaWYgKGVsLmRhdGFzZXQuaW5pdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBmbigpO1xuICAgICAgY29tcG9uZW50LmNvcmUuaW5pdChlbCwge30sIHNlbGVjdG9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gZXRVSS5kaWFsb2cgPSBldFVJLmhvb2tzLnVzZURpYWxvZygpO1xufVxuXG5ldFVJLmluaXRVSSA9IGluaXRVSTtcblxuKGZ1bmN0aW9uIGF1dG9Jbml0KCkge1xuICBjb25zdCAkc2NyaXB0QmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaW5pdF1cIik7XG4gIGlmICgkc2NyaXB0QmxvY2spIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0VUkoKTtcbiAgICB9KTtcbiAgfVxufSkoKTtcbiJdfQ==
