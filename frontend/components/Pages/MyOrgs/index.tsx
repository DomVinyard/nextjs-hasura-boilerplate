import { Box, Stack } from "@chakra-ui/react";
import Content from "components/Layout/Content";
import Loader from "components/Loader";
import OrgsList from "components/OrgList";
import AddNewOrgForm from "components/Pages/MyOrgs/AddNewOrgForm";
import { useMyOrgsQuery } from "generated-graphql";
import { getSession } from "next-auth/client";
import React from "react";
import IOrg from "types/org";

const OrgsPageComponent = ({ userId }) => {
  const { data, error, loading } = useMyOrgsQuery({
    variables: { userId },
  });

  if (!data) {
    return <Loader />;
  }

  return (
    <Content>
      <Stack spacing={8}>
        <Box>
          <a href={"/orgs/add"}>Add org</a>
        </Box>
        {<OrgsList orgs={data.users_by_pk?.orgs} />}
      </Stack>
    </Content>
  );
};

export default OrgsPageComponent;
