import React from "react";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Components/Login";
import MainPage from "./Components/MainPage";
import MainPageTable from "./Components/MainPageTable";
<<<<<<< HEAD
=======
import Labelprint from "./Components/Labelprint";
>>>>>>> 32713a809094e7d5cbcaa8942e4b72364fea3a09

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mainTable" element={<MainPageTable />} />
<<<<<<< HEAD
=======
        <Route path="/Labelprint" element={<Labelprint />} />

>>>>>>> 32713a809094e7d5cbcaa8942e4b72364fea3a09
      </Routes>
    </div>
  );
};

export default App;
