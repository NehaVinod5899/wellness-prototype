import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./screens/Home.jsx";
import Wellbeing from "./screens/Wellbeing.jsx";
import Messages from "./screens/Messages.jsx";
import Community from "./screens/Community.jsx";
import Settings from "./screens/Settings.jsx";

import BottomNav from "./components/BottomNav.jsx";

import Setup from "./screens/Setup.jsx";
import Lock from "./screens/Lock.jsx";

import { api } from "./api";

export default function App() {

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    try {
      const profile = await api.getProfile();

      if (!profile) {
        setStatus("needsSetup");
        return;
      }

      const unlocked =
        sessionStorage.getItem("wellness.unlocked") === "true";

      setStatus(
        profile.pinEnabled && !unlocked
          ? "locked"
          : "ready"
      );

    } catch {
      setStatus("needsSetup");
    }
  }

  if (status === "loading") {
    return (
      <div className="screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "needsSetup") {
    return (
      <Setup
        onComplete={() => setStatus("ready")}
      />
    );
  }

  if (status === "locked") {
    return (
      <Lock
        onUnlock={() => setStatus("ready")}
      />
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wellbeing" element={<Wellbeing />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/community" element={<Community />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <BottomNav />
    </>
  );
}