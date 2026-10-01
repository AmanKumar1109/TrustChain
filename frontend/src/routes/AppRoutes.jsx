import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<LandingPage />} />
      <Route path="/for-brands" element={<LandingPage />} />
      <Route path="/rewards" element={<LandingPage />} />
      <Route path="/fraud-map" element={<LandingPage />} />
      <Route path="/pricing" element={<LandingPage />} />
      <Route path="/verify" element={<LandingPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
