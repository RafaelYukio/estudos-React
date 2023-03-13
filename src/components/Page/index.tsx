import React from "react";
import * as S from "./style";

interface Props {
  title: string;
  description: string;
  width: string;
  children: React.ReactNode;
}

const Page = ({ title, description, width, children }: Props) => {
  console.log("passei na page");
  return (
    <S.OuterWrapperDiv width={width}>
      <S.InnerWrapperDiv>
        <S.HeaderDiv>
          <h1>{title}</h1>
          <span>{description}</span>
        </S.HeaderDiv>
        <S.ContentDiv>{children}</S.ContentDiv>
      </S.InnerWrapperDiv>
    </S.OuterWrapperDiv>
  );
};

export default React.memo(Page);
