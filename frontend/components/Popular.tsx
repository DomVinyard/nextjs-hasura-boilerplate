import {
  Box,
  Flex,
  useBreakpointValue,
  GridItem,
  Select,
  ButtonGroup,
  Button,
  IconButton,
} from "@chakra-ui/react";
import OrgsList from "components/OrgsList";
import {
  useFetchLatestQuery,
  useFetchFeaturedQuery,
  useMyOrgsQuery,
} from "generated-graphql";
import React, { useState } from "react";
import Link from "next/link";
import { AddIcon } from "@chakra-ui/icons";
import { BsGridFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { session } from "next-auth/client";
import { useSession } from "next-auth/client";
import useLocalState from "@phntms/use-local-state";
import useLocalStorageState from "use-local-storage-state";

type TabIDs = "featured" | "latest" | "yours";
type tab = {
  id: TabIDs;
  label: string;
  isSelected: boolean;
};

const Controls = ({
  tabs,
  handleSelectTab,
  popularFilter,
  popularLayout,
  handleSelectLayout,
}) => {
  // const [popularFilter, setPopularFilter] = useLocalState<TabIDs>(
  //   "POPULAR_FILTER",
  //   "featured"
  // );
  // const [popularLayout, setPopularLayout] = useLocalState(
  //   "POPULAR_LAYOUT",
  //   "grid"
  // );
  // console.log(tabs.find((t) => t.isSelected));
  return (
    <>
      {/* Wide */}
      <Flex
        display={{ base: "none", md: "flex" }}
        marginTop={24}
        marginBottom={6}
      >
        <Box flexGrow={1}>
          <Link href="/orgs/add">
            <Button colorScheme="blue">Add organisation</Button>
          </Link>
          <Link href="/orgs">
            <Button colorScheme="gray" ml={2} color="gray" variant="ghost">
              Your organisations →
            </Button>
          </Link>
        </Box>
        <Box>
          <Select
            onChange={(e) => handleSelectTab(e.target.value)}
            borderColor={"#ccc"}
            variant="outline"
            size="md"
            minWidth={200}
            value={tabs.find((t) => t.isSelected)?.id}
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
        </Box>
        <Box ml={2}>
          <ButtonGroup size="md" isAttached variant="outline">
            <IconButton
              onClick={() => handleSelectLayout("grid")}
              size="md"
              variant="outline"
              mr="-px"
              aria-label="Grid"
              isActive={popularLayout === "grid"}
              icon={<BsGridFill />}
            />
            <IconButton
              onClick={() => handleSelectLayout("table")}
              size="md"
              variant="outline"
              aria-label="List"
              isActive={popularLayout === "table"}
              icon={<FaThList />}
            />
          </ButtonGroup>
        </Box>
      </Flex>

      {/* Mobile */}
      <Flex
        fontSize={19}
        display={{ base: "flex", md: "none" }}
        background={"#aaa"}
        borderBottom={"4px solid #eee"}
        fontWeight={300}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === popularFilter;
          console.log("build tab", tab.id, "is it selected?", !!tab.isSelected);
          return (
            <Box
              onClick={() => handleSelectTab(tab.id)}
              background={isSelected ? "#eee" : "#ddd"}
              margin={0}
              mb={0}
              opacity={isSelected ? 1 : 0.4}
              py={6}
              flex={1}
              key={tab.id}
              textAlign={"center"}
            >
              {tab.label}
            </Box>
          );
        })}
      </Flex>
    </>
  );
};

const PopularComponent = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const top = useBreakpointValue({ base: 6, md: 10, lg: 15 });

  const [session] = useSession();

  const emptyList = Array.apply(null, Array(top)).map(() => ({}));
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
  const [popularFilter, setPopularFilter] = useLocalStorageState<TabIDs>(
    "POPULAR_FILTER",
    {
      ssr: true,
      defaultValue: "featured",
    }
  );
  const [popularLayout, setPopularLayout] = useLocalStorageState(
    "POPULAR_LAYOUT",
    {
      ssr: true,
      defaultValue: "grid",
    }
  );
  // const [selected, setSelected] = useState<TabIDs>(popularFilter);
  // const {
  //   data: yours_data,
  //   error: yours_error,
  //   loading: yours_loading,
  // } = useMyOrgsQuery({
  //   variables: { userId: session?.user?.id },
  // });
  // console.log(popularFilter);
  const tabs: tab[] = [
    {
      label: "Featured",
      id: "featured",
      isSelected: popularFilter === "featured",
    },
    {
      label: isMobile ? "Recent" : "Recently added",
      id: "latest",
      isSelected: popularFilter === "latest",
    },
  ];
  const handleSelectTab = (id) => setPopularFilter(id);
  const handleSelectLayout = (id) => setPopularLayout(id);

  const data = popularFilter === "featured" ? featured_data : latest_data;
  const error = popularFilter === "featured" ? featured_error : latest_error;
  const loading =
    popularFilter === "featured" ? featured_loading : latest_loading;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box pb={{ base: 0, md: 10 }}>
      <Controls
        popularFilter={popularFilter}
        popularLayout={popularLayout}
        tabs={tabs}
        handleSelectTab={handleSelectTab}
        handleSelectLayout={handleSelectLayout}
      />
      <OrgsList
        orgs={data?.orgs || emptyList}
        loading={loading}
        // after={
        //   <GridItem rowSpan={1} colSpan={1}>
        //     <Link href={"/browse"}>
        //       <Flex
        //         height="100%"
        //         width={"100%"}
        //         cursor={"pointer"}
        //         alignItems={"center"}
        //         justifyContent={"center"}
        //         color="#444"
        //         fontWeight={800}
        //         backgroundImage={"url(images/cloud.png)"}
        //         backgroundSize={"cover"}
        //         backgroundPosition={"center center"}
        //       ></Flex>
        //     </Link>
        //   </GridItem>
        // }
      />
    </Box>
  );
};

export default PopularComponent;
