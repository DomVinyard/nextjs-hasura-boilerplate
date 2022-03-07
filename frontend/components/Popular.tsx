import {
  Box,
  Flex,
  useBreakpointValue,
  GridItem,
  Select,
} from "@chakra-ui/react";
import OrgsList from "components/OrgsList";
import { useFetchLatestQuery, useFetchFeaturedQuery } from "generated-graphql";
import React, { useState } from "react";
import Link from "next/link";

type TabIDs = "featured" | "latest";
type tab = {
  id: TabIDs;
  label: string;
  isSelected: boolean;
};

const PopularComponent = () => {
  const [selected, setSelected] = useState<TabIDs>("featured");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const top = useBreakpointValue({ base: 5, md: 9, lg: 11 });
  const {
    data: featured_data,
    error: featured_error,
    loading: featured_loading,
  } = useFetchFeaturedQuery({
    variables: { top },
  });
  const {
    data: latest_data,
    error: latest_error,
    loading: latest_loading,
  } = useFetchLatestQuery({
    variables: { top },
  });
  const tabs: tab[] = [
    { label: "Featured", id: "featured", isSelected: selected === "featured" },
    { label: "Latest", id: "latest", isSelected: selected === "latest" },
  ];
  const handleSelectTab = (id) => {
    setSelected(id);
  };

  const data = selected === "featured" ? featured_data : latest_data;
  const error = selected === "featured" ? featured_error : latest_error;
  const loading = selected === "featured" ? featured_loading : latest_loading;

  return (
    <Box pb={{ base: 0, md: 10 }}>
      {/* Wide */}
      <Select
        mt={32}
        mb={10}
        onChange={(e) => handleSelectTab(e.target.value)}
        display={{ base: "none", md: "block" }}
        fontSize={{ base: "28px", md: "34px" }}
        maxW={300}
        fontFamily={"Montserrat"}
        fontWeight={"800"}
        borderColor={"#ccc"}
        // size={"xl"}
        variant="outline"
      >
        {tabs.map((tab) => (
          <option
            style={{ margin: "16px" }}
            key={tab.id + "wide"}
            value={tab.id}
          >
            {tab.label}
          </option>
        ))}
      </Select>
      {/* </Heading> */}

      {/* Mobile */}
      <Flex
        fontSize={18}
        fontFamily={"Montserrat"}
        display={{ base: "flex", md: "none" }}
        background={"#aaa"}
        borderBottom={"4px solid #eee"}
      >
        {tabs.map((tab) => (
          <Box
            onClick={() => handleSelectTab(tab.id)}
            background={tab.isSelected ? "#eee" : "#ddd"}
            margin={0}
            mb={0}
            opacity={tab.isSelected ? 1 : 0.4}
            py={6}
            flex={1}
            key={tab.id}
            textAlign={"center"}
          >
            {tab.label}
          </Box>
        ))}
      </Flex>

      <OrgsList
        orgs={data?.orgs}
        loading={loading}
        after={
          <GridItem rowSpan={1} colSpan={1}>
            <Link href={"/browse"}>
              <Flex
                // height={{ base: "400px", md: "100%" }}
                height="100%"
                width={"100%"}
                cursor={"pointer"}
                alignItems={"center"}
                justifyContent={"center"}
                color="#444"
                fontWeight={800}
                backgroundImage={"url(images/cloud.png)"}
                backgroundSize={"cover"}
                backgroundPosition={"center center"}
              ></Flex>
            </Link>
          </GridItem>
        }
      />
    </Box>
  );
};

export default PopularComponent;
