import React from "react";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/chatPage.module.scss";
import GnbBar from "./GnbBar";
import confuciusImg from "../assets/image/confucius.svg";
import buddhaImg from "../assets/image/buddha.svg";
import zhuangzhouImg from "../assets/image/zhuangzhou.svg";
import platoImg from "../assets/image/plato.svg";
import aristotleImg from "../assets/image/aristotle.svg";
import descartesImg from "../assets/image/descartes.svg";
import lockeImg from "../assets/image/johnlocke.svg";
import kantImg from "../assets/image/immanuelkant.svg";
import nietzscheImg from "../assets/image/friedrichnietzsche.svg";
import hanfeiziImg from "../assets/image/hanfeizi.svg";
import SelectCard from "./SelectCard";

const cn = classNames.bind(style);

const cardData = [
  {
    enName: "Confucius",
    krName: "공자",
    profileImg: confuciusImg
  },
  {
    enName: "Buddha",
    krName: "부처",
    profileImg: buddhaImg
  },
  {
    enName: "Zhuang Zhou",
    krName: "장자",
    profileImg: zhuangzhouImg
  },
  {
    enName: "Plato",
    krName: "플라톤",
    profileImg: platoImg
  },
  {
    enName: "Aristotle",
    krName: "아리스토텔레스",
    profileImg: aristotleImg
  },
  {
    enName: "René Descartes",
    krName: "르네 데카르트",
    profileImg: descartesImg
  },
  {
    enName: "John Locke",
    krName: "존 로크",
    profileImg: lockeImg
  },
  {
    enName: "Immanuel Kant",
    krName: "임마누엘 칸트",
    profileImg: kantImg
  },
  {
    enName: "Friedrich Nietzsche",
    krName: "프리드리히 니체",
    profileImg: nietzscheImg
  },
  {
    enName: "Han Feizi",
    krName: "한비자",
    profileImg: hanfeiziImg
  }
];

const SelectChatPage: React.FC = () => {
  return (
    <div className={cn("chat-page")}>
      <GnbBar />
      <div className={cn("chat-content")}>
        <div className={cn("chat-header")}>
          <h2>Choose a philosopher to talk with!</h2>
          <p>대화하고 싶은 철학자를 선택해주세요!</p>
        </div>
        <div className={cn("chat-body")}>
          {cardData.map((card) => (
            <SelectCard
              key={card.enName}
              krName={card.krName}
              enName={card.enName}
              profileImg={card.profileImg}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectChatPage;
