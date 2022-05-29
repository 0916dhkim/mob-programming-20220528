import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("hello world");
});

app.get("/posts", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();

    return res.send({ posts });
  } catch (e) {
    next(e);
  }
});

app.get("/posts/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const post = await prisma.post.findUnique({
      where: { id },
    });

    res.json({ post: post });
  } catch (e) {
    next(e);
  }
});

app.post("/posts", async (req, res, next) => {
  try {
    const { title, content, published } = req.body;
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published,
      },
    });

    return res.json({ post: newPost });
  } catch (e) {
    next(e);
  }
});

app.put("/posts/:id", async (req, res, next) => {
  try {
    const { title, content, published } = req.body;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        published,
      },
    });

    return res.json({ post });
  } catch (e) {
    next(e);
  }
});

app.delete("/posts/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    console.log(post);
    if (post === null) {
      return res.status(404).json({ message: "Missing post" });
    }
    await prisma.post.delete({ where: { id } });

    return res.json({ post });
  } catch (e) {
    next(e);
  }
});

app.listen(5000, () => {
  console.log("listening on http://localhost:5000/");
});
