const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the form data
    const data = JSON.parse(event.body);
    const { name, phone, email, subject, message } = data;

    // Validate the input fields
    if (!name || !phone || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    // Validate email format using regex
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid email format' }),
      };
    }

    // Validate phone number (must be numeric)
    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Phone number must be numeric' }),
      };
    }

    // Log the form data (for debugging purposes)
    console.log('Form submitted:', data);

    // Create email subject with prefix
    const emailSubject = `[AUTOMATED] ${subject}`;

    // Compose the email content
    const emailContent = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Define the email parameters
    const msg = {
      to: ['blake.munro@dcmail.ca', 'blakemunro17@gmail.com'], // Recipients
      from: 'blake.munro@dcmail.ca', // Verified email address from SendGrid
      subject: emailSubject,
      html: emailContent,
    };

    // Send the email using SendGrid
    await sgMail.send(msg);

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submission successful. Email sent!' }),
    };
  } catch (error) {
    console.error('Error processing form submission:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
