document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("timeline");
  const page = window.location.pathname.split("/").pop().replace(".html", "").toLowerCase();
  const dataUrl = `data/${page}.json`;

  fetch(dataUrl)
    .then(res => {
      if (!res.ok) throw new Error("Fichier JSON introuvable");
      return res.json();
    })
    .then(events => {
      const items = new vis.DataSet(
        events.map((e, i) => {
          const item = {
            id: i,
            content: `<strong>${e.title}</strong>`,
            title: e.description.replace(/"/g, '&quot;'),
          };

          // Traitement des dates
          try {
            item.start = new Date(e.start.includes(" ") ? e.start : "01 " + e.start);
            if (e.end) {
              item.end = new Date(e.end.includes(" ") ? e.end : "01 " + e.end);
              item.type = "range";
            }
          } catch (err) {
            console.warn("Date invalide pour l’événement :", e, err);
          }

          return item;
        })
      );

      const options = {
        orientation: 'top',
        tooltip: { followMouse: true },
        zoomable: true,
        showCurrentTime: true,
        margin: { item: 20 },
      };

      new vis.Timeline(container, items, options);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<p style="color:red;">Erreur : impossible de charger les données.</p>`;
    });
});
