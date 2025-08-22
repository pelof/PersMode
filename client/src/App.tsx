import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes';

const queryClient = new QueryClient();

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
    </>
  )
}

export default App
