document.addEventListener("DOMContentLoaded", () => {
    const inputBox = document.getElementById("inputBox");
    let currentInput = "0";
    let shouldResetScreen = false;
    let hasOperation = false; // check operation
    let history = [];
    let results = '';


    const updateInputBox = () => {
        inputBox.value = currentInput;
    };


    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (shouldResetScreen) {
                currentInput = '';
                shouldResetScreen = false;
            }

            if (value === "." && currentInput.includes(".")) return;
            if (value === '00' && (currentInput === '' || currentInput === '0')) return;
            if (currentInput === '0' && value !== '.' && !['00', '.'].includes(value)) {
                currentInput = value;
            } else {
                currentInput += value;
            }
            updateInputBox();
            hasOperation = false;
        });
    });



    document.querySelectorAll('[data-operation]').forEach(button => {
        button.addEventListener('click', () => {
            const operation = button.textContent;

            if (operation === '%') {
                currentInput = (parseFloat(currentInput) / 100).toString();
                updateInputBox();
                return;
            }

            if (hasOperation) return;

            currentInput += operation;
            hasOperation = true;
            shouldResetScreen = false;
            updateInputBox();

        });
    });

    document.querySelector('[data-clear-all]').addEventListener('click', () => {
        currentInput = '0';
        shouldResetScreen = true;
        updateInputBox();
    });

    document.querySelector('[data-clear]').addEventListener('click', () => {
        currentInput = currentInput.slice(0, -1);
        hasOperation = false;
        updateInputBox();
    });


    document.querySelector('[data-equals]').addEventListener('click', () => {
        try {
            if (currentInput.includes('/0')) {
                throw new Error("Không thể chia cho 0");
            }

            const result = eval(currentInput);

            if (!isFinite(result) || isNaN(result)) {
                throw new Error("Lỗi tính toán");
            }

            currentInput = result.toString();
            shouldResetScreen = true;
            updateInputBox();
        } catch (error) {
            currentInput = 'Lỗi tính toán';
            shouldResetScreen = true;
            updateInputBox();
        }
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (key >= '0' && key <= '9' || key === '.') {
            document.querySelectorAll('[data-number]').forEach(button => {
                if (button.textContent.trim() === key) {
                    button.click();
                }
            });
        } else if (key === 'Backspace') {
            document.querySelector('[data-clear]')?.click();
        } else if (key === 'Escape') {
            document.querySelector('[data-clear-all]')?.click();
        } else if ('+-*/'.includes(key)) {
            document.querySelectorAll('[data-operation]').forEach(button => {
                if (button.textContent.trim() === key) {
                    button.click();
                }
            });
        } else if (key === 'Enter' || key === '=') {
            document.querySelector('[data-equals]')?.click();
        }
    });

});