
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { BackendWaker } from "./BackendWaker.tsx";

  createRoot(document.getElementById("root")!).render(<BackendWaker><App /></BackendWaker>);
  