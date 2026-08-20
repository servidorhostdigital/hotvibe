import { Routes, Route } from 'react-router-dom'
import LiveRoom from './pages/LiveRoom'

function App() {
  return (
    <Routes>
      <Route path="/hotlive/:slug" element={<LiveRoom />} />
      <Route path="*" element={<div className="flex h-screen items-center justify-center text-zinc-500">Sala não encontrada</div>} />
    </Routes>
  )
}

export default App
