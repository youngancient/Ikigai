import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/scrollToTop";
import Landing from "./pages/Landing";

export const AllRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
