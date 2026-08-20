import { Routes, Route, Navigate } from 'react-router-dom'
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
      <Route path="/" element={<LiveRoom />} />
      <Route path="/hotlive/:slug" element={<LiveRoom />} />
      <Route path="/:slug" element={<LiveRoom />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
