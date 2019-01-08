// import your node modules

const db = require("./data/db.js");
const express = require("express");
// add your server code starting here

const server = express();

//middleware
server.use(express.json());

//GET posts

server.get("/api/posts", (req, res) => {
  db.find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

//GET post by post ID

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

//DELETE post

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

//CREATE post

server.post("/api/posts", (req, res) => {
  const postInfo = req.body;
  if (postInfo.title && postInfo.contents) {
    db.insert(postInfo)
      .then(result => {
        db.findById(result.id)
          .then(post => {
            res.status(201).json(post);
          })
          .catch(err => {
            res.status(404).json({
              message: "The post with the specified ID does not exist."
            });
          });
      })
      .catch(err =>
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        })
      );
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

//UPDATE post by ID

server.put("/api/posts/:id", async (req, res) => {
  const id = req.params.id;
  const updatedObject = req.body;

  try {
    const post = await db.findById(id);

    if (!post.length) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      const count = await db.update(id, updatedObject);
      if (!count) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else {
        res.status(200).json(updatedObject);
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});
server.listen(3333, () => console.log("server running"));
