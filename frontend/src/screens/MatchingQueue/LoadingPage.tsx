// import React, { useState, useEffect } from "react";
// import { MagnifyingGlass } from "react-loader-spinner";
// import "./LoadingPage.css"; // Import the separate CSS file

// const LoadingPage: React.FC = () => {
//   const [progress, setProgress] = useState<number>(0);

//   // Simulate progress for 30 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (prevProgress < 100) {
//           return prevProgress + 100 / 30; // Increment progress in 30 seconds
//         }
//         clearInterval(interval);
//         return 100;
//       });
//     }, 1000); // Every 1 second

//     return () => clearInterval(interval); // Clean up the interval
//   }, []);

//   const handleCancel = () => {
//     console.log("Canceled!"); // You can trigger any cancel action here
//   };

//   return (
//     <div className="loading-page">
//       <div className="content">
//         <h1 className="main-text">
//           Hang tight! A peer match will be found soon.
//         </h1>

//         <MagnifyingGlass
//           visible={true}
//           height="200" // Increased size
//           width="200" // Increased size
//           ariaLabel="magnifying-glass-loading"
//           wrapperClass="magnifying-glass-wrapper"
//           glassColor="#c0efff"
//           color="#ffffff"
//         />

//         <div className="progress-container">
//           <progress value={progress} max="100"></progress>
//         </div>

//         <div className="pro-tip">
//           <h2>Pro Tip:</h2>
//           <p>
//             Focus on edge cases. They often reveal weaknesses in your solution
//             and can help you refine your code.
//           </p>
//         </div>

//         <button className="cancel-button" onClick={handleCancel}>
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoadingPage;
// import React, { useState, useEffect } from "react";
// import { MagnifyingGlass } from "react-loader-spinner";
// import "./LoadingPage.css"; // Import the separate CSS file

// const LoadingPage: React.FC = () => {
//   const [progress, setProgress] = useState<number>(0);

//   // Simulate progress for 30 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (prevProgress < 100) {
//           return prevProgress + 100 / 30; // Increment progress in 30 seconds
//         }
//         clearInterval(interval);
//         return 100;
//       });
//     }, 1000); // Every 1 second

//     return () => clearInterval(interval); // Clean up the interval
//   }, []);

//   const handleCancel = () => {
//     console.log("Canceled!"); // You can trigger any cancel action here
//   };

//   return (
//     <div className="loading-page">
//       <div className="content">
//         <h1 className="main-text">
//           Hang tight! A peer match will be found soon.
//         </h1>

//         <MagnifyingGlass
//           visible={true}
//           height="200" // Increased size
//           width="200" // Increased size
//           ariaLabel="magnifying-glass-loading"
//           wrapperClass="magnifying-glass-wrapper"
//           glassColor="#c0efff"
//           color="#ffffff"
//         />

//         <div className="progress-container">
//           <progress value={progress} max="100"></progress>
//         </div>

//         <div className="pro-tip">
//           <h2>Pro Tip:</h2>
//           <p>
//             Focus on edge cases. They often reveal weaknesses in your solution
//             and can help you refine your code.
//           </p>
//         </div>

//         <button className="cancel-button" onClick={handleCancel}>
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoadingPage;
// import React, { useState, useEffect } from "react";
// import { MagnifyingGlass } from "react-loader-spinner";
// import "./LoadingPage.css"; // Import the separate CSS file

// const LoadingPage: React.FC = () => {
//   const [progress, setProgress] = useState<number>(0);

//   // Simulate progress for 30 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (prevProgress < 100) {
//           return prevProgress + 100 / 30; // Increment progress in 30 seconds
//         }
//         clearInterval(interval);
//         return 100;
//       });
//     }, 1000); // Every 1 second

//     return () => clearInterval(interval); // Clean up the interval
//   }, []);

//   const handleCancel = () => {
//     console.log("Canceled!"); // You can trigger any cancel action here
//   };

//   return (
//     <div className="loading-page">
//       <div className="content">
//         <h1 className="main-text">
//           Hang tight! A peer match will be found soon.
//         </h1>

//         <MagnifyingGlass
//           visible={true}
//           height={150}
//           width={150}
//           ariaLabel="magnifying-glass-loading"
//           wrapperClass="magnifying-glass-wrapper"
//           glassColor="#c0efff"
//           color="#ffffff"
//         />

//         <div className="progress-container">
//           <progress value={progress} max="100"></progress>
//         </div>

//         <div className="pro-tip">
//           <h2>Pro Tip:</h2>
//           <p>
//             Focus on edge cases. They often reveal weaknesses in your solution
//             and can help you refine your code.
//           </p>
//         </div>

//         <button className="cancel-button" onClick={handleCancel}>
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoadingPage;
import React, { useState, useEffect, useCallback, useRef } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import MatchNotFoundDialog from "./MatchNotFoundDialog"; // Assuming this is your previous dialog component
import "./LoadingPage.css"; // Import the separate CSS file

const LoadingPage: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null); // Store interval ID using useRef

  // Use useCallback to ensure the function reference doesn't change across renders
  const startProgress = useCallback(() => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current); // Clear any existing interval before starting a new one
    intervalIdRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / 30; // Increment progress over 30 seconds
        if (newProgress >= 100) {
          clearInterval(intervalIdRef.current!);
          setProgress(100);
          setDialogOpen(true); // Open the dialog when progress reaches 100%
        }
        return newProgress;
      });
    }, 1000); // Update progress every 1 second
  }, []);

  // Start progress on component mount
  useEffect(() => {
    startProgress(); // Start progress on mount

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current); // Clean up the interval on unmount
    };
  }, [startProgress]);

  // Handle cancel action
  const handleCancel = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current); // Stop the progress
    setProgress(0); // Reset progress
    console.log("Canceled!"); // Log cancellation action
  };

  // Handle retry action (reset everything and restart progress)
  const handleRetry = () => {
    setDialogOpen(false); // Close dialog
    setProgress(0); // Reset progress
    startProgress(); // Restart the progress
  };

  // Handle dialog close without retry
  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  return (
    <div className="loading-page">
      <div className="content">
        <h1 className="main-text">
          Hang tight! A peer match will be found soon.
        </h1>

        <MagnifyingGlass
          visible={true}
          height={150}
          width={150}
          ariaLabel="magnifying-glass-loading"
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#ffffff"
        />

        <div className="progress-container">
          <progress value={progress} max="100"></progress>
        </div>

        <div className="pro-tip">
          <h2>Pro Tip:</h2>
          <p>
            Focus on edge cases. They often reveal weaknesses in your solution
            and can help you refine your code.
          </p>
        </div>

        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>

        <MatchNotFoundDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
};

export default LoadingPage;
