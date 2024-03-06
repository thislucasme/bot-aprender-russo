import {
  SimpleGrid,
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Button,
  Text,
  HStack,
  VStack,
  Image,
  Stack,
  Divider,
  ButtonGroup,
} from "@chakra-ui/react";
import { MdFileUpload } from "react-icons/md"
import { InitialFocus } from "../modals/CreateStudy";

export const Main = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ECECEC" }}>
      <VStack
        w={"full"}
        height={"45px"}
        bgGradient="linear(to-r, green.200, pink.500)"
      >
        <HStack height={"45px"}>
          <Text color={"white"}>Effortless language learning 🌐📚✨</Text>
        
          <InitialFocus/>
        </HStack>
      </VStack>
      <SimpleGrid
        margin={10}
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        <Card>
          <CardHeader>
            <Heading size="md"> Ру́сский медве́дь</Heading>
          </CardHeader>
          <CardBody>
            <Text>
            Не́которые иностра́нцы ду́мают, что в Росси́и медве́ди хо́дят по у́лицам.
            </Text>
          </CardBody>
          <CardFooter>
            <Button leftIcon={<MdFileUpload />}>Upload JSON</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
      </SimpleGrid>


    </div>
  );
};
