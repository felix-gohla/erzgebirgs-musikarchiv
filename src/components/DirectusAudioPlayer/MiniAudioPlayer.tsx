import { Pause as PauseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { Box, IconButton, Slider, Stack, useTheme } from '@mui/material';
import React from 'react';

import { secondsToTimeString } from './utils';

interface MiniAudioPlayerUI {
    canPlay: boolean,
    isPlaying: boolean,
    handlePause: (e: React.MouseEvent) => void,
    handlePlay: (e: React.MouseEvent) => void,
    handleSeek: (e: Event, time: number) => void,
    handleSeekFinished: (e: Event | React.SyntheticEvent, time: number) => void,
    duration: number,
    time: number,
  }

export const MiniAudioPlayerUI: React.FC<MiniAudioPlayerUI> = (props) => {
  const {
    canPlay,
    duration,
    handlePause,
    handlePlay,
    handleSeek,
    handleSeekFinished,
    isPlaying,
    time,
  } = props;

  const theme = useTheme();

  return (
    <Stack
      direction="row"
      sx={{ mx: 'auto', width: 'fit-content', alignItems: 'center' }}
      spacing={1}
      onClick={(event) => event.stopPropagation()} // Important to not let the events bubble.
    >
      <Box>
        {
          !isPlaying
            ? (<IconButton disabled={!canPlay} onClick={handlePlay} size="medium" aria-label="Abspielen"><PlayArrowIcon fontSize="inherit" /></IconButton>)
            : (<IconButton disabled={!canPlay} onClick={handlePause} size="medium" aria-label="Pausieren"><PauseIcon fontSize="inherit" /></IconButton>)
        }
      </Box>
      <Slider
        size="small"
        aria-label="Abspielposition"
        value={time}
        min={0}
        max={duration || 0}
        step={0.1}
        onChangeCommitted={(e, pos) => { if(!Array.isArray(pos)) { handleSeekFinished(e, pos); } } }
        onChange={(e, pos) => { if(!Array.isArray(pos)) { handleSeek(e, pos); } } }
        onClick={(event) => event.stopPropagation()}
        valueLabelDisplay='auto'
        valueLabelFormat={() => {
          if (!canPlay) {
            return `${secondsToTimeString(NaN)} / ${secondsToTimeString(NaN)}`;
          }
          return `${secondsToTimeString(time)} / ${secondsToTimeString(duration)}`;
        }}
        sx={{
          minWidth: '128px',
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
    </Stack>
  );
};