import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers'
import { ArrowLeft, Download, Edit3, Plus, Trash2, Save } from 'lucide-react'
import SortableItem from './SortableItem'
import { useToast } from '../hooks/useToast.jsx'
import { downloadJSON, generateId } from '../utils'

function RankingBoard({ data, onUpdateData, onBackToHome }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [tempTitle, setTempTitle] = useState(data?.title || 'Novo Ranking')
  const [tempDescription, setTempDescription] = useState(data?.description || 'Descrição do ranking')
  const [activeId, setActiveId] = useState(null)
  const { showToast, ToastComponent } = useToast()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }
  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (active.id !== over?.id && data?.candidates) {
      const oldIndex = data.candidates.findIndex(item => item.id === active.id)
      const newIndex = data.candidates.findIndex(item => item.id === over.id)
      
      const newCandidates = arrayMove(data.candidates, oldIndex, newIndex)
      onUpdateData({ ...data, candidates: newCandidates })
    }  }

  const exportToJSON = () => {
    if (!data?.title) return
    
    downloadJSON(data, `ranking_${data.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`)
    showToast('Ranking exportado com sucesso!', 'success')
  }

  const addCandidate = () => {
    if (!data?.candidates) return
    
    const newCandidate = {
      id: generateId(),
      name: 'Novo Candidato',
      description: 'Descrição do candidato',
      score: 0
    }
    
    onUpdateData({
      ...data,
      candidates: [...data.candidates, newCandidate]
    })
    showToast('Candidato adicionado com sucesso!', 'success')
  }
  
  const deleteCandidate = (id) => {
    if (!data?.candidates) return
    
    const newCandidates = data.candidates.filter(candidate => candidate.id !== id)
    onUpdateData({ ...data, candidates: newCandidates })
    showToast('Candidato removido', 'info')  }

  const updateCandidate = (id, updates) => {
    if (!data?.candidates) return
    
    const newCandidates = data.candidates.map(candidate =>
      candidate.id === id ? { ...candidate, ...updates } : candidate
    )
    onUpdateData({ ...data, candidates: newCandidates })
  }

  const saveHeaderChanges = () => {
    onUpdateData({
      ...data,
      title: tempTitle,
      description: tempDescription
    })
    setIsEditing(false)
  }
  return (
    <div className="ranking-board">
      <ToastComponent />
      <div className="header">
        <button onClick={onBackToHome} className="back-button">
          <ArrowLeft size={20} />
          Voltar
        </button>
        
        <div className="header-content">
          {isEditing ? (
            <div className="edit-header">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="title-input"
              />
              <textarea
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                className="description-input"
              />
              <button onClick={saveHeaderChanges} className="save-button">
                <Save size={16} />
                Salvar
              </button>
            </div>
          ) : (
            <div className="header-display">
              <h1 className="ranking-title">{data.title}</h1>
              <p className="ranking-description">{data.description}</p>
              <button onClick={() => setIsEditing(true)} className="edit-button">
                <Edit3 size={16} />
                Editar
              </button>
            </div>
          )}
        </div>

        <div className="header-actions">
          <button onClick={addCandidate} className="add-button">
            <Plus size={20} />
            Adicionar
          </button>
          <button onClick={exportToJSON} className="export-button">
            <Download size={20} />
            Exportar JSON
          </button>
        </div>
      </div>

      <div className="ranking-container">
        {!data?.candidates ? (
          <div className="error-message">
            <p>Erro: Dados do ranking não estão disponíveis ou são inválidos.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext items={data.candidates} strategy={verticalListSortingStrategy}>
              <div className="candidates-list">
                {data.candidates.map((candidate, index) => (
                  <SortableItem
                    key={candidate.id}
                    candidate={candidate}
                    index={index}
                    onDelete={deleteCandidate}
                    onUpdate={updateCandidate}
                    isEditing={editingCandidate === candidate.id}
                    onStartEdit={() => setEditingCandidate(candidate.id)}
                    onStopEdit={() => setEditingCandidate(null)}
                  />
                ))}
              </div>
            </SortableContext>
              <DragOverlay>
              {activeId ? (
                <div className="candidate-item drag-overlay" style={{ cursor: 'grabbing' }}>
                  {(() => {
                    const candidate = data.candidates.find(c => c.id === activeId)
                    const index = data.candidates.findIndex(c => c.id === activeId)
                    return candidate ? (
                      <>
                        <div className="rank-position">
                          <div className="rank-number">{index + 1}</div>
                        </div>
                        <div className="candidate-content">
                          <div className="candidate-info">
                            <h3 className="candidate-name">{candidate.name}</h3>
                            <p className="candidate-description">{candidate.description}</p>
                          </div>
                        </div>
                      </>
                    ) : null
                  })()}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default RankingBoard
