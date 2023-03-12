import React from "react";
import * as S from "./style";

interface Props {
  children: React.ReactNode;
}

const Content = ({ children }: Props) => {
  return <S.WrapperDiv>{children}</S.WrapperDiv>;
};

export default Content;
