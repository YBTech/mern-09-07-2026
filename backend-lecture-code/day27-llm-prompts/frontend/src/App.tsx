import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import StreamingChatPage from "./pages/StreamingChatPage";
import ExtractEventPage from "./pages/ExtractEventPage";
import EvalPage from "./pages/EvalPage";

export default function App() {
  return (
    <>
      <nav>
        <NavLink to="/chat">Chat</NavLink>
        <NavLink to="/chat-stream">Chat (streaming)</NavLink>
        <NavLink to="/extract-event">Extract event</NavLink>
        <NavLink to="/eval">Prompt eval</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/chat" />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat-stream" element={<StreamingChatPage />} />
          <Route path="/extract-event" element={<ExtractEventPage />} />
          <Route path="/eval" element={<EvalPage />} />
        </Routes>
      </main>
    </>
  );
}
