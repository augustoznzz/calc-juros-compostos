# 🚀 Guia de Deploy

## Desenvolvimento Local

O servidor está rodando em: **http://localhost:3001**

### Status Atual
✅ Dependências instaladas  
✅ Servidor Next.js rodando na porta 3001  
✅ TypeScript configurado  
✅ Tailwind CSS configurado  
✅ Testes configurados  

## Deploy para Produção

### Vercel (Recomendado - mais fácil)

1. **Instale a CLI da Vercel**
```bash
npm i -g vercel
```

2. **Faça login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

Para deploy de produção:
```bash
vercel --prod
```

### Netlify

1. **Instale a CLI do Netlify**
```bash
npm i -g netlify-cli
```

2. **Faça login**
```bash
netlify login
```

3. **Inicialize o projeto**
```bash
netlify init
```

4. **Deploy**
```bash
netlify deploy --prod
```

**Configurações recomendadas:**
- Build command: `npm run build`
- Publish directory: `.next`
- Instale o plugin Next.js Runtime no Netlify

### Deploy Manual (VPS/Cloud)

1. **Build da aplicação**
```bash
npm run build
```

2. **Inicie em modo produção**
```bash
npm start
```

3. **Com PM2 (recomendado)**
```bash
npm i -g pm2
pm2 start npm --name "calc-juros" -- start
pm2 save
pm2 startup
```

## Variáveis de Ambiente

Este projeto não requer variáveis de ambiente para funcionar. Todas as configurações são client-side.

## Checklist Pré-Deploy

- [ ] Rodar testes: `npm test`
- [ ] Build local: `npm run build`
- [ ] Verificar lint: `npm run lint`
- [ ] Testar build localmente: `npm start`
- [ ] Verificar acessibilidade no Lighthouse
- [ ] Testar responsividade (mobile/tablet/desktop)

## Performance

O projeto está otimizado com:
- Server Components onde possível
- Dynamic imports para gráficos (sem SSR)
- Code splitting automático do Next.js
- Tailwind CSS com purge em produção
- Fontes otimizadas (next/font)

## Monitoramento

Recomendamos adicionar:
- **Vercel Analytics** (se usar Vercel)
- **Google Analytics** ou **Plausible** para métricas
- **Sentry** para tracking de erros

## Suporte

Se encontrar problemas:
1. Verifique os logs do build
2. Certifique-se que Node.js >= 18
3. Limpe cache: `rm -rf .next node_modules && npm install`
4. Abra uma issue no repositório

---

**Última atualização:** 2025-10-19

