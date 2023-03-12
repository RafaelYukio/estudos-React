import React from "react";
import * as S from "./style";

interface Props {
  hide: boolean;
}

const LateralMenu = ({ hide }: Props) => {
  return !hide ? <S.WrapperDiv>Estudos React!</S.WrapperDiv> : null;
};

export default LateralMenu;
