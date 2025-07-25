const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Servidor de TTS online');
});

app.post('/tts', (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).send('Texto ausente');

  const filename = `audio-${Date.now()}.mp3`;
  const filepath = path.join(__dirname, 'public', filename);
  const command = `gtts-cli "${texto}" --lang pt --output "${filepath}"`;

  exec(command, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Erro ao gerar áudio');
    }
    const url = `${req.protocol}://${req.get('host')}/${filename}`;
    res.json({ url });
  });
});

app.listen(port, () => {
  console.log(`Servidor TTS rodando na porta ${port}`);
});
