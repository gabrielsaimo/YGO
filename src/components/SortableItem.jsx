import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator, MdEdit, MdDelete, MdSave, MdClose } from 'react-icons/md';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import { Button } from "antd";

function SortableItem({
  candidate,
  index,
  onDelete,
  onUpdate,
  isEditing,
  onStartEdit,
  onStopEdit,
}) {
  const [tempName, setTempName] = useState(candidate.name);
  const [tempDescription, setTempDescription] = useState(candidate.description);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const getRankIcon = (position) => {
    switch (position) {
      case 0:
        return <FaTrophy className="rank-icon gold" size={24} />;
      case 1:
        return <FaMedal className="rank-icon silver" size={24} />;
      case 2:
        return <FaAward className="rank-icon bronze" size={24} />;
      default:
        return <div className="rank-number">{position + 1}</div>;
    }
  };

  const getRankClass = (position) => {
    switch (position) {
      case 0:
        return "rank-1";
      case 1:
        return "rank-2";
      case 2:
        return "rank-3";
      default:
        return "rank-other";
    }
  };

  const handleSave = () => {
    onUpdate(candidate.id, {
      name: tempName,
      description: tempDescription,
    });
    onStopEdit();
  };

  const handleCancel = () => {
    setTempName(candidate.name);
    setTempDescription(candidate.description);
    onStopEdit();
  };  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`candidate-item ${getRankClass(index)} ${
        isDragging ? "dragging" : ""
      }`}
    >
      <div className="rank-position">{getRankIcon(index)}</div>

      <div className="candidate-content">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="name-input"
              placeholder="Nome do candidato"
            />
            <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              className="description-input"
              placeholder="Descrição do candidato"
              rows={2}
            />            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">
                <MdSave size={16} />
                Salvar
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                <MdClose size={16} />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="candidate-info">
            <h3 className="candidate-name">{candidate.name}</h3>
            <p className="candidate-description">{candidate.description}</p>
          </div>
        )}
      </div>

      <div className="candidate-actions">        {!isEditing && (
          <>
            <Button
              onClick={onStartEdit}
              className="action-btn edit-btn"
              title="Editar candidato"
              type="button"
              icon={<MdEdit size={16} />}
            />
            <Button
              onClick={() => onDelete(candidate.id)}
              className="action-btn delete-btn"
              title="Excluir candidato"
              type="button"
              icon={<MdDelete size={16} />}
            />
          </>
        )}        {isEditing && <div className="editing-placeholder" />}
        <div
          {...attributes}
          {...listeners}
          className="drag-handle"
          title="Arrastar para reordenar"
        >
          <MdDragIndicator size={20} />
        </div>
      </div>
    </div>
  );
}

export default SortableItem;
