import React from "react";
import Divider from "../Divider";
import * as S from "./style";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Page = ({ title, description, children }: Props) => {
  console.log("passei na page");
  return (
    <S.OuterWrapperDiv>
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
