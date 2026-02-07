import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login } from '../lib/services/auth.service';
import { ApiError } from '../lib/api-error';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userName.trim() || !password.trim()) {
      setError('Usuário e senha são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      await login({ userName, password });
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      // Redireciona para a página de tarefas
      navigate('/tasks', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            To-Do App
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Gerencie suas tarefas de forma simples
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Usuário"
              fullWidth
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="seu usuário"
              disabled={loading}
            />

            <TextField
              label="Senha"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Entrar'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
