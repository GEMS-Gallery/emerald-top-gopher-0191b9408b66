import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

interface Task {
  id: bigint;
  description: string;
  completed: boolean;
  completedAt: bigint | null;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const addTask = async () => {
    if (newTask.trim() === '') return;
    setLoading(true);
    try {
      await backend.addTask(newTask);
      setNewTask('');
      await fetchTasks();
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
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Task List</h1>
      <div className="flex mb-4">
        <TextField
          fullWidth
          variant="outlined"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="mr-2"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addTask}
          startIcon={<AddIcon />}
          disabled={loading}
        >
          Add
        </Button>
      </div>
      {loading && (
        <div className="flex justify-center my-4">
          <CircularProgress />
        </div>
      )}
      <List>
        {tasks.map((task) => (
          <ListItem key={Number(task.id)} className={task.completed ? 'bg-gray-100' : ''}>
            <Checkbox
              checked={task.completed}
              onChange={() => completeTask(task.id)}
              color="primary"
            />
            <ListItemText
              primary={task.description}
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
  );
};

export default App;
