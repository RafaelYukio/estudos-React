import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Page from "../../components/Page";
import ReactMarkdown from "react-markdown";
import * as S from "./style";
import { PageWidthContext } from "../../contexts/PageWidth";

const Home = (): JSX.Element => {
  const { pageWidth } = useContext(PageWidthContext);
  const [readme, setReadme] = useState<string>("");

  async function getUsuarios(): Promise<void> {
    try {
      const response = await axios.get(
        `https://raw.githubusercontent.com/RafaelYukio/estudos-React/main/README.md`
      );
      setReadme(response.data);
    } catch (error) {
      alert("Erro!");
    }
  }

  useEffect(() => {
    getUsuarios();
  }, []);

  return (
    <Page title="Homepage" description="Homepage" width={pageWidth}>
      <S.DescriptionWrapperDiv>
        Olar! Repositório: https://github.com/RafaelYukio/estudos-React
      </S.DescriptionWrapperDiv>
      <S.ReadmeWrapperDiv>
        README.md
        <hr />
        <ReactMarkdown>{readme}</ReactMarkdown>
      </S.ReadmeWrapperDiv>
    </Page>
  );
};

export default Home;
