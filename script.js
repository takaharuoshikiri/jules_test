document.addEventListener('DOMContentLoaded', () => {
    const foodItemInput = document.getElementById('food-item');
    const caloriesInput = document.getElementById('calories');
    const proteinInput = document.getElementById('protein');
    const lipidInput = document.getElementById('lipid');
    const carbohydrateInput = document.getElementById('carbohydrate');
    const addButton = document.getElementById('add-button');
    const foodList = document.getElementById('food-list');
    const totalCaloriesDisplay = document.getElementById('total-calories');

    // Target intake elements
    const targetCaloriesInput = document.getElementById('target-calories');
    const targetProteinInput = document.getElementById('target-protein');
    const targetLipidInput = document.getElementById('target-lipid');
    const targetCarbohydrateInput = document.getElementById('target-carbohydrate');
    const saveTargetsButton = document.getElementById('save-targets-button');

    // Chart instances
    let intakeChartInstance = null;
    let pfcChartInstance = null;

    let items = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalLipid = 0;
    let totalCarbohydrate = 0;

    // Global variables for target intake
    let targetCalories = 0;
    let targetProtein = 0;
    let targetLipid = 0;
    let targetCarbohydrate = 0;

    addButton.addEventListener('click', addItem);
    saveTargetsButton.addEventListener('click', saveTargets);

    function saveTargets() {
        const tc = parseInt(targetCaloriesInput.value);
        const tp = parseInt(targetProteinInput.value);
        const tl = parseInt(targetLipidInput.value);
        const tcarb = parseInt(targetCarbohydrateInput.value);

        if (isNaN(tc) || tc < 0 ||
            isNaN(tp) || tp < 0 ||
            isNaN(tl) || tl < 0 ||
            isNaN(tcarb) || tcarb < 0) {
            alert('すべての目標値は有効な正の数値で入力してください。');
            return;
        }

        targetCalories = tc;
        targetProtein = tp;
        targetLipid = tl;
        targetCarbohydrate = tcarb;

        alert('目標摂取量が保存されました！');
        // Optionally, clear the input fields or update display elsewhere
        // For now, we just store them in variables.
        // console.log('Targets saved:', targetCalories, targetProtein, targetLipid, targetCarbohydrate);
        updateCharts(); // Update charts when targets are saved
    }

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
        updateTotalIntake();

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
        updateTotalIntake();
    }

    function updateTotalIntake() {
        totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
        totalProtein = items.reduce((sum, item) => sum + item.protein, 0);
        totalLipid = items.reduce((sum, item) => sum + item.lipid, 0);
        totalCarbohydrate = items.reduce((sum, item) => sum + item.carbohydrate, 0);

        totalCaloriesDisplay.textContent = `${totalCalories} kcal`;
        // console.log('Totals updated:', totalCalories, totalProtein, totalLipid, totalCarbohydrate);
        updateCharts(); // Update charts when total intake is updated
    }

    function renderIntakeComparisonChart() {
        const ctx = document.getElementById('intakeComparisonChart').getContext('2d');
        if (intakeChartInstance) {
            intakeChartInstance.destroy();
        }
        intakeChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['カロリー (kcal)', 'タンパク質 (g)', '脂質 (g)', '炭水化物 (g)'],
                datasets: [
                    {
                        label: '現在の摂取量',
                        data: [totalCalories, totalProtein, totalLipid, totalCarbohydrate],
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '目標量',
                        data: [targetCalories, targetProtein, targetLipid, targetCarbohydrate],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    function renderPFCBalanceChart() {
        const ctx = document.getElementById('pfcBalanceChart').getContext('2d');
        const pfcData = calculatePFCBalance();
        if (pfcChartInstance) {
            pfcChartInstance.destroy();
        }
        pfcChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['タンパク質 (%)', '脂質 (%)', '炭水化物 (%)'],
                datasets: [{
                    label: 'PFCバランス',
                    data: [pfcData.protein, pfcData.lipid, pfcData.carbohydrate],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(255, 205, 86, 0.7)',
                        'rgba(54, 162, 235, 0.7)'
                    ],
                    hoverOffset: 4
                }]
            }
        });
    }

    function updateCharts() {
        renderIntakeComparisonChart();
        renderPFCBalanceChart();
    }

    function calculatePFCBalance() {
        const caloriesPerProtein = 4;
        const caloriesPerCarb = 4;
        const caloriesPerLipid = 9;

        const caloriesFromProtein = totalProtein * caloriesPerProtein;
        const caloriesFromCarbs = totalCarbohydrate * caloriesPerCarb;
        const caloriesFromLipid = totalLipid * caloriesPerLipid;

        const totalMacroCalories = caloriesFromProtein + caloriesFromCarbs + caloriesFromLipid;

        let proteinPercentage = 0;
        let lipidPercentage = 0;
        let carbPercentage = 0;

        if (totalMacroCalories > 0) {
            proteinPercentage = (caloriesFromProtein / totalMacroCalories) * 100;
            lipidPercentage = (caloriesFromLipid / totalMacroCalories) * 100;
            carbPercentage = (caloriesFromCarbs / totalMacroCalories) * 100;
        }

        return {
            protein: proteinPercentage,
            lipid: lipidPercentage,
            carbohydrate: carbPercentage
        };
    }

    // Initial chart rendering
    updateCharts();
});
