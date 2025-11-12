import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/Mainlayout'

const actions = [
  { name: "Add Asset Type", icon: "bi-folder-plus", route: "/assets/add-assettype" },//route: "/assets/add-subtype" },
  { name: "Add Asset SubType", icon: "bi-folder2-open", route: "/assets/add-assetsubtype" },//route: "/assets/add-subtypeentity" },
  { name: "Add Asset SubTypeEntity", icon: "bi-tags", route: "/assets/add-assetsubtypeentity" },//route: "/assets/add-subtypeentitynodes" },
  { name: "Add Asset SubTypeEntityNode", icon: "bi-diagram-3", route: "/assets/add-assetsubtypeentitynode" },//route: "/assets/add-subtypeentitynodes" },
  { name: "Add Asset", icon: "bi-box-seam", route: "/assets/add-asset" },//route: "/assets/add-asset" },
  { name: "List Asset", icon: "bi-table", route: "/assets/list-asset" },//route: "/assets/add-asset" },
];
const cardColors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];
const AssetDashboard = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="container py-4">
        <h3 className="mb-4 text-primary">Asset Dashboard</h3>
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

export default AssetDashboard;