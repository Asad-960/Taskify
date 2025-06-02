import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SignalRProvider } from './context/SignalRContext.tsx'


const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <SignalRProvider>
        <App />
      <ToastContainer position='top-right' autoClose={2000}/>
      </SignalRProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
