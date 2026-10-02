import React, { use, useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/gnbBar.module.scss";
import logo from "../assets/image/logo.svg";

const cn = classNames.bind(style);

const GnbBar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const firstSegment = pathParts[0] || "";
    setCurrentPath(firstSegment);
  }, []);

  return (
    <div
      className={cn(
        "gnb-bar",
        currentPath.includes("arena") ? "arena-active" : ""
      )}
    >
      {/* <ReactSVG
        src={logo}
        className={cn("logo")}
        onClick={() => {
          window.location.href = "/main";
        }}
      /> */}
      <div
        className={cn("backspace")}
        onClick={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = "/";
          }
        }}
      />
      <div className={cn("menu-button-wrapper")}>
        <button
          className={cn(
            "onlyChat",
            currentPath.includes("chat") ? "disabled" : ""
          )}
          onClick={() => {
            window.location.href = "/chat";
          }}
        ></button>
        <button
          className={cn(
            "arena",
            currentPath.includes("arena") ? "disabled" : ""
          )}
          onClick={() => {
            window.location.href = "/arena";
          }}
        ></button>
        <button
          className={cn(
            "about",
            currentPath.includes("about") ? "disabled" : ""
          )}
          onClick={() => {
            window.location.href = "/about";
          }}
        ></button>
      </div>
    </div>
  );
};

export default GnbBar;
