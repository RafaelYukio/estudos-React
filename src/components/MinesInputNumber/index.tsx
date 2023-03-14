import React from "react";
import * as S from "./styles";

interface Props {
  inputRef?: React.RefObject<HTMLInputElement>;
  defaultValue: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  children: React.ReactNode;
}

const MinesInputNumber = ({
  inputRef,
  defaultValue,
  onChange,
  min,
  max,
  children,
}: Props): JSX.Element => {
  return (
    <S.WrapperDiv>
      {children}
      <S.NumberInput
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={(event) => {
          if (onChange) onChange(event);
        }}
        min={min}
        max={max}
        type="number"
      />
    </S.WrapperDiv>
  );
};

export default React.memo(MinesInputNumber);
