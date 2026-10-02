import React, { use, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/arena.module.scss";
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
import { ReactSVG } from "react-svg";
import PhilosopherCard from "./PhilosopherCard";
import StartModal from "./StartModal";
import EndModal from "./EndModal";

const cn = classNames.bind(style);

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

const Arena: React.FC = () => {
  //페이지 시작 시 모달 오픈
  const [isModalOpen, setIsModalOpen] = useState(false);
  //페이지 엔드 모달 오픈
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  //arena 진행 상태 status
  const [arenaStatus, setArenaStatus] = useState<
    "Constructive" | "rebuttal" | "closing"
  >("Constructive");

  //챗봇 불러오기 스테이트
  const [characterA, setCharacterA] = useState("");
  const [characterB, setCharacterB] = useState("");
  //이후 보여줄 캐릭터
  const [characterC, setCharacterC] = useState("");
  const [characterD, setCharacterD] = useState("");
  const [characterE, setCharacterE] = useState("");

  //챗 타이핑 효과 스테이트

  const [chatLoaded, setChatLoaded] = useState(false);
  const [uniqueKey, setUniqueKey] = useState("");
  const [checkOption, setCheckOption] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatRefine, setChatRefine] = useState<
    { label: string; description: string }[]
  >([]);
  const [chatRefineQuestion, setChatRefineQuestion] = useState("");
  const [sessionId, setSessionId] = useState("");

  //모달 오픈
  useEffect(() => {
    setIsModalOpen(true);
    const generatedKey = Math.random().toString(36).substring(2, 11);
    setSessionId(generatedKey);
  }, []);

  //채팅관련
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

  // 대화턴 기준 분기
  const [turnCount, setTurnCount] = useState(0);
  // 버튼 비활성화
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const generatedKey = Math.random().toString(36).substring(2, 11);
    setUniqueKey(generatedKey);
  }, [nameMatch]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    setTypingText("");
    // 메시지 챗리스트 인덱스갯수 카운트 후 하나일때는 챗봇  인풋넣는칸 안보이게 한뒤 넥스트 버튼 활성화 스테이트 생성 넥스트 활성화 이후엔 다시 인풋
    setChatList({
      chatType: "user",
      name: "You",
      text: chatInput
    });

    const currentMessage = chatInput;
    setChatInput("");
    const chatCountList = useChatListStore.getState().chatList;
    console.log("chatList after sending message:", chatCountList);

    try {
      setTypingText("I am trying to approach your question philosophically...");
      const payload = {
        message: currentMessage.toLowerCase()
      };
      const response = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/refine/",
        payload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Message sent:", response);
      // 응답이 있다면 챗봇 메시지도 추가
      if (response.data) {
        setChatLoaded(false);
        setTypingText(
          "What topic would you like to listen to philosophers discuss?"
        );
        setChatRefine(response.data.perspectives);
        setTurnCount(1);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // 에러 메시지를 사용자에게 표시
    }
  };

  //두번째 캐릭터 선정 질문 선택 시 작동
  const handleSecondCharacterSelect = async (index: number) => {
    setTurnCount(100);
    try {
      const payload = {
        message: chatRefine[index - 1]?.description
      };
      setChatRefineQuestion(
        chatRefine[index - 1]?.description
          ? chatRefine[index - 1]?.description
          : ""
      );

      //여기서 채팅인풋창 비활성화 시키고, next버튼 활성화 시키는 로직 추가
      const response = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/match/",
        payload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      if (
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        response.data
      ) {
        console.log("Match Response:", response);
        setCharacterA(response.data.match[0]);
        setCharacterB(response.data.match[1]);
        setCharacterC(response.data.match[2]);
        setCharacterD(response.data.match[3]);
        setCharacterE(response.data.match[4]);
        setTypingText(``);
        setTurnCount(99);
      }
    } catch (error) {}
  };

  //카운트 2 첫 철학자 메세지 보내기
  const firstPhilosopherMessage = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A 타이핑 효과 초기화
    setCharacterATypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: characterA.toLowerCase(),
        trigger_type: "opening"
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(3);
        // 약간의 지연 후 타이핑 효과 시작
        setTimeout(() => {
          setCharacterATypingText(debateResponse.data.content);
        }, 100);
        setChatList({
          chatType: "assistant",
          name: characterA,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 3 두번째 철학자 메세지 보내기
  const secondPhilosopherMessage = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // B 타이핑 효과 초기화
    setCharacterBTypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        opening: chatList[1]?.text,
        current_philosopher: characterB.toLowerCase(),
        trigger_type: "cross-exam"
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(5);
        setChatList({
          chatType: "assistant",
          name: characterB,
          text: debateResponse?.data.content
        });
        setCharacterBTypingText(`${debateResponse?.data.content}`);
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 6 첫번째 철학자 메세지 보내기
  const firstPhilosopherRebuttalMessage = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A 타이핑 효과 초기화
    setCharacterATypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: characterA.toLowerCase(),
        trigger_type: "answer",
        questioner: "opponent",
        question: `${chatList[2].text}`
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(7);
        setTimeout(() => {
          setCharacterATypingText(debateResponse.data.content);
        }, 100);
        setChatList({
          chatType: "assistant",
          name: characterA,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 9 두번째 철학자 다시 질문
  const secondPhilosopherRebuttalMessage = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // B 타이핑 효과 초기화
    setCharacterBTypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        opening: chatList[1]?.text,
        current_philosopher: characterB.toLowerCase(),
        trigger_type: "cross-exam"
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(9);
        // 약간의 지연 후 타이핑 효과 시작
        setTimeout(() => {
          setCharacterBTypingText(`${debateResponse?.data.content}`);
        }, 1000);
        setChatList({
          chatType: "assistant",
          name: characterB,
          text: debateResponse?.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 10 첫번째의 재답변
  const firstPhilosopherRebuttalResponse = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A 타이핑 효과 초기화
    setCharacterATypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: characterA.toLowerCase(),
        trigger_type: "answer",
        questioner: "opponent",
        question: `${chatList[4].text}`
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(11);
        setTimeout(() => {
          setCharacterATypingText(debateResponse.data.content);
        }, 100);
        setChatList({
          chatType: "assistant",
          name: characterA,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 11 두번째 철학자 첫 오프닝
  const secondPhilosopherOpeningMessage = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A 타이핑 효과 초기화
    setCharacterBTypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: characterB.toLowerCase(),
        trigger_type: "opening"
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(13);
        // 약간의 지연 후 타이핑 효과 시작
        setTimeout(() => {
          setCharacterBTypingText(debateResponse.data.content);
        }, 100);
        setChatList({
          chatType: "assistant",
          name: characterB,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 14 첫번째 철학자 교차질문 1번
  const firstPhilosopherRebuttalQuestion = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A 타이핑 효과 초기화
    setCharacterATypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        opening: chatList[6]?.text,
        current_philosopher: characterA.toLowerCase(),
        trigger_type: "cross-exam"
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(15);
        // 약간의 지연 후 타이핑 효과 시작
        setTimeout(() => {
          setCharacterATypingText(`${debateResponse?.data.content}`);
        }, 1000);
        setChatList({
          chatType: "assistant",
          name: characterA,
          text: debateResponse?.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 16 두번째 철학자가 교차질문에 대답
  const secondPhilosopherRebuttalResponse = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // B 타이핑 효과 초기화
    setCharacterBTypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: characterB.toLowerCase(),
        trigger_type: "answer",
        questioner: "opponent",
        question: `${chatList[7].text}`
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(17);
        setTimeout(() => {
          setCharacterBTypingText(debateResponse.data.content);
        }, 100);
        setChatList({
          chatType: "assistant",
          name: characterB,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 18 첫번째 교차질문 2번
  const firstPhilosopherRebuttalQuestion2 = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A 타이핑 효과 초기화
    setCharacterATypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        opening: chatList[6]?.text,
        current_philosopher: characterA.toLowerCase(),
        trigger_type: "cross-exam"
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(19);
        // 약간의 지연 후 타이핑 효과 시작
        setTimeout(() => {
          setCharacterATypingText(`${debateResponse?.data.content}`);
        }, 1000);
        setChatList({
          chatType: "assistant",
          name: characterA,
          text: debateResponse?.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 20 두번째 철학자가 교차질문에 대답
  const secondPhilosopherRebuttalResponse2 = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // B 타이핑 효과 초기화
    setCharacterBTypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: characterB.toLowerCase(),
        trigger_type: "answer",
        questioner: "opponent",
        question: `${chatList[9].text}`
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(21);
        setTimeout(() => {
          setCharacterBTypingText(debateResponse.data.content);
        }, 100);
        setChatList({
          chatType: "assistant",
          name: characterB,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //리부탈 캐릭터 세팅 기존 대화 이어갈 캐릭
  const [rebuttalCharacter, setRebuttalCharacter] = useState("");
  //바뀐 리부탈 캐릭터 세팅
  const [changeRebuttalCharacterA, setChangeRebuttalCharacterA] = useState("");
  const [changeRebuttalCharacterB, setChangeRebuttalCharacterB] = useState("");

  //리부탈 대화 인풋 세팅
  const [rebuttalInput, setRebuttalInput] = useState("");

  //카운트 70번대 리부탈 인풋 교차질문 생성
  const userRebuttalQuestionInput = async () => {
    setTypingText("");
    // A,B 타이핑 효과 초기화
    setCharacterATypingText("");
    setCharacterBTypingText("");
    //유저 메세지 챗리스트에 추가
    setChatList({
      chatType: "user",
      name: "You",
      text: rebuttalInput
    });

    try {
      const debatePayload = {
        philosopher:
          rebuttalCharacter === characterA
            ? changeRebuttalCharacterB.toLowerCase()
            : changeRebuttalCharacterA.toLowerCase(),

        message: `${rebuttalInput}`
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/refine_one/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(72);
        setChatList({
          chatType: "assistant",
          name:
            rebuttalCharacter === characterA
              ? changeRebuttalCharacterB
              : changeRebuttalCharacterA,
          text: debateResponse?.data.content
        });
        if (rebuttalCharacter === characterA) {
          setCharacterBTypingText(debateResponse?.data.content);
        } else {
          setCharacterATypingText(debateResponse?.data.content);
        }
        setRebuttalInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //리부탈 다이렉트 메세지 세팅
  const [rebuttalDirectMessage, setRebuttalDirectMessage] = useState("");
  //리부탈 다이렉트 메세지 보내기
  const rebuttalDirectMessageSend = async () => {
    setTypingText("");
    // A,B 타이핑 효과 초기화
    setCharacterATypingText("");
    setCharacterBTypingText("");
    //유저 메세지 챗리스트에 추가
    setChatList({
      chatType: "user",
      name: "You",
      text: rebuttalDirectMessage
    });

    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: rebuttalCharacter.toLowerCase(),
        trigger_type: "answer",
        questioner: "user",
        question: `${rebuttalDirectMessage}`
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(22);
        if (rebuttalCharacter === characterA) {
          setTimeout(() => {
            setCharacterATypingText(debateResponse.data.content);
          }, 100);
        } else {
          setTimeout(() => {
            setCharacterBTypingText(debateResponse.data.content);
          }, 100);
        }
        setChatList({
          chatType: "assistant",
          name: rebuttalCharacter,
          text: debateResponse.data.content
        });
        setRebuttalDirectMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 72번대 원래 철학자 대답
  const originalPhilosopherAnswer = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A,B 타이핑 효과 초기화
    setCharacterBTypingText("");
    setCharacterATypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: rebuttalCharacter.toLowerCase(),
        trigger_type: "answer",
        questioner: "user",
        question: `${chatList[chatList.length - 1].text}`
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(22);
        if (rebuttalCharacter === characterA) {
          setTimeout(() => {
            setCharacterATypingText(debateResponse.data.content);
          }, 100);
          setChangeRebuttalCharacterB(characterB);
        } else {
          setTimeout(() => {
            setCharacterBTypingText(debateResponse.data.content);
          }, 100);
          setChangeRebuttalCharacterA(characterA);
        }
        setChatList({
          chatType: "assistant",
          name: rebuttalCharacter,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 90번대 토론 종료
  const endDebate = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A,B 타이핑 효과 초기화
    setCharacterBTypingText("");
    setCharacterATypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: characterA.toLowerCase(),
        trigger_type: "closing"
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(89);

        setCharacterATypingText(debateResponse.data.content);

        setChatList({
          chatType: "assistant",
          name: characterA,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //카운트 90번대 두번째 철학자 클로징
  const endSecondDebate = async () => {
    setIsButtonDisabled(true);
    setTypingText("");
    // A,B 타이핑 효과 초기화
    setCharacterBTypingText("");
    setCharacterATypingText("");
    try {
      const debatePayload = {
        session_id: sessionId,
        topic: chatRefineQuestion.toLowerCase(),
        current_philosopher: characterB.toLowerCase(),
        trigger_type: "closing"
      };
      const debateResponse = await axios.post(
        "https://ballistic-hortencia-resurrectional.ngrok-free.dev/debate/",
        debatePayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Debate Response:", debateResponse);
      if (
        debateResponse &&
        debateResponse.status >= 200 &&
        debateResponse.status < 300 &&
        debateResponse.data
      ) {
        setTurnCount(91);

        setCharacterBTypingText(debateResponse.data.content);

        setChatList({
          chatType: "assistant",
          name: characterB,
          text: debateResponse.data.content
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //채팅리스트 스크롤
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  //타이핑 효과
  const [typingText, setTypingText] = useState("");
  const [displayedTyping, setDisplayedTyping] = useState(
    typingText ? typingText : ""
  );
  const typingIndexRef = useRef(0);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // clear any running timer
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    // if empty, reset displayed text
    if (!typingText) {
      typingIndexRef.current = 0;
      setDisplayedTyping("");
      return;
    }

    // start typing animation
    typingIndexRef.current = 0;
    setDisplayedTyping("");

    const typeNext = () => {
      const next = typingIndexRef.current + 1;
      setDisplayedTyping(typingText.slice(0, next));
      typingIndexRef.current = next;

      if (next < typingText.length) {
        typingTimerRef.current = window.setTimeout(typeNext, 20); // char interval (ms)
      } else {
        typingTimerRef.current = null;
      }
    };

    typingTimerRef.current = window.setTimeout(typeNext, 20); // initial delay

    return () => {
      if (typingTimerRef.current !== null) {
        window.clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [typingText]);

  //캐릭터 A 타이핑 효과
  const [characterATypingText, setCharacterATypingText] = useState("");
  const [displayedCharacterATyping, setDisplayedCharacterATyping] =
    useState("");
  const characterATypingIndexRef = useRef(0);
  const characterATypingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // clear any running timer
    if (characterATypingTimerRef.current !== null) {
      window.clearTimeout(characterATypingTimerRef.current);
      characterATypingTimerRef.current = null;
    }

    // if empty, reset displayed text
    if (!characterATypingText) {
      characterATypingIndexRef.current = 0;
      setDisplayedCharacterATyping("");
      return;
    }

    // start typing animation
    characterATypingIndexRef.current = 0;
    setDisplayedCharacterATyping("");

    const typeNext = () => {
      const next = characterATypingIndexRef.current + 1;
      setDisplayedCharacterATyping(characterATypingText.slice(0, next));
      characterATypingIndexRef.current = next;

      if (next < characterATypingText.length) {
        characterATypingTimerRef.current = window.setTimeout(typeNext, 40); // char interval (ms)
      } else {
        characterATypingTimerRef.current = null;
      }
    };

    characterATypingTimerRef.current = window.setTimeout(typeNext, 70); // initial delay

    return () => {
      if (characterATypingTimerRef.current !== null) {
        window.clearTimeout(characterATypingTimerRef.current);
        characterATypingTimerRef.current = null;
      }
    };
  }, [characterATypingText]);

  //캐릭터 B 타이핑 효과
  const [characterBTypingText, setCharacterBTypingText] = useState("");
  const [displayedCharacterBTyping, setDisplayedCharacterBTyping] =
    useState("");
  const characterBTypingIndexRef = useRef(0);
  const characterBTypingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // clear any running timer
    if (characterBTypingTimerRef.current !== null) {
      window.clearTimeout(characterBTypingTimerRef.current);
      characterBTypingTimerRef.current = null;
    }

    // if empty, reset displayed text
    if (!characterBTypingText) {
      characterBTypingIndexRef.current = 0;
      setDisplayedCharacterBTyping("");
      return;
    }

    // start typing animation
    characterBTypingIndexRef.current = 0;
    setDisplayedCharacterBTyping("");

    const typeNext = () => {
      const next = characterBTypingIndexRef.current + 1;
      setDisplayedCharacterBTyping(characterBTypingText.slice(0, next));
      characterBTypingIndexRef.current = next;

      if (next < characterBTypingText.length) {
        characterBTypingTimerRef.current = window.setTimeout(typeNext, 40); // char interval (ms)
      } else {
        characterBTypingTimerRef.current = null;
      }
    };

    characterBTypingTimerRef.current = window.setTimeout(typeNext, 70); // initial delay

    return () => {
      if (characterBTypingTimerRef.current !== null) {
        window.clearTimeout(characterBTypingTimerRef.current);
        characterBTypingTimerRef.current = null;
      }
    };
  }, [characterBTypingText]);

  return (
    <>
      <div className={cn("arena-container")}>
        <GnbBar />
        <div className={cn("chat-content-body")}>
          <div className={cn("arena-bar")} />
          <div className={cn("chat-competition-body")}>
            <div className={cn("chat-competition-conversation")}>
              <div className={cn("chat-competition-header")}>
                <h2>Conversation</h2>
              </div>
              <div className={cn("chat-sorting-options")}>
                <label className={cn("radio-option")}>
                  <input
                    type="radio"
                    name="sortOrder"
                    value="user"
                    onClick={(e) => {
                      const input = e.currentTarget as HTMLInputElement;
                      const group = document.getElementsByName(
                        "sortOrder"
                      ) as NodeListOf<HTMLInputElement>;
                      if (input.dataset.checked === "true") {
                        setCheckOption("");
                        input.checked = false;
                        input.dataset.checked = "false";
                      } else {
                        setCheckOption("user");
                        group.forEach(
                          (i) =>
                            (i.dataset.checked = i === input ? "true" : "false")
                        );
                      }
                    }}
                  />
                  <span>MY</span>
                </label>
                <label className={cn("radio-option")}>
                  <input
                    type="radio"
                    name="sortOrder"
                    value="assistant"
                    onClick={(e) => {
                      const input = e.currentTarget as HTMLInputElement;
                      const group = document.getElementsByName(
                        "sortOrder"
                      ) as NodeListOf<HTMLInputElement>;
                      if (input.dataset.checked === "true") {
                        setCheckOption("");
                        input.checked = false;
                        input.dataset.checked = "false";
                      } else {
                        setCheckOption("assistant");
                        group.forEach(
                          (i) =>
                            (i.dataset.checked = i === input ? "true" : "false")
                        );
                      }
                    }}
                  />
                  <span>SOPHYBARA</span>
                </label>
              </div>
              <div className={cn("chat-competition-chat-list")}>
                {Array.isArray(chatList) && chatList.length > 0 ? (
                  chatList.map((chatItem, index) => (
                    <div
                      key={index}
                      className={cn("competition-chat-item", {
                        blur:
                          (checkOption === "user" &&
                            (chatItem as any).name !== "You") ||
                          (checkOption === "assistant" &&
                            (chatItem as any).name === "You")
                      })}
                    >
                      <div className={cn("competition-chat-item-header")}>
                        <div
                          className={cn(
                            "competition-chat-item-avatar",
                            (chatItem as any).name
                          )}
                        />
                        <span>{(chatItem as any).name}</span>
                      </div>
                      <div className={cn("chat-item-body")}>
                        {(chatItem as any).text}
                      </div>
                    </div>
                  ))
                ) : Array.isArray(chatList) && chatList.length === 0 ? (
                  <div className={cn("non-chat")}>
                    There is no conversation yet.
                  </div>
                ) : null}
              </div>
            </div>
            <div className={cn("chat-competition-view")}>
              <div className={cn("chat-competition-chatbox")}>
                <div className={cn("chat-competition-chatbox-left")}>
                  <div className={cn("chat-competition-top-deco", "left")}>
                    <div className={cn("chat-competition-top-deco-status")}>
                      <span
                        className={cn("status", {
                          active: arenaStatus === "Constructive"
                        })}
                      >
                        Constructive
                      </span>
                      <span>...</span>
                      <span
                        className={cn("status", {
                          active: arenaStatus === "rebuttal"
                        })}
                      >
                        Rebuttal
                      </span>
                      <span>...</span>
                      <span
                        className={cn("status", {
                          active: arenaStatus === "closing"
                        })}
                      >
                        Closing
                      </span>
                    </div>
                  </div>
                  <div className={cn("chat-competition-top-sub-deco")} />
                  <div className={cn("chat-box")}>
                    {/* 이후 바뀌는 캐릭터 추가 */}
                    {changeRebuttalCharacterA ? (
                      <div
                        className={cn(
                          "chat-box-character",
                          changeRebuttalCharacterA
                        )}
                      >
                        {changeRebuttalCharacterA}
                      </div>
                    ) : characterA ? (
                      <div className={cn("chat-box-character", characterA)}>
                        {characterA}
                      </div>
                    ) : (
                      <div className={cn("chat-box-character")}>
                        SOPHYBARA A
                      </div>
                    )}
                    {/* {characterA ? (
                      <div className={cn("chat-box-character")}>
                        {characterA}
                      </div>
                    ) : (
                      <div className={cn("chat-box-character")}>
                        {characterA ? characterA : "SOPHYBARA A"}
                      </div>
                    )} */}
                    <div
                      className={cn(
                        "chat-box-textarea",
                        displayedCharacterATyping && "typing",
                        changeRebuttalCharacterA
                          ? changeRebuttalCharacterA
                          : characterA
                            ? characterA
                            : null
                      )}
                    >
                      {turnCount >= 1 && (
                        <span>{displayedCharacterATyping}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={cn("chat-competition-chatbox-center")} />
                <div className={cn("chat-competition-chatbox-right")}>
                  <div className={cn("chat-competition-top-deco")} />
                  <div className={cn("chat-competition-top-sub-deco")} />
                  <div className={cn("chat-box")}>
                    {/* 이후 바뀌는 캐릭터 추가 */}
                    {changeRebuttalCharacterB ? (
                      <div
                        className={cn(
                          "chat-box-character",
                          changeRebuttalCharacterB
                        )}
                      >
                        {changeRebuttalCharacterB}
                      </div>
                    ) : characterB ? (
                      <div className={cn("chat-box-character", characterB)}>
                        {characterB}
                      </div>
                    ) : (
                      <div className={cn("chat-box-character")}>
                        SOPHYBARA B
                      </div>
                    )}

                    {/* {characterB ? (
                      <div className={cn("chat-box-character")}>
                        {characterB}
                      </div>
                    ) : (
                      <div className={cn("chat-box-character")}>
                        {characterB ? characterB : "SOPHYBARA B"}
                      </div>
                    )} */}

                    <div
                      className={cn(
                        "chat-box-textarea",
                        displayedCharacterBTyping && "typing",
                        changeRebuttalCharacterB
                          ? changeRebuttalCharacterB
                          : characterB
                            ? characterB
                            : null
                      )}
                    >
                      {turnCount >= 3 && (
                        <span>{displayedCharacterBTyping}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={cn("chat-competition-footer")}>
                {characterA && (
                  <div
                    className={cn(
                      "chat-competition-left-character",
                      changeRebuttalCharacterA
                        ? changeRebuttalCharacterA
                        : characterA
                          ? characterA
                          : null
                    )}
                  />
                )}

                <div className={cn("moderator")}>
                  {typingText && !isModalOpen && (
                    <div
                      className={cn("chat-competition-chatbox-center-content")}
                    >
                      <h3>Moderator</h3>
                      <span>{displayedTyping}</span>
                    </div>
                  )}
                </div>
                {characterB && (
                  <div
                    className={cn(
                      "chat-competition-right-character",
                      changeRebuttalCharacterB
                        ? changeRebuttalCharacterB
                        : characterB
                          ? characterB
                          : null
                    )}
                  />
                )}

                {turnCount === 1 && (
                  <div className={cn("chat-refine-options")}>
                    {chatRefine.map((item: any, index: number) => (
                      <div key={index} className={cn("chat-refine-option")}>
                        <div className={cn("chat-refine-option-index")}>
                          0{index + 1}
                        </div>
                        <div className={cn("chat-refine-option-text")}>
                          <span className={cn("chat-refine-option-label")}>
                            {item.label}
                          </span>
                          <span
                            className={cn("chat-refine-option-description")}
                          >
                            {item.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={cn("chat-competition-input-box")}>
                {turnCount === 0 && (
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
                )}
                {turnCount === 99 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(2);
                        setTypingText(
                          "First philosopher, please present your constructive statement!"
                        );
                      }}
                    >
                      Go to constructive
                    </button>
                  </div>
                )}
                {/* 턴카운트 css재설정 */}
                {/* 1사이클 */}
                {turnCount === 1 && (
                  <div className={cn("refine-button-container")}>
                    {chatRefine.map((item: any, index: number) => (
                      <button
                        key={index}
                        className={cn("refine-button")}
                        onClick={() => {
                          setChatInput(item);
                          setTypingText(
                            `Philosophers are entering the arena to debate your question...`
                          );
                          // 이 부분 로직 구현 시작 해야됨 - 질문 넣고 매칭 2마리 잡기
                          handleSecondCharacterSelect(index + 1);
                        }}
                      >
                        0{index + 1}
                      </button>
                    ))}
                  </div>
                )}
                {turnCount === 2 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        firstPhilosopherMessage();
                      }}
                    >
                      First constructive statement
                    </button>
                  </div>
                )}
                {turnCount === 3 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(4);
                        setCharacterATypingText("");
                        setTypingText(
                          `Second philosopher, your question for the constructive statement!`
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 4 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        secondPhilosopherMessage();
                      }}
                    >
                      Second philosopher’s question 1
                    </button>
                  </div>
                )}
                {turnCount === 5 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(6);
                        setCharacterBTypingText("");
                        setTypingText(
                          "First philosopher, Please answer the question about your opening!"
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 6 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        firstPhilosopherRebuttalMessage();
                      }}
                    >
                      First philosopher’s answer 1
                    </button>
                  </div>
                )}
                {turnCount === 7 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(8);
                        setCharacterATypingText("");
                        setTypingText(
                          "Second philosopher, give one more question about answer"
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 8 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        secondPhilosopherRebuttalMessage();
                      }}
                    >
                      Second philosopher’s question 2
                    </button>
                  </div>
                )}
                {turnCount === 9 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(10);
                        setCharacterBTypingText("");
                        setTypingText(
                          "First philosopher, please answer one more question!"
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 10 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        firstPhilosopherRebuttalResponse();
                      }}
                    >
                      First philosopher’s answer 2
                    </button>
                  </div>
                )}
                {/* 1사이클 */}
                {/* 2사이클 */}
                {turnCount === 11 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(12);
                        setCharacterATypingText("");
                        setTypingText(
                          "Second philosopher, your question for the construcive statement!"
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 12 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        secondPhilosopherOpeningMessage();
                      }}
                    >
                      Second constructive statement
                    </button>
                  </div>
                )}
                {turnCount === 13 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(14);
                        setCharacterBTypingText("");
                        setTypingText(
                          "First philosopher, your question for the constructive statement!"
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 14 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        firstPhilosopherRebuttalQuestion();
                      }}
                    >
                      First philosopher’s question 1
                    </button>
                  </div>
                )}
                {turnCount === 15 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(16);
                        setCharacterATypingText("");
                        setTypingText(
                          "Second philosopher, Please answer the question about opening!"
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 16 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        secondPhilosopherRebuttalResponse();
                      }}
                    >
                      Second philosopher’s answer 1
                    </button>
                  </div>
                )}
                {turnCount === 17 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(18);
                        setCharacterBTypingText("");
                        setTypingText(
                          "First philosopher, give one more question about answer!"
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 18 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        firstPhilosopherRebuttalQuestion2();
                      }}
                    >
                      First philosopher’s question 2
                    </button>
                  </div>
                )}
                {turnCount === 19 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(20);
                        setCharacterATypingText("");
                        setTypingText(
                          "Second philosopher, please answer one more question!"
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 20 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        secondPhilosopherRebuttalResponse2();
                      }}
                    >
                      Second philosopher’s answer 2
                    </button>
                  </div>
                )}
                {turnCount === 21 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(22);
                        setCharacterBTypingText("");
                        setTypingText("Userbara, do you have any questions?");
                        setArenaStatus("rebuttal");
                      }}
                    >
                      Go to Rebuttal
                    </button>
                  </div>
                )}
                {turnCount === 22 && (
                  <div className={cn("refine-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(23);
                        setTypingText(
                          "Which philosopher do you want to ask question?"
                        );
                        setCharacterATypingText("");
                        setCharacterBTypingText("");
                      }}
                    >
                      Yes, I Have a question
                    </button>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(88);
                        setCharacterATypingText("");
                        setCharacterBTypingText("");
                        setTypingText(
                          "Now for closing statements! First philosopher, please begin."
                        );
                        setArenaStatus("closing");
                      }}
                    >
                      No, Go to Closing
                    </button>
                  </div>
                )}
                {turnCount === 23 && (
                  <div className={cn("refine-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(24);
                        setRebuttalCharacter(characterA);
                        setTypingText(
                          `Which method would you like to ask philosophers?`
                        );
                      }}
                    >
                      {characterA}
                    </button>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(24);
                        setRebuttalCharacter(characterB);
                        setTypingText(
                          `Which method would you like to ask philosophers?`
                        );
                      }}
                    >
                      {characterB}
                    </button>
                  </div>
                )}
                {turnCount === 24 && (
                  <div className={cn("refine-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(25);
                      }}
                    >
                      Directly
                    </button>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        // 70번대로 캐릭 재선택
                        setTurnCount(70);
                      }}
                    >
                      Ask via the sophybara
                    </button>
                  </div>
                )}
                {/* 그냥 다이렉트 메세지 진행 */}
                {turnCount === 25 && (
                  <div className={cn("chat-footer")}>
                    <input
                      type="text"
                      placeholder="Ask anything"
                      value={rebuttalDirectMessage}
                      onChange={(e) => setRebuttalDirectMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          rebuttalDirectMessageSend();
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        rebuttalDirectMessageSend();
                      }}
                    >
                      <div className={cn("send-button")} />
                    </button>
                  </div>
                )}
                {/* 그냥 다이렉트 메세지 진행 */}

                {/* 70번 캐릭터 재선택 분기 */}
                {turnCount === 70 && (
                  <div className={cn("refine-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(71);
                        rebuttalCharacter === characterA
                          ? setChangeRebuttalCharacterB(characterC)
                          : setChangeRebuttalCharacterA(characterC);
                        setTypingText(
                          "Great! Through whom would you like to ask your question?"
                        );
                      }}
                    >
                      {characterC}
                    </button>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(71);
                        rebuttalCharacter === characterA
                          ? setChangeRebuttalCharacterB(characterD)
                          : setChangeRebuttalCharacterA(characterD);
                        setTypingText(
                          "Great! Through whom would you like to ask your question?"
                        );
                      }}
                    >
                      {characterD}
                    </button>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setTurnCount(71);
                        rebuttalCharacter === characterA
                          ? setChangeRebuttalCharacterB(characterE)
                          : setChangeRebuttalCharacterA(characterE);
                        setTypingText(
                          "Great! Through whom would you like to ask your question?"
                        );
                      }}
                    >
                      {characterE}
                    </button>
                  </div>
                )}
                {/* 70번 캐릭터 재선택 분기 */}
                {/* 71~ 반복 */}
                {turnCount === 71 && (
                  <div className={cn("chat-footer")}>
                    <input
                      type="text"
                      placeholder="Ask anything"
                      value={rebuttalInput}
                      onChange={(e) => setRebuttalInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          userRebuttalQuestionInput();
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        userRebuttalQuestionInput();
                      }}
                    >
                      <div className={cn("send-button")} />
                    </button>
                  </div>
                )}
                {turnCount === 72 && (
                  <div className={cn("next-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        originalPhilosopherAnswer();
                      }}
                    >
                      Philosopher’s answer
                    </button>
                  </div>
                )}
                {turnCount === 88 && (
                  <div className={cn("refine-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        endDebate();
                      }}
                    >
                      First philosopher’s closing
                    </button>
                  </div>
                )}
                {turnCount === 89 && (
                  <div className={cn("refine-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setCharacterATypingText("");
                        setTurnCount(90);
                        setTypingText(
                          "Second philosopher, please share your closing statement."
                        );
                      }}
                    >
                      Move to moderator
                    </button>
                  </div>
                )}
                {turnCount === 90 && (
                  <div className={cn("refine-button-container")}>
                    <button
                      className={cn("next-button")}
                      disabled={isButtonDisabled}
                      onClick={() => {
                        endSecondDebate();
                      }}
                    >
                      Second philosopher’s closing
                    </button>
                  </div>
                )}
                {turnCount === 91 && (
                  <div className={cn("refine-button-container")}>
                    <button
                      className={cn("next-button")}
                      onClick={() => {
                        setCharacterBTypingText("");
                        setTypingText(
                          "This concludes our debate. Thank you for joining us in the arena."
                        );
                        window.setTimeout(() => {
                          setIsEndModalOpen(true);
                        }, 3500);
                      }}
                    >
                      Arena End!
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StartModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        setTypingText={setTypingText}
      />
      <EndModal isOpen={isEndModalOpen} setIsOpen={setIsEndModalOpen} />
    </>
  );
};

export default Arena;
