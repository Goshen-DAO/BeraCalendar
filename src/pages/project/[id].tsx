import { Box, Image, Flex, Center, Text, Heading, Badge, Link, VStack, HStack, Spacer, Button, SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Directory } from '@/interface'; // Import your interfaces
import DynamicLinkIcon from '../../components/DynamicLinkIcon';


const ProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [cardDetails, setCardDetails] = useState<Directory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProjects, setSimilarProjects] = useState<Directory[]>([]);

  useEffect(() => {
    const fetchCardDetailsById = async (id: string) => {
      try {
        // Fetch the entire list of cards
        const response = await fetch(`https://goshendrops-api.vercel.app/api/goshendropslist`);
        const data: { data: Directory[] } = await response.json();

        // Find the card with the provided id
        const foundCard = data.data.find((card) => card.id === id);

        if (foundCard) {
          setCardDetails(foundCard);

          // Find similar projects based on common tags
          const commonTagProjects = data.data.filter((project) => (
            project.id !== id && project.tags.some((tag) => foundCard.tags.includes(tag))
          ));

          setSimilarProjects(commonTagProjects);
        } else {
          setError('Card not found');
        }
      } catch (error) {
        setError('Error fetching card details');
        console.error('Error fetching card details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCardDetailsById(id as string);
    }
  }, [id]);

  if (loading) {
    return (
      <Box h="100vh" display="flex" justifyContent="center" alignItems="center" bgColor="gray.100">
        Loading...
      </Box>
    );
  }

  if (error) {
    return (
      <Box h="100vh" display="flex" justifyContent="center" alignItems="center" bgColor="gray.100" color="red.500">
        Error: {error}
      </Box>
    );
  }

  if (!cardDetails) {
    return (
      <Box h="100vh" display="flex" justifyContent="center" alignItems="center" bgColor="gray.100" color="yellow.500">
        Card not found
      </Box>
    );
  }

  return (
    <HStack maxW="container.xl" mx="auto" mt={8} p={4} spacing={8} bgColor="green.1500" boxShadow="lg" borderRadius="lg">
    {/* Left Column (70%) */}
      <VStack align="start" spacing={4} w="70%" className="relative h-full  rounded-xl bg-white bg-center p-8 pt-12 shadow duration-150">
        {/* Project Details */}
        <VStack align="start" spacing={4} >
          <Box>
          <Heading as="h1" fontSize="3xl" fontWeight="bold" mb={2}>
  <Flex alignItems="center">
    <Text>{cardDetails.name}</Text>
    {cardDetails.verified && (
      <Image src="/check.png" alt="sample icon" height={14} width={14} ml={2} />
    )}
  </Flex>
</Heading>


            

          </Box>
          <Center>
  <Box mx="auto">
    <Image
      src={cardDetails.image}
      alt="Project Image"
      h="500"
      objectFit="cover"
      mb={2}
      borderRadius="md"
    />
  </Box>
</Center>

          <VStack align="start" spacing={2}>
            <Text fontSize="md" color="gray.700">
              {cardDetails.description}
            </Text>
            <HStack spacing={2}>
              <Text fontWeight="semibold">Started:</Text>
              <Text>{/* Add start date */}</Text>
              <Spacer />
              <Text fontWeight="semibold">Ended:</Text>
              <Text>{/* Add end date */}</Text>
            </HStack>
          </VStack>
          {/* Links */}
          <VStack align="start" spacing={1}>
            <Heading as="h2" fontSize="xl" fontWeight="semibold">
              Links:
            </Heading>
            <HStack align="start" spacing={30}>
  {Object.entries(cardDetails.links).map(([key, value]) => (
    <DynamicLinkIcon key={key} iconName={key} url={value.url} />
  ))}
</HStack>


          </VStack>
          {/* Tags */}
          <VStack align="start" spacing={2}>
            <Heading as="h2" fontSize="xl" fontWeight="semibold">
              Tags:
            </Heading>
            <HStack spacing={2}>
              {cardDetails.tags.map((tag, idx) => (
                <Badge key={idx} px={2} py={1} bg="purple.200" fontSize="sm" className="rounded-sm px-2 py-1 text-sm font-bold lowercase leading-[18px] text-purple-heart">
                  {tag}
                </Badge>
              ))}
            </HStack>
          </VStack>
        </VStack>

        {/* CTA */}
        <VStack align="start" spacing={4}>
          <Heading as="h2" fontSize="xl" fontWeight="semibold" mb={2}>
            Exclusive Updates
          </Heading>
          <Text mb={4}>
            Sign up for more exclusive updates about this project.
          </Text>
          <Button colorScheme="purple" size="lg">
            Sign Up Now
          </Button>
        </VStack>
      </VStack>

      {/* Right Column (30%) - Similar Projects */}
      <VStack align="start" spacing={4} w="30%" bgColor="gray.800" p={4} borderRadius="md">
        <Heading as="h2" fontSize="xl" fontWeight="semibold" color="black">
          Similar Projects
        </Heading>
        <SimpleGrid columns={1} spacing={4} maxW="100%" >
  {similarProjects.map((project) => (
    <Box key={project.id} p={4} borderWidth="1px" borderRadius="lg" bgColor="white" className="relative h-full w-full max-w-sm rounded-xl bg-white bg-center p-8 pt-12 shadow duration-150 ease-in-out hover:scale-105 lg:min-w-[350px]" >
      <Heading as="h3" fontSize="md" mb={2}>
        {project.name}
      </Heading>
      <Image src={project.image} alt="Project Image" w="full" h="40" objectFit="cover" mb={2} borderRadius="md" />
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color="gray.500" h="75px" w="300px" overflow="hidden">
          {project.description}
        </Text>
        <HStack spacing={1}>
          {project.tags.map((tag, idx) => (
            <Badge key={idx} px={1} py={1} bg="purple.200" fontSize="xs" className="rounded-sm px-1 py-1 text-xs font-bold lowercase leading-[12px] text-purple-heart">
              {tag}
            </Badge>
          ))}
        </HStack>
      </VStack>
      <Link href={`${project.id}`} color="blue.500" _hover={{ textDecoration: 'underline' }}>
        Read More
      </Link>
    </Box>
  ))}
</SimpleGrid>

      </VStack>
    </HStack>
  );
};

export default ProjectDetails;
