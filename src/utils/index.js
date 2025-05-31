// Utilitários para formatação e validação

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const validateRankingData = (data) => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Dados inválidos' }
  }

  if (!data.title || typeof data.title !== 'string') {
    return { isValid: false, error: 'Título é obrigatório' }
  }

  if (!data.candidates || !Array.isArray(data.candidates)) {
    return { isValid: false, error: 'Lista de candidatos é obrigatória' }
  }

  if (data.candidates.length === 0) {
    return { isValid: false, error: 'Deve haver pelo menos um candidato' }
  }

  for (const candidate of data.candidates) {
    if (!candidate.id || !candidate.name) {
      return { isValid: false, error: 'Candidatos devem ter ID e nome' }
    }
  }

  return { isValid: true }
}

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const downloadJSON = (data, filename) => {
  const dataStr = JSON.stringify(data, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  
  const exportFileDefaultName = filename || `ranking_${new Date().toISOString().split('T')[0]}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

export const createDefaultRanking = (title = 'Novo Ranking') => {
  return {
    title,
    description: 'Descrição do ranking',
    candidates: [
      { 
        id: generateId(), 
        name: 'Candidato 1', 
        description: 'Descrição do candidato 1', 
        score: 0 
      },
      { 
        id: generateId(), 
        name: 'Candidato 2', 
        description: 'Descrição do candidato 2', 
        score: 0 
      },
      { 
        id: generateId(), 
        name: 'Candidato 3', 
        description: 'Descrição do candidato 3', 
        score: 0 
      },
    ],
    createdAt: new Date().toISOString()
  }
}
