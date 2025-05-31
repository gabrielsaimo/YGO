import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Upload, Trophy, Star, Medal, Award, Zap, Swords } from "lucide-react";
import RankingBoard from "./components/RankingBoard";
import ClassificationMode from "./components/ClassificationMode";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("home"); // 'home', 'ranking', 'classification'
  const [rankingData, setRankingData] = useState(null);
  const [rankingMode, setRankingMode] = useState(null); // 'manual', 'classification'
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setRankingData(data);
          setCurrentView("ranking");
          setRankingMode("manual");
        } catch {
          alert(
            "Erro ao carregar o arquivo JSON. Verifique se o formato está correto."
          );
        }
      };
      reader.readAsText(file);
    } else {
      alert("Por favor, selecione um arquivo JSON válido.");
    }
  };

  const createNewRanking = (mode) => {
    if (mode === "manual") {
      const newRanking = {
        title: "Novo Ranking",
        description: "Descrição do ranking",
        candidates: [],
        createdAt: new Date().toISOString(),
      };
      console.log("Creating manual ranking:", newRanking);
      setRankingData(newRanking);
      setCurrentView("ranking");
    } else if (mode === "classification") {
      const newClassification = {
        title: "Novo Ranking Classificatório",
        description: "Sistema de confrontos diretos",
        competitors: [],
        matches: [],
        createdAt: new Date().toISOString(),
      };
      console.log("Creating classification ranking:", newClassification);
      setRankingData(newClassification);
      setCurrentView("classification");
    }
    setRankingMode(mode);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setRankingData(null);
    setRankingMode(null);
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentView === "home" ? (
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mode-selection"
              >
                <h3 className="mode-title">Escolha o tipo de ranking:</h3>
                <div className="mode-buttons">
                  <button
                    onClick={() => createNewRanking("manual")}
                    className="mode-button manual"
                  >
                    <div className="mode-icon">
                      <Zap size={32} />
                    </div>
                    <div className="mode-info">
                      <h4>Ranking Manual</h4>
                      <p>Arraste e solte candidatos para reordenar</p>
                    </div>
                  </button>

                  <button
                    onClick={() => createNewRanking("classification")}
                    className="mode-button classification"
                  >
                    <div className="mode-icon">
                      <Swords size={32} />
                    </div>
                    <div className="mode-info">
                      <h4>Ranking Classificatório</h4>
                      <p>Sistema de confrontos com histórico</p>
                    </div>
                  </button>
                </div>
              </motion.div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </div>
          </motion.div>
        ) : currentView === "ranking" ? (
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
        ) : currentView === "classification" ? (
          <motion.div
            key="classification"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ClassificationMode
              data={rankingData}
              onUpdateData={setRankingData}
              onBackToHome={handleBackToHome}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default App;
