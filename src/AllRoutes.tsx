import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/scrollToTop";
import Landing from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import WillPage from "./pages/Dashboard/Will";
import { Trustfund } from "./pages/Dashboard/Trustfund";
import { TrustFundDetails } from "./pages/Dashboard/TrustfundDetails";

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
          <Route path="/trustfund/details" element={<TrustFundDetails />} />
          <Route
            path="/trustfund/details/:fundId"
            element={<TrustFundDetails />}
          />
          <Route
            path="*"
            element={
              <div className="w-full h-screen flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">
                  404 - Page Not Found
                </h1>
                <p className="text-gray-400 mb-8">
                  The page you're looking for doesn't exist.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl"
                >
                  Go Back
                </button>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};
