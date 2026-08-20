import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import LiveRoom from './pages/LiveRoom'
import { captureAndPersistUtms } from './utils/utm'

function App() {
  // Captura as UTMs assim que o app carrega
  useEffect(() => {
    captureAndPersistUtms()
  }, [])

  return (
    <Routes>
      <Route path="/hotlive/:slug" element={<LiveRoom />} />
      <Route path="*" element={<div className="flex h-screen items-center justify-center text-zinc-500">Sala não encontrada</div>} />
    </Routes>
  )
}

export default App
