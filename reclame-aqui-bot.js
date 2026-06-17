const { App, ExpressReceiver } = require('@slack/bolt');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `Você é um agente especialista nos processos internos do Reclame Aqui.
Responda perguntas sobre procedimentos, fluxos, políticas e sistemas internos.
Seja conciso, claro e prático nas respostas.`;

slackApp.event('app_mention', async ({ event, say, client }) => {
  try {
    const pergunta = event.text.replace(/<@.*?>/, '').trim();
    const response = await say(':hourglass: Processando sua pergunta...');
    const messageTs = response.ts;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: pergunta }]
    });

    const resposta = message.content[0].text;

    await client.chat.update({
      channel: event.channel,
      ts: messageTs,
      text: resposta
    });
  } catch (error) {
    console.error('Erro:', error);
    await say('❌ Erro ao processar sua pergunta. Tente novamente.');
  }
});

receiver.app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

(async () => {
  const port = process.env.PORT || 3000;
  await slackApp.start(port);
  console.log(`✅ Bot iniciado na porta ${port}`);
})();
