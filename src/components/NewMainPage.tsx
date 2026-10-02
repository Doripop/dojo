import React from "react";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/newMain.module.scss";

const cn = classNames.bind(style);

const NewMainPage: React.FC = () => {
  return (
    <div className={cn("new-main-page")}>
      <div className={cn("new-main-title")} />
      <div className={cn("new-main-link-btn-container")}>
        <div
          className={cn("link-btn-chat")}
          onClick={() => {
            window.location.href = "/chat";
          }}
        />
        <div
          className={cn("link-btn-arena")}
          onClick={() => {
            window.location.href = "/arena";
          }}
        />
        <div
          className={cn("link-btn-about")}
          onClick={() => {
            window.location.href = "/about";
          }}
        />
      </div>
    </div>
  );
};

export default NewMainPage;
