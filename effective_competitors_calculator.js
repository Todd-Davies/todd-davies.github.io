document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const sharesContainer = document.getElementById('shares-container');
    const addShareBtn = document.getElementById('add-share-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const totalSharesEl = document.getElementById('total-shares');
    const resultArea = document.getElementById('result-area');
    const orderSelect = document.getElementById('order');
    const customOrderGroup = document.getElementById('custom-order-group');
    const customOrderInput = document.getElementById('custom-order-input');
    
    // --- STATE ---
    // Initialize with two default market shares for the user to start.
    let shares = [50, 50];

    // --- CORE CALCULATION FUNCTION (IMPLEMENTED) ---
    /**
     * Calculates the effective number of competitors (Hill number or true diversity).
     * @param {number[]} marketShares - An array of market shares as decimals (e.g., [0.5, 0.25, 0.25]).
     * @param {number} order - The order 'q' of the generalized entropy.
     * @returns {number} The calculated effective number of competitors.
     */
    function calculateEffectiveCompetitors(marketShares, order) {
        console.log('Calculating with shares:', marketShares, 'and order (q):', order);

        // Filter out any competitors with zero market share as they don't contribute.
        const validShares = marketShares.filter(share => share > 0);

        if (validShares.length === 0) {
            return 0;
        }
        
        // --- Handle the three cases for the order 'q' ---

        // Case q = 1 (Shannon Diversity): This is a special case requiring natural logarithms.
        // The formula is exp(-Σ(p_i * ln(p_i))).
        if (order === 1) {
            const shannonEntropy = validShares.reduce((sum, p) => {
                return sum - (p * Math.log(p));
            }, 0);
            return Math.exp(shannonEntropy);
        }

        // General case for q != 1 (covers q=0 Richness and q=2 HHI)
        // The formula is (Σ(p_i^q))^(1 / (1 - q))
        const sumOfPowers = validShares.reduce((sum, p) => {
            return sum + Math.pow(p, order);
        }, 0);

        // If for some reason the sum is zero, return 0 to avoid errors.
        if (sumOfPowers === 0) {
            return 0;
        }
        
        // For q=0, this correctly calculates to validShares.length.
        return Math.pow(sumOfPowers, 1 / (1 - order));
    }
    
    // --- UI & EVENT HANDLING ---

    /**
     * Renders the input fields for market shares based on the current state.
     */
    function renderShares() {
        sharesContainer.innerHTML = ''; // Clear existing inputs
        shares.forEach((share, index) => {
            const div = document.createElement('div');
            div.className = 'share-row';
            
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control'; 
            input.value = share;
            input.placeholder = 'e.g. 25';
            input.min = '0';
            input.max = '100';
            input.addEventListener('input', () => updateShare(index, input.value));
            
            const button = document.createElement('button');
            button.className = 'btn remove-share-btn'; 
            button.innerHTML = '&times;';
            button.setAttribute('aria-label', `Remove share ${index + 1}`);
            button.addEventListener('click', () => removeShare(index));

            div.appendChild(input);
            div.appendChild(button);
            sharesContainer.appendChild(div);
        });
        updateTotal();
    }

    /**
     * Shows or hides the custom order input field based on dropdown selection.
     */
    orderSelect.addEventListener('change', () => {
        if (orderSelect.value === 'custom') {
            customOrderGroup.style.display = 'block';
        } else {
            customOrderGroup.style.display = 'none';
        }
    });

    /**
     * Updates the total shares display and its color.
     */
    function updateTotal() {
        const total = shares.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        totalSharesEl.textContent = `${total.toFixed(2)}%`;
        
        if (Math.abs(total - 100) < 0.01) {
            totalSharesEl.className = 'total-valid';
        } else {
            totalSharesEl.className = 'total-invalid';
        }
    }

    /**
     * Updates a share value in the state array.
     */
    const updateShare = (index, value) => {
        shares[index] = parseFloat(value) || 0;
        updateTotal();
    };

    /**
     * Adds a new share input field.
     */
    addShareBtn.addEventListener('click', () => {
        shares.push(0);
        renderShares();
    });

    /**
     * Removes a share at a given index.
     */
    const removeShare = (index) => {
        if (shares.length <= 1) { 
            displayMessage('You need at least one competitor.', 'error');
            return; 
        }
        shares.splice(index, 1);
        renderShares();
    };
    
    /**
     * Handles the main calculation logic when the button is clicked.
     */
    calculateBtn.addEventListener('click', () => {
        // 1. Validate inputs
        const total = shares.reduce((sum, val) => sum + val, 0);
        if (Math.abs(total - 100) > 0.01) {
            displayMessage('Total market share must be exactly 100%.', 'error');
            return;
        }
        
        // 2. Prepare data for the calculation function
        const decimalShares = shares.map(s => s / 100);
        let order;

        if (orderSelect.value === 'custom') {
            order = parseFloat(customOrderInput.value);
            if (isNaN(order)) {
                displayMessage('Custom order must be a valid number.', 'error');
                return;
            }
        } else {
            order = parseFloat(orderSelect.value);
        }
        
        // 3. Call the calculation function
        const result = calculateEffectiveCompetitors(decimalShares, order);
        const formattedResult = typeof result === 'number' ? result.toFixed(4) : result;

        // 4. Display the result
        displayMessage(`<div>Effective Number of Competitors:</div><strong>${formattedResult}</strong>`, 'success');
    });
    
    /**
     * Displays a message (success or error) in the result area.
     * @param {string} message - The HTML message to display.
     * @param {'success' | 'error'} type - The type of message.
     */
    function displayMessage(message, type) {
        resultArea.innerHTML = message;
        resultArea.className = `result-area ${type}`;
    }

    // --- INITIALIZATION ---
    renderShares();
});
