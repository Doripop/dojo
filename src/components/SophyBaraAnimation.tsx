import React, { useEffect, useRef, useState } from "react";

import BG_URL from "../assets/image/sophybara_background.png";
import CHAR_RIGHT_1 from "../assets/image/capy_right_1.png";
import CHAR_RIGHT_2 from "../assets/image/capy_right_2.png";
import CHAR_LEFT_1 from "../assets/image/capy_right_1.png";
import CHAR_LEFT_2 from "../assets/image/capy_right_2.png";
import GuideModal from "./GuideModal";

const GROUND_Y = Math.round(window.innerHeight * 0.96); // 바닥선(원하면 0.88~0.98 사이로)
const SPEED = 200; // 이동 속도(px/s)
const FRICTION = 0.88; // 감속
const MIN_X = 60;
const MAX_X = window.innerWidth - 100;

const ANIM_FPS = 8; // 초당 8프레임(2프레임이라 0/1 번갈아가며 토글)
const ANIM_INTERVAL = 1000 / ANIM_FPS;

const SophyBaraAnimation = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLImageElement>(null);

  const posX = useRef(MIN_X);
  const velX = useRef(0);
  const keys = useRef({ left: false, right: false });
  const lastTs = useRef<number | null>(null);

  const [dir, setDir] = useState<1 | -1>(1); // 1: 오른쪽, -1: 왼쪽
  const [isAtEnd, setIsAtEnd] = useState(false); // 화면 끝 도달 상태
  const frameIdx = useRef(0); // 0 또는 1
  const lastAnim = useRef(0);

  // 프레임 집합
  const RIGHT_FRAMES = [CHAR_RIGHT_1, CHAR_RIGHT_2];
  const LEFT_FRAMES = [CHAR_LEFT_1, CHAR_LEFT_2];

  // 이미지 미리 디코딩
  useEffect(() => {
    (async () => {
      const all = [BG_URL, ...RIGHT_FRAMES, ...LEFT_FRAMES].map((src) => {
        const img = new Image();
        img.src = src as string;
        return img.decode?.().catch(() => {});
      });
      await Promise.all(all);
    })();
  }, []);

  // 키 입력
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // 모달이 열려있으면 키 입력 무시
      if (isAtEnd) return;

      if (["ArrowLeft", "a", "A"].includes(e.key)) {
        keys.current.left = true;
        setDir(-1);
      }
      if (["ArrowRight", "d", "D"].includes(e.key)) {
        keys.current.right = true;
        setDir(1);
      }
    };
    const up = (e: KeyboardEvent) => {
      // 모달이 열려있으면 키 입력 무시
      if (isAtEnd) return;

      if (["ArrowLeft", "a", "A"].includes(e.key)) keys.current.left = false;
      if (["ArrowRight", "d", "D"].includes(e.key)) keys.current.right = false;
    };
    const blur = () => {
      keys.current.left = keys.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [isAtEnd]); // isAtEnd 상태 변경시 이벤트 리스너 재등록
  // 메인 루프
  useEffect(() => {
    const el = charRef.current;
    if (!el) return;

    // 고정 스타일
    el.style.position = "absolute";
    el.style.width = "128px";
    el.style.height = "128px";
    el.style.willChange = "transform";
    el.style.imageRendering = "crisp-edges";
    el.style.transformOrigin = "center bottom";

    // 초기 프레임
    el.src = RIGHT_FRAMES[0];

    const step = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = (ts - lastTs.current) / 1000;
      lastTs.current = ts;

      // 입력 → 가속 (모달이 열려있으면 움직임 정지)
      let ax = 0;
      if (!isAtEnd) {
        if (keys.current.left) ax -= SPEED;
        if (keys.current.right) ax += SPEED;
      }

      // 속도/감속
      velX.current += ax * dt;
      if ((!keys.current.left && !keys.current.right) || isAtEnd)
        velX.current *= FRICTION;
      if (Math.abs(velX.current) < 0.1) velX.current = 0;

      // 위치
      const newPosX = Math.max(
        MIN_X,
        Math.min(MAX_X, posX.current + velX.current * dt)
      );
      posX.current = newPosX;

      // 화면 끝 도달 체크
      const shouldBeAtEnd = newPosX >= MAX_X - 60;
      if (shouldBeAtEnd !== isAtEnd) {
        setIsAtEnd(shouldBeAtEnd);
        // 모달이 열리거나 닫힐 때 키 상태 초기화
        if (shouldBeAtEnd) {
          keys.current.left = keys.current.right = false;
        }
      }

      // 프레임 토글(움직일 때만)
      const moving = Math.abs(velX.current) > 1;
      if (moving) {
        if (ts - lastAnim.current >= ANIM_INTERVAL) {
          lastAnim.current = ts;
          frameIdx.current = (frameIdx.current ^ 1) as 0 | 1; // 0/1 토글
          const frames = dir === 1 ? RIGHT_FRAMES : LEFT_FRAMES;
          if (el.src !== frames[frameIdx.current])
            el.src = frames[frameIdx.current];
        }
      } else {
        // 정지 시 항상 0번 프레임
        frameIdx.current = 0;
        const frames = dir === 1 ? RIGHT_FRAMES : LEFT_FRAMES;
        if (el.src !== frames[0]) el.src = frames[0];
      }

      // 렌더: transform만 변경
      el.style.transform = `translate3d(${posX.current}px, ${
        GROUND_Y - 128
      }px, 0) scaleX(${dir})`;

      requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [dir, isAtEnd]); // dir과 isAtEnd 상태 변경시 재시작

  return (
    <div
      ref={stageRef}
      style={{
        width: "100dvw",
        height: "100dvh",
        margin: 0,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <img ref={charRef} alt="capybara" />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "10%",
          transform: "translate(-50%, -10%)",
          padding: "6px 10px",
          background: "rgba(0,0,0,.4)",
          color: "#fff",
          borderRadius: 6,
          fontSize: 12,
          pointerEvents: "none"
        }}
      >
        → 이동, 오른쪽 이동 후 가이드 보기!
      </div>
      {/* 캐릭터가 화면 끝에 도달했을 때 오픈 */}
      <GuideModal setIsOpen={setIsAtEnd} isOpen={isAtEnd} />
    </div>
  );
};

export default SophyBaraAnimation;
