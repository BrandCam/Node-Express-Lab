// import your node modules

const db = require("./data/db.js");
const express = require("express");
// add your server code starting here

const server = express();

server.get("/api/posts", (req, res) => {
  db.find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

server.get("/api/posts/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

server.listen(3333, () => console.log("server running"));
