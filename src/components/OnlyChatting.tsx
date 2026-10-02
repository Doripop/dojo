import React, { useState, useEffect, useMemo, useRef } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/onlyChatting.module.scss";
import SendImg from "../assets/image/message_send.svg";
import GnbBar from "./GnbBar";

// SVG 파일들을 정적으로 import
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
import axios from "axios";
import { useChatListStore } from "./stores/chatList";
import ChatBubble from "./ChatBubble";

const cardData = [
  {
    enName: "Confucius",
    krName: "공자",
    profileImg: confuciusImg,
    urlKey: "confucius"
  },
  {
    enName: "Buddha",
    krName: "부처",
    profileImg: buddhaImg,
    urlKey: "buddha"
  },
  {
    enName: "Zhuang Zhou",
    krName: "장자",
    profileImg: zhuangzhouImg,
    urlKey: "zhuangzhou"
  },
  {
    enName: "Plato",
    krName: "플라톤",
    profileImg: platoImg,
    urlKey: "plato"
  },
  {
    enName: "Aristotle",
    krName: "아리스토텔레스",
    profileImg: aristotleImg,
    urlKey: "aristotle"
  },
  {
    enName: "René Descartes",
    krName: "르네 데카르트",
    profileImg: descartesImg,
    urlKey: "renédescartes"
  },
  {
    enName: "John Locke",
    krName: "존 로크",
    profileImg: lockeImg,
    urlKey: "johnlocke"
  },
  {
    enName: "Immanuel Kant",
    krName: "임마누엘 칸트",
    profileImg: kantImg,
    urlKey: "immanuelkant"
  },
  {
    enName: "Friedrich Nietzsche",
    krName: "프리드리히 니체",
    profileImg: nietzscheImg,
    urlKey: "friedrichnietzsche"
  },
  {
    enName: "Han Feizi",
    krName: "한비자",
    profileImg: hanfeiziImg,
    urlKey: "hanfeizi"
  }
];

const cn = classNames.bind(style);

const OnlyChatting: React.FC = () => {
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [svgError, setSvgError] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [uniqueKey, setUniqueKey] = useState("");
  const [chatInput, setChatInput] = useState("");

  const { setChatList } = useChatListStore();
  const chatList = useChatListStore((state) => state.chatList);

  const pathSegments = window.location.pathname.split("/");
  const urlKey = decodeURIComponent(pathSegments[2]);

  const nameMatch = useMemo(() => {
    return cardData.find((card) => {
      const cardKey = card.enName.toLowerCase().replace(/\s/g, "");
      return cardKey === urlKey || card.urlKey === urlKey;
    });
  }, [urlKey]);

  // SVG & uniqueKey 프리로드

  useEffect(() => {
    if (nameMatch?.profileImg) {
      const img = new Image();
      img.onload = () => setSvgLoaded(true);
      img.onerror = () => setSvgError(true);
      img.src = nameMatch.profileImg;
    }
    const generatedKey = Math.random().toString(36).substring(2, 11);
    setUniqueKey(generatedKey);
  }, [nameMatch]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    setChatLoaded(true);
    // 메시지 전송 로직 구현 예정
    setChatList({
      chatType: "user",
      name: "You",
      text: chatInput
    });

    const currentMessage = chatInput;
    setChatInput("");

    try {
      const payload = {
        message: currentMessage.toLowerCase(),
        session_id: uniqueKey,
        philosopher: urlKey
      };

      const response = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/chat/",
        payload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Message sent:", response);

      // Accept any 2xx status and safely extract the output from response.data
      if (
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        response.data
      ) {
        const output = Array.isArray(response.data)
          ? (response.data[0]?.output ?? String(response.data[0]))
          : ((response.data as any).output ?? String(response.data));

        console.log("Only Response:", output);
        setChatList({
          chatType: "assistant",
          name: nameMatch?.enName || "Assistant",
          text: output
        });
      } else {
        console.warn("Unexpected response format or status:", response);
        setChatList({
          chatType: "assistant",
          name: "System",
          text: "죄송합니다. 서버 응답이 예상과 다릅니다. 다시 시도해주세요."
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);

      setChatList({
        chatType: "assistant",
        name: "System",
        text: "죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요."
      });
    } finally {
      setChatLoaded(false);
    }
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  return (
    <div
      className={cn(
        "only-chatting",
        nameMatch?.enName.toLowerCase().replace(" ", "")
      )}
    >
      <GnbBar />
      <div className={cn("chat-content-body")}>
        {/* profile image */}
        {!chatList.length && (
          <div className={cn("chat-header-profile")}>
            <div className={cn("profile-image-container")}>
              {!svgLoaded && !svgError && (
                <div className={cn("svg-loading")}>
                  <div className={cn("loading-spinner")}></div>
                </div>
              )}
              {svgError && <div className={cn("svg-error")}>❌</div>}
              {nameMatch?.profileImg && (
                <div
                  className={cn(
                    "chat-sopy-profile",
                    nameMatch.enName.toLowerCase().replace(" ", "")
                  )}
                />
              )}
            </div>

            <div className={cn("header-profile-text-area")}>
              <h2>Chat with {nameMatch?.enName || "Unknown"} SophyBARA</h2>
              <p>
                {nameMatch?.krName || "알 수 없는"} 소피바라와 대화를 나눠보세요
              </p>
            </div>
          </div>
        )}

        {/* profile image */}
        <div className={cn("chat-interface")}>
          {/* Chat interface will be implemented here */}
          {chatList.map((chatItem, index) => (
            <React.Fragment key={index}>
              <ChatBubble
                chatItem={chatItem}
                characterName={nameMatch?.enName}
              />
              {chatLoaded && index === chatList.length - 1 && (
                <div className={cn("loading-spinner-container")}>
                  <div className={cn("loading-spinner")}></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </React.Fragment>
          ))}
        </div>
        <div className={cn("chat-footer")}>
          <input
            type="text"
            placeholder="Ask anything"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button onClick={handleSendMessage}>
            <div className={cn("send-button")} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlyChatting;
