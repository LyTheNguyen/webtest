const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Lấy path từ request
  const path = event.path.replace('/.netlify/functions/api', '');
  
  try {
    // Gọi đến BE nội bộ
    const response = await fetch(`http://localhost:1337${path}`, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body
    });
    
    const data = await response.json();
    
    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}; 