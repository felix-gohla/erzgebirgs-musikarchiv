import { FastForward as FastForwardIcon, FastRewind as FastRewindIcon, Pause as PauseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { Box, IconButton, Paper, Slider, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

import { secondsToTimeString } from './utils';

interface FullAudioPlayerProps {
  canPlay: boolean,
  isPlaying: boolean,
  handleForward: () => void,
  handleBack: () => void,
  handlePause: (e: React.MouseEvent) => void,
  handlePlay: (e: React.MouseEvent) => void,
  handleSeek: (e: Event, time: number) => void,
  handleSeekFinished: (e: Event | React.SyntheticEvent, time: number) => void,
  title: string,
  duration: number,
  time: number,
}

export const FullAudioPlayer: React.FC<FullAudioPlayerProps> = (props) => {
  const {
    canPlay,
    duration,
    handleBack,
    handleForward,
    handlePause,
    handlePlay,
    handleSeek,
    handleSeekFinished,
    isPlaying,
    time,
    title,
  } = props;

  const theme = useTheme();

  return (
    <Paper elevation={2} sx={{ width: 'auto', px: theme.spacing(3), py: theme.spacing(2)}}>
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
            onChangeCommitted={(e, pos) => { if(!Array.isArray(pos)) { handleSeekFinished(e, pos); } } }
            onChange={(e, pos) => { if(!Array.isArray(pos)) { handleSeek(e, pos); } } }
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
    </Paper>
  );
};