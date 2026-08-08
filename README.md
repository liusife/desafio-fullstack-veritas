# Mini Kanban - Desafio Fullstack Veritas

Uma aplicação fullstack de gerenciamento de tarefas estilo Kanban desenvolvida com **React + TypeScript** no frontend e **Go** no backend.

## Como Executar

### Desenvolvimento Local

**Backend (Go):**
```bash
cd backend
go mod tidy
go run *.go
# Servidor roda em http://localhost:8081
```

**Frontend (React + Vite):**
```bash
cd frontend
npm install
npm run dev
# Aplicação roda em http://localhost:5173
```

### Com Docker

```bash
# Build e start de ambos os serviços
docker compose up --build

# Frontend acessível em http://localhost
# Backend API em http://localhost:8081
```

## Decisões Técnicas

### Backend (Go)
- **Chi Router**: Leve, idiomático, boa performance, middleware chain
- **Armazenamento em memória + JSON**: Simplicidade para MVP, atende requisitos de persistência
- **UUID v4**: IDs únicos globais, evita colisões
- **Validação server-side**: Segurança - nunca confiar apenas no frontend
- **Interface `TaskStore`**: Testabilidade, fácil troca de implementação (ex: PostgreSQL)
- **CORS configurável**: Flexibilidade para diferentes origens

### Frontend (React + TypeScript)
- **Vite**: Build rápido, HMR eficiente, configuração mínima
- **TypeScript**: Type safety, autocomplete, refactoring seguro
- **CSS Modules / CSS Variables**: Escopo local, design system consistente, manutenibilidade
- **Custom Hooks (`useTasks`)**: Lógica reutilizável, separação de concerns
- **Fetch API nativo**: Zero dependências, moderno, suficiente para MVP
- **Componentes funcionais + Hooks**: Padrão moderno React
- **@dnd-kit**: Drag-and-drop acessível e performático (core, sortable, utilities)

## Limitações Conhecidas

1. **Sem autenticação/autorização** - Qualquer um pode acessar e modificar tarefas
2. **Armazenamento em arquivo único** - Não escala para múltiplas instâncias
3. **Sem paginação** - Lista todas as tarefas de uma vez
4. **Sem testes automatizados** - Cobertura de testes não implementada
5. **CORS aberto para desenvolvimento** - Em produção deve ser restrito

## Melhorias Futuras

- [ ] Banco de dados (PostgreSQL/SQLite) com migrações
- [ ] Autenticação JWT + controle de acesso
- [ ] WebSockets para atualizações em tempo real
- [ ] Filtros, busca, prioridades, labels, due dates
- [ ] Testes unitários (Go testing, Vitest/React Testing Library)
- [ ] Testes E2E (Cypress/Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Observabilidade (logs estruturados, métricas, tracing)
- [ ] Deploy em Kubernetes/cloud

---

## Documentação (Diagramas)

Os diagramas estão em formato Mermaid na pasta `docs/`:

- `docs/user-flow.mmd` - Fluxo do usuário no sistema
- `docs/data-flow.mmd` - Fluxo de dados entre frontend, API e storage

### Como gerar as imagens PNG

```bash
# Instalar mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Gerar PNGs
mmdc -i docs/user-flow.mmd -o docs/user-flow.png
mmdc -i docs/data-flow.mmd -o docs/data-flow.png
```

Ou use a extensão "Mermaid Preview" no VS Code, ou cole o conteúdo em https://mermaid.live