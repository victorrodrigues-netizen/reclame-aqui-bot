const { App } = require('@slack/bolt');
const OpenAI = require('openai');
require('dotenv').config();

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `Você é um agente especialista nos processos internos do Reclame Aqui.
Responda perguntas sobre procedimentos, fluxos, políticas e sistemas internos.
Seja conciso, claro e prático nas respostas.`;

slackApp.event('app_mention', async ({ event, say, client }) => {
  try {
    const pergunta = event.text.replace(/<@.*?>/, '').trim();
    
    if (!pergunta) {
      await say('Por favor, faça uma pergunta sobre os processos do Reclame Aqui.');
      return;
    }

    const response = await say(':hourglass: Processando sua pergunta...');
    const messageTs = response.ts;

    const message = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: pergunta }]
    });

    const resposta = message.choices[0].message.content;

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

slackApp.error((error) => {
  console.error('Error:', error);
});

(async () => {
  const port = process.env.PORT || 3000;
  await slackApp.start(port);
  console.log(`✅ Bot iniciado na porta ${port}`);
})();
