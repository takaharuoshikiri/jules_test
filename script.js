document.addEventListener('DOMContentLoaded', () => {
    const foodItemInput = document.getElementById('food-item');
    const caloriesInput = document.getElementById('calories');
    const proteinInput = document.getElementById('protein');
    const lipidInput = document.getElementById('lipid');
    const carbohydrateInput = document.getElementById('carbohydrate');
    const addButton = document.getElementById('add-button');
    const foodList = document.getElementById('food-list');
    const totalCaloriesDisplay = document.getElementById('total-calories');

    let items = [];
    let totalCalories = 0;

    addButton.addEventListener('click', addItem);

    function addItem() {
        const foodName = foodItemInput.value.trim();
        const calorieValue = parseInt(caloriesInput.value);
        const proteinValue = parseInt(proteinInput.value);
        const lipidValue = parseInt(lipidInput.value);
        const carbohydrateValue = parseInt(carbohydrateInput.value);

        if (foodName === '' || isNaN(calorieValue) || calorieValue < 0 ||
            isNaN(proteinValue) || proteinValue < 0 ||
            isNaN(lipidValue) || lipidValue < 0 ||
            isNaN(carbohydrateValue) || carbohydrateValue < 0) {
            alert('有効な食べ物名、カロリー、タンパク質、脂質、炭水化物を入力してください。');
            return;
        }

        const newItem = {
            name: foodName,
            calories: calorieValue,
            protein: proteinValue,
            lipid: lipidValue,
            carbohydrate: carbohydrateValue
        };
        items.push(newItem);

        renderItems();
        updateTotalCalories();

        foodItemInput.value = '';
        caloriesInput.value = '';
        proteinInput.value = '';
        lipidInput.value = '';
        carbohydrateInput.value = '';
    }

    function renderItems() {
        foodList.innerHTML = ''; // Clear existing items
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name}: ${item.calories} kcal (P: ${item.protein}g, F: ${item.lipid}g, C: ${item.carbohydrate}g)`;
            
            // Add delete button for each item
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.style.marginLeft = '10px';
            deleteButton.addEventListener('click', () => {
                deleteItem(index);
            });
            listItem.appendChild(deleteButton);
            
            foodList.appendChild(listItem);
        });
    }

    function deleteItem(indexToDelete) {
        items.splice(indexToDelete, 1);
        renderItems();
        updateTotalCalories();
    }

    function updateTotalCalories() {
        totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
        totalCaloriesDisplay.textContent = `${totalCalories} kcal`;
    }
});
