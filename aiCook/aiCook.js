class aiCookApp {
    constructor() {
        this.apiKey = localStorage.getItem('geminiApiKey') || '';

        this.initializeElements();

        this.bindEvents();

        this.loadApiKey();
    }

    initializeElements() {
        this.apiKeyInput = document.getElementById('api-key');
        this.saveApiKeyBtn = document.getElementById('save-api-key');
        this.ingredientsInput = document.getElementById('ingredients');
        this.dietarySelect = document.getElementById('dietary');
        this.cuisineSelect = document.getElementById('cuisine');
        this.generateBtn = document.getElementById('generate-recipe');
        this.loading = document.getElementById('loading');
        this.recipeSection = document.getElementById('recipe-section');
        this.recipeContent = document.getElementById('recipe-content');
        this.printBtn = document.getElementById('print-recipe-btn');
    }

    bindEvents() {
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.generateBtn.addEventListener('click', () => this.generateRecipe());
        this.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        }
        );

        this.ingredientsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateRecipe();
            }
        }
        );

        this.printBtn.addEventListener('click', () => window.print());
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('geminiApiKey', apiKey);
            this.apiKey = apiKey;
            this.updateApiKeyStatus(true);
            this.showcase('API Key saved successfully!');

        } else {
            this.showError('Please enter a valid API Key.');
        }
    }

    loadApiKey() {
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
            this.updateApiKeyStatus(true);
        } else {
            this.updateApiKeyStatus(false)
        }
    }

    updateApiKeyStatus(isValid) {
        const btn = this.saveApiKeyBtn;
        if (isValid) {
            btn.textContent = 'Saved ';

        } else {
            btn.textContent = 'Save';
        }
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    showcase(message) {
        alert(`Success: ${message}`);
    }

    async generateRecipe() {
        if (!this.apiKey) {
            this.showError('Please enter a valid API Key.');
            return;
        }

        const ingredients = this.ingredientsInput.value.trim();
        if (!ingredients) {
            this.showError('Please enter some ingredients.');
            return;
        }

        this.showLoading(true);
        this.hideRecipe();

        try {
            const recipe = await this.callGeminiAPI(ingredients);
            this.displayRecipe(recipe);
        } catch (error) {
            console.error('error generating recipe:', error);
            this.showError('Error generating recipe. Please check your API key and try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async callGeminiAPI(ingredients) {
        const dietary = this.dietarySelect.value;
        const cuisine = this.cuisineSelect.value;

        let prompt = `Create a detailed recipe using these ingredients: ${ingredients}.`;
        if (dietary) {
            prompt += ` Make sure my dietary preference is ${dietary}.`;
        }

        if (cuisine) {
            prompt += ` The cuisine type should be: ${cuisine}.`
        }

        prompt += `Please format your response as follows:
        - 
        - prep time
        - cook time
        - servings
        - ingredients with quantities
        - instructions (numbered steps)
        - tips (optional)
        Make sure the recipe is practical and delicious!
        `;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                        topP: 0.95,
                        topK: 40,
                    },
                })
            });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    }
    formatRecipe(text) {
        text = text.replace(/(^| ) +/gm, '$1')
        text = text.replace(/^-*/gm, '')
        text = text.replace(/\*\*(.+?)\*\*/gm, '<strong>$1</strong>')
        text = text.replace(/^(.+)/g, '<h3 class="recipe-title">$1</h3>')
        text = text.replace(/^\*/gm, '•')
        text = text.replace(/^(.+)/gm, '<p>$1</p>')
        return text;
    }

    displayRecipe(recipeText) {
        // 1. Call your function and store the result
        const formattedHtml = this.formatRecipe(recipeText);
    
        // 2. Use the formatted result
        this.recipeContent.innerHTML = formattedHtml;
        this.showRecipe();
    }

    showRecipe() {
        this.recipeSection.classList.add('show');
        this.recipeSection.scrollIntoView({ behavior: 'smooth' });
    }

    showLoading(show) {
        if (show) {
            this.loading.classList.add('show');
            this.generateBtn.disabled = true;
            this.generateBtn.textContent = "Generating...";
        } else {
            this.loading.classList.remove('show');
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = "Generate Recipe";
        }
    }

    hideRecipe() {
        this.recipeSection.classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => new aiCookApp());