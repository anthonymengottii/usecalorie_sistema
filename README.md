# 🥗 CalorIA - Smart Calorie Tracker

> **Aplicativo inteligente de rastreamento nutricional com reconhecimento de alimentos por IA**

## 📖 Sobre o Projeto

CalorIA é um aplicativo mobile desenvolvido em React Native que ajuda você a controlar sua alimentação de forma inteligente. Com reconhecimento de alimentos por IA, acompanhamento nutricional detalhado e interface minimalista, o app facilita o alcance de suas metas de saúde.

### 🎯 Objetivo

O CalorIA foi desenvolvido para simplificar o controle nutricional diário, oferecendo uma experiência intuitiva e completa para usuários que desejam:
- Acompanhar calorias e macros de forma automática
- Registrar refeições através de fotos
- Visualizar progresso através de gráficos detalhados
- Manter-se motivado com gamificação e conquistas
- Alcançar metas de saúde de forma sustentável

### 💡 Diferenciais

- **Interface Minimalista**: Design limpo e focado na experiência do usuário
- **Reconhecimento Inteligente**: Identificação automática de alimentos através de fotos
- **Acompanhamento Completo**: Gráficos e estatísticas detalhadas do progresso nutricional
- **Gamificação**: Sistema de conquistas e sequências para manter a motivação
- **Persistência Local**: Dados armazenados localmente com segurança

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Perfil
- **Sistema de cadastro e login** com armazenamento local seguro
- **Perfil do usuário** com informações pessoais e metas nutricionais
- **Estatísticas pessoais** (sequência de dias, refeições registradas, etc.)
- **Conquistas e gamificação** para motivar o uso diário

### 📸 Reconhecimento de Alimentos
- **Câmera integrada** para fotografar refeições
- **Reconhecimento por IA** (simulado) que identifica alimentos automaticamente
- **Seleção de galeria** para escolher fotos existentes
- **Análise nutricional** automática dos alimentos identificados

### 📊 Acompanhamento Nutricional
- **Dashboard diário** com visão geral de calorias e macros
- **Gráficos de progresso** diário e semanal
- **Metas personalizadas** de calorias, proteínas, carboidratos e gorduras
- **Histórico completo** de refeições com filtros por tipo e período
- **Controle de água** com meta diária de 2 litros

### 📈 Visualizações e Relatórios
- **Gráfico de progresso nutricional** com cores distintas por nutriente
- **Gráfico semanal de calorias** com estatísticas resumidas
- **Visualização diária/semanal/mensal** do histórico
- **Resumo estatístico** com totais e médias

### 🎯 Onboarding Intuitivo
- **Carrossel de introdução** com 3 telas explicativas
- **Configuração de perfil** (idade, peso, altura, gênero)
- **Definição de metas** (perda/manutenção/ganho de peso)
- **Configuração de objetivos nutricionais** personalizados

## 🛠️ Tecnologias Utilizadas

### Core
- **React Native** `0.81.4` - Framework mobile multiplataforma
- **TypeScript** `~5.9.2` - Tipagem estática
- **Expo** `~54.0.13` - Plataforma de desenvolvimento

### Navegação e Estado
- **React Navigation** - Navegação Stack e Bottom Tabs
- **Zustand** `^5.0.8` - Gerenciamento de estado leve

### UI/UX
- **Expo Vector Icons** - Ícones Material Design
- **React Native Chart Kit** - Gráficos e visualizações
- **Expo Blur** - Efeitos de blur
- **Custom Design System** - Componentes reutilizáveis

### Armazenamento
- **AsyncStorage** - Persistência local de dados
- **js-sha256** - Hash de senhas para segurança

### Câmera e Mídia
- **Expo Camera** - Acesso à câmera do dispositivo
- **Expo Image Picker** - Seleção de imagens da galeria

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente (`npm install -g expo-cli`)
- Expo Go app instalado no dispositivo móvel (para teste)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/anthonymengottii/usecalorie_sistema.git
cd usecalorie_sistema
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run demo
# ou
npm start
```

4. **Execute em dispositivo**
   - **Android**: `npm run demo:android`
   - **iOS**: `npm run demo:ios`
   - **Web**: `npm run web`

### Scripts Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run demo       # Inicia com cache limpo
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa no navegador
npm run type-check # Verifica erros TypeScript
npm run clean      # Limpa o cache e reinicia
```

## 📱 Estrutura do Projeto

```
usecalorie_sistema/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── UI/              # Componentes de interface
│   │   └── Navigation/      # Componentes de navegação
│   ├── screens/             # Telas da aplicação
│   │   ├── Auth/            # Autenticação
│   │   ├── Onboarding/      # Fluxo de onboarding
│   │   ├── Home/            # Dashboard principal
│   │   ├── Camera/          # Câmera e reconhecimento
│   │   ├── History/         # Histórico de refeições
│   │   └── Profile/         # Perfil e configurações
│   ├── navigation/          # Configuração de navegação
│   ├── store/               # Gerenciamento de estado (Zustand)
│   ├── services/            # Serviços e APIs
│   ├── utils/               # Utilitários e constantes
│   └── types/               # Definições TypeScript
├── App.tsx                   # Componente raiz
├── package.json              # Dependências e scripts
└── README.md                # Este arquivo
```

## 🎨 Design System

O app utiliza um design system minimalista e moderno:

- **Cores**: Paleta verde esmeralda como cor primária
- **Tipografia**: Hierarquia clara com Heading, Body e Caption
- **Espaçamento**: Sistema consistente de espaçamento (xs, sm, md, lg, xl)
- **Componentes**: Botões, inputs, cards e gráficos customizados
- **Navegação**: Tab bar customizada com área de seleção arredondada

## 📊 Funcionalidades Implementadas

✅ Sistema de autenticação completo (cadastro/login)  
✅ Persistência local de dados do usuário  
✅ Onboarding com carrossel e configuração de perfil  
✅ Dashboard com gráficos de progresso nutricional  
✅ Reconhecimento de alimentos (simulado)  
✅ Histórico de refeições com filtros  
✅ Controle de água diário  
✅ Perfil do usuário com estatísticas  
✅ Metas nutricionais personalizáveis  
✅ Interface minimalista e responsiva  

## 🔮 Próximas Funcionalidades

- [ ] Integração com API real de reconhecimento de alimentos
- [ ] Sincronização em nuvem (Firebase)
- [ ] Notificações push
- [ ] Compartilhamento de progresso
- [ ] Receitas e sugestões de refeições
- [ ] Integração com wearables
- [ ] Modo escuro

## 📸 Screenshots

*Adicione screenshots do app aqui*

## 🤝 Contribuindo

Este é um projeto demo/portfólio. Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📝 Licença

Este projeto é um demo para fins de portfólio.

## 👤 Autor

**Anthony Mengotti de Oliveira**

- GitHub: [@anthonymengottii](https://github.com/anthonymengottii)
- LinkedIn: [in/anthony-mengotti-50026424a](https://www.linkedin.com/in/anthony-mengotti-50026424a)
- Instagram: [@ux.mengotti](https://instagram.com/ux.mengotti)
- CTO @ Upay | Creator of PagueStream

## 🙏 Agradecimentos

- **Expo Team** pelo excelente framework e ferramentas de desenvolvimento
- **Comunidade React Native** pela documentação e suporte
- **React Navigation** pela biblioteca de navegação robusta
- **Zustand** pela solução de gerenciamento de estado leve e eficiente
- **Todos os mantenedores** das bibliotecas open source utilizadas neste projeto

---

*Este é um projeto demo. A versão completa inclui todas as funcionalidades com IA, dados em tempo real e recursos avançados.*
