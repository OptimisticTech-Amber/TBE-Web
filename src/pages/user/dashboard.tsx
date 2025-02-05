import React, { Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PageProps, PrimaryCardWithCTAProps } from '@/interfaces';
import {
  CardContainerB,
  LoadingSpinner,
  FlexContainer,
  Text,
  LinkButton,
  SEO,
  CardContainerA,
} from '@/components';
import { useAPIResponseMapper, useApi, useUser } from '@/hooks';
import {
  getPreFetchProps,
  mapCourseResponseToCard,
  mapInterviewSheetResponseToCard,
  mapProjectResponseToCard,
} from '@/utils';
import { routes } from '@/constant';

const MyCourses = ({ seoMeta }: PageProps) => {
  const session = useSession();
  const router = useRouter();

  const { user } = useUser();

  const userId = user?.id;

  const { response, loading } = useApi(
    'user-dashboard',
    {
      url: `${routes.api.userDashboard}?userId=${userId}`,
    },
    { enabled: !!userId }
  );

  const courses: PrimaryCardWithCTAProps[] = useAPIResponseMapper(
    response?.data.enrolledCourses,
    mapCourseResponseToCard
  );

  const projects: PrimaryCardWithCTAProps[] = useAPIResponseMapper(
    response?.data.enrolledProjects,
    mapProjectResponseToCard,
    { isEnrolled: true }
  );

  const interviewSheets: PrimaryCardWithCTAProps[] = useAPIResponseMapper(
    response?.data.enrolledSheets,
    mapInterviewSheetResponseToCard
  );

  if (session.status === 'loading') return null;
  if (session.status !== 'authenticated') {
    router.push('/');
    return null;
  }

  if (loading) return <LoadingSpinner />;

  const noCourseFoundUI = (!courses ||
    !courses.length ||
    !projects ||
    !projects.length ||
    !interviewSheets ||
    !interviewSheets.length) && (
    <FlexContainer className='w-screen h-screen flex-col justify-center items-center'>
      <Text level='h1' className='heading-4 mb-3'>
        Oops! No Courses, Projects or Interview Sheet found.
      </Text>
      <LinkButton
        buttonProps={{ variant: 'PRIMARY', text: 'Go Back To Home' }}
        href={routes.home}
      />
    </FlexContainer>
  );

  return (
    <Fragment>
      <SEO seoMeta={seoMeta} />
      <CardContainerB
        heading='Your'
        focusText='Learning Space'
        cards={courses.concat(projects).concat(interviewSheets)}
        borderColour={2}
        subtext='Continue Learning From Where You Left'
        sectionClassName='px-2 py-4'
      />
      {noCourseFoundUI}
    </Fragment>
  );
};

export const getServerSideProps = getPreFetchProps;

export default MyCourses;
