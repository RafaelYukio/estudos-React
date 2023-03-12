import * as S from "./style";

interface Props {
  hideLateralMenu: boolean;
  setHideLateralMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setHideLateralMenu, hideLateralMenu }: Props) => {
  return (
    <S.WrapperDiv>
      <S.ButtonWrapperDiv>
        <S.Button onClick={() => setHideLateralMenu(!hideLateralMenu)}>
          Show
        </S.Button>
      </S.ButtonWrapperDiv>

      <S.TitleSpan>Estudos React!</S.TitleSpan>
      <S.InformationDiv>Quem sou eu</S.InformationDiv>
    </S.WrapperDiv>
  );
};

export default Navbar;
