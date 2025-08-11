

document.addEventListener('DOMContentLoaded', () => {
 
  const mainSliderItems = Object
    .entries(dataByPurpose)
    .flatMap(([purpose, arr]) =>
      arr
        .filter(item => item.mainSlider)
        .map(item => ({ ...item, purpose }))
    );

 
  const sliderContainer = document.getElementById('adSlides');
  if (!sliderContainer) return;

  sliderContainer.innerHTML = '';
    mainSliderItems.forEach(item => {
        const detailUrl = `pages/detail.html?purpose=${encodeURIComponent(item.purpose)}&id=${item.id}`;
        const slideDiv = document.createElement('div');
        slideDiv.className = 'w-full flex-shrink-0 box-border';
        slideDiv.innerHTML = /* html */`
          <div class="p-4 h-full flex flex-col justify-between">
            <img src="${item.images[0]}" alt="${item.name}"
                 class="w-full h-48 object-cover rounded-md mb-4">
            <div class="text-center font-medium mb-2">${item.name}</div>
            <p class="text-gray-600 mb-4 text-center">Площадь: ${item.area} м²</p>
            <div class="text-right">
              <a href="${detailUrl}" class="text-blue-600 hover:underline font-medium">
                Подробнее
              </a>
            </div>
          </div>`;
        sliderContainer.appendChild(slideDiv);
    });

   
    const total = mainSliderItems.length;

   
    function update() {
        const slideWidth = sliderContainer.parentElement.clientWidth;
        sliderContainer.style.transform = `translateX(-${idx * slideWidth}px)`;
    }

 
  const prevBtn = document.getElementById('adPrev');
  const nextBtn = document.getElementById('adNext');
  const trackElem = document.getElementById('adSlider');
  let idx = 0;
 

function update() {
  const slideWidth = trackElem.clientWidth;          
  sliderContainer.style.transform = `translateX(-${idx * slideWidth}px)`;
}

window.addEventListener('resize', update);

  if (total <= 1) {
    prevBtn?.classList.add('opacity-0','pointer-events-none');
    nextBtn?.classList.add('opacity-0','pointer-events-none');
    return;
  }

  prevBtn?.addEventListener('click', () => {
    idx = (idx - 1 + total) % total;
    update();
  });
  nextBtn?.addEventListener('click', () => {
    idx = (idx + 1) % total;
    update();
  });

  const AUTO_DELAY = 5000;
  let autoTimer = setInterval(() => {
    idx = (idx + 1) % total;
    update();
  }, AUTO_DELAY);

  trackElem?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  trackElem?.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => {
      idx = (idx + 1) % total;
      update();
    }, AUTO_DELAY);
  });

  update();
});
