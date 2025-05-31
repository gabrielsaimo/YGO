import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  ArrowLeft,
  Download,
  Edit3,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Modal, Button } from "antd";
import SortableItem from "./SortableItem";
import { useToast } from "../hooks/useToast.jsx";
import { downloadJSON, generateId } from "../utils";
import "./RankingBoard.css";

function RankingBoard({ data, onUpdateData, onBackToHome }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [tempTitle, setTempTitle] = useState(data?.title || "Novo Ranking");
  const [tempDescription, setTempDescription] = useState(
    data?.description || "Descrição do ranking"
  );
  const [_activeId, setActiveId] = useState(null);
  const [isBackModalVisible, setIsBackModalVisible] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id && data?.candidates) {
      const oldIndex = data.candidates.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = data.candidates.findIndex((item) => item.id === over.id);

      const newCandidates = arrayMove(data.candidates, oldIndex, newIndex);
      onUpdateData({ ...data, candidates: newCandidates });
    }
  };

  const exportToJSON = () => {
    if (!data?.title) return;

    downloadJSON(
      data,
      `ranking_${data.title.toLowerCase().replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.json`
    );
    showToast("Ranking exportado com sucesso!", "success");
  };

  const addCandidate = () => {
    if (!data?.candidates) return;

    const newCandidate = {
      id: generateId(),
      name: "Novo Candidato",
      description: "Descrição do candidato",
      score: 0,
    };

    onUpdateData({
      ...data,
      candidates: [...data.candidates, newCandidate],
    });
    showToast("Candidato adicionado com sucesso!", "success");
  };

  const deleteCandidate = (id) => {
    if (!data?.candidates) return;

    const newCandidates = data.candidates.filter(
      (candidate) => candidate.id !== id
    );
    onUpdateData({ ...data, candidates: newCandidates });
    showToast("Candidato removido", "info");
  };

  const updateCandidate = (id, updates) => {
    if (!data?.candidates) return;

    const newCandidates = data.candidates.map((candidate) =>
      candidate.id === id ? { ...candidate, ...updates } : candidate
    );
    onUpdateData({ ...data, candidates: newCandidates });
  };

  const saveHeaderChanges = () => {
    onUpdateData({
      ...data,
      title: tempTitle,
      description: tempDescription,
    });
    setIsEditing(false);
  };

  const handleBackClick = () => {
    if (data?.candidates && data.candidates.length > 0) {
      setIsBackModalVisible(true);
    } else {
      onBackToHome();
    }
  };

  const handleConfirmBack = () => {
    setIsBackModalVisible(false);
    onBackToHome();
  };

  const handleCancelBack = () => {
    setIsBackModalVisible(false);
  };

  return (
    <div className="ranking-board">
      <ToastComponent />

      {/* Modal para confirmação de voltar */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#ff4d4f",
            }}
          >
            <AlertTriangle size={20} />
            Atenção - Dados serão perdidos
          </div>
        }
        open={isBackModalVisible}
        onCancel={handleCancelBack}
        footer={[
          <Button key="cancel" onClick={handleCancelBack}>
            Cancelar
          </Button>,
          <Button
            key="export"
            type="default"
            onClick={() => {
              exportToJSON();
              handleConfirmBack();
            }}
          >
            Exportar e Sair
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={handleConfirmBack}
          >
            Sair sem Exportar
          </Button>,
        ]}
        centered
        width={500}
      >
        <div style={{ padding: "16px 0" }}>
          <p style={{ marginBottom: "16px", fontSize: "16px" }}>
            Ao voltar para a página inicial, todos os dados do ranking atual
            serão perdidos.
          </p>
          <div
            style={{
              background: "#fff7e6",
              border: "1px solid #ffd591",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "16px",
            }}
          >
            <p style={{ margin: 0, color: "#d46b08", fontWeight: "500" }}>
              💡 <strong>Lembrete:</strong> Exporte seus dados antes de sair
              para não perdê-los!
            </p>
          </div>
          <p style={{ margin: 0, color: "#666" }}>
            Você pode exportar os dados clicando em "Exportar e Sair" ou usar o
            botão "Exportar JSON" no cabeçalho.
          </p>
        </div>
      </Modal>

      <div className="header">
        <button onClick={handleBackClick} className="back-button">
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
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
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
        {!data?.candidates || data.candidates.length === 0 ? (
          <div className="empty-state">
            <p className="text">Nenhum competidor adicionado ainda.</p>
            <p className="text">
              Clique em "Adicionar" para começar a criar seu ranking.
            </p>
          </div>
        ) : null}
        {!data?.candidates ? (
          <div className="error-message">
            <p className="text">
              Erro: Dados do ranking não estão disponíveis ou são inválidos.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={data.candidates}
              strategy={verticalListSortingStrategy}
            >
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
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default RankingBoard;
