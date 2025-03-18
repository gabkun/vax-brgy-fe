import Signup from "./Components/User/Signup.jsx";
import Homepage from "./Components/Homepage/Homepage.jsx";
import PrivateRoute from "./routes/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./Components/User/Login.jsx";
import Dashboard from "./Components/Dashboard/Admindashboard.jsx";
import Infant from "./Components/Dashboard/Infant.jsx";
import Vaccination from './Components/Dashboard/Vaccination.jsx';
import VaccinationList from './Components/Dashboard/Vaccinelist.jsx'
import VerificationCodeInput from "./Components/Verification/Verification.jsx";
import SignupSuccessPage from "./Components/User/Success.jsx";
import HworkerDashboard from "./Components/Healthworker/Healthworkerdashboard.jsx";
import HealthWorkerManagement from "./Components/Dashboard/Healthworker.jsx";
import HealthInfant from "./Components/Healthworker/Infant.jsx";
import HealthVaccination from "./Components/Healthworker/Vaccination.jsx";
import HealthVaccine from "./Components/Healthworker/Vaccinelist.jsx";
import PurokManagement from "./Components/Dashboard/Puroks.jsx";

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/healthworker" element={<HworkerDashboard />} />
        <Route path="/puroks" element={<PurokManagement />} />
        <Route path="/success" element={<SignupSuccessPage />} />
        <Route path="/verify" element={<VerificationCodeInput />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/workerlist" element={<PrivateRoute><HealthWorkerManagement /></PrivateRoute>} />
        <Route path="/vaccinelist" element={<PrivateRoute><VaccinationList /></PrivateRoute>} />
        <Route path="/vaccination" element={<PrivateRoute><Vaccination /></PrivateRoute>} />
        <Route path="/infant" element={<PrivateRoute><Infant /></PrivateRoute>} />
        <Route path="/healthworker/vaccinelist" element={<PrivateRoute><HealthVaccine /></PrivateRoute>} />
        <Route path="/healthworker/vaccination" element={<PrivateRoute><HealthVaccination /></PrivateRoute>} />
        <Route path="/healthworker/infant" element={<PrivateRoute><HealthInfant /></PrivateRoute>} />

      </Routes>
    </Router>
    </>
  );
}

export default App;