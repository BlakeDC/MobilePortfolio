---
layout: layouts/base.liquid
title: Contact Us
---

# Contact Us

<form id="contact-form">
  <div class="form-group">
    <label for="name">Your Name:</label>
    <input type="text" id="name" name="name" required>
  </div>
    <label for="phone">Phone Number:</label>
    <input type="tel" id="phone" name="phone" required>
  <div class="form-group">
    <label for="email">E-mail Address:</label>
    <input type="email" id="email" name="email" required>
  </div>
    <label for="subject">Subject:</label>
    <input type="text" id="subject" name="subject" required>
  <div class="form-group">
    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4" required></textarea>
  </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>

<div id="spinner" style="display: none; text-align: center; margin: 20px;">Submitting...</div>
<div id="response-message" style="display: none; text-align: center; margin: 20px; font-size: 1.2em; color: green;">Thanks for reaching out. We'll get back to you soon!</div>

<script>
  document.getElementById('contact-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Show spinner, hide form and response message
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('response-message').style.display = 'none';

    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      // Submit form data to Netlify function
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Hide spinner and show success message
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('response-message').style.display = 'block';
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
      console.error(error);

      // Reset UI to allow resubmission
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('contact-form').style.display = 'block';
    }
  });
</script>
