/***********************
 * slider_list.js
 ***********************/

/* ---------- helpers ---------- */
const getParam = k => new URLSearchParams(location.search).get(k) || null;
const qs       = (sel, root = document) => root.querySelector(sel);
const qsa      = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- active filters ---------- */
const filters = {
  purpose : getParam('purpose'),
  place   : getParam('place'),
  minArea : getParam('minArea'),
  maxArea : getParam('maxArea')
};

/* ---------- slider initialisation ---------- */
function initAdSlider(allItems, f) {
  if (!Array.isArray(allItems)) allItems = [];

  /* 1. choose similar items */
  const samePlace   = f.place   ? allItems.filter(i => i.place     === f.place)   : [];
  const samePurpose = f.purpose ? allItems.filter(i => i._purpose === f.purpose) : [];
  const similar     = [...new Set([...samePlace, ...samePurpose])].slice(0, 3);

  /* 2. slides data */
  const fallbackAds = [
    { image:'https://placehold.co/600x400?text=Реклама+1', link:'#', alt:'Реклама 1', title:'', area:'' },
    { image:'https://placehold.co/600x400?text=Реклама+2', link:'#', alt:'Реклама 2', title:'', area:'' },
    { image:'https://placehold.co/600x400?text=Реклама+3', link:'#', alt:'Реклама 3', title:'', area:'' }
  ];

  const slides = similar.length
    ? similar.map(i => ({
        image : Array.isArray(i.images) ? i.images[0] : i.images,
        link  : `detail.html?purpose=${i._purpose}&id=${i.id}`,
        alt   : i.name,
        title : i.name,
        area  : i.area
      }))
    : fallbackAds;

  /* 3. render — КАРТОЧКА в стиле скриншота */
  const wrap = qs('#adSlides');
  if (!wrap) return;

  wrap.innerHTML = slides.map(s => `
    <a href="${s.link}" class="w-full h-full flex-shrink-0 px-2 box-border">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full
                  transition-transform duration-300 hover:scale-[1.03]">
        <img src="${s.image}" alt="${s.alt}"
             class="object-cover w-full h-40"
             onerror="this.src='https://placehold.co/400x200?text=No+image'">

        ${s.title ? `
          <div class="p-4 text-center flex flex-col flex-grow justify-center">
            <h4 class="font-semibold mb-1">${s.title}</h4>
            <p class="text-gray-600 text-sm">Площадь: ${s.area} м²</p>
          </div>` : ''}
      </div>
    </a>
  `).join('');

  /* 4. controls & autoplay */
  let idx = 0, max = slides.length - 1;
  const move = () => wrap.style.transform = `translateX(-${idx * 100}%)`;
  qs('#adPrev').onclick = () => { idx = idx ? idx - 1 : max; move(); };
  qs('#adNext').onclick = () => { idx = idx === max ? 0 : idx + 1; move(); };
  setInterval(() => { idx = idx === max ? 0 : idx + 1; move(); }, 5000);
}

/* ---------- main render ---------- */
function renderListings() {
  /* 1. aggregate data & mark _purpose */
  const dataToShow = filters.purpose && dataByPurpose[filters.purpose]
    ? dataByPurpose[filters.purpose].map(it => ({ ...it, _purpose: filters.purpose }))
    : Object.entries(dataByPurpose)
        .flatMap(([p, arr]) => arr.map(it => ({ ...it, _purpose: p })));

  /* 2. filtering */
  const filtered = dataToShow.filter(it => {
    if (filters.place   && it.place !== filters.place)            return false;
    if (filters.minArea && it.area  < +filters.minArea)           return false;
    if (filters.maxArea && it.area  > +filters.maxArea)           return false;
    return true;
  });

  const wrap = qs('#listings');
  wrap.innerHTML = '';

  /* 3. empty state: message + slider */
  if (!filtered.length) {
    wrap.innerHTML = `
      <div class="col-span-full grid gap-6 lg:grid-cols-2 items-center">
        <div class="text-center text-gray-600 space-y-4">
          <p class="text-2xl font-medium">По заданным критериям объекты не найдены.</p>
          <p class="text-lg">Оставьте заявку — подберём лучший вариант лично для вас.</p>
          <button class="open-modal-btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition">
            Оставить заявку
          </button>
          <p class="text-sm text-gray-400">Мы свяжемся в течение 15 минут.</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-semibold mb-5">Похожие объекты</h3>
          <div id="adSlider" class="relative overflow-hidden h-72 rounded-xl">
            <div id="adSlides" class="flex transition-transform duration-500 ease-linear h-full"></div>

            <button id="adPrev"
                    class="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md
                           bg-white/70 backdrop-blur hover:bg-white transition">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button id="adNext"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md
                           bg-white/70 backdrop-blur hover:bg-white transition">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>`;

    /* modal buttons */
    if (typeof openModal === 'function')
      qsa('.open-modal-btn').forEach(b => b.addEventListener('click', openModal));

    /* slider */
    initAdSlider(dataToShow, filters);
    return;
  }

  /* 4. results grid (unchanged) */
  filtered.forEach(it => {
    const img  = Array.isArray(it.images) ? it.images[0] : it.images;
    const card = document.createElement('a');
    card.href  = `detail.html?purpose=${it._purpose}&id=${it.id}`;
    card.className = 'block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition';
    card.innerHTML = `
      <img src="${img}" alt="${it.name}"
           class="w-full h-32 object-cover"
           onerror="this.src='https://placehold.co/400x200?text=No+image'">
      <div class="p-4">
        <h3 class="font-semibold mb-1">${it.name}</h3>
        <p class="text-gray-600 text-sm mb-2">Площадь: ${it.area} м²</p>
        ${it.place ? `<p class="text-gray-500 text-xs mb-2">${it.place}</p>` : ''}
        <p class="text-blue-600 hover:text-blue-800 font-medium flex items-center">
          Подробнее <i class="fas fa-arrow-right ml-2"></i>
        </p>
      </div>`;
    wrap.appendChild(card);
  });
}

/* ---------- fire ---------- */
document.addEventListener('DOMContentLoaded', renderListings);
