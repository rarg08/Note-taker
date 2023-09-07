const express = require("express"); // here we require exppress, path, and fs to run the server
const path = require("path");
const fs = require("fs");


const app = express();
const PORT = process.env.PORT || 3001;
const directory = path.join(__dirname, "/public"); // here we are creating a directory for the server to run

//here we set some middleware for the server
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//GET
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));// here we are creating a path for the index.html file to be displayed
});
app.get ("/notes". function(req, res) {
    res.sendFile(path.join(directory, "notes.html")); // here we create the path for the notes.html file to be displayed
});


app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json")); // here we create the path for the db.json file to be sent
});

app.get('/api/notes/:id', function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]); // here we are creating a path for a specifical if of a saved note
});

//POST
app.post("/api/notes", function(req, res) { 
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let noteID = (savedNotes.length).toString();
    newNote.id = noteID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
});

//DELETE

app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })

    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});

app/listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
