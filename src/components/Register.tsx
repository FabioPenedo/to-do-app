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
import { signup } from '../lib/services/auth.service';
import { ApiError } from '../lib/api-error';

interface RegisterProps {
  onRegisterSuccess?: () => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userName.trim()) {
      newErrors.userName = 'Usuário é obrigatório';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signup({ userName, password });

      setSuccessMessage('Conta criada com sucesso! Redirecionando...');
      setUserName('');
      setPassword('');
      setPasswordConfirm('');
      setErrors({});

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }

      // Redireciona para a página de tarefas após sucesso
      setTimeout(() => {
        navigate('/tasks', { replace: true });
      }, 1500);
    } catch (err) {
      let errorMessage = 'Erro ao criar conta';
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Registre-se para começar a gerenciar suas tarefas
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}
            {errors.submit && (
              <Alert severity="error">{errors.submit}</Alert>
            )}

            <TextField
              label="Usuário"
              fullWidth
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, userName: '' });
                }
              }}
              error={!!errors.userName}
              helperText={errors.userName}
              placeholder="seu usuário"
              disabled={loading}
            />

            <TextField
              label="Senha"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="••••••••"
              disabled={loading}
            />

            <TextField
              label="Confirmar Senha"
              type="password"
              fullWidth
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, passwordConfirm: '' });
                }
              }}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm}
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
              {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
