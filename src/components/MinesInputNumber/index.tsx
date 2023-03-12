import React from "react";
import * as S from "./styles";

interface Props {
  inputRef?: React.RefObject<HTMLInputElement>;
  defaultValue: number;
  onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

const MinesInputNumber = ({
  inputRef,
  defaultValue,
  onChange,
  children,
}: Props): JSX.Element => {
  return (
    <S.WrapperDiv>
      {children}
      <S.NumberInput
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={onChange}
        type="number"
      />
    </S.WrapperDiv>
  );
};

export default React.memo(MinesInputNumber);
