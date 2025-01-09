import React, { ReactEventHandler, useState } from 'react';
import { PageProps } from '@/interfaces';
import {
  Button,
  FlexContainer,
  SectionHeaderContainer,
  SEO,
} from '@/components';
import { getPreFetchProps } from '@/utils';
import InputFieldContainer from '@/components/common/Form/InputFieldContainer';

const Home = ({ seoMeta }: PageProps) => {
  const [playlistLink, setPlaylistLink] = useState<String | null>(null);
  const [error, setError] = useState<String | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleInputChange = (value: string) => {
    setPlaylistLink(value);
  };
  const handleAddPlaylist = async () => {
    if (!playlistLink) {
      setError('Playlist is required');
      setTimeout(() => setError(null), 2000);
      return;
    }
    setLoading(true);
    try {
      // Making a dummy API request
      const response = await fetch('/api/youfocus-backend/add-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistLink }),
      });

      const data = await response.json();

      if (data.success) {
        // Handle success response
        console.log('Playlist added successfully');
      } else {
        // Handle error response from the server
        setError(data.message || 'Failed to add playlist');
        setTimeout(() => setError(null), 2000);
      }
    } catch (error) {
      // Handle any error that occurs during the fetch
      console.error('Error occurred:', error);
      setError('An error occurred while adding the playlist');
      setTimeout(() => setError(null), 2000);
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <SEO seoMeta={seoMeta} />
      <FlexContainer
        direction='col'
        className='gap-6 pt-5 justify-center items-center'
      >
        <SectionHeaderContainer
          heading='Add Your'
          focusText='Playlist'
          headingLevel={2}
          subtext='Learn Undistracted with Youtube Playlist'
        />
        <FlexContainer
          className='gap-3 w-full justify-center items-center'
          direction='col'
        >
          <InputFieldContainer
            label='Paste YouTube Playlist Link'
            type='text'
            onChange={handleInputChange}
            className='md:w-1/2 px-5 text-black'
          />
          {error && <p className='text-red-600'>{error}</p>}
          <Button
            variant='PRIMARY'
            className=''
            text='Add Playlist'
            active={playlistLink != null && playlistLink !== ''}
            isLoading={loading}
            onClick={handleAddPlaylist}
          />
        </FlexContainer>
      </FlexContainer>
    </React.Fragment>
  );
};
export const getServerSideProps = getPreFetchProps;
export default Home;
