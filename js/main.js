(function () {
	const INITIAL_VISIBLE = 9;
	const LOAD_STEP = 9;

	const coursesGrid = document.querySelector('.courses__grid');
	const filtersList = document.querySelector('.filters__list');
	const searchInput = document.querySelector('.search__input');
	const loadMoreBtn = document.querySelector('.load-more');
	const emptyState = document.querySelector('.courses__empty');

	let activeCategory = 'all';
	let searchQuery = '';
	let visibleLimit = INITIAL_VISIBLE;

	function getCategoryCounts() {
		const counts = { all: COURSES_DATA.length };

		CATEGORIES.forEach((cat) => {
			if (cat.id !== 'all') {
				counts[cat.id] = COURSES_DATA.filter((c) => c.category === cat.id).length;
			}
		});

		return counts;
	}

	function renderFilters() {
		const counts = getCategoryCounts();

		filtersList.innerHTML = CATEGORIES.map((cat) => {
			const isActive = cat.id === activeCategory;
			const count = counts[cat.id];

			return `
				<li class="filters__item">
					<button
						class="filters__btn${isActive ? ' filters__btn--active' : ''}"
						type="button"
						data-category="${cat.id}"
					>
						${cat.label}<sup class="filters__count">${count}</sup>
					</button>
				</li>
			`;
		}).join('');
	}

	function getFilteredCourses() {
		const query = searchQuery.trim().toLowerCase();

		return COURSES_DATA.filter((course) => {
			const matchesCategory =
				activeCategory === 'all' || course.category === activeCategory;
			const matchesSearch =
				!query || course.title.toLowerCase().includes(query);

			return matchesCategory && matchesSearch;
		});
	}

	function createCourseCard(course) {
		return `
			<article class="course-card" data-id="${course.id}" data-category="${course.category}">
				<div class="course-card__media">
					<img
						class="course-card__image"
						src="${course.image}"
						alt="${course.author}"
						width="390"
						height="240"
						loading="lazy"
					>
				</div>
				<div class="course-card__body">
					<span class="course-card__tag course-card__tag--${course.category}">
						${course.categoryLabel}
					</span>
					<h3 class="course-card__title">${course.title}</h3>
					<div class="course-card__meta">
						<span class="course-card__price">$${course.price}</span>
						<span class="course-card__divider" aria-hidden="true">|</span>
						<span class="course-card__author">by ${course.author}</span>
					</div>
				</div>
			</article>
		`;
	}

	function renderCourses() {
		const filtered = getFilteredCourses();
		const visible = filtered.slice(0, visibleLimit);

		coursesGrid.innerHTML = visible.map(createCourseCard).join('');

		const hasMore = filtered.length > visibleLimit;
		loadMoreBtn.hidden = !hasMore;
		emptyState.hidden = filtered.length > 0;
	}

	function resetVisibleLimit() {
		visibleLimit = INITIAL_VISIBLE;
	}

	filtersList.addEventListener('click', (e) => {
		const btn = e.target.closest('.filters__btn');
		if (!btn) return;

		activeCategory = btn.dataset.category;
		resetVisibleLimit();
		renderFilters();
		renderCourses();
	});

	searchInput.addEventListener('input', (e) => {
		searchQuery = e.target.value;
		resetVisibleLimit();
		renderCourses();
	});

	loadMoreBtn.addEventListener('click', () => {
		visibleLimit += LOAD_STEP;
		renderCourses();
	});

	renderFilters();
	renderCourses();
})();
