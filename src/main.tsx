import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StatusBar } from '@capacitor/status-bar';

StatusBar.hide();

createRoot(document.getElementById("root")!).render(<App data-oid="ha8u9m_" />);
