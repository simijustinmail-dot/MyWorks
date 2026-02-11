import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/Mainlayout';
import { UserContext } from "../context/UserContext";


const actions = [
  { name: "Add Asset Type", icon: "bi-folder-plus", route: "/assets/add-assettype" , color: "primary" },//route: "/assets/add-subtype" },
  { name: "Add Asset SubType", icon: "bi-folder2-open", route: "/assets/add-assetsubtype" , color: "primary" },//route: "/assets/add-subtypeentity" },
  { name: "Add Asset SubTypeEntity", icon: "bi-tags", route: "/assets/add-assetsubtypeentity" , color: "primary" },//route: "/assets/add-subtypeentitynodes" },
  { name: "Add Asset SubTypeEntityNode", icon: "bi-diagram-3", route: "/assets/add-assetsubtypeentitynode" , color: "primary" },//route: "/assets/add-subtypeentitynodes" },
  { name: "Add Asset", icon: "bi-box-seam", route: "/assets/add-asset" , color: "success" ,  excludeRoles: ["SectionAdmin"]},//route: "/assets/add-asset" },
  { name: "List Asset", icon: "bi-table", route: "/assets/list-asset" , color: "secondary" },//route: "/assets/add-asset" },
  { name: "Bulk Update Asset", icon: "bi-layers", route: "/assets/bulkupdate-asset" , color: "warning" ,  excludeRoles: ["SectionAdmin"] }
];

//const cardColors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];
const AssetDashboard = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const visibleActions = actions.filter(action => { //hide menu for excludedroles for ex: sectionadmin wont see bulk update menu
    if (!action.excludeRoles) return true;
    return !action.excludeRoles.includes(userRole);
  });
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="container py-4">
        <h3 className="mb-4 text-primary">Asset Dashboard</h3>
        <div className="row">
          {visibleActions.map((action, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div
                className={`card text-center text-white bg-${action.color} shadow h-100`}
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