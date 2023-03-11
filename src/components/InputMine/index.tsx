import React from "react";
import * as S from "./styles";

interface Props {
  inputRef?: React.RefObject<HTMLInputElement>;
  defaultValue: number;
  children: React.ReactNode;
}

const InputMine = ({
  inputRef,
  defaultValue,
  children,
}: Props): JSX.Element => {
  return (
    <S.WrapperDiv>
      {children}
      <S.NumberInput ref={inputRef} defaultValue={defaultValue} type="number" />
    </S.WrapperDiv>
  );
};

export default React.memo(InputMine);
