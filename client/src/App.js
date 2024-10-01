import "./App.css";
import Chat from "./components/Chat/Chat";

function App() {
  return (
    <div>
      <div
        style={{
          height: "100vh",
          width: "100%",
          margin: 0,
          overflow: "hidden",
        }}
      >
        <Chat />
      </div>
    </div>
  );
}

export default App;
