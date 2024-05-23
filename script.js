document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display-text");
    let currentInput = "0";
    let operator = null;
    let firstValue = null;
    let previousAnswer = null;
    let isShiftActive = false;
    let isPowerOn = true;

    const updateDisplay = () => {
        display.textContent = currentInput;
    };

    const handleNumber = (num) => {
        if (currentInput === "0" || currentInput === firstValue) {
            currentInput = num;
        } else {
            currentInput += num;
        }
        updateDisplay();
    };

    const handleOperator = (op) => {
        if (firstValue === null) {
            firstValue = currentInput;
        } else if (operator) {
            const result = calculate(firstValue, operator, currentInput);
            currentInput = formatResult(result);
            firstValue = currentInput;
        }
        operator = op;
        currentInput = firstValue;
        updateDisplay();
    };

    const calculate = (val1, op, val2) => {
        const a = parseFloat(val1);
        const b = parseFloat(val2);
        if (op === "+") return a + b;
        if (op === "-") return a - b;
        if (op === "*") return a * b;
        if (op === "/") return a / b;
    };

    const handleEquals = () => {
        if (operator && firstValue !== null) {
            const result = calculate(firstValue, operator, currentInput);
            currentInput = formatResult(result);
            previousAnswer = currentInput;
            operator = null;
            firstValue = null;
            updateDisplay();
        }
    };

    const handleClear = () => {
        currentInput = "0";
        operator = null;
        firstValue = null;
        updateDisplay();
    };

    const handleScientific = (type) => {
        const value = parseFloat(currentInput);
        let result = value;
        if (type === "sqrt") {
            result = Math.sqrt(value);
        } else if (type === "square") {
            result = Math.pow(value, 2);
        } else if (type === "reciprocal") {
            result = 1 / value;
        } else if (type === "sin") {
            result = isShiftActive ? Math.asin(value) * (180 / Math.PI) : Math.sin(value * Math.PI / 180); // Convert to degrees for inverse
        } else if (type === "cos") {
            result = isShiftActive ? Math.acos(value) * (180 / Math.PI) : Math.cos(value * Math.PI / 180); // Convert to degrees for inverse
        } else if (type === "tan") {
            result = isShiftActive ? Math.atan(value) * (180 / Math.PI) : Math.tan(value * Math.PI / 180); // Convert to degrees for inverse
        } else if (type === "log") {
            result = Math.log10(value);
        } else if (type === "ln") {
            result = Math.log(value);
        }
        currentInput = formatResult(result);
        updateDisplay();
    };

    const handleShift = () => {
        isShiftActive = !isShiftActive;
        document.querySelector('.shift').classList.toggle('active', isShiftActive);
    };

    const handlePower = (state) => {
        isPowerOn = state === 'on';
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (button.dataset.key !== 'on') {
                button.classList.toggle('disabled', !isPowerOn);
            }
        });
        if (!isPowerOn) {
            display.classList.add('off');
            setTimeout(() => { display.textContent = ""; }, 5);
        } else {
            display.classList.remove('off');
            currentInput = "0";
            updateDisplay();
        }
    };

    const handleAns = () => {
        if (previousAnswer !== null) {
            currentInput = previousAnswer;
            updateDisplay();
        }
    };

    const formatResult = (result) => {
        if (result % 1 !== 0) {
            return result.toFixed(10).replace(/\.?0+$/, '');
        }
        return result;
    };

    document.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", () => {
            const key = button.getAttribute("data-key");
            if (isPowerOn) {
                if (!isNaN(key) || key === ".") {
                    handleNumber(key);
                } else if (["/", "*", "-", "+"].includes(key)) {
                    handleOperator(key);
                } else if (key === "=") {
                    handleEquals();
                } else if (key === "C") {
                    handleClear();
                } else if (key === "shift") {
                    handleShift();
                } else if (key === "ans") {
                    handleAns();
                } else if (["sqrt", "square","reciprocal", "sin", "cos", "tan", "log", "ln"].includes(key)) {
                    handleScientific(key);
                }
            }

            if (key === "on") {
                handlePower("on");
            } else if (key === "off") {
                handlePower("off");
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        if (isPowerOn) {
            const key = e.key;
            const button = document.querySelector(`.btn[data-key="${key}"]`);
            if (button && !button.classList.contains("disabled")) {
                button.click();
            }
        }
    });

    updateDisplay();
});

