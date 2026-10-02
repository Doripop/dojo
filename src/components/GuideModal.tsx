import React from "react";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/guideModal.module.scss";

const cn = classNames.bind(style);

interface GuideModalProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
}

const GuideModal: React.FC<GuideModalProps> = ({ setIsOpen, isOpen }) => {
  const [apiKey, setApiKey] = React.useState<string | null>(null);
  const handleApiKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    localStorage.setItem("apiKey", e.target.value);
    if (!e.target.value) {
      alert("API Key를 입력해주세요.");
    } else if (e.target.value) {
      window.location.href = "/main";
    }
  };

  return (
    <div className={cn("modal-contain")}>
      {isOpen && (
        <div className={cn("modal-background")}>
          <div className={cn("modal-view")}>
            <div className={cn("modal-header")}>{/* 이미지 넣기 */}</div>
            <div className={cn("modal-body")}>
              <h2>가이드</h2>
              <p>
                소피바라와 대화를 나누는 방법에 대해 안내해드릴게요! <br />
                아래의 간단한 가이드를 참고해주세요.
              </p>
              <h3>
                1. OpenAI 플랫폼 로그인{" "}
                <a href="https://platform.openai.com">
                  (openai platform {">"})
                </a>
              </h3>
              <p>OpenAI 플랫폼에 접속하여 우측 상단에서 로그인하세요.</p>
              <h3>2. 프로필 접속</h3>
              <p>
                OpenAI 플랫폼 우측 상단의 프로필을 클릭한 후 "Your profile"에
                접속하세요.
              </p>
              <h3>3. API Key 생성</h3>
              <p>
                "API Keys" 탭에서 "Create new secret key"를 클릭하여 새로운 API
                Key를 생성하세요.
              </p>
              <h3>4. API Key 복사</h3>
              <p>
                생성된 API Key를 복사한 후, 하단 소피바라에 입력 창에 붙여넣어
                대화를 시작하세요.
              </p>
              <h3>5. 철학자 선택하기</h3>
              <p>
                메인 페이지에서 대화하고 싶은 철학자를 선택하세요. 각 철학자는
                고유한 특성과 대화 스타일을 가지고 있어요.
              </p>
              <h3>6. 질문 입력하기</h3>
              <p>
                선택한 철학자와 대화를 시작하려면 질문을 입력하세요. 철학자들은
                여러분의 질문에 대해 깊이 있는 답변을 제공할 거예요.
              </p>
              <h3>7. 대화 즐기기</h3>
              <p>
                철학자와의 대화를 즐기세요! 다양한 주제에 대해 토론하고, 새로운
                관점을 발견할 수 있을 거예요.
              </p>
            </div>
            <div className={cn("modal-footer")}>
              <input
                type="text"
                placeholder="API Key를 여기에 입력하세요"
                value={apiKey || ""}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                onClick={() => {
                  handleApiKeyInput({
                    target: { value: apiKey }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                입력하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideModal;
