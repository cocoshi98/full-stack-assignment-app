import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import TaskListPage from "./pages/TaskListPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/tasks">Tasks</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/tasks" replace />}
        />

        <Route
          path="/tasks"
          element={<TaskListPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}