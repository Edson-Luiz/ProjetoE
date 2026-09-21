# ProjetoE: Laboratório DevSecOps & CI/CD Pipeline

Este projeto é um laboratório prático para dominar **DevSecOps**, infraestrutura de pipelines no **GitHub Actions**, containers e segurança em profundidade (*Defense in Depth*).

---

## 🎯 O que está configurado nesta etapa

1. **Aplicação Alvo Mínima (`src/server.js`):**
   - API Express com endpoint `/health`.
   - Endpoint `/api/tools/ping` com uma **falha intencional de Command Injection** para ser detectada pelo **SAST**.
   - Dependência vulnerável no `package.json` (`lodash@4.17.20`) com CVE conhecido para ser detectada pelo **SCA**.

2. **Pipeline DevSecOps (`.github/workflows/devsecops-ci.yml`):**
   - **Secret Scanning (Gitleaks):** Analisa todo o histórico do Git procurando tokens, senhas ou chaves expostas.
   - **SAST (Semgrep):** Analisa o código-fonte contra as regras do *OWASP Top 10* para JavaScript/Node.js e gera relatório padronizado SARIF.
   - **SCA (Trivy):** Analisa o arquivo `package-lock.json` e cruza com bases globais de vulnerabilidades (NVD/CVE).
   - **Build & Tests:** Garante que a aplicação funciona e passa nos testes unitários apenas após validações de segurança.

---

## 🏗️ Como ler e entender a Pipeline do GitHub Actions

A pipeline é declarada em formato YAML. Ela é composta pelos seguintes blocos fundamentais:

```yaml
name: Nome da Pipeline
on: [quando ela deve rodar? Ex: push na main ou criação de Pull Request]
permissions: [quais acessos o token GITHUB_TOKEN tem? Princípio do menor privilégio]
jobs:
  nome-do-job:
    runs-on: [qual máquina virtual usar? Ex: ubuntu-latest]
    needs: [depende de outro job ter passado antes?]
    steps:
      - uses: [ação pronta do GitHub Marketplace]
      - run: [comando bash / shell direto]
```

### O que é o formato SARIF?
**SARIF** (*Static Analysis Results Interchange Format*) é o padrão da indústria (formato JSON) usado por ferramentas como Semgrep, CodeQL, Snyk e Trivy para unificar resultados de segurança. O GitHub lê arquivos `.sarif` e os exibe nativamente na aba **Security > Code scanning**.

---

## 🚀 Próximos Passos do Laboratório
- [x] Subir para um repositório no GitHub para ver os jobs executando na nuvem.
- [ ] Fase 2: Criar o **Dockerfile** com boas práticas corporativas (multi-stage + non-root).
- [ ] Adicionar **Hadolint** (linter de Dockerfile) e **Trivy Image Scan** na pipeline.
- [ ] Fase 3: Introduzir DAST com **OWASP ZAP** rodando contra o container ativo.
