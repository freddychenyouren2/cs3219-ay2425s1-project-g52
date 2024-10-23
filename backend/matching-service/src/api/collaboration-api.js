import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

const createRoom = async ({ participants }) => {
  const url = "http://localhost:4000/create-room";
  console.log("url: ", url);
  const requestBody = {
    roomId: uuidv4(),
    participants: participants,
  };

  console.log("requestBody", JSON.stringify(requestBody));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("response", response);

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Room created:", data);
    return data;
  } catch (error) {
    console.error("Error creating room:", error.message);
    return { status: 500, message: error.message };
  }
};

const testPostRequest = async () => {
  const url = "https://jsonplaceholder.typicode.com/posts";
  const requestBody = {
    title: "foo",
    body: "bar",
    userId: 1,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("Response from JSONPlaceholder:", data);
  } catch (error) {
    console.error("Error making POST request:", error.message);
  }
};

export { createRoom, testPostRequest };
