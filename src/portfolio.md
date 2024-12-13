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
  let portfolioItems = [];
  let filteredItems = [];
  let selectedType = 'All'; // Default to show all items

  /**
   * Fetches portfolio items from the Contentful API and initializes the page.
   */
  async function fetchPortfolioItems() {
    try {
      // Fetch portfolio entries from Contentful
      const response = await fetch(
        `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=portfolio`
      );
      const data = await response.json();

      // Transform API data into a simpler format for use on the page
      portfolioItems = data.items.map(item => ({
        title: item.fields.title,
        type: item.fields.type,
        imageUrl: `https:${item.fields.image.fields.file.url}`,
        description: item.fields.description,
        link: item.fields.link,
      }));

      // Initialize filtered items and render the page
      filteredItems = portfolioItems;
      renderFilters();
      renderPortfolioItems();
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    }
  }

  /**
   * Renders the filter options based on portfolio item types.
   */
  function renderFilters() {
    const filterContainer = document.getElementById('portfolio-filters');

    // Extract unique types from portfolio items
    const types = ['All', ...new Set(portfolioItems.map(item => item.type))];

    // Render filter buttons
    types.forEach(type => {
      const button = document.createElement('button');
      button.textContent = type;
      button.classList.add('filter-button');
      if (type === selectedType) button.classList.add('active'); // Highlight selected filter

      button.addEventListener('click', () => {
        selectedType = type;
        filterPortfolioItems();
      });

      filterContainer.appendChild(button);
    });
  }

  /**
   * Filters portfolio items based on the selected type.
   */
  function filterPortfolioItems() {
    filteredItems = selectedType === 'All'
      ? portfolioItems
      : portfolioItems.filter(item => item.type === selectedType);

    renderPortfolioItems();
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
  function renderPortfolioItems() {
    const container = document.getElementById('portfolio-container');

    // Clear existing content
    container.innerHTML = '';

    // Render each filtered portfolio item
    filteredItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('portfolio-item');
      itemElement.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p><strong>Type:</strong> ${item.type}</p>
        <p>${item.description}</p>
        <a href="${item.link}" target="_blank">View More</a>
      `;
      container.appendChild(itemElement);
    });
  }

  // Initialize the page once the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', fetchPortfolioItems);
</script>
