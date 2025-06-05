import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./Components/Login";
import MainPage from "./Components/MainPage";
import MainPageTable from "./Components/MainPageTable";
import Labelprint from "./Components/Labelprint";
import Footer from "./Components/Footer";
import StaticLabel from "./Components/StaticLabel";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/mainTable"
            element={
              <>
                <MainPage />
                <MainPageTable />
              </>
            }
          />
          <Route
            path="/Labelprint"
            element={
              <>
                <MainPage />
                <Labelprint />
              </>
            }
          />

          <Route
            path="/Static"
            element={
              <>
                <MainPage />
                <StaticLabel />
              </>
            }
          />
        </Routes>
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default App;
