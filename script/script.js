document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("timeline");

  // Récupère le nom du fichier JSON à partir de l'attribut data-json sur la div
  const jsonFile = container.dataset.json;

  fetch(jsonFile)
    .then(response => {
      if (!response.ok) {
        throw new Error("Fichier JSON introuvable");
      }
      return response.json();
    })
    .then(events => {
      events.forEach(event => {
        const entry = document.createElement("div");
        entry.className = "timeline-entry";

        const date = document.createElement("div");
        date.className = "timeline-date";
        date.textContent = event.date;

        const title = document.createElement("div");
        title.className = "timeline-title";
        title.textContent = event.title;

        const description = document.createElement("div");
        description.className = "timeline-description";
        description.textContent = event.description;

        entry.appendChild(date);
        entry.appendChild(title);
        entry.appendChild(description);

        container.appendChild(entry);
      });
    })
    .catch(error => {
      container.innerHTML = `<p class="error">Erreur lors du chargement de la chronologie : ${error.message}</p>`;
    });
});

