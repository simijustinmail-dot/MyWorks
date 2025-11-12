import React, { useState, useContext } from 'react';
import MainLayout from '../../layouts/Mainlayout';
import axios from 'axios';
import Toast from '../Toast';
import { UserContext } from '../../context/UserContext';
import ListAssetTypes from './ListAssetTypes';

const AddAssetType = () => {
  const { user } = useContext(UserContext);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [assetclass, setAssetClass] = useState('Tangible');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [refreshList, setRefreshList] = useState(false); 

  const handleAddAssetType = () => {
    if (!code || !name) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    const payloadClass = assetclass === 'Tangible' ? 'T' : 'I';
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    axios.post(`${BASE_URL}/pages/asset/asset.ajax.php`, {
      type: 'addAssetType',
      code,
      name,
      desc,
      assetclass: payloadClass,
      created_by: user.id,
    },{withCredentials: true})
      .then(response => {
        const res = response.data;

        if (res.status === 'success') {
          setToast({ message: res.message, type: 'success' });

          // Reset form
          setCode('');
          setName('');
          setDesc('');
          setAssetClass('Tangible');

          // Trigger list refresh
          setRefreshList(prev => !prev);
        } else {
          setToast({ message: res.message || "Failed to add asset type", type: "error" });
        }
      })
      .catch(error => {
        console.error("Axios error:", error);
        setToast({ message: "Server error occurred while adding asset type", type: "error" });
      });
  };

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Add Asset Type</h2>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        )}

        <div className="card mb-4 p-4 shadow-sm">
          <div className="form-group mb-3">
            <label>Asset Type Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Code"
              value={code}
              onChange={(e) => 
                {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                setCode(value)
                }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Asset Type Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label>Asset Type Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label>Asset Class</label><br />
            <button
              className={`btn me-2 ${assetclass === 'Tangible' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setAssetClass('Tangible')}
            >
              Tangible
            </button>
            <button
              className={`btn ${assetclass === 'Intangible' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setAssetClass('Intangible')}
            >
              Intangible
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleAddAssetType}>ADD</button>
        </div>


        <ListAssetTypes refresh={refreshList} />
      </div>
    </MainLayout>
  );
};

export default AddAssetType;
