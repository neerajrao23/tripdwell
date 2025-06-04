  const searchInput = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestionsBox");

  let selectedId = null;

  // Show suggestions as user types
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    if (term.length === 0) return;

    const filtered = allListings.filter(item => item.title.toLowerCase().includes(term));

    filtered.forEach(item => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.textContent = item.title;
      li.onclick = () => {
        searchInput.value = item.title;
        selectedId = item.id;
        suggestionsBox.innerHTML = "";
      };
      suggestionsBox.appendChild(li);
    });
  });

  // Clear suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
      suggestionsBox.innerHTML = "";
    }
  });

  function handleSearchSubmit() {
    const term = searchInput.value.trim().toLowerCase();
    if (selectedId) {
      window.location.href = `/listings/${selectedId}`;
      return false;
    }
    const target = allListings.find(item => item.title.toLowerCase() === term);
    if (target) {
      window.location.href = `/listings/${target.id}`;
    } else {
      alert("Listing not found!");
    }
    return false;
  }

  let taxSwitch = document.getElementById('switchCheckDefault');
        taxSwitch.addEventListener("click", () => {
            let taxInfo = document.getElementsByClassName('tax-info');
            for(info of taxInfo) {
                if(info.style.display != 'inline') {
                    info.style.display = 'inline';
                } else {
                    info.style.display = 'none';
                }
            }
        });