import React, { ChangeEvent, useState } from "react";
import * as S from "./style";

// Componente baseado:
// https://dev.to/karltaylor/creating-a-switch-toggle-in-react-using-styled-components-1enn
// https://codesandbox.io/s/easy-toggle-tnimz?file=/src/App.tsx:883-984

interface Props {
  onClick: (event?: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  children: React.ReactNode;
}

const Toggle = ({ onClick, children }: Props): JSX.Element => {
  return (
    <S.ToggleLabel>
      <span>{children}</span>
      <S.ToggleInput onClick={(event) => onClick(event)} type="checkbox" />
      <S.ToggleSwitch />
    </S.ToggleLabel>
  );
};

export default React.memo(Toggle);
