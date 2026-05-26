fetch('http://127.0.0.1:3000/api/predictions')
  .then(res => res.json())
  .then(data => {
    console.log(`Fetched ${data.fights?.length} predictions.`);
    console.log(`Total pages: ${data.totalPages}`);
    console.log(`Premium Status: ${data.isPremium}`);
    if (data.fights?.length > 0) {
      console.log('First fight prediction:', data.fights[0].aiPrediction);
    }
  })
  .catch(console.error);
