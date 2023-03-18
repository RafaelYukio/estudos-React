import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import Page from "../../components/Page";
import * as S from "./style";
import { PageWidthContext } from "../../contexts/PageWidth";
import { FcFolder, FcFile } from "react-icons/fc";

const Home = (): JSX.Element => {
  const { pageWidth } = useContext(PageWidthContext);

  // Como fazer cadeia de requisições com Axios:
  // https://stackoverflow.com/questions/70202160/fetching-the-data-from-second-api-based-on-the-response-from-the-first-api-react

  interface DataFile {
    name: string;
    path: string;
    type: string;
    download_url: string;
  }

  const [tree, setTree] = useState<Array<DataFile>>();
  const [file, setFile] = useState<string>("");
  const directoryPath = useRef<Array<string>>([""]);

  useEffect(() => {
    getInitialTree();
  }, []);

  async function getInitialTree(): Promise<void> {
    await getTree();
  }

  async function getTree(): Promise<void> {
    console.log([...directoryPath.current]);
    try {
      await axios
        .get(
          `https://api.github.com/repos/RafaelYukio/estudos-react/contents${directoryPath.current.reduce(
            (accumulator, currentValue) =>
              accumulator.concat(`/${currentValue}`)
          )}`
        )
        .then((response) => {
          let sortedTree: Array<DataFile> = response.data.sort(function (
            a: DataFile,
            b: DataFile
          ) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
              return 1;
            }
            return 0;
          });

          sortedTree.sort(function (a: DataFile, b: DataFile) {
            if (a.type === "dir") {
              return -1;
            }
            if (a.type === "file") {
              return 1;
            }
            return 0;
          });
          setTree(response.data);
        });
    } catch (error) {
      alert("Erro ao requisitar repositório!");
    }
  }

  async function getFile(download_url: string): Promise<void> {
    try {
      axios.get(download_url).then((response) => {
        if (typeof response.data === "string") setFile(response.data);
        else setFile(JSON.stringify(response.data, null, 4));
      });
    } catch (error) {
      alert("Erro ao requisitar repositório!");
    }
  }

  async function fileDirOnClick(dataFile: DataFile) {
    if (dataFile.type === "dir") {
      directoryPath.current = directoryPath.current.concat(dataFile.name);
      await getTree();
    }

    if (dataFile.type === "file") {
      await getFile(dataFile.download_url);
    }
  }

  async function backDirOnClick(path?: string) {
    if (!path) directoryPath.current = [""];
    else {
      let pathIndex = directoryPath.current.findIndex(
        (element) => element === path
      );
      directoryPath.current = directoryPath.current.slice(0, pathIndex + 1);
      console.log(pathIndex);
    }

    getTree();
  }

  return (
    <Page title="Repository" description="Repository" width={pageWidth}>
      <S.DescriptionWrapperDiv>
        Repositório: https://github.com/RafaelYukio/estudos-react
        <br /> <br />
        Aqui criado utilizando a API do GitHub:
        https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28
      </S.DescriptionWrapperDiv>
      <S.FilesWrapperDiv>
        Folder
        <hr />
        <S.FilesContentPathWrapperDiv>
          <span>
            Path: RafaelYukio/
            <S.FileDirButton dataType={"dir"} onClick={() => backDirOnClick()}>
              estudos-react
            </S.FileDirButton>
            {[...directoryPath.current].slice(1).map((path) => (
              <span>
                /
                <S.FileDirButton
                  dataType={"dir"}
                  onClick={() => backDirOnClick(path)}
                >
                  {path}
                </S.FileDirButton>
              </span>
            ))}
          </span>
        </S.FilesContentPathWrapperDiv>
        <S.FilesContentWrapperDiv>
          {tree
            ? tree.map((dataFile: DataFile) => (
                <S.SpanRow>
                  {dataFile.type === "dir" ? (
                    <FcFolder size={"28px"} />
                  ) : (
                    <FcFile size={"28px"} />
                  )}
                  <S.FileDirButton
                    onClick={() => fileDirOnClick(dataFile)}
                    dataType={dataFile.type}
                  >
                    {dataFile.name}
                  </S.FileDirButton>
                </S.SpanRow>
              ))
            : "Erro ao carregar repositório!"}
        </S.FilesContentWrapperDiv>
      </S.FilesWrapperDiv>
      <S.FilesWrapperDiv>
        File
        <hr />
        <S.FilesContentWrapperDiv>
          <pre>{file}</pre>
        </S.FilesContentWrapperDiv>
      </S.FilesWrapperDiv>
    </Page>
  );
};

export default Home;
