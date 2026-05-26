fetch('http://localhost:3000/api/admin/jobs')
  .then(res => res.json())
  .then(data => {
    console.log("API Response:");
    console.dir(data, { depth: null });
  })
  .catch(console.error);
