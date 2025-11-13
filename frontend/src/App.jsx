import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<div>SCP Frontend - Coming Soon</div>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App

