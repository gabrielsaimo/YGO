# Ranking Pro 🏆

Uma aplicação moderna e interativa para criar e gerenciar rankings com funcionalidade de arrastar e soltar.

## ✨ Características

- **Interface Moderna**: Design limpo e responsivo com gradientes e animações suaves
- **Drag & Drop**: Reordene candidatos facilmente arrastando e soltando
- **Importação/Exportação JSON**: Importe rankings existentes ou exporte para backup
- **Edição Inline**: Edite nomes e descrições diretamente na interface
- **Sistema de Posições**: Ícones especiais para os 3 primeiros lugares (troféu, medalha, prêmio)
- **Notificações Toast**: Feedback visual para todas as ações
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🚀 Como Usar

1. **Tela Inicial**: Escolha entre importar um JSON existente ou criar um novo ranking
2. **Gestão do Ranking**: 
   - Arraste candidatos para reordená-los
   - Clique no ícone de edição para modificar informações
   - Use o botão + para adicionar novos candidatos
   - Use o botão de lixeira para remover candidatos
3. **Exportação**: Clique em "Exportar JSON" para salvar seu ranking

## 📁 Formato do JSON

```json
{
  "title": "Nome do Ranking",
  "description": "Descrição do ranking",
  "candidates": [
    {
      "id": "1",
      "name": "Nome do Candidato",
      "description": "Descrição do candidato",
      "score": 0
    }
  ],
  "createdAt": "2024-05-30T10:00:00.000Z"
}
```

## 🛠️ Tecnologias Utilizadas

- **React** - Framework principal
- **Vite** - Bundler e servidor de desenvolvimento
- **@dnd-kit** - Biblioteca para drag & drop
- **Framer Motion** - Animações e transições
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização com gradientes e backdrop-filter

## 🎯 Funcionalidades

### Modo Manual
- ✅ **Drag-and-Drop Avançado**: Sistema intuitivo com @dnd-kit
- ✅ **Interface Moderna**: Design com gradientes e animações
- ✅ **Gestão Completa**: Adicionar, editar e remover candidatos
- ✅ **Posições Especiais**: Ícones para 1º🏆, 2º🥈, 3º🥉
- ✅ **Importação/Exportação**: Carregar e salvar em JSON
- ✅ **Responsivo**: Funciona em desktop e mobile
- ✅ **Notificações**: Sistema de toast para feedback

### Modo Classificatório ⚔️ **NOVO!**
- ✅ **Sistema de Confrontos**: Registre duelos entre competidores
- ✅ **Histórico Completo**: Acompanhe todos os confrontos realizados
- ✅ **Ranking Automático**: Classificação baseada em vitórias e derrotas
- ✅ **Estatísticas Detalhadas**: Taxa de vitória, pontos, número de jogos
- ✅ **Interface por Abas**: Confrontos, Ranking e Histórico
- ✅ **Gestão de Competidores**: Adicionar/remover participantes

## 🚀 Como Usar

### Iniciando
1. Abra a aplicação
2. Escolha entre dois modos:
   - **Ranking Manual**: Para ordenação por arrastar e soltar
   - **Ranking Classificatório**: Para sistema de confrontos

### Modo Manual
1. Clique em "Ranking Manual" ou importe um JSON existente
2. Arraste e solte os candidatos para reordenar
3. Use os botões de edição para modificar informações
4. Adicione novos candidatos com o botão "+"
5. Exporte o resultado em JSON

### Modo Classificatório
1. Clique em "Ranking Classificatório"
2. **Aba Confrontos**:
   - Selecione 2 competidores clicando neles
   - Clique em "Registrar Confronto"
   - Escolha o vencedor ou declare empate
3. **Aba Ranking**: Visualize a classificação automática
4. **Aba Histórico**: Acompanhe todos os confrontos
5. Gerencie competidores adicionando ou removendo participantes

## 📊 Sistema de Pontuação (Modo Classificatório)

- **Vitória**: 3 pontos
- **Empate**: 1 ponto  
- **Derrota**: 0 pontos

**Critérios de Desempate**:
1. Maior número de pontos
2. Maior taxa de vitória (%)
3. Maior número de vitórias absolutas

## 🔧 Instalação e Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📱 Exemplo de Uso

O projeto inclui um arquivo `exemplo-ranking.json` com um ranking de filmes que pode ser usado para testar a funcionalidade de importação.

## 🎨 Customização

O arquivo `App.css` contém todas as variáveis de estilo que podem ser facilmente modificadas para personalizar a aparência da aplicação.

---

Desenvolvido com ❤️ usando React e tecnologias modernas.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
