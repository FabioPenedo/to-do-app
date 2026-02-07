import { useState } from 'react';
import {
  Container,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
}

const CATEGORIES = ['Trabalho', 'Estudo', 'Pessoal'];

const categoryColors: Record<
  string,
  'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
> = {
  Trabalho: 'primary',
  Estudo: 'secondary',
  Pessoal: 'success',
};

export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'userId' | 'completed'>>({
    title: '',
    description: '',
    category: 'Pessoal',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingId(task.id);
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', category: 'Pessoal' });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setFormData({ title: '', description: '', category: 'Pessoal' });
    setErrors({});
  };

  const handleSaveTask = () => {
    if (!validateForm()) {
      return;
    }

    if (editingId) {
      setTasks(
        tasks.map((task) =>
          task.id === editingId
            ? { ...task, ...formData }
            : task
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    handleCloseDialog();
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.category === selectedCategory)
    : tasks;

  const getCategoryCount = (category: string) => {
    return tasks.filter((task) => task.category === category).length;
  };

  const handleCategoryChange = (
    _event: React.SyntheticEvent,
    newValue: string | null
  ) => {
    setSelectedCategory(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          📋 Minhas Tarefas
        </Typography>
        {totalCount > 0 && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Concluídas: {completedCount} de {totalCount}
          </Typography>
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

      {/* Category Tabs */}
      {totalCount > 0 && (
        <Paper sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="fullWidth"
            aria-label="Filtrar por categoria"
          >
            <Tab
              label={`Todas (${totalCount})`}
              value={null}
              sx={{ textTransform: 'none' }}
            />
            {CATEGORIES.map((category) => (
              <Tab
                key={category}
                label={`${category} (${getCategoryCount(category)})`}
                value={category}
                sx={{ textTransform: 'none' }}
              />
            ))}
          </Tabs>
        </Paper>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            {selectedCategory
              ? `Nenhuma tarefa em "${selectedCategory}". Clique em "Nova Tarefa" para começar!`
              : 'Nenhuma tarefa criada ainda. Clique em "Nova Tarefa" para começar!'}
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List sx={{ p: 0 }}>
            {filteredTasks.map((task, index) => (
              <Box key={task.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpenDialog(task)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteTask(task.id)}
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
                    onClick={() => handleToggleComplete(task.id)}
                    dense
                    sx={{ flex: 1 }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={task.completed}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            sx={{
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'textSecondary' : 'textPrimary',
                            }}
                          >
                            {task.title}
                          </Typography>
                          <Chip
                            label={task.category}
                            size="small"
                            color={categoryColors[task.category] as any}
                            variant="outlined"
                          />
                        </Stack>
                      }
                      secondary={
                        task.description && !task.completed
                          ? task.description
                          : null
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < filteredTasks.length - 1 && (
                  <Box sx={{ borderBottom: '1px solid #e0e0e0' }} />
                )}
              </Box>
            ))}
          </List>
        </Paper>
      )}

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
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (e.target.value.trim()) {
                setErrors({ ...errors, title: '' });
              }
            }}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="Digite o título da tarefa"
          />
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={formData.description || ''}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Digite uma descrição (opcional)"
          />
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              label="Categoria"
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                setErrors({ ...errors, category: '' });
              }}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {editingId ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
