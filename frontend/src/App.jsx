import React from "react";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Components/Login";
import MainPage from "./Components/MainPage";
import MainPageTable from "./Components/MainPageTable";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mainTable" element={<MainPageTable />} />
      </Routes>
    </div>
  );
};

export default App;
