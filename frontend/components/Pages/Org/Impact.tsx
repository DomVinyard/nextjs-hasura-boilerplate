import { AddIcon } from "@chakra-ui/icons";
import {
  Text,
  Button,
  Heading,
  Stack,
  useBreakpointValue,
  Box,
  Flex,
} from "@chakra-ui/react";
import Content from "components/Content";
import React from "react";

const ImpactPageComponent = () => {
  return (
    <Content py={8}>
      <Stack spacing={8}>
        <Heading textAlign={{ base: "center", md: "left" }}>
          Impact section for org
        </Heading>
      </Stack>
    </Content>
  );
};

export default ImpactPageComponent;
