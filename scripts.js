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
            printButton.onclick = () => printRecipe(recipeDiv);

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

function printRecipe(recipeDiv) {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Printează rețeta</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h2 { margin-top: 0; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                table, th, td { border: 1px solid black; }
                th, td { padding: 8px; text-align: left; }
                .instructions { white-space: pre-line; }
            </style>
        </head>
        <body>
            <div class="recipe">
                ${recipeDiv.innerHTML}
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onafterprint = () => {
        printWindow.close();
    };
    printWindow.print();
}
