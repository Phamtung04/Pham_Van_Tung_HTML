document.addEventListener("DOMContentLoaded", () => {
    const inputBox = document.getElementById("inputBox");
    let currentInput = "0";
    let shouldResetScreen = false;
    let hasOperation = false; // check operation

    let history = [];

    const updateInputBox = () => {
        inputBox.value = currentInput;
    };

    const updateHistory = () => {
        const historyList = document.querySelector('.history-list');

        const modalEl = document.getElementById('exampleModal');
        const myModal = bootstrap.Modal.getOrCreateInstance(modalEl);

        if (historyList) {
            historyList.innerHTML = '';
            history.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'history-item';
                li.innerHTML = `
                    <span class="history-expression">${item.expression} = ${item.result}</span>
                    <button class="delete-button" data-index="${index}">Xóa</button>
                `;

                li.addEventListener('click', () => {
                    currentInput = item.expression;
                    updateInputBox();
                    new bootstrap.Modal(document.getElementById('exampleModal')).hide();
                    myModal.hide();
                });

                historyList.appendChild(li);
            });
        }
    }

    if (localStorage.getItem('history')) {
        try {
            const storedHistory = localStorage.getItem('history');
            if (storedHistory) {
                history = JSON.parse(storedHistory);
                updateHistory();
            }
        } catch (error) {
            console.error('Lỗi khi phân tích lịch sử từ localStorage:', error);
            history = []; // Khởi tạo lịch sử trống nếu có lỗi
        };
    }


    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (shouldResetScreen) {
                currentInput = '';
                shouldResetScreen = false;
            }
            
            if (value === ".") {
                const operands = currentInput.split(/[\+\-\*\/]/);
                const currentOperand = operands[operands.length - 1];
                if (currentOperand.includes(".")) return;
            }
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
        if (!currentInput) return;

        const originalExpression = currentInput;
        try {

            const result = eval(currentInput);
            if (!isFinite(result) || isNaN(result)) {
                throw new Error("Lỗi tính toán");
            }

            currentInput = result.toString();
            shouldResetScreen = true;
            updateInputBox();
            addHistory(originalExpression, result);
        } catch (error) {
            console.error("Lỗi tính toán:", error);
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
        } else if ('+-*/%'.includes(key)) {
            document.querySelectorAll('[data-operation]').forEach(button => {
                if (button.textContent.trim() === key) {
                    button.click();
                    console.log(button);
                }
            });
        } else if (key === 'Enter' || key === '=') {
            document.querySelector('[data-equals]')?.click();
        }
    });

    const addHistory = (expression, result) => {
        history.unshift({
            expression: expression,
            result: result
        });

        if (history.length > 10) {
            history.pop();
        }

        localStorage.setItem('history', JSON.stringify(history));
        updateHistory();
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            event.stopPropagation();
            const index = parseInt(event.target.dataset.index, 10);
            history.splice(index, 1);
            localStorage.setItem('history', JSON.stringify(history));
            updateHistory();
        }
    });


});