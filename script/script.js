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

      const options = {
        orientation: 'top',
        showCurrentTime: true,
        zoomable: true,
        margin: { item: 20 },
        tooltip: { followMouse: true, overflowMethod: 'cap' } // ✅ corrigé
      };

      const timeline = new vis.Timeline(container, items, options);

      events.forEach((e, i) => {
        const startDate = parseDate(e.start);
        const endDate = e.end ? parseDate(e.end) : null;

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

  function parseDate(str) {
    if (!str) return null;

    // Cas année seule : "2002"
    if (/^\d{4}$/.test(str)) {
      return new Date(`${str}-01-01`);
    }

    // Cas "mois année" : "Avril 2023"
    if (/^[A-Za-zéûîôàèùçÉÂÀÔ]+\s+\d{4}$/.test(str)) {
      try {
        return new Date(`01 ${str}`);
      } catch (e) {
        return null;
      }
    }

    // Cas "jour mois année" : "15 novembre 2018"
    if (/^\d{1,2} [A-Za-zéûîôàèùçÉÂÀÔ]+ \d{4}$/.test(str)) {
      try {
        return new Date(str);
      } catch (e) {
        return null;
      }
    }

    return null;
  }
});
