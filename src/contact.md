---
layout: layouts/base.liquid
title: Contact Us
---

# Contact Us

<form id="contact-form">
  <div class="form-row">
    <div class="form-group col-md-6">
      <label for="inputName">Your Name</label>
      <input type="text" class="form-control" id="inputName" placeholder="Name" required>
    </div>
    <div class="form-group col-md-6">
      <label for="inputEmail">E-mail</label>
      <input type="email" class="form-control" id="inputEmail" placeholder="Email" required>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-md-6">
      <label for="inputPhone">Phone Number</label>
      <input type="tel" class="form-control" id="inputPhone" placeholder="Phone Number" required>
    </div>
    <div class="form-group col-md-6">
      <label for="inputSubject">Subject</label>
      <input type="text" class="form-control" id="inputSubject" placeholder="Subject" required>
    </div>
  </div>
  <div class="form-group">
    <label for="inputMessage">Message</label>
    <textarea class="form-control" id="inputMessage" rows="4" placeholder="Write your message here..." required></textarea>
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
