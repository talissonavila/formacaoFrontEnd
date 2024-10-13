const notesContainer = document.querySelector("#notes-container");
const noteInput = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#export-notes")

function showNotes() {
    cleanNotes();

    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);

        notesContainer.appendChild(noteElement);
    });
}

function cleanNotes() {
    notesContainer.replaceChildren([]);
}

function addNote() {
    const notes = getNotes();

    const noteObject = {
        id: generateId(),
        content: noteInput.value.trim(),
        fixed: false,
    }
    const noteElement = createNote(noteObject.id, noteObject.content);
    notesContainer.appendChild(noteElement);
    notes.push(noteObject);
    saveNotes(notes);
    noteInput.value = "";
}

function generateId() {
    return Math.floor(Math.random() * 50000);
}

function createNote(id, content, fixed) {
    const element = document.createElement("div");
    element.classList.add("note");
    const textArea = document.createElement("textarea");
    textArea.value =  content;
    textArea.placeholder = "Adicione algum texto...";
    element.appendChild(textArea);

    const pinIcon = document.createElement("i");
    pinIcon.classList.add(...["bi", "bi-pin"]);
    element.appendChild(pinIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(...["bi", "bi-x-lg"]);
    element.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i");
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
    element.appendChild(duplicateIcon);



    if (fixed) {
        element.classList.add("fixed");
        pinIcon.classList.add("fixed");
    }

    // element events
    element.querySelector("textarea").addEventListener("keyup", (event) => {
        const noteContent = event.target.value;
        updateNote(id, noteContent);
    });

    element.querySelector(".bi-pin").addEventListener("click", () => toggleFixNote(id));

    element.querySelector(".bi-x-lg").addEventListener("click", () => deleteNote(id, element));

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => copyNote(id));

    return element;
}

function toggleFixNote(id) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id === id)[0];
    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);
    showNotes();
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id);
    saveNotes(notes);
    notesContainer.removeChild(element);
}

function copyNote(id) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id === id)[0];
    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false
    }

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed);
    notesContainer.appendChild(noteElement);
    notes.push(noteObject);
    saveNotes(notes);
}

function updateNote(id, newContent) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id === id)[0];
    targetNote.content = newContent;
    console.log(targetNote.content)
    saveNotes(notes);
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function searchNotes(value) {
    const notesResult = getNotes().filter((note) => {
        return note.content.includes(value);
    });
    if (value !== "") {
        cleanNotes();

        notesResult.forEach((note) => {
            const noteElement = createNote(note.id, note.content, note.fixed);
            notesContainer.appendChild(noteElement);
        });
        return;
    }
    cleanNotes();
    showNotes();
}

function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((noteA, noteB) => (noteA.fixed > noteB.fixed ? -1 : 1));

    return orderedNotes;
}

function exportData() {
    const notes = getNotes();

    const csvString = [
        ["Id", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ].map((event) => event.join(",")).join("\n");

    const element = document.createElement("a");
    element.href = `data:text/csv;charset=utf-8,${encodeURI(csvString)}`;
    //element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

    element.target = "_blank";

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
    element.download = `notes_${formattedDate}.csv`;
    element.click();
}

addNoteBtn.addEventListener("click", () => {
    addNote();
});

searchInput.addEventListener("keyup", (event) => {
    const searchValue = event.target.value.toLowerCase();
    searchNotes(searchValue);
});

noteInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addNote();
});

exportBtn.addEventListener("click", () => {
    exportData();
});

showNotes();