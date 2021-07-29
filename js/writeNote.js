let googleUser;

window.onload = event => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Logged in as: " + user.displayName);
      googleUser = user;
    } else {
      window.location = "index.html"; // If not logged in, navigate back to login page.
    }
    const welcome = document.getElementById("welcome");
    welcome.innerHTML = "What's on your mind, " + user.displayName + "?";
  });
};

var labelArray = [];

const label = document.getElementById("label");
label.addEventListener("keypress", e => {
  if (e.keyCode === 13) {
    labelArray.push(label.value);
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(label.value));
    document.getElementById("labellist").appendChild(li);
    label.value = "";
  }
});

const handleNoteSubmit = () => {
  // 1. Capture the form data
  const noteTitle = document.querySelector("#noteTitle");
  const noteText = document.querySelector("#noteText");
  const date = new Date();
  const noteCreated =
    String(date.getHours()) +
    ":" +
    String(date.getMinutes()) +
    ":" +
    String(date.getSeconds());
  const noteLabelArray = labelArray;

  // 2. Format the data and write it to our database
  firebase
    .database()
    .ref(`users/${googleUser.displayName}`)
    .push({
      title: noteTitle.value,
      text: noteText.value,
      labelArray: noteLabelArray,
      created: noteCreated,
      userUrl: googleUser.photoURL,
      userDisplay: googleUser.displayName
    })
    // 3. Clear the form so that we can write a new note
    .then(() => {
      noteTitle.value = "";
      noteText.value = "";
      label.value = "";
      document.getElementById("labellist").innerHTML = "";
      labelArray = [];
    });
};
