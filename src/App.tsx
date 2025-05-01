import Index from "./pages/Index";
import { BuilderProvider } from "./context/BuilderContext";
import "./index.css";

const App = () => (
  <BuilderProvider>
    <Index />
  </BuilderProvider>
);

export default App;
