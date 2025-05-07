// Add ESLint environment configuration at the top
/* eslint-env node */
/* eslint-disable no-console */
/* global Fluvio, Offset, process, require, __dirname */

// src/server.js
// import express from 'express';
// import cors from 'cors';
// import { WebSocketServer } from 'ws';
// 
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const { Fluvio, Offset } = require('@fluvio/client');
require('dotenv').config();

let producer;
let consumer;

const app = express();
app.use(cors());
app.use(express.json());


/**
 * Recursively create a WebSocket server, bumping port if in use.
 * @param {number} basePort
 */
function createWebSocketServer(basePort = 9004) {
  try {
    const wss = new WebSocketServer({ port: basePort });
    wss.on('listening', () =>
      console.log(`✅ WebSocket listening on :${basePort}`)
    );
    return wss;
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${basePort} in use, trying ${basePort + 1}`);
      return createWebSocketServer(basePort + 1);
    }
    throw err;
  }
}

async function initFluvio() {
  try {
    const fluvio = new Fluvio({
      host: process.env.REACT_APP_FLUVIO_ENDPOINT || '127.0.0.1',
      port: 9003
    });
    await fluvio.connect();
    const admin = await fluvio.admin();

    const topicName = 'chat-messages';
    const topicConfig = { partitions: 1, replication: 1, ignoreRackAssignment: true };

    try {
      await admin.createTopic(topicName, topicConfig);
      console.log(`✅ Created Fluvio topic: ${topicName}`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`📦 Using existing Fluvio topic: ${topicName}`);
      } else {
        throw err;
      }
    }

    producer = await fluvio.topicProducer(topicName);
    consumer = await fluvio.partitionConsumer(topicName, 0);
    console.log('🔌 Connected to Fluvio cluster');
  } catch (err) {
    console.error('❌ Fluvio initialization error:', err);
    throw err;
  }
}

/**
 * Start HTTP and WebSocket servers after Fluvio is ready.
 */
async function startServers() {
  try {
    await initFluvio();

    // HTTP endpoint to send messages
    app.post('/send-message', async (req, res) => {
      if (!producer) {
        return res.status(503).json({ error: 'Fluvio not initialized' });
      }

      const { id, type, sender, message, timestamp } = req.body;
      const completeMsg = {
        id:        id || Date.now().toString(),
        type,
        sender,
        message,
        timestamp: timestamp || new Date().toISOString(),
      };

      try {
        // send uses (key, value)
        await producer.send(completeMsg.id, JSON.stringify(completeMsg));
        console.log('📤 Message sent:', completeMsg);
        res.json({ success: true });
      } catch (err) {
        console.error('Send error:', err);
        res.status(500).json({ error: err.message });
      }
    });

    // WebSocket for streaming events
    const wss = createWebSocketServer();
    wss.on('connection', async (ws) => {
      if (!consumer) {
        ws.send(JSON.stringify({ error: 'Fluvio not initialized' }));
        return ws.close();
      }

      try {
        // Stream from the end offset (latest) :contentReference[oaicite:6]{index=6}
        const stream = await consumer.createStream(Offset.FromEnd());
        for await (const record of stream) {
          if (ws.readyState === ws.OPEN) {
            ws.send(record.valueString());
          } else {
            break;
          }
        }
      } catch (err) {
        console.error('Stream error:', err);
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ error: 'Streaming error' }));
        }
      }
    });

    // Start HTTP server
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () => {
      console.log(`🌐 HTTP server listening on :${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start servers:', err);
    process.exit(1);
  }
}

// Initialize Fluvio when the function is first loaded
initFluvio().catch(console.error);

// Netlify Function handler for API endpoints
exports.handler = async function(event, context) {
  // Handle WebSocket upgrade requests
  if (event.httpMethod === 'GET' && event.headers.Upgrade === 'websocket') {
    return {
      statusCode: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade'
      }
    };
  }

  // Handle regular HTTP requests
  if (event.httpMethod === 'POST' && event.path === '/.netlify/functions/api/send-message') {
    if (!producer) {
      return {
        statusCode: 503,
        body: JSON.stringify({ error: 'Fluvio not initialized' })
      };
    }

    try {
      const body = JSON.parse(event.body);
      const { id, type, sender, message, timestamp } = body;
      const completeMsg = {
        id: id || Date.now().toString(),
        type,
        sender,
        message,
        timestamp: timestamp || new Date().toISOString(),
      };

      await producer.send(completeMsg.id, JSON.stringify(completeMsg));
      console.log('📤 Message sent:', completeMsg);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } catch (err) {
      console.error('Send error:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      };
    }
  }

  // Handle WebSocket connections
  if (event.httpMethod === 'GET' && event.path === '/.netlify/functions/ws') {
    if (!consumer) {
      return {
        statusCode: 503,
        body: JSON.stringify({ error: 'Fluvio not initialized' })
      };
    }

    try {
      const stream = await consumer.createStream(Offset.FromEnd());
      for await (const record of stream) {
        // Handle WebSocket message streaming
        // Note: This is a simplified version. In a real implementation,
        // you'd need to handle the WebSocket connection properly
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
  }

  // Default response for unhandled routes
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};

// Kickoff
startServers();
