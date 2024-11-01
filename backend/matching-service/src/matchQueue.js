import { getChannel } from "./connections.js";
import { notifyUser } from "./websocket.js";
import { DIFFICULTIES } from "./constants/constants.js";
import {
  createRoom,
  testPostRequest,
  checkRoomExists,
} from "./api/collaboration-api.js";
import { getQuestion } from "./api/question-service-api.js";

const activeUsers = new Set();
const timeoutTabs = new Map();

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

async function notifyMatch(userId1, userId2, topic, difficulty) {
  try {
    const question = await getQuestion(
      topic,
      capitalizeFirstLetter(difficulty)
    );
    console.log("Question fetched:", question);
    const response = await createRoom({
      participants: [userId1, userId2],
      question: question,
    });
    console.log("Response from testPostRequest:", response);
    if (response.status == 201) {
      const roomId = response.room?.roomId;
      notifyUser(userId1, "matched", roomId);
      notifyUser(userId2, "matched", roomId);
    } else {
      console.error("Error creating room:", response.message);
    }
  } catch (error) {
    console.error("Error in notifyMatch:", error);
  }
}

function removeTimeout(user) {
  if (timeoutTabs.has(user.userId)) {
    clearTimeout(timeoutTabs.get(user.userId));
    console.log(`Removed Timer for ${user.userId} after Successful match`);
  }
}

function handleTimeout(user, channel) {
  const userId = user.userId;
  if (timeoutTabs.has(userId)) {
    clearTimeout(timeoutTabs.get(userId));
  }

  const timeoutId = setTimeout(async () => {
    await removeUserFromQueue(user, channel);
    notifyUser(userId, "timeout");
    activeUsers.delete(userId);
    timeoutTabs.delete(userId);
    console.log(`User ${userId} removed from activeUsers set due to timeout`);
  }, 30000);

  timeoutTabs.set(userId, timeoutId);
}

export async function addUser(user) {
  const userId = user.userId;
  if (activeUsers.has(userId)) {
    notifyUser(user.userId, "Active request exists");
    throw new Error(`User ${userId} already has an active match request`);
  }
  activeUsers.add(userId);

  try {
    const queueName = `${user.topic}_queue`;
    const channel = getChannel();
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(user)));
    console.log(`User ${userId} added to the ${queueName}`);

    handleTimeout(user, channel);
    return { success: `User ${userId} added to the ${queueName}` };
  } catch (error) {
    activeUsers.delete(userId);
    console.error("Error adding user to the match queue:", error);
    throw new Error("Failed to add user to the match queue");
  }
}

async function fetchMatchQueue(queueName, channel) {
  const users = [];
  await new Promise((resolve) => {
    channel
      .consume(
        queueName,
        (matchRequest) => {
          if (matchRequest) {
            users.push(JSON.parse(matchRequest.content.toString()));
            channel.ack(matchRequest);
          }
        },
        { noAck: false }
      )
      .then((result) => {
        setTimeout(() => {
          channel.cancel(result.consumerTag);
          resolve();
        }, 1000);
      });
  });
  console.log(`Fetched users from ${queueName}:`, users);
  return users;
}

function selectLowerDifficulty(difficulty1, difficulty2) {
  // Define the difficulties in order of increasing difficulty
  const difficulties = ["easy", "medium", "hard"];

  // Get the index of each difficulty
  const index1 = difficulties.indexOf(difficulty1.toLowerCase());
  const index2 = difficulties.indexOf(difficulty2.toLowerCase());

  // Return the lower difficulty based on the index
  return index1 < index2 ? difficulty1 : difficulty2;
}

export async function checkForMatches(matchRequest, channel) {
  const topic = matchRequest.topic;
  const difficulty = matchRequest.difficulty;
  const specificQueueName = `${topic}_${difficulty}_queue`;
  const specificQueue = await fetchMatchQueue(specificQueueName, channel);
  console.log(`Match queue for ${specificQueueName}:`, specificQueue);

  if (specificQueue.length > 0) {
    const match = specificQueue[0];
    console.log(
      `Hard Match found: ${match.userId} with ${matchRequest.userId}`
    );
    removeTimeout(match);
    removeTimeout(matchRequest);
    notifyMatch(match.userId, matchRequest.userId, topic, difficulty);
    activeUsers.delete(matchRequest.userId);
    activeUsers.delete(match.userId);
    console.log(
      `Queue after match: ${JSON.stringify(
        await fetchMatchQueue(specificQueueName, channel)
      )}`
    );
    return true;
  }

  for (const difficulty of DIFFICULTIES) {
    if (difficulty === matchRequest.difficulty) {
      continue;
    }

    const queueName = `${topic}_${difficulty}_queue`;
    const matchQueue = await fetchMatchQueue(queueName, channel);
    console.log(`Match queue for ${queueName}:`, matchQueue);

    if (matchQueue.length > 0) {
      const match = matchQueue[0];
      console.log(
        `Soft Match found: ${match.userId} with ${matchRequest.userId}`
      );
      console.log("inside soft match");
      console.log("match", match);
      console.log("matchRequest", matchRequest);
      const matchDifficulty = match.difficulty;
      const matchRequestDifficulty = matchRequest.difficulty;
      const selectedDifficulty = selectLowerDifficulty(
        matchDifficulty,
        matchRequestDifficulty
      );

      removeTimeout(match);
      removeTimeout(matchRequest);
      notifyMatch(match.userId, matchRequest.userId, topic, selectedDifficulty);
      activeUsers.delete(matchRequest.userId);
      activeUsers.delete(match.userId);
      console.log(
        `Queue after match: ${JSON.stringify(
          await fetchMatchQueue(queueName, channel)
        )}`
      );
      return true;
    }
  }

  console.log(
    `No match found for ${matchRequest.userId} in any difficulty queue for topic ${topic}`
  );
  return false;
}

export async function requeueUser(user, channel) {
  const queueName = `${user.topic}_${user.difficulty}_queue`;
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(user)));
  console.log(`User ${user.userId} requeued to ${queueName}`);
}

async function removeUserFromQueueByName(userId, queueName, channel) {
  const users = await fetchMatchQueue(queueName, channel);
  for (const user of users) {
    if (user.userId !== userId) {
      await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(user)));
    }
  }
  console.log(`User ${userId} removed from ${queueName}`);
  activeUsers.delete(userId);
}

async function removeUserFromQueue(user, channel) {
  const queueName = `${user.topic}_${user.difficulty}_queue`;
  await removeUserFromQueueByName(user.userId, queueName, channel);
}

export async function removeUserFromAllQueues(
  userId,
  topic,
  difficulty,
  channel
) {
  const topicQueueName = `${topic}_queue`;
  await removeUserFromQueueByName(userId, topicQueueName, channel);

  const queueName = `${topic}_${difficulty}_queue`;
  await removeUserFromQueueByName(userId, queueName, channel);
}
