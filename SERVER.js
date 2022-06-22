// Require Dependencies
const express = require("express");
const fs = require("fs");
const path = require('path');
const database = require("./db")

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Setup data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/'));
// app.use(express.static("public"));

//Require routes file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Since the GET and POST functions grab from the same route, we can set it once up here.
app.route("/api/notes")
    // Grab the notes list (this should be updated for every new note and deleted note.)
    .get(function (req, res) {
        res.json(database);
    })

    // Add a new note to the json db file.
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db.json");
        let newNote = req.body;

        // This allows the test note to be the original note.
        let highestId = 99;
        // This loops through the array and finds the highest ID.
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                // highestId will always be the highest numbered id in the notesArray.
                highestId = individualNote.id;
            }
        }
        // This assigns an ID to the newNote. 
        newNote.id = highestId + 1;
        // We push it to db.json.
        database.push(newNote)

        // Write the db.json file again.
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        // Gives back the response, which is the user's new note. 
        res.json(newNote);
    });

//=================================================================
// Delete a note based on an ID (cannot be location in array,
// the location will change if you splice things out)
// This route is dependent on ID of note.
//      1. Find note by id via a loop
//      2. Splice note out of array of notes.
//      3. Re-write db.json, just without that newly deleted note.
//=================================================================

app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db.json");
    // request to delete note by id.
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            // Splice takes i position, and then deletes the 1 note.
            database.splice(i, 1);
            break;
        }
    }
    // Write the db.json file again.
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
});

// Setup listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});  