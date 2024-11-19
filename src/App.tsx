import { AllRoutes } from "./AllRoutes";
import { ToastContainer } from 'react-toastify';
import "./connection.ts";

function App() {
  return (
    <>
      <div className={`theme w-full`}>
        <ToastContainer />
        <AllRoutes />
      </div>
    </>
  );
}

export default App;
