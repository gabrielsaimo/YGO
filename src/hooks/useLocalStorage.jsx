import { useState } from 'react'

/**
 * Hook personalizado para gerenciar dados no localStorage
 * @param {string} key - Chave para armazenar no localStorage
 * @param {*} initialValue - Valor inicial caso não exista no localStorage
 * @returns {[*, Function]} - [valor, função para atualizar]
 */
export function useLocalStorage(key, initialValue) {
  // Estado para armazenar nosso valor
  // Passe a função inicial para useState para que a lógica seja executada apenas uma vez
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Obtém do localStorage por chave
      const item = window.localStorage.getItem(key)
      // Analisa o JSON armazenado ou se nenhum retorna initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Se erro também retorna initialValue
      console.log(error)
      return initialValue
    }
  })

  // Retorna uma versão envolvida da função setter do useState que ...
  // ... persiste o novo valor no localStorage.
  const setValue = (value) => {
    try {
      // Permite que value seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Salva no estado
      setStoredValue(valueToStore)
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // Uma implementação mais avançada lidaria com o caso de erro
      console.log(error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Hook para gerenciar especificamente dados de ranking
 */
export function useRankingStorage() {
  const [currentView, setCurrentView] = useLocalStorage('ranking_current_view', 'home')
  const [rankingData, setRankingData] = useLocalStorage('ranking_data', null)
  const [rankingMode, setRankingMode] = useLocalStorage('ranking_mode', null)

  // Função para limpar todos os dados do localStorage
  const clearStorage = () => {
    setCurrentView('home')
    setRankingData(null)
    setRankingMode(null)
  }

  // Função para atualizar dados de ranking e sincronizar automaticamente
  const updateRankingData = (newData) => {
    setRankingData(newData)
  }

  return {
    currentView,
    setCurrentView,
    rankingData,
    setRankingData: updateRankingData,
    rankingMode,
    setRankingMode,
    clearStorage
  }
}
