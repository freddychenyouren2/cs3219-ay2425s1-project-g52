import express from "express";
import mongoose from "mongoose";
import Questions from "./dbQuestions.js";
import cors from "cors";

//app config
const app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(express.json());
app.use(cors());

//DB Config
const connectionURL =
  "mongodb+srv://<Username>:<Password>@cluster0.8ov9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(connectionURL).then(() => {
  console.log("Database connected..");
});
//ROOT
app.get("/", (req, res) => {
  res.send("Welcome to the PeerPrep Questions API!");
});

//api routes(CRUD Calls)
app.get("/questions/all", async (req, res) => {
  const questions = await Questions.find({});
  try {
    res.status(200).json({
      status: "Success",
      data: {
        questions,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

app.post("/questions/add-new", async (req, res) => {
  const question = new Questions(req.body);
  try {
    await question.save();
    res.status(201).json({
      status: "Success",
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

app.patch("/questions/update/:id", async (req, res) => {
  const question = await Questions.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  try {
    res.status(200).json({
      status: "Success",
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

app.delete("/questions/delete/:id", async (req, res) => {
  await Questions.findByIdAndDelete(req.params.id);
  try {
    res.status(204).json({
      status: "Success",
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
