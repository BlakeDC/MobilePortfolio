---
layout: layouts/base.liquid
title: Portfolio
---

<!-- Page Title and Introduction -->
<h1>Portfolio</h1>
<p>Explore the portfolio! This page showcases various projects categorized by type. Filter and navigate to discover interesting works and achievements. Happy browsing!</p>

<!-- Container for filter buttons -->
<div id="portfolio-filters" class="portfolio-filters"></div>

<!-- Container for dynamically generated portfolio items -->
<div id="portfolio-container" class="portfolio-items"></div>

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

  // State variables to store fetched portfolio items and the currently selected type
  let portfolios = [];
  let filteredItems = [];
  let selectedType = 'All'; // Default to show all items
  
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
   * Renders the filter options based on portfolio item types.
   */
  function renderFilters() {
    const filterContainer = document.getElementById('portfolio-filters');

    // Extract unique types from portfolio items
    const types = ['All', ...new Set(portfolios.map(item => item.type))];

    // Render filter buttons
    types.forEach(type => {
      const button = document.createElement('button');
      button.textContent = type;
      button.classList.add('filter-button');
      if (type === selectedType) button.classList.add('active'); // Highlight selected filter

      button.addEventListener('click', () => {
        selectedType = type;
        filterportfolios();
      });

      filterContainer.appendChild(button);
    });
  }

  /**
   * Filters portfolio items based on the selected type.
   */
  function filterportfolios() {
    filteredItems = selectedType === 'All'
      ? portfolios
      : portfolios.filter(item => item.type === selectedType);

    renderportfolios();
    updateActiveFilter();
  }

  /**
   * Updates the active filter button styling.
   */
  function updateActiveFilter() {
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach(button => {
      button.classList.toggle('active', button.textContent === selectedType);
    });
  }

  /**
   * Renders the filtered portfolio items on the page.
   */
  function renderportfolios() {
    const container = document.getElementById('portfolio-container');

    // Clear existing content
    container.innerHTML = '';

    // Render each filtered portfolio item
    filteredItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('portfolio-item');
      itemElement.innerHTML = `
        <h3>${item.title}</h3>
        <p><strong>Type:</strong> ${item.type}</p>
        <a href="/portfolioPost/?slug=${item.slug}">Read More</a>
      `;
      container.appendChild(itemElement);
    });
  }

  // Initialize the page once the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', fetchportfolios);
</script>
