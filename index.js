function prevent() {
  var focusedElement;
  var focusedElementOnBlur;
  var currentContainer;
  var clickableElements;
  var elements = new Map();
  var events = ["mousedown", "mouseup", "mousemove", "touchstart", "touchend", "touchmove", "click", "dblclick", "contextmenu", "drag", "dragend", "dragstart", "drop", "scroll", "keydown", "keypress", "keyup"];

  function preventActionFn(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function preventAction(container = document.body) {
    restoreAction();

    if (!container) return;
    if (typeof container === "string") {
      var element = document.querySelector(container);
      if (!element) return;
      currentContainer = element;
    } else {
      currentContainer = container;
    }

    var activeElement = document.activeElement;

    clickableElements = currentContainer.querySelectorAll(
      "input, textarea, button, select, a, details, area, frame, iframe, [contentEditable], [tabindex]"
    );

    for (var i = 0; i < clickableElements.length; i++) {
      var el = clickableElements[i];

      if (activeElement === el) {
        focusedElement = activeElement;
        focusedElement.blur();
        focusedElementOnBlur = document.activeElement;
      }

      elements.set(el, {
        ogTabIndex: el.getAttribute("tabindex"),
        ogDisabled: el.getAttribute("disabled"),
        ogStyle: el.getAttribute("style"),
      });

      el.setAttribute("tabindex", "-1");
      el.setAttribute("disabled", "disabled");
      el.style.pointerEvents = "none";
    }

    for (var j = 0; j < currentContainer.children.length; j++) {
      var element = currentContainer.children[j];
      for (var i = 0; i < events.length; i++) {
        element.addEventListener(events[i], preventActionFn, true);
      }
    }
  }

  function restoreAction() {
    try {
      if (currentContainer) {
        for (var j = 0; j < currentContainer.children.length; j++) {
          var element = currentContainer.children[j];
          for (var i = 0; i < events.length; i++) {
            element.removeEventListener(events[i], preventActionFn, true);
          }
        }
      }

      if (clickableElements && clickableElements.length) {
        for (var i = 0; i < clickableElements.length; i++) {
          var el = clickableElements[i];
          var storedEl = elements.get(el);

          if (storedEl.ogTabIndex === null) {
            el.removeAttribute("tabindex");
          } else {
            el.setAttribute("tabindex", storedEl.ogTabIndex);
          }

          if (storedEl.ogDisabled === null) {
            el.removeAttribute("disabled");
          } else {
            el.setAttribute("disabled", storedEl.ogDisabled);
          }

          if (storedEl.ogStyle === null) {
            el.removeAttribute("style");
          } else {
            el.setAttribute("style", storedEl.ogStyle);
          }
        }

        if (focusedElement && focusedElementOnBlur === document.activeElement) {
          focusedElement.focus();
        }
      }
    } catch (error) {
      if (!(error instanceof DOMException)) {
        throw error;
      }
    } finally {
      focusedElement = null;
      focusedElementOnBlur = null;
      clickableElements = undefined;
    }
  }

  return [preventAction, restoreAction];
}

module.exports = prevent;
