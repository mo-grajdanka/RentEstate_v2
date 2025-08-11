document.addEventListener("DOMContentLoaded", () => {
  const sitesData = window.dataByPurpose?.land || [];
  const sitesBlock = document.getElementById("sitesBlock");
  const siteList   = document.getElementById("siteList");

  if (!sitesData.length) {
    sitesBlock.classList.add("hidden");
    return;
  }

 
  siteList.innerHTML = sitesData.slice(0, 4).map(site => {
   
    const listUrl = `pages/list.html?place=${encodeURIComponent(site.place)}`;
    return `
      <div class="property-card bg-white rounded-lg overflow-hidden shadow-md">
        <img src="${site.images[0]}" alt="${site.name}"
             class="w-full h-48 object-cover"
             onerror="this.src='https://placehold.co/400x200?text=No+Image'">
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">${site.name}</h3>
          <p class="text-gray-600 mb-4">${site.place}, ${site.area} м²</p>
          <a href="${listUrl}"
             class="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            Подробнее <i class="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    `;
  }).join("");
});
