class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    appendNumber(number) {
        // If the current operand is '0' or a result like "Even"/"Odd", replace it
        if (this.currentOperand === '0' || this.currentOperand === 'Even' || this.currentOperand === 'Odd' || this.currentOperand === 'Error') {
            this.currentOperand = '';
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' || this.currentOperand === 'Error') return;
        
        // Handle the special '%' case
        if (operation === '%') {
            this.handleOddEven();
            return;
        }
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    handleOddEven() {
        const number = parseFloat(this.currentOperand);
        if (isNaN(number) || !Number.isInteger(number)) {
            this.currentOperand = 'Error'; // Can only check integers
        } else {
            this.currentOperand = number % 2 === 0 ? 'Even' : 'Odd';
        }
        this.operation = undefined;
        this.previousOperand = '';
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case 'X':
                computation = prev * current;
                break;
            case '÷':
                if(current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }
    
getDisplayNumber(number) {
        // Return non-numeric results immediately
        if (number === 'Error' || number === 'Even' || number === 'Odd') return number;

        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            const MAX_DECIMALS = 6;
            const roundedNumber = parseFloat(parseFloat(number).toFixed(MAX_DECIMALS));
            return roundedNumber.toLocaleString('en', {maximumFractionDigits: MAX_DECIMALS});
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// --- DOM Element Selection ---
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// --- Initialize Calculator ---
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// --- Event Listeners ---
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
});
