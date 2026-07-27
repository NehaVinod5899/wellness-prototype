import { Routes, Route } from 'react-router-dom';
import Home from './screens/Home.jsx';
import Wellbeing from './screens/Wellbeing.jsx';
import Messages from './screens/Messages.jsx';
import Community from './screens/Community.jsx';
import Settings from './screens/Settings.jsx';
import BottomNav from './components/BottomNav.jsx';

export default function App() {
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
