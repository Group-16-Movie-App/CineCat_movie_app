import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignUpForm } from './components/SignUpForm';

function App() {
  return (
    <Router>
      <div className="App">
        <h3>Movie app</h3>
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;