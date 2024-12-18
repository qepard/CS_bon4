let noteCount;
const notesCache = {};
let lastOpenedNote = "";

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
    const note_in_list = document.createElement('div');

    const randomString = '_' + generateRandomString(4);
    note_in_list.id = randomString;

    note_in_list.classList.add('note_in_list');

    const defaultTitle = '';

    const noteTitle = document.createElement('div');
    noteTitle.classList.add('note_title');
    noteTitle.textContent = defaultTitle;
    note_in_list.appendChild(noteTitle);

    note_in_list.addEventListener('click', function () {
        openNoteWithSync(randomString);
    });

    document.getElementById('noteList').appendChild(note_in_list);

    // add a new note to the cache
    notesCache[randomString] = {
        title: defaultTitle,
        content: '',
    };

    update_Notes_counter();
}

// Function to open a note and synchronize the title and content
function openNoteWithSync(noteId) {
    openNote();

    const title_bar = document.getElementById('title_bar');
    const edit_area = document.querySelector('.edit_area');

    const noteElement = document.getElementById(noteId);
    const noteTitle = noteElement.querySelector('.note_title');

    // load data from the cache, if any
    if (notesCache[noteId]) {
        title_bar.value = notesCache[noteId].title;
        edit_area.innerHTML = notesCache[noteId].content;
        replaceDivWithP(edit_area);
    } else {
        // if the note is not in the cache (shouldn't happen, but just in case)
        title_bar.value = noteTitle.textContent;
        edit_area.innerHTML = "";
    }

    // delete old event handlers
    title_bar.replaceWith(title_bar.cloneNode(true));
    edit_area.replaceWith(edit_area.cloneNode(true));

    const newTitleBar = document.getElementById("title_bar");
    const newEditArea = document.querySelector('.edit_area');

    // add event handlers for synchronization
    newTitleBar.addEventListener('input', function () {
        noteTitle.textContent = newTitleBar.value;
        // update header in the cache
        notesCache[noteId].title = newTitleBar.value;
    });

    newEditArea.addEventListener('input', function () {
        // update content in the cache using innerHTML
        notesCache[noteId].content = newEditArea.innerHTML;
    });

    // handler for Enter
    newEditArea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const newParagraph = document.createElement('p');
            newParagraph.innerHTML = '<br>';

            // insert a new paragraph after the current one
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(newParagraph);

            // move the cursor to a new paragraph
            range.setStart(newParagraph, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });

    lastOpenedNote = noteId;
}

function update_Notes_counter() {
    const notesList = document.getElementById('noteList');
    noteCount = notesList.querySelectorAll('.note_in_list').length;

    // update text inside .tn_label
    const label = document.querySelector('.tn_label');
    label.textContent = `Total notes: ${noteCount}`;
}

function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notesCache));
    localStorage.setItem('noteCount', noteCount);
}

function loadNotesFromLocalStorage() {
    const storedNotes = localStorage.getItem('notes');
    const storedNoteCount = localStorage.getItem('noteCount');

    if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        for (const noteId in parsedNotes) {
            // create note list items based on data from localStorage
            const note_in_list = document.createElement('div');
            note_in_list.id = noteId;
            note_in_list.classList.add('note_in_list');

            const noteTitle = document.createElement('div');
            noteTitle.classList.add('note_title');
            noteTitle.textContent = parsedNotes[noteId].title;
            note_in_list.appendChild(noteTitle);

            note_in_list.addEventListener('click', function () {
                openNoteWithSync(noteId);
            });

            document.getElementById('noteList').appendChild(note_in_list);

            // add note to cache
            notesCache[noteId] = {
                title: parsedNotes[noteId].title,
                content: parsedNotes[noteId].content,
            };
        }
    }

    if (storedNoteCount) {
        noteCount = parseInt(storedNoteCount);
        update_Notes_counter(false); // do not increment counter because it is already loaded
    }
    update_Notes_counter();
}

// call load function at startup
loadNotesFromLocalStorage();

// call save function when closing/refreshing the page
window.addEventListener('beforeunload', saveNotesToLocalStorage);

function openNote(NoteId) {
    NoteInterface();
}

function NoteInterface() {

    if (document.querySelector('.format_bar')) {
        return;}

    // Create format bar
    const format_bar = document.createElement('div')
    format_bar.classList.add('format_bar')

    const elementNames = [
        "highlight",
        "h1",
        "h2",
        "h3",
        "bold",
        "italics",
        "underline",
        "checkbox",
        "strikethrough",
        "bulleted_list",
        "numbered_list",
        "divider",
        "quote",
        "align_left",
        "align_center",
        "align_right",
        "tab_right",
        "tab_left",
        "delete_note"
    ];

    // div svg icons
    const elementIcons = [
        /* highlight */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.8\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M13.7772 7.01518C14.3564 7.11345 14.7462 7.6619 14.6478 8.24018L13.1372 17.1141C13.082 17.4384 13.283 17.7513 13.6013 17.8364L22.0382 20.0932C22.3565 20.1783 22.6873 20.0077 22.8019 19.6993L25.9383 11.2602C26.1427 10.7103 26.755 10.4299 27.3059 10.6339C27.8568 10.838 28.1377 11.4492 27.9333 11.9991L24.7969 20.4382C24.3003 21.7744 22.8666 22.5138 21.4875 22.145L13.0506 19.8882C11.6715 19.5193 10.8002 18.1633 11.0394 16.7583L12.5501 7.8843C12.6485 7.30603 13.1979 6.91691 13.7772 7.01518ZM13.3185 21.8646L12.1982 25.9247C12.0489 26.4657 12.4566 27 13.0187 27H18.7397C19.1214 27 19.4564 26.7464 19.5594 26.3794L20.3018 23.7325L13.3185 21.8646ZM22.6862 12.4708C22.8383 11.9042 22.5015 11.3218 21.9339 11.17L18.5865 10.2746C18.0189 10.1228 17.4355 10.459 17.2835 11.0256C17.1314 11.5922 17.4682 12.1745 18.0358 12.3263L21.3832 13.2217C21.9508 13.3736 22.5342 13.0373 22.6862 12.4708Z\"></path></svg>",
        /* h1 */ "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"bi bi-type-h1\" viewBox=\"0 0 16 16\"><path d=\"M7.648 13V3H6.3v4.234H1.348V3H0v10h1.348V8.421H6.3V13zM14 13V3h-1.333l-2.381 1.766V6.12L12.6 4.443h.066V13z\"/></svg>",
        /* h2 */ "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"bi bi-type-h2\" viewBox=\"0 0 16 16\"><path d=\"M7.495 13V3.201H6.174v4.15H1.32V3.2H0V13h1.32V8.513h4.854V13zm3.174-7.071v-.05c0-.934.66-1.752 1.801-1.752 1.005 0 1.76.639 1.76 1.651 0 .898-.582 1.58-1.12 2.19l-3.69 4.2V13h6.331v-1.149h-4.458v-.079L13.9 8.786c.919-1.048 1.666-1.874 1.666-3.101C15.565 4.149 14.35 3 12.499 3 10.46 3 9.384 4.393 9.384 5.879v.05z\"/></svg>",
        /* h3 */ "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"bi bi-type-h3\" viewBox=\"0 0 16 16\"><path d=\"M11.07 8.4h1.049c1.174 0 1.99.69 2.004 1.724s-.802 1.786-2.068 1.779c-1.11-.007-1.905-.605-1.99-1.357h-1.21C8.926 11.91 10.116 13 12.028 13c1.99 0 3.439-1.188 3.404-2.87-.028-1.553-1.287-2.221-2.096-2.313v-.07c.724-.127 1.814-.935 1.772-2.293-.035-1.392-1.21-2.468-3.038-2.454-1.927.007-2.94 1.196-2.981 2.426h1.23c.064-.71.732-1.336 1.744-1.336 1.027 0 1.744.64 1.744 1.568.007.95-.738 1.639-1.744 1.639h-.991V8.4ZM7.495 13V3.201H6.174v4.15H1.32V3.2H0V13h1.32V8.513h4.854V13z\"/></svg>",
        /* bold */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.8\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M19.2273 9L14.4245 9C13.361 9 12.5 9.86223 12.5 10.9248V18.4189H12.5001V25.0472C12.5001 26.1093 13.3603 26.972 14.4243 26.972H20.3817C21.174 26.972 22.4387 26.7315 23.5353 25.9456C24.6879 25.1195 25.583 23.7369 25.583 21.6519C25.583 19.5669 24.6879 18.1843 23.5353 17.3582C23.3434 17.2207 23.1463 17.0998 22.9475 16.9941C23.7711 16.2326 24.3616 15.1405 24.3616 13.7095C24.3616 12.0273 23.5457 10.8134 22.4943 10.0545C21.4786 9.32134 20.2367 8.99997 19.2273 9ZM14.5909 16.328V11.0909L19.2274 11.0909C19.8464 11.0909 20.6489 11.3012 21.2705 11.7499C21.8565 12.1728 22.2707 12.7909 22.2707 13.7095C22.2707 14.6281 21.8565 15.2461 21.2705 15.6691C20.6489 16.1178 19.8464 16.328 19.2273 16.328H14.5909ZM14.591 24.8811V18.4227H20.3817C20.8337 18.4227 21.647 18.5774 22.3172 19.0577C22.9315 19.498 23.4921 20.2527 23.4921 21.6519C23.4921 23.0511 22.9315 23.8058 22.3173 24.2461C21.647 24.7264 20.8337 24.8811 20.3817 24.8811H14.591Z\"></path></svg>",
        /* italics */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.8\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.8692 9.99411C15.8692 9.44508 16.3406 9 16.9221 9H23.6605C24.242 9 24.7134 9.44508 24.7134 9.99411C24.7134 10.5431 24.242 10.9882 23.6605 10.9882H21.2582L18.2292 24.1105H20.2913C20.8728 24.1105 21.3442 24.5556 21.3442 25.1046C21.3442 25.6537 20.8728 26.0987 20.2913 26.0987H13.5529C12.9714 26.0987 12.5 25.6537 12.5 25.1046C12.5 24.5556 12.9714 24.1105 13.5529 24.1105H16.074L19.103 10.9882H16.9221C16.3406 10.9882 15.8692 10.5431 15.8692 9.99411Z\"></path></svg>",
        /* underline */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.8\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.5992 8C13.2063 8 13.6984 8.49213 13.6984 9.0992L13.6984 16.7697C13.6984 17.751 14.0488 18.8622 14.8079 19.7144C15.5432 20.5399 16.7212 21.1905 18.5349 21.1905C20.3486 21.1905 21.5266 20.5399 22.262 19.7144C23.021 18.8622 23.3714 17.751 23.3714 16.7698C23.3714 15.1065 23.3714 13.1898 23.3714 11.4288C23.3714 10.6041 23.3714 9.81357 23.3714 9.0992C23.3714 8.49213 23.8635 8 24.4706 8C25.0777 8 25.5698 8.49213 25.5698 9.0992C25.5698 9.81361 25.5698 10.6042 25.5698 11.4288C25.5698 13.1898 25.5698 15.1065 25.5698 16.7697C25.5699 18.2306 25.059 19.8794 23.9036 21.1766C22.7244 22.5005 20.9345 23.3889 18.5349 23.3889C16.1354 23.3889 14.3455 22.5005 13.1663 21.1766C12.0108 19.8794 11.5 18.2306 11.5 16.7697L11.5 9.0992C11.5 8.49213 11.9921 8 12.5992 8ZM11.5 26.6865C11.5 26.0794 11.9921 25.5873 12.5992 25.5873H24.4706C25.0777 25.5873 25.5698 26.0794 25.5698 26.6865C25.5698 27.2935 25.0777 27.7857 24.4706 27.7857H12.5992C11.9921 27.7857 11.5 27.2935 11.5 26.6865Z\"></path></svg>",
        /* checkbox */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.8\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M14.3 7H14.2587H14.2587C13.4537 6.99999 12.7894 6.99998 12.2482 7.04419C11.6861 7.09012 11.1694 7.18868 10.684 7.43598C9.93139 7.81947 9.31947 8.43139 8.93598 9.18404C8.68868 9.66937 8.59012 10.1861 8.54419 10.7482C8.49998 11.2894 8.49999 11.9537 8.5 12.7587V12.7587V12.8V21.2V21.2413V21.2413C8.49999 22.0463 8.49998 22.7106 8.54419 23.2518C8.59012 23.8139 8.68868 24.3306 8.93598 24.816C9.31947 25.5686 9.93139 26.1805 10.684 26.564C11.1694 26.8113 11.6861 26.9099 12.2482 26.9558C12.7894 27 13.4537 27 14.2587 27H14.3H22.7H22.7413C23.5463 27 24.2106 27 24.7518 26.9558C25.3139 26.9099 25.8306 26.8113 26.316 26.564C27.0686 26.1805 27.6805 25.5686 28.064 24.816C28.3113 24.3306 28.4099 23.8139 28.4558 23.2518C28.5 22.7106 28.5 22.0463 28.5 21.2413V21.2V12.8V12.7587C28.5 11.9537 28.5 11.2894 28.4558 10.7482C28.4099 10.1861 28.3113 9.66937 28.064 9.18404C27.6805 8.43139 27.0686 7.81947 26.316 7.43598C25.8306 7.18868 25.3139 7.09012 24.7518 7.04419C24.2106 6.99998 23.5463 6.99999 22.7413 7H22.7413H22.7H14.3ZM11.592 9.21799C11.7484 9.1383 11.9726 9.07337 12.411 9.03755C12.8611 9.00078 13.4434 9 14.3 9H22.7C23.5566 9 24.1389 9.00078 24.589 9.03755C25.0274 9.07337 25.2516 9.1383 25.408 9.21799C25.7843 9.40974 26.0903 9.7157 26.282 10.092C26.3617 10.2484 26.4266 10.4726 26.4624 10.911C26.4992 11.3611 26.5 11.9434 26.5 12.8V21.2C26.5 22.0566 26.4992 22.6389 26.4624 23.089C26.4266 23.5274 26.3617 23.7516 26.282 23.908C26.0903 24.2843 25.7843 24.5903 25.408 24.782C25.2516 24.8617 25.0274 24.9266 24.589 24.9624C24.1389 24.9992 23.5566 25 22.7 25H14.3C13.4434 25 12.8611 24.9992 12.411 24.9624C11.9726 24.9266 11.7484 24.8617 11.592 24.782C11.2157 24.5903 10.9097 24.2843 10.718 23.908C10.6383 23.7516 10.5734 23.5274 10.5376 23.089C10.5008 22.6389 10.5 22.0566 10.5 21.2V12.8C10.5 11.9434 10.5008 11.3611 10.5376 10.911C10.5734 10.4726 10.6383 10.2484 10.718 10.092C10.9097 9.7157 11.2157 9.40974 11.592 9.21799ZM23.7634 14.6459C24.1201 14.2243 24.0675 13.5934 23.6459 13.2366C23.2243 12.8799 22.5934 12.9325 22.2366 13.3541L17.5058 18.945L15.7682 16.8598C15.4147 16.4355 14.7841 16.3782 14.3598 16.7318C13.9355 17.0853 13.8782 17.7159 14.2318 18.1402L15.9694 20.2253C16.7651 21.1802 18.2298 21.1857 19.0326 20.2369L23.7634 14.6459Z\"></path></svg>",
        /* strikethrough */ "<svg viewBox=\"0 0 36 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g opacity=\"0.8\"><path d=\"M24 11.6818C24 11.6818 22.4286 8.5 18.7619 8.5C15.0952 8.5 13.5238 10.6212 13.5238 12.7424C13.5238 14.8636 15.619 15.9242 18.7619 16.9848C21.9048 18.0455 24 18.7161 24 21.3676C24 24.0192 21.9048 26 18.7619 26C14.0476 26 13 22.2879 13 22.2879\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M9 18H28\" stroke=\"white\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></g></svg>",
        /* bulleted_list */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><g opacity=\"0.8\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.3193 17.1131C15.3193 16.5109 15.8018 16.0227 16.397 16.0227H26.7424C27.3376 16.0227 27.8201 16.5109 27.8201 17.1131C27.8201 17.7154 27.3376 18.2036 26.7424 18.2036H16.397C15.8018 18.2036 15.3193 17.7154 15.3193 17.1131Z\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.3193 10.3086C15.3193 9.70632 15.8018 9.2181 16.397 9.2181H26.7424C27.3376 9.2181 27.8201 9.70632 27.8201 10.3086C27.8201 10.9108 27.3376 11.3991 26.7424 11.3991H16.397C15.8018 11.3991 15.3193 10.9108 15.3193 10.3086Z\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.3193 23.9177C15.3193 23.3155 15.8018 22.8273 16.397 22.8273H26.7424C27.3376 22.8273 27.8201 23.3155 27.8201 23.9177C27.8201 24.52 27.3376 25.0082 26.7424 25.0082H16.397C15.8018 25.0082 15.3193 24.52 15.3193 23.9177Z\"></path><path d=\"M9.5 17.1131C9.5 16.3904 10.079 15.8046 10.7932 15.8046C11.5074 15.8046 12.0864 16.3904 12.0864 17.1131C12.0864 17.8358 11.5074 18.4217 10.7932 18.4217C10.079 18.4217 9.5 17.8358 9.5 17.1131Z\"></path><path d=\"M9.5 10.3086C9.5 9.58587 10.079 9 10.7932 9C11.5074 9 12.0864 9.58587 12.0864 10.3086C12.0864 11.0313 11.5074 11.6172 10.7932 11.6172C10.079 11.6172 9.5 11.0313 9.5 10.3086Z\"></path><path d=\"M9.5 23.9177C9.5 23.195 10.079 22.6092 10.7932 22.6092C11.5074 22.6092 12.0864 23.195 12.0864 23.9177C12.0864 24.6404 11.5074 25.2263 10.7932 25.2263C10.079 25.2263 9.5 24.6404 9.5 23.9177Z\"></path></g></svg>",
        /* numbered_list */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><g opacity=\"0.8\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.3184 17.1138C15.3184 16.5115 15.8008 16.0233 16.396 16.0233H26.7415C27.3366 16.0233 27.8191 16.5115 27.8191 17.1138C27.8191 17.716 27.3366 18.2043 26.7415 18.2043H16.396C15.8008 18.2043 15.3184 17.716 15.3184 17.1138Z\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.3184 10.3092C15.3184 9.70697 15.8008 9.21875 16.396 9.21875H26.7415C27.3366 9.21875 27.8191 9.70697 27.8191 10.3092C27.8191 10.9115 27.3366 11.3997 26.7415 11.3997H16.396C15.8008 11.3997 15.3184 10.9115 15.3184 10.3092Z\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.3184 23.9184C15.3184 23.3161 15.8008 22.8279 16.396 22.8279H26.7415C27.3366 22.8279 27.8191 23.3161 27.8191 23.9184C27.8191 24.5206 27.3366 25.0089 26.7415 25.0089H16.396C15.8008 25.0089 15.3184 24.5206 15.3184 23.9184Z\"></path></g><g opacity=\"0.8\"><path d=\"M11.1104 23.7604L12.3824 22.3984V21.9604H9.83239V22.4404H11.6864L10.3664 23.9284L10.6544 24.3304C10.8104 24.2404 10.9784 24.1924 11.1524 24.1924C11.7344 24.1924 12.1004 24.5404 12.1004 25.0984C12.1004 25.6264 11.7224 26.0044 11.1884 26.0044C10.6964 26.0044 10.3724 25.7584 10.1924 25.3324L9.71839 25.5064C9.95839 26.1424 10.5344 26.4844 11.1704 26.4844C12.0464 26.4844 12.6344 25.9444 12.6344 25.0984C12.6344 24.0964 11.8124 23.6824 11.1224 23.7844L11.1104 23.7604Z\"></path><path d=\"M11.1104 23.7604L10.9642 23.6239L10.8693 23.7255L10.9315 23.8498L11.1104 23.7604ZM12.3824 22.3984L12.5286 22.5349L12.5824 22.4773V22.3984H12.3824ZM12.3824 21.9604H12.5824V21.7604H12.3824V21.9604ZM9.83239 21.9604V21.7604H9.63239V21.9604H9.83239ZM9.83239 22.4404H9.63239V22.6404H9.83239V22.4404ZM11.6864 22.4404L11.836 22.5731L12.1312 22.2404H11.6864V22.4404ZM10.3664 23.9284L10.2168 23.7957L10.1108 23.9151L10.2038 24.0449L10.3664 23.9284ZM10.6544 24.3304L10.4918 24.4469L10.5974 24.5942L10.7543 24.5036L10.6544 24.3304ZM10.1924 25.3324L10.3766 25.2545L10.3024 25.0789L10.1235 25.1446L10.1924 25.3324ZM9.71839 25.5064L9.64947 25.3186L9.46002 25.3882L9.53127 25.577L9.71839 25.5064ZM11.1224 23.7844L10.9435 23.8738L11.0083 24.0034L11.1516 23.9822L11.1224 23.7844ZM11.2566 23.8969L12.5286 22.5349L12.2362 22.2619L10.9642 23.6239L11.2566 23.8969ZM12.5824 22.3984V21.9604H12.1824V22.3984H12.5824ZM12.3824 21.7604H9.83239V22.1604H12.3824V21.7604ZM9.63239 21.9604V22.4404H10.0324V21.9604H9.63239ZM9.83239 22.6404H11.6864V22.2404H9.83239V22.6404ZM11.5368 22.3077L10.2168 23.7957L10.516 24.0611L11.836 22.5731L11.5368 22.3077ZM10.2038 24.0449L10.4918 24.4469L10.817 24.2139L10.529 23.8119L10.2038 24.0449ZM10.7543 24.5036C10.8826 24.4297 11.0164 24.3924 11.1524 24.3924V23.9924C10.9404 23.9924 10.7382 24.0511 10.5544 24.1572L10.7543 24.5036ZM11.1524 24.3924C11.4037 24.3924 11.5872 24.4669 11.7066 24.5808C11.8248 24.6937 11.9004 24.8645 11.9004 25.0984H12.3004C12.3004 24.7743 12.193 24.4921 11.9827 24.2915C11.7735 24.0918 11.483 23.9924 11.1524 23.9924V24.3924ZM11.9004 25.0984C11.9004 25.5151 11.6128 25.8044 11.1884 25.8044V26.2044C11.832 26.2044 12.3004 25.7377 12.3004 25.0984H11.9004ZM11.1884 25.8044C10.9771 25.8044 10.8143 25.7521 10.6876 25.6639C10.5599 25.5752 10.4552 25.4406 10.3766 25.2545L10.0082 25.4102C10.1096 25.6502 10.2569 25.8516 10.4592 25.9923C10.6624 26.1337 10.9077 26.2044 11.1884 26.2044V25.8044ZM10.1235 25.1446L9.64947 25.3186L9.78731 25.6941L10.2613 25.5201L10.1235 25.1446ZM9.53127 25.577C9.80379 26.2992 10.4604 26.6844 11.1704 26.6844V26.2844C10.6084 26.2844 10.113 25.9856 9.90551 25.4358L9.53127 25.577ZM11.1704 26.6844C11.6494 26.6844 12.0676 26.5362 12.3678 26.2545C12.6693 25.9714 12.8344 25.5697 12.8344 25.0984H12.4344C12.4344 25.473 12.3055 25.7643 12.094 25.9628C11.8812 26.1625 11.5674 26.2844 11.1704 26.2844V26.6844ZM12.8344 25.0984C12.8344 24.5366 12.6009 24.1219 12.2561 23.8666C11.9176 23.616 11.4851 23.5286 11.0931 23.5865L11.1516 23.9822C11.4497 23.9382 11.7732 24.0068 12.0181 24.1881C12.2569 24.3649 12.4344 24.6582 12.4344 25.0984H12.8344ZM11.3013 23.6949L11.2893 23.6709L10.9315 23.8498L10.9435 23.8738L11.3013 23.6949Z\"></path></g><g opacity=\"0.8\"><path d=\"M11.642 17.266C12.26 16.588 12.488 16.108 12.488 15.664C12.488 14.944 11.948 14.476 11.162 14.476C10.502 14.476 10.016 14.818 9.776 15.412L10.22 15.634C10.424 15.196 10.748 14.956 11.15 14.956C11.624 14.956 11.954 15.238 11.954 15.688C11.954 16.048 11.726 16.432 11.174 17.044L9.806 18.568V19H12.578V18.52H10.502L11.642 17.266Z\"></path><path d=\"M11.642 17.266L11.4942 17.1313L11.494 17.1315L11.642 17.266ZM9.776 15.412L9.59056 15.3371L9.52138 15.5083L9.68656 15.5909L9.776 15.412ZM10.22 15.634L10.1306 15.8129L10.3145 15.9048L10.4013 15.7184L10.22 15.634ZM11.174 17.044L11.0255 16.91L11.0252 16.9104L11.174 17.044ZM9.806 18.568L9.65717 18.4344L9.606 18.4914V18.568H9.806ZM9.806 19H9.606V19.2H9.806V19ZM12.578 19V19.2H12.778V19H12.578ZM12.578 18.52H12.778V18.32H12.578V18.52ZM10.502 18.52L10.354 18.3855L10.0499 18.72H10.502V18.52ZM11.7898 17.4007C12.418 16.7115 12.688 16.1841 12.688 15.664H12.288C12.288 16.0319 12.102 16.4645 11.4942 17.1313L11.7898 17.4007ZM12.688 15.664C12.688 15.2508 12.5314 14.8979 12.2525 14.6504C11.9759 14.4049 11.594 14.276 11.162 14.276V14.676C11.516 14.676 11.7971 14.7811 11.987 14.9496C12.1746 15.1161 12.288 15.3572 12.288 15.664H12.688ZM11.162 14.276C10.4187 14.276 9.86043 14.6692 9.59056 15.3371L9.96144 15.4869C10.1716 14.9668 10.5853 14.676 11.162 14.676V14.276ZM9.68656 15.5909L10.1306 15.8129L10.3094 15.4551L9.86544 15.2331L9.68656 15.5909ZM10.4013 15.7184C10.5815 15.3315 10.8451 15.156 11.15 15.156V14.756C10.6509 14.756 10.2665 15.0605 10.0387 15.5496L10.4013 15.7184ZM11.15 15.156C11.3481 15.156 11.4983 15.2146 11.5964 15.3023C11.6922 15.388 11.754 15.5149 11.754 15.688H12.154C12.154 15.4111 12.0508 15.172 11.8631 15.0042C11.6777 14.8384 11.4259 14.756 11.15 14.756V15.156ZM11.754 15.688C11.754 15.9628 11.5807 16.2945 11.0255 16.91L11.3225 17.178C11.8713 16.5695 12.154 16.1332 12.154 15.688H11.754ZM11.0252 16.9104L9.65717 18.4344L9.95483 18.7016L11.3228 17.1776L11.0252 16.9104ZM9.606 18.568V19H10.006V18.568H9.606ZM9.806 19.2H12.578V18.8H9.806V19.2ZM12.778 19V18.52H12.378V19H12.778ZM12.578 18.32H10.502V18.72H12.578V18.32ZM10.65 18.6545L11.79 17.4005L11.494 17.1315L10.354 18.3855L10.65 18.6545Z\"></path></g><g opacity=\"0.8\"><path d=\"M11.21 12V7.56H10.82L9.8 8.088V8.634L10.688 8.166V12H11.21Z\"></path><path d=\"M11.21 12V12.2H11.41V12H11.21ZM11.21 7.56H11.41V7.36H11.21V7.56ZM10.82 7.56V7.36H10.7713L10.7281 7.38239L10.82 7.56ZM9.8 8.088L9.70806 7.91039L9.6 7.96632V8.088H9.8ZM9.8 8.634H9.6V8.96548L9.89325 8.81093L9.8 8.634ZM10.688 8.166H10.888V7.83452L10.5948 7.98907L10.688 8.166ZM10.688 12H10.488V12.2H10.688V12ZM11.41 12V7.56H11.01V12H11.41ZM11.21 7.36H10.82V7.76H11.21V7.36ZM10.7281 7.38239L9.70806 7.91039L9.89194 8.26561L10.9119 7.73761L10.7281 7.38239ZM9.6 8.088V8.634H10V8.088H9.6ZM9.89325 8.81093L10.7812 8.34293L10.5948 7.98907L9.70675 8.45707L9.89325 8.81093ZM10.488 8.166V12H10.888V8.166H10.488ZM10.688 12.2H11.21V11.8H10.688V12.2Z\"></path></g></svg>",
        /* divider */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.8\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10.3008 17.1019C10.3008 16.4707 10.8068 15.959 11.431 15.959H25.8978C26.522 15.959 27.0281 16.4707 27.0281 17.1019C27.0281 17.7332 26.522 18.2449 25.8978 18.2449H11.431C10.8068 18.2449 10.3008 17.7332 10.3008 17.1019Z\"></path><circle opacity=\"0.8\" cx=\"11.1492\" cy=\"10.2\" r=\"1.2\"></circle><circle opacity=\"0.8\" cx=\"11.1492\" cy=\"24.2\" r=\"1.2\"></circle><circle opacity=\"0.8\" cx=\"16.1492\" cy=\"10.2\" r=\"1.2\"></circle><circle opacity=\"0.8\" cx=\"16.1492\" cy=\"24.2\" r=\"1.2\"></circle><circle opacity=\"0.8\" cx=\"21.1492\" cy=\"10.2\" r=\"1.2\"></circle><circle opacity=\"0.8\" cx=\"21.1492\" cy=\"24.2\" r=\"1.2\"></circle><circle opacity=\"0.8\" cx=\"26.1492\" cy=\"10.2\" r=\"1.2\"></circle><circle opacity=\"0.8\" cx=\"26.1492\" cy=\"24.2\" r=\"1.2\"></circle></svg>",
        /* quote */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.8\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.024 10.5142C16.2938 10.9527 16.1402 11.521 15.7373 11.8414C14.0496 13.183 13.5918 15.1285 13.6891 17.4158L13.7599 18.1943C13.7962 18.193 13.8327 18.1924 13.8693 18.1924C15.5921 18.1924 16.9886 19.589 16.9886 21.3117C16.9886 23.0345 15.5921 24.431 13.8693 24.431C12.1466 24.431 10.75 23.0345 10.75 21.3117L10.7501 21.2918L10.75 21.2918V17.9703C10.75 14.261 12.0423 11.5568 14.9381 10.1689C15.3317 9.98026 15.7952 10.1425 16.024 10.5142ZM25.0358 10.5142C25.3056 10.9527 25.1521 11.521 24.7491 11.8414C23.0615 13.183 22.6036 15.1285 22.7009 17.4158L22.7717 18.1943C22.808 18.193 22.8445 18.1924 22.8812 18.1924C24.6039 18.1924 26.0005 19.589 26.0005 21.3117C26.0005 23.0345 24.6039 24.431 22.8812 24.431C21.2018 24.431 19.8324 23.1039 19.7645 21.4412L19.7618 21.4414V21.3117V17.9703C19.7618 14.261 21.0541 11.5568 23.9499 10.1689C24.3435 9.98026 24.8071 10.1425 25.0358 10.5142Z\"></path></svg>",
        /* align_left */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M27.2266 10.143C27.2266 9.51172 26.7205 9 26.0963 9H11.6295C11.0053 9 10.4993 9.51172 10.4993 10.143C10.4993 10.7742 11.0053 11.2859 11.6295 11.2859H26.0963C26.7205 11.2859 27.2266 10.7742 27.2266 10.143ZM27.2266 17.1023C27.2266 16.471 26.7205 15.9593 26.0963 15.9593H11.6295C11.0053 15.9593 10.4993 16.471 10.4993 17.1023C10.4993 17.7335 11.0053 18.2452 11.6295 18.2452H26.0963C26.7205 18.2452 27.2266 17.7335 27.2266 17.1023ZM19.089 24.0616C19.089 23.4304 18.583 22.9186 17.9587 22.9186H11.6295C11.0053 22.9186 10.4993 23.4304 10.4993 24.0616C10.4993 24.6928 11.0053 25.2045 11.6295 25.2045H17.9587C18.583 25.2045 19.089 24.6928 19.089 24.0616Z\"></path></svg>",
        /* align_center */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M27.2266 10.143C27.2266 9.51172 26.7205 9 26.0963 9H11.6295C11.0053 9 10.4993 9.51172 10.4993 10.143C10.4993 10.7742 11.0053 11.2859 11.6295 11.2859H26.0963C26.7205 11.2859 27.2266 10.7742 27.2266 10.143ZM23.2266 17.1023C23.2266 16.471 22.7205 15.9593 22.0963 15.9593H15.6295C15.0053 15.9593 14.4993 16.471 14.4993 17.1023C14.4993 17.7335 15.0053 18.2452 15.6295 18.2452H22.0963C22.7205 18.2452 23.2266 17.7335 23.2266 17.1023ZM27.089 24.0616C27.089 23.4304 26.583 22.9186 25.9587 22.9186H11.6295C11.0053 22.9186 10.4993 23.4304 10.4993 24.0616C10.4993 24.6928 11.0053 25.2045 11.6295 25.2045H25.9587C26.583 25.2045 27.089 24.6928 27.089 24.0616Z\"></path></svg>",
        /* align_right */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M27.2266 10.143C27.2266 9.51172 26.7205 9 26.0963 9H11.6295C11.0053 9 10.4993 9.51172 10.4993 10.143C10.4993 10.7742 11.0053 11.2859 11.6295 11.2859H26.0963C26.7205 11.2859 27.2266 10.7742 27.2266 10.143ZM27.2266 17.1023C27.2266 16.471 26.7205 15.9593 26.0963 15.9593H11.6295C11.0053 15.9593 10.4993 16.471 10.4993 17.1023C10.4993 17.7335 11.0053 18.2452 11.6295 18.2452H26.0963C26.7205 18.2452 27.2266 17.7335 27.2266 17.1023ZM27.089 24.0616C27.089 23.4304 26.583 22.9186 25.9587 22.9186H19.6295C19.0053 22.9186 18.4993 23.4304 18.4993 24.0616C18.4993 24.6928 19.0053 25.2045 19.6295 25.2045H25.9587C26.583 25.2045 27.089 24.6928 27.089 24.0616Z\"></path></svg>",
        /* tab_right */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M26.5683 9C26.948 9 27.3122 9.12041 27.5807 9.33474C27.8492 9.54906 28 9.83975 28 10.1429C28 10.446 27.8492 10.7367 27.5807 10.951C27.3122 11.1653 26.948 11.2857 26.5683 11.2857H15.4343C15.0546 11.2857 14.6905 11.1653 14.422 10.951C14.1535 10.7367 14.0027 10.446 14.0027 10.1429C14.0027 9.83975 14.1535 9.54906 14.422 9.33474C14.6905 9.12041 15.0546 9 15.4343 9H26.5683ZM26.5683 22.7143C26.948 22.7143 27.3122 22.8347 27.5807 23.049C27.8492 23.2633 28 23.554 28 23.8571C28 24.1602 27.8492 24.4509 27.5807 24.6653C27.3122 24.8796 26.948 25 26.5683 25H15.4343C15.0546 25 14.6905 24.8796 14.422 24.6653C14.1535 24.4509 14.0027 24.1602 14.0027 23.8571C14.0027 23.554 14.1535 23.2633 14.422 23.049C14.6905 22.8347 15.0546 22.7143 15.4343 22.7143H26.5683ZM26.5683 15.8571C26.948 15.8571 27.3122 15.9776 27.5807 16.1919C27.8492 16.4062 28 16.6969 28 17C28 17.3031 27.8492 17.5938 27.5807 17.8081C27.3122 18.0224 26.948 18.1429 26.5683 18.1429H15.4317C15.052 18.1429 14.6878 18.0224 14.4193 17.8081C14.1508 17.5938 14 17.3031 14 17C14 16.6969 14.1508 16.4062 14.4193 16.1919C14.6878 15.9776 15.052 15.8571 15.4317 15.8571H26.5683Z\"></path><path d=\"M10.985 16.1653C11.584 16.5606 11.584 17.4394 10.985 17.8347L8.55074 19.4409C7.88589 19.8796 7 19.4027 7 18.6062L7 15.3938C7 14.5973 7.88589 14.1204 8.55074 14.5591L10.985 16.1653Z\"></path></svg>",
        /* tab_left */ "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10.4 9C10.0287 9 9.6726 9.12041 9.41005 9.33474C9.1475 9.54906 9 9.83975 9 10.1429C9 10.446 9.1475 10.7367 9.41005 10.951C9.6726 11.1653 10.0287 11.2857 10.4 11.2857H21.6C21.9713 11.2857 22.3274 11.1653 22.5899 10.951C22.8525 10.7367 23 10.446 23 10.1429C23 9.83975 22.8525 9.54906 22.5899 9.33474C22.3274 9.12041 21.9713 9 21.6 9H10.4ZM10.4 22.7143C10.0287 22.7143 9.6726 22.8347 9.41005 23.049C9.1475 23.2633 9 23.554 9 23.8571C9 24.1602 9.1475 24.4509 9.41005 24.6653C9.6726 24.8796 10.0287 25 10.4 25H21.6C21.9713 25 22.3274 24.8796 22.5899 24.6653C22.8525 24.4509 23 24.1602 23 23.8571C23 23.554 22.8525 23.2633 22.5899 23.049C22.3274 22.8347 21.9713 22.7143 21.6 22.7143H10.4ZM10.4 15.8571C10.0287 15.8571 9.6726 15.9776 9.41005 16.1919C9.1475 16.4062 9 16.6969 9 17C9 17.3031 9.1475 17.5938 9.41005 17.8081C9.6726 18.0224 10.0287 18.1429 10.4 18.1429H21.6C21.9713 18.1429 22.3274 18.0224 22.5899 17.8081C22.8525 17.5938 23 17.3031 23 17C23 16.6969 22.8525 16.4062 22.5899 16.1919C22.3274 15.9776 21.9713 15.8571 21.6 15.8571H10.4Z\"></path><path d=\"M26.015 16.1653C25.416 16.5606 25.416 17.4394 26.015 17.8347L28.4493 19.4409C29.1141 19.8796 30 19.4027 30 18.6062V15.3938C30 14.5972 29.1141 14.1204 28.4493 14.5591L26.015 16.1653Z\"></path></svg>",
        /* delete_note */ "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" viewBox=\"0 0 256 256\" xml:space=\"preserve\"><defs></defs><g style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;\" transform=\"translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)\"><path d=\"M 67.692 90 H 22.308 c -3.042 0 -5.518 -2.476 -5.518 -5.518 v -61 c 0 -1.104 0.896 -2 2 -2 h 52.42 c 1.104 0 2 0.896 2 2 v 61 C 73.21 87.524 70.734 90 67.692 90 z M 20.79 25.482 v 59 c 0 0.837 0.681 1.518 1.518 1.518 h 45.385 c 0.837 0 1.518 -0.681 1.518 -1.518 v -59 H 20.79 z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;\" transform=\" matrix(1 0 0 1 0 0) \" stroke-linecap=\"round\" /><path d=\"M 73.196 25.482 H 16.804 c -3.042 0 -5.518 -2.475 -5.518 -5.518 v -4.335 c 0 -3.042 2.475 -5.518 5.518 -5.518 h 56.393 c 3.042 0 5.518 2.475 5.518 5.518 v 4.335 C 78.714 23.007 76.238 25.482 73.196 25.482 z M 16.804 14.112 c -0.837 0 -1.518 0.681 -1.518 1.518 v 4.335 c 0 0.837 0.681 1.518 1.518 1.518 h 56.393 c 0.837 0 1.518 -0.681 1.518 -1.518 v -4.335 c 0 -0.837 -0.681 -1.518 -1.518 -1.518 H 16.804 z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;\" transform=\" matrix(1 0 0 1 0 0) \" stroke-linecap=\"round\" /><path d=\"M 57.197 14.112 H 32.803 c -1.104 0 -2 -0.896 -2 -2 V 5.518 C 30.803 2.476 33.278 0 36.321 0 h 17.358 c 3.043 0 5.519 2.476 5.519 5.518 v 6.594 C 59.197 13.216 58.302 14.112 57.197 14.112 z M 34.803 10.112 h 20.395 V 5.518 C 55.197 4.681 54.516 4 53.679 4 H 36.321 c -0.837 0 -1.518 0.681 -1.518 1.518 V 10.112 z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;\" transform=\" matrix(1 0 0 1 0 0) \" stroke-linecap=\"round\" /><path d=\"M 45 78.624 c -1.104 0 -2 -0.896 -2 -2 V 34.856 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 v 41.768 C 47 77.729 46.104 78.624 45 78.624 z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;\" transform=\" matrix(1 0 0 1 0 0) \" stroke-linecap=\"round\" /><path d=\"M 58.222 78.624 c -1.104 0 -2 -0.896 -2 -2 V 34.856 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 v 41.768 C 60.222 77.729 59.326 78.624 58.222 78.624 z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;\" transform=\" matrix(1 0 0 1 0 0) \" stroke-linecap=\"round\" /><path d=\"M 31.779 78.624 c -1.104 0 -2 -0.896 -2 -2 V 34.856 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 v 41.768 C 33.779 77.729 32.883 78.624 31.779 78.624 z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;\" transform=\" matrix(1 0 0 1 0 0) \" stroke-linecap=\"round\" /></g></svg>"
    ]

    // div action
    const elementAction = [
        /* highlight */ "format_text('mark')",
        /* h1 */ "format_text('h1')",
        /* h2 */ "format_text('h2')",
        /* h3 */ "format_text('h3')",
        /* bold */ "format_text('b')",
        /* italics */ "format_text('i')",
        /* underline */ "format_text('ins')",
        /* checkbox */ "format_text('checkbox', 'input')",
        /* strikethrough */ "format_text('del')",
        /* bulleted_list */ "format_text('li', 'ul')",
        /* numbered_list */ "format_text('li', 'ol')",
        /* divider */ "format_text('hr')",
        /* quote */ "format_text(null, 'blockquote')",
        /* align_left */ "format_text('text-align: left', 'css')",
        /* align_center */ "format_text('text-align: center', 'css')",
        /* align_right */ "format_text('text-align: right', 'css')",
        /* tab_right */ "format_text('text-indent: 50px', 'css')",
        /* tab_left */ "format_text('text-indent: 50px', 'css')",
        /* delete_note */ "format_text(null, 'del_note')"
    ]

    //  div abbr text
    const elementTooltip = [
        /* highlight */ "Highlight",
        /* h1 */ "First-level heading",
        /* h2 */ "Second-level heading",
        /* h3 */ "Third-level heading",
        /* bold */ "Bold",
        /* italics */ "Italics",
        /* underline */ "Underline",
        /* checkbox */ "Checkbox",
        /* strikethrough */ "Strikethrough",
        /* bulleted_list */ "Bulleted list", 
        /* numbered_list */ "Numbered list",
        /* divider */ "Divider",
        /* quote */ "Quote", 
        /* align_left */ "Align left",
        /* align_center */ "Align center",
        /* align_right */ "Align right",
        /* tab_right */ "Tab right",
        /* tab_left */ "Tab left",
        /* delete_note */ "Delete this note"
    ]

    for (let i = 0; i < 19 && i < elementNames.length; i++) {

        const element = document.createElement('div');
        element.id = elementNames[i];

        // set onclick action
        element.setAttribute('onclick', elementAction[i]);

        // set tooltip
        element.setAttribute('tooltip', elementTooltip[i]);

        // create container for svg
        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = elementIcons[i];
        element.appendChild(svgContainer.firstChild);

        format_bar.appendChild(element);
    }

    document.getElementById("notes_interface").appendChild(format_bar);

    // create title bar
    const title_bar = document.createElement('input');
    title_bar.id = 'title_bar';
    title_bar.setAttribute('placeholder', 'Title');
    title_bar.setAttribute('autocomplete', 'off');
    title_bar.setAttribute('maxlength', '30')
    document.getElementById("notes_interface").appendChild(title_bar);

    // сам edit_area
    const edit_area = document.createElement('div');
    edit_area.classList.add('edit_area');
    edit_area.setAttribute('contenteditable', 'true');
    
    // listening to changes in the edit_area
    edit_area.addEventListener('input', function () {
        replaceDivWithP(edit_area);
    });

    edit_area.addEventListener('keydown', function (event) {
        // if enter is pressed, prevent the event by default
        if (event.key === 'Enter') {
            event.preventDefault();

            // create a new p and focus on it
            const newParagraph = document.createElement('p');
            // add an empty p with <br> to display a newline
            newParagraph.innerHTML = '<br>';
            edit_area.appendChild(newParagraph);

            // move cursor to a new p
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(newParagraph, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });

    document.getElementById("notes_interface").appendChild(edit_area);
}

function replaceDivWithP(editor) {
    const children = editor.childNodes;
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'DIV') {
                const p = document.createElement('p');
                p.innerHTML = node.innerHTML;
                editor.replaceChild(p, node);
            } else if (node.tagName !== 'P') {
                const p = document.createElement('p');
                p.innerHTML = node.outerHTML || node.textContent;
                editor.replaceChild(p, node);
            }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
            const p = document.createElement('p');
            p.textContent = node.textContent;
            editor.replaceChild(p, node);
        }
    }

    // delete empty divs
    const emptyDivs = editor.querySelectorAll('div:empty');
    emptyDivs.forEach((emptyDiv) => emptyDiv.remove());

    // add <br> to the empty <p>
    const emptyPs = editor.querySelectorAll('p:empty');
    emptyPs.forEach((emptyP) => emptyP.innerHTML = '<br>');
}

function format_text(textManipulation = null, action = null){
    document.querySelector('.edit_area').addEventListener('keyup', () => {
        const caretDiv = getCurrentCaretElement();
        if (caretDiv) {
            switch (action){
                case 'input':

                    break;
                case 'blockquote':

                    break;
                case 'css':
                    
                    break;
                case null:
                    // caretDiv.outerHTML = caretDiv.outerHTML.replace(new RegExp(`^<${caretDiv.tagName.toLowerCase()}`), `<${textManipulation}`)
                                                        //    .replace(new RegExp(`</${caretDiv.tagName.toLowerCase()}$`), `</${textManipulation}>`);
                    break;
                case 'del_note':
                    const div = document.getElementById(lastOpenedNote);
                    div.remove();
                    
                    if (notesCache[lastOpenedNote]){
                        delete notesCache[lastOpenedNote];
                    }
                    saveNotesToLocalStorage();
                    loadNotesFromLocalStorage();
                    break;
            }
          console.log('The carriage is in the element:', caretDiv.element);
          console.log('Text inside the element:', caretDiv.element.textContent);
          console.log('The carriage is in range:', caretDiv.range.startOffset);
          console.log('Current highlight:', caretDiv.selectedText)
          console.log(notesCache)
          console.log(lastOpenedNote)
        }
      });
}

function getCurrentCaretElement() {
    const selection = window.getSelection();

    if (!selection.rangeCount) {
        return { element: null, range: null, selectedText: null };  // there is no highlighting/carriage
    }

    const range = selection.getRangeAt(0);
    const currentNode = range.startContainer;

    const allowedTags = 'mark, h1, h2, h3, b, i, ins, del, div';

    // if it is a text node, look for the nearest parent element from the list
    const element = currentNode.nodeType === Node.TEXT_NODE
        ? currentNode.parentElement.closest(allowedTags)
        : currentNode.closest(allowedTags);

    // current selected text
    const selectedText = selection.toString()

    return { 
        element: element || null, 
        range: range, 
        selectedText: selectedText || null 
    };
}
