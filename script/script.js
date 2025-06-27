document.addEventListener("DOMContentLoaded", () => {
  const timelineContainer = document.getElementById("timeline");

  // Récupère le nom de la page sans l'extension (guadeloupe, martinique, guyane)
  const page = window.location.pathname.split("/").pop().replace(".html", "").toLowerCase();

  // Fichier JSON dans le dossier 'data'
  const dataUrl = `data/${page}.json`;

  fetch(dataUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur de chargement du fichier JSON");
      }
      return response.json();
    })
    .then((data) => {
      generateTimeline(data); // Appel à la fonction qui génère l'affichage
    })
    .catch((error) => {
      console.error("Erreur :", error);
      timelineContainer.innerHTML = "<p>Impossible de charger la chronologie.</p>";
    });
});

// Fonction pour créer dynamiquement les éléments de la timeline
function generateTimeline(events) {
  const timelineContainer = document.getElementById("timeline");

  events.forEach((event, index) => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    const marker = document.createElement("div");
    marker.className = "timeline-marker";

    const content = document.createElement("div");
    content.className = "timeline-content";

    const date = document.createElement("h3");
    date.textContent = event.date;

    const title = document.createElement("h4");
    title.textContent = event.title;

    const desc = document.createElement("p");
    desc.textContent = event.description;

    content.appendChild(date);
    content.appendChild(title);
    content.appendChild(desc);

    item.appendChild(marker);
    item.appendChild(content);
    timelineContainer.appendChild(item);
  });
}
