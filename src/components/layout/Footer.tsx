import { FlexContainer, Link, Text } from '@/components';
import { LINKS } from '@/constant';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-dark w-full flex justify-center'>

      <FlexContainer className='w-[80%] justify-between py-1' justifyCenter={false}>

        <Text level='p' className='pre-title text-contentDark'>
          Built with ❤️ in<strong> IN</strong>
        </Text>
        
        <FlexContainer className='gap-1'>
          <Link href={LINKS.instagram} target='_blank'>
            <FaInstagram color='white' size='2em' />
          </Link>
          <Link href={LINKS.youtube} target='_blank'>
            <FaYoutube color='white' size='2em' />
          </Link>
          <Link href={LINKS.officialLinkedIn} target='_blank'>
            <FaLinkedin color='white' size='2em' />
          </Link>
        </FlexContainer>

      </FlexContainer>

    </footer>
  );
};

export default Footer;
