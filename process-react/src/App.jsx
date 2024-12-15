import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Authorization from './Components/screens/authorization/Authorization'
import AuthProvider from './providers/AuthProvider.jsx';
import AdminMain from './Components/screens/adminMain/AdminMain';
import UserMain from './Components/screens/userMain/UserMain.jsx';
import UserProfile from './Components/screens/userProfile/UserProfile.jsx';
import ProcessView from './Components/screens/processView/ProcessView.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Authorization />} path='/authorization' />
          <Route path="/" element={<Navigate to="/authorization" replace />} />
          <Route element={<AdminMain />} path='/adminMain' />
          <Route path='*' element={<div>Not found</div>} />
          <Route element={<UserMain />} path='/userMain' />
          <Route element={<UserProfile />} path='/userProfile' />
          <Route element={<ProcessView />} path='/processView' />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;