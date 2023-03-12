import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
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
        Jogos
        <S.Button onClick={() => navigate("/minesweeper")}>
          Minesweeper
        </S.Button>
      </S.WrapperButtonDiv>
    </S.WrapperDiv>
  ) : null;
};

export default LateralMenu;
