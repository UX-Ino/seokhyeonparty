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
    actions, props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({
    // props
    dimmClick: true,
    esc: true,
  }, {
    // state

  }, render);

  // constant
  const DIMM_OPACITY = 0.6;

  // variable
  const name = 'modal';
  let component = {};

  let focusTrapInstance,
    modalDimmSelector, modalCloseBtnSelector;
  let $target, $html,
    $modalTitle, $modalContainer, $modalDimm;

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
      $target.removeAttribute('data-init');
    }
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector(){
    // selector
    modalCloseBtnSelector = '.modal-close'
    modalDimmSelector = '.modal-dimm'

    // element
    $modalTitle = $target.querySelector('.modal-tit')
    $modalDimm = $target.querySelector(modalDimmSelector)
    $modalContainer = $target.querySelector('.modal-container')
    $html = document.documentElement;
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit')

    // a11y
    etUI.utils.setProperty($target, 'role', 'dialog');
    etUI.utils.setProperty($target, 'aria-modal', 'true');
    etUI.utils.setProperty($target, 'id', id);
    if($modalTitle) etUI.utils.setProperty($modalTitle, 'id', titleId);
    etUI.utils.setProperty($target, 'aria-labelledby', titleId);
    etUI.utils.setProperty($target, 'tabindex', '-1');
  }

  function setupActions(){
    const { getTopDepth, setLayerOpacity } = etUI.hooks.useLayer('modal');

    actions.focusActivate = () => {
    }

    actions.focusDeactivate = () => {
      close();
      // actions.close();
    }

    actions.open = () => {
      const zIndex = getTopDepth();

      $target.style.display = 'block'
      $target.style.zIndex = zIndex

      setLayerOpacity(DIMM_OPACITY);

      gsap.timeline()
        .to($modalDimm, {duration: 0, display: 'block', opacity: 0})
        .to($modalDimm, {duration: 0.15, opacity: 1})

      gsap.timeline()
        .to($modalContainer, {duration: 0, display: 'block', opacity: 0, scale: 0.95, yPercent: 2})
        .to($modalContainer, {duration: 0.15, opacity: 1, scale: 1, yPercent: 0, ease: 'Power2.easeOut'})
    }

    actions.close = () => {
      gsap.timeline()
        .to($modalDimm, {duration: 0.15, opacity: 0, onComplete(){
            $modalDimm.style.display = 'none';
          }})

      gsap.timeline()
        .to($modalContainer, {duration: 0.15, opacity: 0, scale: 0.95, yPercent: 2, ease: 'Power2.easeOut', onComplete(){
            $modalContainer.style.display = 'none';
            $target.style.display = 'none';
            $target.style.zIndex = null

            setLayerOpacity(DIMM_OPACITY);
          }})
    }
  }

  function setEvent() {
    addEvent('click', modalCloseBtnSelector, close);

    if(props.dimmClick){
      addEvent('click', modalDimmSelector, close);
    }
  }

  function render() {
    const isOpened = state.state === 'open';

    if(isOpened){
      actions.open()

      focusTrapInstance.activate();
    }else{
      actions.close()

      focusTrapInstance.deactivate();
    }
  }

  function open(){
    setState({state: 'open'});
  }

  function close(){
    setState({state: 'close'});
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwidXRpbHMvYXJyYXkuanMiLCJ1dGlscy9ib29sZWFuLmpzIiwidXRpbHMvZGF0ZS5qcyIsInV0aWxzL2RvbS5qcyIsInV0aWxzL21hdGguanMiLCJ1dGlscy9vYmplY3QuanMiLCJ1dGlscy9zdHJpbmcuanMiLCJ1dGlscy9pbmRleC5janMiLCJob29rcy91c2VDbGlja091dHNpZGUuanMiLCJob29rcy91c2VDb3JlLmpzIiwiaG9va3MvdXNlRGF0YXNldC5qcyIsImhvb2tzL3VzZURpYWxvZy5qcyIsImhvb2tzL3VzZURpYWxvZ1RtcGwuanMiLCJob29rcy91c2VFdmVudExpc3RlbmVyLmpzIiwiaG9va3MvdXNlR2V0Q2xpZW50UmVjdC5qcyIsImhvb2tzL3VzZUxheWVyLmpzIiwiaG9va3MvdXNlTXV0YXRpb25TdGF0ZS5qcyIsImhvb2tzL3VzZVNlbGVjdEJveFRtcGwuanMiLCJob29rcy91c2VTdGF0ZS5qcyIsImhvb2tzL3VzZVN3aXBlclRtcGwuanMiLCJob29rcy91c2VUcmFuc2l0aW9uLmpzIiwiaG9va3MvaW5kZXguY2pzIiwiY29tcG9uZW50cy9BY2NvcmRpb24uanMiLCJjb21wb25lbnRzL0RpYWxvZy5qcyIsImNvbXBvbmVudHMvTW9kYWwuanMiLCJjb21wb25lbnRzL1NlbGVjdGJveC5qcyIsImNvbXBvbmVudHMvU2tlbC5qcyIsImNvbXBvbmVudHMvU3dpcGVyLmpzIiwiY29tcG9uZW50cy9UYWIuanMiLCJjb21wb25lbnRzL1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL2luZGV4LmNqcyIsImluaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7OztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhc3NldHMvc2NyaXB0cy9jb21tb24udWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBldFVJID0ge31cbndpbmRvdy5ldFVJID0gZXRVSVxuIiwiLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgaXMgYW4gYXJyYXlcbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHJldHVybnMge2FyZyBpcyBhbnlbXX1cbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59XG4iLCIvLyBib29sZWFuIOq0gOugqCDquLDriqVcbiIsIi8vIOuCoOynnCDqtIDroKgg6riw64qlXG4iLCIvLyBleCkgc3RyaW5nIHRvIHF1ZXJ5U2VsZWN0b3IgY29udmVydCBsb2dpY1xuXG4vKipcbiAqIOq4sOuKpSDshKTrqoUg65Ok7Ja06rCQXG4gKi9cblxuLyoqXG4gKiBzZXQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0gb3B0c1xuICovXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShwYXJlbnQsIC4uLm9wdHMpIHtcbiAgaWYob3B0cy5sZW5ndGggPT09IDIpe1xuICAgIGNvbnN0IFtwcm9wZXJ0eSwgdmFsdWVdID0gb3B0cztcblxuICAgIHBhcmVudD8uc2V0QXR0cmlidXRlKHByb3BlcnR5LCB2YWx1ZSk7XG4gIH1lbHNlIGlmKG9wdHMubGVuZ3RoID09PSAzKXtcbiAgICBjb25zdCBbc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZV0gPSBvcHRzO1xuXG4gICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5zZXRBdHRyaWJ1dGUocHJvcGVydHksIHZhbHVlKTtcbiAgfVxufVxuXG4vKipcbiAqIGdldCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7IEVsZW1lbnQgfSBwYXJlbnRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBwcm9wZXJ0eVxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eShwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSkge1xuICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik/LmdldEF0dHJpYnV0ZShwcm9wZXJ0eSk7XG59XG5cbi8qKlxuICogc2V0IHN0eWxlXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0geyBTdHJpbmcgfSBzZWxlY3RvclxuICogQHBhcmFtIHsgU3RyaW5nIH0gcHJvcGVydHlcbiAqIEBwYXJhbSB7IGFueSB9IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHNldFN0eWxlKHBhcmVudCwgc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAocGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogZ3NhcOydmCBTcGxpdFRleHTrpbwg7Zmc7Jqp7ZWY7JesIOusuOyekOulvCDrtoTrpqztlZjsl6wg66eI7Iqk7YGsIOqwgOuKpe2VmOqyjCDtlbTspIDri6QuXG4gKiBAcGFyYW0gc2VsZWN0b3IgIHtzdHJpbmd9XG4gKiBAcGFyYW0gdHlwZSAgeydsaW5lcyd8J3dvcmRzJ3wnY2hhcnMnfVxuICogQHJldHVybnMgW0hUTUxFbGVtZW50W10sIEhUTUxFbGVtZW50W11dXG4gKi9cbmZ1bmN0aW9uIHNwbGl0VGV4dE1hc2soc2VsZWN0b3IsIHR5cGUgPSAnbGluZXMnKXtcbiAgZnVuY3Rpb24gd3JhcChlbCwgd3JhcHBlcikge1xuICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGVsKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuXG4gIGNvbnN0ICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLFxuICAgIG15U3BsaXRUZXh0ID0gbmV3IFNwbGl0VGV4dCgkcXVvdGUsIHt0eXBlfSlcblxuICBjb25zdCAkc3BsaXR0ZWQgPSBteVNwbGl0VGV4dFt0eXBlXTtcbiAgY29uc3QgJGxpbmVXcmFwID0gW107XG4gICRzcGxpdHRlZC5mb3JFYWNoKCgkZWwsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgJGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICRkaXYuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAkZGl2LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAkZGl2LnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICB3cmFwKCRlbCwgJGRpdik7XG4gICAgJGxpbmVXcmFwLnB1c2goJGRpdik7XG4gIH0pXG5cbiAgcmV0dXJuIFskc3BsaXR0ZWQsICRsaW5lV3JhcF1cbn1cbiIsIi8vIOyXsOyCsCDqtIDroKggKOyekOujjO2YlU51bWJlciArIG51bWJlcilcbmZ1bmN0aW9uIGdldEJsZW5kT3BhY2l0eShvcGFjaXR5LCBsZW5ndGgpIHtcbiAgaWYobGVuZ3RoID09PSAxKXtcbiAgICByZXR1cm4gb3BhY2l0eVxuICB9XG5cbiAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0gb3BhY2l0eSwgMS9sZW5ndGgpXG59XG4iLCIvLyBvYmplY3Qg6rSA66CoIOq4sOuKpVxuXG4vKipcbiAqIGNvbXBhcmUgb2JqXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmoxXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmoyXG4gKiBAcmV0dXJucyBCb29sZWFuXG4gKi9cbmZ1bmN0aW9uIHNoYWxsb3dDb21wYXJlKG9iajEsIG9iajIpIHtcbiAgY29uc3Qga2V5cyA9IFsuLi5PYmplY3Qua2V5cyhvYmoxKSwgT2JqZWN0LmtleXMob2JqMildO1xuXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICBpZiAodHlwZW9mIG9iajFba2V5XSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqMltrZXldID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBpZiAoIWV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUob2JqMVtrZXldLCBvYmoyW2tleV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgcm9sZSA9ICFvYmoyW2tleV0gfHwgdHlwZW9mIG9iajFba2V5XSA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgaWYgKCFyb2xlICYmIG9iajFba2V5XSAhPT0gb2JqMltrZXldKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iLCIvKipcbiAqIFJldmVyc2UgYSBzdHJpbmdcbiAqIEBwYXJhbSBzdHIge3N0cmluZ31cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHJldmVyc2VTdHJpbmcoc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBHZXQgYSByYW5kb20gaWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldFJhbmRvbUlkKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gcHJlZml4XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRSYW5kb21VSUlEKHByZWZpeCA9ICd1aScpIHtcbiAgcmV0dXJuIGAke3ByZWZpeH0tJHtnZXRSYW5kb21JZCgpfWA7XG59XG5cbi8qKlxuICog7LKr6riA7J6Q66eMIOuMgOusuOyekOuhnCDrs4DtmZhcbiAqIEBwYXJhbSB3b3JkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBjYXBpdGFsaXplKHdvcmQpIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpXG59XG5cbi8qKlxuICog7LKr6riA7J6Q66eMIOyGjOusuOyekOuhnCDrs4DtmZhcbiAqIEBwYXJhbSB3b3JkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiB1bmNhcGl0YWxpemUod29yZCkge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHdvcmQuc2xpY2UoMSlcbn1cblxuZnVuY3Rpb24gYWRkUHJlZml4Q2FtZWxTdHJpbmcoc3RyLCBwcmVmaXgpe1xuICAvLyBkaW1tQ2xpY2sgPT4gcHJvcHNEaW1tQ2xpY2tcbiAgcmV0dXJuIHByZWZpeCArIGV0VUkudXRpbHMuY2FwaXRhbGl6ZShzdHIpXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVByZWZpeENhbWVsU3RyaW5nKHN0ciwgcHJlZml4KXtcbiAgY29uc3QgcmVnRXhwID0gbmV3IFJlZ0V4cChgXiR7cHJlZml4fWAsICdnJylcbiAgcmV0dXJuIGV0VUkudXRpbHMudW5jYXBpdGFsaXplKHN0ci5yZXBsYWNlQWxsKHJlZ0V4cCwgJycpKVxuXG59XG5cbiIsIlxuZXRVSS51dGlscyA9IHtcblx0aXNBcnJheSxcblx0c2V0UHJvcGVydHksXG5cdGdldFByb3BlcnR5LFxuXHRzZXRTdHlsZSxcblx0c3BsaXRUZXh0TWFzayxcblx0Z2V0QmxlbmRPcGFjaXR5LFxuXHRzaGFsbG93Q29tcGFyZSxcblx0cmV2ZXJzZVN0cmluZyxcblx0Z2V0UmFuZG9tSWQsXG5cdGdldFJhbmRvbVVJSUQsXG5cdGNhcGl0YWxpemUsXG5cdHVuY2FwaXRhbGl6ZSxcblx0YWRkUHJlZml4Q2FtZWxTdHJpbmcsXG5cdHJlbW92ZVByZWZpeENhbWVsU3RyaW5nXG59XG4iLCIvKipcbiAqIHRhcmdldCnsnZgg7Jm467aA66W8IO2BtOumre2WiOydhCDrlYwg7L2c67CxIO2VqOyImOulvCDsi6TtlolcbiAqIOyYiOyZuOyggeycvOuhnCDtgbTrpq3snYQg7ZeI7Jqp7ZWgIOyalOyGjOuTpOydmCDshKDtg53snpDrpbwg7Y+s7ZWo7ZWY64qUIOuwsOyXtOydhCDsmLXshZjsnLzroZwg67Cb7J2EIOyImCDsnojsirXri4jri6QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXQgLSDtgbTrpq0g7J2067Kk7Yq47J2YIOyZuOu2gCDtgbTrpq0g6rCQ7KeA66W8IOyImO2Wie2VoCDrjIDsg4EgRE9NIOyalOyGjOyeheuLiOuLpC4o7ZWE7IiYKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSDsmbjrtoAg7YG066at7J20IOqwkOyngOuQmOyXiOydhCDrlYwg7Iuk7ZaJ7ZWgIOy9nOuwsSDtlajsiJjsnoXri4jri6QuKO2VhOyImClcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZXhjZXB0aW9ucyAtIOyZuOu2gCDtgbTrpq0g6rCQ7KeA7JeQ7IScIOyYiOyZuCDsspjrpqztlaAg7JqU7IaM65Ok7J2YIOyEoO2DneyekOulvCDtj6ztlajtlZjripQg67Cw7Je07J6F64uI64ukLijsmLXshZgpXG4gKi9cblxuLy8gYmx1ciDrj4Qg7Je865GQXG5mdW5jdGlvbiB1c2VDbGlja091dHNpZGUodGFyZ2V0LCBjYWxsYmFjaywgZXhjZXB0aW9ucyA9IFtdKSB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBsZXQgaXNDbGlja0luc2lkZUV4Y2VwdGlvbiA9IGV4Y2VwdGlvbnMuc29tZSgoc2VsZWN0b3IpID0+IHtcbiAgICAgIGNvbnN0IGV4Y2VwdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIHJldHVybiBleGNlcHRpb25FbGVtZW50ICYmIGV4Y2VwdGlvbkVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIGlmICghdGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgIWlzQ2xpY2tJbnNpZGVFeGNlcHRpb24pIHtcbiAgICAgIGNhbGxiYWNrKHRhcmdldCk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8g67aA66qoIOyalOyGjOuKlCBwYXJlbnRzXG4vLyDshKDtg50g7JqUXG4iLCJmdW5jdGlvbiB1c2VDb3JlKFxuICBpbml0aWFsUHJvcHMgPSB7fSxcbiAgaW5pdGlhbFZhbHVlID0ge30sXG4gIHJlbmRlcixcbiAgb3B0aW9ucyA9IHtcbiAgICBkYXRhc2V0OiB0cnVlXG59KSB7XG4gIGNvbnN0IGFjdGlvbnMgPSB7fTtcbiAgbGV0ICR0YXJnZXQ7XG4gIGNvbnN0IGNsZWFudXBzID0gW107XG4gIGNvbnN0IE5PX0JVQkJMSU5HX0VWRU5UUyA9IFtcbiAgICAnYmx1cicsXG4gICAgJ2ZvY3VzJyxcbiAgICAnZm9jdXNpbicsXG4gICAgJ2ZvY3Vzb3V0JyxcbiAgICAncG9pbnRlcmxlYXZlJ1xuICBdO1xuXG4gIGNvbnN0IHByb3BzID0gbmV3IFByb3h5KGluaXRpYWxQcm9wcywge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHN0YXRlID0gbmV3IFByb3h5KGluaXRpYWxWYWx1ZSwge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICB9LFxuICB9KTtcblxuICBmdW5jdGlvbiBzZXRUYXJnZXQoXyR0YXJnZXQpIHtcbiAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG5cbiAgICBpZihvcHRpb25zLmRhdGFzZXQpe1xuICAgICAgY29uc3QgeyBnZXRQcm9wc0Zyb21EYXRhc2V0IH0gPSBldFVJLmhvb2tzLnVzZURhdGFzZXQoJHRhcmdldCk7XG4gICAgICBjb25zdCBkYXRhc2V0UHJvcHMgPSBnZXRQcm9wc0Zyb21EYXRhc2V0KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLmRhdGFzZXRQcm9wcyB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQcm9wcyhuZXdQcm9wcykge1xuICAgIE9iamVjdC5rZXlzKG5ld1Byb3BzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHByb3BzW2tleV0gPSBuZXdQcm9wc1trZXldO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGUobmV3U3RhdGUpIHtcbiAgICBpZihldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHN0YXRlLCBuZXdTdGF0ZSkpIHJldHVybjtcblxuICAgIE9iamVjdC5rZXlzKG5ld1N0YXRlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHN0YXRlW2tleV0gPSBuZXdTdGF0ZVtrZXldO1xuICAgIH0pO1xuXG4gICAgaWYgKHJlbmRlcikge1xuICAgICAgcmVuZGVyKCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YXNldCkge1xuICAgICAgY29uc3QgeyBzZXRWYXJzRnJvbURhdGFzZXQgfSA9IGV0VUkuaG9va3MudXNlRGF0YXNldCgkdGFyZ2V0KTtcbiAgICAgIHNldFZhcnNGcm9tRGF0YXNldChzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkRXZlbnQoZXZlbnRUeXBlLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCAkZXZlbnRUYXJnZXQgPSBzZWxlY3RvciA/ICR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiAkdGFyZ2V0O1xuXG4gICAgaWYgKE5PX0JVQkJMSU5HX0VWRU5UUy5pbmNsdWRlcyhldmVudFR5cGUpKSB7XG4gICAgICBjb25zdCBjbGVhbnVwID0gZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKCRldmVudFRhcmdldCwgZXZlbnRUeXBlLCBjYWxsYmFjayk7XG4gICAgICByZXR1cm4gY2xlYW51cHMucHVzaChjbGVhbnVwKTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudEhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGxldCAkZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdChzZWxlY3Rvcik7XG5cbiAgICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgICAgJGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoJGV2ZW50VGFyZ2V0KSB7XG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRIYW5kbGVyKTtcbiAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4gJHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRIYW5kbGVyKTtcbiAgICBjbGVhbnVwcy5wdXNoKGNsZWFudXApO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRXZlbnQoKSB7XG4gICAgY2xlYW51cHMuZm9yRWFjaCgoY2xlYW51cCkgPT4gY2xlYW51cCgpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2V0VGFyZ2V0LFxuICAgIGFjdGlvbnMsXG4gICAgc3RhdGUsXG4gICAgcHJvcHMsXG4gICAgc2V0U3RhdGUsXG4gICAgc2V0UHJvcHMsXG4gICAgYWRkRXZlbnQsXG4gICAgcmVtb3ZlRXZlbnQsXG4gIH07XG59XG4iLCIvKipcbiAqIHVzZURhdGFzZXRcbiAqIEBwYXJhbSAkdGFyZ2V0IHtIVE1MRWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gdXNlRGF0YXNldCgkdGFyZ2V0KSB7XG4gIGxldCBkYXRhc2V0UHJvcHMgPSB7fSxcbiAgICBkYXRhc2V0VmFycyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldERhdGFzZXRCeVByZWZpeChwcmVmaXgpIHtcbiAgICBjb25zdCBkYXRhc2V0ID0ge307XG4gICAgT2JqZWN0LmtleXMoJHRhcmdldC5kYXRhc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9ICR0YXJnZXQuZGF0YXNldFtrZXldO1xuXG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5pbmNsdWRlcygneycpKXtcbiAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZGF0YXNldFtldFVJLnV0aWxzLnJlbW92ZVByZWZpeENhbWVsU3RyaW5nKGtleSwgcHJlZml4KV0gPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhc2V0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YXNldEV4Y2VwdFByZWZpeChwcmVmaXgpIHtcbiAgICBjb25zdCBkYXRhc2V0ID0ge307XG4gICAgT2JqZWN0LmtleXMoJHRhcmdldC5kYXRhc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9ICR0YXJnZXQuZGF0YXNldFtrZXldO1xuXG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGRhdGFzZXRbZXRVSS51dGlscy5yZW1vdmVQcmVmaXhDYW1lbFN0cmluZyhrZXksIHByZWZpeCldID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldERhdGFzZXRCeVByZWZpeChkYXRhLCBwcmVmaXgpIHtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmKHByZWZpeCl7XG4gICAgICAgICR0YXJnZXQuZGF0YXNldFtgJHtwcmVmaXh9JHtldFVJLnV0aWxzLmNhcGl0YWxpemUoa2V5KX1gXSA9IGRhdGFba2V5XTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkdGFyZ2V0LmRhdGFzZXRba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByb3BzRnJvbURhdGFzZXQoKSB7XG4gICAgZGF0YXNldFByb3BzID0gZ2V0RGF0YXNldEJ5UHJlZml4KCdwcm9wcycpO1xuXG4gICAgcmV0dXJuIGRhdGFzZXRQcm9wcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZhcnNGcm9tRGF0YXNldCgpIHtcbiAgICBkYXRhc2V0VmFycyA9IGdldERhdGFzZXRFeGNlcHRQcmVmaXgoJ3Byb3BzJyk7XG5cbiAgICByZXR1cm4gZGF0YXNldFZhcnM7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQcm9wc0Zyb21EYXRhc2V0KHByb3BzKSB7XG4gICAgc2V0RGF0YXNldEJ5UHJlZml4KHByb3BzLCAncHJvcHMnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFZhcnNGcm9tRGF0YXNldCh2YXJzKSB7XG4gICAgc2V0RGF0YXNldEJ5UHJlZml4KHZhcnMsICcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0cmluZ1RvT2JqZWN0KHByb3BzKSB7XG4gICAgLy8gZGF0YXNldOyXkOyEnCDqsJ3ssrQg7ZiV7YOc7J24IOyKpO2KuOungeqwkiDtg4DsnoUg6rCd7LK066GcIOuwlOq/lOykjFxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XG4gICAgICBpZiAoISh0eXBlb2YgcHJvcHNba2V5XSA9PT0gJ2Jvb2xlYW4nKSAmJiBwcm9wc1trZXldLmluY2x1ZGVzKCd7JykpIHtcbiAgICAgICAgcHJvcHNba2V5XSA9IEpTT04ucGFyc2UocHJvcHNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRQcm9wc0Zyb21EYXRhc2V0LFxuICAgIHNldFByb3BzRnJvbURhdGFzZXQsXG4gICAgZ2V0VmFyc0Zyb21EYXRhc2V0LFxuICAgIHNldFZhcnNGcm9tRGF0YXNldCxcbiAgICBzZXRTdHJpbmdUb09iamVjdCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZURpYWxvZygpIHtcbiAgY29uc3QgYWxlcnQgPSAoLi4ub3B0cykgPT4ge1xuICAgIGNvbnN0ICRsYXllcldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XG5cbiAgICBpZih0eXBlb2Ygb3B0c1swXSA9PT0gJ3N0cmluZycpe1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdhbGVydCcsIG1lc3NhZ2U6IG9wdHNbMF0sIGNhbGxiYWNrOiBvcHRzWzFdIH0pO1xuICAgIH1lbHNlIGlmKHR5cGVvZiBvcHRzWzBdID09PSAnb2JqZWN0Jyl7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2FsZXJ0JywgLi4ub3B0c1swXSB9KTtcbiAgICB9XG5cbiAgICBkaWFsb2cub3BlbigpO1xuICB9O1xuXG4gIGNvbnN0IGNvbmZpcm0gPSAoLi4ub3B0cykgPT4ge1xuICAgIGNvbnN0ICRsYXllcldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XG5cbiAgICBpZih0eXBlb2Ygb3B0c1swXSA9PT0gJ3N0cmluZycpe1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdjb25maXJtJywgbWVzc2FnZTogb3B0c1swXSwgcG9zaXRpdmVDYWxsYmFjazogb3B0c1sxXSB9KTtcbiAgICB9ZWxzZSBpZih0eXBlb2Ygb3B0c1swXSA9PT0gJ29iamVjdCcpe1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdjb25maXJtJywgLi4ub3B0c1swXSB9KTtcbiAgICB9XG5cbiAgICBkaWFsb2cub3BlbigpO1xuICB9O1xuXG4gIGNvbnN0IHByZXZpZXdJbWFnZSA9ICguLi5vcHRzKSA9PiB7XG4gICAgY29uc3QgJGxheWVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJyk7XG4gICAgY29uc3QgZGlhbG9nID0gbmV3IGV0VUkuY29tcG9uZW50cy5EaWFsb2coKTtcblxuXG4gICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdwcmV2aWV3SW1hZ2UnLCAuLi5vcHRzWzBdIH0pO1xuXG4gICAgZGlhbG9nLm9wZW4oKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYWxlcnQsXG4gICAgY29uZmlybSxcbiAgICBwcmV2aWV3SW1hZ2VcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZURpYWxvZ1RtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSAoeyBkaWFsb2dUeXBlLCB0eXBlLCB0aXRsZSwgbWVzc2FnZSwgcG9zaXRpdmVUZXh0LCBuZWdhdGl2ZVRleHQgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1kaW1tXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWZyYW1lXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgICAgICR7dGl0bGUgPyBgPGgzIGNsYXNzPVwiZGlhbG9nLXRpdFwiPiR7dGl0bGV9PC9oMz5gIDogJyd9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+XG4gICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdhbGVydCcgPyBgPHNwYW4gY2xhc3M9XCIke3R5cGV9XCI+aWNvbjwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxwIGNsYXNzPVwiZGlhbG9nLWluZm9cIj4ke21lc3NhZ2UucmVwbGFjZSgvXFxuL2csICc8YnI+Jyl9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGRpYWxvZy1uZWdhdGl2ZVwiPiR7bmVnYXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgICR7cG9zaXRpdmVUZXh0ID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGRpYWxvZy1wb3NpdGl2ZSBidG4tcHJpbWFyeVwiPiR7cG9zaXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgY29uc3QgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTCA9ICh7ZGlhbG9nVHlwZSwgaW1hZ2VzLCB0aXRsZX0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZGltbVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1mcmFtZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgICAgICAke3RpdGxlID8gYDxoMyBjbGFzcz1cImRpYWxvZy10aXRcIj4ke3RpdGxlfTwvaDM+YCA6ICcnfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1zd2lwZXJcIiBkYXRhLWNvbXBvbmVudD1cInN3aXBlclwiPlxuICAgICAgICAgICAgICA8IS0tIEFkZGl0aW9uYWwgcmVxdWlyZWQgd3JhcHBlciAtLT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgJHtpbWFnZXMubWFwKChpbWFnZSkgPT4gKGBcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItc2xpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2ltYWdlLnNyY31cIiBhbHQ9XCIke2ltYWdlLmFsdH1cIiAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgYCkpLmpvaW4oJycpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGBcblxuICAgIHJldHVybiB7XG4gICAgICAkdGVtcGxhdGVIVE1MLFxuICAgICAgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTFxuICAgIH1cbn1cbiIsIi8qKlxuICogdXNlRXZlbnRMaXN0ZW5lclxuICogQHBhcmFtIHRhcmdldCAge0hUTUxFbGVtZW50fVxuICogQHBhcmFtIHR5cGUgIHtzdHJpbmd9XG4gKiBAcGFyYW0gbGlzdGVuZXIgIHtmdW5jdGlvbn1cbiAqIEBwYXJhbSBvcHRpb25zIHtvYmplY3R9XG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oKTogKn1cbiAqL1xuZnVuY3Rpb24gdXNlRXZlbnRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zID0ge30pe1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG59XG4iLCIvKipcbiAqIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIHsgU3RyaW5nIH0gc2VsZWN0b3JcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHVzZUdldENsaWVudFJlY3QocGFyZW50LCBzZWxlY3Rvcikge1xuICBjb25zdCByZWN0ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgaWYgKCFyZWN0KSByZXR1cm4ge307XG4gIGVsc2VcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgIGJvdHRvbTogcmVjdC5ib3R0b20sXG4gICAgICBsZWZ0OiByZWN0LmxlZnQsXG4gICAgICByaWdodDogcmVjdC5yaWdodCxcbiAgICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlTGF5ZXIodHlwZSA9ICdtb2RhbCcpe1xuICBmdW5jdGlvbiBnZXRWaXNpYmxlTGF5ZXIoKXtcbiAgICBjb25zdCAkbGF5ZXJDb21wb25lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpLmNoaWxkcmVuKS5maWx0ZXIoKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXNNb2RhbENvbXBvbmVudCA9ICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbXBvbmVudC1tb2RhbCcpXG4gICAgICBjb25zdCBpc0RpYWxvZ0NvbXBvbmVudCA9ICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbXBvbmVudC1kaWFsb2cnKVxuXG4gICAgICByZXR1cm4gaXNNb2RhbENvbXBvbmVudCB8fCBpc0RpYWxvZ0NvbXBvbmVudFxuICAgIH0pXG5cbiAgICByZXR1cm4gJGxheWVyQ29tcG9uZW50cy5maWx0ZXIoKCRlbCkgPT4ge1xuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSgkZWwpO1xuICAgICAgcmV0dXJuIHN0eWxlLmRpc3BsYXkgIT09ICdub25lJ1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBnZXRUb3BEZXB0aCgpe1xuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKClcbiAgICByZXR1cm4gMTAwICsgJHZpc2libGVMYXllckNvbXBvbmVudHMubGVuZ3RoXG4gIH1cblxuICBmdW5jdGlvbiBzZXRMYXllck9wYWNpdHkoZGVmYXVsdE9wYWNpdHkgPSAwLjUpe1xuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKClcbiAgICAkdmlzaWJsZUxheWVyQ29tcG9uZW50cy5mb3JFYWNoKCgkZWwsIGluZGV4KSA9PiB7XG5cbiAgICAgIGNvbnN0IG9wYWNpdHkgPSBldFVJLnV0aWxzLmdldEJsZW5kT3BhY2l0eShkZWZhdWx0T3BhY2l0eSwgJHZpc2libGVMYXllckNvbXBvbmVudHMubGVuZ3RoKVxuXG4gICAgICBpZigkZWwucXVlcnlTZWxlY3RvcihgLm1vZGFsLWRpbW1gKSl7XG4gICAgICAgICRlbC5xdWVyeVNlbGVjdG9yKGAubW9kYWwtZGltbWApLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2JhKDAsIDAsIDAsICR7b3BhY2l0eX0pYFxuICAgICAgfVxuXG4gICAgICBpZigkZWwucXVlcnlTZWxlY3RvcihgLmRpYWxvZy1kaW1tYCkpe1xuICAgICAgICAkZWwucXVlcnlTZWxlY3RvcihgLmRpYWxvZy1kaW1tYCkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYmEoMCwgMCwgMCwgJHtvcGFjaXR5fSlgXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0VmlzaWJsZUxheWVyLFxuICAgIGdldFRvcERlcHRoLFxuICAgIHNldExheWVyT3BhY2l0eVxuICB9XG59XG4iLCJmdW5jdGlvbiB1c2VNdXRhdGlvblN0YXRlKCl7XG4gIGxldCAkdGFyZ2V0LCAkcmVmID0ge1xuICAgICRzdGF0ZToge31cbiAgfSwgbXV0YXRpb25PYnNlcnZlciwgcmVuZGVyO1xuXG4gIGZ1bmN0aW9uIGluaXRNdXRhdGlvblN0YXRlKF8kdGFyZ2V0LCBfcmVuZGVyKXtcbiAgICAkdGFyZ2V0ID0gXyR0YXJnZXRcbiAgICByZW5kZXIgPSBfcmVuZGVyO1xuXG4gICAgc2V0TXV0YXRpb25PYnNlcnZlcigpXG4gICAgc2V0U3RhdGVCeURhdGFzZXQoKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGVCeURhdGFzZXQoKXtcbiAgICBjb25zdCBmaWx0ZXJlZERhdGFzZXQgPSB7fTtcbiAgICBjb25zdCBkYXRhc2V0ID0gJHRhcmdldC5kYXRhc2V0O1xuXG4gICAgT2JqZWN0LmtleXMoZGF0YXNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZihrZXkuc3RhcnRzV2l0aCgndmFycycpKXtcbiAgICAgICAgZmlsdGVyZWREYXRhc2V0W2tleS5yZXBsYWNlKCd2YXJzJywgJycpLnRvTG93ZXJDYXNlKCldID0gZGF0YXNldFtrZXldO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICBzZXRTdGF0ZShmaWx0ZXJlZERhdGFzZXQpXG4gICAgcmVuZGVyKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRNdXRhdGlvbk9ic2VydmVyKCl7XG4gICAgY29uc3QgY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IGZhbHNlLCBzdWJ0cmVlOiBmYWxzZSB9O1xuXG4gICAgY29uc3QgY2FsbGJhY2sgPSAobXV0YXRpb25MaXN0LCBvYnNlcnZlcikgPT4ge1xuICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbkxpc3QpIHtcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiYXR0cmlidXRlc1wiXG4gICAgICAgICAgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSAhPT0gJ3N0eWxlJ1xuICAgICAgICAgICYmIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcydcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0U3RhdGVCeURhdGFzZXQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKCR0YXJnZXQsIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZShuZXdTdGF0ZSl7XG4gICAgJHJlZi4kc3RhdGUgPSB7IC4uLiRyZWYuJHN0YXRlLCAuLi5uZXdTdGF0ZSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RGF0YVN0YXRlKG5ld1N0YXRlKSB7XG4gICAgY29uc3QgJG5ld1N0YXRlID0geyAuLi4kcmVmLiRzdGF0ZSwgLi4ubmV3U3RhdGUgfTtcblxuICAgIE9iamVjdC5rZXlzKCRuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAkdGFyZ2V0LmRhdGFzZXRbYHZhcnMke2V0VUkudXRpbHMuY2FwaXRhbGl6ZShrZXkpfWBdID0gJG5ld1N0YXRlW2tleV07XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJHJlZixcbiAgICBzZXRTdGF0ZSxcbiAgICBzZXREYXRhU3RhdGUsXG4gICAgaW5pdE11dGF0aW9uU3RhdGVcbiAgfVxufVxuIiwiZnVuY3Rpb24gdXNlU2VsZWN0Qm94VGVtcCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlQ3VzdG9tSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiY29tYm8xXCIgY2xhc3M9XCJzZWxlY3QtYm94XCIgcm9sZT1cImNvbWJvYm94XCIgYXJpYS1jb250cm9scz1cImxpc3Rib3gxXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgYXJpYS1hY3RpdmVkZXNjZW5kYW50PVwiXCI+XG4gICAgICAgIDxzcGFuIHN0eWxlPVwicG9pbnRlci1ldmVudHM6IG5vbmU7XCI+JHt0ZXh0fTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDx1bCBpZD1cImxpc3Rib3gxXCIgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uc1wiIHJvbGU9XCJsaXN0Ym94XCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICR7aXRlbXNIVE1MfVxuICAgICAgICA8L3VsPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxsaSByb2xlPVwib3B0aW9uXCIgY2xhc3M9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPVwiJHtzZWxlY3RlZH1cIiBkYXRhLXZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPlxuICAgICAgICAgICR7aXRlbS50ZXh0fVxuICAgICAgICA8L2xpPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZUJhc2ljSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbj4ke3RleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXNXcmFwKGl0ZW1zSFRNTCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHNlbGVjdCBjbGFzcz1cInNlbGVjdC1saXN0XCIgcmVxdWlyZWQ+XG4gICAgICAgICAgJHtpdGVtc0hUTUx9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCIke2l0ZW0udmFsdWV9XCI+JHtpdGVtLnRleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVDdXN0b21IVE1MLFxuICAgICR0ZW1wbGF0ZUJhc2ljSFRNTCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWxWYWx1ZSA9IHt9LCBjYWxsYmFjaykge1xuICBjb25zdCBzdGF0ZSA9IG5ldyBQcm94eShpbml0aWFsVmFsdWUsIHtcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcbiAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayh0YXJnZXQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgc2V0U3RhdGUgPSAobmV3U3RhdGUpID0+IHtcbiAgICBPYmplY3Qua2V5cyhuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzdGF0ZVtrZXldID0gbmV3U3RhdGVba2V5XTtcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIFtzdGF0ZSwgc2V0U3RhdGVdO1xufVxuIiwiZnVuY3Rpb24gdXNlU3dpcGVyVG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9IHtcbiAgICBuYXZpZ2F0aW9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLXByZXZcIj7snbTsoIQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLW5leHRcIj7ri6TsnYw8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBwYWdpbmF0aW9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1wYWdpbmF0aW9uXCI+PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgYXV0b3BsYXkoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYXV0b3BsYXkgcGxheVwiPjwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVIVE1MLFxuICB9O1xufVxuIiwiLyoqXG4gKiB0ZW1wIHRpbWVsaW5lXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiB1c2VUcmFuc2l0aW9uKCkge1xuICAvLyBzZWxlY3RcbiAgY29uc3QgdXNlU2VsZWN0U2hvdyA9ICh0YXJnZXQsIHR5cGUsIG9wdGlvbikgPT4ge1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IGdzYXAudGltZWxpbmUoeyBwYXVzZWQ6IHRydWUgfSk7XG5cbiAgICBjb25zdCBvcHRpb25MaXN0ID0ge1xuICAgICAgZmFzdDogeyBkdXJhdGlvbjogMC4xIH0sXG4gICAgICBub3JtYWw6IHsgZHVyYXRpb246IDAuMyB9LFxuICAgICAgc2xvdzogeyBkdXJhdGlvbjogMC43IH0sXG4gICAgfTtcbiAgICBsZXQgZ3NhcE9wdGlvbiA9IHsgLi4ub3B0aW9uTGlzdFt0eXBlXSwgLi4ub3B0aW9uIH07XG5cbiAgICB0aW1lbGluZS50byh0YXJnZXQsIHtcbiAgICAgIGFscGhhOiAwLFxuICAgICAgZWFzZTogXCJsaW5lYXJcIixcbiAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICB9LFxuICAgICAgLi4uZ3NhcE9wdGlvbixcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICB0aW1lbGluZUVsOiB0aW1lbGluZS5fcmVjZW50LnZhcnMsXG4gICAgICB0aW1lbGluZTogKHN0YXRlKSA9PiB7XG4gICAgICAgIHN0YXRlID8gKCh0YXJnZXQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIiksIHRpbWVsaW5lLnJldmVyc2UoKSkgOiB0aW1lbGluZS5wbGF5KCk7XG4gICAgICB9LFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB1c2VTZWxlY3RTaG93LFxuICB9O1xufVxuIiwiXG5ldFVJLmhvb2tzID0ge1xuXHR1c2VDbGlja091dHNpZGUsXG5cdHVzZUNvcmUsXG5cdHVzZURhdGFzZXQsXG5cdHVzZURpYWxvZyxcblx0dXNlRGlhbG9nVG1wbCxcblx0dXNlRXZlbnRMaXN0ZW5lcixcblx0dXNlR2V0Q2xpZW50UmVjdCxcblx0dXNlTGF5ZXIsXG5cdHVzZU11dGF0aW9uU3RhdGUsXG5cdHVzZVNlbGVjdEJveFRlbXAsXG5cdHVzZVN0YXRlLFxuXHR1c2VTd2lwZXJUbXBsLFxuXHR1c2VUcmFuc2l0aW9uXG59XG4iLCIvKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb3BzQ29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGRpc2FibGVkIC0g7JqU7IaM6rCAIOu5hO2ZnOyEse2ZlCDsg4Htg5zsnbjsp4Drpbwg64KY7YOA64OF64uI64ukLlxuICogQHByb3BlcnR5IHtib29sZWFufSBvbmNlIC0g7J2067Kk7Yq464KYIOyVoeyFmOydhCDtlZwg67KI66eMIOyLpO2Wie2VoOyngCDsl6zrtoDrpbwg6rKw7KCV7ZWp64uI64ukLlxuICogQHByb3BlcnR5IHtmYWxzZSB8IG51bWJlcn0gZHVyYXRpb24gLSDslaDri4jrqZTsnbTshZgg65iQ64qUIOydtOuypO2KuCDsp4Dsho0g7Iuc6rCE7J2EIOuwgOumrOy0iCDri6jsnITroZwg7ISk7KCV7ZWp64uI64ukLiAnZmFsc2Un7J28IOqyveyasCDsp4Dsho0g7Iuc6rCE7J2EIOustOyLnO2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvcmlnaW4gLSDsm5DsoJAg65iQ64qUIOyLnOyekSDsp4DsoJDsnYQg64KY7YOA64K064qUIOqwneyytOyeheuLiOuLpC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN0YXRlQ29uZmlnXG4gKiBAcHJvcGVydHkgeydjbG9zZScgfCAnb3Blbid9IHN0YXRlIC0g7JWE7L2U65SU7Ja47J2YIOyDge2DnOqwki4gY2xvc2UsIG9wZW4g65GYIOykkeyXkCDtlZjrgpjsnoXri4jri6QuXG4gKi9cblxuLyoqIEB0eXBlIHtQcm9wc0NvbmZpZ30gKi9cbi8qKiBAdHlwZSB7U3RhdGVDb25maWd9ICovXG5cbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgICBjb2xsYXBzaWJsZTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgICAgZWFzaW5nOiBcInBvd2VyNC5vdXRcIixcbiAgICAgIH0sXG4gICAgICB0eXBlOiBcIm11bHRpcGxlXCIsXG4gICAgfSxcbiAgICB7fSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gXCJhY2NvcmRpb25cIjtcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgYWNjb3JkaW9uVG9nZ2xlQnRuLCBhY2NvcmRpb25JdGVtO1xuICBsZXQgJHRhcmdldCwgJGFjY29yZGlvbkNvbnRlbnRzLCAkYWNjb3JkaW9uSXRlbTtcblxuICB7XG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICAgIHRocm93IEVycm9yKFwidGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuXCIpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIiwgXCJ0cnVlXCIpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygkdGFyZ2V0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHNldHRpbmc6IFwiY3VzdG9tXCIgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1pbml0XCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBhY2NvcmRpb25Ub2dnbGVCdG4gPSBcIi5hY2NvcmRpb24tdGl0XCI7XG4gICAgYWNjb3JkaW9uSXRlbSA9IFwiLmFjY29yZGlvbi1pdGVtXCI7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJGFjY29yZGlvbkl0ZW0gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYWNjb3JkaW9uSXRlbSk7XG4gICAgJGFjY29yZGlvbkNvbnRlbnRzID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLmFjY29yZGlvbi1jb250ZW50XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpO1xuICAgICRhY2NvcmRpb25Db250ZW50cy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCB0cnVlKTtcbiAgICAkYWNjb3JkaW9uQ29udGVudHMuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInJlZ2lvblwiKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCBpZCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgaXNDdXN0b20gPSBwcm9wcy5zZXR0aW5nID09PSBcImN1c3RvbVwiO1xuICAgIGNvbnN0IHsgZHVyYXRpb24sIGVhc2VpbmcgfSA9IHByb3BzLmFuaW1hdGlvbjtcblxuICAgIGFjdGlvbnMub3BlbiA9ICh0YXJnZXQgPSAkYWNjb3JkaW9uSXRlbSkgPT4ge1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgdHJ1ZSk7XG4gICAgICBpZiAoIWlzQ3VzdG9tKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdzYXAudGltZWxpbmUoKS50byh0YXJnZXQsIHsgZHVyYXRpb246IGR1cmF0aW9uLCBlYXNlOiBlYXNlaW5nLCBwYWRkaW5nOiBcIjNyZW1cIiB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICh0YXJnZXQgPSAkYWNjb3JkaW9uSXRlbSkgPT4ge1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpO1xuICAgICAgaWYgKCFpc0N1c3RvbSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnc2FwLnRpbWVsaW5lKCkudG8odGFyZ2V0LCB7IGR1cmF0aW9uOiBkdXJhdGlvbiwgcGFkZGluZzogXCIwIDNyZW1cIiB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5hcnJvd1VwID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJrZXl1cCDsvZzrsLFcIik7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuYXJyb3dEb3duID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJrZXl1cCDsvZzrsLFcIik7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gcHJvcHM7XG4gICAgaWYgKHR5cGUgPT09IFwic2luZ2xlXCIpIHtcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgYWNjb3JkaW9uVG9nZ2xlQnRuLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgICBjb25zdCB7IHBhcmVudEVsZW1lbnQgfSA9IHRhcmdldDtcbiAgICAgICAgc2luZ2xlVG9nZ2xlQWNjb3JkaW9uKHBhcmVudEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgYWNjb3JkaW9uVG9nZ2xlQnRuLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgICB0b2dnbGVBY2NvcmRpb24odGFyZ2V0LnBhcmVudEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uKGVsZSkge1xuICAgIGNvbnNvbGUubG9nKGVsZSk7XG4gICAgY29uc3QgaXNPcGVuID0gc3RhdGUuc3RhdGUgPT09IFwib3BlblwiO1xuICAgIGlmIChpc09wZW4pIHtcbiAgICAgIGFjdGlvbnMuY2xvc2UoZWxlKTtcbiAgICAgIGNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnMub3BlbihlbGUpO1xuICAgICAgb3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNpbmdsZVRvZ2dsZUFjY29yZGlvbih0YXJnZXQpIHtcbiAgICBjb25zdCAkY2xpY2tlZEl0ZW0gPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICBjb25zdCAkYWxsVGl0bGVzID0gJGNsaWNrZWRJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoYWNjb3JkaW9uVG9nZ2xlQnRuKTtcbiAgICBjb25zdCAkYWxsSXRlbXMgPSBBcnJheS5mcm9tKCRhbGxUaXRsZXMpLm1hcCgodGl0bGUpID0+IHRpdGxlLnBhcmVudEVsZW1lbnQpO1xuXG4gICAgJGFsbEl0ZW1zLmZvckVhY2goKCRpdGVtKSA9PiB7XG4gICAgICBjb25zdCAkdGl0bGUgPSAkaXRlbS5xdWVyeVNlbGVjdG9yKGFjY29yZGlvblRvZ2dsZUJ0bik7XG4gICAgICBjb25zdCAkY29udGVudCA9ICR0aXRsZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICBpZiAoJGl0ZW0gPT09IHRhcmdldCkge1xuICAgICAgICBpZiAoJGNvbnRlbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgJGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAkdGl0bGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XG4gICAgICAgICAgJGl0ZW0uY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgICAgb3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRjb250ZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAkdGl0bGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xuICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRjb250ZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgJHRpdGxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNTaG93ID0gc3RhdGUuc3RhdGUgPT09IFwib3BlblwiO1xuICAgIC8vIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYWNjb3JkaW9uSXRlbSwgXCJhcmlhLWV4cGFuZGVkXCIsIGlzU2hvdyk7XG4gICAgaXNTaG93ID8gb3BlbigpIDogY2xvc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogXCJvcGVuXCIgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcImNsb3NlXCIgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqICBNb2RhbFxuICovXG5mdW5jdGlvbiBEaWFsb2coKSB7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnRcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZSh7XG4gICAgICAvLyBwcm9wc1xuICAgICAgZGltbUNsaWNrOiB0cnVlLFxuICAgICAgZXNjOiB0cnVlLFxuICAgICAgdGl0bGU6IG51bGwsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICAgIHR5cGU6ICdhbGVydCcsXG4gICAgICBwb3NpdGl2ZVRleHQ6ICftmZXsnbgnLFxuICAgICAgbmVnYXRpdmVUZXh0OiAn7Leo7IaMJyxcbiAgICB9LCB7XG4gICAgICBzdGF0ZTogJ2Nsb3NlJyxcbiAgICAgIHRyaWdnZXI6IG51bGxcbiAgICB9LCByZW5kZXIsIHtcbiAgICAgIGRhdGFzZXQ6IGZhbHNlLFxuICAgIH0sXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgRElNTV9PUEFDSVRZID0gMC42O1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnZGlhbG9nJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICBsZXQgbW9kYWxEaW1tU2VsZWN0b3IsXG4gICAgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLFxuICAgIG1vZGFsQnRuUG9zaXRpdmUsXG4gICAgbW9kYWxCdG5OZWdhdGl2ZTtcbiAgbGV0ICR0YXJnZXQsXG4gICAgJG1vZGFsLFxuICAgICRtb2RhbFRpdGxlLCAkbW9kYWxDb250YWluZXIsICRtb2RhbERpbW0sXG4gICAgJG1vZGFsQnRuUG9zaXRpdmUsICRtb2RhbEJ0bk5lZ2F0aXZlLFxuICAgIGZvY3VzVHJhcEluc3RhbmNlLFxuICAgIGNhbGxiYWNrO1xuXG4gIHtcbiAgICAvKipcbiAgICAgKiBpbml0XG4gICAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ3RhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLicpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgLy8gJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBmb2N1cyB0cmFwXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxuICAgICAgICBvbkFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzQWN0aXZhdGUsXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgLy8gc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MLCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MIH0gPSBldFVJLmhvb2tzLnVzZURpYWxvZ1RtcGwoKVxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblxuICAgIGlmKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdhbGVydCcgfHwgcHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nKXtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2NvbXBvbmVudC1kaWFsb2cnKTtcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICR0ZW1wbGF0ZUhUTUwocHJvcHMpO1xuICAgIH1lbHNlIGlmKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdwcmV2aWV3SW1hZ2UnKXtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2NvbXBvbmVudC1kaWFsb2cnKTtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2RpYWxvZy1wcmV2aWV3LWltYWdlJyk7XG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MKHByb3BzKTtcbiAgICB9XG5cbiAgICAkbW9kYWwgPSB0ZW1wbGF0ZTtcbiAgICAkdGFyZ2V0LmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciA9ICcuZGlhbG9nLWNsb3NlJztcbiAgICBtb2RhbERpbW1TZWxlY3RvciA9ICcuZGlhbG9nLWRpbW0nO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRtb2RhbFRpdGxlID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctdGl0Jyk7XG4gICAgJG1vZGFsRGltbSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKG1vZGFsRGltbVNlbGVjdG9yKTtcbiAgICAkbW9kYWxDb250YWluZXIgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250YWluZXInKTtcblxuICAgIG1vZGFsQnRuUG9zaXRpdmUgPSAnLmRpYWxvZy1wb3NpdGl2ZSc7XG4gICAgbW9kYWxCdG5OZWdhdGl2ZSA9ICcuZGlhbG9nLW5lZ2F0aXZlJztcbiAgICAkbW9kYWxCdG5Qb3NpdGl2ZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLXBvc2l0aXZlJyk7XG4gICAgJG1vZGFsQnRuTmVnYXRpdmUgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1uZWdhdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG4gICAgLy8gLy8gYTExeVxuXG4gICAgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyB8fCBwcm9wcy5kaWFsb2dUeXBlID09PSAnY29uZmlybScpe1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdyb2xlJywgJ2FsZXJ0ZGlhbG9nJyk7XG4gICAgfWVsc2UgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3ByZXZpZXdJbWFnZScpe1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdyb2xlJywgJ2RpYWxvZycpO1xuXG4gICAgICBjb25zdCAkc3dpcGVyID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5jb21wb25lbnQtc3dpcGVyJylcbiAgICAgIGNvbnN0IHN3aXBlciA9IG5ldyBldFVJLmNvbXBvbmVudHMuU3dpcGVyQ29tcCgpO1xuICAgICAgc3dpcGVyLmNvcmUuaW5pdCgkc3dpcGVyLCB7XG4gICAgICAgIG5hdmlnYXRpb246IHRydWUsXG4gICAgICAgIHBhZ2luYXRpb246IHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2lkJywgaWQpO1xuICAgIGlmICgkbW9kYWxUaXRsZSkgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWxUaXRsZSwgJ2lkJywgdGl0bGVJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdhcmlhLWxhYmVsbGVkYnknLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3RhYmluZGV4JywgJy0xJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgeyBnZXRUb3BEZXB0aCwgc2V0TGF5ZXJPcGFjaXR5IH0gPSBldFVJLmhvb2tzLnVzZUxheWVyKCdkaWFsb2cnKTtcblxuICAgIGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSA9ICgpID0+IHtcbiAgICB9XG5cbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICAgIGlmKCFzdGF0ZS50cmlnZ2VyKXtcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrXG4gICAgICB9XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgekluZGV4ID0gZ2V0VG9wRGVwdGgoKTtcblxuICAgICAgJG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgJG1vZGFsLnN0eWxlLnpJbmRleCA9IHpJbmRleFxuXG4gICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHsgZHVyYXRpb246IDAsIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDAgfSkudG8oJG1vZGFsRGltbSwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgIH0pO1xuXG4gICAgICBnc2FwXG4gICAgICAgIC50aW1lbGluZSgpXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgc2NhbGU6IDAuOTUsXG4gICAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIH0pXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHsgZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5UGVyY2VudDogMCwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyB9KTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxEaW1tLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICRtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsQ29udGFpbmVyLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBzY2FsZTogMC45NSxcbiAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIGVhc2U6ICdQb3dlcjIuZWFzZU91dCcsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJG1vZGFsLnN0eWxlLnpJbmRleCA9IG51bGxcblxuICAgICAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXN0cm95KCk7XG5cbiAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNoaWxkKCRtb2RhbCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBjbG9zZSk7XG5cbiAgICBpZiAocHJvcHMuZGltbUNsaWNrKSB7XG4gICAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbERpbW1TZWxlY3RvciwgY2xvc2UpO1xuICAgIH1cblxuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQnRuUG9zaXRpdmUsICgpID0+IHtcbiAgICAgIGlmIChwcm9wcy5jYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrO1xuICAgICAgfSBlbHNlIGlmIChwcm9wcy5wb3NpdGl2ZUNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMucG9zaXRpdmVDYWxsYmFjaztcbiAgICAgIH1cblxuICAgICAgY2xvc2UoJ2J0blBvc2l0aXZlJyk7XG4gICAgfSk7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxCdG5OZWdhdGl2ZSwgKCkgPT4ge1xuICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrO1xuXG4gICAgICBjbG9zZSgnYnRuTmVnYXRpdmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG5cbiAgICBpZiAoaXNPcGVuZWQpIHtcbiAgICAgIGFjdGlvbnMub3BlbigpO1xuXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSh0cmlnZ2VyKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJywgdHJpZ2dlciB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogIE1vZGFsXG4gKi9cbmZ1bmN0aW9uIE1vZGFsKCkge1xuICBjb25zdCB7XG4gICAgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50XG4gIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoe1xuICAgIC8vIHByb3BzXG4gICAgZGltbUNsaWNrOiB0cnVlLFxuICAgIGVzYzogdHJ1ZSxcbiAgfSwge1xuICAgIC8vIHN0YXRlXG5cbiAgfSwgcmVuZGVyKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBESU1NX09QQUNJVFkgPSAwLjY7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdtb2RhbCc7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcblxuICBsZXQgZm9jdXNUcmFwSW5zdGFuY2UsXG4gICAgbW9kYWxEaW1tU2VsZWN0b3IsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvcjtcbiAgbGV0ICR0YXJnZXQsICRodG1sLFxuICAgICRtb2RhbFRpdGxlLCAkbW9kYWxDb250YWluZXIsICRtb2RhbERpbW07XG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZih0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZighJHRhcmdldCl7XG4gICAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpXG4gICAgICBzZXRQcm9wcyh7Li4ucHJvcHMsIC4uLl9wcm9wc30pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgICAgc2V0dXBTZWxlY3RvcigpO1xuICAgICAgc2V0dXBFbGVtZW50KCk7XG4gICAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgICAgLy8gZm9jdXMgdHJhcFxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBmb2N1c1RyYXAuY3JlYXRlRm9jdXNUcmFwKCR0YXJnZXQsIHtcbiAgICAgICAgZXNjYXBlRGVhY3RpdmF0ZXM6IHByb3BzLmVzYyxcbiAgICAgICAgb25BY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0FjdGl2YXRlLFxuICAgICAgICBvbkRlYWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlXG4gICAgICB9KTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIC8vIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCl7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBtb2RhbENsb3NlQnRuU2VsZWN0b3IgPSAnLm1vZGFsLWNsb3NlJ1xuICAgIG1vZGFsRGltbVNlbGVjdG9yID0gJy5tb2RhbC1kaW1tJ1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRtb2RhbFRpdGxlID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtdGl0JylcbiAgICAkbW9kYWxEaW1tID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKG1vZGFsRGltbVNlbGVjdG9yKVxuICAgICRtb2RhbENvbnRhaW5lciA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsLWNvbnRhaW5lcicpXG4gICAgJGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKVxuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ3JvbGUnLCAnZGlhbG9nJyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnaWQnLCBpZCk7XG4gICAgaWYoJG1vZGFsVGl0bGUpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsVGl0bGUsICdpZCcsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ2FyaWEtbGFiZWxsZWRieScsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ3RhYmluZGV4JywgJy0xJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKXtcbiAgICBjb25zdCB7IGdldFRvcERlcHRoLCBzZXRMYXllck9wYWNpdHkgfSA9IGV0VUkuaG9va3MudXNlTGF5ZXIoJ21vZGFsJyk7XG5cbiAgICBhY3Rpb25zLmZvY3VzQWN0aXZhdGUgPSAoKSA9PiB7XG4gICAgfVxuXG4gICAgYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUgPSAoKSA9PiB7XG4gICAgICBjbG9zZSgpO1xuICAgICAgLy8gYWN0aW9ucy5jbG9zZSgpO1xuICAgIH1cblxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHpJbmRleCA9IGdldFRvcERlcHRoKCk7XG5cbiAgICAgICR0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICR0YXJnZXQuc3R5bGUuekluZGV4ID0gekluZGV4XG5cbiAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKClcbiAgICAgICAgLnRvKCRtb2RhbERpbW0sIHtkdXJhdGlvbjogMCwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMH0pXG4gICAgICAgIC50bygkbW9kYWxEaW1tLCB7ZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDF9KVxuXG4gICAgICBnc2FwLnRpbWVsaW5lKClcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwge2R1cmF0aW9uOiAwLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAwLCBzY2FsZTogMC45NSwgeVBlcmNlbnQ6IDJ9KVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7ZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5UGVyY2VudDogMCwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0J30pXG4gICAgfVxuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGdzYXAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsRGltbSwge2R1cmF0aW9uOiAwLjE1LCBvcGFjaXR5OiAwLCBvbkNvbXBsZXRlKCl7XG4gICAgICAgICAgICAkbW9kYWxEaW1tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgfX0pXG5cbiAgICAgIGdzYXAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7ZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDAsIHNjYWxlOiAwLjk1LCB5UGVyY2VudDogMiwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0Jywgb25Db21wbGV0ZSgpe1xuICAgICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAkdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAkdGFyZ2V0LnN0eWxlLnpJbmRleCA9IG51bGxcblxuICAgICAgICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG4gICAgICAgICAgfX0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBjbG9zZSk7XG5cbiAgICBpZihwcm9wcy5kaW1tQ2xpY2spe1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxEaW1tU2VsZWN0b3IsIGNsb3NlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNPcGVuZWQgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nO1xuXG4gICAgaWYoaXNPcGVuZWQpe1xuICAgICAgYWN0aW9ucy5vcGVuKClcblxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuYWN0aXZhdGUoKTtcbiAgICB9ZWxzZXtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKVxuXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3Blbigpe1xuICAgIHNldFN0YXRlKHtzdGF0ZTogJ29wZW4nfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpe1xuICAgIHNldFN0YXRlKHtzdGF0ZTogJ2Nsb3NlJ30pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG5cbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiZnVuY3Rpb24gU2VsZWN0Qm94KCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIHR5cGU6IFwiY3VzdG9tXCIsXG4gICAgICBsYWJlbDogXCJcIixcbiAgICAgIGRlZmF1bHQ6IFwiXCIsXG4gICAgICBpdGVtczogW10sXG4gICAgICBzZWxlY3RlZEluZGV4OiAwLFxuICAgICAgdHJhbnNpdGlvbjogXCJub3JtYWxcIixcbiAgICAgIHNjcm9sbFRvOiBmYWxzZSxcbiAgICAgIGdzYXBPcHRpb246IHt9LFxuICAgICAgc3RhdGU6IFwiY2xvc2VcIixcbiAgICB9LFxuICAgIHt9LFxuICAgIHJlbmRlcixcbiAgKTtcbiAgY29uc3QgeyAkdGVtcGxhdGVDdXN0b21IVE1MLCAkdGVtcGxhdGVCYXNpY0hUTUwgfSA9IHVzZVNlbGVjdEJveFRlbXAoKTtcbiAgY29uc3QgeyB1c2VTZWxlY3RTaG93IH0gPSB1c2VUcmFuc2l0aW9uKCk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9IFwic2VsZWN0XCI7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICBsZXQgJHRhcmdldCxcbiAgICAvLyDsmpTshozqtIDroKgg67OA7IiY65OkXG4gICAgc2VsZWN0TGFiZWwsXG4gICAgc2VsZWN0Q29tYm9Cb3gsXG4gICAgc2VsZWN0TGlzdEJveCxcbiAgICBzZWxlY3RPcHRpb24sXG4gICAgdGltZWxpbmU7XG5cbiAge1xuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghJHRhcmdldCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcInRhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLlwiKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIsIFwidHJ1ZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcblxuICAgICAgaWYgKHByb3BzLnR5cGUgPT09IFwiYmFzaWNcIikgcmV0dXJuO1xuXG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBlZmZlY3RcbiAgICAgIHRpbWVsaW5lID0gdXNlU2VsZWN0U2hvdygkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0TGlzdEJveCksIHByb3BzLnRyYW5zaXRpb24sIHByb3BzLmdzYXBPcHRpb24pLnRpbWVsaW5lO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgYWN0aW9uc1twcm9wcy5zdGF0ZSB8fCBzdGF0ZS5zdGF0ZV0/LigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICBpZiAocHJvcHMuaXRlbXMubGVuZ3RoIDwgMSkgcmV0dXJuO1xuICAgIGlmIChwcm9wcy50eXBlID09PSBcImN1c3RvbVwiKSB7XG4gICAgICBjb25zdCB7IHNlbGVjdGVkSW5kZXggfSA9IHByb3BzO1xuICAgICAgY29uc3QgaXRlbUxpc3RUZW1wID0gcHJvcHMuaXRlbXMubWFwKChpdGVtKSA9PiAkdGVtcGxhdGVDdXN0b21IVE1MLml0ZW1zKGl0ZW0pKS5qb2luKFwiXCIpO1xuXG4gICAgICAkdGFyZ2V0LmlubmVySFRNTCA9IGBcbiAgICAgICAgJHtwcm9wcy5sYWJlbCAmJiAkdGVtcGxhdGVDdXN0b21IVE1MLmxhYmVsKHByb3BzLmxhYmVsKX1cbiAgICAgICAgJHtwcm9wcy5kZWZhdWx0ID8gJHRlbXBsYXRlQ3VzdG9tSFRNTC5zZWxlY3RCdG4ocHJvcHMuZGVmYXVsdCkgOiAkdGVtcGxhdGVDdXN0b21IVE1MLnNlbGVjdEJ0bihwcm9wcy5pdGVtcy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09IHByb3BzLml0ZW1zW3NlbGVjdGVkSW5kZXhdLnZhbHVlKS50ZXh0KX1cbiAgICAgICAgJHtwcm9wcy5pdGVtcyAmJiAkdGVtcGxhdGVDdXN0b21IVE1MLml0ZW1zV3JhcChpdGVtTGlzdFRlbXApfVxuICAgICAgYDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VsZWN0QnRuVGVtcCA9ICR0ZW1wbGF0ZUJhc2ljSFRNTC5zZWxlY3RCdG4ocHJvcHMuZGVmYXVsdCk7XG4gICAgICBjb25zdCBpdGVtTGlzdFRlbXAgPSBwcm9wcy5pdGVtcy5tYXAoKGl0ZW0pID0+ICR0ZW1wbGF0ZUJhc2ljSFRNTC5pdGVtcyhpdGVtKSkuam9pbihcIlwiKTtcblxuICAgICAgJHRhcmdldC5pbm5lckhUTUwgPSBgXG4gICAgICAgICR7cHJvcHMubGFiZWwgJiYgJHRlbXBsYXRlQmFzaWNIVE1MLmxhYmVsKHByb3BzLmxhYmVsKX1cbiAgICAgICAgJHtwcm9wcy5pdGVtcyAmJiAkdGVtcGxhdGVCYXNpY0hUTUwuaXRlbXNXcmFwKHNlbGVjdEJ0blRlbXAgKyBpdGVtTGlzdFRlbXApfVxuICAgICAgYDtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICBzZWxlY3RMYWJlbCA9IFwiLmNvbWJvLWxhYmVsXCI7XG4gICAgc2VsZWN0Q29tYm9Cb3ggPSBcIi5zZWxlY3QtYm94XCI7XG4gICAgc2VsZWN0TGlzdEJveCA9IFwiLnNlbGVjdC1vcHRpb25zXCI7XG4gICAgc2VsZWN0T3B0aW9uID0gXCIub3B0aW9uXCI7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICBjb25zdCBsYWJlbElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IGNvbWJvQm94SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoXCJjb21ib2JveFwiKTtcbiAgICBjb25zdCBsaXN0Qm94SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoXCJsaXN0Ym94XCIpO1xuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGFiZWwsIFwiaWRcIiwgbGFiZWxJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJpZFwiLCBjb21ib0JveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcInJvbGVcIiwgXCJjb21ib2JveFwiKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtbGFiZWxsZWRieVwiLCBsYWJlbElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtY29udHJvbHNcIiwgbGlzdEJveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwiaWRcIiwgbGlzdEJveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwicm9sZVwiLCBcImxpc3Rib3hcIik7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcImFyaWEtbGFiZWxsZWRieVwiLCBsYWJlbElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwidGFiaW5kZXhcIiwgLTEpO1xuXG4gICAgLy8gc2VsZWN0IHByb3BlcnR5XG4gICAgY29uc3Qgb3B0aW9ucyA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RPcHRpb24pO1xuICAgIG9wdGlvbnMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBvcHRpb25JZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChcIm9wdGlvblwiKTtcblxuICAgICAgJHRhcmdldFtpbmRleF0gPSBlbDtcbiAgICAgIGVsW1wiaW5kZXhcIl0gPSBpbmRleDtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcImlkXCIsIG9wdGlvbklkKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJvcHRpb25cIik7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIGZhbHNlKTtcblxuICAgICAgcHJvcHMuaXRlbXNbaW5kZXhdPy5kaXNhYmxlZCAmJiBlbC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcblxuICAgICAgaWYgKCEkdGFyZ2V0W1wib3B0aW9uc1wiXSkgJHRhcmdldFtcIm9wdGlvbnNcIl0gPSBbXTtcbiAgICAgICR0YXJnZXRbXCJvcHRpb25zXCJdW2luZGV4XSA9IGVsO1xuICAgIH0pO1xuXG4gICAgIXByb3BzLmRlZmF1bHQgJiYgc2VsZWN0SXRlbShvcHRpb25zW3Byb3BzLnNlbGVjdGVkSW5kZXhdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBsZXQgc2VsZWN0SW5kZXggPSBpc05hTigkdGFyZ2V0LnNlbGVjdGVkSW5kZXgpID8gLTEgOiAkdGFyZ2V0LnNlbGVjdGVkSW5kZXg7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVJbmRleChzdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuICAgICAgc2VsZWN0SW5kZXggPSBpc05hTigkdGFyZ2V0LnNlbGVjdGVkSW5kZXgpID8gLTEgOiAkdGFyZ2V0LnNlbGVjdGVkSW5kZXg7XG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldFtzZWxlY3RJbmRleF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtleUV2ZW50Q2FsbGJhY2soKSB7XG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldFtzZWxlY3RJbmRleF0pO1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiwgJHRhcmdldFtzZWxlY3RJbmRleF0uaWQpO1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gJHRhcmdldFtzZWxlY3RJbmRleF0udGV4dENvbnRlbnQ7XG4gICAgfVxuXG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdENvbWJvQm94KT8uZm9jdXMoKTtcbiAgICAgIG9wZW5TdGF0ZSgpO1xuICAgICAgdXBkYXRlSW5kZXgodHJ1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gJHRhcmdldFtcIm9wdGlvbnNcIl1bJHRhcmdldC5zZWxlY3RlZEluZGV4XT8udGV4dENvbnRlbnQgPz8gcHJvcHMuZGVmYXVsdDtcbiAgICAgIGNsb3NlU3RhdGUoKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRcIik7XG4gICAgICBzZWxlY3RJdGVtKGN1cnJlbnRFbCk7XG4gICAgICBjbG9zZVN0YXRlKCk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuZmlyc3QgPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9IDA7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmxhc3QgPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9ICR0YXJnZXRbXCJvcHRpb25zXCJdLmxlbmd0aCAtIDE7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLnVwID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSBNYXRoLm1heCgtLXNlbGVjdEluZGV4LCAwKTtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZG93biA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gTWF0aC5taW4oKytzZWxlY3RJbmRleCwgJHRhcmdldFtcIm9wdGlvbnNcIl0ubGVuZ3RoIC0gMSk7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcblxuICAgIGNvbXBvbmVudC5vcGVuID0gYWN0aW9ucy5vcGVuO1xuICAgIGNvbXBvbmVudC5jbG9zZSA9IGFjdGlvbnMuY2xvc2U7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gXCJiYXNpY1wiKSByZXR1cm47XG5cbiAgICAvLyBhMTF5XG4gICAgY29uc3QgYWN0aW9uTGlzdCA9IHtcbiAgICAgIHVwOiBbXCJBcnJvd1VwXCJdLFxuICAgICAgZG93bjogW1wiQXJyb3dEb3duXCJdLFxuICAgICAgZmlyc3Q6IFtcIkhvbWVcIiwgXCJQYWdlVXBcIl0sXG4gICAgICBsYXN0OiBbXCJFbmRcIiwgXCJQYWdlRG93blwiXSxcbiAgICAgIGNsb3NlOiBbXCJFc2NhcGVcIl0sXG4gICAgICBzZWxlY3Q6IFtcIkVudGVyXCIsIFwiIFwiXSxcbiAgICB9O1xuXG4gICAgYWRkRXZlbnQoXCJibHVyXCIsIHNlbGVjdENvbWJvQm94LCAoZSkgPT4ge1xuICAgICAgaWYgKGUucmVsYXRlZFRhcmdldD8ucm9sZSA9PT0gXCJsaXN0Ym94XCIpIHJldHVybjtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgc2VsZWN0Q29tYm9Cb3gsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICBjb25zdCB0b2dnbGVTdGF0ZSA9IHN0YXRlLnN0YXRlID09PSBcIm9wZW5cIiA/IFwiY2xvc2VcIiA6IFwib3BlblwiO1xuICAgICAgYWN0aW9uc1t0b2dnbGVTdGF0ZV0/LigpO1xuICAgIH0pO1xuXG4gICAgLy8gYTExeVxuICAgIGFkZEV2ZW50KFwia2V5ZG93blwiLCBzZWxlY3RDb21ib0JveCwgKGUpID0+IHtcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZSA9PT0gXCJjbG9zZVwiKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHsga2V5IH0gPSBlO1xuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmVudHJpZXMoYWN0aW9uTGlzdCkuZmluZCgoW18sIGtleXNdKSA9PiBrZXlzLmluY2x1ZGVzKGtleSkpO1xuXG4gICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgW2FjdGlvbk5hbWVdID0gYWN0aW9uO1xuICAgICAgICBhY3Rpb25zW2FjdGlvbk5hbWVdPy4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgc2VsZWN0TGlzdEJveCwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIGlmICghdGFyZ2V0LnJvbGUgPT09IFwib3B0aW9uXCIpIHJldHVybjtcbiAgICAgIHVwZGF0ZUN1cnJlbnRDbGFzcyh0YXJnZXQpO1xuICAgICAgYWN0aW9ucy5zZWxlY3QoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSBcIm9wZW5cIjtcblxuICAgIHByb3BzLnRyYW5zaXRpb24gJiYgdGltZWxpbmUoaXNPcGVuZWQpO1xuICAgIGNoZWNrT3BlbkRpcihpc09wZW5lZCk7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtZXhwYW5kZWRcIiwgaXNPcGVuZWQpO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJyk7XG4gICAgaWYgKGlzT3BlbmVkKSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiLCBzZWxlY3RlZEVsPy5pZCA/PyBcIlwiKTtcbiAgICBlbHNlIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIsIFwiXCIpO1xuICB9XG5cbiAgLy8gY3VzdG9tXG4gIGZ1bmN0aW9uIGNoZWNrT3BlbkRpcihzdGF0ZSkge1xuICAgIGlmICghc3RhdGUgfHwgcHJvcHMuc2Nyb2xsVG8pIHJldHVybjsgLy8gZmFsc2XsnbTqsbDrgpggc2Nyb2xsVG8g6riw64qlIOyeiOydhCDrlYwgLSDslYTrnpjroZwg7Je066a8XG5cbiAgICBjb25zdCB7IGhlaWdodDogbGlzdEhlaWdodCB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gpO1xuICAgIGNvbnN0IHsgaGVpZ2h0OiBjb21ib0hlaWdodCwgYm90dG9tOiBjb21ib0JvdHRvbSB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94KTtcbiAgICBjb25zdCByb2xlID0gd2luZG93LmlubmVySGVpZ2h0IC0gTUFSR0lOIDwgY29tYm9Cb3R0b20gKyBsaXN0SGVpZ2h0O1xuXG4gICAgZXRVSS51dGlscy5zZXRTdHlsZSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcImJvdHRvbVwiLCByb2xlID8gY29tYm9IZWlnaHQgKyBcInB4XCIgOiBcIlwiKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSAuY3VycmVudCBjbGFzc1xuICBmdW5jdGlvbiB1cGRhdGVDdXJyZW50Q2xhc3MoYWRkQ2xhc3NFbCkge1xuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50XCIpPy5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudFwiKTtcbiAgICBhZGRDbGFzc0VsPy5jbGFzc0xpc3QuYWRkKFwiY3VycmVudFwiKTtcbiAgfVxuXG4gIC8vIHNlbGVjdCBpdGVtXG4gIGZ1bmN0aW9uIHNlbGVjdEl0ZW0odGFyZ2V0KSB7XG4gICAgY29uc3QgdGFyZ2V0T3B0aW9uID0gdGFyZ2V0Py5jbG9zZXN0KHNlbGVjdE9wdGlvbik7XG5cbiAgICBpZiAoIXRhcmdldE9wdGlvbikgcmV0dXJuO1xuXG4gICAgJHRhcmdldC5zZWxlY3RlZEluZGV4ID0gdGFyZ2V0T3B0aW9uW1wiaW5kZXhcIl07XG4gICAgJHRhcmdldC52YWx1ZSA9IHRhcmdldE9wdGlvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXZhbHVlXCIpO1xuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJywgXCJhcmlhLXNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICB0YXJnZXRPcHRpb24uc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCB0cnVlKTtcblxuICAgIHVwZGF0ZUN1cnJlbnRDbGFzcygkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpKTtcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7c2VsZWN0Q29tYm9Cb3h9IDpsYXN0LWNoaWxkYCkudGV4dENvbnRlbnQgPSB0YXJnZXRPcHRpb24udGV4dENvbnRlbnQ7XG4gIH1cblxuICAvLyBzZWxlY3Qgc3RhdGVcbiAgZnVuY3Rpb24gb3BlblN0YXRlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6IFwib3BlblwiIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VTdGF0ZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcImNsb3NlXCIgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcblxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogU2tlbFxuICogLy8gaW5pdCwgc2V0dXAsIHVwZGF0ZSwgZGVzdHJveVxuICogLy8gc2V0dXBUZW1wbGF0ZSwgc2V0dXBTZWxlY3Rvciwgc2V0dXBFbGVtZW50LCBzZXR1cEFjdGlvbnMsXG4gKiAgICAgIHNldEV2ZW50LCByZW5kZXIsIGN1c3RvbUZuLCBjYWxsYWJsZVxuICpcbiAqICAgICAgZG9t66eMIOydtOyaqe2VtOyEnCB1aSDstIjquLDtmZRcbiAqICAgICAgICBkYXRhLXByb3BzLW9wdDEsIGRhdGEtcHJvcHMtb3B0MiwgZGF0YS1wcm9wcy1vcHQzXG4gKiAgICAgIOqzoOq4ieyYteyFmFxuICogICAgICAgIGRhdGEtaW5pdD1mYWxzZVxuICogICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IFNrZWwoKTtcbiAqICAgICAgICBpbnN0YW5jZS5jb3JlLmluaXQoJy5zZWxlY3RvcicsIHsgb3B0MTogJ3ZhbHVlJyB9KVxuICpcbiAqICAgICAgZGF0YS1pbml0IOyymOumrFxuICovXG5mdW5jdGlvbiBTa2VsKCkge1xuICBjb25zdCB7XG4gICAgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50XG4gIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoe1xuICAgIC8vIHByb3BzXG5cbiAgfSwge1xuICAgIC8vIHN0YXRlXG5cbiAgfSwgcmVuZGVyKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ3NrZWwnO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCxcbiAgICBzb21lU2VsZWN0b3IsIG90aGVyU2VsZWN0b3IsXG4gICAgJHRhcmdldEVsczEsICR0YXJnZXRFbHMyXG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZih0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZighJHRhcmdldCl7XG4gICAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpXG4gICAgICBzZXRQcm9wcyh7Li4ucHJvcHMsIC4uLl9wcm9wc30pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgLy8gdGVtcGxhdGUsIHNlbGVjdG9yLCBlbGVtZW50LCBhY3Rpb25zXG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKClcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3Rvcigpe1xuICAgICR0YXJnZXRFbHMyID0gJy5lbDInO1xuICAgICR0YXJnZXRFbHMxID0gJy5lbDEnO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgbGFiZWxJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcblxuICAgIC8vIGExMXlcbiAgICB1dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAkc2VsZWN0TGFiZWwsICdpZCcsIGxhYmVsSWQpO1xuXG4gICAgLy8gY29tcG9uZW50IGN1c3RvbSBlbGVtZW50XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKXtcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG5cbiAgICB9XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge1xuXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgJHRhcmdldEVsczEsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICAvLyBoYW5kbGVyXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gcmVuZGVyXG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH1cblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiZnVuY3Rpb24gU3dpcGVyQ29tcCgpIHtcbiAgY29uc3Qge1xuICAgIGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0U3RhdGUsIHNldFByb3BzLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudFxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIGxvb3A6IHRydWUsXG4gICAgICBvbjoge1xuICAgICAgICBzbGlkZUNoYW5nZVRyYW5zaXRpb25FbmQoKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7dGhpcy5yZWFsSW5kZXggKyAxfeuyiCDsp7ggc2xpZGVgKTtcbiAgICAgICAgICBzZXRTdGF0ZSh7IGFjdGl2ZUluZGV4OiB0aGlzLnJlYWxJbmRleCArIDEgfSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhdGU6IFwiXCIsXG4gICAgICBydW5uaW5nOiBcIlwiLFxuICAgICAgYWN0aXZlSW5kZXg6IDAsXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLyoqXG4gICAqIGRhdGEtcHJvcHMg66as7Iqk7Yq4XG4gICAqL1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSBcInN3aXBlclwiO1xuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0LCAkc3dpcGVyLCAkc3dpcGVyTmF2aWdhdGlvbiwgJHN3aXBlclBhZ2luYXRpb24sICRzd2lwZXJBdXRvcGxheSwgJHN3aXBlclNsaWRlVG9CdXR0b247XG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICAgIHRocm93IEVycm9yKFwidGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuXCIpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIiwgXCJ0cnVlXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgLy8gdGVtcGxhdGUsIHNlbGVjdG9yLCBlbGVtZW50LCBhY3Rpb25zXG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChwcm9wcyAmJiB1dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1pbml0XCIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHsgbmF2aWdhdGlvbiwgcGFnaW5hdGlvbiwgYXV0b3BsYXkgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgJHRlbXBsYXRlSFRNTCB9ID0gdXNlU3dpcGVyVG1wbCgpO1xuICAgIGxldCBuYXZpZ2F0aW9uRWwsIHBhZ2luYXRpb25FbCwgYXV0b3BsYXlFbDtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUhUTUxFbGVtZW50KF9jbGFzc05hbWUsIGh0bWxTdHJpbmcpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoX2NsYXNzTmFtZSk7XG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sU3RyaW5nO1xuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIGlmIChuYXZpZ2F0aW9uKSB7XG4gICAgICBuYXZpZ2F0aW9uRWwgPSBjcmVhdGVIVE1MRWxlbWVudChcInN3aXBlci1uYXZpZ2F0aW9uXCIsICR0ZW1wbGF0ZUhUTUwubmF2aWdhdGlvbigpKTtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5zd2lwZXItd3JhcHBlclwiKS5hZnRlcihuYXZpZ2F0aW9uRWwpO1xuICAgICAgdHlwZW9mIG5hdmlnYXRpb24gPT09IFwiYm9vbGVhblwiICYmXG4gICAgICAgIHNldFByb3BzKHtcbiAgICAgICAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICAgICAgICBwcmV2RWw6IFwiLnN3aXBlci1idXR0b24tcHJldlwiLFxuICAgICAgICAgICAgbmV4dEVsOiBcIi5zd2lwZXItYnV0dG9uLW5leHRcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocGFnaW5hdGlvbikge1xuICAgICAgcGFnaW5hdGlvbkVsID0gY3JlYXRlSFRNTEVsZW1lbnQoXCJzd2lwZXItcGFnaW5hdGlvbi13cmFwXCIsICR0ZW1wbGF0ZUhUTUwucGFnaW5hdGlvbigpKTtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5zd2lwZXItd3JhcHBlclwiKS5hZnRlcihwYWdpbmF0aW9uRWwpO1xuICAgICAgdHlwZW9mIHBhZ2luYXRpb24gPT09IFwiYm9vbGVhblwiICYmXG4gICAgICAgIHNldFByb3BzKHtcbiAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICBlbDogXCIuc3dpcGVyLXBhZ2luYXRpb25cIixcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYXV0b3BsYXkpIHtcbiAgICAgIGF1dG9wbGF5RWwgPSBjcmVhdGVIVE1MRWxlbWVudChcInN3aXBlci1hdXRvcGxheS13cmFwXCIsICR0ZW1wbGF0ZUhUTUwuYXV0b3BsYXkoKSk7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIuc3dpcGVyLXdyYXBwZXJcIikuYWZ0ZXIoYXV0b3BsYXlFbCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAkc3dpcGVyUGFnaW5hdGlvbiA9IFwiLnN3aXBlci1wYWdpbmF0aW9uXCI7XG4gICAgJHN3aXBlck5hdmlnYXRpb24gPSBcIi5zd2lwZXItbmF2aWdhdGlvblwiO1xuICAgICRzd2lwZXJBdXRvcGxheSA9IFwiLnN3aXBlci1hdXRvcGxheVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG5cbiAgICAvLyBhMTF5XG5cbiAgICAvLyBuZXcgU3dpcGVyIOyDneyEsVxuICAgICRzd2lwZXIgPSBuZXcgU3dpcGVyKCR0YXJnZXQsIHsgLi4ucHJvcHMgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgLy8gYWN0aW9ucy5zdGFydCA9ICgpID0+IHtcbiAgICAvLyAgIHBsYXkoKTtcbiAgICAvLyB9O1xuICAgIC8vXG4gICAgLy8gYWN0aW9ucy5zdG9wID0gKCkgPT4ge1xuICAgIC8vICAgc3RvcCgpO1xuICAgIC8vIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICAvLyBhdXRvcGxheSDrsoTtirxcbiAgICBpZiAocHJvcHMuYXV0b3BsYXkpIHtcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgJHN3aXBlckF1dG9wbGF5LCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgJGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJHN3aXBlckF1dG9wbGF5KTtcbiAgICAgICAgaGFuZGxlQXV0b3BsYXkoJGV2ZW50VGFyZ2V0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXJcbiAgfVxuXG4gIC8vIGF1dG9wbGF5IOq0gOugqCDsu6TsiqTthYAg7ZWo7IiYXG4gIGZ1bmN0aW9uIGhhbmRsZUF1dG9wbGF5KCR0YXJnZXQpIHtcbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJwbGF5XCIpO1xuICAgICR0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShcInN0b3BcIik7XG5cbiAgICBpZiAoJHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJzdG9wXCIpKSB7XG4gICAgICBzdG9wKCk7XG4gICAgfSBlbHNlIGlmICgkdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInBsYXlcIikpIHtcbiAgICAgIHBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5KCkge1xuICAgICRzd2lwZXIuYXV0b3BsYXkuc3RhcnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgJHN3aXBlci5hdXRvcGxheS5zdG9wKCk7XG4gIH1cblxuICAvLyDtirnsoJUg7Iqs65287J2065Oc66GcIOydtOuPmVxuICBmdW5jdGlvbiBtb3ZlVG9TbGlkZShpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcykge1xuICAgIGlmIChwcm9wcy5sb29wKSB7XG4gICAgICAkc3dpcGVyLnNsaWRlVG9Mb29wKGluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHN3aXBlci5zbGlkZVRvKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICAvLyBjYWxsYWJsZVxuICAgIHVwZGF0ZSxcbiAgICBnZXRTd2lwZXJJbnN0YW5jZSgpIHtcbiAgICAgIHJldHVybiAkc3dpcGVyOyAvLyAkc3dpcGVyIOyduOyKpO2EtOyKpCDrsJjtmZhcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqIFNrZWxcbiAqIC8vIGluaXQsIHNldHVwLCB1cGRhdGUsIGRlc3Ryb3lcbiAqIC8vIHNldHVwVGVtcGxhdGUsIHNldHVwU2VsZWN0b3IsIHNldHVwRWxlbWVudCwgc2V0dXBBY3Rpb25zLFxuICogICAgICBzZXRFdmVudCwgcmVuZGVyLCBjdXN0b21GbiwgY2FsbGFibGVcbiAqL1xuZnVuY3Rpb24gVGFiKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIC8vIHByb3BzXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBzdGF0ZVxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSBcInRhYlwiO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsIHRhYkhlYWQsICR0YWJIZWFkRWwsIHRhYkJ0biwgJHRhYkJ0bkVsLCB0YWJDb250ZW50LCAkdGFiQ29udGVudEVsO1xuXG4gIHtcbiAgICAvKipcbiAgICAgKiBpbml0XG4gICAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghJHRhcmdldCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcInRhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLlwiKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIsIFwidHJ1ZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIGVmZmVjdFxuICAgICAgcHJvcHMuc3RpY2t5ICYmIHN0aWNreVRhYigpO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogcHJvcHMuYWN0aXZlID8/ICR0YWJCdG5FbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIik7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgLy8gJHRhcmdldC5pbm5lckhUTUwgPSBgYDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICB0YWJIZWFkID0gXCIudGFiLWhlYWRcIjtcbiAgICB0YWJCdG4gPSBcIi50YWItbGFiZWxcIjtcbiAgICB0YWJDb250ZW50ID0gXCIudGFiLWNvbnRlbnRcIjtcblxuICAgIC8vIGVsZW1lbnRcbiAgICAkdGFiSGVhZEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKHRhYkhlYWQpO1xuICAgICR0YWJCdG5FbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCh0YWJCdG4pO1xuICAgICR0YWJDb250ZW50RWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwodGFiQ29udGVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICAvLyBhMTF5XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCB0YWJIZWFkLCBcInJvbGVcIiwgXCJ0YWJsaXN0XCIpO1xuXG4gICAgLy8gY29tcG9uZW50IGN1c3RvbSBlbGVtZW50XG4gICAgJHRhYkhlYWRFbC5zdHlsZS50b3VjaEFjdGlvbiA9IFwibm9uZVwiO1xuICAgICR0YWJCdG5FbC5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB0YWJCdG5JZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICAgIGNvbnN0IHRhYkNvbnRlbnRJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChcInRhYnBhbmVsXCIpO1xuXG4gICAgICB0YWIuc2V0QXR0cmlidXRlKFwiaWRcIiwgdGFiQnRuSWQpO1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJ0YWJcIik7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBmYWxzZSk7XG5cbiAgICAgIGlmICgkdGFiQ29udGVudEVsW2luZGV4XSkge1xuICAgICAgICAkdGFiQ29udGVudEVsW2luZGV4XS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0YWJDb250ZW50SWQpO1xuICAgICAgICAkdGFiQ29udGVudEVsW2luZGV4XS5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwidGFicGFuZWxcIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRhYlZhbHVlID0gdGFiLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpO1xuICAgICAgY29uc3QgdGFiQ29udGVudFZhbHVlID0gJHRhYkNvbnRlbnRFbFtpbmRleF0uZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIik7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkNvbnRlbnR9W2RhdGEtdGFiLXZhbHVlPVwiJHt0YWJWYWx1ZX1cIl1gLCBcImFyaWEtbGFiZWxsZWRieVwiLCB0YWIuaWQpO1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBgJHt0YWJCdG59W2RhdGEtdGFiLXZhbHVlPVwiJHt0YWJDb250ZW50VmFsdWV9XCJdYCwgXCJhcmlhLWNvbnRyb2xzXCIsICR0YWJDb250ZW50RWxbaW5kZXhdLmlkKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBsZXQgc3RhcnRYID0gMDtcbiAgICBsZXQgZW5kWCA9IDA7XG4gICAgbGV0IG1vdmVYID0gMDtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IDA7XG4gICAgbGV0IGlzUmVhZHlNb3ZlID0gZmFsc2U7XG4gICAgbGV0IGNsaWNrYWJsZSA9IHRydWU7XG5cbiAgICBhY3Rpb25zLnNlbGVjdCA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY29uc3QgdGFyZ2V0QnRuID0gZS50YXJnZXQuY2xvc2VzdCh0YWJCdG4pO1xuICAgICAgaWYgKCF0YXJnZXRCdG4pIHJldHVybjtcbiAgICAgIGlmICghY2xpY2thYmxlKSByZXR1cm47XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiB0YXJnZXRCdG4uZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XG4gICAgICBnc2FwLnRvKCR0YWJIZWFkRWwsIHtcbiAgICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgICAgc2Nyb2xsTGVmdDogdGFyZ2V0QnRuLm9mZnNldExlZnQsXG4gICAgICAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLmRyYWdTdGFydCA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKGlzUmVhZHlNb3ZlKSByZXR1cm47XG4gICAgICBpc1JlYWR5TW92ZSA9IHRydWU7XG4gICAgICBzdGFydFggPSBlLng7XG4gICAgICBzY3JvbGxMZWZ0ID0gJHRhYkhlYWRFbC5zY3JvbGxMZWZ0O1xuICAgIH07XG4gICAgYWN0aW9ucy5kcmFnTW92ZSA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCFpc1JlYWR5TW92ZSkgcmV0dXJuO1xuICAgICAgbW92ZVggPSBlLng7XG4gICAgICAkdGFiSGVhZEVsLnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0ICsgKHN0YXJ0WCAtIG1vdmVYKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZHJhZ0VuZCA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCFpc1JlYWR5TW92ZSkgcmV0dXJuO1xuICAgICAgZW5kWCA9IGUueDtcbiAgICAgIGlmIChNYXRoLmFicyhzdGFydFggLSBlbmRYKSA8IDEwKSBjbGlja2FibGUgPSB0cnVlO1xuICAgICAgZWxzZSBjbGlja2FibGUgPSBmYWxzZTtcbiAgICAgIGlzUmVhZHlNb3ZlID0gZmFsc2U7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRyYWdMZWF2ZSA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCFpc1JlYWR5TW92ZSkgcmV0dXJuO1xuXG4gICAgICAvLyBnc2FwLnRvKCR0YWJIZWFkRWwsIHtcbiAgICAgIC8vICAgc2Nyb2xsTGVmdDogJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKS5vZmZzZXRMZWZ0LFxuICAgICAgLy8gICBvdmVyd3JpdGU6IHRydWUsXG4gICAgICAvLyB9KTtcblxuICAgICAgY2xpY2thYmxlID0gdHJ1ZTtcbiAgICAgIGlzUmVhZHlNb3ZlID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGFjdGlvbnMudXAgPSAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSByZXR1cm47XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZG93biA9IChlKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZykgcmV0dXJuO1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZmlyc3QgPSAoKSA9PiB7XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiAkdGFiQnRuRWxbMF0uZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5sYXN0ID0gKCkgPT4ge1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogJHRhYkJ0bkVsWyR0YWJCdG5FbC5sZW5ndGggLSAxXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGZvY3VzVGFyZ2V0VmFsdWUoZWwsIHZhbHVlKSB7XG4gICAgICBjb25zdCBmb2N1c1RhcmdldCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtlbH1bZGF0YS10YWItdmFsdWU9XCIke3ZhbHVlfVwiXWApO1xuICAgICAgZm9jdXNUYXJnZXQ/LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgY29uc3QgYWN0aW9uTGlzdCA9IHtcbiAgICAgIHVwOiBbXCJBcnJvd0xlZnRcIl0sXG4gICAgICBkb3duOiBbXCJBcnJvd1JpZ2h0XCJdLFxuICAgICAgZmlyc3Q6IFtcIkhvbWVcIl0sXG4gICAgICBsYXN0OiBbXCJFbmRcIl0sXG4gICAgICBzZWxlY3Q6IFtcIkVudGVyXCIsIFwiIFwiXSxcbiAgICB9O1xuXG4gICAgYWRkRXZlbnQoXCJjbGlja1wiLCB0YWJIZWFkLCBhY3Rpb25zLnNlbGVjdCk7XG4gICAgYWRkRXZlbnQoXCJwb2ludGVyZG93blwiLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdTdGFydCk7XG4gICAgYWRkRXZlbnQoXCJwb2ludGVybW92ZVwiLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdNb3ZlKTtcbiAgICBhZGRFdmVudChcInBvaW50ZXJ1cFwiLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdFbmQpO1xuICAgIGFkZEV2ZW50KFwicG9pbnRlcmxlYXZlXCIsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ0xlYXZlKTtcblxuICAgIGFkZEV2ZW50KFwia2V5ZG93blwiLCB0YWJIZWFkLCAoZSkgPT4ge1xuICAgICAgY29uc3QgeyBrZXkgfSA9IGU7XG4gICAgICBjb25zdCBhY3Rpb24gPSBPYmplY3QuZW50cmllcyhhY3Rpb25MaXN0KS5maW5kKChbXywga2V5c10pID0+IGtleXMuaW5jbHVkZXMoa2V5KSk7XG5cbiAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBjb25zdCBbYWN0aW9uTmFtZV0gPSBhY3Rpb247XG4gICAgICAgIGFjdGlvbnNbYWN0aW9uTmFtZV0/LihlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBnZXRJZCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHt0YWJCdG59W2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdYCk/LmlkO1xuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJywgXCJhcmlhLXNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkJ0bn1bZGF0YS10YWItdmFsdWU9XCIke3N0YXRlLmFjdGl2ZVZhbHVlfVwiXWAsIFwiYXJpYS1zZWxlY3RlZFwiLCB0cnVlKTtcblxuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHt0YWJDb250ZW50fVthcmlhLWxhYmVsbGVkYnk9XCIke2dldElkfVwiXWApPy5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7dGFiQ29udGVudH1bZGF0YS10YWItdmFsdWU9XCIke3N0YXRlLmFjdGl2ZVZhbHVlfVwiXWApPy5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbiAgfVxuXG4gIC8vIGN1c3RvbVxuICBmdW5jdGlvbiBzdGlja3lUYWIoKSB7XG4gICAgY29uc3QgeyBib3R0b20gfSA9IGV0VUkuaG9va3MudXNlR2V0Q2xpZW50UmVjdChkb2N1bWVudCwgcHJvcHMuc3RpY2t5KTtcblxuICAgICR0YXJnZXQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgJHRhYkhlYWRFbC5zdHlsZS5wb3NpdGlvbiA9IFwic3RpY2t5XCI7XG4gICAgaWYgKCFib3R0b20pICR0YWJIZWFkRWwuc3R5bGUudG9wID0gMCArIFwicHhcIjtcbiAgICBlbHNlICR0YWJIZWFkRWwuc3R5bGUudG9wID0gYm90dG9tICsgXCJweFwiO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgdXBkYXRlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG5cbi8qXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0ICR0YWJCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb21wb25lbnQ9XCJ0YWJcIl0nKTtcbiAgJHRhYkJveC5mb3JFYWNoKCh0YWJCb3gpID0+IHtcbiAgICBjb25zdCB0YWIgPSBUYWIoKTtcbiAgICB0YWIuY29yZS5pbml0KHRhYkJveCk7XG4gIH0pO1xufSk7XG4qL1xuIiwiLy8gcHJvcHPripQg7Jyg7KCAKOyekeyXheyekCnqsIAg7KCV7J2Y7ZWgIOyImCDsnojripQg7Ji17IWYXG4vLyBzdGF0ZeuKlCDrgrTrtoAg66Gc7KeB7JeQ7IScIOyekeuPmeuQmOuKlCDroZzsp4EgKGV4OiBzdGF0ZSBvcGVuIGNsb3NlIGFyaWEg65Ox65OxLi4uLiApXG5cbi8vIO2DgOyehSDsoJXsnZhcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBUb29sdGlwUHJvcHNDb25maWdcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZGlzYWJsZWQgLSDsmpTshozqsIAg67mE7Zmc7ISx7ZmUIOyDge2DnOyduOyngOulvCDrgpjtg4Drg4Xri4jri6QuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9uY2UgLSDsnbTrsqTtirjrgpgg7JWh7IWY7J2EIO2VnCDrsojrp4wg7Iuk7ZaJ7ZWg7KeAIOyXrOu2gOulvCDqsrDsoJXtlanri4jri6QuXG4gKiBAcHJvcGVydHkge2ZhbHNlIHwgbnVtYmVyfSBkdXJhdGlvbiAtIOyVoOuLiOuplOydtOyFmCDrmJDripQg7J2067Kk7Yq4IOyngOyGjSDsi5zqsITsnYQg67CA66as7LSIIOuLqOychOuhnCDshKTsoJXtlanri4jri6QuICdmYWxzZSfsnbwg6rK97JqwIOyngOyGjSDsi5zqsITsnYQg66y07Iuc7ZWp64uI64ukLlxuICogQHByb3BlcnR5IHtPYmplY3R9IG9yaWdpbiAtIOybkOygkCDrmJDripQg7Iuc7J6RIOyngOygkOydhCDrgpjtg4DrgrTripQg6rCd7LK07J6F64uI64ukLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gVG9vbHRpcFN0YXRlQ29uZmlnXG4gKiBAcHJvcGVydHkgeydjbG9zZScgfCAnb3Blbid9IHN0YXRlIC0g7Yi07YyB7J2YIOyDge2DnOqwki4gY2xvc2UsIG9wZW4g65GYIOykkeyXkCDtlZjrgpjsnoXri4jri6QuXG4gKiBAcHJvcGVydHkgeydib3R0b20nIHwgJ3RvcCcgfCAnbGVmdCcgfCAncmlnaHQnfSBwb3NpdGlvbiAtIO2ItO2MgeydmCDsnITsuZjqsJIuIGJvdHRvbSwgdG9wLCBsZWZ0LCByaWdodCDspJHsl5Ag7ZWY64KY7J6F64uI64ukLlxuICovXG5cbmZ1bmN0aW9uIFRvb2x0aXAoKSB7XG4gIGNvbnN0IHtcbiAgICBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnRcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZSh7XG5cbiAgfSwge1xuXG4gIH0sIHJlbmRlcik7XG5cbiAgLy8gc3RhdGUg67OA6rK9IOyLnCDrnpzrjZQg7J6s7Zi47LacXG4gIGNvbnN0IG5hbWUgPSAndG9vbHRpcCc7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgICAvKiogQHR5cGUge1Rvb2x0aXBQcm9wc0NvbmZpZ30gKi9cbiAgICAvKiogQHR5cGUge1Rvb2x0aXBTdGF0ZUNvbmZpZ30gKi9cbiAgICAvLyDsmpTshozqtIDroKgg67OA7IiY65OkXG4gIGxldCAkdGFyZ2V0LFxuICAgICR0b29sdGlwVHJpZ2dlckJ0bixcbiAgICAkdG9vbHRpcENsb3NlQnRuLFxuICAgICR0b29sdGlwQ29udGFpbmVyO1xuXG4gIHtcbiAgICAvKipcbiAgICAgKiBpbml0XG4gICAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ3RhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLicpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gdGhpcztcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgc2V0dXBTZWxlY3RvcigpO1xuICAgICAgc2V0dXBFbGVtZW50KCk7XG5cbiAgICAgIC8vIGZvY3VzIHRyYXBcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlID0gZm9jdXNUcmFwLmNyZWF0ZUZvY3VzVHJhcCgkdGFyZ2V0LCB7XG4gICAgICAgIG9uQWN0aXZhdGU6ICgpID0+IHt9LFxuICAgICAgICBvbkRlYWN0aXZhdGU6ICgpID0+IHtcbiAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gZWxlbWVudFxuICAgICR0b29sdGlwQ29udGFpbmVyID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudG9vbHRpcC1jb250YWluZXInKTtcblxuICAgIC8vIHNlbGVjb3RyXG4gICAgJHRvb2x0aXBUcmlnZ2VyQnRuID0gJy50b29sdGlwLWJ0bic7XG4gICAgJHRvb2x0aXBDbG9zZUJ0biA9ICcuYnRuLWNsb3NlJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBzZXQgaWRcbiAgICBjb25zdCBpZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICBjb25zdCB0aXRsZUlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUgKyAnLXRpdCcpO1xuXG4gICAgLy8gYTExeVxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGl0bGVJZCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCAkdG9vbHRpcFRyaWdnZXJCdG4sIG9wZW4pO1xuICAgIGFkZEV2ZW50KCdjbGljaycsICR0b29sdGlwQ2xvc2VCdG4sIGNsb3NlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHR5cGUgfSA9IHByb3BzO1xuICAgIGNvbnN0IGlzU2hvdyA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG4gICAgY29uc3QgZXhwYW5kZWQgPSAkdG9vbHRpcENvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnO1xuICAgIGNvbnN0ICRjbG9zZUJ0biA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcigkdG9vbHRpcENsb3NlQnRuKTtcblxuICAgICR0b29sdGlwQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICFleHBhbmRlZCk7XG4gICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGV4cGFuZGVkKTtcbiAgICBpZiAoaXNTaG93KSB7XG4gICAgICBoYW5kbGVPcGVuQW5pbWF0aW9uKHR5cGUpO1xuICAgICAgJGNsb3NlQnRuLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZUNsb3NlQW5pbWF0aW9uKHR5cGUpO1xuICAgICAgJGNsb3NlQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlT3BlbkFuaW1hdGlvbih0eXBlKSB7XG4gICAgY29uc3Qgc2V0QW5pbWF0aW9uID0geyBkdXJhdGlvbjogMCwgZGlzcGxheTogJ25vbmUnLCBvcGFjaXR5OiAwIH07XG4gICAgY29uc3Qgc2NhbGUgPSBwcm9wcy50cmFuc2Zvcm0uc2NhbGUueDtcbiAgICBpZiAodHlwZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHNldEFuaW1hdGlvbikudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAxIH0pO1xuICAgIH1cblxuICAgIGlmICh0eXBlID09PSAnY3VzdG9tJykge1xuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCR0b29sdGlwQ29udGFpbmVyLCBzZXRBbmltYXRpb24pLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7IGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbiwgc2NhbGU6IDEsIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDEgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xvc2VBbmltYXRpb24odHlwZSkge1xuICAgIGNvbnN0IHNjYWxlID0gcHJvcHMudHJhbnNmb3JtLnNjYWxlLng7XG4gICAgaWYgKHR5cGUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7IGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbiwgZGlzcGxheTogJ25vbmUnLCBvcGFjaXR5OiAwIH0pO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ2N1c3RvbScpIHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwgeyBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sIHNjYWxlOiBzY2FsZSwgZGlzcGxheTogJ25vbmUnLCBvcGFjaXR5OiAwIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgaWYgKHN0YXRlLnN0YXRlICE9PSAnb3BlbicpIHtcbiAgICAgIHNldFN0YXRlKHsgc3RhdGU6ICdvcGVuJyB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBpZiAoc3RhdGUuc3RhdGUgIT09ICdjbG9zZScpIHtcbiAgICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIGluaXQsXG4gICAgICBkZXN0cm95LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cblxuLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuLy8gICBjb25zdCAkdG9vbHRpcFNlbGVjdG9yID0gZG9jdW1lbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tcG9uZW50LXRvb2x0aXBcIik7XG4vLyAgICR0b29sdGlwU2VsZWN0b3IuZm9yRWFjaCgodG9vbHRpcCkgPT4ge1xuLy8gICAgIGNvbnN0IHRvb2x0aXBDb21wb25lbnQgPSBUb29sdGlwKCk7XG4vLyAgICAgdG9vbHRpcENvbXBvbmVudC5pbml0KHRvb2x0aXApO1xuLy8gICB9KTtcbi8vIH0pO1xuXG4vLyDquLDtg4Ag7Ji17IWY65OkLi4uXG4vLyBkdXJhdGlvbjogMzAwLFxuLy8gaGVpZ2h0OiAyMDAsXG4vLyB0cmFuc2Zvcm06IHtcbi8vICAgc2NhbGU6IHtcbi8vICAgICB4OiAxLFxuLy8gICAgIHk6IDEsXG4vLyAgIH0sXG4vLyAgIHRyYW5zbGF0ZToge1xuLy8gICAgIHg6IDAsXG4vLyAgICAgeTogOTAsXG4vLyAgIH0sXG4vLyAgIGRlbGF5OiAwLFxuLy8gICBlYXNlaW5nOiBcImVhc2Utb3V0XCIsXG4vLyB9LFxuXG4vKipcbiAqIFNrZWxcbiAqIC8vIGluaXQsIHNldHVwLCB1cGRhdGUsIGFkZEV2ZW50LCByZW1vdmVFdmVudCwgZGVzdHJveVxuICogLy8gdGVtcGxhdGUsIHNldHVwU2VsZWN0b3IsIHNldHVwRWxlbWVudCwgc2V0RXZlbnQsIHJlbmRlciwgY3VzdG9tRm4sIGNhbGxhYmxlXG4gKi9cbiIsIlxuZXRVSS5jb21wb25lbnRzID0ge1xuXHRBY2NvcmRpb24sXG5cdERpYWxvZyxcblx0TW9kYWwsXG5cdFNlbGVjdEJveCxcblx0U2tlbCxcblx0U3dpcGVyQ29tcCxcblx0VGFiLFxuXHRUb29sdGlwXG59XG4iLCIvLyBpbml0IGpzXG5mdW5jdGlvbiBpbml0VUkoKSB7XG4gIGNvbnN0IGNvbXBvbmVudExpc3QgPSBbXG4gICAge1xuICAgICAgc2VsZWN0b3I6IFwiLmNvbXBvbmVudC1tb2RhbFwiLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5Nb2RhbCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiBcIi5jb21wb25lbnQtYWNjb3JkaW9uXCIsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLkFjY29yZGlvbixcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiBcIi5jb21wb25lbnQtdG9vbHRpcFwiLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5Ub29sdGlwLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICdbZGF0YS1jb21wb25lbnQ9XCJ0YWJcIl0nLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5UYWIsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJ1tkYXRhLWNvbXBvbmVudD1cInNlbGVjdC1ib3hcIl0nLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5TZWxlY3RCb3gsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJ1tkYXRhLWNvbXBvbmVudD1cInN3aXBlclwiXScsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlN3aXBlckNvbXAsXG4gICAgfSxcbiAgXTtcblxuICBjb21wb25lbnRMaXN0LmZvckVhY2goKHsgc2VsZWN0b3IsIGZuIH0pID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhmbik7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIGlmIChlbC5kYXRhc2V0LmluaXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgZm4oKTtcbiAgICAgIGNvbXBvbmVudC5jb3JlLmluaXQoZWwsIHt9LCBzZWxlY3Rvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIGV0VUkuZGlhbG9nID0gZXRVSS5ob29rcy51c2VEaWFsb2coKTtcbn1cblxuZXRVSS5pbml0VUkgPSBpbml0VUk7XG5cbihmdW5jdGlvbiBhdXRvSW5pdCgpIHtcbiAgY29uc3QgJHNjcmlwdEJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWluaXRdXCIpO1xuICBpZiAoJHNjcmlwdEJsb2NrKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdFVJKCk7XG4gICAgfSk7XG4gIH1cbn0pKCk7XG4iXX0=
