import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  Trophy,
  Medal,
  Award,
  Users,
  ChevronRight,
  RotateCcw,
  Play,
} from "lucide-react";
import { Modal, Button, Space } from "antd";
import { useToast } from "../hooks/useToast.jsx";
import { downloadJSON, generateId } from "../utils";

function BracketMode({ data, onUpdateData, onBackToHome }) {
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [newCompetitorName, setNewCompetitorName] = useState("");
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [isBackModalVisible, setIsBackModalVisible] = useState(false);
  const [bracketGenerated, setBracketGenerated] = useState(false);
  const { showToast, ToastComponent } = useToast();

  // Verificar se o chaveamento já foi gerado
  useEffect(() => {
    setBracketGenerated(data.bracket && data.bracket.length > 0);
  }, [data.bracket]);

  // Adicionar novo competidor
  const addCompetitor = () => {
    if (newCompetitorName.trim() && !bracketGenerated) {
      const newCompetitor = {
        id: generateId(),
        name: newCompetitorName.trim(),
        eliminated: false,
      };

      const updatedData = {
        ...data,
        competitors: [...data.competitors, newCompetitor],
      };

      onUpdateData(updatedData);
      setNewCompetitorName("");
      setIsAddingCompetitor(false);
      showToast("Competidor adicionado com sucesso!", "success");
    }
  };

  // Remover competidor
  const removeCompetitor = (competitorId) => {
    if (bracketGenerated) {
      showToast("Não é possível remover competidores após gerar o chaveamento!", "error");
      return;
    }

    const updatedData = {
      ...data,
      competitors: data.competitors.filter((c) => c.id !== competitorId),
    };
    onUpdateData(updatedData);
    showToast("Competidor removido!", "success");
  };

  // Gerar chaveamento
  const generateBracket = () => {
    if (data.competitors.length < 2) {
      showToast("Adicione pelo menos 2 competidores para gerar o chaveamento!", "error");
      return;
    }

    // Embaralhar competidores
    const shuffledCompetitors = [...data.competitors].sort(() => Math.random() - 0.5);
    
    // Calcular número de rounds necessários
    const totalCompetitors = shuffledCompetitors.length;
    const rounds = Math.ceil(Math.log2(totalCompetitors));
    
    // Criar bracket inicial
    const bracket = [];
    for (let round = 0; round < rounds; round++) {
      bracket.push([]);
    }

    // Primeira rodada
    let currentMatches = [];
    for (let i = 0; i < shuffledCompetitors.length; i += 2) {
      const competitor1 = shuffledCompetitors[i];
      const competitor2 = shuffledCompetitors[i + 1] || null; // bye se ímpar
      
      const match = {
        id: generateId(),
        round: 0,
        competitor1,
        competitor2,
        winner: competitor2 ? null : competitor1, // Auto-win se bye
        completed: !competitor2, // Auto-complete se bye
      };
      
      currentMatches.push(match);
    }
    
    bracket[0] = currentMatches;

    // Gerar rodadas subsequentes
    for (let round = 1; round < rounds; round++) {
      const nextRoundMatches = [];
      const previousRoundMatches = bracket[round - 1];
      
      for (let i = 0; i < previousRoundMatches.length; i += 2) {
        const match1 = previousRoundMatches[i];
        const match2 = previousRoundMatches[i + 1];
        
        const newMatch = {
          id: generateId(),
          round,
          competitor1: null, // Será preenchido quando match1 terminar
          competitor2: match2 ? null : null, // Será preenchido quando match2 terminar
          winner: null,
          completed: false,
          dependsOn: [match1.id, match2?.id].filter(Boolean),
        };
        
        nextRoundMatches.push(newMatch);
      }
      
      bracket[round] = nextRoundMatches;
    }

    const updatedData = {
      ...data,
      bracket,
      currentRound: 0,
      tournamentStarted: true,
    };

    onUpdateData(updatedData);
    setBracketGenerated(true);
    showToast("Chaveamento gerado com sucesso!", "success");
  };

  // Confirmar resultado de uma partida
  const confirmMatch = (matchId, winnerId) => {
    const updatedBracket = data.bracket.map(round => 
      round.map(match => {
        if (match.id === matchId) {
          const winner = match.competitor1?.id === winnerId ? match.competitor1 : match.competitor2;
          return { ...match, winner, completed: true };
        }
        return match;
      })
    );    // Atualizar próximas rodadas
    updatedBracket.forEach((round) => {
      round.forEach((match) => {
        if (match.dependsOn) {
          match.dependsOn.forEach((dependentMatchId, depIndex) => {
            const completedMatch = updatedBracket.flat().find(m => m.id === dependentMatchId);
            if (completedMatch?.completed && completedMatch.winner) {
              if (depIndex === 0) {
                match.competitor1 = completedMatch.winner;
              } else {
                match.competitor2 = completedMatch.winner;
              }
            }
          });
        }
      });
    });

    const updatedData = {
      ...data,
      bracket: updatedBracket,
    };

    onUpdateData(updatedData);
    showToast("Resultado confirmado!", "success");
  };

  // Resetar torneio
  const resetTournament = () => {
    Modal.confirm({
      title: "Resetar Torneio",
      content: "Tem certeza que deseja resetar o torneio? Todos os resultados serão perdidos.",
      onOk: () => {
        const updatedData = {
          ...data,
          bracket: [],
          currentRound: 0,
          tournamentStarted: false,
        };
        onUpdateData(updatedData);
        setBracketGenerated(false);
        showToast("Torneio resetado!", "success");
      },
    });
  };

  // Verificar se o torneio terminou
  const isTournamentFinished = () => {
    if (!data.bracket || data.bracket.length === 0) return false;
    const finalRound = data.bracket[data.bracket.length - 1];
    return finalRound.length === 1 && finalRound[0].completed;
  };

  // Obter campeão
  const getChampion = () => {
    if (!isTournamentFinished()) return null;
    const finalRound = data.bracket[data.bracket.length - 1];
    return finalRound[0].winner;
  };

  // Abrir modal de confirmação de partida
  const openMatchModal = (match) => {
    if (!match.competitor1 || !match.competitor2) {
      showToast("Aguarde os competidores serem definidos!", "warning");
      return;
    }
    setPendingMatch(match);
    setIsMatchModalVisible(true);
  };
  const handleBackToHome = () => {
    setIsBackModalVisible(true);
  };

  const confirmBackToHome = () => {
    setIsBackModalVisible(false);
    onBackToHome();
  };

  const cancelBackToHome = () => {
    setIsBackModalVisible(false);
  };

  const handleExportAndBack = () => {
    downloadData();
    setIsBackModalVisible(false);
    onBackToHome();
  };

  const downloadData = () => {
    downloadJSON(data, `${data.title.replace(/\s+/g, "_")}_bracket.json`);
    showToast("Arquivo baixado com sucesso!", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bracket-mode"
    >
      <div className="bracket-header">
        <div className="bracket-header-left">
          <button onClick={handleBackToHome} className="back-button">
            <ArrowLeft size={20} />
            Voltar
          </button>
          <div className="bracket-title-section">
            <Trophy className="bracket-icon" size={24} />
            <div>
              <h1 className="bracket-title">{data.title}</h1>
              <p className="bracket-description">{data.description}</p>
            </div>
          </div>
        </div>
        <div className="bracket-header-right">
          <button onClick={downloadData} className="download-button">
            <Download size={18} />
            Baixar JSON
          </button>
          {bracketGenerated && (
            <button onClick={resetTournament} className="reset-button">
              <RotateCcw size={18} />
              Resetar
            </button>
          )}
        </div>
      </div>

      {!bracketGenerated ? (
        <div className="bracket-setup">
          <div className="competitors-section">
            <div className="section-header">
              <h2>Competidores ({data.competitors.length})</h2>
              <button
                onClick={() => setIsAddingCompetitor(true)}
                className="add-competitor-button"
              >
                <Plus size={18} />
                Adicionar
              </button>
            </div>

            <div className="competitors-grid">
              {data.competitors.map((competitor) => (
                <motion.div
                  key={competitor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="competitor-card"
                >
                  <div className="competitor-info">
                    <Users size={20} />
                    <span>{competitor.name}</span>
                  </div>
                  <button
                    onClick={() => removeCompetitor(competitor.id)}
                    className="remove-competitor"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            {data.competitors.length >= 2 && (
              <div className="generate-bracket-section">
                <button
                  onClick={generateBracket}
                  className="generate-bracket-button"
                >
                  <Play size={20} />
                  Gerar Chaveamento
                </button>
                <p className="bracket-info">
                  {data.competitors.length} competidores • {Math.ceil(Math.log2(data.competitors.length))} rodadas
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bracket-view">
          {isTournamentFinished() && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="champion-section"
            >
              <Trophy size={32} />
              <h2>Campeão: {getChampion()?.name}</h2>
            </motion.div>
          )}

          <div className="bracket-container">
            {data.bracket.map((round, roundIndex) => (
              <div key={roundIndex} className="bracket-round">
                <h3 className="round-title">
                  {roundIndex === data.bracket.length - 1 ? "Final" : 
                   roundIndex === data.bracket.length - 2 ? "Semifinal" :
                   roundIndex === data.bracket.length - 3 ? "Quartas" :
                   `Rodada ${roundIndex + 1}`}
                </h3>
                <div className="round-matches">
                  {round.map((match) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: roundIndex * 0.1 }}
                      className={`match-card ${match.completed ? 'completed' : ''}`}
                      onClick={() => !match.completed && openMatchModal(match)}
                    >
                      <div className="match-competitors">
                        <div className={`competitor ${match.winner?.id === match.competitor1?.id ? 'winner' : ''}`}>
                          <span>{match.competitor1?.name || "TBD"}</span>
                          {match.winner?.id === match.competitor1?.id && <Medal size={16} />}
                        </div>
                        <div className="vs">VS</div>
                        <div className={`competitor ${match.winner?.id === match.competitor2?.id ? 'winner' : ''}`}>
                          <span>{match.competitor2?.name || "TBD"}</span>
                          {match.winner?.id === match.competitor2?.id && <Medal size={16} />}
                        </div>
                      </div>
                      {!match.completed && match.competitor1 && match.competitor2 && (
                        <div className="match-action">
                          <ChevronRight size={16} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para adicionar competidor */}
      <Modal
        title="Adicionar Competidor"
        open={isAddingCompetitor}
        onOk={addCompetitor}
        onCancel={() => {
          setIsAddingCompetitor(false);
          setNewCompetitorName("");
        }}
        okText="Adicionar"
        cancelText="Cancelar"
      >
        <div style={{ marginTop: "16px" }}>
          <input
            type="text"
            value={newCompetitorName}
            onChange={(e) => setNewCompetitorName(e.target.value)}
            placeholder="Nome do competidor"
            className="competitor-input"
            onKeyPress={(e) => e.key === "Enter" && addCompetitor()}
            autoFocus
          />
        </div>
      </Modal>

      {/* Modal para confirmar resultado da partida */}
      <Modal
        title="Confirmar Resultado"
        open={isMatchModalVisible}
        onCancel={() => setIsMatchModalVisible(false)}
        footer={null}
      >
        {pendingMatch && (
          <div className="match-result-modal">
            <h3>Quem ganhou a partida?</h3>
            <div className="match-options">
              <button
                onClick={() => {
                  confirmMatch(pendingMatch.id, pendingMatch.competitor1.id);
                  setIsMatchModalVisible(false);
                  setPendingMatch(null);
                }}
                className="competitor-option"
              >
                <Trophy size={20} />
                {pendingMatch.competitor1.name}
              </button>
              <button
                onClick={() => {
                  confirmMatch(pendingMatch.id, pendingMatch.competitor2.id);
                  setIsMatchModalVisible(false);
                  setPendingMatch(null);
                }}
                className="competitor-option"
              >
                <Trophy size={20} />
                {pendingMatch.competitor2.name}
              </button>
            </div>
          </div>
        )}
      </Modal>      {/* Modal de confirmação para voltar */}
      <Modal
        title="⚠️ Confirmar Saída"
        open={isBackModalVisible}
        onCancel={cancelBackToHome}
        footer={null}
        centered
        width={500}
      >
        <div style={{ padding: "20px 0" }}>
          <p style={{ fontSize: "16px", marginBottom: "16px" }}>
            Tem certeza que deseja voltar ao menu principal?
          </p>
          <div style={{ 
            backgroundColor: "#fff7e6", 
            border: "1px solid #ffd666", 
            borderRadius: "6px", 
            padding: "12px", 
            marginBottom: "24px" 
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: "14px", 
              color: "#d48806",
              fontWeight: "500" 
            }}>
              💡 <strong>Lembrete:</strong> Se você não exportar os dados, todas as informações do chaveamento serão perdidas permanentemente.
            </p>
          </div>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleExportAndBack}
              style={{ 
                height: "auto", 
                padding: "12px 24px",
                backgroundColor: "#52c41a",
                borderColor: "#52c41a"
              }}
            >
              <Download size={18} style={{ marginRight: "8px" }} />
              Exportar Dados e Voltar
            </Button>
            <Button
              danger
              size="large"
              block
              onClick={confirmBackToHome}
              style={{ height: "auto", padding: "12px 24px" }}
            >
              Voltar sem Exportar
            </Button>
            <Button
              size="large"
              block
              onClick={cancelBackToHome}
              style={{ height: "auto", padding: "12px 24px" }}
            >
              Cancelar
            </Button>
          </Space>
        </div>
      </Modal>

      <ToastComponent />
    </motion.div>
  );
}

export default BracketMode;
