import { useRef, useState, FC, ChangeEvent, useEffect } from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { IoIosPlay, IoIosPause } from 'react-icons/io';
import { IoVolumeMute, IoVolumeHigh } from 'react-icons/io5';

import { VideoPlayerProps } from './types';
import './style.css';

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    const player = playerRef.current;

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === player);
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

    if (video && player) {
      player.addEventListener('fullscreenchange', handleFullscreenChange);
      video.addEventListener('volumechange', handleMuteChange);
      video.addEventListener('play', handlePlayPause);
      video.addEventListener('pause', handlePlayPause);
    }

    return () => {
      if (video && player) {
        player.removeEventListener('fullscreenchange', handleFullscreenChange);
        video.removeEventListener('volumechange', handleMuteChange);
        video.removeEventListener('play', handlePlayPause);
        video.removeEventListener('pause', handlePlayPause);
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
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (player) {
      if (!isFullscreen) {
        player.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && rangeRef.current) {
      const video = videoRef.current;
      const range = rangeRef.current;

      if (range) {
        const progress = (video.currentTime / video.duration) * 100;
        range.style.background = `linear-gradient(to right, #007bff ${progress}%, #555 ${progress}% 100%)`;
      }

      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
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
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='video-player-wrapper'>
      <h2>Video player</h2>
      <div className='video-player' ref={playerRef}>
        <video
          ref={videoRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlayPause}
          poster={poster}
        />
        <div className='controls'>
          <button onClick={togglePlayPause}>
            {isPlaying ? <IoIosPause /> : <IoIosPlay />}
          </button>
          <input
            ref={rangeRef}
            type='range'
            min='0'
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className='seek-bar'
            step={0.1}
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