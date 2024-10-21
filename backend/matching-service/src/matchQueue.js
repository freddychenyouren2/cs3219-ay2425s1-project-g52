import { getChannel } from "./connections.js";
import { notifyUser } from './websocket.js';

// When a hard match is found
const notifyMatch = (userId1, userId2) => {
  // Notify both users
  notifyUser(userId1, 'matched');
  notifyUser(userId2, 'matched');
};

export const initializeMatchQueue = async (channel) => {
  const topics = ["Data Structures", "Algorithms"];
  const difficulties = ["easy", "medium", "hard"];

  for (const topic of topics) {
    for (const difficulty of difficulties) {
      const queueName = `${topic}_${difficulty}_queue`;
      await channel.assertQueue(queueName, { durable: true });
      console.log(`Queue ${queueName} initialized`);
    }
  }
  console.log("Match queues initialized");
};

export const addUser = async (user) => {
  try {
    const queueName = `${user.topic}_${user.difficulty}_queue`;
    const channel = getChannel();
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(user)), {
      persistent: true,
    });
    console.log(`User ${user.userId} added to the ${queueName}`);
    return { success: `User ${user.userId} added to the ${queueName}` };
  } catch (error) {
    console.error("Error adding user to the match queue:", error);
    throw new Error("Failed to add user to the match queue");
  }
};

export const removeUser = async (userId, queueName) => {
  console.log(`Removing user ${userId} from the match queue is not directly supported`);
};

const fetchMatchQueue = async (queueName, channel) => {
  const users = [];
  await new Promise((resolve) => {
    channel.consume(queueName, (msg) => {
      if (msg) {
        users.push(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      }
    }, { noAck: false }).then((result) => {
      setTimeout(() => {
        channel.cancel(result.consumerTag);
        resolve();
      }, 1000);
    });
  });
  console.log(`Fetched users from ${queueName}:`, users);
  return users;
};

const meetHardMatchingCriteria = (user1, user2) => {
  return (
    user1.topic === user2.topic &&
    user1.difficulty === user2.difficulty &&
    user1.userId !== user2.userId
  );
};

const meetSoftMatchingCriteria = (user1, user2) => {
  return user1.topic === user2.topic && user1.userId !== user2.userId;
};


export const checkForMatches = async (matchRequest, queueName, channel) => {
  const matchQueue = await fetchMatchQueue(queueName, channel);
  console.log(`Match queue for ${queueName}:`, matchQueue);

  const hardMatch = matchQueue.find((user) =>
    meetHardMatchingCriteria(user, matchRequest)
  );

  if (hardMatch) {
    console.log(`Hard match found: ${hardMatch.userId} with ${matchRequest.userId}`);
    notifyMatch(hardMatch.userId, matchRequest.userId, "matched");
    await removeUser(hardMatch.userId, queueName);
    await removeUser(matchRequest.userId, queueName);
    return true;
  }

  const softMatch = matchQueue.find((user) =>
    meetSoftMatchingCriteria(user, matchRequest)
  );

  if (softMatch) {
    console.log(`Soft match found: ${softMatch.userId} with ${matchRequest.userId}`);
    notifyMatch(softMatch.userId, matchRequest.userId, "matched");
    await removeUser(softMatch.userId, queueName);
    await removeUser(matchRequest.userId, queueName);
    return true;
  }

  console.log(`No match found for ${matchRequest.userId} in ${queueName}`);
  return false;
};
