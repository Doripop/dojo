import React from "react";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/chatBubble.module.scss";
const cn = classNames.bind(style);

interface ChatItemType {
  name: string | null;
  chatType: "user" | "assistant";
  text: string | null;
}

interface ChatItemListType {
  chatItem: ChatItemType;
  characterName?: string;
}

const ChatBubble = ({ chatItem, characterName }: ChatItemListType) => {
  const [displayText, setDisplayText] = React.useState<string>(
    chatItem.text ?? ""
  );

  React.useEffect(() => {
    let cancelled = false;
    // typing effect only for assistant messages; show immediately for user
    if (chatItem.chatType === "assistant" && chatItem.text) {
      setDisplayText("");
      const full = chatItem.text;
      const speed = 30; // ms per character (adjust as desired)
      let idx = 0;
      const id = window.setInterval(() => {
        if (cancelled) return;
        idx++;
        setDisplayText(full.slice(0, idx));
        if (idx >= full.length) {
          window.clearInterval(id);
        }
      }, speed);
      return () => {
        cancelled = true;
        window.clearInterval(id);
      };
    } else {
      setDisplayText(chatItem.text ?? "");
      return;
    }
  }, [chatItem.text, chatItem.chatType]);

  // replace the outgoing text with the typed text for rendering
  chatItem = { ...chatItem, text: displayText };

  return (
    <div className={cn("bubble-box", chatItem.chatType)}>
      <div className={cn("bubble-chat-detail")}>
        {chatItem.chatType === "assistant" && (
          <div
            className={cn(
              "bubble-name",
              (characterName ?? "").toLowerCase().replace(/\s+/g, "")
            )}
          />
        )}
        <div className={cn("bubble")}>
          <p className={cn("bubble-text")}>{chatItem.text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
