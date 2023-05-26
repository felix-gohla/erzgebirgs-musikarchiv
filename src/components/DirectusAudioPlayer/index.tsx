import { Box } from '@mui/material';
import React from 'react';

import { assetUrlFromFileId } from '@/services';

import { FullAudioPlayer } from './FullAudioPlayer';
import { MiniAudioPlayerUI } from './MiniAudioPlayer';

export type DirectusAudioPlayerProps = {
    fileId: string,

    /**
     * Whether to loop the audio.
     */
    loop?: boolean,

    /**
     * Whether the audio should be mute.
     */
    muted?: boolean,

    /**
     * A title to show on the player.
     */
    title?: string

    onPlay?: () => void,

    onPaused?: () => void,

    onFinished?: () => void,

    /**
     * The visual variant of the player.
     */
    variant?: 'full' | 'mini',
}


export const DirectusAudioPlayer: React.FC<DirectusAudioPlayerProps> = (props) => {
  const {
    fileId,
    loop,
    muted,
    onPlay,
    onPaused,
    onFinished,
    title = 'Audio',
    variant,
  } = props;


  const audioElement = React.useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState<number>(NaN);
  const [time, setTime] = React.useState<number>(0);

  const url = React.useMemo(
    () => assetUrlFromFileId(fileId),
    [fileId],
  );

  const handlePlay = React.useCallback((event: React.MouseEvent) => {
    const audio = audioElement.current;
    if (!audio) {
      return;
    }
    setIsPlaying(true);
    audio.play();
    onPlay?.();
    audio.volume = 1;
    event.preventDefault();
    event.stopPropagation();
  }, [setIsPlaying, onPlay]);

  const handlePause = React.useCallback((event: React.MouseEvent) => {
    const audio = audioElement.current;
    if (!audio) {
      return;
    }
    setIsPlaying(false);
    audio.pause();
    onPaused?.();
    event.preventDefault();
    event.stopPropagation();
  }, [setIsPlaying, onPaused]);

  const handleBack = React.useCallback(() => {
    const audio = audioElement.current;
    if (!audio) {
      return;
    }
    audio.currentTime = Math.max(audio.currentTime - 1.0, 0);
  }, []);

  const handleForward = React.useCallback(() => {
    const audio = audioElement.current;
    if (!audio || Number.isNaN(duration)) {
      return;
    }
    audio.currentTime = Math.min(audio.currentTime + 1.0, duration);
  }, [audioElement, duration]);

  const handleFinish = React.useCallback(() => {
    setIsPlaying(false);
    onFinished?.();
  }, [setIsPlaying, onFinished]);

  const handleDurationChange = React.useCallback<React.ReactEventHandler<HTMLAudioElement>>((event) => {
    setDuration(event.currentTarget.duration);
  }, []);

  const handleTimeChange = React.useCallback<React.ReactEventHandler<HTMLAudioElement>>((event) => {
    setTime(event.currentTarget.currentTime);
  }, []);

  const handleSeek = React.useCallback((event: Event, position: number | number[]) => {
    const audio = audioElement.current;
    if (Array.isArray(position) || !audio) {
      return;
    }
    audio.pause();
    audio.currentTime = position;
    event.preventDefault();
    event.stopPropagation();
  }, [audioElement]);

  const handleSeekFinished = React.useCallback((event: Event | React.SyntheticEvent, position: number | number[]) => {
    const audio = audioElement.current;
    if (Array.isArray(position) || !audio) {
      return;
    }
    audio.currentTime = position;
    if (isPlaying) {
      audio.play();
    }
    event.preventDefault();
    event.stopPropagation();
  }, [isPlaying, audioElement]);

  const canPlay = !Number.isNaN(duration);

  return (
    <Box component="div">
      { variant === 'mini' &&
        <MiniAudioPlayerUI
          canPlay={canPlay}
          isPlaying={isPlaying}
          handlePause={handlePause}
          handlePlay={handlePlay}
          time={time}
          duration={duration}
          handleSeek={handleSeek}
          handleSeekFinished={handleSeekFinished}
        />
      }
      { variant !== 'mini' &&
        <FullAudioPlayer
          canPlay={canPlay}
          isPlaying={isPlaying}
          handleBack={handleBack}
          handleForward={handleForward}
          handlePause={handlePause}
          handlePlay={handlePlay}
          title={title}
          handleSeek={handleSeek}
          handleSeekFinished={handleSeekFinished}
          time={time}
          duration={duration}
        />
      }
      <audio
        loop={loop}
        muted={muted}
        preload="auto"
        ref={audioElement}
        onEnded={handleFinish}
        onDurationChange={handleDurationChange}
        onTimeUpdate={handleTimeChange}
      >
        <source src={url.toString()} />
          Ihr Browser unterstützt die Audiowiedergabe nicht.
      </audio>
    </Box>
  );
};
