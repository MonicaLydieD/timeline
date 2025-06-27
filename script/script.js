// script.js

document.addEventListener("DOMContentLoaded", () => {
  const timelineContainer = document.getElementById("timeline");

  // Récupère le nom de la page sans l'extension
  const page = window.location.pathname.split("/").pop().replace(".html", "").toLowerCase();

  // Correspondance du nom de page avec le fichier JSON
  const dataUrl = `${page}.json`;

  fetch(dataUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur de chargement du fichier JSON");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((event) => {
        const item = document.createElement("div");
        item.className = "timeline-item";

        const date = document.createElement("div");
        date.className = "timeline-date";
        date.textContent = event.date;

        const title = document.createElement("h3");
        title.textContent = event.title;

        const desc = document.createElement("p");
        desc.textContent = event.description;

        const content = document.createElement("div");
        content.className = "timeline-content";
        content.appendChild(title);
        if (event.description) content.appendChild(desc);

        item.appendChild(date);
        item.appendChild(content);
        timelineContainer.appendChild(item);
      });
    })
    .catch((error) => {
      console.error("Erreur :", error);
      timelineContainer.innerHTML = "<p>Impossible de charger la frise chronologique.</p>";
    });
});
