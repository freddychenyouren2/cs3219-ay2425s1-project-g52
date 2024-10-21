import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectRabbitMQ, getChannel } from "./connections.js";
import { initializeMatchQueue, addUser, checkForMatches, requeueUser } from "./matchQueue.js";
import { initializeWebSocketServer } from "./websocket.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.MATCHING_SERVICE_PORT || 3002;
initializeWebSocketServer(process.env.WEBSOCKET_PORT || 8080);

const initialize = async () => {
  try {
    await connectRabbitMQ();
    const channel = getChannel();
    await initializeMatchQueue(channel);
    console.log("All services initialized successfully");
    await processMatchRequests(channel);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
};

const processMatchRequests = async (channel) => {
  const topics = ["Data Structures", "Algorithms"];
  const difficulties = ["easy", "medium", "hard"];

  channel.prefetch(1);

  for (const topic of topics) {
    const queueName = `${topic}_queue`;
    await channel.consume(queueName, async (request) => {
      if (request) {
        const matchRequest = JSON.parse(request.content.toString());
        console.log(`Received match request: ${JSON.stringify(matchRequest)}`);
        
        const matched = await checkForMatches(matchRequest, topic, channel, difficulties);
        if (matched) {
          channel.ack(request);
        } else {
          console.log(`No match found for ${matchRequest.userId} in ${queueName}`);
          await requeueUser(matchRequest, channel);
          channel.ack(request);
        }
      }
    }, { noAck: false });
  }
};

initialize();

app.post("/match", async (req, res) => {
  console.log("Received user data:", req.body);
  const user = req.body;
  try {
    const result = await addUser(user);
    res.status(200).send(result.success);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/queue", async (req, res) => {
  try {
    const channel = getChannel();
    const topics = ["Data Structures", "Algorithms"];
    const difficulties = ["easy", "medium", "hard"];
    const allQueues = {};

    for (const topic of topics) {
      for (const difficulty of difficulties) {
        const queueName = `${topic}_${difficulty}_queue`;
        const users = await fetchMatchQueue(queueName, channel);
        allQueues[queueName] = users;
      }
    }

    res.status(200).json(allQueues);
  } catch (error) {
    console.error("Error fetching queue contents:", error);
    res.status(500).send("Internal Server Error");
  }
});