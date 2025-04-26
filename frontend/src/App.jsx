import React from "react";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Components/Login";
import MainPage from "./Components/MainPage";
import MainPageTable from "./Components/MainPageTable";
import Labelprint from "./Components/Labelprint";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mainTable" element={<MainPageTable />} />
        <Route path="/Labelprint" element={<Labelprint />} />
      </Routes>
    </div>
  );
};

export default App;
