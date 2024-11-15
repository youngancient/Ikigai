import { AllRoutes } from "./AllRoutes";
import "./connection.ts";

function App() {
  return (
    <>
      <div className={`theme w-full`}>
        <AllRoutes />
      </div>
    </>
  );
}

export default App;
