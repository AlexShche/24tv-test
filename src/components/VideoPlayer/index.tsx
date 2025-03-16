import { useRef, useState, FC, ChangeEvent, useEffect } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { IoIosPlay, IoIosPause } from "react-icons/io";
import { IoVolumeMute, IoVolumeHigh } from "react-icons/io5";

import { VideoPlayerProps } from './types';
import "./style.css";

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
  
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === video);
    };

    const handleMuteChange = () => {
      if (video) {
        setIsMuted(video.muted || video.volume === 0);
      }
    };

    const handlePlayPause = () => {
      if (video) {
        setIsPlaying(!video.paused);
      }
    };
  
    //в useEffect вышаем слушатели на play/pause, fullscreen, volumechange
    if (video) {
      video.addEventListener("fullscreenchange", handleFullscreenChange);
      video.addEventListener("volumechange", handleMuteChange);
      video.addEventListener("play", handlePlayPause);
      video.addEventListener("pause", handlePlayPause);
    }
  
    // так же не забываем отписываться
    return () => {
      if (video) {
        video.removeEventListener("fullscreenchange", handleFullscreenChange);
        video.removeEventListener("volumechange", handleMuteChange);
        video.removeEventListener("play", handlePlayPause);
        video.removeEventListener("pause", handlePlayPause);
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef?.current?.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && videoRef.current) videoRef.current.requestFullscreen();
    else document?.exitFullscreen();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    // при загрузке метаданных задаем длительность
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = parseFloat(e.target.value);
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="video-player-wrapper">
      <h2>Video player</h2>
      <div className="video-player">
        <video
          ref={videoRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlayPause}
          poster={poster}
        />
        <div className="controls">
          <button onClick={togglePlayPause}>
            {isPlaying ? <IoIosPause /> : <IoIosPlay />}
          </button>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="seek-bar"
          />
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button onClick={toggleMute}>
            {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
          </button>
          <button onClick={toggleFullscreen}>
            {isFullscreen ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
          </button>
        </div>
      </div>
    </div>
  );
};