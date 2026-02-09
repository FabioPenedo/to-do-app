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
  Tabs,
  Tab,
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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Busca tarefas ao montar o componente
  useEffect(() => {
    fetchTasks();
  }, []);


  const extractCategories = (tasks: Task[]) => {
    return Array.from(
      new Set(tasks.map(task => task.category).filter(Boolean))
    );
  };

  const syncCategories = (tasks: Task[]) => {
    setCategories(extractCategories(tasks));
  };


  const fetchTasks = async (category?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let response: Task[];

      if (!category || category === 'all') {
        response = await taskService.getTasks();
        setCategories(extractCategories(response));
      } else {
        response = await taskService.getTasksByCategory(category);
      }

      setTasks(response);
    } catch (err) {
      setError('Erro ao carregar tarefas. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.Title.trim()) {
      newErrors.Title = 'O título é obrigatório';
    }

    if (!formData.Description.trim()) {
      newErrors.Description = 'A descrição é obrigatória';
    }

    if (!formData.Category.trim()) {
      newErrors.Category = 'A categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingId(task.id);
      setFormData({
        Title: task.title,
        Description: task.description || '',
        Category: task.category,
        IsCompleted: task.isCompleted,
      });
    } else {
      setEditingId(null);
      setFormData({ Title: '', Description: '', Category: '', IsCompleted: false });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setFormData({ Title: '', Description: '', Category: '', IsCompleted: false });
    setErrors({});
  };

  const handleSaveTask = async () => {
    if (!validateForm()) {
      return;
    }

    if (editingId) {
      await handleUpdateTask();
    } else {
      await handleCreateTask();
    }
  };

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
      setTasks(prev => {
        const updated = [...prev, response];
        syncCategories(updated);
        return updated;
      });
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao criar tarefa. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data: any = {
        Title: formData.Title,
        Description: formData.Description,
        Category: formData.Category,
        IsCompleted: formData.IsCompleted,
      };

      const response = await taskService.updateTask(editingId, data);
      setTasks(prev => {
        const updated = prev.map(task =>
          task.id === editingId ? response : task
        );

        syncCategories(updated);
        return updated;
      });
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao atualizar tarefa. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      setError(null);
      const response = await taskService.updateTask(task.id, {
        IsCompleted: !task.isCompleted,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? response : t))
      );
    } catch (err) {
      setError('Erro ao atualizar status da tarefa.');
      console.error(err);
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks(prev => {
        const updated = prev.filter(task => task.id !== id);
        syncCategories(updated);
        return updated;
      });
    } catch (error) {
      setError('Erro ao deletar tarefa. Tente novamente.');
      console.error(error);
    }
  }

  const handleCategoryChange = (
    _: React.SyntheticEvent,
    newValue: string
  ) => {
    setSelectedCategory(newValue);
    fetchTasks(newValue);
  };


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
              Concluídas: {tasks.filter((t) => t.isCompleted).length} de {tasks.length}
            </Typography>

            {/* Tabs de Categorias */}
            {categories.length > 0 && (
              <Paper sx={{ mb: 2 }}>
                <Tabs
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="categorias de tarefas"
                >
                  <Tab label="Todas" value="all" />
                  {categories.map((category) => (
                    <Tab key={category} label={category} value={category} />
                  ))}
                </Tabs>
              </Paper>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
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
                          onClick={() => handleOpenDialog(item)}
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
                      onClick={() => handleToggleComplete(item)}
                      dense
                      sx={{ flex: 1 }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={item.isCompleted}
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
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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
                onChange={(e) => {
                  setFormData({ ...formData, Description: e.target.value });
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, Description: '' });
                  }
                }}
                error={!!errors.Description}
                helperText={errors.Description}
                placeholder="Digite uma descrição"
              />
              <TextField
                label="Categoria"
                fullWidth
                value={formData.Category}
                onChange={(e) => {
                  setFormData({ ...formData, Category: e.target.value });
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, Category: '' });
                  }
                }}
                error={!!errors.Category}
                helperText={errors.Category}
                placeholder="Digite uma categoria"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleSaveTask} variant="contained" disabled={isLoading}>
                {editingId ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}
