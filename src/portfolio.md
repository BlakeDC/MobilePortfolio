---
layout: layouts/base.liquid
title: Portfolio
---

<!-- Page Title and Introduction -->
<h1>Portfolio</h1>
<p>Explore the portfolio! This page showcases various projects categorized by type. Filter and navigate to discover interesting works and achievements. Happy browsing!</p>

<!-- Filter Options -->
<div id="filters" class="filter-controls"></div>

---

<!-- Container for dynamically generated portfolio previews -->
<div id="portfolio-previews"></div>

<!-- Container for pagination controls -->
<div id="pagination" class="pagination-controls"></div>

<!-- Including Contentful SDK for API interaction -->
<script
  src="https://cdn.jsdelivr.net/npm/contentful@7.0.5/dist/contentful.browser.min.js"
  charset="utf-8"
></script>

<script>
  // Space and access credentials for Contentful API
  const spaceId = '{{ contentful.spaceId }}';
  const accessToken = '{{ contentful.accessToken }}';

  // State variables
  let portfolios = [];
  let filteredPortfolios = [];
  let groupedPortfolios = [];
  let currentPage = 0;
  let currentType = 'All';

  /**
   * Fetches portfolio entries from Contentful and initializes the page.
   */
  async function fetchPortfolioPreviews() {
    try {
      // Fetch portfolio entries from Contentful
      const response = await fetch(
        `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=portfolio`
      );
      const data = await response.json();

      // Transform API data
      portfolios = data.items.map(item => ({
        title: item.fields.title,
        type: item.fields.type,
        slug: item.fields.slug,
      }));

      // Initialize filters and render the page
      initializeFilters();
      applyFilters();
    } catch (error) {
      console.error('Error fetching portfolio previews:', error);
    }
  }

  /**
   * Initializes the filter options based on portfolio types.
   */
  function initializeFilters() {
    const filterContainer = document.getElementById('filters');

    // Get unique types from portfolios
    const types = ['All', ...new Set(portfolios.map(portfolio => portfolio.type))];

    // Create filter buttons
    types.forEach(type => {
      const button = document.createElement('button');
      button.textContent = type;
      button.classList.add('filter-button');

      if (type === currentType) button.classList.add('active');

      button.addEventListener('click', () => {
        currentType = type;
        applyFilters();
      });

      filterContainer.appendChild(button);
    });
  }

  /**
   * Applies the selected filter and updates the page.
   */
  function applyFilters() {
    // Filter portfolios by type
    filteredPortfolios = currentType === 'All'
      ? portfolios
      : portfolios.filter(portfolio => portfolio.type === currentType);

    // Group portfolios alphabetically by title
    groupedPortfolios = groupPortfoliosByTitle(filteredPortfolios);

    // Reset pagination
    currentPage = 0;
    renderPagination();
    renderPreviews();
  }

  /**
   * Groups portfolios alphabetically by title.
   * @param {Array} portfolios - Array of portfolio objects.
   * @returns {Array} - Array of grouped portfolios sorted alphabetically.
   */
  function groupPortfoliosByTitle(portfolios) {
    const grouped = {};

    portfolios.forEach(portfolio => {
      const letter = portfolio.title.charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(portfolio);
    });

    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([letter, portfolios]) => ({ letter, portfolios }));
  }

  /**
   * Renders the portfolio previews for the current page.
   */
  function renderPreviews() {
    const container = document.getElementById('portfolio-previews');
    container.innerHTML = '';

    const currentGroup = groupedPortfolios[currentPage];
    if (currentGroup) {
      const { letter, portfolios } = currentGroup;

      // Add a group header with the letter
      const groupHeader = `<h2>${letter}</h2>`;
      container.insertAdjacentHTML('beforeend', groupHeader);

      portfolios.forEach(portfolio => {
        const preview = document.createElement('div');
        preview.classList.add('portfolio-preview');
        preview.innerHTML = `
          <h3>${portfolio.title}</h3>
          <p><strong>Type:</strong> ${portfolio.type}</p>
          <a href="/portfolioPost/?slug=${portfolio.slug}">View Details</a>
        `;
        container.appendChild(preview);
      });
    }
  }

  /**
   * Renders pagination controls.
   */
  function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    // Create "Previous" button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 0;
    prevButton.addEventListener('click', () => {
      currentPage--;
      renderPreviews();
      renderPagination();
    });
    paginationContainer.appendChild(prevButton);

    // Create links for each group
    groupedPortfolios.forEach((group, index) => {
      const letterButton = document.createElement('button');
      letterButton.textContent = group.letter;
      letterButton.classList.add('page-link');
      if (index === currentPage) letterButton.classList.add('active');
      letterButton.addEventListener('click', () => {
        currentPage = index;
        renderPreviews();
        renderPagination();
      });
      paginationContainer.appendChild(letterButton);
    });

    // Create "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === groupedPortfolios.length - 1;
    nextButton.addEventListener('click', () => {
      currentPage++;
      renderPreviews();
      renderPagination();
    });
    paginationContainer.appendChild(nextButton);
  }

  // Initialize the page once the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', fetchPortfolioPreviews);
</script>
