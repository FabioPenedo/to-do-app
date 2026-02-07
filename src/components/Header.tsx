import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { useAuth } from '../hooks/useAuth';
import { logout as logoutAPI } from '../lib/services/auth.service';

export default function Header() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      logout();
      navigate('/', { replace: true });
    }
  };

  return (
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar>
        <ChecklistIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          To-Do App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {session?.user && (
            <Typography variant="body2">
              Olá, {session.user.name}
            </Typography>
          )}
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
