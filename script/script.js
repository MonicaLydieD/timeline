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
      // Trier les événements chronologiquement
      events.sort((a, b) => parseDate(a.start) - parseDate(b.start));

      const items = new vis.DataSet();

      // Options de la timeline
      const options = {
        orientation: 'top',
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        zoomable: true,
        showCurrentTime: true,
        margin: { item: 20 },
        start: new Date('1980-01-01'),
        end: new Date('2026-12-31'),
        min: new Date('1970-01-01'),
        max: new Date('2030-12-31')
      };

      // Créer la timeline
      const timeline = new vis.Timeline(container, items, options);

      // Remplir les événements
      events.forEach((e, i) => {
        const startDate = parseDate(e.start);
        const endDate = e.end ? parseDate(e.end) : null;

        if (!startDate) {
          console.warn("Date invalide, événement ignoré :", e);
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

      // Interaction : afficher la description dans un panneau
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

  // Fonction de conversion des dates avec mois français
  function parseDate(str) {
    if (!str) return null;

    const moisFrancais = {
      janvier: "01", février: "02", mars: "03", avril: "04",
      mai: "05", juin: "06", juillet: "07", août: "08",
      septembre: "09", octobre: "10", novembre: "11", décembre: "12"
    };

    // Cas "AAAA"
    if (/^\d{4}$/.test(str)) {
      return new Date(`${str}-01-01`);
    }

    // Cas "Mois AAAA" ou "JJ Mois AAAA"
    const moisRegex = new RegExp(`^(\\d{1,2})?\\s*(${Object.keys(moisFrancais).join("|")})\\s+(\\d{4})$`, "i");
    const match = str.toLowerCase().match(moisRegex);
    if (match) {
      const jour = match[1] || "01";
      const mois = moisFrancais[match[2]];
      const annee = match[3];
      return new Date(`${annee}-${mois}-${jour}`);
    }

    // Fallback
    const date = new Date(str);
    return isNaN(date.getTime()) ? null : date;
  }
});
