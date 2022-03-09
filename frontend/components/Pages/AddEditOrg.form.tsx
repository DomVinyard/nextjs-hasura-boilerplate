import {
  Box,
  Button,
  Flex,
  Input,
  List,
  ListItem,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Link from "next/link";
import slugify from "../../lib/slugify";
import ImpactModal from "components/ImpactModal";

export type Field = {
  id: string;
  label?: string;
  validation?: any;
  element: any;
  placeholder?: string;
  before?: any;
  after?: any;
  custom?: any;
};

const FIELDS: Field[] = [
  // Name
  {
    id: "name",
    label: "Organisation Name",
    validation: {
      required: "This is required",
      minLength: {
        value: 4,
        message: "Minimum length should be 4 characters",
      },
    },
    element: Input,
    after: ({ values, isEditMode }) => {
      const linkText = isEditMode
        ? "Share Link: "
        : "Your report will be created at: ";
      const linkURL = `https://impact.ooo/${slugify(`${values.name}`, {
        lower: true,
      })}`;
      if (values.name === "") return null;
      return (
        <Text color={"blue"} fontSize={12} mt={1}>
          <strong>{linkText}</strong>
          <Link href={linkURL}>{linkURL}</Link>
        </Text>
      );
    },
  },

  // Main image
  {
    id: "main_image",
    label: "Main Image",
    element: Input,
    validation: {},
    custom: ({ values, isEditMode, onChange, ...others }) => {
      return (
        <Flex
          backgroundImage={`url(${values.main_image})`}
          backgroundColor={"#eee"}
          backgroundSize="cover"
          backgroundPosition={"center center"}
          minHeight={{ base: 32, md: 28 }}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            colorScheme="blue"
            mt={2}
            onClick={async () => {
              const prompt = window.prompt(
                "Paste image URL here",
                values.main_image
              );
              if (!prompt) return;
              await onChange({ target: { name: "main_image", value: prompt } });
            }}
          >
            {isEditMode ? "Change" : "Upload"}
          </Button>
        </Flex>
      );
    },
  },

  // Short description
  {
    id: "description",
    label: "Short description",
    element: Textarea,
    validation: {
      required: "This is required",
      minLength: {
        value: 60,
        message: "Minimum length should be 60 characters",
      },
      maxLength: {
        value: 360,
        message: "Maximum length should be 360 characters",
      },
    },
  },

  // Impact
  {
    id: "impact",
    label: "Impacts",
    element: Textarea,
    validation: {},
    custom: ({ values, isEditMode, onChange, org, refetch }) => {
      const { isOpen, onOpen, onClose } = useDisclosure();
      const [selectedImpact, setSelectedImpact] = useState(null);
      return (
        <>
          <List>
            {!org?.impacts?.length && <ListItem>none</ListItem>}
            {org?.impacts?.map((impact, index) => {
              return (
                <ListItem>
                  {impact.indicator}: {impact.value}
                  <Button
                    onClick={() => {
                      setSelectedImpact(impact);
                      onOpen();
                    }}
                  >
                    edit
                  </Button>
                  <ImpactModal
                    refetchList={refetch}
                    isOpen={isOpen}
                    onClose={onClose}
                    isEditMode={true}
                    impact={impact}
                    org={org}
                  />
                </ListItem>
              );
            })}
          </List>
          <Button
            colorScheme="blue"
            onClick={() => {
              setSelectedImpact({ indicator: "", value: "", sdg: "" });
              onOpen();
            }}
          >
            Add impact
          </Button>
          <ImpactModal
            refetchList={refetch}
            isOpen={isOpen}
            onClose={onClose}
            isEditMode={!!selectedImpact}
            impact={selectedImpact}
            org={org}
          />
        </>
      );
    },
  },

  // Geography
  {
    id: "geography",
    label: "Geography",
    element: Textarea,
    validation: {},
  },
];

export default FIELDS;
