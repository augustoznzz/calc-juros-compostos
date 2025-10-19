# 💰 Calculadora de Juros Compostos

Uma calculadora moderna e completa de juros compostos desenvolvida com Next.js 14, TypeScript e Tailwind CSS. Oferece simulações precisas, gráficos interativos e análise detalhada da evolução patrimonial.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Funcionalidades

### 📊 Cálculos Precisos
- **Juros Compostos** com capitalização mensal ou anual
- **Aportes Recorrentes** (mensais ou anuais)
- **Conversão automática** de taxas (a.m. ↔ a.a.)
- **Taxa de Administração** aplicada corretamente
- **Ajuste de Inflação** para valor real
- **Meta de Valor Futuro** com cálculo de tempo necessário

### 📈 Visualizações Interativas
- **Gráfico de Evolução**: linha comparativa entre Total Investido vs Valor Futuro
- **Composição Final**: pizza mostrando Principal+Aportes vs Juros
- **Juros por Período**: colunas demonstrando efeito exponencial
- **Tooltips informativos** em todos os gráficos
- **Responsivos** e otimizados para mobile

### 📋 Análise Detalhada
- **KPIs visuais**: Valor Futuro (nominal e real), Total Investido, Juros Totais, Rentabilidade
- **Tabela de Evolução** período a período
- **Paginação** para períodos longos
- **Exportação CSV** da tabela completa

### 🎨 UX/UI Moderna
- Design minimalista e limpo
- Animações suaves (Framer Motion)
- Totalmente responsivo (mobile-first)
- Acessibilidade (ARIA labels, navegação por teclado)
- Tema claro otimizado para legibilidade

### 💾 Persistência
- **localStorage** salva todos os parâmetros
- Recuperação automática ao recarregar a página
- Botão **Reiniciar** limpa tudo

## 🚀 Tecnologias

- **[Next.js 14](https://nextjs.org/)** - App Router, Server/Client Components
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária
- **[Recharts](https://recharts.org/)** - Gráficos interativos
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado
- **[Framer Motion](https://www.framer.com/motion/)** - Animações
- **[Vitest](https://vitest.dev/)** - Testes unitários
- **[React Testing Library](https://testing-library.com/react)** - Testes de componentes

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm, yarn ou pnpm

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/calc-juros-compostos.git
cd calc-juros-compostos
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. **Acesse no navegador**
```
http://localhost:3001
```

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar com UI interativa
```bash
npm run test:ui
```

### Cobertura de código
```bash
npm run test:coverage
```

### Suites de Teste
- **finance.test.ts**: Conversões de taxa, cálculos de juros compostos, tempo para meta
- **format.test.ts**: Formatação de moeda, percentuais e datas
- **components.test.tsx**: Renderização e acessibilidade dos componentes

## 🏗️ Estrutura do Projeto

```
calc-juros-compostos/
├── app/
│   ├── layout.tsx          # Layout raiz com metadata
│   └── page.tsx            # Página principal (cliente)
├── components/
│   ├── InputsCard.tsx      # Formulário de entrada
│   ├── ResultsCard.tsx     # KPIs visuais
│   ├── GrowthChart.tsx     # Gráfico de evolução
│   ├── BreakdownCharts.tsx # Gráficos de composição e juros
│   └── EvolutionTable.tsx  # Tabela + export CSV
├── lib/
│   ├── finance.ts          # Lógica de cálculo (fórmulas)
│   ├── format.ts           # Helpers de formatação
│   └── store.ts            # Zustand store + localStorage
├── styles/
│   └── globals.css         # Tailwind + estilos globais
├── tests/
│   ├── setup.ts            # Configuração Vitest
│   ├── finance.test.ts     # Testes de cálculo
│   ├── format.test.ts      # Testes de formatação
│   └── components.test.tsx # Testes de componentes
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vitest.config.ts
└── README.md
```

## 📐 Fórmulas Utilizadas

### Juros Compostos (sem aportes)
```
VF = P × (1 + i)^n
```

### Juros Compostos (com aportes)
```
VF = P × (1 + i)^n + A × [((1 + i)^n - 1) / i]
```

Onde:
- `VF` = Valor Futuro
- `P` = Principal (investimento inicial)
- `A` = Aporte por período
- `i` = Taxa de juros por período
- `n` = Número de períodos

### Conversão de Taxas
```
De anual para mensal: i_m = (1 + i_a)^(1/12) - 1
De mensal para anual: i_a = (1 + i_m)^12 - 1
```

### Valor Real (ajustado por inflação)
```
VF_real = VF_nominal / (1 + inflação_mensal)^n
```

## 🎯 Casos de Uso

### Exemplo 1: Aposentadoria
- Investimento inicial: R$ 10.000
- Aporte mensal: R$ 1.000
- Taxa: 0,8% a.m. (≈ 10% a.a.)
- Período: 30 anos
- **Resultado**: Visualize quanto acumulará para aposentadoria

### Exemplo 2: Meta Específica
- Investimento inicial: R$ 5.000
- Aporte mensal: R$ 500
- Taxa: 1% a.m.
- Meta: R$ 100.000
- **Resultado**: Descubra em quanto tempo atingirá a meta

### Exemplo 3: Análise Real
- Configure inflação anual (ex: 4%)
- Compare Valor Futuro Nominal vs Real
- Entenda o poder de compra real do montante

## 🚀 Deploy

### Vercel (Recomendado)
1. Faça push do código para GitHub/GitLab
2. Importe no [Vercel](https://vercel.com)
3. Deploy automático!

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Configure Next.js plugin do Netlify

### Variáveis de Ambiente
Este projeto não requer variáveis de ambiente.

## 🛠️ Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento (porta 3001)
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # ESLint
npm run format     # Prettier (formata código)
npm test           # Vitest (modo watch)
npm run test:ui    # Vitest UI
npm run test:coverage # Cobertura de testes
```

## 🔒 Licença

MIT License - sinta-se livre para usar em projetos pessoais ou comerciais.

## ⚠️ Aviso Legal

Esta calculadora tem caráter **educacional**. Os resultados são estimativas baseadas em premissas matemáticas e não consideram:
- Variações de mercado
- Impostos (IR sobre rendimentos)
- Taxas de corretagem
- Mudanças em taxas de administração

**Não constitui recomendação de investimento.** Consulte um profissional certificado para decisões financeiras.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

## 📞 Suporte

- Abra uma [Issue](https://github.com/seu-usuario/calc-juros-compostos/issues)
- Documentação: este README
- Testes: exemplos em `/tests`

## 🙏 Agradecimentos

- Fórmulas matemáticas baseadas em literatura financeira padrão
- UI inspirada em melhores práticas de UX/UI modernas
- Comunidade Next.js, React e TypeScript

---

**Desenvolvido com ❤️ usando Next.js 14, TypeScript e Tailwind CSS**

Versão 1.0.0

