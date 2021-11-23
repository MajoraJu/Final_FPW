const api = (() => {
    const baseUrl = 'http://localhost:3000';
  
    
    const fetchObstacles = (levelId, location) => {
      const url = `${baseUrl}/obstacles/${levelId}?location=${location}`;
      return fetch(url).then((result) => result.json());
    };
  
    return { fetchObstacles };
  })();
