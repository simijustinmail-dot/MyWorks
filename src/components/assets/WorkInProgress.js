import React from 'react';
import MainLayout from '../../layouts/Mainlayout';

export default function WorkInProgress() {
  return (
    <MainLayout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center p-4 border rounded shadow-sm bg-light">
          <i className="bi bi-tools text-warning" style={{ fontSize: '3rem' }}></i>
          <h2 className="mt-3">Page Under Construction</h2>
          <p className="text-muted">
            We're currently building this page. Please check back later!
          </p>
        </div>
      </div>
    </MainLayout>
  );
}