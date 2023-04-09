import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './components/Homepage/Homepage';
import Codepage from './components/Codepage/Codepage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage/>}></Route>
          <Route path="/CodeRoom/:room" element={<Codepage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
