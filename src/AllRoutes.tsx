import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/scrollToTop";
import Landing from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import WillPage from "./pages/Dashboard/Will";
import { Trustfund } from "./pages/Dashboard/Trustfund";
import { TrustfundDetails } from "./pages/Dashboard/TrustfundDetails";

export const AllRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vault" element={<WillPage />} />
          <Route path="/trustfund" element={<Trustfund />} />
          <Route path="/trustfund/details" element={<TrustfundDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
