# Aula 01: A Anatomia Universal de uma Pipeline CI/CD

Pense numa pipeline como um robô que obedece a um arquivo de texto (escrito em formato **YAML**). Para você entender qualquer arquivo de pipeline no mundo, você só precisa procurar responder a **3 perguntas principais** olhando para o código:

1. **QUANDO** essa pipeline vai rodar?
2. **O QUE** ela vai fazer (quais são as grandes missões)?
3. **COMO** ela vai fazer cada missão, passo a passo?

Vamos mapear essas 3 perguntas para a sintaxe do YAML, usando o GitHub Actions como exemplo:

## 1. QUANDO ela vai rodar? (Gatilhos / Triggers)
No GitHub Actions, você sempre vai procurar a palavra reservada **`on:`**. 
É aqui que dizemos ao robô: *"Só acorde e trabalhe quando isso acontecer"*.

```yaml
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
```
**Como ler:** "Acorde sempre que alguém fizer um envio de código (`push`) diretamente na branch `main`, OU quando alguém abrir uma requisição de mesclagem (`pull_request`) apontando para a `main`."

## 2. O QUE ela vai fazer? (Os Jobs)
Toda pipeline é dividida em grandes blocos de trabalho chamados **Jobs**. Um Job é uma tarefa que ganha um computador limpo (máquina virtual) só para ele rodar.
Você sempre vai procurar a palavra **`jobs:`**.

Exemplo:
```yaml
jobs:
  secret-scan:   # Job 1: Procurar senhas
  sast-scan:     # Job 2: Analisar vulnerabilidades no código
  sca-scan:      # Job 3: Analisar dependências
  build-and-test: # Job 4: Rodar testes unitários
```

### Conceito de Ouro: Execução Paralela vs Sequencial
Por padrão, se você jogar 4 Jobs na pipeline, ela vai tentar rodar todos ao mesmo tempo (paralelamente) para economizar tempo. Mas e se o `build-and-test` só puder rodar **se** a segurança (`sast-scan`) passar? 
Aí entra a palavra mágica **`needs:`** (precisa de).

```yaml
  sast-scan:
    runs-on: ubuntu-latest
    needs: [secret-scan]  <-- Aqui!
```
**Como ler:** "O Job `sast-scan` precisa que o Job `secret-scan` termine com sucesso antes de ele começar."

**Onde ele roda?**
Ainda dentro do Job, você procura a máquina. No GitHub, é o **`runs-on:`**.
`runs-on: ubuntu-latest` significa: "GitHub, me empresta um servidor Linux Ubuntu zerado para eu rodar esse Job".

## 3. COMO ele vai fazer? (Os Steps / Passos)
Dentro de cada Job, temos a "receita" propriamente dita, que são os **`steps:`** (passos). Os passos rodam um após o outro, de cima para baixo.

Existem basicamente duas formas de dar uma ordem para a máquina num passo:

**A) Executar um comando de terminal cru (`run:`)**
É exatamente o que você faria se estivesse no seu teclado.
```yaml
      - name: Executar Testes Unitários
        run: npm test
```

**B) Usar um bloco de código pronto da comunidade (`uses:`)**
No DevSecOps, não queremos reinventar a roda. Se alguém já criou um script perfeito para instalar o Node.js, nós apenas "usamos" o código dessa pessoa.
```yaml
      - name: Checkout do Código
        uses: actions/checkout@v4
```
**Como ler:** "Execute o script oficial do GitHub chamado `checkout` na versão 4. Esse script vai baixar (clonar) os arquivos do meu projeto para dentro dessa máquina virtual, para que os próximos passos tenham os arquivos para trabalhar."

---

## 💡 Dicionário Tradutor para outras ferramentas:

Independente da ferramenta que a empresa use (GitLab CI, Azure DevOps ou Bitbucket Pipelines), a lógica por trás de todas elas é a mesma. Elas apenas mudam o nome das palavras-chave. Se você for para uma empresa que usa **GitLab CI**, basta traduzir:

- `on:` (GitHub) ➡️ vira `rules:` ou `only:` (GitLab)
- `jobs:` (GitHub) ➡️ no GitLab não precisa da palavra `jobs`, você apenas joga os nomes direto.
- `needs:` (GitHub) ➡️ vira `dependencies:` ou usa-se o conceito de `stages:` (estágios).
- `steps: > run:` (GitHub) ➡️ vira `script:` (GitLab).

## 🧐 Prática: Leitura Rápida
Imagine que você abriu um arquivo de pipeline de um projeto que você nunca viu:

```yaml
jobs:
  publicar-imagem:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Criar Docker
        run: docker build -t meu-app:latest .
```
Com essa aula, você lê da seguinte forma: *"Beleza, a pipeline tem uma tarefa principal chamada 'publicar-imagem', que alugou um servidor Linux (ubuntu-latest). O primeiro passo dela é baixar o código do projeto pro servidor (`checkout`), e o segundo passo é rodar o comando de terminal nativo para compilar a imagem Docker (`run: docker build...`)"*.
