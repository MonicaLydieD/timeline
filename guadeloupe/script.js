// Charger les données JSON
fetch("data/guadeloupe_timeline.json")
  .then(response => response.json())
  .then(events => {
    const container = document.getElementById("timeline");
    const infoPanel = document.getElementById("info-panel");

    // Créer les éléments de la frise
    events.forEach((event) => {
      const node = document.createElement("div");
      node.className = "timeline-item";
      node.innerText = event.date;

      node.addEventListener("click", () => {
        infoPanel.innerHTML = `
          <h2>${event.title}</h2>
          <p><strong>${event.date}</strong></p>
          <p>${event.description.replace(/\n/g, "<br>")}</p>
        `;
      });

      container.appendChild(node);
    });

    // Ajouter le style CSS dynamiquement
    const style = document.createElement("style");
    style.textContent = `
      #timeline {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        overflow-x: auto;
        background: linear-gradient(to right, #f0f4f8, #e0ecf4);
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
      }

      .timeline-item {
        padding: 0.5rem 1rem;
        background-color: #ffffff;
        border: 2px solid #007acc;
        border-radius: 20px;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;
        white-space: nowrap;
      }

      .timeline-item:hover {
        transform: scale(1.05);
        background-color: #e6f7ff;
      }

      #info-panel {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        max-width: 600px;
        margin: auto;
      }

      #info-panel h2 {
        margin-top: 0;
        color: #007acc;
      }
    `;
    document.head.appendChild(style);
  })
  .catch(error => {
    console.error("Erreur de chargement JSON :", error);
  });
