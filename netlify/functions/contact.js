exports.handler = async (event) => {
    try {
      const data = JSON.parse(event.body);
  
      // Example: Log form data (replace this with your desired functionality)
      console.log('Form submitted:', data);
  
      // Return a success response
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Form submission successful' }),
      };
    } catch (error) {
      console.error('Error processing form submission:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  };
  