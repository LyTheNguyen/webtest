const axios = require('axios');

exports.handler = async function(event, context) {
  // Chỉ cho phép các methods cần thiết
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Lấy path từ request
    const path = event.path.replace('/.netlify/functions/proxy', '');
    
    // Tạo request đến BE local
    const response = await axios({
      method: event.httpMethod,
      url: `http://localhost:1337${path}`,
      headers: {
        ...event.headers,
        host: 'localhost:1337'
      },
      data: event.body ? JSON.parse(event.body) : undefined
    });

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.response?.data || 'Internal Server Error'
      })
    };
  }
}; 