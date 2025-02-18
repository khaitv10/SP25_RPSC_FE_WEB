import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Header component */}
        <Header />

        <div className="flex flex-1">
          {/* Sidebar component */}
          <Sidebar />

          <div className="flex-1 p-4 bg-gray-100 min-h-screen">
            {/* Define Routes here */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
