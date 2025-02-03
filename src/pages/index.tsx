import React from 'react';
import {
  LandingPageHero,
  CardContainerA,
  Testimonials,
  SEO,
  LinkButton,
  CardContainerB,
  Community,
  MentorshipPlans,
  Banner,
} from '@/components';
import { PageProps } from '@/interfaces';
import { getPreFetchProps } from '@/utils';
import {
  LINKS,
  PRODUCTS,
  STATIC_FILE_PATH,
  USP,
  generateSectionPath,
  routes,
} from '@/constant';
import { useRouter } from 'next/router';

const Home = ({ seoMeta }: PageProps) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <SEO seoMeta={seoMeta} />
      <LandingPageHero
        sectionHeaderProps={{
          heading: 'Tech Education for',
          focusText: 'Everyone',
        }}
        heroText='Learn Tech Skills & Prepare yourself for a Tech Job.'
        primaryButton={
          <LinkButton
            href={generateSectionPath({
              basePath: router.basePath,
              sectionID: routes.internals.landing.products,
            })}
            className='w-full sm:w-fit'
            buttonProps={{
              variant: 'PRIMARY',
              text: 'Get Started',
              className: 'w-full',
            }}
          />
        }
        secondaryButton={
          <LinkButton
            href={LINKS.bookTechConsultation}
            className='w-full sm:w-fit'
            buttonProps={{
              variant: 'OUTLINE',
              text: 'Book Tech Session',
              className: 'w-full',
            }}
            target='_blank'
          />
        }
        backgroundImageUrl={`${STATIC_FILE_PATH.svg}/hero-image.svg`}
      />

      <CardContainerB
        id={routes.internals.landing.products}
        heading='Our'
        focusText='Products'
        cards={PRODUCTS}
        borderColour={2}
      />
      <Banner
        title='Feeling Stuck?'
        description='Need a Resume Review or help with Learning Tech. We can help.'
        buttonText='Book Free Session'
        buttonLink='https://topmate.io/imsks'
        imageSrc={`${STATIC_FILE_PATH.svg}/laptop.svg`}
        variant='VARIANT_A'
      />
      <Banner
        title='Join as DevRel Advocate'
        description='Join our Community as a DevRel Advocate and help us grow.'
        buttonText='Join us'
        buttonLink={LINKS.joinDevRelAdvocate}
        imageSrc={`${STATIC_FILE_PATH.svg}/community.svg`}
        variant='VARIANT_B'
      />
      <Community />
      <MentorshipPlans />
      <CardContainerA
        heading='What We Do'
        focusText='Differently'
        cards={USP}
      />
      <Testimonials />
    </React.Fragment>
  );
};

export const getServerSideProps = getPreFetchProps;

export default Home;
