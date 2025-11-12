import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../../layouts/Mainlayout';
import Toast from '../../components/Toast';
import { UserContext } from '../../context/UserContext';
import ListBuilding from './ListBuilding';

const AddBuilding = () => {
  const { user } = useContext(UserContext);

  const [buildingData, setBuildingData] = useState({
    buildingName: '',
    buildingDesc: '',
    landId: '',
    numberOfStories: '',
    wallType: '',
    roofType: '',
  });

  const [lands, setLands] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [refreshList, setRefreshList] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuildingData(prev => ({ ...prev, [name]: value }));
  };

  const fetchLands = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, 
        {
          params: { type: 'getLands' },
          withCredentials: true,
        });
      if (response.data.data) {
        setLands(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch lands", error);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const handleAddBuilding = async () => {
    if (!buildingData.buildingName.trim() || !buildingData.landId) {
      setToast({ message: "Building Name and Land are required.", type: "error" });
      return;
    }

    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(`${BASE_URL}/pages/misc/misc.ajax.php`, {
        type: 'addBuilding',
        ...buildingData,
        created_by: user.id,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.status) {
        setToast({ message: 'Building added successfully!', type: 'success' });
        setBuildingData({
          buildingName: '',
          buildingDesc: '',
          landId: '',
          numberOfStories: '',
          wallType: '',
          roofType: '',
        });
        setRefreshList(prev => !prev);
      } else {
        setToast({ message: response.data.message || 'Failed to add building.', type: 'error' });
      }
    } catch (error) {
      console.error("Error adding building:", error);
      setToast({ message: "Server error while adding building.", type: "error" });
    }
  };

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Add Building</h2>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        )}

        <div className="card p-4 shadow-sm">
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <label>Associated Land</label>
              <select
                name="landId"
                className="form-control"
                value={buildingData.landId}
                onChange={handleChange}
              >
                <option value="">Select Land</option>
                {lands.map(land => (
                  <option key={land.land_id} value={land.land_id}>
                    {land.land_name}
                  </option>
                ))}
              </select>
            </div>

            {[
              { label: "Building Name", name: "buildingName" },
              { label: "Building Description", name: "buildingDesc" },
              { label: "Number of Stories", name: "numberOfStories" },
              { label: "Wall Type", name: "wallType" },
              { label: "Roof Type", name: "roofType" },
            ].map(field => (
              <div className="form-group mb-3 col-md-6" key={field.name}>
                <label>{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  className="form-control"
                  placeholder={`Enter ${field.label}`}
                  value={buildingData[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}


          </div>

          <button className="btn btn-primary mt-3" onClick={handleAddBuilding}>
            ADD
          </button>
        </div>
        <ListBuilding refresh={refreshList} />
      </div>
    </MainLayout>
  );
};

export default AddBuilding;
