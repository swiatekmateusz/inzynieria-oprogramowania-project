import { Routes, Route, BrowserRouter} from 'react-router-dom'
import { HomePage } from './Pages/HomePage';
import { TestWaittingRoomPage } from './Pages/TestWaittingRoomPage';
import { StudentTestPage } from './Pages/StudentTestPage';
import { ResultPage } from './Pages/ResultPage';
import { LoginPage } from './Pages/LoginPage';
import { AdminDashboard } from './Pages/AdminDashboard';
import { AdminResults } from './Pages/AdminResults';
import { AdminTestPage } from './Pages/AdminTestPage';
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test/:keyCode" element={<TestWaittingRoomPage />} />
        <Route
          path="/test/:keyCode/:studentName"
          element={<StudentTestPage />}
        />
        <Route
          path="/test/:keyCode/:studentName/:result"
          element={<ResultPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/add" element={<AdminTestPage />} />
        <Route path="/edit/:testId" element={<AdminTestPage isEditMode />} />
        <Route path="/results/:testId" element={<AdminResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
