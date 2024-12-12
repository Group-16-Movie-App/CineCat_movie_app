import React, { useState, useEffect } from 'react';
import { FaMusic, FaVolumeMute } from 'react-icons/fa';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audio] = useState(new Audio('/background-music.mp3')); // You'll need to add your music file to the public folder

  useEffect(() => {
    audio.loop = true;
    audio.volume = volume;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  useEffect(() => {
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, audio]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  return (
    <div className="music-player" title={isPlaying ? "Click to mute" : "Click to play"}>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? <FaVolumeMute /> : <FaMusic />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        title={`Volume: ${Math.round(volume * 100)}%`}
        aria-label="Volume control"
      />
    </div>
  );
};

export default MusicPlayer;