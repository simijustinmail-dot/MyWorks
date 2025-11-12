import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/Mainlayout'

const actions = [
  { name: "Add Campus", icon: "bi-building", route: "/misc/add-campus" },
  { name: "Add Land", icon: "bi-map", route: "/misc/add-land" },
  { name: "Add Building", icon: "bi-house-add", route: "/misc/add-building" },//route: "/misc/add-building" },
  { name: "Add Floor", icon: "bi-layers", route: "/misc/add-floor" },//route: "/misc/add-floor" },
  { name: "Add Room", icon: "bi-door-closed", route: "/misc/add-room" },//route: "/misc/add-room" },
  { name: "Add Section", icon: "bi-diagram-3", route: "/misc/add-section" },//route: "/misc/add-section" },
  { name: "Add Seat", icon: "bi-person-fill", route: "/misc/add-seat" },//route: "/misc/add-seat" },
];
const cardColors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];
const MiscDashboard = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container py-4">
        <h3 className="mb-4 text-primary">Location Dashboard</h3>
        <div className="row">
          {actions.map((action, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div
                className={`card text-center text-white bg-${cardColors[i % cardColors.length]} shadow h-100`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(action.route)}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <i className={`bi ${action.icon} fs-1`}></i>
                  <h5 className="mt-3">{action.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default MiscDashboard;