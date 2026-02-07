import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Task, taskService } from '../lib/services/task.service';
import { sessionStore } from '../lib/info.store';


export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Category: '',
    IsCompleted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Busca tarefas ao montar o componente
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await taskService.getTasks();
        setTasks(response);
      } catch (err) {
        setError('Erro ao carregar tarefas. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const session = sessionStore.get();

      const data = {
        ...formData,
        UserId: session!.user.id,
      };
      const response = await taskService.createTask(data);
      setTasks((prev) => [...prev, response]);
    } catch (err) {
      setError('Erro ao criar tarefa. Tente novamente.');
      console.error(err);
    }
    finally {
      setIsLoading(false);
      setFormData({ Title: '', Description: '', Category: '', IsCompleted: false });
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      setError('Erro ao deletar tarefa. Tente novamente.');
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }


  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              📋 Minhas Tarefas
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Concluídas: 00
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              fullWidth
              sx={{ mb: 2 }}
            >
              Nova Tarefa
            </Button>
          </Box>

          {tasks.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                Nenhuma tarefa criada ainda. Clique em "Nova Tarefa" para começar!
              </Typography>
            </Paper>
          ) : tasks.map((item) => (
            <Paper key={item.id}>
              <List sx={{ p: 0 }}>
                <Box>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => { }}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteTask(item.id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={() => { }}
                      dense
                      sx={{ flex: 1 }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={false}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                              sx={{
                                textDecoration: item.isCompleted ? 'line-through' : 'none',
                                color: 'textSecondary',
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Chip
                              label={item.category}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Box sx={{ borderBottom: '1px solid #e0e0e0' }} />
                </Box>
              </List>
            </Paper>
          ))}


          {/* Task Form Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingId ? 'Editar Tarefa' : 'Nova Tarefa'}
            </DialogTitle>
            <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                autoFocus
                label="Título"
                fullWidth
                value={formData.Title}
                onChange={(e) => {
                  setFormData({ ...formData, Title: e.target.value });
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, Title: '' });
                  }
                }}
                error={!!errors.Title}
                helperText={errors.Title}
                placeholder="Digite o título da tarefa"
              />
              <TextField
                label="Descrição"
                fullWidth
                multiline
                rows={3}
                value={formData.Description}
                onChange={(e) =>
                  setFormData({ ...formData, Description: e.target.value })
                }
                placeholder="Digite uma descrição"
              />
              <TextField
                label="Categoria"
                fullWidth
                multiline
                rows={3}
                value={formData.Category}
                onChange={(e) =>
                  setFormData({ ...formData, Category: e.target.value })
                }
                placeholder="Digite uma categoria"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button onClick={() => handleCreateTask()} variant="contained">
                {editingId ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}
