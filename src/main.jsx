// import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// import store, { persistor } from "./redux/Store";
// import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <Provider store={store}>
  //   <PersistGate loading={null} persistor={persistor}>
  <App />
  //   </PersistGate>
  // </Provider>
);
