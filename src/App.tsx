import { AllRoutes } from "./AllRoutes";
import "react-toastify/dist/ReactToastify.css";
import "./connection.ts";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <div className={`theme w-full`}>
        <AllRoutes />
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
