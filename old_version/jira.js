// --- DOM Elements ---
const form = document.getElementById("form");
const TODO = document.getElementById("TODO");
const PROCESS = document.getElementById("PROCESS");
const DONE = document.getElementById("DONE");
const formSection = document.getElementById("pop");

// --- Drag and Drop Logic ---
let draggingElement = null;

function handleDragStart(e) {
    draggingElement = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    // Add a slight transparency to the element being dragged
    setTimeout(() => {
        e.target.style.opacity = "0.5";
    }, 0);
}

function handleDragEnd(e) {
    // Reset opacity when dragging ends
    e.target.style.opacity = "1";
}

function handleDragOver(e) {
    // Allow drop only if moving to a different column
    if (draggingElement && draggingElement.parentNode.id === e.currentTarget.id) {
        return;
    }
    e.preventDefault(); 
}

function updateCardColor(card, status) {
    // Remove existing status classes
    card.classList.remove("card-todo", "card-process", "card-done");
    
    // Add new status class based on column ID
    if (status === "TODO") {
        card.classList.add("card-todo");
    } else if (status === "PROCESS") {
        card.classList.add("card-process");
    } else if (status === "DONE") {
        card.classList.add("card-done");
    }
}

function handleDrop(e) {
    e.preventDefault();
    if (draggingElement) {
        const newColumn = e.currentTarget;
        newColumn.append(draggingElement);
        
        // Update card color based on the new column
        updateCardColor(draggingElement, newColumn.id);
    }
}

// Attach listeners to columns
[TODO, PROCESS, DONE].forEach(column => {
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("drop", handleDrop);
});


// --- Form Handling ---
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const taskStatus = form.status.value;
    const topic = form.topic.value;
    const days = form.days.value;
    const name = form.name.value;

    // Create Card
    const card = document.createElement("div");
    card.className = "main-div";
    card.draggable = true;
    
    // Set initial color based on selected status
    updateCardColor(card, taskStatus);

    // Attach drag events to the new card
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);

    // Card Content
    card.innerHTML = `
        <div class="topic-name">
            <h2>${topic}</h2>
            <h6>By: ${name}</h6>
        </div>
        <div class="days-div">
            <h3>${days} Days</h3>
            <h3 class="character">${name.charAt(0).toUpperCase()}</h3>
        </div>
    `;

    // Append to the correct column
    const destinationColumn = document.getElementById(taskStatus);
    destinationColumn.append(card);

    // Reset form
    form.reset();

    // Auto-close the popup
    if (!formSection.classList.contains("popup-down")) {
        formSection.classList.add("popup-down");
        const icon = document.querySelector(".minimize");
        if (icon) {
            icon.innerText = "expand_less";
        }
    }
});

// --- Popup Toggle ---
function togglepop(iconElement) {
    formSection.classList.toggle("popup-down");
    
    // Update icon
    const isDown = formSection.classList.contains("popup-down");
    iconElement.innerText = isDown ? "expand_less" : "expand_more";
}
