import React from "react";
import classNames from "classnames/bind";
import style from "../assets/styles/main.module.scss";
import MainImage from "../assets/image/main_Image.png";
import GnbBar from "./GnbBar";

const cn = classNames.bind(style);

const MainPage: React.FC = () => {
  const [isApiKey, setIsApiKey] = React.useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    // const storedApiKey = localStorage.getItem("apiKey");
    // setIsApiKey(storedApiKey);

    // if (!storedApiKey) {
    //   window.location.href = "/";
    // }

    // 이미지 프리로드
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = MainImage;
  }, []);
  console.log(" ㅅ______ㅅ ");
  console.log("(  o w o  )");
  console.log("U         U");
  console.log("(_________)");
  console.log(" WELCOME TO SOPHYBARA~");
  return (
    <div className={cn("main")}>
      <GnbBar />
      <div className={cn("content-body")}>
        <div className={cn("text-area")}>
          <h1>SophyBARA : Philosopher with Capybara</h1>
          <p>귀여운 카피바라 철학자들과 함께 재미있는 이야기를 나눠보아요!</p>
        </div>
        <div className={cn("image-container")}>
          {!imageLoaded && !imageError && (
            <div className={cn("image-loading")}>
              <div className={cn("loading-spinner")}></div>
              <p>이미지 로딩 중...</p>
            </div>
          )}
          {imageError && (
            <div className={cn("image-error")}>
              <p>이미지를 불러올 수 없습니다.</p>
            </div>
          )}
          <img
            src={MainImage}
            alt="Main Visual"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              borderRadius: "200px"
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
