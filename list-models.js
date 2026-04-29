const https = require('https');

const apiKey = 'AIzaSyBMV75p3CEw6qfKRdAZe2DrEno7hSLNiZ4';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.models) {
        console.log("Available models:");
        parsed.models.forEach(m => {
          console.log(`- ${m.name}`);
        });
      } else {
        console.log("Response:", parsed);
      }
    } catch (e) {
      console.log("Error parsing:", data);
    }
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
