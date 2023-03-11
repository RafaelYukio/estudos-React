import React from "react";
import Button from "../Button";
import * as S from "./style";

interface Props {
  PrimaryButtonOnClick: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  SecondaryButtonOnClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  Header: string;
  Content: string;
  Footer?: string;
}

const Modal = ({
  PrimaryButtonOnClick,
  SecondaryButtonOnClick,
  Header,
  Content,
  Footer,
}: Props): JSX.Element => {
  return (
    <S.ModalWrapperDiv>
      <S.ModalDiv>
        <S.ModalHeaderDiv>{Header}</S.ModalHeaderDiv>
        <S.ModalContentDiv>{Content}</S.ModalContentDiv>
        <S.ModalFooterDiv>
          {Footer}
          <Button onClick={PrimaryButtonOnClick}>Fechar</Button>
          {SecondaryButtonOnClick && (
            <Button onClick={SecondaryButtonOnClick}>Fechar</Button>
          )}
        </S.ModalFooterDiv>
      </S.ModalDiv>
    </S.ModalWrapperDiv>
  );
};

export default React.memo(Modal);
