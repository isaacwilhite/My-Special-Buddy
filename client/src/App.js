import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChatProvider } from './components/ChatContext';
import AppRouter from './components/Router';

function App() {
  return (
    <ChatProvider>
      <Router>
        <AppRouter />
      </Router>
    </ChatProvider>
  );
}

export default App;