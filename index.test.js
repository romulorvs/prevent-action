/**
 * @jest-environment jsdom
 */

var prevent = require("./index");

describe("Prevent Action", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("should prevent and restore actions on children of body children", () => {
    let value = 0;
    const button = document.createElement("button");
    button.onclick = () => value++;
    document.body.appendChild(button);

    const [preventAction, restoreAction] = prevent();

    preventAction();
    expect(button.tabIndex).toEqual(-1);
    expect(button.disabled).toEqual(true);
    expect(button.style.pointerEvents).toEqual("none");
    button.click();
    expect(value).toEqual(0);

    restoreAction();
    expect(button.tabIndex).toEqual(0);
    expect(button.disabled).toEqual(false);
    expect(button.style.pointerEvents).toEqual("");
    button.click();
    button.click();
    expect(value).toEqual(2);

    preventAction();
    expect(button.tabIndex).toEqual(-1);
    expect(button.disabled).toEqual(true);
    expect(button.style.pointerEvents).toEqual("none");
    button.click();
    expect(value).toEqual(2);

    preventAction();
    preventAction();
    expect(button.tabIndex).toEqual(-1);
    expect(button.disabled).toEqual(true);
    expect(button.style.pointerEvents).toEqual("none");
    button.click();
    expect(value).toEqual(2);

    restoreAction();
    expect(button.tabIndex).toEqual(0);
    expect(button.disabled).toEqual(false);
    expect(button.style.pointerEvents).toEqual("");
    button.click();
    button.click();
    expect(value).toEqual(4);
  });

  test("should prevent and restore actions on children of a string selected element", () => {
    const internalDiv = document.createElement("div");
    internalDiv.id = "internal-div";

    let internalValue = 0;
    const internalButton = document.createElement("button");
    internalButton.onclick = () => internalValue++;
    internalDiv.appendChild(internalButton);
    document.body.appendChild(internalDiv);

    let externalValue = 0;
    const externalButton = document.createElement("button");
    externalButton.onclick = () => externalValue++;
    document.body.appendChild(externalButton);

    const [preventAction, restoreAction] = prevent();

    preventAction("#internal-div");
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(0);
    expect(externalButton.disabled).toEqual(false);
    expect(externalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    expect(internalValue).toEqual(0);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(2);

    restoreAction();
    expect(internalButton.tabIndex).toEqual(0);
    expect(internalButton.disabled).toEqual(false);
    expect(internalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    expect(internalValue).toEqual(1);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(4);
  });

  test("should prevent and restore actions on children of an specific element", () => {
    const internalDiv = document.createElement("div");

    let internalValue = 0;
    const internalButton = document.createElement("button");
    internalButton.onclick = () => internalValue++;
    internalDiv.appendChild(internalButton);
    document.body.appendChild(internalDiv);

    let externalValue = 0;
    const externalButton = document.createElement("button");
    externalButton.onclick = () => externalValue++;
    document.body.appendChild(externalButton);

    const [preventAction, restoreAction] = prevent();

    const divElem = document.body.querySelector("div");
    preventAction(divElem);
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(0);
    expect(externalButton.disabled).toEqual(false);
    expect(externalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    expect(internalValue).toEqual(0);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(2);

    restoreAction();
    expect(internalButton.tabIndex).toEqual(0);
    expect(internalButton.disabled).toEqual(false);
    expect(internalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    expect(internalValue).toEqual(1);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(4);
  });

  test("should persist order of preventions", () => {
    const internalDiv = document.createElement("div");
    internalDiv.id = "internal-div";

    let internalValue = 0;
    const internalButton = document.createElement("button");
    internalButton.onclick = () => internalValue++;
    internalDiv.appendChild(internalButton);
    document.body.appendChild(internalDiv);

    let externalValue = 0;
    const externalButton = document.createElement("button");
    externalButton.onclick = () => externalValue++;
    document.body.appendChild(externalButton);

    const [preventActionInner, restoreActionInner] = prevent();
    const [preventActionOuter, restoreActionOuter] = prevent();

    preventActionInner("#internal-div");
    preventActionOuter();
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(-1);
    expect(externalButton.disabled).toEqual(true);
    expect(externalButton.style.pointerEvents).toEqual("none");

    internalButton.click();
    expect(internalValue).toEqual(0);

    externalButton.click();
    expect(externalValue).toEqual(0);

    restoreActionOuter();
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(0);
    expect(externalButton.disabled).toEqual(false);
    expect(externalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    expect(internalValue).toEqual(0);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(2);

    preventActionInner("#internal-div");
    preventActionOuter();
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(-1);
    expect(externalButton.disabled).toEqual(true);
    expect(externalButton.style.pointerEvents).toEqual("none");

    internalButton.click();
    expect(internalValue).toEqual(0);

    externalButton.click();
    expect(externalValue).toEqual(2);

    restoreActionOuter();
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(0);
    expect(externalButton.disabled).toEqual(false);
    expect(externalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    expect(internalValue).toEqual(0);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(4);

    restoreActionInner();
    expect(internalButton.tabIndex).toEqual(0);
    expect(internalButton.disabled).toEqual(false);
    expect(internalButton.style.pointerEvents).toEqual("");

    expect(externalButton.tabIndex).toEqual(0);
    expect(externalButton.disabled).toEqual(false);
    expect(externalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    internalButton.click();
    expect(internalValue).toEqual(2);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(6);

    preventActionInner("#internal-div");
    preventActionOuter();
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(-1);
    expect(externalButton.disabled).toEqual(true);
    expect(externalButton.style.pointerEvents).toEqual("none");

    internalButton.click();
    expect(internalValue).toEqual(2);

    externalButton.click();
    expect(externalValue).toEqual(6);

    restoreActionOuter();
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(0);
    expect(externalButton.disabled).toEqual(false);
    expect(externalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    expect(internalValue).toEqual(2);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(8);

    preventActionInner("#internal-div");
    preventActionOuter();
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(-1);
    expect(externalButton.disabled).toEqual(true);
    expect(externalButton.style.pointerEvents).toEqual("none");

    internalButton.click();
    expect(internalValue).toEqual(2);

    externalButton.click();
    expect(externalValue).toEqual(8);

    restoreActionOuter();
    expect(internalButton.tabIndex).toEqual(-1);
    expect(internalButton.disabled).toEqual(true);
    expect(internalButton.style.pointerEvents).toEqual("none");

    expect(externalButton.tabIndex).toEqual(0);
    expect(externalButton.disabled).toEqual(false);
    expect(externalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    expect(internalValue).toEqual(2);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(10);

    restoreActionInner();
    expect(internalButton.tabIndex).toEqual(0);
    expect(internalButton.disabled).toEqual(false);
    expect(internalButton.style.pointerEvents).toEqual("");

    expect(externalButton.tabIndex).toEqual(0);
    expect(externalButton.disabled).toEqual(false);
    expect(externalButton.style.pointerEvents).toEqual("");

    internalButton.click();
    internalButton.click();
    expect(internalValue).toEqual(4);

    externalButton.click();
    externalButton.click();
    expect(externalValue).toEqual(12);
  });

  test("should persist focus after preventAction call", () => {
    const internalDiv = document.createElement("div");
    internalDiv.id = "internal-div";

    const internalButton = document.createElement("button");
    internalDiv.appendChild(internalButton);
    document.body.appendChild(internalDiv);

    const externalButton = document.createElement("button");
    document.body.appendChild(externalButton);

    const [preventAction, restoreAction] = prevent();
    internalButton.focus();
    expect(document.activeElement).toBe(internalButton);
    preventAction("#internal-div");
    expect(document.activeElement).not.toBe(internalButton);
    restoreAction();
    expect(document.activeElement).toBe(internalButton);

    preventAction();
    expect(document.activeElement).not.toBe(internalButton);
    externalButton.focus();
    restoreAction();
    expect(document.activeElement).not.toBe(internalButton);
  });

  test("should treat exception if DOM elements got altered before restoreAction is called", () => {
    const internalDiv = document.createElement("div");
    internalDiv.id = "internal-div";

    const internalButton = document.createElement("button");
    internalDiv.appendChild(internalButton);
    document.body.appendChild(internalDiv);

    const externalButton = document.createElement("button");
    document.body.appendChild(externalButton);

    const [preventAction, restoreAction] = prevent();
    preventAction("#internal-div");
    internalDiv.innerHTML = "";
    restoreAction();
    expect(document.body.innerHTML).toBe('<div id="internal-div"></div><button></button>');

    internalDiv.appendChild(internalButton);
    internalDiv.appendChild(document.createElement("button"));
    document.body.appendChild(internalDiv);
    document.body.appendChild(externalButton);

    preventAction("#internal-div");
    internalDiv.removeChild(internalButton);
    restoreAction();
    expect(document.body.innerHTML).toBe('<div id="internal-div"><button></button></div><button></button>');
  });

  test("should return undefined if the string selected element is not found", () => {
    const [preventAction] = prevent();
    expect(typeof preventAction("xxx")).toBe("undefined");
  });

  test("should return undefined if preventAction is called with null or empty string", () => {
    const [preventAction] = prevent();
    expect(typeof preventAction("")).toBe("undefined");
    expect(typeof preventAction(null)).toBe("undefined");
  });

  test("should keep events on the container", () => {
    const internalDiv = document.createElement("div");
    internalDiv.id = "internal-div";

    const internalButton = document.createElement("button");
    internalDiv.appendChild(internalButton);
    document.body.appendChild(internalDiv);

    const [preventAction] = prevent();

    let value = 0;
    internalDiv.onclick = () => value++;

    internalDiv.click();
    internalDiv.click();
    expect(value).toBe(2);

    preventAction("#internal-div");

    internalDiv.click();
    internalDiv.click();
    expect(value).toBe(4);
  });
});
