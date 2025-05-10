document.addEventListener("DOMContentLoaded", function () {
  const inputType = document.getElementById("inputType");
  const outputType = document.getElementById("outputType");
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const actionBtn = document.getElementById("actionBtn");
  const saveBtn = document.getElementById("saveBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const toggleSavedBtn = document.getElementById("toggleSavedBtn");
  const toggleThemeBtn = document.getElementById("toggleThemeBtn");
  const savedList = document.getElementById("savedList");
  const savedItemsList = document.getElementById("savedItemsList");
  const caesarShiftContainer = document.getElementById("caesarShiftContainer");
  const caesarShift = document.getElementById("caesarShift");
  const outputCaesarShiftContainer = document.getElementById(
    "outputCaesarShiftContainer"
  );
  const outputCaesarShift = document.getElementById("outputCaesarShift");

  let savedItems = [];

  // Einstellungen aus dem lokalen Speicher laden
  loadSettings();
  loadSavedItems();

  // Event Listeners
  inputType.addEventListener("change", handleInputTypeChange);
  outputType.addEventListener("change", handleOutputTypeChange);
  actionBtn.addEventListener("click", handleAction);
  saveBtn.addEventListener("click", saveItem);
  downloadBtn.addEventListener("click", downloadText);
  toggleSavedBtn.addEventListener("click", toggleSavedList);
  toggleThemeBtn.addEventListener("click", toggleTheme);

  // Funktionen
  function handleInputTypeChange() {
    if (inputType.value === "caesar") {
      caesarShiftContainer.classList.remove("hidden");
    } else {
      caesarShiftContainer.classList.add("hidden");
    }
  }

  function handleOutputTypeChange() {
    if (outputType.value === "caesar") {
      outputCaesarShiftContainer.classList.remove("hidden");
    } else {
      outputCaesarShiftContainer.classList.add("hidden");
    }
  }

  function handleAction() {
    if (!inputText.value.trim()) {
      showNotification("Bitte gib einen Text ein!", "error");
      return;
    }

    const inType = inputType.value;
    const outType = outputType.value;
    const text = inputText.value;
    const inShift = parseInt(caesarShift.value);
    const outShift = parseInt(outputCaesarShift.value);

    // Decide whether to encrypt or decrypt based on outputText content
    // If output is empty, encrypt; if output has content, decrypt
    const shouldEncrypt = !outputText.value.trim();

    const endpoint = shouldEncrypt ? "/api/encrypt" : "/api/decrypt";

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_type: inType,
        output_type: outType,
        text: text,
        input_shift: inShift,
        output_shift: outShift,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          outputText.value = data.result;
          showNotification(
            shouldEncrypt
              ? "Verschlüsselung erfolgreich!"
              : "Entschlüsselung erfolgreich!",
            "success"
          );
        } else {
          showNotification(
            data.message ||
              (shouldEncrypt
                ? "Fehler bei der Verschlüsselung"
                : "Fehler bei der Entschlüsselung"),
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Fehler:", error);
        showNotification("Fehler bei der Verbindung zum Server", "error");
      });
  }

  function saveItem() {
    if (!inputText.value.trim() || !outputText.value.trim()) {
      showNotification(
        "Bitte führe erst eine Verschlüsselung/Entschlüsselung durch!",
        "error"
      );
      return;
    }

    const timestamp = new Date().toLocaleString();
    const newItem = {
      timestamp: timestamp,
      input: {
        type: inputType.value,
        shift: inputType.value === "caesar" ? parseInt(caesarShift.value) : null,
        text: inputText.value,
      },
      output: {
        type: outputType.value,
        shift:
          outputType.value === "caesar" ? parseInt(outputCaesarShift.value) : null,
        text: outputText.value,
      },
    };

    // Server-Anfrage zum Speichern
    fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Add the returned id to the newItem
          newItem.id = data.id;
          // Add to savedItems array and update UI
          savedItems.unshift(newItem);
          updateSavedItemsList();
          showNotification("Erfolgreich gespeichert!", "success");
        } else {
          showNotification(
            "Server-Speicherung fehlgeschlagen.",
            "warning"
          );
        }
      })
      .catch((error) => {
        console.error("Fehler:", error);
        showNotification(
          "Server-Verbindungsfehler.",
          "warning"
        );
      });
  }

  function downloadText() {
    if (!inputText.value.trim() && !outputText.value.trim()) {
      showNotification("Nichts zum Herunterladen vorhanden!", "error");
      return;
    }

    const timestamp = new Date().toLocaleString().replace(/[/\\:]/g, "-");
    const content = `ANAE Verschlüsselung/Entschlüsselung (${timestamp})
------------------------
EINGABE (${inputType.value}${
      inputType.value === "caesar" ? `, Verschiebung: ${caesarShift.value}` : ""
    }):
${inputText.value}

AUSGABE (${outputType.value}${
      outputType.value === "caesar"
        ? `, Verschiebung: ${outputCaesarShift.value}`
        : ""
    }):
${outputText.value}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `ANAE_${timestamp}.txt`;
    a.click();

    URL.revokeObjectURL(url);
    showNotification("Datei wurde heruntergeladen!", "success");
  }

  function toggleSavedList() {
    savedList.classList.toggle("active");
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    // Icon aktualisieren
    if (document.body.classList.contains("dark-mode")) {
      toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem("anae_dark_mode", "true");
    } else {
      toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem("anae_dark_mode", "false");
    }
  }

  function loadSettings() {
    // Dark Mode laden
    if (localStorage.getItem("anae_dark_mode") === "true") {
      document.body.classList.add("dark-mode");
      toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  function loadSavedItems() {
    // Vom Server laden
    fetch("/api/saved")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.items) {
          savedItems = data.items;
          updateSavedItemsList();
        }
      })
      .catch((error) => {
        console.error("Fehler beim Laden vom Server:", error);
      });
  }

  function updateSavedItemsList() {
    savedItemsList.innerHTML = "";

    if (savedItems.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.textContent = "Keine gespeicherten Einträge vorhanden";
      emptyMessage.style.fontStyle = "italic";
      emptyMessage.style.color = "#777";
      savedItemsList.appendChild(emptyMessage);
      return;
    }

    savedItems.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "saved-item";
      itemElement.setAttribute("data-id", item.id);

      const titleElement = document.createElement("div");
      titleElement.className = "saved-item-title";
      titleElement.textContent = `${getTypeLabel(
        item.input.type
      )} → ${getTypeLabel(item.output.type)}`;

      const previewElement = document.createElement("div");
      previewElement.className = "saved-item-preview";
      previewElement.textContent =
        item.input.text.substring(0, 30) +
        (item.input.text.length > 30 ? "..." : "");

      const timeElement = document.createElement("div");
      timeElement.className = "saved-item-time";
      timeElement.textContent = item.timestamp;
      timeElement.style.fontSize = "0.8rem";
      timeElement.style.marginTop = "0.3rem";
      timeElement.style.color = "#777";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Löschen";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.style.backgroundColor = "#ff3333";
      deleteBtn.style.color = "#fff";
      deleteBtn.style.border = "none";
      deleteBtn.style.padding = "2px 6px";
      deleteBtn.style.borderRadius = "3px";
      deleteBtn.style.cursor = "pointer";

      deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteSavedItem(item.id);
      });

      itemElement.appendChild(titleElement);
      itemElement.appendChild(previewElement);
      itemElement.appendChild(timeElement);
      itemElement.appendChild(deleteBtn);

      itemElement.addEventListener("click", () => loadSavedItem(item));

      savedItemsList.appendChild(itemElement);
    });
  }

  function deleteSavedItem(id) {
    fetch(`/api/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          savedItems = savedItems.filter((item) => item.id !== id);
          updateSavedItemsList();
          showNotification("Eintrag gelöscht!", "success");
        } else {
          showNotification("Löschen fehlgeschlagen!", "error");
        }
      })
      .catch((error) => {
        console.error("Fehler beim Löschen:", error);
        showNotification("Fehler beim Löschen des Eintrags", "error");
      });
  }

  function loadSavedItem(item) {
    inputType.value = item.input.type;
    outputType.value = item.output.type;
    inputText.value = item.input.text;
    outputText.value = item.output.text;

    if (item.input.type === "caesar") {
      caesarShiftContainer.classList.remove("hidden");
      caesarShift.value = item.input.shift;
    } else {
      caesarShiftContainer.classList.add("hidden");
    }

    if (item.output.type === "caesar") {
      outputCaesarShiftContainer.classList.remove("hidden");
      outputCaesarShift.value = item.output.shift;
    } else {
      outputCaesarShiftContainer.classList.add("hidden");
    }

    // Auf mobilen Geräten die Sidebar ausblenden
    if (window.innerWidth <= 768) {
      savedList.classList.remove("active");
    }

    showNotification("Eintrag geladen!", "success");
  }

  function getTypeLabel(type) {
    switch (type) {
      case "text":
        return "Text";
      case "binary":
        return "Binär";
      case "caesar":
        return "Cäsar";
      default:
        return type;
    }
  }

  function showNotification(message, type = "info") {
    // Bestehende Benachrichtigung entfernen
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Neue Benachrichtigung erstellen
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Farben basierend auf Typ
    let bgColor, textColor;
    switch (type) {
      case "success":
        bgColor = "#1fcc00";
        textColor = "#fff";
        break;
      case "error":
        bgColor = "#ff3333";
        textColor = "#fff";
        break;
      case "warning":
        bgColor = "#ff9900";
        textColor = "#fff";
        break;
      default:
        bgColor = "#333";
        textColor = "#fff";
    }

    // Stile anwenden
    Object.assign(notification.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "10px 20px",
      borderRadius: "4px",
      backgroundColor: bgColor,
      color: textColor,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      zIndex: "1000",
      opacity: "0",
      transition: "opacity 0.3s",
    });

    // Animation
    setTimeout(() => {
      notification.style.opacity = "1";
    }, 10);

    // Nach 3 Sekunden ausblenden
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});
