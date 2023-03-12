import { useContext } from "react";
import { PageWidthContext } from "../../contexts/PageWidth";
import { FaReact, FaLinkedin, FaGithubSquare } from "react-icons/fa";
import * as S from "./style";

interface Props {
  hideLateralMenu: boolean;
  setHideLateralMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setHideLateralMenu, hideLateralMenu }: Props) => {
  const { setPageWidth } = useContext(PageWidthContext);
  if (setPageWidth)
    hideLateralMenu ? setPageWidth("100%") : setPageWidth("85%");
  return (
    <S.WrapperDiv>
      <S.ButtonOuterWrapperDiv>
        <S.ButtonInnerWrapperDiv>
          <S.Button onClick={() => setHideLateralMenu(!hideLateralMenu)}>
            {hideLateralMenu ? "Show Menu" : "Hide Menu"}
          </S.Button>
        </S.ButtonInnerWrapperDiv>
      </S.ButtonOuterWrapperDiv>

      <S.TitleDiv>
        <FaReact size={"3em"} color={"#61DAFB"} />
        <S.TitleSpan>Estudos React!</S.TitleSpan>
        <FaReact size={"3em"} color={"#61DAFB"} />
      </S.TitleDiv>
      <S.InformationDiv>
        <S.InformationSpan>Quem sou eu</S.InformationSpan>
        <S.InformationSpan>
          <a
            href="https://github.com/RafaelYukio"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithubSquare color={"white"} />
          </a>
        </S.InformationSpan>
        <S.InformationSpan>
          <a
            href="https://www.linkedin.com/in/rafael-tadokoro/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin color={"white"} />
          </a>
        </S.InformationSpan>
      </S.InformationDiv>
    </S.WrapperDiv>
  );
};

export default Navbar;
