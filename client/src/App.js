import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChatProvider } from './components/ChatContext';
import AppRouter from './components/Router';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';

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