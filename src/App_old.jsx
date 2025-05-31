import { useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Upload, Plus, Trophy, Star, Medal, Award } from 'lucide-react'
import RankingBoard from './components/RankingBoard'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home', 'ranking'
  const [rankingData, setRankingData] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          setRankingData(data)
          setCurrentView('ranking')
        } catch {
          alert('Erro ao carregar o arquivo JSON. Verifique se o formato está correto.')
        }
      }
      reader.readAsText(file)
    } else {
      alert('Por favor, selecione um arquivo JSON válido.')
    }
  }

  const createNewRanking = () => {
    const newRanking = {
      title: 'Novo Ranking',
      description: 'Descrição do ranking',
      candidates: [
        { id: '1', name: 'Candidato 1', description: 'Descrição do candidato 1', score: 0 },
        { id: '2', name: 'Candidato 2', description: 'Descrição do candidato 2', score: 0 },
        { id: '3', name: 'Candidato 3', description: 'Descrição do candidato 3', score: 0 },
      ],
      createdAt: new Date().toISOString()
    }
    setRankingData(newRanking)
    setCurrentView('ranking')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setRankingData(null)
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="home-container"
          >
            <div className="home-content">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="logo-container"
              >
                <Trophy className="main-logo" size={80} />
                <div className="logo-decorations">
                  <Star className="decoration star-1" size={20} />
                  <Medal className="decoration medal-1" size={24} />
                  <Award className="decoration award-1" size={22} />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="main-title"
              >
                Ranking Pro
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="main-subtitle"
              >
                Crie e gerencie rankings interativos com arrastar e soltar
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="action-buttons"
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="action-button primary"
                >
                  <Upload size={20} />
                  Importar JSON
                </button>
                
                <button
                  onClick={createNewRanking}
                  className="action-button secondary"
                >
                  <Plus size={20} />
                  Criar Novo Ranking
                </button>
              </motion.div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ranking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <RankingBoard
              data={rankingData}
              onUpdateData={setRankingData}
              onBackToHome={handleBackToHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
