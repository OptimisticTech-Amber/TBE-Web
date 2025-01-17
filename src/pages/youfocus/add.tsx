import React, { useState } from 'react';
import { PageProps } from '@/interfaces';
import {
  Button,
  FlexContainer,
  Section,
  SectionHeaderContainer,
  SEO,
  InputFieldContainer,
} from '@/components';
import { getPreFetchProps } from '@/utils';
import { useApi } from '@/hooks';
import { routes } from '@/constant';

const Home = ({ seoMeta }: PageProps) => {
  const [playlistLink, setPlaylistLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setPlaylistLink(value);
  };

  const { makeRequest, loading } = useApi(`add/${playlistLink}`);

  const handleAddPlaylist = async () => {
    if (!playlistLink) {
      setError('Playlist link is required');
      // setTimeout(() => setError(null), 2000);
      return;
    }

    try {
      const response = await makeRequest({
        method: 'POST',
        url: routes.api.youfocusPlaylist,
        body: { playlistLink },
      });
      const { status } = response;
      if (!status) {
        setError(response.message || 'Failed to add playlist');
        // setTimeout(() => setError(null), 2000);
      }
      //If successful Handle at backend and redirect to playlist
    } catch (error) {
      setError('Failed to add playlist. Please try again later.');
      // setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <React.Fragment>
      <SEO seoMeta={seoMeta} />
      <Section>
        <FlexContainer direction='col' className='md:gap-6 gap-4'>
          <SectionHeaderContainer
            heading='Add Your'
            focusText='Playlist'
            headingLevel={2}
            subtext='Learn Undistracted with Youtube Playlist'
          />
          <FlexContainer className='gap-3 w-full' direction='col'>
            <InputFieldContainer
              label='Paste YouTube Playlist Link'
              type='text'
              onChange={handleInputChange}
              className='md:w-1/2 md:px-5 text-black'
            />
            {error && <p className='error'>{error}</p>}
            <Button
              variant='PRIMARY'
              className=''
              text='Add Playlist'
              active={!!playlistLink || !error}
              isLoading={loading}
              onClick={handleAddPlaylist}
            />
          </FlexContainer>
        </FlexContainer>
      </Section>
    </React.Fragment>
  );
};
export const getServerSideProps = getPreFetchProps;
export default Home;
