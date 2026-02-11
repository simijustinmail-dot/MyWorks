import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../layouts/Mainlayout';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import Toast from '../../components/Toast';
import ListLand from './ListLand';

const AddLand = () => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const [landData, setLandData] = useState({
    landName: '',
    landDesc: '',
    surveyNo: '',
    village: '',
    area: '',
    location: '',
    boundaries: '',
    acquisitionType: '',
    ownerName: '',
    registrationDetails: '',
    campus: ''
  });

  const [toast, setToast] = useState({ message: '', type: '' });
  const [refreshList, setRefreshList] = useState(false);
  const [campuses, setCampuses] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLandData(prev => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
          {
            params: { type: 'getCampuses' },
            withCredentials: true,
          }
        );
        setCampuses(response.data.campuses || []);
      } catch (error) {
        console.error('Error fetching campuses:', error);
      }
    };

    fetchCampuses();
  }, []);
  const handleAddLand = async () => {
    if (!landData.landName.trim()) {
      setToast({ message: "Land name is required", type: "error" });
      return;
    }
    if (!landData.campus) {
      setToast({ message: 'Please select a campus', type: "error" });
    }

    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(`${BASE_URL}/pages/misc/misc.ajax.php`, {
        type: 'addLand',
        ...landData,
        created_by: user.id
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        setToast({ message: "Land added successfully!", type: "success" });
        setLandData({
          landName: '',
          landDesc: '',
          surveyNo: '',
          village: '',
          area: '',
          areaUnit: '',
          location: '',
          boundaries: '',
          acquisitionType: '',
          ownerName: '',
          registrationDetails: '',
          campus: ''
        });
        setRefreshList(prev => !prev);
      } else {
        setToast({ message: response.data.message || "Failed to add land ", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Error connecting to server.", type: "error" });
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Add Land</h2>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        )}

        <div className="card p-4 shadow-sm mb-4">
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <label>Associated Campus</label>
              <select
                className="form-control"
                name="campus"
                value={landData.campus}
                onChange={handleChange}
              >
                <option value="">-- Select Campus --</option>
                {campuses.map(campus => (
                  <option key={campus.campus_id} value={campus.campus_id}>
                    {campus.campus_name}
                  </option>
                ))}
              </select>
            </div>
            {[
              { label: "Land Name", name: "landName" },
              { label: "Land Description", name: "landDesc" },
              { label: "Survey No", name: "surveyNo" },
              { label: "Village", name: "village" },
              { label: "Area of Land", name: "area" },
              { label: "Location", name: "location" },
              { label: "Boundaries", name: "boundaries" },
              { label: "Acquisition Type", name: "acquisitionType" },
              { label: "Owner Name", name: "ownerName" },
              { label: "Registration Details", name: "registrationDetails" },
            ].map(field => (
              field.name === "area" ? (
                <div className="form-group mb-3 col-md-6" key="area">
                  <label>Area of Land</label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      name="area"
                      className="form-control"
                      placeholder="Enter Area"
                      value={landData.area}
                      onChange={handleChange}
                    />
                    <select
                      name="areaUnit"
                      className="form-control"
                      value={landData.areaUnit}
                      onChange={handleChange}
                      style={{ maxWidth: '120px' }}
                    >
                      <option value="" disabled>
                        Select Unit
                      </option>
                      <option value="Cent">Cent</option>
                      <option value="Acre">Acre</option>
                      <option value="Are">Are</option>
                      <option value="Hectare">Hectare</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="form-group mb-3 col-md-6" key={field.name}>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    className="form-control"
                    placeholder={`Enter ${field.label}`}
                    value={landData[field.name]}
                    onChange={handleChange}
                  />
                </div>
              )
            ))}
          </div>

          {!isViewMode && (<button className="btn btn-primary mt-3" onClick={handleAddLand}>ADD</button>)}
        </div>

        <ListLand refresh={refreshList} />
      </div>
    </MainLayout>
  );
};

export default AddLand;
