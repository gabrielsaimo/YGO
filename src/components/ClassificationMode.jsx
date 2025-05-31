import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { ArrowLeft, Download, Plus, Trash2, Trophy, Medal, Award, Swords, History, BarChart3 } from 'lucide-react'
import { useToast } from '../hooks/useToast.jsx'
import { downloadJSON, generateId } from '../utils'

function ClassificationMode({ data, onUpdateData, onBackToHome }) {
  const [currentTab, setCurrentTab] = useState('matches') // 'matches', 'ranking', 'history'
  const [selectedCompetitors, setSelectedCompetitors] = useState([])
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false)
  const [newCompetitorName, setNewCompetitorName] = useState('')
  const { showToast, ToastComponent } = useToast()

  // Calcular ranking baseado em vitórias/derrotas
  const calculateRanking = () => {
    return [...data.competitors]
      .map(competitor => ({
        ...competitor,
        winRate: competitor.matches > 0 ? (competitor.wins / competitor.matches * 100).toFixed(1) : 0,
        points: competitor.wins * 3 + (competitor.matches - competitor.wins - competitor.losses) * 1 // 3 pontos por vitória, 1 por empate
      }))
      .sort((a, b) => {
        // Ordenar por pontos, depois por taxa de vitória, depois por número de vitórias
        if (b.points !== a.points) return b.points - a.points
        if (b.winRate !== a.winRate) return b.winRate - a.winRate
        return b.wins - a.wins
      })
  }

  // Adicionar novo confronto
  const addMatch = () => {
    if (selectedCompetitors.length !== 2) {
      showToast('Selecione exatamente 2 competidores para o confronto', 'warning')
      return
    }

    const [competitor1Id, competitor2Id] = selectedCompetitors
    const competitor1 = data.competitors.find(c => c.id === competitor1Id)
    const competitor2 = data.competitors.find(c => c.id === competitor2Id)

    // Interface para escolher o vencedor
    const winner = prompt(`Confronto: ${competitor1.name} vs ${competitor2.name}\n\nDigite:\n1 - ${competitor1.name} venceu\n2 - ${competitor2.name} venceu\n3 - Empate`)
    
    if (!winner || !['1', '2', '3'].includes(winner)) {
      showToast('Confronto cancelado', 'info')
      return
    }

    const newMatch = {
      id: generateId(),
      competitor1: competitor1Id,
      competitor2: competitor2Id,
      competitor1Name: competitor1.name,
      competitor2Name: competitor2.name,
      result: winner, // 1, 2 ou 3 (empate)
      date: new Date().toISOString(),
      round: data.matches.length + 1
    }

    // Atualizar estatísticas dos competidores
    const updatedCompetitors = data.competitors.map(competitor => {
      if (competitor.id === competitor1Id) {
        return {
          ...competitor,
          matches: competitor.matches + 1,
          wins: winner === '1' ? competitor.wins + 1 : competitor.wins,
          losses: winner === '2' ? competitor.losses + 1 : competitor.losses
        }
      }
      if (competitor.id === competitor2Id) {
        return {
          ...competitor,
          matches: competitor.matches + 1,
          wins: winner === '2' ? competitor.wins + 1 : competitor.wins,
          losses: winner === '1' ? competitor.losses + 1 : competitor.losses
        }
      }
      return competitor
    })

    onUpdateData({
      ...data,
      competitors: updatedCompetitors,
      matches: [...data.matches, newMatch]
    })

    setSelectedCompetitors([])
    showToast(`Confronto registrado: ${newMatch.competitor1Name} vs ${newMatch.competitor2Name}`, 'success')
  }

  // Adicionar novo competidor
  const addCompetitor = () => {
    if (!newCompetitorName.trim()) {
      showToast('Digite o nome do competidor', 'warning')
      return
    }

    const newCompetitor = {
      id: generateId(),
      name: newCompetitorName.trim(),
      wins: 0,
      losses: 0,
      matches: 0
    }

    onUpdateData({
      ...data,
      competitors: [...data.competitors, newCompetitor]
    })

    setNewCompetitorName('')
    setIsAddingCompetitor(false)
    showToast('Competidor adicionado com sucesso!', 'success')
  }

  // Remover competidor
  const removeCompetitor = (competitorId) => {
    const competitor = data.competitors.find(c => c.id === competitorId)
    if (competitor.matches > 0) {
      showToast('Não é possível remover competidor que já participou de confrontos', 'error')
      return
    }

    const updatedCompetitors = data.competitors.filter(c => c.id !== competitorId)
    onUpdateData({
      ...data,
      competitors: updatedCompetitors
    })
    showToast('Competidor removido', 'info')
  }

  // Exportar dados
  const exportData = () => {
    const exportData = {
      ...data,
      ranking: calculateRanking(),
      exportedAt: new Date().toISOString()
    }
    downloadJSON(exportData, `ranking_classificatorio_${data.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`)
    showToast('Dados exportados com sucesso!', 'success')
  }

  const ranking = calculateRanking()

  return (
    <div className="classification-mode">
      <ToastComponent />
      
      {/* Header */}
      <div className="header">
        <button onClick={onBackToHome} className="back-button">
          <ArrowLeft size={20} />
          Voltar
        </button>
        
        <div className="header-content">
          <h1 className="ranking-title">{data.title}</h1>
          <p className="ranking-description">{data.description}</p>
        </div>

        <button onClick={exportData} className="export-button">
          <Download size={20} />
          Exportar
        </button>
      </div>

      {/* Navegação por abas */}
      <div className="tabs-navigation">
        <button 
          className={`tab-button ${currentTab === 'matches' ? 'active' : ''}`}
          onClick={() => setCurrentTab('matches')}
        >
          <Swords size={18} />
          Confrontos
        </button>
        <button 
          className={`tab-button ${currentTab === 'ranking' ? 'active' : ''}`}
          onClick={() => setCurrentTab('ranking')}
        >
          <Trophy size={18} />
          Ranking
        </button>
        <button 
          className={`tab-button ${currentTab === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentTab('history')}
        >
          <History size={18} />
          Histórico
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="tab-content">
        <AnimatePresence mode="wait">
          {currentTab === 'matches' && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="matches-tab"
            >
              <div className="matches-section">
                <h2>Novo Confronto</h2>
                <div className="competitor-selection">
                  <div className="competitors-grid">
                    {data.competitors.map(competitor => (
                      <button
                        key={competitor.id}
                        className={`competitor-card ${selectedCompetitors.includes(competitor.id) ? 'selected' : ''}`}
                        onClick={() => {
                          if (selectedCompetitors.includes(competitor.id)) {
                            setSelectedCompetitors(prev => prev.filter(id => id !== competitor.id))
                          } else if (selectedCompetitors.length < 2) {
                            setSelectedCompetitors(prev => [...prev, competitor.id])
                          } else {
                            showToast('Máximo 2 competidores por confronto', 'warning')
                          }
                        }}
                      >
                        <h3>{competitor.name}</h3>
                        <div className="competitor-stats">
                          <span>{competitor.wins}V</span>
                          <span>{competitor.losses}D</span>
                          <span>{competitor.matches}J</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="match-actions">
                    <button 
                      onClick={addMatch} 
                      className="add-match-button"
                      disabled={selectedCompetitors.length !== 2}
                    >
                      <Swords size={20} />
                      Registrar Confronto
                    </button>
                  </div>
                </div>
              </div>

              <div className="competitors-management">
                <h2>Gerenciar Competidores</h2>
                {isAddingCompetitor ? (
                  <div className="add-competitor-form">
                    <input
                      type="text"
                      value={newCompetitorName}
                      onChange={(e) => setNewCompetitorName(e.target.value)}
                      placeholder="Nome do competidor"
                      onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
                    />
                    <button onClick={addCompetitor} className="confirm-button">Adicionar</button>
                    <button onClick={() => setIsAddingCompetitor(false)} className="cancel-button">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setIsAddingCompetitor(true)} className="add-competitor-button">
                    <Plus size={18} />
                    Adicionar Competidor
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {currentTab === 'ranking' && (
            <motion.div
              key="ranking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="ranking-tab"
            >
              <div className="ranking-list">
                {ranking.map((competitor, index) => (
                  <div key={competitor.id} className={`ranking-item position-${index + 1}`}>
                    <div className="rank-position">
                      <div className="rank-number">
                        {index === 0 && <Trophy size={24} />}
                        {index === 1 && <Medal size={24} />}
                        {index === 2 && <Award size={24} />}
                        {index > 2 && <span>{index + 1}</span>}
                      </div>
                    </div>
                    <div className="competitor-info">
                      <h3>{competitor.name}</h3>
                      <div className="stats-grid">
                        <div className="stat">
                          <span className="stat-label">Pontos</span>
                          <span className="stat-value">{competitor.points}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Vitórias</span>
                          <span className="stat-value">{competitor.wins}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Derrotas</span>
                          <span className="stat-value">{competitor.losses}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Taxa</span>
                          <span className="stat-value">{competitor.winRate}%</span>
                        </div>
                      </div>
                    </div>
                    {competitor.matches === 0 && (
                      <button 
                        onClick={() => removeCompetitor(competitor.id)}
                        className="remove-competitor"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="history-tab"
            >
              <div className="matches-history">
                <h2>Histórico de Confrontos</h2>
                {data.matches.length === 0 ? (
                  <p className="no-matches">Nenhum confronto registrado ainda</p>
                ) : (
                  <div className="matches-list">
                    {[...data.matches].reverse().map(match => (
                      <div key={match.id} className="match-item">
                        <div className="match-round">Round {match.round}</div>
                        <div className="match-details">
                          <span className={`competitor ${match.result === '1' ? 'winner' : match.result === '3' ? 'draw' : ''}`}>
                            {match.competitor1Name}
                          </span>
                          <span className="vs">VS</span>
                          <span className={`competitor ${match.result === '2' ? 'winner' : match.result === '3' ? 'draw' : ''}`}>
                            {match.competitor2Name}
                          </span>
                        </div>
                        <div className="match-result">
                          {match.result === '1' && `Vitória: ${match.competitor1Name}`}
                          {match.result === '2' && `Vitória: ${match.competitor2Name}`}
                          {match.result === '3' && 'Empate'}
                        </div>
                        <div className="match-date">
                          {new Date(match.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ClassificationMode
