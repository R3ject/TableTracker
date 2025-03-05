// src/components/TestAudioButton.js
import React, { useRef } from "react";
import { Button } from "@mui/material";

const TestAudioButton = () => {
  const testAudio = useRef(new Audio(`${process.env.PUBLIC_URL}/chime.mp3`));

  const handlePlay = () => {
    testAudio.current.volume = 1;
    testAudio.current.play().catch((err) => console.error("Test audio play error:", err));
  };

  return (
    <Button variant="contained" onClick={handlePlay}>
      Test Chime
    </Button>
  );
};

export default TestAudioButton;
