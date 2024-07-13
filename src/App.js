import logo from './logo.svg';
import './App.css';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DetailPage from './components/DetailPage';

function App() {
  return (
    <div className='App' >
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/detail/:id" element={<DetailPage />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
