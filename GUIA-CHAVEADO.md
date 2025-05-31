# 🎯 Guia do Modo Chaveado - Torneio

O **Modo Chaveado** é um sistema de eliminação direta onde os competidores são organizados em um bracket (chaveamento) e avançam eliminando seus oponentes até que reste apenas um campeão.

## 🚀 Como Funciona

### 1. Configuração Inicial
1. **Adicionar Competidores**: Use o botão "+" para adicionar participantes
2. **Mínimo 2 Competidores**: É necessário pelo menos 2 participantes
3. **Gerar Chaveamento**: Clique em "Gerar Chaveamento" para criar o bracket automaticamente

### 2. Sistema de Chaveamento
- **Embaralhamento**: Os competidores são distribuídos aleatoriamente
- **Rodadas Automáticas**: O sistema calcula automaticamente quantas rodadas serão necessárias
- **Suporte a Bye**: Se o número for ímpar, alguns competidores passam automaticamente

### 3. Gerenciamento de Partidas
- **Clique para Jogar**: Clique em uma partida para definir o vencedor
- **Avanço Automático**: Vencedores passam automaticamente para a próxima fase
- **Indicação Visual**: Partidas concluídas ficam com fundo verde

### 4. Progresso do Torneio
- **Visualização Clara**: Todas as fases são exibidas lado a lado
- **Nomes das Rodadas**: Quartas, Semifinal, Final, etc.
- **Campeão Destacado**: O vencedor final é destacado com troféu dourado

## 🏆 Estrutura das Rodadas

### Nomenclatura Automática
- **Primeira Rodada**: "Rodada 1", "Rodada 2", etc.
- **Quartas de Final**: Quando restam 8 competidores
- **Semifinal**: Quando restam 4 competidores  
- **Final**: Última partida entre os 2 finalistas

### Cálculo de Rodadas
O número de rodadas é calculado automaticamente:
- **2-4 competidores**: 2 rodadas (semifinal + final)
- **5-8 competidores**: 3 rodadas (quartas + semifinal + final)
- **9-16 competidores**: 4 rodadas
- E assim por diante...

## ⚙️ Funcionalidades Avançadas

### 🔄 Reset do Torneio
- **Botão Reset**: Permite recomeçar o torneio do zero
- **Confirmação**: Modal de segurança para evitar perda acidental
- **Limpa Resultados**: Remove todos os resultados mas mantém competidores

### 💾 Exportação
- **Download JSON**: Salva o estado completo do torneio
- **Importação**: Pode recarregar torneios salvos
- **Backup Automático**: Dados salvos localmente no navegador

### 📱 Responsividade
- **Desktop**: Visualização horizontal completa do bracket
- **Mobile**: Scroll horizontal para navegar pelas rodadas
- **Touch**: Suporte completo a dispositivos touch

## 🎯 Dicas de Uso

### ✅ Melhores Práticas
- **Adicione todos os competidores antes** de gerar o chaveamento
- **Não remova competidores** após gerar o bracket
- **Confirme resultados** imediatamente após cada partida
- **Use nomes curtos** para melhor visualização

### ⚠️ Limitações
- **Não é possível alterar** o chaveamento após geração
- **Não há empates**: Todo confronto deve ter um vencedor
- **Ordem aleatória**: A distribuição inicial é embaralhada

## 📋 Formato JSON

### Estrutura do Arquivo
```json
{
  "title": "Nome do Torneio",
  "description": "Descrição do sistema",
  "competitors": [
    {
      "id": "comp1",
      "name": "Competidor 1",
      "eliminated": false
    }
  ],
  "bracket": [
    [
      {
        "id": "match1",
        "round": 0,
        "competitor1": {...},
        "competitor2": {...},
        "winner": null,
        "completed": false,
        "dependsOn": []
      }
    ]
  ],
  "currentRound": 0,
  "tournamentStarted": true,
  "createdAt": "2025-05-31T10:00:00.000Z"
}
```

### Campos Importantes
- **competitors**: Lista de todos os participantes
- **bracket**: Array de rodadas, cada rodada contém as partidas
- **dependsOn**: IDs das partidas que devem terminar primeiro
- **tournamentStarted**: Indica se o chaveamento foi gerado

## 🔧 Solução de Problemas

### Problemas Comuns
1. **"Aguarde os competidores serem definidos"**
   - Termine as partidas anteriores primeiro

2. **Botão de gerar não aparece**
   - Adicione pelo menos 2 competidores

3. **Não consigo remover competidor**
   - Só é possível antes de gerar o chaveamento

4. **Partida não responde ao clique**
   - Verifique se ambos os competidores estão definidos

### Recuperação de Dados
- **Dados salvos automaticamente** no navegador
- **Use "Limpar Dados"** apenas se necessário
- **Exporte regularmente** para backup externo

---

**💡 Dica Final**: O modo chaveado é ideal para torneios rápidos e competições onde você quer um vencedor definitivo. Para rankings contínuos, use o Modo Manual ou Classificatório.
