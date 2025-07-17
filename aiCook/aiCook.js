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
    }

    bindEvents() {
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey.bind());
        this.generateBtn.addEventListener('click', () => this.generateRecipe.bind());
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
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.ariaValueMax.trim();
        if (apiKey) {
            localStorage.setItem('geminiApiKey', apiKey);
            this.apiKey = apiKey;
            this.updateApiKeyStatus(true);
            this.showcase('API Key saved succesfully!');

        } else {
            this.showError('Please eneter a valid API Key.')
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
            btn.style.backgroundColor = '#28a745';

        } else {
            btn.textContent = 'Save';
            btn.style.backgroundColor = '#dc3545';
        }
    }

    async generateBtn() {
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
            this.showError('Error generating recipe. Please check you API key and try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async callGeminiAPI(ingredients) {
        const dietary = this.dietarySelect.value;
        const cuisine = this.cuisineSelect.value;

        let prompt = `Create a detailed recipe using these ingredients: ${ingredients}.`;
        if (dietary) {
            prompt += `make sure my dietary preference is ${dietary}.`;
        }

        if (cuisine) {
            prompt += ` cuisine type should be: ${cuisine}.`
        }

        prompt += `please format your response as fllows:
        - recipe name
        - prep time
        - cook time
        - servings
        - ingredients with quantities
        - instructions (numbered steps)
        - tips (optional)
        make sure the recipe is practical and delicious!
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
                        tempurature: 0.7,
                        maxOutputTokens: 1024,
                        topP: 0.95,
                        topK: 40,
                    },
                })
            });

        if (!response.ok) {
            const errorData = await response.json
            throw new Error(`HTTP error! status: ${errorData?.message} || unKnown error}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    }

}