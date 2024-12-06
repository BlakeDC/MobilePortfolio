---
layout: layouts/base.liquid
title: Blog Post
---

<!-- Page Title -->
<h1>Blog Post</h1>

<!-- Container for the blog post content -->
<div id="blog-post">
  <p></p> <!-- Default message if no blog post is specified -->
</div>

---

<!-- Placeholder for additional related blog posts or content -->
<div id="blog-posts">
  <!-- Blog posts will be rendered here -->
</div>

<!-- Contentful SDK -->
<script
  src="https://cdn.jsdelivr.net/npm/contentful@7.0.5/dist/contentful.browser.min.js"
  charset="utf-8"
></script>

<!-- Fix for 'exports' variable issue in certain environments -->
<script>
  var exports = {}; // Ensures compatibility with Contentful's rich-text renderer
</script>

<!-- Contentful Rich Text Renderer -->
<script
  src="https://cdn.jsdelivr.net/npm/@contentful/rich-text-html-renderer@12.0.0/dist/rich-text-html-renderer.es5.min.js"
  charset="utf-8"
></script>

<script>
  // Space and access credentials for Contentful API
  const spaceId = '{{ contentful.spaceId }}';
  const accessToken = '{{ contentful.accessToken }}';

  // Extract the slug from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug'); // Get the 'slug' parameter

  // Display a message if no slug is provided
  if (!slug) {
    document.getElementById('blog-post').innerHTML = '<p>No blog post specified.</p>';
  } else {
    // Fetch and render the blog post corresponding to the slug
    fetchBlogPosts(slug);
  }

  /**
   * Fetches blog post data from Contentful based on the provided slug
   * and renders the content on the page.
   * 
   * @param {string} slug - Unique identifier for the blog post.
   */
  async function fetchBlogPosts(slug) {
    try {
      // Fetch blog post data matching the provided slug
      const response = await fetch(
        `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=blogPost&fields.slug=${slug}&include=1`
      );
      const data = await response.json();

      // Extract the blog post from the API response
      const blogPost = data.items[0];

      // Configuration options for rendering rich text content
      const options = {
        renderNode: {
          // Render embedded asset blocks (images, videos, etc.)
          'embedded-asset-block': (node) => {
            const assetId = node.data.target.sys.id;
            const asset = data.includes.Asset.find((asset) => asset.sys.id === assetId);
            if (asset && asset.fields && asset.fields.file) {
              const assetUrl = `https:${asset.fields.file.url}`;
              return `<img src="${assetUrl}" alt="${asset.fields.title || 'Embedded Image'}" style="width: 100%; max-width: 600px;" />`;
            }
            return ''; // Return empty string if the asset is not found
          },
        },
      };

      // Render the blog post's content dynamically in the page
      document.getElementById('blog-post').innerHTML = `
        <h2>${blogPost.fields.title}</h2>
        <p><strong>By:</strong> ${blogPost.fields.author}</p>
        <p><strong>Posted:</strong> ${new Date(blogPost.fields.date).toLocaleDateString()}</p>
        <div>${documentToHtmlString(blogPost.fields.content, options)}</div>
      `;
    } catch (error) {
      // Handle any errors that occur during the fetch or rendering process
      console.error('Error fetching blog post:', error);
    }
  }
</script>
