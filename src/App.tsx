import React from "react";
import logo from "./logo.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import SelectChatPage from "./components/SelectChatPage";
import OnlyChatting from "./components/OnlyChatting";
import SophyBaraAnimation from "./components/SophyBaraAnimation";
import Arena from "./components/Arena";
import NewMainPage from "./components/NewMainPage";

function App() {
  const [isApiKey, setIsApiKey] = React.useState<string | null>(null);
  const [guideCompleted, setGuideCompleted] = React.useState<boolean>(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<SophyBaraAnimation />} /> */}
        {/* <Route path="/main" element={<MainPage />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="/" element={<NewMainPage />} />
        <Route path="/chat" element={<SelectChatPage />} />
        <Route path="/chat/:id" element={<OnlyChatting />} />
        <Route path="/arena" element={<Arena />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
