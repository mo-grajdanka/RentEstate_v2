document.addEventListener('DOMContentLoaded', function () {

   
    let selectedServices = {};

   
    const showResultsContainer = document.getElementById('show-results-container');
    const showResultsBtn = document.getElementById('show-results-btn');
    const resultCountSpan = document.getElementById('result-count');

   
    function countMatchingItems() {
       
        const selectedServiceNames = Object.values(selectedServices).map(s => s.service);

       
        if (selectedServiceNames.length === 0) {
            return 0;
        }

        let totalCount = 0;

       
        for (const purposeKey in dataByPurpose) {
            if (dataByPurpose.hasOwnProperty(purposeKey)) {
                const items = dataByPurpose[purposeKey];
               
                items.forEach(item => {
                   
                    if (item.suitableFor && Array.isArray(item.suitableFor)) {
                       
                       
                        const isMatch = selectedServiceNames.some(serviceName =>
                            item.suitableFor.includes(serviceName)
                        );
                        if (isMatch) {
                            totalCount++;
                        }
                    }
                });
            }
        }
        return totalCount;
    }

   
    function updateShowResultsButton() {
        const count = countMatchingItems();
        if (resultCountSpan) {
            resultCountSpan.textContent = count;
        }

       
        if (showResultsContainer) {
            if (Object.keys(selectedServices).length > 0) {
                showResultsContainer.classList.remove('hidden');
            } else {
                showResultsContainer.classList.add('hidden');
            }
        }
    }

   
    if (showResultsBtn) {
        showResultsBtn.addEventListener('click', function () {
           
            const selectedServiceNames = Object.values(selectedServices).map(s => s.service);

           
            if (selectedServiceNames.length === 0) return;

           
           
            const params = new URLSearchParams();
            selectedServiceNames.forEach(name => {
               
                params.append('suitableFor', encodeURIComponent(name));
            });

           
            const url = `./pages/list.html?${params.toString()}`;

           
            window.location.href = url;
        });
    }

   
    function toggleDropdown(button) {
        const dropdownMenu = button.nextElementSibling;
        const isOpen = !dropdownMenu.classList.contains('hidden');

       
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
        });

       
        if (!isOpen) {
            dropdownMenu.classList.remove('hidden');
        }
    }

   
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleDropdown(this);
        });
    });

   
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const category = this.dataset.category;
            const service = this.dataset.service;
            const key = `${category}-${service}`;

           
            if (selectedServices[key]) {
                delete selectedServices[key];
                this.classList.remove('bg-blue-100', 'text-blue-700');
            } else {
                selectedServices[key] = { category, service };
                this.classList.add('bg-blue-100', 'text-blue-700');
            }

           
            updateSelectedCategories();
            updateShowResultsButton();

           
            this.closest('.dropdown-menu').classList.add('hidden');
        });
    });

   
    function updateSelectedCategories() {
        const container = document.getElementById('selected-categories');
        if (!container) return;
        container.innerHTML = '';

        Object.values(selectedServices).forEach(item => {
            const badge = document.createElement('div');
            badge.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm';
            badge.innerHTML = `
                <span>${item.category} - ${item.service}</span>
                <button class="remove-btn text-blue-600 hover:text-blue-800 font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-200 transition" data-key="${item.category}-${item.service}">×</button>
            `;
            container.appendChild(badge);
        });
    }

   
    const selectedCategoriesContainer = document.getElementById('selected-categories');
    if (selectedCategoriesContainer) {
        selectedCategoriesContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-btn')) {
                const key = e.target.dataset.key;
                delete selectedServices[key];

               
                document.querySelectorAll(`.service-item[data-category="${key.split('-')[0]}"][data-service="${key.split('-')[1]}"]`).forEach(item => {
                    item.classList.remove('bg-blue-100', 'text-blue-700');
                });

               
                updateSelectedCategories();
                updateShowResultsButton();
            }
        });
    }

   
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        }
    });

   
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });
});