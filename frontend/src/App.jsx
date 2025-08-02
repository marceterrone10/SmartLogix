import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatTicket from './pages/ChatTicket';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/chat" 
          element={
            <PrivateRoute>
              <ChatTicket />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
