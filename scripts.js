let shoppingList = [];

function updateShoppingList() {
  // Create a map to group ingredients by name
  const ingredientMap = new Map();

  // Iterate over the shopping list to group and sum quantities
  shoppingList.forEach((item) => {
    if (ingredientMap.has(item.name)) {
      const existingEntry = ingredientMap.get(item.name);
      if (existingEntry[item.quantityMetric]) {
        // If the metric matches, add the quantities
        existingEntry[item.quantityMetric] += item.quantityValue;
      } else {
        // If the metric doesn't match, add a new metric entry
        existingEntry[item.quantityMetric] = item.quantityValue;
      }
    } else {
      // If the ingredient doesn't exist in the map, create a new entry
      ingredientMap.set(item.name, {
        [item.quantityMetric]: item.quantityValue,
      });
    }
  });

  // Convert the map to an array and sort it alphabetically by ingredient name
  const sortedIngredients = Array.from(ingredientMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // Get the shopping list container
  const shoppingListContainer = document.getElementById(
    "shopping-list-container"
  );

  // Clear the current list
  shoppingListContainer.innerHTML = "";

  // Create a ul element
  const ul = document.createElement("ul");

  // Iterate over the sorted ingredients to create the final list
  sortedIngredients.forEach(([name, quantities]) => {
    const li = document.createElement("li");
    const quantityStrings = Object.entries(quantities).map(
      ([metric, value]) => `${value} ${metric}`
    );
    li.textContent = `${name}: ${quantityStrings.join(", ")}`;
    ul.appendChild(li);
  });

  // Append the ul to the shopping list container
  shoppingListContainer.appendChild(ul);

  // Create a button to copy the list to the clipboard
  const copyButton = document.createElement("button");
  copyButton.textContent = "Copy to Clipboard";
  copyButton.onclick = () => {
    // Create a temporary textarea to hold the list text
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = sortedIngredients
      .map(([name, quantities]) => {
        const quantityStrings = Object.entries(quantities).map(
          ([metric, value]) => `${value} ${metric}`
        );
        return `${name}: ${quantityStrings.join(", ")}`;
      })
      .join("\n");
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);

    // Optionally, provide feedback that the list was copied
    copyButton.textContent = "Copied!";
    setTimeout(() => (copyButton.textContent = "Copy to Clipboard"), 2000);
  };

  // Append the copy button to the shopping list container
  shoppingListContainer.appendChild(copyButton);

  // Create a button to reset the recipe selection and clear the shopping list
  const resetButton = document.createElement("button");
  resetButton.className = "reset-button";
  resetButton.textContent = "Reset Selection";
  resetButton.onclick = () => {
    // Clear the shopping list array
    shoppingList = [];

    // Uncheck all checkboxes
    document.querySelectorAll(".recipe-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Clear the shopping list container
    shoppingListContainer.innerHTML = "";

    // Optionally, provide feedback that the selection was reset
    resetButton.textContent = "Selection Reset!";
    setTimeout(() => (resetButton.textContent = "Reset Selection"), 2000);
  };

  // Append the reset button to the shopping list container
  shoppingListContainer.appendChild(resetButton);
}

// Fetch the JSON file and display recipes
fetch("recipes.json")
  .then((response) => response.json())
  .then((data) => {
    const recipesContainer = document.getElementById("recipes-container");
    data.recipes.forEach((recipe, recipeIndex) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.className = "recipe";

      const recipeHeader = document.createElement("div");
      recipeHeader.className = "recipe-header";

      // Create the checkbox for adding to shopping list
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "recipe-checkbox print-hide";
      checkbox.onclick = (e) => {
        e.stopPropagation(); // Prevent expanding the recipe when clicking the checkbox
        if (checkbox.checked) {
          // Add ingredients to the shopping list
          recipe.ingredients.forEach((ingredient) => {
            shoppingList.push({ ...ingredient });
          });
        } else {
          // Remove ingredients from the shopping list
          recipe.ingredients.forEach((ingredient) => {
            shoppingList = shoppingList.filter(
              (item) =>
                item.name !== ingredient.name ||
                item.quantityValue !== ingredient.quantityValue
            );
          });
        }
        updateShoppingList();
      };

      const recipeName = document.createElement("h2");
      const recipeNameIndex = document.createElement("span");
      const recipeNameContent = document.createElement("span");
      recipeNameIndex.textContent = `${recipeIndex + 1}. `;
      recipeNameIndex.className = "recipe-name-index print-hide";
      recipeNameContent.textContent = recipe.name;
      recipeName.appendChild(recipeNameIndex);
      recipeName.appendChild(recipeNameContent);

      recipeHeader.appendChild(recipeName);
      recipeHeader.appendChild(checkbox);

      recipeDiv.appendChild(recipeHeader);

      const recipeContent = document.createElement("div");
      recipeContent.className = "recipe-content";

      const printButton = document.createElement("button");
      printButton.className = "print-button print-hide";
      printButton.textContent = "Printează rețeta";
      printButton.onclick = () => printRecipe(recipeDiv);

      recipeContent.appendChild(printButton);

      const a = document.createElement("a");
      a.href = recipe.videoLink;
      a.target = "_blank";
      a.textContent = "Vezi pe Youtube";
      a.className = "video-link print-hide";
      recipeContent.appendChild(a);

      const ingredientsTitle = document.createElement("h3");
      ingredientsTitle.textContent = "Ingrediente";
      recipeContent.appendChild(ingredientsTitle);

      const ingredientsTable = document.createElement("table");
      const tableHeader = document.createElement("tr");
      const headerName = document.createElement("th");
      headerName.textContent = "Nume";
      const headerQuantity = document.createElement("th");
      headerQuantity.textContent = "Cantitate";
      tableHeader.appendChild(headerName);
      tableHeader.appendChild(headerQuantity);
      ingredientsTable.appendChild(tableHeader);

      recipe.ingredients.forEach((ingredient) => {
        const ingredientRow = document.createElement("tr");
        const ingredientName = document.createElement("td");
        ingredientName.textContent = ingredient.name;
        const ingredientQuantity = document.createElement("td");
        ingredientQuantity.textContent = `${ingredient.quantityValue} ${ingredient.quantityMetric}`;
        ingredientRow.appendChild(ingredientName);
        ingredientRow.appendChild(ingredientQuantity);
        ingredientsTable.appendChild(ingredientRow);
      });
      recipeContent.appendChild(ingredientsTable);

      const instructionsTitle = document.createElement("h3");
      instructionsTitle.textContent = "Instrucțiuni";
      recipeContent.appendChild(instructionsTitle);

      const recipeInstructions = document.createElement("p");
      recipeInstructions.className = "instructions";
      recipeInstructions.textContent = recipe.instructions;
      recipeContent.appendChild(recipeInstructions);

      recipeDiv.appendChild(recipeContent);

      // Toggle the visibility of the recipe content
      recipeHeader.onclick = () => {
        if (
          recipeContent.style.display === "none" ||
          recipeContent.style.display === ""
        ) {
          recipeContent.style.display = "block";
        } else {
          recipeContent.style.display = "none";
        }
      };

      recipesContainer.appendChild(recipeDiv);
    });
  });

function printRecipe(recipeDiv) {
  const printWindow = window.open("", "", "width=800,height=600");
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
                .print-button, .recipe-name-index, .video-link, .print-hide { display: none; }
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
