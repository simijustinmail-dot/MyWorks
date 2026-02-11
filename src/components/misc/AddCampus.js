import React, { useState, useContext } from 'react';
import MainLayout from '../../layouts/Mainlayout';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import ListCampuses from './ListCampuses';
import Toast from '../Toast';

const AddCampus = () => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const [campusname, setCampusName] = useState('');
  const [campusdesc, setCampusDesc] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [refreshList, setRefreshList] = useState(false);

  const handleAddCampus = async () => {
    if (!campusname.trim()) {
      setToast({ message: "Campus name is required", type: "error" });
      return;
    }

    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(`${BASE_URL}/pages/misc/misc.ajax.php`, {
        type: 'addCampus',
        campusname,
        campusdesc,
        created_by: user.id,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.status) {
        setToast({ message: "Campus added successfully!", type: "success" });
        setCampusName('');
        setCampusDesc('');
        setRefreshList(prev => !prev);
      } else {
        setToast({ message: response.data.message || "Failed to add campusre", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Error connecting to server.", type: "error" });
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Add Campus</h2>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        )}

        <div className="card mb-4 p-4 shadow-sm">
          <div className="form-group mb-3">
            <label>Campus Name</label>
            <input type="text" className="form-control" placeholder="Enter the Campus Name"
              value={campusname} onChange={(e) => setCampusName(e.target.value)} />
          </div>
          <div className="form-group mb-3">
            <label>Campus Description</label>
            <input type="text" className="form-control" placeholder="Enter the Campus Description"
              value={campusdesc} onChange={(e) => setCampusDesc(e.target.value)} />
          </div>
          {!isViewMode && (<button className="btn btn-primary" onClick={handleAddCampus}>ADD</button>)}
        </div>

        <ListCampuses refresh={refreshList} />
      </div>
    </MainLayout>
  );
};

export default AddCampus;
