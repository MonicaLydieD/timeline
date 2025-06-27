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
      const items = new vis.DataSet();

      // Options de timeline : définies AVANT la création
      const options = {
        orientation: 'top',
        tooltip: false, // Désactivé, car on utilise un panneau latéral
        zoomable: true,
        showCurrentTime: true,
        margin: { item: 20 }
      };

      const timeline = new vis.Timeline(container, items, options);

      // Ajouter les événements
      events.forEach((e, i) => {
        let startDate = parseDate(e.start);
        let endDate = e.end ? parseDate(e.end) : null;

        if (!startDate) {
          console.warn(`Événement ignoré, date invalide :`, e);
          return;
        }

        const item = {
          id: i,
          content: `<strong>${e.title}</strong>`,
          start: startDate,
          title: e.description?.replace(/"/g, '&quot;') || ""
        };

        if (endDate) {
          item.end = endDate;
          item.type = "range";
        }

        items.add(item);
      });

      // Lorsqu'on sélectionne un élément de la frise
      timeline.on("select", (props) => {
        const selectedId = props.items[0];
        if (selectedId != null) {
          const event = items.get(selectedId);
          document.getElementById("desc-title").textContent = event.content.replace(/<[^>]*>/g, '');
          document.getElementById("desc-content").textContent = event.title;
        }
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<p style="color:red;">Erreur : impossible de charger les données.</p>`;
    });

  // Fonction de conversion de date souple
  function parseDate(str) {
    if (!str) return null;

    // Cas année uniquement : "2000"
    if (/^\d{4}$/.test(str)) {
      return new Date(`${str}-01-01`);
    }

    // Cas mois année : "Mars 2005"
    if (/^[A-Za-zéûîôàèùçÉÂÀÔ]+\s+\d{4}$/.test(str)) {
      try {
        return new Date(`01 ${str}`);
      } catch {
        return null;
      }
    }

    // Cas complet standard
    const date = new Date(str);
    return isNaN(date.getTime()) ? null : date;
  }
});
