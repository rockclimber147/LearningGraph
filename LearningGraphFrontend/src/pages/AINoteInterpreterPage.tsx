import { useState, useEffect, useRef } from 'react';

const SummaryPage = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Idle');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const socketRef = useRef(new WebSocket('ws://localhost:5000/ws/summarize'));

  const startSummarization = () => {
    if (!input) return;

    setSummary('');
    setIsProcessing(true);
    setStatus('Connecting...');

    socketRef.current = new WebSocket('ws://localhost:5000/ws/summarize');

    socketRef.current.onopen = () => {
      setStatus('Sending data...');
      socketRef.current.send(input);
    };

    socketRef.current.onmessage = (event) => {
      const data = event.data;

      if (data.startsWith('QUEUE_STATUS:')) {
        setStatus(data.replace('QUEUE_STATUS: ', ''));
      } 
      else if (data === 'EOF') {
        setStatus('Finished');
        setIsProcessing(false);
        socketRef.current.close();
      } 
      else if (data.startsWith('ERROR:')) {
        setStatus('Error occurred');
        console.error(data);
        setIsProcessing(false);
      } 
      else {
        setSummary((prev) => prev + data);
      }
    };

    socketRef.current.onclose = () => {
      setIsProcessing(false);
    };

    socketRef.current.onerror = (err) => {
      console.error('WebSocket Error:', err);
      setStatus('Connection Error');
      setIsProcessing(false);
    };
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>AI Summarizer</h2>
      
      <textarea
        rows={10}
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="Paste your notes here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isProcessing}
      />

      <button 
        onClick={startSummarization} 
        disabled={isProcessing || !input}
      >
        {isProcessing ? 'Summarizing...' : 'Summarize'}
      </button>

      <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <p><strong>Status:</strong> {status}</p>
        <div style={{ background: '#272727', padding: '15px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
          {summary || "Your summary will appear here..."}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;