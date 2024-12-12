---
layout: layouts/base.liquid
title: Contact Us
---

# Contact Us

<div class="form-container">
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
</div>

<script>
  document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.target;

    // Show spinner and hide form
    document.getElementById('spinner').style.display = 'block';
    form.style.display = 'none';

    // Gather form data
    const formData = {
      name: document.getElementById('inputName').value,
      email: document.getElementById('inputEmail').value,
      phone: document.getElementById('inputPhone').value,
      subject: document.getElementById('inputSubject').value,
      message: document.getElementById('inputMessage').value,
    };

    try {
      // Send data to serverless function
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success message
        document.getElementById('response-message').textContent = "Thanks for reaching out. We'll get back to you soon!";
        document.getElementById('response-message').style.display = 'block';
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('response-message').textContent = 'An error occurred. Please try again later.';
      document.getElementById('response-message').style.display = 'block';
    } finally {
      // Hide spinner
      document.getElementById('spinner').style.display = 'none';
    }
  });
</script>