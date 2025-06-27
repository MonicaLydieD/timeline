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
        events.map((e,i) => {
          const iso = e.date.match(/\d{4}/) ? e.date : ("01 " + e.date);
          return {
            id: i,
            content: `<strong>${e.title}</strong>`,
            start: new Date(iso),
            title: e.description.replace(/"/g, '&quot;')
          };
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
