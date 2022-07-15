function prevent(){
  var focusedElement;
  var focusedElementOnBlur;
  var currentContainer;
  var clickableElements;
  var elements = new Map();

  function preventActionFn(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function preventAction(container = document.body) {
    restoreAction();

    if (typeof container === "string") {
      var element = document.querySelector(container);
      if (!element) return;
      currentContainer = element;
    } else {
      currentContainer = container;
    }

    var activeElement = document.activeElement;

    clickableElements = currentContainer.querySelectorAll(
      'input, textarea, button, select, a, details, area, frame, iframe, [contentEditable=""], [contentEditable="true"], [contentEditable="TRUE"], [tabindex]:not([tabindex^="-"])'
    );

    for (var i = 0; i < clickableElements.length; i++) {
      var el = clickableElements[i];

      if (activeElement === el) {
        focusedElement = activeElement;
        focusedElement.blur();
        focusedElementOnBlur = document.activeElement;
      }

      var ogTabIndex = el.getAttribute("tabindex");
      var ogDisabled = el.getAttribute("disabled");
      var ogPointerEvents = el.style.pointerEvents;
      elements.set(el, {
        ogTabIndex: ogTabIndex,
        ogDisabled: ogDisabled,
        ogPointerEvents: ogPointerEvents
      });
      el.setAttribute("tabindex", "-1");
      el.setAttribute("disabled", "disabled");
      el.style.pointerEvents = "none";
    }

    currentContainer.addEventListener("mousedown", preventActionFn, true);
    currentContainer.addEventListener("mouseup", preventActionFn, true);
    currentContainer.addEventListener("select", preventActionFn, true);
    currentContainer.addEventListener("touchstart", preventActionFn, true);
    currentContainer.addEventListener("touchend", preventActionFn, true);
    currentContainer.addEventListener("click", preventActionFn, true);
    currentContainer.addEventListener("dblclick", preventActionFn, true);
    currentContainer.addEventListener("drag", preventActionFn, true);
    currentContainer.addEventListener("drop", preventActionFn, true);
    currentContainer.addEventListener("keydown", preventActionFn, true);
    currentContainer.addEventListener("keypress", preventActionFn, true);
    currentContainer.addEventListener("keyup", preventActionFn, true);
  };

  function restoreAction() {
    try {
      currentContainer?.removeEventListener("mousedown", preventActionFn, true);
      currentContainer?.removeEventListener("mouseup", preventActionFn, true);
      currentContainer?.removeEventListener("select", preventActionFn, true);
      currentContainer?.removeEventListener("touchstart", preventActionFn, true);
      currentContainer?.removeEventListener("touchend", preventActionFn, true);
      currentContainer?.removeEventListener("click", preventActionFn, true);
      currentContainer?.removeEventListener("dblclick", preventActionFn, true);
      currentContainer?.removeEventListener("drag", preventActionFn, true);
      currentContainer?.removeEventListener("drop", preventActionFn, true);
      currentContainer?.removeEventListener("keydown", preventActionFn, true);
      currentContainer?.removeEventListener("keypress", preventActionFn, true);
      currentContainer?.removeEventListener("keyup", preventActionFn, true);

      if (clickableElements?.length) {
        for (var i = 0; i < clickableElements.length; i++) {
          var el = clickableElements[i];
          var storedEl = elements.get(el);

          if (storedEl) {
            if (storedEl.ogTabIndex === null) {
              el.removeAttribute("tabindex");
            } else {
              el.setAttribute("tabindex", storedEl.ogTabIndex || "");
            }

            if (storedEl.ogDisabled === null) {
              el.removeAttribute("disabled");
            } else {
              el.setAttribute("disabled", storedEl.ogDisabled || "");
            }

            el.style.pointerEvents = storedEl.ogPointerEvents;
          }
        }

        if (focusedElement && focusedElementOnBlur === document.activeElement) {
          focusedElement.focus();
        }
      }

      focusedElement = null;
      focusedElementOnBlur = null;
      clickableElements = undefined;
    } catch (error) {
      if (error instanceof DOMException) {
        focusedElement = null;
        focusedElementOnBlur = null;
        clickableElements = undefined;
      } else {
        throw error;
      }
    }
  };

  return [ preventAction, restoreAction];
};

module.exports = prevent;