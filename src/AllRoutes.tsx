import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/scrollToTop";
import Landing from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard/Dashboard";

export const AllRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
