const fs = require("fs");
const uniqid = require("uniqid");

module.exports = (app) => {
  let noteData = require(__dirname + "/../db/db.json");

  app.get("/api/notes", (req, res) => {
    res.json(noteData);
  });

  app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    newNote.id = uniqid();

    noteData.push(newNote);

    const rawData = JSON.stringify(noteData);

    fs.writeFile(__dirname + "/../db/db.json", rawData, (err) => {
      if (err) throw err;
    });
    res.end();
  });

  app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;

    let filtered = noteData.filter(function (note) {
      return note.id != noteId;
    });

    newNoteData = JSON.stringify(filtered);
    noteData = filtered;

    fs.writeFileSync(__dirname + "/../db/db.json", newNoteData, (err) => {
      if (err) throw err;
    });

    res.end();
  });
};