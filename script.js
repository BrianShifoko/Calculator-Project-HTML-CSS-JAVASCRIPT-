document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display-text");
    let currentInput = "0";
    let operator = null;
    let firstValue = null;

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
            currentInput = String(result);
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
            currentInput = String(result);
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

    document.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", () => {
            const key = button.getAttribute("data-key");
            if (!isNaN(key) || key === ".") {
                handleNumber(key);
            } else if (["/", "*", "-", "+"].includes(key)) {
                handleOperator(key);
            } else if (key === "=") {
                handleEquals();
            } else if (key === "C") {
                handleClear();
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        const key = e.key;
        const button = document.querySelector(`.btn[data-key="${key}"]`);
        if (button) {
            button.click();
        }
    });

    updateDisplay();
});
