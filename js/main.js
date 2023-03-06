const calculator = document.querySelector(".container");
const display = calculator.querySelector(".display");
const keys = calculator.querySelector(".keys");

// Helper functions
const degreeToRad = (angle) => {
  return (angle * Math.PI) / 180;
};
const radToDegree = (angle) => {
  return (angle * 180) / Math.PI;
};
// coreFunctions
const calculate = (firstOperand, operator, secondOperand) => {
  switch (operator) {
    case "plus":
      return firstOperand + secondOperand;
    case "minus":
      return firstOperand - secondOperand;
    case "times":
      return firstOperand * secondOperand;
    case "divide":
      return firstOperand / secondOperand;
    case "power":
      return firstOperand ** secondOperand;
    case "root":
      return Math.sqrt(firstOperand).toFixed(3);
    case "sin":
      return Math.sin(degreeToRad(firstOperand)).toFixed(4);
    case "cos":
      return Math.cos(degreeToRad(firstOperand)).toFixed(4);
    case "tan":
      return Math.tan(degreeToRad(firstOperand)).toFixed(4);
    case "asin":
      return radToDegree(Math.asin(firstOperand)).toFixed(2);
    case "acos":
      return radToDegree(Math.acos(firstOperand)).toFixed(2);
    case "atan":
      return radToDegree(Math.atan(firstOperand)).toFixed(2);
    case "log":
      return Math.log10(firstOperand).toFixed(4);
    case "log-inverse":
      return 10 ** firstOperand;
    case "natural-log":
      return Math.log(firstOperand).toFixed(4);
    case "exp":
      return Math.exp(firstOperand);
    default:
      break;
  }
};
const reset = (button) => {
  if (button.textContent !== "CE") {
    delete calculator.dataset.firstValue;
    delete calculator.dataset.secondValue;
    delete calculator.dataset.modifierValue;
    delete calculator.dataset.operator;
    delete calculator.dataset.spop;
  } else button.textContent = "A.C";
  display.textContent = "0";
};

const getdisplayValue = (buttonType = "") => {
  const displayValue = display.textContent;
  if (buttonType !== "number" && buttonType !== "decimal") {
    if (calculator.dataset.spop) {
      console.log("entered");
      const [, key, text] = calculator.dataset.spop.split(",");
      const firstOperand = displayValue.replace(text, "");
      delete calculator.dataset.spop;
      return calculate(parseFloat(firstOperand), key, "");
    }
  }
  return displayValue;
};
const handleOperator = (button, calculator) => {
  button.classList.add("is-pressed");
  const firstValue = parseFloat(calculator.dataset.firstValue);
  const { operator, previousKey } = calculator.dataset;
  const displayValue = getdisplayValue();
  const secondValue = parseFloat(displayValue);

  if (
    typeof firstValue === "number" &&
    operator &&
    previousKey !== "equal" &&
    previousKey !== "operator"
  ) {
    const newResult = calculate(firstValue, operator, secondValue);
    display.textContent = newResult;
    calculator.dataset.firstValue = newResult;
  } else display.textContent = parseFloat(displayValue) * 1;

  calculator.dataset.firstValue = display.textContent;
};
const handleNumbers = (button, calculator) => {
  const displayValue = getdisplayValue("number");
  const { previousKey } = calculator.dataset;
  const { key, buttonType } = button.dataset;
  if (displayValue === "0" || previousKey === "operator") {
    if (buttonType === "number") display.textContent = key;
    else display.textContent = button.textContent;
  } else if (buttonType === "number") display.textContent += key;
  else display.textContent += button.textContent;

  if (previousKey === "equal") {
    reset(button);
    display.textContent = key;
  }
  if (buttonType === "sp-op")
    calculator.dataset.spop = [buttonType, key, button.textContent];
};
const handleDecimal = (button) => {
  const { previousKey, buttonType } = button.dataset;
  const displayValue = getdisplayValue(buttonType);
  if (previousKey === "equal") reset(button);
  if (previousKey === "operator") display.textContent = 0;
  if (!displayValue.includes(".")) display.textContent += ".";
};

const handleEqualKey = (calculator) => {
  const firstValue = parseFloat(calculator.dataset.firstValue);
  const modifierValue = parseFloat(calculator.dataset.modifierValue);
  const displayValue = getdisplayValue();
  const secondValue = modifierValue || parseFloat(displayValue);
  const { operator } = calculator.dataset;

  if (typeof firstValue === "number" && operator) {
    const newResult = calculate(firstValue, operator, secondValue);
    display.textContent = newResult;
    calculator.dataset.firstValue = newResult;
    calculator.dataset.modifierValue = secondValue;
  } else display.textContent = parseFloat(displayValue) * 1;
};
const changekeyMode = (keys, button) => {
  const slideWidth = getComputedStyle(keys).width;
  const { key } = button.dataset;
  if (key === "right") keys.style.setProperty("left", `-100%`);
  if (key === "left") keys.style.setProperty("left", 0);
  console.log(keys.style.left);
};
keys.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;
  const button = e.target;
  const { buttonType } = button.dataset;

  // Release operator pressed state
  const operatorKeys = [...keys.children].filter(
    (child) => child.dataset.buttonType === "operator"
  );
  operatorKeys.forEach((opKey) => opKey.classList.remove("is-pressed"));

  switch (buttonType) {
    case "operator":
      if (calculator.dataset.previousKey !== "operator")
        handleOperator(button, calculator);
      calculator.dataset.operator = button.dataset.key;
      break;
    case "number":
    case "sp-op":
      handleNumbers(button, calculator);
      break;
    case "decimal":
      handleDecimal(button);
      break;
    case "equal":
      handleEqualKey(calculator);
      break;
    case "clear":
      reset(button);
      break;
    case "mode":
      changekeyMode(keys, button);
      break;
    default:
      break;
  }
  if (buttonType !== "clear") {
    const clearButton = calculator.querySelector("[data-button-type=clear]");
    clearButton.textContent = "CE";
  }
  if (buttonType !== "mode") calculator.dataset.previousKey = buttonType;
});
