import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import TaskListPage from "./pages/TaskListPage";
import CreateTaskPage from "./pages/CreateTaskPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/tasks">Tasks</Link>
        <Link to="/tasks/new">Create Task</Link>
      </nav>

      <Routes>
        <Route
          path="/tasks/new"
          element={<CreateTaskPage />}
        />

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