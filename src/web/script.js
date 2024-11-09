let noteCount = 0;

// Function for notes id's and etc.
function generateRandomString(length) {
    const characters = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

function createNote() {
    // Create a new div for the note
    const note_in_list = document.createElement('div');
    
    const randomString = generateRandomString(4);

    note_in_list.id = '_' + randomString;
    
    // Add the 'note_in_list' class
    note_in_list.classList.add('note_in_list_' + randomString);

    note_in_list.addEventListener('click', function() {
        openNote(randomString); // Passing randomString to openNote
    });

    // Adding a note to a container
    document.getElementById('noteList').appendChild(note_in_list);

    update_Notes_counter(true);
}


function update_Notes_counter(increment) {
    // Increase or decrease the number of notes depending on the argument
    if (increment) {
        noteCount++;
    } else {
        noteCount--;
    }

    // Update text inside element p with class 'tn_label'
    const label = document.querySelector('.tn_label');
    label.textContent = `Total notes: ${noteCount}`;
}

function openNote(NoteId) {
    // Future functionality
}
