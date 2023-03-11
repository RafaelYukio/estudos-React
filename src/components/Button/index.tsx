import React from "react";
import * as S from "./style";

interface Props {
  onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: Props): JSX.Element => {
  return <S.Button onClick={onClick}>{children}</S.Button>;
};

export default React.memo(Button);
