import { useNavigate } from "react-router-dom";
import * as S from "./style";

interface Props {
  hide: boolean;
}

const LateralMenu = ({ hide }: Props) => {
  const navigate = useNavigate();

  return !hide ? (
    <S.WrapperDiv>
      <S.WrapperButtonDiv>
        <S.Button onClick={() => navigate("/")}>Home</S.Button>
        <S.Button onClick={() => navigate("/repository")}>Repository</S.Button>
        <S.TitleDiv>
          Jogos
          <S.Divider />
        </S.TitleDiv>
        <S.Button onClick={() => navigate("/minesweeper")}>
          Minesweeper
        </S.Button>
        <S.Button onClick={() => navigate("/sudoku")}>Sudoku</S.Button>
      </S.WrapperButtonDiv>
    </S.WrapperDiv>
  ) : null;
};

export default LateralMenu;
