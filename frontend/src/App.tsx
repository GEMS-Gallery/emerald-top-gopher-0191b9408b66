import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

interface Task {
  id: bigint;
  description: string;
  category: string;
  completed: boolean;
  completedAt: bigint | null;
}

interface Category {
  name: string;
  icon: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  useEffect(() => {
    // @ts-ignore
    feather.replace();
  }, [categories]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await backend.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '' || newCategory === '') return;
    setLoading(true);
    try {
      await backend.addTask(newTask, newCategory);
      setNewTask('');
      setNewCategory('');
      await fetchTasks();
      await fetchCategories();
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
  };

  const completeTask = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.completeTask(id);
      await fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
    setLoading(false);
  };

  const deleteTask = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.deleteTask(id);
      await fetchTasks();
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    setLoading(false);
  };

  const filteredTasks = selectedCategory === 'all' ? tasks : tasks.filter(task => task.category === selectedCategory);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Task List</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <List>
            <ListItem button onClick={() => setSelectedCategory('all')}>
              <i data-feather="list" className="mr-2"></i>
              <ListItemText primary="All" />
            </ListItem>
            {categories.map((category) => (
              <ListItem button key={category.name} onClick={() => setSelectedCategory(category.name)}>
                <i data-feather={category.icon} className="mr-2"></i>
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="w-2/3">
          <h2 className="text-xl font-semibold mb-2">Create Task</h2>
          <div className="mb-4">
            <TextField
              fullWidth
              variant="outlined"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task"
              className="mb-2"
            />
            <FormControl fullWidth variant="outlined" className="mb-2">
              <InputLabel>Category</InputLabel>
              <Select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as string)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.name} value={category.name}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={addTask}
              startIcon={<AddIcon />}
              disabled={loading}
            >
              Add Task
            </Button>
          </div>
          {loading && (
            <div className="flex justify-center my-4">
              <CircularProgress />
            </div>
          )}
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          <List>
            {filteredTasks.map((task) => (
              <ListItem key={Number(task.id)} className={task.completed ? 'bg-gray-100' : ''}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => completeTask(task.id)}
                  color="primary"
                />
                <ListItemText
                  primary={task.description}
                  secondary={task.category}
                  className={task.completed ? 'line-through text-gray-500' : ''}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteTask(task.id)}
                    disabled={loading}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
};

export default App;
