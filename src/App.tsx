import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './components/Home';
import TaskApp from './components/TaskApp';
import Header from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Box>
                <Header />
                <TaskApp />
              </Box>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
