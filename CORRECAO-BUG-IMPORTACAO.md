# 🔧 Correção do Bug de Importação - Torneio Chaveado

## 📋 Problema Identificado

Quando um arquivo JSON de "Torneio Chaveado" era exportado e depois importado novamente, o sistema abria no modo classificatório em vez do modo chaveado correto.

### Causa Raiz
O arquivo JSON do torneio chaveado contém tanto `competitors` quanto `bracket`, mas a lógica de detecção automática verificava as condições nesta ordem:

1. ✅ `competitors` - **DETECTADO** → Classificatório (INCORRETO)
2. ❌ `candidates` - Não verificado
3. ❌ `bracket` - Não verificado

## 🛠️ Solução Aplicada

### Alteração no `src/App.jsx`
Reordenamos as condições na função `handleFileUpload` para dar prioridade ao `bracket` (mais específico):

```javascript
// ANTES (BUGGY)
if (data.competitors && Array.isArray(data.competitors)) {
  // Classificatório
} else if (data.candidates && Array.isArray(data.candidates)) {
  // Manual  
} else if (data.bracket && Array.isArray(data.bracket)) {
  // Chaveado
}

// DEPOIS (CORRIGIDO)
if (data.bracket && Array.isArray(data.bracket)) {
  // Chaveado - VERIFICADO PRIMEIRO
} else if (data.competitors && Array.isArray(data.competitors)) {
  // Classificatório
} else if (data.candidates && Array.isArray(data.candidates)) {
  // Manual
}
```

### Lógica da Correção
1. 🎯 **Bracket** é verificado primeiro (mais específico)
2. 👥 **Competitors** é verificado depois (menos específico)  
3. 📝 **Candidates** é verificado por último (ranking manual)

## ✅ Resultado

- ✅ Torneios chaveados agora são detectados corretamente
- ✅ Torneios classificatórios continuam funcionando
- ✅ Rankings manuais continuam funcionando
- ✅ Retrocompatibilidade mantida

## 🧪 Como Testar

1. Abra o aplicativo em `http://localhost:5175`
2. Crie um "Novo Torneio Chaveado"
3. Adicione alguns competidores
4. Exporte o arquivo JSON
5. Volte ao menu principal
6. Importe o arquivo JSON exportado
7. ✅ Deve abrir no modo "Torneio Chaveado" (não no classificatório)

## 📅 Data da Correção
31 de maio de 2025

---
**Status:** ✅ CORRIGIDO E TESTADO
