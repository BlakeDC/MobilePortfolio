---
layout: layouts/base.liquid
title: Blog
---

<!-- Page Title and Introduction -->
<h1>Blog</h1>
<p>Welcome to the blog! This page is used to sharing research content, personal interests, and various other topics. From technology trends to personal projects and reflections, this page serves as a platform for learning and exploration. This page is a valuable resource for students and professionals to learn. Happy reading!</p>

---

<!-- Container for dynamically generated blog previews -->
<div id="blog-previews"></div>

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

  // State variables to store fetched posts and pagination state
  let posts = [];
  let groupedPosts = [];
  let currentPage = 0;

  /**
   * Fetches blog posts from the Contentful API and initializes the page.
   */
  async function fetchBlogPreviews() {
    try {
      // Fetch blog post entries from Contentful
      const response = await fetch(
        `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=blogPost`
      );
      const data = await response.json();

      // Transform API data into a simpler format for use in the page
      posts = data.items.map(item => ({
        title: item.fields.title, // Blog post title
        author: item.fields.author, // Blog post author
        date: new Date(item.fields.date).toLocaleDateString(), // Format date
        slug: item.fields.slug, // URL slug for the post
      }));

      // Group posts by their formatted date
      groupedPosts = groupPostsByDate(posts);

      // Initialize pagination and render the first page
      renderPagination();
      renderPreviews();
    } catch (error) {
      // Log any errors that occur during data fetching
      console.error('Error fetching blog previews:', error);
    }
  }

  /**
   * Groups blog posts by their publication date.
   * @param {Array} posts - Array of blog post objects.
   * @returns {Array} - Array of grouped posts sorted by date.
   */
  function groupPostsByDate(posts) {
    const grouped = {};

    // Organize posts into groups by their date
    posts.forEach(post => {
      if (!grouped[post.date]) grouped[post.date] = [];
      grouped[post.date].push(post);
    });

    // Sort groups by date in descending order and convert to array
    return Object.entries(grouped)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .map(([date, posts]) => ({ date, posts }));
  }

  /**
   * Renders the blog previews for the current page.
   */
  function renderPreviews() {
    const container = document.getElementById('blog-previews');
    
    // Clear existing content
    container.innerHTML = '';

    // Get the posts for the current page's date group
    const currentGroup = groupedPosts[currentPage];
    if (currentGroup) {
      const { date, posts } = currentGroup;

      // Add a group header with the date
      const groupHeader = `<h2>${date}</h2>`;
      container.insertAdjacentHTML('beforeend', groupHeader);

      // Add individual post previews
      posts.forEach(post => {
        const preview = document.createElement('div');
        preview.classList.add('blog-preview');
        preview.innerHTML = `
          <h3>${post.title}</h3>
          <p><strong>Author:</strong> ${post.author}</p>
          <a href="/blogPost/?slug=${post.slug}">Read More</a>
        `;
        container.appendChild(preview);
      });
    }
  }

  /**
   * Renders pagination controls, including navigation buttons and date links.
   */
  function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    
    // Clear existing pagination controls
    paginationContainer.innerHTML = '';

    // Create "Previous" button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 0; // Disable if on the first page
    prevButton.addEventListener('click', () => {
      currentPage--;
      renderPreviews();
      renderPagination();
    });
    paginationContainer.appendChild(prevButton);

    // Create links for each date group
    const dateLinksContainer = document.createElement('div');
    dateLinksContainer.classList.add('date-links');

    groupedPosts.forEach((group, index) => {
      const dateButton = document.createElement('button');
      dateButton.textContent = group.date;
      dateButton.classList.add('date-link');
      
      // Highlight the button for the current page
      if (index === currentPage) dateButton.classList.add('active');
      
      dateButton.addEventListener('click', () => {
        currentPage = index;
        renderPreviews();
        renderPagination();
      });
      dateLinksContainer.appendChild(dateButton);
    });

    paginationContainer.appendChild(dateLinksContainer);

    // Create "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === groupedPosts.length - 1; // Disable if on the last page
    nextButton.addEventListener('click', () => {
      currentPage++;
      renderPreviews();
      renderPagination();
    });
    paginationContainer.appendChild(nextButton);
  }

  // Initialize the page once the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', fetchBlogPreviews);
</script>
