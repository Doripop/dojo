import React from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/chatPage.module.scss";

interface SelectCardProps {
  krName: string;
  enName: string;
  profileImg: string;
}

const cn = classNames.bind(style);

const SelectCard = ({ krName, enName, profileImg }: SelectCardProps) => {
  return (
    <div
      className={cn("select-card", `${enName.toLowerCase().replace(" ", "")}`)}
      onClick={() => {
        window.location.href = `/chat/${enName.toLowerCase().replace(" ", "")}`;
      }}
    ></div>
  );
};

export default SelectCard;
