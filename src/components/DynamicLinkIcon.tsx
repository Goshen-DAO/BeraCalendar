import { Box, Link } from '@chakra-ui/react';
import LinkIcons from './LinkIcons';  // Adjust the import path accordingly

const DynamicLinkIcon: React.FC<{ iconName: string; url: string }> = ({ iconName, url }) => {
  const IconComponent = LinkIcons[iconName.toLowerCase()];

  if (!IconComponent) {
    // Handle invalid iconName
    return null;
  }

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" color="blue.500" _hover={{ textDecoration: 'underline' }}>
      <Box as={IconComponent} boxSize={35} />
    </Link>
  );
};

export default DynamicLinkIcon;
