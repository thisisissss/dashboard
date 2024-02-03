// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface Task {
  id: number;
  title: string;
  description: string;
  image_url: string;
  is_completed: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data as Task[]);
      }
    };

    fetchTasks();
  }, []);

  const toggleTaskCompletion = async (taskId: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !currentStatus })
      .match({ id: taskId });

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, is_completed: !task.is_completed } : task)));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, description, image_url: imageURL }])
      .single(); // Use .single() if you are inserting one row and expect one object in return
  
    if (error) {
      console.error('Error adding task:', error);
    } else if (data) { // Check if data is not null
      setTasks([...tasks, data]); // Now we can safely spread the data since we know it's not null
      // Reset the form fields
      setTitle('');
      setDescription('');
      setImageURL('');
    }
  };
  
  
  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Task Management Dashboard</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageURL" className="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
          <input
            id="imageURL"
            type="text"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Task
        </button>
      </form>
      {/* The rest of your dashboard code to display tasks goes here */}
    </div>
  );
  
}
