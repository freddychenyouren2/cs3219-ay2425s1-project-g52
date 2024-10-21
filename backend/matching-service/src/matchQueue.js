import { getChannel } from "./connections.js";
import { notifyUser } from './websocket.js';

const notifyMatch = (userId1, userId2) => {
  notifyUser(userId1, 'matched');
  notifyUser(userId2, 'matched');
};

export const initializeMatchQueue = async (channel) => {
  const topics = ["Data Structures", "Algorithms"];
  const difficulties = ["easy", "medium", "hard"];

  for (const topic of topics) {
    const topicQueueName = `${topic}_queue`;
    await channel.assertQueue(topicQueueName, { durable: true });
    console.log(`Queue ${topicQueueName} initialized`);

    for (const difficulty of difficulties) {
      const difficultyQueueName = `${topic}_${difficulty}_queue`;
      await channel.assertQueue(difficultyQueueName, { durable: true });
      console.log(`Queue ${difficultyQueueName} initialized`);
    }
  }
  console.log("Match queues initialized");
};

export const addUser = async (user) => {
  try {
    const queueName = `${user.topic}_queue`;
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

export const checkForMatches = async (matchRequest, topic, channel, difficulties) => {
  // First check the user's specific difficulty queue
  const specificQueueName = `${topic}_${matchRequest.difficulty}_queue`;
  const specificQueue = await fetchMatchQueue(specificQueueName, channel);
  console.log(`Match queue for ${specificQueueName}:`, specificQueue);

  const hardMatch = specificQueue.find((user) =>
    meetHardMatchingCriteria(user, matchRequest)
  );

  if (hardMatch) {
    console.log(`Hard match found: ${hardMatch.userId} with ${matchRequest.userId}`);
    notifyMatch(hardMatch.userId, matchRequest.userId);
    await removeUser(hardMatch.userId, specificQueueName);
    await removeUser(matchRequest.userId, specificQueueName);
    return true;
  }

  // If no match is found, check the other difficulty queues
  for (const difficulty of difficulties) {
    if (difficulty === matchRequest.difficulty) continue; // Skip the already checked difficulty

    const queueName = `${topic}_${difficulty}_queue`;
    const matchQueue = await fetchMatchQueue(queueName, channel);
    console.log(`Match queue for ${queueName}:`, matchQueue);

    const softMatch = matchQueue.find((user) =>
      meetSoftMatchingCriteria(user, matchRequest)
    );

    if (softMatch) {
      console.log(`Soft match found: ${softMatch.userId} with ${matchRequest.userId}`);
      notifyMatch(softMatch.userId, matchRequest.userId);
      await removeUser(softMatch.userId, queueName);
      await removeUser(matchRequest.userId, queueName);
      return true;
    }
  }

  console.log(`No match found for ${matchRequest.userId} in any difficulty queue for topic ${topic}`);
  return false;
};

export const requeueUser = async (user, channel) => {
  const queueName = `${user.topic}_${user.difficulty}_queue`;
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(user)), {
    persistent: true,
  });
  console.log(`User ${user.userId} requeued to ${queueName}`);
};