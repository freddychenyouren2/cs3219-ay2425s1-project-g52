import express from "express";
import mongoose from "mongoose";
import Questions from "./dbQuestions.js";

//app config
const app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(express.json());
//DB Config
const connectionURL =
  "mongodb+srv://Taanish:vbF5VApcJlGEgxnS@cluster0.8ov9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(connectionURL).then(() => {
  console.log("Database connected..");
});
//api routes
app.get("/questions", (req, res) => res.status(200).send("hello world"));
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

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
