import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PageList from './Components/PageList';
import Checkout from './Components/Checkout';
import ContactPage from './Components/ContactPage';
import SuccessPage from './Components/SuccessPage';
import FailurePage from './Components/FailurePage';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PageList />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<FailurePage />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;