fetch("data/guadeloupe_timeline.json")
  .then(response => response.json())
  .then(data => {
    const items = data.map((event, index) => ({
      id: index,
      content: event.title,
      start: event.date,
      fullDescription: event.description
    }));

    const timeline = new vis.Timeline(
      document.getElementById("timeline"),
      new vis.DataSet(items),
      {}
    );

    const detailBox = document.getElementById("details");

    timeline.on('select', function (props) {
      const selectedItem = items.find(item => item.id === props.items[0]);
      if (selectedItem) {
        detailBox.innerHTML = `<h3>${selectedItem.content}</h3><p>${selectedItem.fullDescription}</p><p><strong>Date :</strong> ${selectedItem.start}</p>`;
      }
    });
  });
