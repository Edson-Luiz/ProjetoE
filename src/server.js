const express = require('express');
const _ = require('lodash');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota de Health Check (padrão em orquestradores como Kubernetes e ECS)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Rota de listagem de riscos simulados
app.get('/api/risks', (req, res) => {
  const risks = [
    { id: 1, title: 'Hardcoded Secrets', severity: 'CRITICAL', status: 'MITIGATED' },
    { id: 2, title: 'Vulnerable Dependencies (CVEs)', severity: 'HIGH', status: 'IN_REVIEW' },
    { id: 3, title: 'Command Injection Flaw', severity: 'HIGH', status: 'OPEN' }
  ];

  // Exemplo de uso de lodash
  const sorted = _.sortBy(risks, ['severity']);
  res.json({ data: sorted });
});

// ROTA VULNERÁVEL (Intencional para teste de SAST - Command Injection)
// Alvo do Semgrep / CodeQL
app.get('/api/tools/ping', (req, res) => {
  const host = req.query.host;

  if (!host) {
    return res.status(400).json({ error: 'Parâmetro host é obrigatório' });
  }

  // VULNERABILIDADE: Concatenação direta de input do usuário no comando do shell
  // Semgrep irá alertar: "Possible command injection"
  exec(`ping -c 1 ${host}`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ output: stdout });
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[DevSecOps Lab] Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;
