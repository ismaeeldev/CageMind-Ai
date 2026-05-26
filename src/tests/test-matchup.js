fetch('http://localhost:3000/api/matchup')
  .then(res => res.json())
  .then(async (data) => {
    console.log(`Fetched ${data.fighters?.length} fighters`);
    
    if (data.fighters?.length >= 2) {
      const f1Id = data.fighters[0].id;
      const f2Id = data.fighters[1].id;
      
      console.log(`Comparing ${data.fighters[0].name} vs ${data.fighters[1].name}`);
      
      const res = await fetch('http://localhost:3000/api/matchup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fighter1Id: f1Id, fighter2Id: f2Id })
      });
      const result = await res.json();
      console.dir(result, { depth: null });
    }
  })
  .catch(console.error);
