import CourseController from "./components/CourseController.tsx";
import { Provider } from "react-redux";
import { store } from "./store";
import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <CourseController />
    </Provider>
  );
}
