import { FastForward as FastForwardIcon, FastRewind as FastRewindIcon, Pause as PauseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { Box, IconButton, Paper, PaperProps, Slider, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

import { assetUrlFromFileId } from '@/services';

export type DirectusAudioPlayerProps = PaperProps & {
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

const secondsToTimeString = (seconds: number): string => {
  if (Number.isNaN(seconds)) {
    return '--:--';
  }

  const minutes = Math.floor(seconds / 60);
  const restSeconds = Math.floor(seconds % 60);


  const minutesString = minutes < 10 ? `0${minutes}`: `${minutes}`;
  const secondsString = restSeconds < 10 ? `0${restSeconds}`: `${restSeconds}`;
  return `${minutesString}:${secondsString}`;
};

export const DirectusAudioPlayer: React.FC<DirectusAudioPlayerProps> = (props) => {
  const {
    fileId,
    loop,
    muted,
    onPlay,
    onPaused,
    onFinished,
    title = 'Audio',
    sx,
    ...rest
  } = props;

  const theme = useTheme();

  const audioElement = React.useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState<number>(NaN);
  const [time, setTime] = React.useState<number>(0);

  const url = React.useMemo(
    () => assetUrlFromFileId(fileId),
    [fileId],
  );

  const handlePlay = React.useCallback(() => {
    const audio = audioElement.current;
    if (!audio) {
      return;
    }
    setIsPlaying(true);
    audio.play();
    onPlay?.();
    audio.volume = 1;
  }, [setIsPlaying, onPlay]);

  const handlePause = React.useCallback(() => {
    const audio = audioElement.current;
    if (!audio) {
      return;
    }
    setIsPlaying(false);
    audio.pause();
    onPaused?.();
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

  const handleSeek = React.useCallback((position: number | number[]) => {
    const audio = audioElement.current;
    if (Array.isArray(position) || !audio) {
      return;
    }
    audio.pause();
    audio.currentTime = position;
  }, [audioElement]);

  const handleSeekFinished = React.useCallback((position: number | number[]) => {
    const audio = audioElement.current;
    if (Array.isArray(position) || !audio) {
      return;
    }
    audio.currentTime = position;
    if (isPlaying) {
      audio.play();
    }
  }, [isPlaying, audioElement]);

  const canPlay = !Number.isNaN(duration);

  return (
    <Box component="div">
      <Paper elevation={2} sx={{ width: 'auto', px: theme.spacing(3), py: theme.spacing(2), ...sx }} {...rest}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">
            { title }
          </Typography>
          <Stack direction="row" sx={{ mx: 'auto', width: 'fit-content', alignItems: 'center' }}>
            <Box>
              <IconButton sx={{ fontSize: theme.typography.fontSize * 1.5 }} disabled={!canPlay} onClick={handleBack}>
                <FastRewindIcon fontSize="inherit" />
              </IconButton>
            </Box>
            <Box>
              {
                !isPlaying
                  ? (<IconButton disabled={!canPlay} onClick={handlePlay}  sx={{ fontSize: theme.typography.fontSize * 2 }} aria-label="Abspielen"><PlayArrowIcon fontSize="inherit" /></IconButton>)
                  : (<IconButton disabled={!canPlay} onClick={handlePause}  sx={{ fontSize: theme.typography.fontSize * 2 }} aria-label="Pausieren"><PauseIcon fontSize="inherit" /></IconButton>)
              }
            </Box>
            <Box>
              <IconButton disabled={!canPlay} sx={{ fontSize: theme.typography.fontSize * 1.5 }} onClick={handleForward}>
                <FastForwardIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Stack>
        </Stack>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignContent: 'baseline', flexWrap: 'wrap'}}>
          <Box sx={{width: '50%'}}>
            <Typography variant="body2">{secondsToTimeString(Number.isNaN(duration) ? NaN : time) }</Typography>
          </Box>
          <Box sx={{width: '50%', textAlign: 'right'}}>
            <Typography variant="body2">{secondsToTimeString(duration)}</Typography>
          </Box>
          <Box sx={{width: '100%'}}>
            <Slider
              size="small"
              aria-label="Abspielposition"
              value={time}
              min={0}
              max={duration || 0}
              step={0.1}
              onChangeCommitted={(_e, pos) => handleSeekFinished(pos)}
              onChange={(_e, pos) => handleSeek(pos)}
              sx={{
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  transition: 'width 0.3s cubic-bezier(.47,1.64,.41,.8), height 0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&:before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${
                      theme.palette.mode === 'dark'
                        ? 'rgb(255 255 255 / 16%)'
                        : 'rgb(0 0 0 / 16%)'
                    }`,
                  },
                  '&.Mui-active': {
                    width: 20,
                    height: 20,
                  },
                  '&:not(.Mui-active)': {
                    transition: '0.75s cubic-bezier(.47,1.64,.41,.8), width 0.3s cubic-bezier(.47,1.64,.41,.8), height 0.3s cubic-bezier(.47,1.64,.41,.8)',
                  },
                },
                '& .MuiSlider-rail': {
                  opacity: 0.28,
                },
              }}
            />
          </Box>
        </Box>
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
      </Paper>
    </Box>
  );
};
