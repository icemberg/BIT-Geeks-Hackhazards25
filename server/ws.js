const { WebSocketServer } = require('ws');
const { Fluvio, Offset } = require('@fluvio/client');

let consumer;

async function initFluvio() {
  try {
    const fluvio = new Fluvio({
      host: process.env.REACT_APP_FLUVIO_ENDPOINT || '127.0.0.1',
      port: 9003
    });
    await fluvio.connect();
    const topicName = 'chat-messages';
    consumer = await fluvio.partitionConsumer(topicName, 0);
    console.log('🔌 Connected to Fluvio cluster for WebSocket');
  } catch (err) {
    console.error('❌ Fluvio initialization error:', err);
    throw err;
  }
}

// Initialize Fluvio when the function is first loaded
initFluvio().catch(console.error);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET' || event.headers.Upgrade !== 'websocket') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'WebSocket upgrade required' })
    };
  }

  if (!consumer) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: 'Fluvio not initialized' })
    };
  }

  try {
    const stream = await consumer.createStream(Offset.FromEnd());
    for await (const record of stream) {
      // In a real implementation, you would need to handle the WebSocket connection
      // and streaming properly. This is a simplified version.
      return {
        statusCode: 200,
        body: record.valueString()
      };
    }
  } catch (err) {
    console.error('Stream error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Streaming error' })
    };
  }
}; 