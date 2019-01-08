// import your node modules

const db = require("./data/db.js");
const express = require("express");
// add your server code starting here

const server = express();

//middleware
server.use(express.json());

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
      res.status(500).json({ error: "The post could not be retreved" });
    });
});

server.delete("/api/posts/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (post) {
        db.remove(id).then(() => {
          res.status(200).json(post);
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

server.post("/api/posts", (req, res) => {
  const postInfo = req.body;
  console.log(postInfo);
  db.insert(postInfo)
    .then(result => {
      db.findById(result.id)
        .then(post => {
          res.status(201).json(post);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: "failed to get post by id", error: err });
        });
    })
    .catch(err =>
      res.status(500).json({ error: "failed to post", error: err })
    );
});
server.listen(3333, () => console.log("server running"));
