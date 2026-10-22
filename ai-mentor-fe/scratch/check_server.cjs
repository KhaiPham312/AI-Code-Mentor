const http = require('http');

http.get('http://localhost:3000', (res) => {
  console.log('HTTP Status Code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Body length:', data.length);
    console.log('Contains root div:', data.includes('id="root"'));
    console.log('Contains main entry:', data.includes('/src/main.tsx'));
  });
}).on('error', (err) => {
  console.error('HTTP Request failed:', err.message);
});
