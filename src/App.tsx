import { Box } from '@mui/material';
import TaskApp from './components/TaskApp';
import Header from './components/Header';

export default function App() {
  return (
    <Box>
      <Header />
      <TaskApp />
    </Box>
  );
}
