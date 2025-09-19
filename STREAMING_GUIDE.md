# 🚀 LiveKit Agent Streaming Guide

This guide explains how to use the enhanced streaming capabilities that pipe LiveKit agent data through the Flask server to your frontend applications.

## 🔄 Architecture Overview

```
Frontend ↔ LiveKit Cloud ↔ Voice Agent
    ↓           ↓              ↓
Frontend ← Flask Server ← Voice Agent
    (SSE Stream)   (HTTP POST)
```

### Current Flow:
1. **Direct LiveKit Connection**: Frontend connects directly to LiveKit rooms for real-time audio/video
2. **Enhanced Streaming**: Agent also sends data to Flask server for additional streaming capabilities
3. **Dual Channel**: You get both LiveKit's native real-time features AND server-side event streaming

## 📡 New Streaming Endpoints

### Server-Sent Events (SSE) Stream
```http
GET http://localhost:5000/api/stream
```
- **Type**: Server-Sent Events
- **Purpose**: Real-time streaming of agent events to frontend
- **Connection**: Long-lived HTTP connection
- **Format**: JSON messages via SSE

### Agent Data Receiver
```http
POST http://localhost:5000/api/agent/data
Content-Type: application/json

{
  "type": "transcript",
  "text": "Hello, how can I help you?",
  "participant": "agent_123",
  "timestamp": 1695123456.789
}
```

## 🎯 Event Types

The streaming system broadcasts these event types:

### 1. Transcript Events
```json
{
  "type": "transcript",
  "text": "User said something",
  "participant": "voice_assistant_user_1234",
  "timestamp": 1695123456.789
}
```

### 2. Agent Speech Events
```json
{
  "type": "agent_speech_started",
  "timestamp": 1695123456.789
}
```

```json
{
  "type": "agent_speech_finished", 
  "timestamp": 1695123456.789
}
```

### 3. Custom Agent Data
```json
{
  "type": "agent_ready",
  "message": "Voice agent is ready and listening"
}
```

### 4. Heartbeat (Keep-Alive)
```json
{
  "type": "heartbeat",
  "timestamp": 1695123456.789
}
```

## 💻 Frontend Integration

### JavaScript/Browser Example
```javascript
// Connect to the event stream
const eventSource = new EventSource('http://localhost:5000/api/stream');

eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'transcript':
            displayTranscript(data.text, data.participant);
            break;
        case 'agent_speech_started':
            showAgentSpeaking();
            break;
        case 'agent_speech_finished':
            hideAgentSpeaking();
            break;
        default:
            console.log('Agent event:', data);
    }
};

eventSource.onerror = function(event) {
    console.log('Connection error, reconnecting...');
};
```

### React Hook Example
```jsx
import { useEffect, useState } from 'react';

function useAgentStream() {
    const [events, setEvents] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/api/stream');
        
        eventSource.onopen = () => setIsConnected(true);
        eventSource.onerror = () => setIsConnected(false);
        
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setEvents(prev => [...prev, { ...data, id: Date.now() }]);
        };

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, []);

    return { events, isConnected };
}
```

### Next.js API Route Example
```javascript
// pages/api/agent-proxy.js
export default function handler(req, res) {
    if (req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        // Proxy the Flask SSE stream
        const eventSource = new EventSource('http://localhost:5000/api/stream');
        
        eventSource.onmessage = (event) => {
            res.write(`data: ${event.data}\n\n`);
        };

        req.on('close', () => {
            eventSource.close();
        });
    }
}
```

## 🧪 Testing the Stream

### 1. Test with Browser
Open `stream-test.html` in your browser:
```bash
open /Users/sanatmouli/Projects/Rush-Hour/stream-test.html
```

### 2. Test with curl
```bash
# Stream events
curl -N http://localhost:5000/api/stream

# Send test data
curl -X POST http://localhost:5000/api/agent/data \
  -H "Content-Type: application/json" \
  -d '{"type":"test","message":"Hello from curl"}'
```

### 3. Test with Python
```python
import requests
import json
import time

# Send test events
def send_test_event():
    response = requests.post('http://localhost:5000/api/agent/data', 
        json={
            "type": "test_transcript",
            "text": "This is a test message",
            "timestamp": time.time()
        })
    print(f"Sent event, notified {response.json()['clients_notified']} clients")

# Listen to stream
def listen_to_stream():
    response = requests.get('http://localhost:5000/api/stream', stream=True)
    for line in response.iter_lines():
        if line.startswith(b'data: '):
            data = json.loads(line[6:])  # Remove 'data: ' prefix
            print(f"Received: {data}")

# Run listener in separate thread
import threading
threading.Thread(target=listen_to_stream, daemon=True).start()

# Send some test events
for i in range(5):
    send_test_event()
    time.sleep(2)
```

## 🔧 Use Cases

### 1. Real-time Analytics Dashboard
Stream conversation data to analytics dashboards for monitoring agent performance, user engagement, and conversation metrics.

### 2. Live Transcription Display
Show real-time transcriptions on web pages, mobile apps, or external displays for accessibility or documentation purposes.

### 3. Multi-Client Broadcasting
Send agent events to multiple connected clients simultaneously - perfect for team monitoring or collaborative applications.

### 4. External System Integration
Forward agent events to webhooks, databases, or third-party services for logging, analysis, or triggering workflows.

### 5. Custom UI Updates
Update custom UI components based on agent state changes (speaking, listening, processing) for better user experience.

## 🚀 Getting Started

1. **Start the Flask server**:
   ```bash
   cd livekit-voice-agent
   uv run flask_server.py
   ```

2. **Start the enhanced agent**:
   ```bash
   curl -X POST http://127.0.0.1:5000/api/agent/start
   ```

3. **Connect to the stream**:
   ```javascript
   const eventSource = new EventSource('http://localhost:5000/api/stream');
   eventSource.onmessage = (event) => console.log(JSON.parse(event.data));
   ```

4. **Test the connection**:
   Open `stream-test.html` to see live events as they happen!

## 🔒 Security Considerations

- **CORS**: Currently configured for development (`Access-Control-Allow-Origin: *`)
- **Authentication**: Consider adding API keys or JWT tokens for production
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Validation**: Validate incoming agent data before broadcasting

## 🎉 Benefits

✅ **Real-time**: Events stream instantly as they happen  
✅ **Scalable**: Multiple clients can connect simultaneously  
✅ **Flexible**: Works with any frontend framework  
✅ **Reliable**: Auto-reconnection and heartbeat monitoring  
✅ **Dual Channel**: Complements existing LiveKit features  
✅ **Easy Integration**: Standard SSE/HTTP protocols  

The streaming system provides a powerful way to extend LiveKit's capabilities while maintaining all the real-time audio/video features you already have!
