import React, { useContext } from "react";
import Page from "../../components/Page";
import { PageWidthContext } from "../../contexts/PageWidth";

const Home = (): JSX.Element => {
  const { pageWidth } = useContext(PageWidthContext);
  return (
    <Page title="Homepage" description="Homepage" width={pageWidth}>
      Homepage
    </Page>
  );
};

export default Home;
