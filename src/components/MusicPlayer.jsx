import React, { useRef, useEffect, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying]=useState(true);

  useEffect(() => {
    audioRef.current.play();
  }, []);

  const toggleMusic = () => {
    if (!isPlaying){
      audioRef.current.play();
      setIsPlaying(true);
    }
    else{
      audioRef.current.pause()
      setIsPlaying(false);
    }
  }

  return (
    <div>
      <audio ref={audioRef} loop>
        <source src="/Passenger   Let Her Go Instrumental.mp3" type="audio/mpeg" />
      </audio>

      
      <button className="music-btn" onClick={() => toggleMusic()}>
        {isPlaying ? <span class="material-symbols-outlined"> music_note </span> : <span class="material-symbols-outlined"> music_off </span>}
      </button>     
      
    </div>
  );
}