// Fetch the JSON file and display recipes
fetch('recipes.json')
.then(response => response.json())
.then(data => {
    const recipesContainer = document.getElementById('recipes-container');
    data.recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';

        const recipeHeader = document.createElement('div');
        recipeHeader.style.display = 'flex';
        recipeHeader.style.justifyContent = 'space-between';
        recipeHeader.style.alignItems = 'center';

        const recipeName = document.createElement('h2');
        recipeName.textContent = recipe.name;
        recipeHeader.appendChild(recipeName);

        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.textContent = 'Printează rețeta';
        printButton.onclick = () => {
            const printContents = recipeDiv.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        };
        recipeHeader.appendChild(printButton);

        recipeDiv.appendChild(recipeHeader);

        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = 'Ingrediente';
        recipeDiv.appendChild(ingredientsTitle);

        const ingredientsTable = document.createElement('table');
        const tableHeader = document.createElement('tr');
        const headerName = document.createElement('th');
        headerName.textContent = 'Nume';
        const headerQuantity = document.createElement('th');
        headerQuantity.textContent = 'Cantitate';
        tableHeader.appendChild(headerName);
        tableHeader.appendChild(headerQuantity);
        ingredientsTable.appendChild(tableHeader);

        recipe.ingredients.forEach(ingredient => {
            const ingredientRow = document.createElement('tr');
            const ingredientName = document.createElement('td');
            ingredientName.textContent = ingredient.name;
            const ingredientQuantity = document.createElement('td');
            ingredientQuantity.textContent = `${ingredient.quantityValue} ${ingredient.quantityMetric}`;
            ingredientRow.appendChild(ingredientName);
            ingredientRow.appendChild(ingredientQuantity);
            ingredientsTable.appendChild(ingredientRow);
        });
        recipeDiv.appendChild(ingredientsTable);

        const instructionsTitle = document.createElement('h3');
        instructionsTitle.textContent = 'Instrucțiuni';
        recipeDiv.appendChild(instructionsTitle);

        const recipeInstructions = document.createElement('p');
        recipeInstructions.className = 'instructions';
        recipeInstructions.textContent = recipe.instructions;
        recipeDiv.appendChild(recipeInstructions);

        recipesContainer.appendChild(recipeDiv);
    });
});