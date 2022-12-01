import "./App.css";
import Setting from "./components/Setting";
import SpaceStatus from "./components/SpaceStatus";
import { SpaceProvider } from "./context/spaceContext";
import { WorkProvider } from "./context/workflowContext";

function App() {
  return (
    <SpaceProvider>
      <WorkProvider>
        <div className="App">
          <div className="flex flex-row items-center justify-center p-5">
            <SpaceStatus />
            <Setting />
          </div>
        </div>
      </WorkProvider>
    </SpaceProvider>
  );
}

export default App;
