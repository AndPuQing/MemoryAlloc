import "./App.css";
// import WorkFlow from "./components/WorkFlow";
import SpaceSplit from "./components/SpaceSplit";
// import DragDiv from "./components/DragBlock";
import { SpaceProvider } from "./context/spaceContext";

function App() {
  return (
    <SpaceProvider>
      <div className="App">
        <header className="App-header">
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
          {/* <WorkFlow /> */}
          <SpaceSplit />
        </header>
      </div>
    </SpaceProvider>
  );
}

export default App;
