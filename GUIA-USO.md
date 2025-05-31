# 📋 Guia de Uso - Ranking Pro

## 🏠 Tela Inicial

Ao abrir a aplicação, você encontrará:

### Opções de Início
- **Importar JSON**: Carregue um ranking existente
- **Ranking Manual**: Crie um ranking com drag-and-drop  
- **Ranking Classificatório**: Sistema de confrontos ⚔️ **NOVO!**

---

## 🎯 Modo Manual

### Criando um Novo Ranking
1. Clique em "Ranking Manual"
2. Um ranking inicial será criado com 3 candidatos

### Funcionalidades
- **Arrastar e Soltar**: Clique e arraste candidatos para reordenar
- **Editar**: Clique no ícone de lápis para editar nome e descrição
- **Adicionar**: Botão "+" para novos candidatos
- **Remover**: Ícone de lixeira para excluir candidatos
- **Exportar**: Salve seu ranking em formato JSON

### Posições Especiais
- 🏆 **1º Lugar**: Troféu dourado
- 🥈 **2º Lugar**: Medalha de prata  
- 🥉 **3º Lugar**: Medalha de bronze

---

## ⚔️ Modo Classificatório **NOVO!**

### Criando um Torneio
1. Clique em "Ranking Classificatório"
2. Um torneio será criado com 4 competidores iniciais

### 🥊 Aba Confrontos
1. **Selecionar Competidores**:
   - Clique em 2 competidores (ficam destacados em azul)
   - Máximo de 2 seleções por vez

2. **Registrar Confronto**:
   - Clique em "Registrar Confronto"
   - Escolha o vencedor:
     - `1` = Primeiro competidor vence
     - `2` = Segundo competidor vence  
     - `3` = Empate

3. **Gerenciar Competidores**:
   - Adicione novos com o botão "+"
   - Remova apenas quem não participou de confrontos

### 🏆 Aba Ranking
Visualize a classificação automática baseada em:
- **Pontos**: 3 por vitória, 1 por empate
- **Taxa de Vitória**: Porcentagem de vitórias
- **Estatísticas**: Vitórias, derrotas, jogos totais

### 📚 Aba Histórico
- Lista completa de todos os confrontos
- Resultados ordenados do mais recente
- Indicação visual dos vencedores

---

## 📁 Formatos de Arquivo

### Ranking Manual (JSON)
```json
{
  "title": "Meu Ranking",
  "description": "Descrição do ranking",
  "candidates": [
    {
      "id": "1",
      "name": "Candidato 1", 
      "description": "Descrição",
      "score": 0
    }
  ],
  "createdAt": "2025-05-30T12:00:00.000Z"
}
```

### Ranking Classificatório (JSON)
```json
{
  "title": "Meu Torneio",
  "description": "Sistema de confrontos",
  "competitors": [
    {
      "id": "1",
      "name": "Competidor 1",
      "wins": 2,
      "losses": 1, 
      "matches": 3
    }
  ],
  "matches": [
    {
      "id": "match1",
      "competitor1": "1",
      "competitor2": "2",
      "competitor1Name": "Nome 1",
      "competitor2Name": "Nome 2", 
      "result": "1",
      "date": "2025-05-30T12:00:00.000Z",
      "round": 1
    }
  ],
  "createdAt": "2025-05-30T12:00:00.000Z"
}
```

---

## 🎨 Recursos Visuais

### Animações
- Transições suaves entre telas
- Efeitos de hover nos botões
- Feedback visual ao arrastar
- Notificações toast animadas

### Design Responsivo
- Funciona em desktop e mobile
- Layout adaptativo
- Interface touch-friendly

---

## 💡 Dicas

### Modo Manual
- **Edição Rápida**: Duplo clique para editar rapidamente
- **Backup**: Exporte regularmente para não perder dados
- **Performance**: Funciona bem com até 100+ candidatos

### Modo Classificatório  
- **Planejamento**: Defina todos os competidores antes de iniciar
- **Round Robin**: Para torneio completo, cada um deve enfrentar todos
- **Empates**: Use com moderação para manter competitividade
- **Histórico**: Acompanhe a evolução dos competidores

---

## 🔧 Resolução de Problemas

### Arquivo JSON Inválido
- Verifique a sintaxe JSON em um validador online
- Certifique-se de que todas as chaves estão entre aspas
- Não deixe vírgulas no final de listas/objetos

### Performance Lenta
- Evite muitos candidatos/competidores (limite: ~200)
- Feche outras abas do navegador
- Use Chrome ou Firefox para melhor performance

### Mobile/Touch
- Use gestos suaves para arrastar
- Toque e segure para selecionar
- Zoom out se interface ficar pequena

---

## 📞 Suporte

Para problemas ou sugestões, verifique:
1. Se está usando a versão mais recente
2. Se o navegador é compatível (Chrome/Firefox/Safari)
3. Se o JSON importado está no formato correto

**Compatibilidade**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
