fetch('data.json')
  .then(response => response.json())
  .then(events => {
    const items = events.map((e, index) => {
      // Format pour vis.js (préfixe 01 si mois, ex: "Juin 1984")
      let startDate = e.date;
      if (e.date.match(/^[A-Za-zéûî]+ \d{4}$/)) {
        startDate = "01 " + e.date;
      }

      return {
        id: index,
        content: `<strong>${e.title}</strong><br>${e.description}`,
        start: startDate,
        title: e.date
      };
    });

    const container = document.getElementById('timeline');
    const options = {
      orientation: 'top',
      margin: { item: 20 },
      tooltip: { followMouse: true }
    };

    new vis.Timeline(container, items, options);
  })
  .catch(error => {
    console.error("Erreur lors du chargement des événements :", error);
  });
