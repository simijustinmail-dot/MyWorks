import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Logout from './pages/Logout';
import Miscellaneous from './pages/MiscDashboard';
import AddCampus from './components/misc/AddCampus';
import AddLand from './components/misc/AddLand';
import AddBuilding from './components/misc/AddBuilding';
import AddFloor from './components/misc/AddFloor';
import AddRoom from './components/misc/AddRoom';
import AddSection from './components/misc/AddSection';
import AddSeat from './components/misc/AddSeat';
import Assets from './pages/AssetDashboard';
import AddAssetType from './components/assets/AddAssetType';
import AddAssetSubType from './components/assets/AddAssetSubType';
import AddAssetSubTypeEntity from './components/assets/AddAssetSubTypeEntity';
import AddAssetSubtypeEntityNode from './components/assets/AddAssetSubtypeEntityNode';
import AddAsset from './components/assets/EditAsset';
import ListAssets from './components/assets/ListAssets';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/misc" element={<ProtectedRoute><Miscellaneous /></ProtectedRoute>} />
        <Route path="/misc/add-campus" element={<ProtectedRoute><AddCampus /></ProtectedRoute>} />
        <Route path="/misc/add-land" element={<ProtectedRoute><AddLand /></ProtectedRoute>} />
        <Route path="/misc/add-building" element={<ProtectedRoute><AddBuilding /></ProtectedRoute>} />
        <Route path="/misc/add-floor" element={<ProtectedRoute><AddFloor /></ProtectedRoute>} />
        <Route path="/misc/add-room" element={<ProtectedRoute><AddRoom /></ProtectedRoute>} />
        <Route path="/misc/add-section" element={<ProtectedRoute><AddSection /></ProtectedRoute>} />
        <Route path="/misc/add-seat" element={<ProtectedRoute><AddSeat /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
        <Route path="/assets/add-assettype" element={<ProtectedRoute><AddAssetType /></ProtectedRoute>} />
        <Route path="/assets/add-assetsubtype" element={<ProtectedRoute><AddAssetSubType /></ProtectedRoute>} />
        <Route path="/assets/add-assetsubtypeentity" element={<ProtectedRoute><AddAssetSubTypeEntity /></ProtectedRoute>} />
        <Route path="/assets/add-assetsubtypeentitynode" element={<ProtectedRoute><AddAssetSubtypeEntityNode /></ProtectedRoute>} />
        <Route path="/assets/add-asset" element={<ProtectedRoute><AddAsset /></ProtectedRoute>} />
        <Route path="/assets/list-asset" element={<ProtectedRoute><ListAssets /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
