import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';

export default function Header() {
  return (
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar>
        <ChecklistIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          To-Do App
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
