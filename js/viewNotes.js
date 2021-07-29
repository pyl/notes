let googleUserId;
let guser;

window.onload = event => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Logged in as: " + user.displayName);
      googleUserId = user.displayName;
      guser = user;
      getNotes();
    } else {
      // If not logged in, navigate back to login page.
      window.location = "index.html";
    }
  });
};

const getNotes = e => {
  const notesRef = firebase.database().ref(`users`);
  notesRef.on("value", snapshot => {
    const data = snapshot.val();

    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = data => {
  let cards = ``;
  for (const user in data) {
    for (const noteId in data[user]) {
      const note = data[user][noteId];
      cards += createCard(note, noteId, user.toString());
    }
  }
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector("#app").innerHTML = cards;
};

const editNote = noteId => {
  const editNoteModal = document.querySelector("#editNoteModal");
  const notesRef = firebase.database().ref(`users/${googleUserId}`);
  notesRef.on("value", snapshot => {
    const data = snapshot.val();
    const noteDetails = data[noteId];
    document.querySelector("#editTitleInput").value = noteDetails.title;
    document.querySelector("#editTextInput").value = noteDetails.text;
    document.querySelector("#editNoteId").value = noteId;
  });
  const saveEditBtn = document.querySelector("#saveEdit");
  saveEditBtn.onclick = handleSaveEdit.bind(this, noteId);
  editNoteModal.classList.toggle("is-active");
};
//const ask = (noteId) =>

const handleSaveEdit = noteId => {
  const noteTitle = document.querySelector("#editTitleInput").value;
  const noteText = document.querySelector("#editTextInput").value;
  const noteEdits = {
    title: noteTitle,
    text: noteText
  };
  firebase
    .database()
    .ref(`users/${googleUserId}/${noteId}`)
    .update(noteEdits);
  closeEditModal();
};

const closeEditModal = () => {
  const editNoteModal = document.querySelector("#editNoteModal");
  editNoteModal.classList.toggle("is-active");
};

const activateModal = noteId => {
  const modal = document.querySelector("#modalstuff");
  modal.classList.add("is-active");
};
const deactivateModal = noteId => {
  console.log(noteId)
  const modal = document.querySelector("#modalstuff");
  modal.classList.remove("is-active");
  console.log(" dfasfs" + noteId);
  firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
  
};
const deactivateModal2 = noteId => {
  const modal = document.querySelector("#modalstuff");
  modal.classList.remove("is-active");
};

const createCard = (note, noteId, user) => {
  let innerHTML = "";
  innerHTML += `<div class="column is-one-quarter">`;
  innerHTML += `<div class="card">`;
  innerHTML += `<header class="card-header">`;

  innerHTML += `<p class="card-header-title">${user}</p>`;
  innerHTML += `<p class="card-header-title">`;
  innerHTML += `${note.title}`;
  innerHTML += `</p>`;
  innerHTML += `</header>`;
  innerHTML += `<div class="card-content">`;
  innerHTML += `<div class="content">`;
  innerHTML += `${note.text}`;
  innerHTML += `</div>`;
  if (note.labelArray !== undefined) {
    innerHTML += `<p> Labels: `;
    note.labelArray.forEach(x => {
      innerHTML += `${x} `;
    });
    innerHTML += `</p>`;
  }


  innerHTML += `<img src = "${note.userUrl}"></img>`;
  innerHTML += `<p>${note.created}`;
  innerHTML += `</div>`;
  innerHTML += `<footer class="card-footer">`;
  
  if (guser.displayName === note.userDisplay) {
    innerHTML += `<a id="${noteId}" class="card-footer-item" onclick="editNote("this.id")">Edit</a>`;
    innerHTML += `<a id="${noteId}" href="#" class="card-footer-item" onclick="activateModal(this.id)">Delete</a>`;
    innerHTML += `<div class="modal" id = "modalstuff">
      <div class="modal-background"></div>
      <div class="modal-card" >
        <header class="modal-card-head">
          <p class="modal-card-title">Delete Note</p>
          <button class="delete" aria-label="close" onclick="deactivateModal2(this.id)"></button>
        </header>
        <section class="modal-card-body">
          Are you sure you want to delete?
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" onclick="deactivateModal(this.id)">Save changes</button>
          <button class="button" onclick="deactivateModal2(this.id)""> Cancel </button>
        </footer>
      </div>
    </div>`;
  }

  innerHTML += `</footer>`;
  innerHTML += `</div>`;
  innerHTML += `</div>`;
  return innerHTML;
};
