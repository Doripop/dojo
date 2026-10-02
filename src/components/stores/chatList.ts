import { create } from "zustand";

export interface ChattingType {
  name: string | null;
  text: string | null;
  chatType: "user" | "assistant";
}

export interface ChatListTypes {
  chatList: ChattingType[];
  setChatList: (value: ChattingType) => void;
  resetChatList: () => void;
}

const useChatListStore = create<ChatListTypes>((set) => ({
  chatList: [],
  setChatList: (newChat: ChattingType) =>
    set((state) => ({
      chatList: [...state.chatList, newChat]
    })),
  resetChatList: () => set({ chatList: [] })
}));

export { useChatListStore };
