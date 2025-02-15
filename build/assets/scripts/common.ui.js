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

  // 스크롤 제어 유틸리티
  function disableScroll() {
    const scrollStyle = {
      overflow: "hidden",
      // height: "100vh",
    };
    applyStyles(document.body, scrollStyle);
    applyStyles($html, scrollStyle);
  }

  // 스크롤 초기화 유틸리티
  function enableScroll() {
    const defaultStyle = {
      overflow: "",
      // height: "auto",
    };
    applyStyles(document.body, defaultStyle);
    applyStyles($html, defaultStyle);
  }

  // 스타일 적용 유틸리티
  function applyStyles(element, styles) {
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });
  }

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
    disableScroll();
  }

  function close() {
    setState({ state: "close" });
    enableScroll();
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
    actions,
    props,
    state,
    setState,
    setProps,
    setTarget,
    addEvent,
    removeEvent,
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
  let $target,
    $swiper,
    $swiperNavigation,
    $swiperPagination,
    $swiperAutoplay,
    $swiperSlideToButton;

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
      if (
        props &&
        utils.shallowCompare(props, _props) &&
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
      navigationEl = createHTMLElement(
        "swiper-navigation",
        $templateHTML.navigation(),
      );
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
      paginationEl = createHTMLElement(
        "swiper-pagination-wrap",
        $templateHTML.pagination(),
      );
      $target.querySelector(".swiper-wrapper").after(paginationEl);
      typeof pagination === "boolean" &&
        setProps({
          pagination: {
            el: ".swiper-pagination",
          },
        });
    }

    if (autoplay) {
      autoplayEl = createHTMLElement(
        "swiper-autoplay-wrap",
        $templateHTML.autoplay(),
      );
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwidXRpbHMvYXJyYXkuanMiLCJ1dGlscy9ib29sZWFuLmpzIiwidXRpbHMvZGF0ZS5qcyIsInV0aWxzL2RvbS5qcyIsInV0aWxzL21hdGguanMiLCJ1dGlscy9vYmplY3QuanMiLCJ1dGlscy9zdHJpbmcuanMiLCJ1dGlscy9pbmRleC5janMiLCJob29rcy91c2VDbGlja091dHNpZGUuanMiLCJob29rcy91c2VDb3JlLmpzIiwiaG9va3MvdXNlRGF0YXNldC5qcyIsImhvb2tzL3VzZURpYWxvZy5qcyIsImhvb2tzL3VzZURpYWxvZ1RtcGwuanMiLCJob29rcy91c2VFdmVudExpc3RlbmVyLmpzIiwiaG9va3MvdXNlR2V0Q2xpZW50UmVjdC5qcyIsImhvb2tzL3VzZUxheWVyLmpzIiwiaG9va3MvdXNlTXV0YXRpb25TdGF0ZS5qcyIsImhvb2tzL3VzZVNlbGVjdEJveFRtcGwuanMiLCJob29rcy91c2VTdGF0ZS5qcyIsImhvb2tzL3VzZVN3aXBlclRtcGwuanMiLCJob29rcy91c2VUcmFuc2l0aW9uLmpzIiwiaG9va3MvaW5kZXguY2pzIiwiY29tcG9uZW50cy9BY2NvcmRpb24uanMiLCJjb21wb25lbnRzL0RpYWxvZy5qcyIsImNvbXBvbmVudHMvTW9kYWwuanMiLCJjb21wb25lbnRzL1NlbGVjdGJveC5qcyIsImNvbXBvbmVudHMvU2tlbC5qcyIsImNvbXBvbmVudHMvU3dpcGVyLmpzIiwiY29tcG9uZW50cy9UYWIuanMiLCJjb21wb25lbnRzL1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL2luZGV4LmNqcyIsImluaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7OztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdlBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDelJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXNzZXRzL3NjcmlwdHMvY29tbW9uLnVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZXRVSSA9IHt9XG53aW5kb3cuZXRVSSA9IGV0VUlcbiIsIi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIGFuIGFycmF5XG4gKiBAcGFyYW0gdmFsdWUge2FueX1cbiAqIEByZXR1cm5zIHthcmcgaXMgYW55W119XG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxuIiwiLy8gYm9vbGVhbiDqtIDroKgg6riw64qlXG4iLCIvLyDrgqDsp5wg6rSA66CoIOq4sOuKpVxuIiwiLy8gZXgpIHN0cmluZyB0byBxdWVyeVNlbGVjdG9yIGNvbnZlcnQgbG9naWNcblxuLyoqXG4gKiDquLDriqUg7ISk66qFIOuTpOyWtOqwkFxuICovXG5cbi8qKlxuICogc2V0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIG9wdHNcbiAqL1xuZnVuY3Rpb24gc2V0UHJvcGVydHkocGFyZW50LCAuLi5vcHRzKSB7XG4gIGlmKG9wdHMubGVuZ3RoID09PSAyKXtcbiAgICBjb25zdCBbcHJvcGVydHksIHZhbHVlXSA9IG9wdHM7XG5cbiAgICBwYXJlbnQ/LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgdmFsdWUpO1xuICB9ZWxzZSBpZihvcHRzLmxlbmd0aCA9PT0gMyl7XG4gICAgY29uc3QgW3NlbGVjdG9yLCBwcm9wZXJ0eSwgdmFsdWVdID0gb3B0cztcblxuICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKT8uc2V0QXR0cmlidXRlKHByb3BlcnR5LCB2YWx1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBnZXQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0geyBTdHJpbmcgfSBzZWxlY3RvclxuICogQHBhcmFtIHsgU3RyaW5nIH0gcHJvcGVydHlcbiAqL1xuZnVuY3Rpb24gZ2V0UHJvcGVydHkocGFyZW50LCBzZWxlY3RvciwgcHJvcGVydHkpIHtcbiAgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5nZXRBdHRyaWJ1dGUocHJvcGVydHkpO1xufVxuXG4vKipcbiAqIHNldCBzdHlsZVxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIHsgU3RyaW5nIH0gc2VsZWN0b3JcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHByb3BlcnR5XG4gKiBAcGFyYW0geyBhbnkgfSB2YWx1ZVxuICovXG5mdW5jdGlvbiBzZXRTdHlsZShwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkge1xuICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5zdHlsZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIGdzYXDsnZggU3BsaXRUZXh066W8IO2ZnOyaqe2VmOyXrCDrrLjsnpDrpbwg67aE66as7ZWY7JesIOuniOyKpO2BrCDqsIDriqXtlZjqsowg7ZW07KSA64ukLlxuICogQHBhcmFtIHNlbGVjdG9yICB7c3RyaW5nfVxuICogQHBhcmFtIHR5cGUgIHsnbGluZXMnfCd3b3Jkcyd8J2NoYXJzJ31cbiAqIEByZXR1cm5zIFtIVE1MRWxlbWVudFtdLCBIVE1MRWxlbWVudFtdXVxuICovXG5mdW5jdGlvbiBzcGxpdFRleHRNYXNrKHNlbGVjdG9yLCB0eXBlID0gJ2xpbmVzJyl7XG4gIGZ1bmN0aW9uIHdyYXAoZWwsIHdyYXBwZXIpIHtcbiAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICBjb25zdCAkcXVvdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSxcbiAgICBteVNwbGl0VGV4dCA9IG5ldyBTcGxpdFRleHQoJHF1b3RlLCB7dHlwZX0pXG5cbiAgY29uc3QgJHNwbGl0dGVkID0gbXlTcGxpdFRleHRbdHlwZV07XG4gIGNvbnN0ICRsaW5lV3JhcCA9IFtdO1xuICAkc3BsaXR0ZWQuZm9yRWFjaCgoJGVsLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0ICRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAkZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgJGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgJGRpdi5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgd3JhcCgkZWwsICRkaXYpO1xuICAgICRsaW5lV3JhcC5wdXNoKCRkaXYpO1xuICB9KVxuXG4gIHJldHVybiBbJHNwbGl0dGVkLCAkbGluZVdyYXBdXG59XG4iLCIvLyDsl7DsgrAg6rSA66CoICjsnpDro4ztmJVOdW1iZXIgKyBudW1iZXIpXG5mdW5jdGlvbiBnZXRCbGVuZE9wYWNpdHkob3BhY2l0eSwgbGVuZ3RoKSB7XG4gIGlmKGxlbmd0aCA9PT0gMSl7XG4gICAgcmV0dXJuIG9wYWNpdHlcbiAgfVxuXG4gIHJldHVybiAxIC0gTWF0aC5wb3coMSAtIG9wYWNpdHksIDEvbGVuZ3RoKVxufVxuIiwiLy8gb2JqZWN0IOq0gOugqCDquLDriqVcblxuLyoqXG4gKiBjb21wYXJlIG9ialxuICogQHBhcmFtIHsgT2JqZWN0IH0gb2JqMVxuICogQHBhcmFtIHsgT2JqZWN0IH0gb2JqMlxuICogQHJldHVybnMgQm9vbGVhblxuICovXG5mdW5jdGlvbiBzaGFsbG93Q29tcGFyZShvYmoxLCBvYmoyKSB7XG4gIGNvbnN0IGtleXMgPSBbLi4uT2JqZWN0LmtleXMob2JqMSksIE9iamVjdC5rZXlzKG9iajIpXTtcblxuICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoxW2tleV0gPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iajJba2V5XSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgaWYgKCFldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKG9iajFba2V5XSwgb2JqMltrZXldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJvbGUgPSAhb2JqMltrZXldIHx8IHR5cGVvZiBvYmoxW2tleV0gPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgIGlmICghcm9sZSAmJiBvYmoxW2tleV0gIT09IG9iajJba2V5XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIiwiLyoqXG4gKiBSZXZlcnNlIGEgc3RyaW5nXG4gKiBAcGFyYW0gc3RyIHtzdHJpbmd9XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiByZXZlcnNlU3RyaW5nKHN0cikge1xuICByZXR1cm4gc3RyLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XG59XG5cbi8qKlxuICogR2V0IGEgcmFuZG9tIGlkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRSYW5kb21JZCgpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyKTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHByZWZpeFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0UmFuZG9tVUlJRChwcmVmaXggPSAndWknKSB7XG4gIHJldHVybiBgJHtwcmVmaXh9LSR7Z2V0UmFuZG9tSWQoKX1gO1xufVxuXG4vKipcbiAqIOyyq+q4gOyekOunjCDrjIDrrLjsnpDroZwg67OA7ZmYXG4gKiBAcGFyYW0gd29yZFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkKSB7XG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zbGljZSgxKVxufVxuXG4vKipcbiAqIOyyq+q4gOyekOunjCDshozrrLjsnpDroZwg67OA7ZmYXG4gKiBAcGFyYW0gd29yZFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdW5jYXBpdGFsaXplKHdvcmQpIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpXG59XG5cbmZ1bmN0aW9uIGFkZFByZWZpeENhbWVsU3RyaW5nKHN0ciwgcHJlZml4KXtcbiAgLy8gZGltbUNsaWNrID0+IHByb3BzRGltbUNsaWNrXG4gIHJldHVybiBwcmVmaXggKyBldFVJLnV0aWxzLmNhcGl0YWxpemUoc3RyKVxufVxuXG5mdW5jdGlvbiByZW1vdmVQcmVmaXhDYW1lbFN0cmluZyhzdHIsIHByZWZpeCl7XG4gIGNvbnN0IHJlZ0V4cCA9IG5ldyBSZWdFeHAoYF4ke3ByZWZpeH1gLCAnZycpXG4gIHJldHVybiBldFVJLnV0aWxzLnVuY2FwaXRhbGl6ZShzdHIucmVwbGFjZUFsbChyZWdFeHAsICcnKSlcblxufVxuXG4iLCJcbmV0VUkudXRpbHMgPSB7XG5cdGlzQXJyYXksXG5cdHNldFByb3BlcnR5LFxuXHRnZXRQcm9wZXJ0eSxcblx0c2V0U3R5bGUsXG5cdHNwbGl0VGV4dE1hc2ssXG5cdGdldEJsZW5kT3BhY2l0eSxcblx0c2hhbGxvd0NvbXBhcmUsXG5cdHJldmVyc2VTdHJpbmcsXG5cdGdldFJhbmRvbUlkLFxuXHRnZXRSYW5kb21VSUlELFxuXHRjYXBpdGFsaXplLFxuXHR1bmNhcGl0YWxpemUsXG5cdGFkZFByZWZpeENhbWVsU3RyaW5nLFxuXHRyZW1vdmVQcmVmaXhDYW1lbFN0cmluZ1xufVxuIiwiLyoqXG4gKiB0YXJnZXQp7J2YIOyZuOu2gOulvCDtgbTrpq3tlojsnYQg65WMIOy9nOuwsSDtlajsiJjrpbwg7Iuk7ZaJXG4gKiDsmIjsmbjsoIHsnLzroZwg7YG066at7J2EIO2XiOyaqe2VoCDsmpTshozrk6TsnZgg7ISg7YOd7J6Q66W8IO2PrO2VqO2VmOuKlCDrsLDsl7TsnYQg7Ji17IWY7Jy866GcIOuwm+ydhCDsiJgg7J6I7Iq164uI64ukLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0IC0g7YG066atIOydtOuypO2KuOydmCDsmbjrtoAg7YG066atIOqwkOyngOulvCDsiJjtlontlaAg64yA7IOBIERPTSDsmpTshozsnoXri4jri6QuKO2VhOyImClcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0g7Jm467aAIO2BtOumreydtCDqsJDsp4DrkJjsl4jsnYQg65WMIOyLpO2Wie2VoCDsvZzrsLEg7ZWo7IiY7J6F64uI64ukLijtlYTsiJgpXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGV4Y2VwdGlvbnMgLSDsmbjrtoAg7YG066atIOqwkOyngOyXkOyEnCDsmIjsmbgg7LKY66as7ZWgIOyalOyGjOuTpOydmCDshKDtg53snpDrpbwg7Y+s7ZWo7ZWY64qUIOuwsOyXtOyeheuLiOuLpC4o7Ji17IWYKVxuICovXG5cbi8vIGJsdXIg64+EIOyXvOuRkFxuZnVuY3Rpb24gdXNlQ2xpY2tPdXRzaWRlKHRhcmdldCwgY2FsbGJhY2ssIGV4Y2VwdGlvbnMgPSBbXSkge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgbGV0IGlzQ2xpY2tJbnNpZGVFeGNlcHRpb24gPSBleGNlcHRpb25zLnNvbWUoKHNlbGVjdG9yKSA9PiB7XG4gICAgICBjb25zdCBleGNlcHRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICByZXR1cm4gZXhjZXB0aW9uRWxlbWVudCAmJiBleGNlcHRpb25FbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXRhcmdldC5jb250YWlucyhldmVudC50YXJnZXQpICYmICFpc0NsaWNrSW5zaWRlRXhjZXB0aW9uKSB7XG4gICAgICBjYWxsYmFjayh0YXJnZXQpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIOu2gOuqqCDsmpTshozripQgcGFyZW50c1xuLy8g7ISg7YOdIOyalFxuIiwiZnVuY3Rpb24gdXNlQ29yZShcbiAgaW5pdGlhbFByb3BzID0ge30sXG4gIGluaXRpYWxWYWx1ZSA9IHt9LFxuICByZW5kZXIsXG4gIG9wdGlvbnMgPSB7XG4gICAgZGF0YXNldDogdHJ1ZVxufSkge1xuICBjb25zdCBhY3Rpb25zID0ge307XG4gIGxldCAkdGFyZ2V0O1xuICBjb25zdCBjbGVhbnVwcyA9IFtdO1xuICBjb25zdCBOT19CVUJCTElOR19FVkVOVFMgPSBbXG4gICAgJ2JsdXInLFxuICAgICdmb2N1cycsXG4gICAgJ2ZvY3VzaW4nLFxuICAgICdmb2N1c291dCcsXG4gICAgJ3BvaW50ZXJsZWF2ZSdcbiAgXTtcblxuICBjb25zdCBwcm9wcyA9IG5ldyBQcm94eShpbml0aWFsUHJvcHMsIHtcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcbiAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBzdGF0ZSA9IG5ldyBQcm94eShpbml0aWFsVmFsdWUsIHtcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcbiAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSk7XG4gICAgfSxcbiAgfSk7XG5cbiAgZnVuY3Rpb24gc2V0VGFyZ2V0KF8kdGFyZ2V0KSB7XG4gICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuXG4gICAgaWYob3B0aW9ucy5kYXRhc2V0KXtcbiAgICAgIGNvbnN0IHsgZ2V0UHJvcHNGcm9tRGF0YXNldCB9ID0gZXRVSS5ob29rcy51c2VEYXRhc2V0KCR0YXJnZXQpO1xuICAgICAgY29uc3QgZGF0YXNldFByb3BzID0gZ2V0UHJvcHNGcm9tRGF0YXNldCgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5kYXRhc2V0UHJvcHMgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0UHJvcHMobmV3UHJvcHMpIHtcbiAgICBPYmplY3Qua2V5cyhuZXdQcm9wcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBwcm9wc1trZXldID0gbmV3UHJvcHNba2V5XTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0YXRlKG5ld1N0YXRlKSB7XG4gICAgaWYoZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShzdGF0ZSwgbmV3U3RhdGUpKSByZXR1cm47XG5cbiAgICBPYmplY3Qua2V5cyhuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzdGF0ZVtrZXldID0gbmV3U3RhdGVba2V5XTtcbiAgICB9KTtcblxuICAgIGlmIChyZW5kZXIpIHtcbiAgICAgIHJlbmRlcigpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRhdGFzZXQpIHtcbiAgICAgIGNvbnN0IHsgc2V0VmFyc0Zyb21EYXRhc2V0IH0gPSBldFVJLmhvb2tzLnVzZURhdGFzZXQoJHRhcmdldCk7XG4gICAgICBzZXRWYXJzRnJvbURhdGFzZXQoc3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEV2ZW50KGV2ZW50VHlwZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgJGV2ZW50VGFyZ2V0ID0gc2VsZWN0b3IgPyAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogJHRhcmdldDtcblxuICAgIGlmIChOT19CVUJCTElOR19FVkVOVFMuaW5jbHVkZXMoZXZlbnRUeXBlKSkge1xuICAgICAgY29uc3QgY2xlYW51cCA9IGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcigkZXZlbnRUYXJnZXQsIGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuICAgICAgcmV0dXJuIGNsZWFudXBzLnB1c2goY2xlYW51cCk7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnRIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBsZXQgJGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xuXG4gICAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICAgICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCRldmVudFRhcmdldCkge1xuICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50SGFuZGxlcik7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+ICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50SGFuZGxlcik7XG4gICAgY2xlYW51cHMucHVzaChjbGVhbnVwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUV2ZW50KCkge1xuICAgIGNsZWFudXBzLmZvckVhY2goKGNsZWFudXApID0+IGNsZWFudXAoKSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNldFRhcmdldCxcbiAgICBhY3Rpb25zLFxuICAgIHN0YXRlLFxuICAgIHByb3BzLFxuICAgIHNldFN0YXRlLFxuICAgIHNldFByb3BzLFxuICAgIGFkZEV2ZW50LFxuICAgIHJlbW92ZUV2ZW50LFxuICB9O1xufVxuIiwiLyoqXG4gKiB1c2VEYXRhc2V0XG4gKiBAcGFyYW0gJHRhcmdldCB7SFRNTEVsZW1lbnR9XG4gKi9cbmZ1bmN0aW9uIHVzZURhdGFzZXQoJHRhcmdldCkge1xuICBsZXQgZGF0YXNldFByb3BzID0ge30sXG4gICAgZGF0YXNldFZhcnMgPSB7fTtcblxuICBmdW5jdGlvbiBnZXREYXRhc2V0QnlQcmVmaXgocHJlZml4KSB7XG4gICAgY29uc3QgZGF0YXNldCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKCR0YXJnZXQuZGF0YXNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSAkdGFyZ2V0LmRhdGFzZXRba2V5XTtcblxuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuaW5jbHVkZXMoJ3snKSl7XG4gICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFzZXRbZXRVSS51dGlscy5yZW1vdmVQcmVmaXhDYW1lbFN0cmluZyhrZXksIHByZWZpeCldID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldERhdGFzZXRFeGNlcHRQcmVmaXgocHJlZml4KSB7XG4gICAgY29uc3QgZGF0YXNldCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKCR0YXJnZXQuZGF0YXNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSAkdGFyZ2V0LmRhdGFzZXRba2V5XTtcblxuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBkYXRhc2V0W2V0VUkudXRpbHMucmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoa2V5LCBwcmVmaXgpXSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXREYXRhc2V0QnlQcmVmaXgoZGF0YSwgcHJlZml4KSB7XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZihwcmVmaXgpe1xuICAgICAgICAkdGFyZ2V0LmRhdGFzZXRbYCR7cHJlZml4fSR7ZXRVSS51dGlscy5jYXBpdGFsaXplKGtleSl9YF0gPSBkYXRhW2tleV07XG4gICAgICB9ZWxzZXtcbiAgICAgICAgJHRhcmdldC5kYXRhc2V0W2tleV0gPSBkYXRhW2tleV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQcm9wc0Zyb21EYXRhc2V0KCkge1xuICAgIGRhdGFzZXRQcm9wcyA9IGdldERhdGFzZXRCeVByZWZpeCgncHJvcHMnKTtcblxuICAgIHJldHVybiBkYXRhc2V0UHJvcHM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWYXJzRnJvbURhdGFzZXQoKSB7XG4gICAgZGF0YXNldFZhcnMgPSBnZXREYXRhc2V0RXhjZXB0UHJlZml4KCdwcm9wcycpO1xuXG4gICAgcmV0dXJuIGRhdGFzZXRWYXJzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0UHJvcHNGcm9tRGF0YXNldChwcm9wcykge1xuICAgIHNldERhdGFzZXRCeVByZWZpeChwcm9wcywgJ3Byb3BzJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRWYXJzRnJvbURhdGFzZXQodmFycykge1xuICAgIHNldERhdGFzZXRCeVByZWZpeCh2YXJzLCAnJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdHJpbmdUb09iamVjdChwcm9wcykge1xuICAgIC8vIGRhdGFzZXTsl5DshJwg6rCd7LK0IO2Yle2DnOyduCDsiqTtirjrp4HqsJIg7YOA7J6FIOqwneyytOuhnCDrsJTqv5TspIxcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcykge1xuICAgICAgaWYgKCEodHlwZW9mIHByb3BzW2tleV0gPT09ICdib29sZWFuJykgJiYgcHJvcHNba2V5XS5pbmNsdWRlcygneycpKSB7XG4gICAgICAgIHByb3BzW2tleV0gPSBKU09OLnBhcnNlKHByb3BzW2tleV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwcm9wcztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0UHJvcHNGcm9tRGF0YXNldCxcbiAgICBzZXRQcm9wc0Zyb21EYXRhc2V0LFxuICAgIGdldFZhcnNGcm9tRGF0YXNldCxcbiAgICBzZXRWYXJzRnJvbURhdGFzZXQsXG4gICAgc2V0U3RyaW5nVG9PYmplY3QsXG4gIH07XG59XG4iLCJmdW5jdGlvbiB1c2VEaWFsb2coKSB7XG4gIGNvbnN0IGFsZXJ0ID0gKC4uLm9wdHMpID0+IHtcbiAgICBjb25zdCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgZXRVSS5jb21wb25lbnRzLkRpYWxvZygpO1xuXG4gICAgaWYodHlwZW9mIG9wdHNbMF0gPT09ICdzdHJpbmcnKXtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnYWxlcnQnLCBtZXNzYWdlOiBvcHRzWzBdLCBjYWxsYmFjazogb3B0c1sxXSB9KTtcbiAgICB9ZWxzZSBpZih0eXBlb2Ygb3B0c1swXSA9PT0gJ29iamVjdCcpe1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdhbGVydCcsIC4uLm9wdHNbMF0gfSk7XG4gICAgfVxuXG4gICAgZGlhbG9nLm9wZW4oKTtcbiAgfTtcblxuICBjb25zdCBjb25maXJtID0gKC4uLm9wdHMpID0+IHtcbiAgICBjb25zdCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgZXRVSS5jb21wb25lbnRzLkRpYWxvZygpO1xuXG4gICAgaWYodHlwZW9mIG9wdHNbMF0gPT09ICdzdHJpbmcnKXtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnY29uZmlybScsIG1lc3NhZ2U6IG9wdHNbMF0sIHBvc2l0aXZlQ2FsbGJhY2s6IG9wdHNbMV0gfSk7XG4gICAgfWVsc2UgaWYodHlwZW9mIG9wdHNbMF0gPT09ICdvYmplY3QnKXtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnY29uZmlybScsIC4uLm9wdHNbMF0gfSk7XG4gICAgfVxuXG4gICAgZGlhbG9nLm9wZW4oKTtcbiAgfTtcblxuICBjb25zdCBwcmV2aWV3SW1hZ2UgPSAoLi4ub3B0cykgPT4ge1xuICAgIGNvbnN0ICRsYXllcldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XG5cblxuICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAncHJldmlld0ltYWdlJywgLi4ub3B0c1swXSB9KTtcblxuICAgIGRpYWxvZy5vcGVuKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFsZXJ0LFxuICAgIGNvbmZpcm0sXG4gICAgcHJldmlld0ltYWdlXG4gIH07XG59XG4iLCJmdW5jdGlvbiB1c2VEaWFsb2dUbXBsKCkge1xuICBjb25zdCAkdGVtcGxhdGVIVE1MID0gKHsgZGlhbG9nVHlwZSwgdHlwZSwgdGl0bGUsIG1lc3NhZ2UsIHBvc2l0aXZlVGV4dCwgbmVnYXRpdmVUZXh0IH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZGltbVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1mcmFtZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgICAgICAke3RpdGxlID8gYDxoMyBjbGFzcz1cImRpYWxvZy10aXRcIj4ke3RpdGxlfTwvaDM+YCA6ICcnfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgJHtkaWFsb2dUeXBlID09PSAnYWxlcnQnID8gYDxzcGFuIGNsYXNzPVwiJHt0eXBlfVwiPmljb248L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8cCBjbGFzcz1cImRpYWxvZy1pbmZvXCI+JHttZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpfTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdjb25maXJtJyA/IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBkaWFsb2ctbmVnYXRpdmVcIj4ke25lZ2F0aXZlVGV4dH08L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgICAke3Bvc2l0aXZlVGV4dCA/IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBkaWFsb2ctcG9zaXRpdmUgYnRuLXByaW1hcnlcIj4ke3Bvc2l0aXZlVGV4dH08L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGNvbnN0ICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwgPSAoe2RpYWxvZ1R5cGUsIGltYWdlcywgdGl0bGV9KSA9PiBgXG4gICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWRpbW1cIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZnJhbWVcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPlxuICAgICAgICAgICAgJHt0aXRsZSA/IGA8aDMgY2xhc3M9XCJkaWFsb2ctdGl0XCI+JHt0aXRsZX08L2gzPmAgOiAnJ31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtc3dpcGVyXCIgZGF0YS1jb21wb25lbnQ9XCJzd2lwZXJcIj5cbiAgICAgICAgICAgICAgPCEtLSBBZGRpdGlvbmFsIHJlcXVpcmVkIHdyYXBwZXIgLS0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICR7aW1hZ2VzLm1hcCgoaW1hZ2UpID0+IChgXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLXNsaWRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtpbWFnZS5zcmN9XCIgYWx0PVwiJHtpbWFnZS5hbHR9XCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGApKS5qb2luKCcnKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgXG5cbiAgICByZXR1cm4ge1xuICAgICAgJHRlbXBsYXRlSFRNTCxcbiAgICAgICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUxcbiAgICB9XG59XG4iLCIvKipcbiAqIHVzZUV2ZW50TGlzdGVuZXJcbiAqIEBwYXJhbSB0YXJnZXQgIHtIVE1MRWxlbWVudH1cbiAqIEBwYXJhbSB0eXBlICB7c3RyaW5nfVxuICogQHBhcmFtIGxpc3RlbmVyICB7ZnVuY3Rpb259XG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fVxuICogQHJldHVybnMge2Z1bmN0aW9uKCk6ICp9XG4gKi9cbmZ1bmN0aW9uIHVzZUV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyA9IHt9KXtcbiAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuICByZXR1cm4gKCkgPT4gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xufVxuIiwiLyoqXG4gKiBnZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAqIEBwYXJhbSB7IEVsZW1lbnQgfSBwYXJlbnRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiB1c2VHZXRDbGllbnRSZWN0KHBhcmVudCwgc2VsZWN0b3IpIHtcbiAgY29uc3QgcmVjdCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKT8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGlmICghcmVjdCkgcmV0dXJuIHt9O1xuICBlbHNlXG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICBib3R0b206IHJlY3QuYm90dG9tLFxuICAgICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgICAgcmlnaHQ6IHJlY3QucmlnaHQsXG4gICAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZUxheWVyKHR5cGUgPSAnbW9kYWwnKXtcbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZUxheWVyKCl7XG4gICAgY29uc3QgJGxheWVyQ29tcG9uZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKS5jaGlsZHJlbikuZmlsdGVyKCgkZWwpID0+IHtcbiAgICAgIGNvbnN0IGlzTW9kYWxDb21wb25lbnQgPSAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21wb25lbnQtbW9kYWwnKVxuICAgICAgY29uc3QgaXNEaWFsb2dDb21wb25lbnQgPSAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21wb25lbnQtZGlhbG9nJylcblxuICAgICAgcmV0dXJuIGlzTW9kYWxDb21wb25lbnQgfHwgaXNEaWFsb2dDb21wb25lbnRcbiAgICB9KVxuXG4gICAgcmV0dXJuICRsYXllckNvbXBvbmVudHMuZmlsdGVyKCgkZWwpID0+IHtcbiAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoJGVsKTtcbiAgICAgIHJldHVybiBzdHlsZS5kaXNwbGF5ICE9PSAnbm9uZSdcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VG9wRGVwdGgoKXtcbiAgICBjb25zdCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cyA9IGdldFZpc2libGVMYXllcigpXG4gICAgcmV0dXJuIDEwMCArICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmxlbmd0aFxuICB9XG5cbiAgZnVuY3Rpb24gc2V0TGF5ZXJPcGFjaXR5KGRlZmF1bHRPcGFjaXR5ID0gMC41KXtcbiAgICBjb25zdCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cyA9IGdldFZpc2libGVMYXllcigpXG4gICAgJHZpc2libGVMYXllckNvbXBvbmVudHMuZm9yRWFjaCgoJGVsLCBpbmRleCkgPT4ge1xuXG4gICAgICBjb25zdCBvcGFjaXR5ID0gZXRVSS51dGlscy5nZXRCbGVuZE9wYWNpdHkoZGVmYXVsdE9wYWNpdHksICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmxlbmd0aClcblxuICAgICAgaWYoJGVsLnF1ZXJ5U2VsZWN0b3IoYC5tb2RhbC1kaW1tYCkpe1xuICAgICAgICAkZWwucXVlcnlTZWxlY3RvcihgLm1vZGFsLWRpbW1gKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgwLCAwLCAwLCAke29wYWNpdHl9KWBcbiAgICAgIH1cblxuICAgICAgaWYoJGVsLnF1ZXJ5U2VsZWN0b3IoYC5kaWFsb2ctZGltbWApKXtcbiAgICAgICAgJGVsLnF1ZXJ5U2VsZWN0b3IoYC5kaWFsb2ctZGltbWApLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2JhKDAsIDAsIDAsICR7b3BhY2l0eX0pYFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldFZpc2libGVMYXllcixcbiAgICBnZXRUb3BEZXB0aCxcbiAgICBzZXRMYXllck9wYWNpdHlcbiAgfVxufVxuIiwiZnVuY3Rpb24gdXNlTXV0YXRpb25TdGF0ZSgpe1xuICBsZXQgJHRhcmdldCwgJHJlZiA9IHtcbiAgICAkc3RhdGU6IHt9XG4gIH0sIG11dGF0aW9uT2JzZXJ2ZXIsIHJlbmRlcjtcblxuICBmdW5jdGlvbiBpbml0TXV0YXRpb25TdGF0ZShfJHRhcmdldCwgX3JlbmRlcil7XG4gICAgJHRhcmdldCA9IF8kdGFyZ2V0XG4gICAgcmVuZGVyID0gX3JlbmRlcjtcblxuICAgIHNldE11dGF0aW9uT2JzZXJ2ZXIoKVxuICAgIHNldFN0YXRlQnlEYXRhc2V0KClcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0YXRlQnlEYXRhc2V0KCl7XG4gICAgY29uc3QgZmlsdGVyZWREYXRhc2V0ID0ge307XG4gICAgY29uc3QgZGF0YXNldCA9ICR0YXJnZXQuZGF0YXNldDtcblxuICAgIE9iamVjdC5rZXlzKGRhdGFzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYoa2V5LnN0YXJ0c1dpdGgoJ3ZhcnMnKSl7XG4gICAgICAgIGZpbHRlcmVkRGF0YXNldFtrZXkucmVwbGFjZSgndmFycycsICcnKS50b0xvd2VyQ2FzZSgpXSA9IGRhdGFzZXRba2V5XTtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgc2V0U3RhdGUoZmlsdGVyZWREYXRhc2V0KVxuICAgIHJlbmRlcigpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0TXV0YXRpb25PYnNlcnZlcigpe1xuICAgIGNvbnN0IGNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiBmYWxzZSwgc3VidHJlZTogZmFsc2UgfTtcblxuICAgIGNvbnN0IGNhbGxiYWNrID0gKG11dGF0aW9uTGlzdCwgb2JzZXJ2ZXIpID0+IHtcbiAgICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25MaXN0KSB7XG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImF0dHJpYnV0ZXNcIlxuICAgICAgICAgICYmIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgIT09ICdzdHlsZSdcbiAgICAgICAgICAmJiBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnXG4gICAgICAgICkge1xuICAgICAgICAgIHNldFN0YXRlQnlEYXRhc2V0KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZSgkdGFyZ2V0LCBjb25maWcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGUobmV3U3RhdGUpe1xuICAgICRyZWYuJHN0YXRlID0geyAuLi4kcmVmLiRzdGF0ZSwgLi4ubmV3U3RhdGUgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldERhdGFTdGF0ZShuZXdTdGF0ZSkge1xuICAgIGNvbnN0ICRuZXdTdGF0ZSA9IHsgLi4uJHJlZi4kc3RhdGUsIC4uLm5ld1N0YXRlIH07XG5cbiAgICBPYmplY3Qua2V5cygkbmV3U3RhdGUpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgJHRhcmdldC5kYXRhc2V0W2B2YXJzJHtldFVJLnV0aWxzLmNhcGl0YWxpemUoa2V5KX1gXSA9ICRuZXdTdGF0ZVtrZXldO1xuICAgIH0pXG4gIH1cblxuICByZXR1cm4ge1xuICAgICRyZWYsXG4gICAgc2V0U3RhdGUsXG4gICAgc2V0RGF0YVN0YXRlLFxuICAgIGluaXRNdXRhdGlvblN0YXRlXG4gIH1cbn1cbiIsImZ1bmN0aW9uIHVzZVNlbGVjdEJveFRlbXAoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUN1c3RvbUhUTUwgPSB7XG4gICAgbGFiZWwodGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBpZD1cImNvbWJvMS1sYWJlbFwiIGNsYXNzPVwiY29tYm8tbGFiZWxcIj4ke3RleHR9PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgc2VsZWN0QnRuKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImNvbWJvMVwiIGNsYXNzPVwic2VsZWN0LWJveFwiIHJvbGU9XCJjb21ib2JveFwiIGFyaWEtY29udHJvbHM9XCJsaXN0Ym94MVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtbGFiZWxsZWRieT1cImNvbWJvMS1sYWJlbFwiIGFyaWEtYWN0aXZlZGVzY2VuZGFudD1cIlwiPlxuICAgICAgICA8c3BhbiBzdHlsZT1cInBvaW50ZXItZXZlbnRzOiBub25lO1wiPiR7dGV4dH08L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtc1dyYXAoaXRlbXNIVE1MKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8dWwgaWQ9XCJsaXN0Ym94MVwiIGNsYXNzPVwic2VsZWN0LW9wdGlvbnNcIiByb2xlPVwibGlzdGJveFwiIGFyaWEtbGFiZWxsZWRieT1cImNvbWJvMS1sYWJlbFwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICAke2l0ZW1zSFRNTH1cbiAgICAgICAgPC91bD5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtcyhpdGVtLCBzZWxlY3RlZCA9IGZhbHNlKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8bGkgcm9sZT1cIm9wdGlvblwiIGNsYXNzPVwib3B0aW9uXCIgYXJpYS1zZWxlY3RlZD1cIiR7c2VsZWN0ZWR9XCIgZGF0YS12YWx1ZT1cIiR7aXRlbS52YWx1ZX1cIj5cbiAgICAgICAgICAke2l0ZW0udGV4dH1cbiAgICAgICAgPC9saT5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICBjb25zdCAkdGVtcGxhdGVCYXNpY0hUTUwgPSB7XG4gICAgbGFiZWwodGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBpZD1cImNvbWJvMS1sYWJlbFwiIGNsYXNzPVwiY29tYm8tbGFiZWxcIj4ke3RleHR9PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgc2VsZWN0QnRuKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIiBzZWxlY3RlZCBkaXNhYmxlZCBoaWRkZW4+JHt0ZXh0fTwvb3B0aW9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9XCJzZWxlY3QtbGlzdFwiIHJlcXVpcmVkPlxuICAgICAgICAgICR7aXRlbXNIVE1MfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtcyhpdGVtLCBzZWxlY3RlZCA9IGZhbHNlKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPiR7aXRlbS50ZXh0fTwvb3B0aW9uPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlQ3VzdG9tSFRNTCxcbiAgICAkdGVtcGxhdGVCYXNpY0hUTUwsXG4gIH07XG59XG4iLCJmdW5jdGlvbiB1c2VTdGF0ZShpbml0aWFsVmFsdWUgPSB7fSwgY2FsbGJhY2spIHtcbiAgY29uc3Qgc3RhdGUgPSBuZXcgUHJveHkoaW5pdGlhbFZhbHVlLCB7XG4gICAgc2V0OiAodGFyZ2V0LCBrZXksIHZhbHVlKSA9PiB7XG4gICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHNldFN0YXRlID0gKG5ld1N0YXRlKSA9PiB7XG4gICAgT2JqZWN0LmtleXMobmV3U3RhdGUpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgc3RhdGVba2V5XSA9IG5ld1N0YXRlW2tleV07XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBbc3RhdGUsIHNldFN0YXRlXTtcbn1cbiIsImZ1bmN0aW9uIHVzZVN3aXBlclRtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSB7XG4gICAgbmF2aWdhdGlvbigpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWJ1dHRvbi1wcmV2XCI+7J207KCEPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWJ1dHRvbi1uZXh0XCI+64uk7J2MPC9idXR0b24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgcGFnaW5hdGlvbigpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItcGFnaW5hdGlvblwiPjwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIGF1dG9wbGF5KCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWF1dG9wbGF5IHBsYXlcIj48L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUhUTUwsXG4gIH07XG59XG4iLCIvKipcbiAqIHRlbXAgdGltZWxpbmVcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHVzZVRyYW5zaXRpb24oKSB7XG4gIC8vIHNlbGVjdFxuICBjb25zdCB1c2VTZWxlY3RTaG93ID0gKHRhcmdldCwgdHlwZSwgb3B0aW9uKSA9PiB7XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcblxuICAgIGNvbnN0IHRpbWVsaW5lID0gZ3NhcC50aW1lbGluZSh7IHBhdXNlZDogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IG9wdGlvbkxpc3QgPSB7XG4gICAgICBmYXN0OiB7IGR1cmF0aW9uOiAwLjEgfSxcbiAgICAgIG5vcm1hbDogeyBkdXJhdGlvbjogMC4zIH0sXG4gICAgICBzbG93OiB7IGR1cmF0aW9uOiAwLjcgfSxcbiAgICB9O1xuICAgIGxldCBnc2FwT3B0aW9uID0geyAuLi5vcHRpb25MaXN0W3R5cGVdLCAuLi5vcHRpb24gfTtcblxuICAgIHRpbWVsaW5lLnRvKHRhcmdldCwge1xuICAgICAgYWxwaGE6IDAsXG4gICAgICBlYXNlOiBcImxpbmVhclwiLFxuICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIH0sXG4gICAgICAuLi5nc2FwT3B0aW9uLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWVsaW5lRWw6IHRpbWVsaW5lLl9yZWNlbnQudmFycyxcbiAgICAgIHRpbWVsaW5lOiAoc3RhdGUpID0+IHtcbiAgICAgICAgc3RhdGUgPyAoKHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiKSwgdGltZWxpbmUucmV2ZXJzZSgpKSA6IHRpbWVsaW5lLnBsYXkoKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHVzZVNlbGVjdFNob3csXG4gIH07XG59XG4iLCJcbmV0VUkuaG9va3MgPSB7XG5cdHVzZUNsaWNrT3V0c2lkZSxcblx0dXNlQ29yZSxcblx0dXNlRGF0YXNldCxcblx0dXNlRGlhbG9nLFxuXHR1c2VEaWFsb2dUbXBsLFxuXHR1c2VFdmVudExpc3RlbmVyLFxuXHR1c2VHZXRDbGllbnRSZWN0LFxuXHR1c2VMYXllcixcblx0dXNlTXV0YXRpb25TdGF0ZSxcblx0dXNlU2VsZWN0Qm94VGVtcCxcblx0dXNlU3RhdGUsXG5cdHVzZVN3aXBlclRtcGwsXG5cdHVzZVRyYW5zaXRpb25cbn1cbiIsIi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gUHJvcHNDb25maWdcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZGlzYWJsZWQgLSDsmpTshozqsIAg67mE7Zmc7ISx7ZmUIOyDge2DnOyduOyngOulvCDrgpjtg4Drg4Xri4jri6QuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9uY2UgLSDsnbTrsqTtirjrgpgg7JWh7IWY7J2EIO2VnCDrsojrp4wg7Iuk7ZaJ7ZWg7KeAIOyXrOu2gOulvCDqsrDsoJXtlanri4jri6QuXG4gKiBAcHJvcGVydHkge2ZhbHNlIHwgbnVtYmVyfSBkdXJhdGlvbiAtIOyVoOuLiOuplOydtOyFmCDrmJDripQg7J2067Kk7Yq4IOyngOyGjSDsi5zqsITsnYQg67CA66as7LSIIOuLqOychOuhnCDshKTsoJXtlanri4jri6QuICdmYWxzZSfsnbwg6rK97JqwIOyngOyGjSDsi5zqsITsnYQg66y07Iuc7ZWp64uI64ukLlxuICogQHByb3BlcnR5IHtPYmplY3R9IG9yaWdpbiAtIOybkOygkCDrmJDripQg7Iuc7J6RIOyngOygkOydhCDrgpjtg4DrgrTripQg6rCd7LK07J6F64uI64ukLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gU3RhdGVDb25maWdcbiAqIEBwcm9wZXJ0eSB7J2Nsb3NlJyB8ICdvcGVuJ30gc3RhdGUgLSDslYTsvZTrlJTslrjsnZgg7IOB7YOc6rCSLiBjbG9zZSwgb3BlbiDrkZgg7KSR7JeQIO2VmOuCmOyeheuLiOuLpC5cbiAqL1xuXG4vKiogQHR5cGUge1Byb3BzQ29uZmlnfSAqL1xuLyoqIEB0eXBlIHtTdGF0ZUNvbmZpZ30gKi9cblxuZnVuY3Rpb24gQWNjb3JkaW9uKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICAgIGNvbGxhcHNpYmxlOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjoge1xuICAgICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgICBlYXNpbmc6IFwicG93ZXI0Lm91dFwiLFxuICAgICAgfSxcbiAgICAgIHR5cGU6IFwibXVsdGlwbGVcIixcbiAgICB9LFxuICAgIHt9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyBjb25zdGFudFxuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSBcImFjY29yZGlvblwiO1xuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCBhY2NvcmRpb25Ub2dnbGVCdG4sIGFjY29yZGlvbkl0ZW07XG4gIGxldCAkdGFyZ2V0LCAkYWNjb3JkaW9uQ29udGVudHMsICRhY2NvcmRpb25JdGVtO1xuXG4gIHtcbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCR0YXJnZXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgc2V0dXBTZWxlY3RvcigpO1xuICAgICAgc2V0dXBFbGVtZW50KCk7XG4gICAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIHNldFN0YXRlKHsgc2V0dGluZzogXCJjdXN0b21cIiB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIGFjY29yZGlvblRvZ2dsZUJ0biA9IFwiLmFjY29yZGlvbi10aXRcIjtcbiAgICBhY2NvcmRpb25JdGVtID0gXCIuYWNjb3JkaW9uLWl0ZW1cIjtcblxuICAgIC8vIGVsZW1lbnRcbiAgICAkYWNjb3JkaW9uSXRlbSA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihhY2NvcmRpb25JdGVtKTtcbiAgICAkYWNjb3JkaW9uQ29udGVudHMgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIuYWNjb3JkaW9uLWNvbnRlbnRcIik7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICBjb25zdCBpZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBmYWxzZSk7XG4gICAgJGFjY29yZGlvbkNvbnRlbnRzLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIHRydWUpO1xuICAgICRhY2NvcmRpb25Db250ZW50cy5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwicmVnaW9uXCIpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbGxlZGJ5XCIsIGlkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBjb25zdCBpc0N1c3RvbSA9IHByb3BzLnNldHRpbmcgPT09IFwiY3VzdG9tXCI7XG4gICAgY29uc3QgeyBkdXJhdGlvbiwgZWFzZWluZyB9ID0gcHJvcHMuYW5pbWF0aW9uO1xuXG4gICAgYWN0aW9ucy5vcGVuID0gKHRhcmdldCA9ICRhY2NvcmRpb25JdGVtKSA9PiB7XG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCB0cnVlKTtcbiAgICAgIGlmICghaXNDdXN0b20pIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKHRhcmdldCwgeyBkdXJhdGlvbjogZHVyYXRpb24sIGVhc2U6IGVhc2VpbmcsIHBhZGRpbmc6IFwiM3JlbVwiIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKHRhcmdldCA9ICRhY2NvcmRpb25JdGVtKSA9PiB7XG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBmYWxzZSk7XG4gICAgICBpZiAoIWlzQ3VzdG9tKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdzYXAudGltZWxpbmUoKS50byh0YXJnZXQsIHsgZHVyYXRpb246IGR1cmF0aW9uLCBwYWRkaW5nOiBcIjAgM3JlbVwiIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBhY3Rpb25zLmFycm93VXAgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImtleXVwIOy9nOuwsVwiKTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5hcnJvd0Rvd24gPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImtleXVwIOy9nOuwsVwiKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgY29uc3QgeyB0eXBlIH0gPSBwcm9wcztcbiAgICBpZiAodHlwZSA9PT0gXCJzaW5nbGVcIikge1xuICAgICAgYWRkRXZlbnQoXCJjbGlja1wiLCBhY2NvcmRpb25Ub2dnbGVCdG4sICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgcGFyZW50RWxlbWVudCB9ID0gdGFyZ2V0O1xuICAgICAgICBzaW5nbGVUb2dnbGVBY2NvcmRpb24ocGFyZW50RWxlbWVudCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkRXZlbnQoXCJjbGlja1wiLCBhY2NvcmRpb25Ub2dnbGVCdG4sICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICAgIHRvZ2dsZUFjY29yZGlvbih0YXJnZXQucGFyZW50RWxlbWVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGVBY2NvcmRpb24oZWxlKSB7XG4gICAgY29uc29sZS5sb2coZWxlKTtcbiAgICBjb25zdCBpc09wZW4gPSBzdGF0ZS5zdGF0ZSA9PT0gXCJvcGVuXCI7XG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgYWN0aW9ucy5jbG9zZShlbGUpO1xuICAgICAgY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9ucy5vcGVuKGVsZSk7XG4gICAgICBvcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2luZ2xlVG9nZ2xlQWNjb3JkaW9uKHRhcmdldCkge1xuICAgIGNvbnN0ICRjbGlja2VkSXRlbSA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xuICAgIGNvbnN0ICRhbGxUaXRsZXMgPSAkY2xpY2tlZEl0ZW0ucXVlcnlTZWxlY3RvckFsbChhY2NvcmRpb25Ub2dnbGVCdG4pO1xuICAgIGNvbnN0ICRhbGxJdGVtcyA9IEFycmF5LmZyb20oJGFsbFRpdGxlcykubWFwKCh0aXRsZSkgPT4gdGl0bGUucGFyZW50RWxlbWVudCk7XG5cbiAgICAkYWxsSXRlbXMuZm9yRWFjaCgoJGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0ICR0aXRsZSA9ICRpdGVtLnF1ZXJ5U2VsZWN0b3IoYWNjb3JkaW9uVG9nZ2xlQnRuKTtcbiAgICAgIGNvbnN0ICRjb250ZW50ID0gJHRpdGxlLm5leHRFbGVtZW50U2libGluZztcbiAgICAgIGlmICgkaXRlbSA9PT0gdGFyZ2V0KSB7XG4gICAgICAgIGlmICgkY29udGVudC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAkY29udGVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICR0aXRsZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAkaXRlbS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbiAgICAgICAgICBvcGVuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICR0aXRsZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICAkdGl0bGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICAkaXRlbS5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc1Nob3cgPSBzdGF0ZS5zdGF0ZSA9PT0gXCJvcGVuXCI7XG4gICAgLy8gZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBhY2NvcmRpb25JdGVtLCBcImFyaWEtZXhwYW5kZWRcIiwgaXNTaG93KTtcbiAgICBpc1Nob3cgPyBvcGVuKCkgOiBjbG9zZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcIm9wZW5cIiB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6IFwiY2xvc2VcIiB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogIE1vZGFsXG4gKi9cbmZ1bmN0aW9uIERpYWxvZygpIHtcbiAgY29uc3Qge1xuICAgIGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudFxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKHtcbiAgICAgIC8vIHByb3BzXG4gICAgICBkaW1tQ2xpY2s6IHRydWUsXG4gICAgICBlc2M6IHRydWUsXG4gICAgICB0aXRsZTogbnVsbCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgdHlwZTogJ2FsZXJ0JyxcbiAgICAgIHBvc2l0aXZlVGV4dDogJ+2ZleyduCcsXG4gICAgICBuZWdhdGl2ZVRleHQ6ICfst6jshownLFxuICAgIH0sIHtcbiAgICAgIHN0YXRlOiAnY2xvc2UnLFxuICAgICAgdHJpZ2dlcjogbnVsbFxuICAgIH0sIHJlbmRlciwge1xuICAgICAgZGF0YXNldDogZmFsc2UsXG4gICAgfSxcbiAgKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBESU1NX09QQUNJVFkgPSAwLjY7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdkaWFsb2cnO1xuICBsZXQgY29tcG9uZW50ID0ge307XG4gIGxldCBtb2RhbERpbW1TZWxlY3RvcixcbiAgICBtb2RhbENsb3NlQnRuU2VsZWN0b3IsXG4gICAgbW9kYWxCdG5Qb3NpdGl2ZSxcbiAgICBtb2RhbEJ0bk5lZ2F0aXZlO1xuICBsZXQgJHRhcmdldCxcbiAgICAkbW9kYWwsXG4gICAgJG1vZGFsVGl0bGUsICRtb2RhbENvbnRhaW5lciwgJG1vZGFsRGltbSxcbiAgICAkbW9kYWxCdG5Qb3NpdGl2ZSwgJG1vZGFsQnRuTmVnYXRpdmUsXG4gICAgZm9jdXNUcmFwSW5zdGFuY2UsXG4gICAgY2FsbGJhY2s7XG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghJHRhcmdldCkge1xuICAgICAgICB0aHJvdyBFcnJvcigndGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuJyk7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAvLyAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIGZvY3VzIHRyYXBcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlID0gZm9jdXNUcmFwLmNyZWF0ZUZvY3VzVHJhcCgkdGFyZ2V0LCB7XG4gICAgICAgIGVzY2FwZURlYWN0aXZhdGVzOiBwcm9wcy5lc2MsXG4gICAgICAgIG9uQWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSxcbiAgICAgICAgb25EZWFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICAvLyBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB7ICR0ZW1wbGF0ZUhUTUwsICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwgfSA9IGV0VUkuaG9va3MudXNlRGlhbG9nVG1wbCgpXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuXG4gICAgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyB8fCBwcm9wcy5kaWFsb2dUeXBlID09PSAnY29uZmlybScpe1xuICAgICAgdGVtcGxhdGUuY2xhc3NMaXN0LmFkZCgnY29tcG9uZW50LWRpYWxvZycpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gJHRlbXBsYXRlSFRNTChwcm9wcyk7XG4gICAgfWVsc2UgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3ByZXZpZXdJbWFnZScpe1xuICAgICAgdGVtcGxhdGUuY2xhc3NMaXN0LmFkZCgnY29tcG9uZW50LWRpYWxvZycpO1xuICAgICAgdGVtcGxhdGUuY2xhc3NMaXN0LmFkZCgnZGlhbG9nLXByZXZpZXctaW1hZ2UnKTtcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwocHJvcHMpO1xuICAgIH1cblxuICAgICRtb2RhbCA9IHRlbXBsYXRlO1xuICAgICR0YXJnZXQuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIHNlbGVjdG9yXG4gICAgbW9kYWxDbG9zZUJ0blNlbGVjdG9yID0gJy5kaWFsb2ctY2xvc2UnO1xuICAgIG1vZGFsRGltbVNlbGVjdG9yID0gJy5kaWFsb2ctZGltbSc7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJG1vZGFsVGl0bGUgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy10aXQnKTtcbiAgICAkbW9kYWxEaW1tID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IobW9kYWxEaW1tU2VsZWN0b3IpO1xuICAgICRtb2RhbENvbnRhaW5lciA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWNvbnRhaW5lcicpO1xuXG4gICAgbW9kYWxCdG5Qb3NpdGl2ZSA9ICcuZGlhbG9nLXBvc2l0aXZlJztcbiAgICBtb2RhbEJ0bk5lZ2F0aXZlID0gJy5kaWFsb2ctbmVnYXRpdmUnO1xuICAgICRtb2RhbEJ0blBvc2l0aXZlID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctcG9zaXRpdmUnKTtcbiAgICAkbW9kYWxCdG5OZWdhdGl2ZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLW5lZ2F0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKTtcbiAgICAvLyAvLyBhMTF5XG5cbiAgICBpZihwcm9wcy5kaWFsb2dUeXBlID09PSAnYWxlcnQnIHx8IHByb3BzLmRpYWxvZ1R5cGUgPT09ICdjb25maXJtJyl7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3JvbGUnLCAnYWxlcnRkaWFsb2cnKTtcbiAgICB9ZWxzZSBpZihwcm9wcy5kaWFsb2dUeXBlID09PSAncHJldmlld0ltYWdlJyl7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3JvbGUnLCAnZGlhbG9nJyk7XG5cbiAgICAgIGNvbnN0ICRzd2lwZXIgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmNvbXBvbmVudC1zd2lwZXInKVxuICAgICAgY29uc3Qgc3dpcGVyID0gbmV3IGV0VUkuY29tcG9uZW50cy5Td2lwZXJDb21wKCk7XG4gICAgICBzd2lwZXIuY29yZS5pbml0KCRzd2lwZXIsIHtcbiAgICAgICAgbmF2aWdhdGlvbjogdHJ1ZSxcbiAgICAgICAgcGFnaW5hdGlvbjogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2FyaWEtbW9kYWwnLCAndHJ1ZScpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAnaWQnLCBpZCk7XG4gICAgaWYgKCRtb2RhbFRpdGxlKSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbFRpdGxlLCAnaWQnLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2FyaWEtbGFiZWxsZWRieScsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAndGFiaW5kZXgnLCAnLTEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBjb25zdCB7IGdldFRvcERlcHRoLCBzZXRMYXllck9wYWNpdHkgfSA9IGV0VUkuaG9va3MudXNlTGF5ZXIoJ2RpYWxvZycpO1xuXG4gICAgYWN0aW9ucy5mb2N1c0FjdGl2YXRlID0gKCkgPT4ge1xuICAgIH1cblxuICAgIGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlID0gKCkgPT4ge1xuICAgICAgaWYoIXN0YXRlLnRyaWdnZXIpe1xuICAgICAgICBjYWxsYmFjayA9IHByb3BzLm5lZ2F0aXZlQ2FsbGJhY2tcbiAgICAgIH1cbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCB6SW5kZXggPSBnZXRUb3BEZXB0aCgpO1xuXG4gICAgICAkbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAkbW9kYWwuc3R5bGUuekluZGV4ID0gekluZGV4XG5cbiAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsRGltbSwgeyBkdXJhdGlvbjogMCwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMCB9KS50bygkbW9kYWxEaW1tLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgfSk7XG5cbiAgICAgIGdzYXBcbiAgICAgICAgLnRpbWVsaW5lKClcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICBzY2FsZTogMC45NSxcbiAgICAgICAgICB5UGVyY2VudDogMixcbiAgICAgICAgfSlcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwgeyBkdXJhdGlvbjogMC4xNSwgb3BhY2l0eTogMSwgc2NhbGU6IDEsIHlQZXJjZW50OiAwLCBlYXNlOiAnUG93ZXIyLmVhc2VPdXQnIH0pO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge1xuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHtcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsRGltbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIHNjYWxlOiAwLjk1LFxuICAgICAgICB5UGVyY2VudDogMixcbiAgICAgICAgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyxcbiAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAkbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAkbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAkbW9kYWwuc3R5bGUuekluZGV4ID0gbnVsbFxuXG4gICAgICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgICAgICR0YXJnZXQucmVtb3ZlQ2hpbGQoJG1vZGFsKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbENsb3NlQnRuU2VsZWN0b3IsIGNsb3NlKTtcblxuICAgIGlmIChwcm9wcy5kaW1tQ2xpY2spIHtcbiAgICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsRGltbVNlbGVjdG9yLCBjbG9zZSk7XG4gICAgfVxuXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxCdG5Qb3NpdGl2ZSwgKCkgPT4ge1xuICAgICAgaWYgKHByb3BzLmNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2s7XG4gICAgICB9IGVsc2UgaWYgKHByb3BzLnBvc2l0aXZlQ2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5wb3NpdGl2ZUNhbGxiYWNrO1xuICAgICAgfVxuXG4gICAgICBjbG9zZSgnYnRuUG9zaXRpdmUnKTtcbiAgICB9KTtcbiAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbEJ0bk5lZ2F0aXZlLCAoKSA9PiB7XG4gICAgICBjYWxsYmFjayA9IHByb3BzLm5lZ2F0aXZlQ2FsbGJhY2s7XG5cbiAgICAgIGNsb3NlKCdidG5OZWdhdGl2ZScpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzT3BlbmVkID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcblxuICAgIGlmIChpc09wZW5lZCkge1xuICAgICAgYWN0aW9ucy5vcGVuKCk7XG5cbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmFjdGl2YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmRlYWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdvcGVuJyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKHRyaWdnZXIpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnLCB0cmlnZ2VyIH0pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG5cbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiAgTW9kYWxcbiAqL1xuZnVuY3Rpb24gTW9kYWwoKSB7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb25zLFxuICAgIHByb3BzLFxuICAgIHN0YXRlLFxuICAgIHNldFByb3BzLFxuICAgIHNldFN0YXRlLFxuICAgIHNldFRhcmdldCxcbiAgICBhZGRFdmVudCxcbiAgICByZW1vdmVFdmVudCxcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvLyBwcm9wc1xuICAgICAgZGltbUNsaWNrOiB0cnVlLFxuICAgICAgZXNjOiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gc3RhdGVcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBESU1NX09QQUNJVFkgPSAwLjY7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9IFwibW9kYWxcIjtcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuXG4gIGxldCBmb2N1c1RyYXBJbnN0YW5jZSwgbW9kYWxEaW1tU2VsZWN0b3IsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvcjtcbiAgbGV0ICR0YXJnZXQsICRodG1sLCAkbW9kYWxUaXRsZSwgJG1vZGFsQ29udGFpbmVyLCAkbW9kYWxEaW1tO1xuXG4gIC8vIOyKpO2BrOuhpCDsoJzslrQg7Jyg7Yu466as7YuwXG4gIGZ1bmN0aW9uIGRpc2FibGVTY3JvbGwoKSB7XG4gICAgY29uc3Qgc2Nyb2xsU3R5bGUgPSB7XG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgIC8vIGhlaWdodDogXCIxMDB2aFwiLFxuICAgIH07XG4gICAgYXBwbHlTdHlsZXMoZG9jdW1lbnQuYm9keSwgc2Nyb2xsU3R5bGUpO1xuICAgIGFwcGx5U3R5bGVzKCRodG1sLCBzY3JvbGxTdHlsZSk7XG4gIH1cblxuICAvLyDsiqTtgazroaQg7LSI6riw7ZmUIOycoO2LuOumrO2LsFxuICBmdW5jdGlvbiBlbmFibGVTY3JvbGwoKSB7XG4gICAgY29uc3QgZGVmYXVsdFN0eWxlID0ge1xuICAgICAgb3ZlcmZsb3c6IFwiXCIsXG4gICAgICAvLyBoZWlnaHQ6IFwiYXV0b1wiLFxuICAgIH07XG4gICAgYXBwbHlTdHlsZXMoZG9jdW1lbnQuYm9keSwgZGVmYXVsdFN0eWxlKTtcbiAgICBhcHBseVN0eWxlcygkaHRtbCwgZGVmYXVsdFN0eWxlKTtcbiAgfVxuXG4gIC8vIOyKpO2DgOydvCDsoIHsmqkg7Jyg7Yu466as7YuwXG4gIGZ1bmN0aW9uIGFwcGx5U3R5bGVzKGVsZW1lbnQsIHN0eWxlcykge1xuICAgIE9iamVjdC5lbnRyaWVzKHN0eWxlcykuZm9yRWFjaCgoW3Byb3BlcnR5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICB7XG4gICAgLyoqXG4gICAgICogaW5pdFxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBmb2N1cyB0cmFwXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxuICAgICAgICBvbkFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzQWN0aXZhdGUsXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUsXG4gICAgICB9KTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIC8vIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIF9wcm9wcyAmJlxuICAgICAgICBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmXG4gICAgICAgICEkdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKVxuICAgICAgKVxuICAgICAgICByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciA9IFwiLm1vZGFsLWNsb3NlXCI7XG4gICAgbW9kYWxEaW1tU2VsZWN0b3IgPSBcIi5tb2RhbC1kaW1tXCI7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJG1vZGFsVGl0bGUgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtdGl0XCIpO1xuICAgICRtb2RhbERpbW0gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IobW9kYWxEaW1tU2VsZWN0b3IpO1xuICAgICRtb2RhbENvbnRhaW5lciA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1jb250YWluZXJcIik7XG4gICAgJGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgXCItdGl0XCIpO1xuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgXCJyb2xlXCIsIFwiZGlhbG9nXCIpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgXCJhcmlhLW1vZGFsXCIsIFwidHJ1ZVwiKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIFwiaWRcIiwgaWQpO1xuICAgIGlmICgkbW9kYWxUaXRsZSkgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWxUaXRsZSwgXCJpZFwiLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGNvbnN0IHsgZ2V0VG9wRGVwdGgsIHNldExheWVyT3BhY2l0eSB9ID0gZXRVSS5ob29rcy51c2VMYXllcihcIm1vZGFsXCIpO1xuXG4gICAgYWN0aW9ucy5mb2N1c0FjdGl2YXRlID0gKCkgPT4ge307XG5cbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICAgIGNsb3NlKCk7XG4gICAgICAvLyBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHpJbmRleCA9IGdldFRvcERlcHRoKCk7XG5cbiAgICAgICR0YXJnZXQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICR0YXJnZXQuc3R5bGUuekluZGV4ID0gekluZGV4O1xuXG4gICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcblxuICAgICAgZ3NhcFxuICAgICAgICAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsRGltbSwgeyBkdXJhdGlvbjogMCwgZGlzcGxheTogXCJibG9ja1wiLCBvcGFjaXR5OiAwIH0pXG4gICAgICAgIC50bygkbW9kYWxEaW1tLCB7IGR1cmF0aW9uOiAwLjE1LCBvcGFjaXR5OiAxIH0pO1xuXG4gICAgICBnc2FwXG4gICAgICAgIC50aW1lbGluZSgpXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgICAgICBkaXNwbGF5OiBcImJsb2NrXCIsXG4gICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICBzY2FsZTogMC45NSxcbiAgICAgICAgICB5UGVyY2VudDogMixcbiAgICAgICAgfSlcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgc2NhbGU6IDEsXG4gICAgICAgICAgeVBlcmNlbnQ6IDAsXG4gICAgICAgICAgZWFzZTogXCJQb3dlcjIuZWFzZU91dFwiLFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxEaW1tLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICRtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIHNjYWxlOiAwLjk1LFxuICAgICAgICB5UGVyY2VudDogMixcbiAgICAgICAgZWFzZTogXCJQb3dlcjIuZWFzZU91dFwiLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICRtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgJHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgJHRhcmdldC5zdHlsZS56SW5kZXggPSBudWxsO1xuXG4gICAgICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoXCJjbGlja1wiLCBtb2RhbENsb3NlQnRuU2VsZWN0b3IsIGNsb3NlKTtcblxuICAgIGlmIChwcm9wcy5kaW1tQ2xpY2spIHtcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgbW9kYWxEaW1tU2VsZWN0b3IsIGNsb3NlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNPcGVuZWQgPSBzdGF0ZS5zdGF0ZSA9PT0gXCJvcGVuXCI7XG5cbiAgICBpZiAoaXNPcGVuZWQpIHtcbiAgICAgIGFjdGlvbnMub3BlbigpO1xuXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG5cbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmRlYWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6IFwib3BlblwiIH0pO1xuICAgIGRpc2FibGVTY3JvbGwoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6IFwiY2xvc2VcIiB9KTtcbiAgICBlbmFibGVTY3JvbGwoKTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsImZ1bmN0aW9uIFNlbGVjdEJveCgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICB0eXBlOiBcImN1c3RvbVwiLFxuICAgICAgbGFiZWw6IFwiXCIsXG4gICAgICBkZWZhdWx0OiBcIlwiLFxuICAgICAgaXRlbXM6IFtdLFxuICAgICAgc2VsZWN0ZWRJbmRleDogMCxcbiAgICAgIHRyYW5zaXRpb246IFwibm9ybWFsXCIsXG4gICAgICBzY3JvbGxUbzogZmFsc2UsXG4gICAgICBnc2FwT3B0aW9uOiB7fSxcbiAgICAgIHN0YXRlOiBcImNsb3NlXCIsXG4gICAgfSxcbiAgICB7fSxcbiAgICByZW5kZXIsXG4gICk7XG4gIGNvbnN0IHsgJHRlbXBsYXRlQ3VzdG9tSFRNTCwgJHRlbXBsYXRlQmFzaWNIVE1MIH0gPSB1c2VTZWxlY3RCb3hUZW1wKCk7XG4gIGNvbnN0IHsgdXNlU2VsZWN0U2hvdyB9ID0gdXNlVHJhbnNpdGlvbigpO1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSBcInNlbGVjdFwiO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgbGV0ICR0YXJnZXQsXG4gICAgLy8g7JqU7IaM6rSA66CoIOuzgOyImOuTpFxuICAgIHNlbGVjdExhYmVsLFxuICAgIHNlbGVjdENvbWJvQm94LFxuICAgIHNlbGVjdExpc3RCb3gsXG4gICAgc2VsZWN0T3B0aW9uLFxuICAgIHRpbWVsaW5lO1xuXG4gIHtcbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG5cbiAgICAgIGlmIChwcm9wcy50eXBlID09PSBcImJhc2ljXCIpIHJldHVybjtcblxuICAgICAgc2V0dXBTZWxlY3RvcigpO1xuICAgICAgc2V0dXBFbGVtZW50KCk7XG4gICAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgICAgLy8gZWZmZWN0XG4gICAgICB0aW1lbGluZSA9IHVzZVNlbGVjdFNob3coJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdExpc3RCb3gpLCBwcm9wcy50cmFuc2l0aW9uLCBwcm9wcy5nc2FwT3B0aW9uKS50aW1lbGluZTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIGFjdGlvbnNbcHJvcHMuc3RhdGUgfHwgc3RhdGUuc3RhdGVdPy4oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIpKSByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIik7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgaWYgKHByb3BzLml0ZW1zLmxlbmd0aCA8IDEpIHJldHVybjtcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gXCJjdXN0b21cIikge1xuICAgICAgY29uc3QgeyBzZWxlY3RlZEluZGV4IH0gPSBwcm9wcztcbiAgICAgIGNvbnN0IGl0ZW1MaXN0VGVtcCA9IHByb3BzLml0ZW1zLm1hcCgoaXRlbSkgPT4gJHRlbXBsYXRlQ3VzdG9tSFRNTC5pdGVtcyhpdGVtKSkuam9pbihcIlwiKTtcblxuICAgICAgJHRhcmdldC5pbm5lckhUTUwgPSBgXG4gICAgICAgICR7cHJvcHMubGFiZWwgJiYgJHRlbXBsYXRlQ3VzdG9tSFRNTC5sYWJlbChwcm9wcy5sYWJlbCl9XG4gICAgICAgICR7cHJvcHMuZGVmYXVsdCA/ICR0ZW1wbGF0ZUN1c3RvbUhUTUwuc2VsZWN0QnRuKHByb3BzLmRlZmF1bHQpIDogJHRlbXBsYXRlQ3VzdG9tSFRNTC5zZWxlY3RCdG4ocHJvcHMuaXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PSBwcm9wcy5pdGVtc1tzZWxlY3RlZEluZGV4XS52YWx1ZSkudGV4dCl9XG4gICAgICAgICR7cHJvcHMuaXRlbXMgJiYgJHRlbXBsYXRlQ3VzdG9tSFRNTC5pdGVtc1dyYXAoaXRlbUxpc3RUZW1wKX1cbiAgICAgIGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNlbGVjdEJ0blRlbXAgPSAkdGVtcGxhdGVCYXNpY0hUTUwuc2VsZWN0QnRuKHByb3BzLmRlZmF1bHQpO1xuICAgICAgY29uc3QgaXRlbUxpc3RUZW1wID0gcHJvcHMuaXRlbXMubWFwKChpdGVtKSA9PiAkdGVtcGxhdGVCYXNpY0hUTUwuaXRlbXMoaXRlbSkpLmpvaW4oXCJcIik7XG5cbiAgICAgICR0YXJnZXQuaW5uZXJIVE1MID0gYFxuICAgICAgICAke3Byb3BzLmxhYmVsICYmICR0ZW1wbGF0ZUJhc2ljSFRNTC5sYWJlbChwcm9wcy5sYWJlbCl9XG4gICAgICAgICR7cHJvcHMuaXRlbXMgJiYgJHRlbXBsYXRlQmFzaWNIVE1MLml0ZW1zV3JhcChzZWxlY3RCdG5UZW1wICsgaXRlbUxpc3RUZW1wKX1cbiAgICAgIGA7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgc2VsZWN0TGFiZWwgPSBcIi5jb21iby1sYWJlbFwiO1xuICAgIHNlbGVjdENvbWJvQm94ID0gXCIuc2VsZWN0LWJveFwiO1xuICAgIHNlbGVjdExpc3RCb3ggPSBcIi5zZWxlY3Qtb3B0aW9uc1wiO1xuICAgIHNlbGVjdE9wdGlvbiA9IFwiLm9wdGlvblwiO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgbGFiZWxJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICBjb25zdCBjb21ib0JveElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKFwiY29tYm9ib3hcIik7XG4gICAgY29uc3QgbGlzdEJveElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKFwibGlzdGJveFwiKTtcblxuICAgIC8vIGExMXlcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExhYmVsLCBcImlkXCIsIGxhYmVsSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiaWRcIiwgY29tYm9Cb3hJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJyb2xlXCIsIFwiY29tYm9ib3hcIik7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJhcmlhLWxhYmVsbGVkYnlcIiwgbGFiZWxJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJhcmlhLWNvbnRyb2xzXCIsIGxpc3RCb3hJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcImlkXCIsIGxpc3RCb3hJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcInJvbGVcIiwgXCJsaXN0Ym94XCIpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgXCJhcmlhLWxhYmVsbGVkYnlcIiwgbGFiZWxJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcInRhYmluZGV4XCIsIC0xKTtcblxuICAgIC8vIHNlbGVjdCBwcm9wZXJ0eVxuICAgIGNvbnN0IG9wdGlvbnMgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0T3B0aW9uKTtcbiAgICBvcHRpb25zLmZvckVhY2goKGVsLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoXCJvcHRpb25cIik7XG5cbiAgICAgICR0YXJnZXRbaW5kZXhdID0gZWw7XG4gICAgICBlbFtcImluZGV4XCJdID0gaW5kZXg7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBvcHRpb25JZCk7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwib3B0aW9uXCIpO1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBmYWxzZSk7XG5cbiAgICAgIHByb3BzLml0ZW1zW2luZGV4XT8uZGlzYWJsZWQgJiYgZWwuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG5cbiAgICAgIGlmICghJHRhcmdldFtcIm9wdGlvbnNcIl0pICR0YXJnZXRbXCJvcHRpb25zXCJdID0gW107XG4gICAgICAkdGFyZ2V0W1wib3B0aW9uc1wiXVtpbmRleF0gPSBlbDtcbiAgICB9KTtcblxuICAgICFwcm9wcy5kZWZhdWx0ICYmIHNlbGVjdEl0ZW0ob3B0aW9uc1twcm9wcy5zZWxlY3RlZEluZGV4XSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgbGV0IHNlbGVjdEluZGV4ID0gaXNOYU4oJHRhcmdldC5zZWxlY3RlZEluZGV4KSA/IC0xIDogJHRhcmdldC5zZWxlY3RlZEluZGV4O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlSW5kZXgoc3RhdGUpIHtcbiAgICAgIGlmICghc3RhdGUpIHJldHVybjtcbiAgICAgIHNlbGVjdEluZGV4ID0gaXNOYU4oJHRhcmdldC5zZWxlY3RlZEluZGV4KSA/IC0xIDogJHRhcmdldC5zZWxlY3RlZEluZGV4O1xuICAgICAgdXBkYXRlQ3VycmVudENsYXNzKCR0YXJnZXRbc2VsZWN0SW5kZXhdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBrZXlFdmVudENhbGxiYWNrKCkge1xuICAgICAgdXBkYXRlQ3VycmVudENsYXNzKCR0YXJnZXRbc2VsZWN0SW5kZXhdKTtcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIsICR0YXJnZXRbc2VsZWN0SW5kZXhdLmlkKTtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtzZWxlY3RDb21ib0JveH0gOmxhc3QtY2hpbGRgKS50ZXh0Q29udGVudCA9ICR0YXJnZXRbc2VsZWN0SW5kZXhdLnRleHRDb250ZW50O1xuICAgIH1cblxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3RDb21ib0JveCk/LmZvY3VzKCk7XG4gICAgICBvcGVuU3RhdGUoKTtcbiAgICAgIHVwZGF0ZUluZGV4KHRydWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtzZWxlY3RDb21ib0JveH0gOmxhc3QtY2hpbGRgKS50ZXh0Q29udGVudCA9ICR0YXJnZXRbXCJvcHRpb25zXCJdWyR0YXJnZXQuc2VsZWN0ZWRJbmRleF0/LnRleHRDb250ZW50ID8/IHByb3BzLmRlZmF1bHQ7XG4gICAgICBjbG9zZVN0YXRlKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50XCIpO1xuICAgICAgc2VsZWN0SXRlbShjdXJyZW50RWwpO1xuICAgICAgY2xvc2VTdGF0ZSgpO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLmZpcnN0ID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSAwO1xuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xuICAgIH07XG4gICAgYWN0aW9ucy5sYXN0ID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSAkdGFyZ2V0W1wib3B0aW9uc1wiXS5sZW5ndGggLSAxO1xuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xuICAgIH07XG4gICAgYWN0aW9ucy51cCA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gTWF0aC5tYXgoLS1zZWxlY3RJbmRleCwgMCk7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRvd24gPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9IE1hdGgubWluKCsrc2VsZWN0SW5kZXgsICR0YXJnZXRbXCJvcHRpb25zXCJdLmxlbmd0aCAtIDEpO1xuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xuICAgIH07XG5cbiAgICBjb21wb25lbnQub3BlbiA9IGFjdGlvbnMub3BlbjtcbiAgICBjb21wb25lbnQuY2xvc2UgPSBhY3Rpb25zLmNsb3NlO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgaWYgKHByb3BzLnR5cGUgPT09IFwiYmFzaWNcIikgcmV0dXJuO1xuXG4gICAgLy8gYTExeVxuICAgIGNvbnN0IGFjdGlvbkxpc3QgPSB7XG4gICAgICB1cDogW1wiQXJyb3dVcFwiXSxcbiAgICAgIGRvd246IFtcIkFycm93RG93blwiXSxcbiAgICAgIGZpcnN0OiBbXCJIb21lXCIsIFwiUGFnZVVwXCJdLFxuICAgICAgbGFzdDogW1wiRW5kXCIsIFwiUGFnZURvd25cIl0sXG4gICAgICBjbG9zZTogW1wiRXNjYXBlXCJdLFxuICAgICAgc2VsZWN0OiBbXCJFbnRlclwiLCBcIiBcIl0sXG4gICAgfTtcblxuICAgIGFkZEV2ZW50KFwiYmx1clwiLCBzZWxlY3RDb21ib0JveCwgKGUpID0+IHtcbiAgICAgIGlmIChlLnJlbGF0ZWRUYXJnZXQ/LnJvbGUgPT09IFwibGlzdGJveFwiKSByZXR1cm47XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBhZGRFdmVudChcImNsaWNrXCIsIHNlbGVjdENvbWJvQm94LCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgY29uc3QgdG9nZ2xlU3RhdGUgPSBzdGF0ZS5zdGF0ZSA9PT0gXCJvcGVuXCIgPyBcImNsb3NlXCIgOiBcIm9wZW5cIjtcbiAgICAgIGFjdGlvbnNbdG9nZ2xlU3RhdGVdPy4oKTtcbiAgICB9KTtcblxuICAgIC8vIGExMXlcbiAgICBhZGRFdmVudChcImtleWRvd25cIiwgc2VsZWN0Q29tYm9Cb3gsIChlKSA9PiB7XG4gICAgICBpZiAoc3RhdGUuc3RhdGUgPT09IFwiY2xvc2VcIikgcmV0dXJuO1xuXG4gICAgICBjb25zdCB7IGtleSB9ID0gZTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5lbnRyaWVzKGFjdGlvbkxpc3QpLmZpbmQoKFtfLCBrZXlzXSkgPT4ga2V5cy5pbmNsdWRlcyhrZXkpKTtcblxuICAgICAgaWYgKGFjdGlvbikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IFthY3Rpb25OYW1lXSA9IGFjdGlvbjtcbiAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXT8uKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRFdmVudChcImNsaWNrXCIsIHNlbGVjdExpc3RCb3gsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICBpZiAoIXRhcmdldC5yb2xlID09PSBcIm9wdGlvblwiKSByZXR1cm47XG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3ModGFyZ2V0KTtcbiAgICAgIGFjdGlvbnMuc2VsZWN0KCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNPcGVuZWQgPSBzdGF0ZS5zdGF0ZSA9PT0gXCJvcGVuXCI7XG5cbiAgICBwcm9wcy50cmFuc2l0aW9uICYmIHRpbWVsaW5lKGlzT3BlbmVkKTtcbiAgICBjaGVja09wZW5EaXIoaXNPcGVuZWQpO1xuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJhcmlhLWV4cGFuZGVkXCIsIGlzT3BlbmVkKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkRWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpO1xuICAgIGlmIChpc09wZW5lZCkgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiwgc2VsZWN0ZWRFbD8uaWQgPz8gXCJcIik7XG4gICAgZWxzZSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiLCBcIlwiKTtcbiAgfVxuXG4gIC8vIGN1c3RvbVxuICBmdW5jdGlvbiBjaGVja09wZW5EaXIoc3RhdGUpIHtcbiAgICBpZiAoIXN0YXRlIHx8IHByb3BzLnNjcm9sbFRvKSByZXR1cm47IC8vIGZhbHNl7J206rGw64KYIHNjcm9sbFRvIOq4sOuKpSDsnojsnYQg65WMIC0g7JWE656Y66GcIOyXtOumvFxuXG4gICAgY29uc3QgeyBoZWlnaHQ6IGxpc3RIZWlnaHQgfSA9IGV0VUkuaG9va3MudXNlR2V0Q2xpZW50UmVjdCgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94KTtcbiAgICBjb25zdCB7IGhlaWdodDogY29tYm9IZWlnaHQsIGJvdHRvbTogY29tYm9Cb3R0b20gfSA9IGV0VUkuaG9va3MudXNlR2V0Q2xpZW50UmVjdCgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCk7XG4gICAgY29uc3Qgcm9sZSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIE1BUkdJTiA8IGNvbWJvQm90dG9tICsgbGlzdEhlaWdodDtcblxuICAgIGV0VUkudXRpbHMuc2V0U3R5bGUoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgXCJib3R0b21cIiwgcm9sZSA/IGNvbWJvSGVpZ2h0ICsgXCJweFwiIDogXCJcIik7XG4gIH1cblxuICAvLyB1cGRhdGUgLmN1cnJlbnQgY2xhc3NcbiAgZnVuY3Rpb24gdXBkYXRlQ3VycmVudENsYXNzKGFkZENsYXNzRWwpIHtcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudFwiKT8uY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnRcIik7XG4gICAgYWRkQ2xhc3NFbD8uY2xhc3NMaXN0LmFkZChcImN1cnJlbnRcIik7XG4gIH1cblxuICAvLyBzZWxlY3QgaXRlbVxuICBmdW5jdGlvbiBzZWxlY3RJdGVtKHRhcmdldCkge1xuICAgIGNvbnN0IHRhcmdldE9wdGlvbiA9IHRhcmdldD8uY2xvc2VzdChzZWxlY3RPcHRpb24pO1xuXG4gICAgaWYgKCF0YXJnZXRPcHRpb24pIHJldHVybjtcblxuICAgICR0YXJnZXQuc2VsZWN0ZWRJbmRleCA9IHRhcmdldE9wdGlvbltcImluZGV4XCJdO1xuICAgICR0YXJnZXQudmFsdWUgPSB0YXJnZXRPcHRpb24uZ2V0QXR0cmlidXRlKFwiZGF0YS12YWx1ZVwiKTtcblxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScsIFwiYXJpYS1zZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgdGFyZ2V0T3B0aW9uLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cbiAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKSk7XG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gdGFyZ2V0T3B0aW9uLnRleHRDb250ZW50O1xuICB9XG5cbiAgLy8gc2VsZWN0IHN0YXRlXG4gIGZ1bmN0aW9uIG9wZW5TdGF0ZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcIm9wZW5cIiB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlU3RhdGUoKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogXCJjbG9zZVwiIH0pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG5cbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqIFNrZWxcbiAqIC8vIGluaXQsIHNldHVwLCB1cGRhdGUsIGRlc3Ryb3lcbiAqIC8vIHNldHVwVGVtcGxhdGUsIHNldHVwU2VsZWN0b3IsIHNldHVwRWxlbWVudCwgc2V0dXBBY3Rpb25zLFxuICogICAgICBzZXRFdmVudCwgcmVuZGVyLCBjdXN0b21GbiwgY2FsbGFibGVcbiAqXG4gKiAgICAgIGRvbeunjCDsnbTsmqntlbTshJwgdWkg7LSI6riw7ZmUXG4gKiAgICAgICAgZGF0YS1wcm9wcy1vcHQxLCBkYXRhLXByb3BzLW9wdDIsIGRhdGEtcHJvcHMtb3B0M1xuICogICAgICDqs6DquInsmLXshZhcbiAqICAgICAgICBkYXRhLWluaXQ9ZmFsc2VcbiAqICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBTa2VsKCk7XG4gKiAgICAgICAgaW5zdGFuY2UuY29yZS5pbml0KCcuc2VsZWN0b3InLCB7IG9wdDE6ICd2YWx1ZScgfSlcbiAqXG4gKiAgICAgIGRhdGEtaW5pdCDsspjrpqxcbiAqL1xuZnVuY3Rpb24gU2tlbCgpIHtcbiAgY29uc3Qge1xuICAgIGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudFxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKHtcbiAgICAvLyBwcm9wc1xuXG4gIH0sIHtcbiAgICAvLyBzdGF0ZVxuXG4gIH0sIHJlbmRlcik7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdza2VsJztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQgY29tcG9uZW50ID0ge307XG4gICAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsXG4gICAgc29tZVNlbGVjdG9yLCBvdGhlclNlbGVjdG9yLFxuICAgICR0YXJnZXRFbHMxLCAkdGFyZ2V0RWxzMlxuXG4gIHtcbiAgICAvKipcbiAgICAgKiBpbml0XG4gICAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgICAgaWYodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJyl7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KVxuICAgICAgfWVsc2V7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYoISR0YXJnZXQpe1xuICAgICAgICB0aHJvdyBFcnJvcigndGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuJyk7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KVxuICAgICAgc2V0UHJvcHMoey4uLnByb3BzLCAuLi5fcHJvcHN9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIC8vIHRlbXBsYXRlLCBzZWxlY3RvciwgZWxlbWVudCwgYWN0aW9uc1xuICAgICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgICAgc2V0dXBTZWxlY3RvcigpXG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgLy8gJHRhcmdldC5pbm5lckhUTUwgPSBgYDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKXtcbiAgICAkdGFyZ2V0RWxzMiA9ICcuZWwyJztcbiAgICAkdGFyZ2V0RWxzMSA9ICcuZWwxJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuICAgIGNvbnN0IGxhYmVsSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG5cbiAgICAvLyBhMTF5XG4gICAgdXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJHNlbGVjdExhYmVsLCAnaWQnLCBsYWJlbElkKTtcblxuICAgIC8vIGNvbXBvbmVudCBjdXN0b20gZWxlbWVudFxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCl7XG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuXG4gICAgfVxuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcblxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsICR0YXJnZXRFbHMxLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgLy8gaGFuZGxlclxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIHJlbmRlclxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICAvLyBjYWxsYWJsZVxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsImZ1bmN0aW9uIFN3aXBlckNvbXAoKSB7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb25zLFxuICAgIHByb3BzLFxuICAgIHN0YXRlLFxuICAgIHNldFN0YXRlLFxuICAgIHNldFByb3BzLFxuICAgIHNldFRhcmdldCxcbiAgICBhZGRFdmVudCxcbiAgICByZW1vdmVFdmVudCxcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICBsb29wOiB0cnVlLFxuICAgICAgb246IHtcbiAgICAgICAgc2xpZGVDaGFuZ2VUcmFuc2l0aW9uRW5kKCkge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3RoaXMucmVhbEluZGV4ICsgMX3rsogg7Ke4IHNsaWRlYCk7XG4gICAgICAgICAgc2V0U3RhdGUoeyBhY3RpdmVJbmRleDogdGhpcy5yZWFsSW5kZXggKyAxIH0pO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YXRlOiBcIlwiLFxuICAgICAgcnVubmluZzogXCJcIixcbiAgICAgIGFjdGl2ZUluZGV4OiAwLFxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuXG4gIC8qKlxuICAgKiBkYXRhLXByb3BzIOumrOyKpO2KuFxuICAgKi9cblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gXCJzd2lwZXJcIjtcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCxcbiAgICAkc3dpcGVyLFxuICAgICRzd2lwZXJOYXZpZ2F0aW9uLFxuICAgICRzd2lwZXJQYWdpbmF0aW9uLFxuICAgICRzd2lwZXJBdXRvcGxheSxcbiAgICAkc3dpcGVyU2xpZGVUb0J1dHRvbjtcblxuICB7XG4gICAgLyoqXG4gICAgICogaW5pdFxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICAvLyB0ZW1wbGF0ZSwgc2VsZWN0b3IsIGVsZW1lbnQsIGFjdGlvbnNcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKFxuICAgICAgICBwcm9wcyAmJlxuICAgICAgICB1dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJlxuICAgICAgICAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIilcbiAgICAgIClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIik7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyBuYXZpZ2F0aW9uLCBwYWdpbmF0aW9uLCBhdXRvcGxheSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MIH0gPSB1c2VTd2lwZXJUbXBsKCk7XG4gICAgbGV0IG5hdmlnYXRpb25FbCwgcGFnaW5hdGlvbkVsLCBhdXRvcGxheUVsO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlSFRNTEVsZW1lbnQoX2NsYXNzTmFtZSwgaHRtbFN0cmluZykge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgdGVtcGxhdGUuY2xhc3NMaXN0LmFkZChfY2xhc3NOYW1lKTtcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxTdHJpbmc7XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaWYgKG5hdmlnYXRpb24pIHtcbiAgICAgIG5hdmlnYXRpb25FbCA9IGNyZWF0ZUhUTUxFbGVtZW50KFxuICAgICAgICBcInN3aXBlci1uYXZpZ2F0aW9uXCIsXG4gICAgICAgICR0ZW1wbGF0ZUhUTUwubmF2aWdhdGlvbigpLFxuICAgICAgKTtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5zd2lwZXItd3JhcHBlclwiKS5hZnRlcihuYXZpZ2F0aW9uRWwpO1xuICAgICAgdHlwZW9mIG5hdmlnYXRpb24gPT09IFwiYm9vbGVhblwiICYmXG4gICAgICAgIHNldFByb3BzKHtcbiAgICAgICAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICAgICAgICBwcmV2RWw6IFwiLnN3aXBlci1idXR0b24tcHJldlwiLFxuICAgICAgICAgICAgbmV4dEVsOiBcIi5zd2lwZXItYnV0dG9uLW5leHRcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocGFnaW5hdGlvbikge1xuICAgICAgcGFnaW5hdGlvbkVsID0gY3JlYXRlSFRNTEVsZW1lbnQoXG4gICAgICAgIFwic3dpcGVyLXBhZ2luYXRpb24td3JhcFwiLFxuICAgICAgICAkdGVtcGxhdGVIVE1MLnBhZ2luYXRpb24oKSxcbiAgICAgICk7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIuc3dpcGVyLXdyYXBwZXJcIikuYWZ0ZXIocGFnaW5hdGlvbkVsKTtcbiAgICAgIHR5cGVvZiBwYWdpbmF0aW9uID09PSBcImJvb2xlYW5cIiAmJlxuICAgICAgICBzZXRQcm9wcyh7XG4gICAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgICAgZWw6IFwiLnN3aXBlci1wYWdpbmF0aW9uXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9wbGF5KSB7XG4gICAgICBhdXRvcGxheUVsID0gY3JlYXRlSFRNTEVsZW1lbnQoXG4gICAgICAgIFwic3dpcGVyLWF1dG9wbGF5LXdyYXBcIixcbiAgICAgICAgJHRlbXBsYXRlSFRNTC5hdXRvcGxheSgpLFxuICAgICAgKTtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5zd2lwZXItd3JhcHBlclwiKS5hZnRlcihhdXRvcGxheUVsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgICRzd2lwZXJQYWdpbmF0aW9uID0gXCIuc3dpcGVyLXBhZ2luYXRpb25cIjtcbiAgICAkc3dpcGVyTmF2aWdhdGlvbiA9IFwiLnN3aXBlci1uYXZpZ2F0aW9uXCI7XG4gICAgJHN3aXBlckF1dG9wbGF5ID0gXCIuc3dpcGVyLWF1dG9wbGF5XCI7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcblxuICAgIC8vIGExMXlcblxuICAgIC8vIG5ldyBTd2lwZXIg7IOd7ISxXG4gICAgJHN3aXBlciA9IG5ldyBTd2lwZXIoJHRhcmdldCwgeyAuLi5wcm9wcyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICAvLyBhY3Rpb25zLnN0YXJ0ID0gKCkgPT4ge1xuICAgIC8vICAgcGxheSgpO1xuICAgIC8vIH07XG4gICAgLy9cbiAgICAvLyBhY3Rpb25zLnN0b3AgPSAoKSA9PiB7XG4gICAgLy8gICBzdG9wKCk7XG4gICAgLy8gfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIC8vIGF1dG9wbGF5IOuyhO2KvFxuICAgIGlmIChwcm9wcy5hdXRvcGxheSkge1xuICAgICAgYWRkRXZlbnQoXCJjbGlja1wiLCAkc3dpcGVyQXV0b3BsYXksIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCAkZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgkc3dpcGVyQXV0b3BsYXkpO1xuICAgICAgICBoYW5kbGVBdXRvcGxheSgkZXZlbnRUYXJnZXQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIHJlbmRlclxuICB9XG5cbiAgLy8gYXV0b3BsYXkg6rSA66CoIOy7pOyKpO2FgCDtlajsiJhcbiAgZnVuY3Rpb24gaGFuZGxlQXV0b3BsYXkoJHRhcmdldCkge1xuICAgICR0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShcInBsYXlcIik7XG4gICAgJHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwic3RvcFwiKTtcblxuICAgIGlmICgkdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInN0b3BcIikpIHtcbiAgICAgIHN0b3AoKTtcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicGxheVwiKSkge1xuICAgICAgcGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgJHN3aXBlci5hdXRvcGxheS5zdGFydCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAkc3dpcGVyLmF1dG9wbGF5LnN0b3AoKTtcbiAgfVxuXG4gIC8vIO2KueyglSDsiqzrnbzsnbTrk5zroZwg7J2064+ZXG4gIGZ1bmN0aW9uIG1vdmVUb1NsaWRlKGluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzKSB7XG4gICAgaWYgKHByb3BzLmxvb3ApIHtcbiAgICAgICRzd2lwZXIuc2xpZGVUb0xvb3AoaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc3dpcGVyLnNsaWRlVG8oaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIGdldFN3aXBlckluc3RhbmNlKCkge1xuICAgICAgcmV0dXJuICRzd2lwZXI7IC8vICRzd2lwZXIg7J247Iqk7YS07IqkIOuwmO2ZmFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogU2tlbFxuICogLy8gaW5pdCwgc2V0dXAsIHVwZGF0ZSwgZGVzdHJveVxuICogLy8gc2V0dXBUZW1wbGF0ZSwgc2V0dXBTZWxlY3Rvciwgc2V0dXBFbGVtZW50LCBzZXR1cEFjdGlvbnMsXG4gKiAgICAgIHNldEV2ZW50LCByZW5kZXIsIGN1c3RvbUZuLCBjYWxsYWJsZVxuICovXG5mdW5jdGlvbiBUYWIoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9IFwidGFiXCI7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCwgdGFiSGVhZCwgJHRhYkhlYWRFbCwgdGFiQnRuLCAkdGFiQnRuRWwsIHRhYkNvbnRlbnQsICR0YWJDb250ZW50RWw7XG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICAgIHRocm93IEVycm9yKFwidGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuXCIpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIiwgXCJ0cnVlXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgICAgc2V0dXBTZWxlY3RvcigpO1xuICAgICAgc2V0dXBFbGVtZW50KCk7XG4gICAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgICAgLy8gZWZmZWN0XG4gICAgICBwcm9wcy5zdGlja3kgJiYgc3RpY2t5VGFiKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBwcm9wcy5hY3RpdmUgPz8gJHRhYkJ0bkVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIpKSByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIHRhYkhlYWQgPSBcIi50YWItaGVhZFwiO1xuICAgIHRhYkJ0biA9IFwiLnRhYi1sYWJlbFwiO1xuICAgIHRhYkNvbnRlbnQgPSBcIi50YWItY29udGVudFwiO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICR0YWJIZWFkRWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IodGFiSGVhZCk7XG4gICAgJHRhYkJ0bkVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHRhYkJ0bik7XG4gICAgJHRhYkNvbnRlbnRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCh0YWJDb250ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuICAgIC8vIGExMXlcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHRhYkhlYWQsIFwicm9sZVwiLCBcInRhYmxpc3RcIik7XG5cbiAgICAvLyBjb21wb25lbnQgY3VzdG9tIGVsZW1lbnRcbiAgICAkdGFiSGVhZEVsLnN0eWxlLnRvdWNoQWN0aW9uID0gXCJub25lXCI7XG4gICAgJHRhYkJ0bkVsLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHRhYkJ0bklkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgICAgY29uc3QgdGFiQ29udGVudElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKFwidGFicGFuZWxcIik7XG5cbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0YWJCdG5JZCk7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYlwiKTtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIGZhbHNlKTtcblxuICAgICAgaWYgKCR0YWJDb250ZW50RWxbaW5kZXhdKSB7XG4gICAgICAgICR0YWJDb250ZW50RWxbaW5kZXhdLnNldEF0dHJpYnV0ZShcImlkXCIsIHRhYkNvbnRlbnRJZCk7XG4gICAgICAgICR0YWJDb250ZW50RWxbaW5kZXhdLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJ0YWJwYW5lbFwiKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFiVmFsdWUgPSB0YWIuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIik7XG4gICAgICBjb25zdCB0YWJDb250ZW50VmFsdWUgPSAkdGFiQ29udGVudEVsW2luZGV4XS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKTtcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYCR7dGFiQ29udGVudH1bZGF0YS10YWItdmFsdWU9XCIke3RhYlZhbHVlfVwiXWAsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIHRhYi5pZCk7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkJ0bn1bZGF0YS10YWItdmFsdWU9XCIke3RhYkNvbnRlbnRWYWx1ZX1cIl1gLCBcImFyaWEtY29udHJvbHNcIiwgJHRhYkNvbnRlbnRFbFtpbmRleF0uaWQpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGxldCBzdGFydFggPSAwO1xuICAgIGxldCBlbmRYID0gMDtcbiAgICBsZXQgbW92ZVggPSAwO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gMDtcbiAgICBsZXQgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICBsZXQgY2xpY2thYmxlID0gdHJ1ZTtcblxuICAgIGFjdGlvbnMuc2VsZWN0ID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCB0YXJnZXRCdG4gPSBlLnRhcmdldC5jbG9zZXN0KHRhYkJ0bik7XG4gICAgICBpZiAoIXRhcmdldEJ0bikgcmV0dXJuO1xuICAgICAgaWYgKCFjbGlja2FibGUpIHJldHVybjtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IHRhcmdldEJ0bi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcbiAgICAgIGdzYXAudG8oJHRhYkhlYWRFbCwge1xuICAgICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgICBzY3JvbGxMZWZ0OiB0YXJnZXRCdG4ub2Zmc2V0TGVmdCxcbiAgICAgICAgb3ZlcndyaXRlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuZHJhZ1N0YXJ0ID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoaXNSZWFkeU1vdmUpIHJldHVybjtcbiAgICAgIGlzUmVhZHlNb3ZlID0gdHJ1ZTtcbiAgICAgIHN0YXJ0WCA9IGUueDtcbiAgICAgIHNjcm9sbExlZnQgPSAkdGFiSGVhZEVsLnNjcm9sbExlZnQ7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRyYWdNb3ZlID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG4gICAgICBtb3ZlWCA9IGUueDtcbiAgICAgICR0YWJIZWFkRWwuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQgKyAoc3RhcnRYIC0gbW92ZVgpO1xuICAgIH07XG4gICAgYWN0aW9ucy5kcmFnRW5kID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG4gICAgICBlbmRYID0gZS54O1xuICAgICAgaWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMTApIGNsaWNrYWJsZSA9IHRydWU7XG4gICAgICBlbHNlIGNsaWNrYWJsZSA9IGZhbHNlO1xuICAgICAgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZHJhZ0xlYXZlID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG5cbiAgICAgIC8vIGdzYXAudG8oJHRhYkhlYWRFbCwge1xuICAgICAgLy8gICBzY3JvbGxMZWZ0OiAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpLm9mZnNldExlZnQsXG4gICAgICAvLyAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICAgIC8vIH0pO1xuXG4gICAgICBjbGlja2FibGUgPSB0cnVlO1xuICAgICAgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy51cCA9IChlKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHJldHVybjtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5kb3duID0gKGUpID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nKSByZXR1cm47XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5maXJzdCA9ICgpID0+IHtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6ICR0YWJCdG5FbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmxhc3QgPSAoKSA9PiB7XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiAkdGFiQnRuRWxbJHRhYkJ0bkVsLmxlbmd0aCAtIDFdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZm9jdXNUYXJnZXRWYWx1ZShlbCwgdmFsdWUpIHtcbiAgICAgIGNvbnN0IGZvY3VzVGFyZ2V0ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke2VsfVtkYXRhLXRhYi12YWx1ZT1cIiR7dmFsdWV9XCJdYCk7XG4gICAgICBmb2N1c1RhcmdldD8uZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBjb25zdCBhY3Rpb25MaXN0ID0ge1xuICAgICAgdXA6IFtcIkFycm93TGVmdFwiXSxcbiAgICAgIGRvd246IFtcIkFycm93UmlnaHRcIl0sXG4gICAgICBmaXJzdDogW1wiSG9tZVwiXSxcbiAgICAgIGxhc3Q6IFtcIkVuZFwiXSxcbiAgICAgIHNlbGVjdDogW1wiRW50ZXJcIiwgXCIgXCJdLFxuICAgIH07XG5cbiAgICBhZGRFdmVudChcImNsaWNrXCIsIHRhYkhlYWQsIGFjdGlvbnMuc2VsZWN0KTtcbiAgICBhZGRFdmVudChcInBvaW50ZXJkb3duXCIsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ1N0YXJ0KTtcbiAgICBhZGRFdmVudChcInBvaW50ZXJtb3ZlXCIsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ01vdmUpO1xuICAgIGFkZEV2ZW50KFwicG9pbnRlcnVwXCIsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ0VuZCk7XG4gICAgYWRkRXZlbnQoXCJwb2ludGVybGVhdmVcIiwgdGFiSGVhZCwgYWN0aW9ucy5kcmFnTGVhdmUpO1xuXG4gICAgYWRkRXZlbnQoXCJrZXlkb3duXCIsIHRhYkhlYWQsIChlKSA9PiB7XG4gICAgICBjb25zdCB7IGtleSB9ID0gZTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5lbnRyaWVzKGFjdGlvbkxpc3QpLmZpbmQoKFtfLCBrZXlzXSkgPT4ga2V5cy5pbmNsdWRlcyhrZXkpKTtcblxuICAgICAgaWYgKGFjdGlvbikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IFthY3Rpb25OYW1lXSA9IGFjdGlvbjtcbiAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXT8uKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IGdldElkID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3RhYkJ0bn1bYXJpYS1zZWxlY3RlZD1cInRydWVcIl1gKT8uaWQ7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nLCBcImFyaWEtc2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYCR7dGFiQnRufVtkYXRhLXRhYi12YWx1ZT1cIiR7c3RhdGUuYWN0aXZlVmFsdWV9XCJdYCwgXCJhcmlhLXNlbGVjdGVkXCIsIHRydWUpO1xuXG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3RhYkNvbnRlbnR9W2FyaWEtbGFiZWxsZWRieT1cIiR7Z2V0SWR9XCJdYCk/LmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHt0YWJDb250ZW50fVtkYXRhLXRhYi12YWx1ZT1cIiR7c3RhdGUuYWN0aXZlVmFsdWV9XCJdYCk/LmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICB9XG5cbiAgLy8gY3VzdG9tXG4gIGZ1bmN0aW9uIHN0aWNreVRhYigpIHtcbiAgICBjb25zdCB7IGJvdHRvbSB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KGRvY3VtZW50LCBwcm9wcy5zdGlja3kpO1xuXG4gICAgJHRhcmdldC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICAkdGFiSGVhZEVsLnN0eWxlLnBvc2l0aW9uID0gXCJzdGlja3lcIjtcbiAgICBpZiAoIWJvdHRvbSkgJHRhYkhlYWRFbC5zdHlsZS50b3AgPSAwICsgXCJweFwiO1xuICAgIGVsc2UgJHRhYkhlYWRFbC5zdHlsZS50b3AgPSBib3R0b20gKyBcInB4XCI7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICB1cGRhdGUsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cblxuLypcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgJHRhYkJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbXBvbmVudD1cInRhYlwiXScpO1xuICAkdGFiQm94LmZvckVhY2goKHRhYkJveCkgPT4ge1xuICAgIGNvbnN0IHRhYiA9IFRhYigpO1xuICAgIHRhYi5jb3JlLmluaXQodGFiQm94KTtcbiAgfSk7XG59KTtcbiovXG4iLCIvLyBwcm9wc+uKlCDsnKDsoIAo7J6R7JeF7J6QKeqwgCDsoJXsnZjtlaAg7IiYIOyeiOuKlCDsmLXshZhcbi8vIHN0YXRl64qUIOuCtOu2gCDroZzsp4Hsl5DshJwg7J6R64+Z65CY64qUIOuhnOyngSAoZXg6IHN0YXRlIG9wZW4gY2xvc2UgYXJpYSDrk7Hrk7EuLi4uIClcblxuLy8g7YOA7J6FIOygleydmFxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRvb2x0aXBQcm9wc0NvbmZpZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBkaXNhYmxlZCAtIOyalOyGjOqwgCDruYTtmZzshLHtmZQg7IOB7YOc7J247KeA66W8IOuCmO2DgOuDheuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb25jZSAtIOydtOuypO2KuOuCmCDslaHshZjsnYQg7ZWcIOuyiOunjCDsi6TtlontlaDsp4Ag7Jes67aA66W8IOqysOygle2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7ZmFsc2UgfCBudW1iZXJ9IGR1cmF0aW9uIC0g7JWg64uI66mU7J207IWYIOuYkOuKlCDsnbTrsqTtirgg7KeA7IaNIOyLnOqwhOydhCDrsIDrpqzstIgg64uo7JyE66GcIOyEpOygle2VqeuLiOuLpC4gJ2ZhbHNlJ+ydvCDqsr3smrAg7KeA7IaNIOyLnOqwhOydhCDrrLTsi5ztlanri4jri6QuXG4gKiBAcHJvcGVydHkge09iamVjdH0gb3JpZ2luIC0g7JuQ7KCQIOuYkOuKlCDsi5zsnpEg7KeA7KCQ7J2EIOuCmO2DgOuCtOuKlCDqsJ3ssrTsnoXri4jri6QuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBUb29sdGlwU3RhdGVDb25maWdcbiAqIEBwcm9wZXJ0eSB7J2Nsb3NlJyB8ICdvcGVuJ30gc3RhdGUgLSDtiLTtjIHsnZgg7IOB7YOc6rCSLiBjbG9zZSwgb3BlbiDrkZgg7KSR7JeQIO2VmOuCmOyeheuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7J2JvdHRvbScgfCAndG9wJyB8ICdsZWZ0JyB8ICdyaWdodCd9IHBvc2l0aW9uIC0g7Yi07YyB7J2YIOychOy5mOqwki4gYm90dG9tLCB0b3AsIGxlZnQsIHJpZ2h0IOykkeyXkCDtlZjrgpjsnoXri4jri6QuXG4gKi9cblxuZnVuY3Rpb24gVG9vbHRpcCgpIHtcbiAgY29uc3Qge1xuICAgIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudFxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKHtcblxuICB9LCB7XG5cbiAgfSwgcmVuZGVyKTtcblxuICAvLyBzdGF0ZSDrs4Dqsr0g7IucIOuenOuNlCDsnqztmLjstpxcbiAgY29uc3QgbmFtZSA9ICd0b29sdGlwJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7VG9vbHRpcFByb3BzQ29uZmlnfSAqL1xuICAgIC8qKiBAdHlwZSB7VG9vbHRpcFN0YXRlQ29uZmlnfSAqL1xuICAgIC8vIOyalOyGjOq0gOugqCDrs4DsiJjrk6RcbiAgbGV0ICR0YXJnZXQsXG4gICAgJHRvb2x0aXBUcmlnZ2VyQnRuLFxuICAgICR0b29sdGlwQ2xvc2VCdG4sXG4gICAgJHRvb2x0aXBDb250YWluZXI7XG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghJHRhcmdldCkge1xuICAgICAgICB0aHJvdyBFcnJvcigndGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuJyk7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSB0aGlzO1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcblxuICAgICAgLy8gZm9jdXMgdHJhcFxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBmb2N1c1RyYXAuY3JlYXRlRm9jdXNUcmFwKCR0YXJnZXQsIHtcbiAgICAgICAgb25BY3RpdmF0ZTogKCkgPT4ge30sXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogKCkgPT4ge1xuICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBlbGVtZW50XG4gICAgJHRvb2x0aXBDb250YWluZXIgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50b29sdGlwLWNvbnRhaW5lcicpO1xuXG4gICAgLy8gc2VsZWNvdHJcbiAgICAkdG9vbHRpcFRyaWdnZXJCdG4gPSAnLnRvb2x0aXAtYnRuJztcbiAgICAkdG9vbHRpcENsb3NlQnRuID0gJy5idG4tY2xvc2UnO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG5cbiAgICAvLyBhMTF5XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCB0aXRsZUlkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsICR0b29sdGlwVHJpZ2dlckJ0biwgb3Blbik7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgJHRvb2x0aXBDbG9zZUJ0biwgY2xvc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgaXNTaG93ID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcbiAgICBjb25zdCBleHBhbmRlZCA9ICR0b29sdGlwQ29udGFpbmVyLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZSc7XG4gICAgY29uc3QgJGNsb3NlQnRuID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCR0b29sdGlwQ2xvc2VCdG4pO1xuXG4gICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgIWV4cGFuZGVkKTtcbiAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZXhwYW5kZWQpO1xuICAgIGlmIChpc1Nob3cpIHtcbiAgICAgIGhhbmRsZU9wZW5BbmltYXRpb24odHlwZSk7XG4gICAgICAkY2xvc2VCdG4uZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFuZGxlQ2xvc2VBbmltYXRpb24odHlwZSk7XG4gICAgICAkY2xvc2VCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPcGVuQW5pbWF0aW9uKHR5cGUpIHtcbiAgICBjb25zdCBzZXRBbmltYXRpb24gPSB7IGR1cmF0aW9uOiAwLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfTtcbiAgICBjb25zdCBzY2FsZSA9IHByb3BzLnRyYW5zZm9ybS5zY2FsZS54O1xuICAgIGlmICh0eXBlID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwgc2V0QW5pbWF0aW9uKS50bygkdG9vbHRpcENvbnRhaW5lciwgeyBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDEgfSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICdjdXN0b20nKSB7XG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHNldEFuaW1hdGlvbikudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBzY2FsZTogMSwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMSB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbG9zZUFuaW1hdGlvbih0eXBlKSB7XG4gICAgY29uc3Qgc2NhbGUgPSBwcm9wcy50cmFuc2Zvcm0uc2NhbGUueDtcbiAgICBpZiAodHlwZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfSk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnY3VzdG9tJykge1xuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7IGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbiwgc2NhbGU6IHNjYWxlLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBpZiAoc3RhdGUuc3RhdGUgIT09ICdvcGVuJykge1xuICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGlmIChzdGF0ZS5zdGF0ZSAhPT0gJ2Nsb3NlJykge1xuICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgaW5pdCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgICByZW1vdmVFdmVudCxcbiAgICB9LFxuXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH1cblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuXG4vLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4vLyAgIGNvbnN0ICR0b29sdGlwU2VsZWN0b3IgPSBkb2N1bWVudD8ucXVlcnlTZWxlY3RvckFsbChcIi5jb21wb25lbnQtdG9vbHRpcFwiKTtcbi8vICAgJHRvb2x0aXBTZWxlY3Rvci5mb3JFYWNoKCh0b29sdGlwKSA9PiB7XG4vLyAgICAgY29uc3QgdG9vbHRpcENvbXBvbmVudCA9IFRvb2x0aXAoKTtcbi8vICAgICB0b29sdGlwQ29tcG9uZW50LmluaXQodG9vbHRpcCk7XG4vLyAgIH0pO1xuLy8gfSk7XG5cbi8vIOq4sO2DgCDsmLXshZjrk6QuLi5cbi8vIGR1cmF0aW9uOiAzMDAsXG4vLyBoZWlnaHQ6IDIwMCxcbi8vIHRyYW5zZm9ybToge1xuLy8gICBzY2FsZToge1xuLy8gICAgIHg6IDEsXG4vLyAgICAgeTogMSxcbi8vICAgfSxcbi8vICAgdHJhbnNsYXRlOiB7XG4vLyAgICAgeDogMCxcbi8vICAgICB5OiA5MCxcbi8vICAgfSxcbi8vICAgZGVsYXk6IDAsXG4vLyAgIGVhc2Vpbmc6IFwiZWFzZS1vdXRcIixcbi8vIH0sXG5cbi8qKlxuICogU2tlbFxuICogLy8gaW5pdCwgc2V0dXAsIHVwZGF0ZSwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50LCBkZXN0cm95XG4gKiAvLyB0ZW1wbGF0ZSwgc2V0dXBTZWxlY3Rvciwgc2V0dXBFbGVtZW50LCBzZXRFdmVudCwgcmVuZGVyLCBjdXN0b21GbiwgY2FsbGFibGVcbiAqL1xuIiwiXG5ldFVJLmNvbXBvbmVudHMgPSB7XG5cdEFjY29yZGlvbixcblx0RGlhbG9nLFxuXHRNb2RhbCxcblx0U2VsZWN0Qm94LFxuXHRTa2VsLFxuXHRTd2lwZXJDb21wLFxuXHRUYWIsXG5cdFRvb2x0aXBcbn1cbiIsIi8vIGluaXQganNcbmZ1bmN0aW9uIGluaXRVSSgpIHtcbiAgY29uc3QgY29tcG9uZW50TGlzdCA9IFtcbiAgICB7XG4gICAgICBzZWxlY3RvcjogXCIuY29tcG9uZW50LW1vZGFsXCIsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLk1vZGFsLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6IFwiLmNvbXBvbmVudC1hY2NvcmRpb25cIixcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuQWNjb3JkaW9uLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6IFwiLmNvbXBvbmVudC10b29sdGlwXCIsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlRvb2x0aXAsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJ1tkYXRhLWNvbXBvbmVudD1cInRhYlwiXScsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlRhYixcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnW2RhdGEtY29tcG9uZW50PVwic2VsZWN0LWJveFwiXScsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlNlbGVjdEJveCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnW2RhdGEtY29tcG9uZW50PVwic3dpcGVyXCJdJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuU3dpcGVyQ29tcCxcbiAgICB9LFxuICBdO1xuXG4gIGNvbXBvbmVudExpc3QuZm9yRWFjaCgoeyBzZWxlY3RvciwgZm4gfSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKGZuKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgaWYgKGVsLmRhdGFzZXQuaW5pdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBmbigpO1xuICAgICAgY29tcG9uZW50LmNvcmUuaW5pdChlbCwge30sIHNlbGVjdG9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gZXRVSS5kaWFsb2cgPSBldFVJLmhvb2tzLnVzZURpYWxvZygpO1xufVxuXG5ldFVJLmluaXRVSSA9IGluaXRVSTtcblxuKGZ1bmN0aW9uIGF1dG9Jbml0KCkge1xuICBjb25zdCAkc2NyaXB0QmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaW5pdF1cIik7XG4gIGlmICgkc2NyaXB0QmxvY2spIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0VUkoKTtcbiAgICB9KTtcbiAgfVxufSkoKTtcbiJdfQ==
