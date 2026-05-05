# Consuma+ | Consumer Insight Intelligence

O **Consuma+** é uma plataforma de inteligência financeira desenvolvida para transformar a gestão de gastos pessoais em uma experiência analítica e estratégica. O projeto foca em converter dados brutos de transações em insights acionáveis, auxiliando usuários a identificar padrões de consumo e estabelecer metas de economia inteligentes.

## 📸 Demonstração do Sistema

### Tela de Login
![Tela de Login](./src/screenshots/tela-login.JPG)
*Interface de acesso segura integrada com Context API para gerenciamento de sessão.*

### Dashboard Principal
![Dashboard Visão Geral](./src/screenshots/dashboard.JPG)
*Painel com saldo de gastos, identificação de foco de consumo e gráfico de metas inteligentes.*

### Histórico e Composição de Gastos
![Histórico e Gráficos](./src/screenshots/historico.JPG)
*Visualização detalhada do histórico de transações e gráfico de pizza por categoria.*

---
## 🚀 Sobre o Projeto

Este ecossistema foi desenvolvido como parte de uma transição estratégica para o setor de tecnologia. Ele une uma sólida experiência de mais de sete anos no setor financeiro com o desenvolvimento Full Stack moderno, focado em resolver problemas reais de organização financeira através de uma interface intuitiva e responsiva.

### 🛠️ Tecnologias Utilizadas

*   **Frontend**: React.js com TypeScript.
*   **Ferramenta de Build**: Vite (garantindo alta performance no desenvolvimento).
*   **Estilização**: Tailwind CSS para um design moderno e responsivo.
*   **Visualização de Dados**: Recharts para criação de gráficos de composição (Pizza) e projeções (Barras).
*   **Ícones**: Lucide React.
*   **Backend (Simulado)**: JSON Server para persistência de dados em tempo real.
*   **Gestão de Estado**: Context API para gerenciamento de autenticação global.

## 📊 Funcionalidades Principais

*   **Dashboard Inteligente**: Painel visual com saldo total de gastos e identificação do foco principal de consumo.
*   **Metas de Economia**: Algoritmo que projeta cenários de economia (15%) baseados no comportamento financeiro atual.
*   **Gestão de Transações**: Sistema completo de CRUD (Create, Read, Delete) para controle rigoroso de despesas.
*   **Autenticação**: Fluxo seguro de Login e Logout utilizando Context API para proteger os dados do usuário.
*   **Análise de Gastos Fixos**: Monitoramento automático de categorias essenciais como luz, água e moradia.

## 🛠️ Configuração do Ambiente

### Pré-requisitos
*   Node.js instalado.
*   Gerenciador de pacotes (npm ou yarn).

### Passo a Passo

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/Li-code1/consuma-mais.git
    ```

2.  **Instale as dependências**:
    
```bash
    npm install
    ```

3.  **Inicie o Backend (JSON Server)**:
    O servidor de dados deve ser iniciado para permitir a persistência no arquivo `db.json`. Em um terminal dedicado, execute:
    ```bash
    npm run server
    ```

4.  **Inicie o Frontend**:
    Em outro terminal, execute a aplicação:
    ```bash
    npm run dev
    ```

🔑 Acesso ao Sistema
Para testar as funcionalidades do dashboard, utilize as seguintes credenciais na tela de login:

E-mail: admin@admin.com

Senha: 123

Nota: Como a autenticação é gerenciada via Context API para fins de demonstração, o sistema aceita qualquer combinação de e-mail e senha preenchidos para facilitar a navegação rápida pelo avaliador.

## 📈 Trajetória Técnica

O desenvolvimento do Consuma+ faz parte de um portfólio robusto que inclui:
*   **SmartMart Pro**: Plataforma de BI para varejo focada em visualização de dados com Python e React.
*   **Task Management API**: Implementação de processos assíncronos com FastAPI, Celery e Redis.

---

**Desenvolvido por**: [Liliane Lima] – Desenvolvedora Full Stack Python em formação e Graduanda em Análise e Desenvolvimento de Sistemas.
```