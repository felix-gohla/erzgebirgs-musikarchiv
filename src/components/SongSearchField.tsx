import React from 'react';
import { useNavigate } from 'react-router-dom';

import { findSongs } from '@/services';
import { Song } from '@/types';

import { SearchField, SearchFieldProps } from '../components/SearchField';

type SongSearchFieldProps = Partial<SearchFieldProps<Song>>;

export const SongSearchField: React.FC<SongSearchFieldProps> = (props) => {
  const navigate = useNavigate();

  return (<SearchField
    {...props}
    label='Lieder Suchen…'
    fetchOptions={async (searchTerm): Promise<Song[]> => findSongs({
      filter: searchTerm !== '' ? { '_or': [
        { title: { '_icontains': searchTerm } },
        { text: { '_icontains': searchTerm } },
        { authors: { authors_id: { name: { '_icontains': searchTerm } } } },
        { genres: { genres_id: { name: { '_icontains': searchTerm } } } },
      ] } : {},
      limit: 100,
    })}
    onChange={(value): void => {
      if (!value || typeof value === 'string') {
        return;
      }
      navigate(`/songs/${value.id}`);
    }}
    getOptionLabel={(song: Song | string): string => typeof song !== 'string' ? song.title : song}
    isOptionEqualToValue={(option: Song, value: Song): boolean => option.id === value.id}
  />);
};