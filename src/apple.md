---
layout: layouts/base.liquid
title: Apple Index 
---

<!-- Page Title -->
## Apple Index
---

<!-- Page Introduction -->
Welcome to the **Apple Index** page, a catalog of delicious apples from various varieties. This page showcases a curated list of apples, detailing their unique characteristics such as color, flavor, and a corresponding image.

<!-- Explanation of Purpose -->
## Why This Page is Important
---
The Apple Index demonstrates key web development techniques like pagination for presenting large datasets in a user-friendly way. This page uses a untraditional type of pagination to filter apples by colour. It also demonstrates dynamic content rendering using structured data and templating engines like Liquid, making it a valuable learning tool for developers and users alike.

---

<h1>Apples</h1>

<!-- Color Filter Dropdown for filtering apple entries by their color -->
<label for="colorFilter">Filter by Color: </label>
<select id="colorFilter">
  <option value="all"></option>
</select>

<!-- Table Structure for Displaying Apple Data -->
<table id="appleTable">
  <thead>
    <tr>
      <th>Name</th>
      <th>Color</th>
      <th>Flavor</th>
      <th>Image</th>
    </tr>
  </thead>
  <tbody id="apple-table-body">
    <!-- JavaScript will populate this table -->
  </tbody>
</table>

<!-- Pagination Controls Placeholder -->
<div id="pagination" class="pagination-controls">
  <!-- JavaScript will populate pagination here -->
</div>

<script>
  (function () {
    // Space and access credentials for Contentful API
    const spaceId = '{{ contentful.spaceId }}';
    const accessToken = '{{ contentful.accessToken }}';
    let allApples = [];

    /**
     * Renders the apple data into the HTML table.
     * @param {Array} apples - Array of apple objects to display.
     */
    function renderTable(apples) {
      const tableBody = document.getElementById('apple-table-body');
      
      // Check if the table body exists to avoid errors
      if (!tableBody) {
        console.error("Table body element with id 'apple-table-body' not found.");
        return;
      }

      // Clear existing table data
      tableBody.innerHTML = '';

      // Populate the table with rows of apple data
      apples.forEach(apple => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${apple.name}</td>
          <td>${apple.color}</td>
          <td>${apple.flavor}</td>
          <td><img src="${apple.image}" alt="${apple.name}" width="100" /></td>
        `;
        tableBody.appendChild(row);
      });
    }

    /**
     * Populates the color filter dropdown with unique colors from the dataset.
     * @param {Array} colors - Array of unique colors to populate the dropdown.
     */
    function populateColorFilter(colors) {
      const filter = document.getElementById('colorFilter');
      
      // Reset dropdown with a default "All" option
      filter.innerHTML = '<option value="all">All</option>';
      
      // Populate dropdown with color options
      colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        filter.appendChild(option);
      });
    }

    /**
     * Filters the list of apples based on the selected color.
     * @param {Array} apples - The complete list of apple objects.
     * @param {string} selectedColor - The selected color for filtering.
     * @returns {Array} - Filtered array of apples.
     */
    function filterApplesByColor(apples, selectedColor) {
      // Return all apples if the "all" option is selected
      if (selectedColor === 'all') return apples;

      // Filter apples by the selected color
      return apples.filter(apple => apple.color.toLowerCase() === selectedColor.toLowerCase());
    }

    /**
     * Fetches apple data from the Contentful API and initializes the table and filter dropdown.
     */
    async function fetchApples() {
      try {
        // Fetch data from Contentful API
        const response = await fetch(`https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=apple`);
        const data = await response.json();

        // Map image assets by their IDs for easy lookup
        const assetMap = {};
        if (data.includes && data.includes.Asset) {
          data.includes.Asset.forEach(asset => {
            const id = asset.sys.id;
            const url = asset.fields.file.url;
            assetMap[id] = `https:${url}`;
          });
        }

        // Transform fetched data into a usable format
        allApples = data.items.map(item => ({
          name: item.fields.name,
          color: item.fields.color,
          flavor: item.fields.flavor,
          image: assetMap[item.fields.image.sys.id]
        }));

        // Extract unique colors for the dropdown and initialize the table
        const uniqueColors = [...new Set(allApples.map(apple => apple.color))];
        populateColorFilter(uniqueColors);
        renderTable(allApples);
      } catch (error) {
        console.error('Error fetching apple data:', error);
      }
    }

    // Event listener for DOM content loaded
    document.addEventListener("DOMContentLoaded", function () {
      // Fetch and render apple data
      fetchApples();

      // Add an event listener to filter dropdown for dynamic filtering
      const colorFilter = document.getElementById('colorFilter');
      colorFilter.addEventListener('change', () => {
        const selectedColor = colorFilter.value;
        const filteredApples = filterApplesByColor(allApples, selectedColor);
        renderTable(filteredApples);
      });
    });
  })();
</script>
