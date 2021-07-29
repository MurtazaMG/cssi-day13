let googleUser;
window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note,key);
    }
};

const createCard = (note,noteId) => {
    return `<div class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                    </div> 
                    <footer class="card-footer">
                        <a 
                            href="#" 
                            class="card-footer-item"
                            onclick="editNote('${noteId}')">
                            Edit</a>
                        <a 
                            href="#" 
                            class="card-footer-item"
                            onclick="deleteNote('${noteId}')"
                            >Delete</a>
                    </footer>
                </div>
            </div>`;
};

const deleteNote = (noteId) => {
    //console.log(googleUser);
    const noteToDeleteRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToDeleteRef.remove();
};

const editNote = (noteId) => {
    console.log(`Edit note: ${noteId}`);
    

    const noteToEdit = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToEdit.on('value', (snapshot) => {
        const editNoteModal = document.querySelector("#editNoteModal");
        const noteTitle = document.querySelector("#noteTitle");
        const noteText = document.querySelector("#noteText");
        const noteKey = document.querySelector("#noteId");
        
        const note = snapshot.val();
        
        noteTitle.value = note.title;
        noteText.value = note.text;
        noteKey.value = noteId;

        editNoteModal.classList.add("is-active");
    });
    
    
};

const closeModal = () => {
    const editNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.remove("is-active");
};

const saveEdit = () => {
    //const editNoteModal = document.querySelector("#editNoteModal");
    const noteTitle = document.querySelector("#noteTitle");
    const noteText = document.querySelector("#noteText");
    const noteId = document.querySelector("#noteId").value;

    const noteToEdit = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToEdit.update({
        title: noteTitle.value,
        text: noteText.value
    })
    closeModal();
};


