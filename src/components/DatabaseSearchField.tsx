import { Group as GroupIcon, MusicNote as MusicNoteIcon } from '@mui/icons-material';
import { darken, lighten, styled,Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { findAuthors, findSongs } from '@/services';
import { Author, Song } from '@/types';

import { SearchField, SearchFieldProps } from './SearchField';

type AllEntities = {
  type: 'author',
  data: Author,
} | {
  type: 'song',
  data: Song,
}

type SongSearchFieldProps = Partial<SearchFieldProps<AllEntities>>;

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});


export const DatabaseSearchField: React.FC<SongSearchFieldProps> = (props) => {
  const navigate = useNavigate();

  return (<SearchField
    label='Suchen…'
    {...props}
    fetchOptions={async (searchTerm): Promise<AllEntities[]> => {
      const [songs, authors] = await Promise.all([
        findSongs({
          filter: searchTerm !== '' ? { '_or': [
            { title: { '_icontains': searchTerm } },
            { text: { '_icontains': searchTerm } },
            { authors: { authors_id: { name: { '_icontains': searchTerm } } } },
            { genres: { genres_id: { name: { '_icontains': searchTerm } } } },
          ] } : {},
          limit: 100,
        }),
        findAuthors({
          filter: searchTerm !== '' ? { name: { '_icontains': searchTerm } } : {},
          sort: ['name'],
        }),
      ]);
      return [
        ...songs.map((song) => ({ type: 'song' as const, data: song })),
        ...authors.map((author) => ({ type: 'author' as const, data: author })),
      ];
    }}
    groupBy={(entity) => entity.type}
    renderGroup={(params) => {
      let title: React.ReactNode = null;
      if (params.group === 'author') {
        title = <Typography><GroupIcon sx={{ verticalAlign: 'middle' }} />&nbsp;Autoren</Typography>;
      }
      else if (params.group === 'song') {
        title = <Typography><MusicNoteIcon sx={{ verticalAlign: 'middle' }} />&nbsp;Lieder</Typography>;
      }
      return (
        <li key={params.key}>
          <GroupHeader>{title}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      );
    }}
    onChange={(value): void => {
      if (!value || typeof value === 'string') {
        return;
      }
      if (value.type === 'song') {
        navigate(`/songs/${value.data.id}`);
      }
      if (value.type === 'author') {
        navigate(`/authors/${value.data.id}`);
      }
    }}
    getOptionLabel={(entity: AllEntities | string): string => {
      if (typeof entity === 'string') {
        return entity;
      }
      if (entity.type === 'song') {
        return entity.data.title;
      }
      if (entity.type === 'author') {
        return entity.data.name;
      }
      return 'Unbekannter Fehler';
    }}
    isOptionEqualToValue={(option: AllEntities, value: AllEntities): boolean => {
      if (option.type !== value.type) {
        return false;
      }
      return option.data.id === value.data.id;
    }}
  />);
};