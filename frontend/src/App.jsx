import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Browse from "./pages/Browse";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/browse" element={<Browse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;