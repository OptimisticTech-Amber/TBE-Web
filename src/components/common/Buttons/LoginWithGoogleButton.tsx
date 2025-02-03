import { signIn } from 'next-auth/react';
import Button from './Button';
import { useSession } from 'next-auth/react';
import { LoginWithGoogleBtnProps } from '@/interfaces';
import { useAnalytics } from '@/hooks';

const LoginWithGoogleButton = ({ text = 'Login' }: LoginWithGoogleBtnProps) => {
  const session = useSession();
  const { trackEvent } = useAnalytics();

  if (session.status === 'authenticated' || session.status === 'loading')
    return <></>;

  return (
    <Button
      variant='PRIMARY'
      text={text}
      onClick={() => {
        trackEvent({
          action: 'USER_LOGIN',
          category: 'User',
          label: 'User Logged In',
        });

        signIn('google');
      }}
    />
  );
};

export default LoginWithGoogleButton;
