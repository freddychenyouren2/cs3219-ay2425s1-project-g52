// import React, { useState } from "react";
// import TopicCard from "./TopicCard";
// import "./TopicsPage.css";
// import { FiSearch } from "react-icons/fi";

// const topics = [
//   "Strings",
//   "Algorithms",
//   "Data Structures",
//   "Bit Manipulation",
//   "Recursion",
//   "Databases",
//   "Arrays",
//   "Brainteaser",
// ];

// const topicImages: { [key: string]: string } = {
//   Strings: require("../../assets/images/strings.png"),
//   Algorithms: require("../../assets/images/algo.png"),
//   "Data Structures": require("../../assets/images/ds.png"),
//   "Bit Manipulation": require("../../assets/images/bitmanp.png"),
//   Recursion: require("../../assets/images/recurs.png"),
//   Databases: require("../../assets/images/db.png"),
//   Arrays: require("../../assets/images/arrays.png"),
//   Brainteaser: require("../../assets/images/brainteasers.png"),
// };

// const TopicsPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredTopics = topics.filter((topic) =>
//     topic.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleTopicClick = (topic: string) => {
//     // Implement navigation or other logic here
//     console.log(`Clicked on topic: ${topic}`);
//   };

//   return (
//     <div className="topics-page">
//       <div className="search-bar-container">
//         <FiSearch className="search-icon" />
//         <input
//           type="text"
//           placeholder="Search topics..."
//           className="search-bar"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
//       <div className="topics-grid">
//         {filteredTopics.map((topic) => (
//           <TopicCard
//             key={topic}
//             topic={topic}
//             imageUrl={topicImages[topic]}
//             onClick={() => handleTopicClick(topic)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TopicsPage;
import React, { useState } from "react";
import TopicCard from "./TopicCard";
import DifficultyDialog from "./DifficultyDialog";
import "./TopicsPage.css";
import { FiSearch } from "react-icons/fi";

const topics = [
  "Strings",
  "Algorithms",
  "Data Structures",
  "Bit Manipulation",
  "Recursion",
  "Databases",
  "Arrays",
  "Brainteaser",
];

const topicImages: { [key: string]: string } = {
  Strings: require("../../assets/images/strings.png"),
  Algorithms: require("../../assets/images/algo.png"),
  "Data Structures": require("../../assets/images/ds.png"),
  "Bit Manipulation": require("../../assets/images/bitmanp.png"),
  Recursion: require("../../assets/images/recurs.png"),
  Databases: require("../../assets/images/db.png"),
  Arrays: require("../../assets/images/arrays.png"),
  Brainteaser: require("../../assets/images/brainteasers.png"),
};

const TopicsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  );

  const filteredTopics = topics.filter((topic) =>
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSelectDifficulty = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    setDialogOpen(false);
    // Do backend stuffs here
    console.log(`Selected Topic: ${selectedTopic}, Difficulty: ${difficulty}`);
  };

  return (
    <div className="topics-page">
      <div className="search-bar-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search topics..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="topics-grid">
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic}
            topic={topic}
            imageUrl={topicImages[topic]}
            onClick={() => handleTopicClick(topic)}
          />
        ))}
      </div>

      <DifficultyDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSelect={handleSelectDifficulty}
      />

      {/* Reserve some space for additional logic with the selected topic and difficulty */}
      {selectedTopic && selectedDifficulty !== null && (
        <div className="selected-info">
          <h3>Selected Topic: {selectedTopic}</h3>
          <h4>
            Difficulty Level:{" "}
            {selectedDifficulty === 1
              ? "Easy"
              : selectedDifficulty === 2
              ? "Medium"
              : "Hard"}
          </h4>
        </div>
      )}
    </div>
  );
};

export default TopicsPage;
