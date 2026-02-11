import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../layouts/Mainlayout';
import axios from 'axios';
import Toast from '../Toast';
import { UserContext } from '../../context/UserContext';
import ListAssetSubTypes from './ListAssetSubTypes'
import { useLocation } from 'react-router-dom';

const AddAssetSubType = () => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const location = useLocation();
  const preselectedAssetTypeId = location.state?.selectedAssetTypeId || '';
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [assetType, setAssetType] = useState(preselectedAssetTypeId);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [refreshList, setRefreshList] = useState(false);
  const [assetTypes, setAssetTypes] = useState([]);
  useEffect(() => {
    const fetchAssetTypes = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
          {
            params: { type: 'getAssetTypes' },
            withCredentials: true,
          }
        );
        setAssetTypes(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch asset types:', error);
        setToast({ message: 'Error fetching asset types', type: 'error' });
      }
    };

    fetchAssetTypes();
  }, []);
  const handleAddAssetSubType = () => {
    if (!code || !name || !assetType) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    axios.post(`${BASE_URL}/pages/asset/asset.ajax.php`, {
      type: 'addAssetSubType',
      code,
      name,
      desc,
      assetType,
      created_by: user.id,
    }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then(response => {
        const res = response.data;

        if (res.status === 'success') {
          setToast({ message: res.message, type: 'success' });

          // Reset form
          setCode('');
          setName('');
          setDesc('');
          setAssetType('');

          // Trigger list refresh
          setRefreshList(prev => !prev);
        } else {
          setToast({ message: res.message || "Failed to add asset sub type", type: "error" });
        }
      })
      .catch(error => {
        console.error("Axios error:", error);
        setToast({ message: "Server error occurred while adding asset sub type", type: "error" });
      });
  };

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Add Asset SubType</h2>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        )}

        <div className="card mb-4 p-4 shadow-sm">
          <div className="form-group mb-3">
            <label>Linked Asset Type</label>
            <select
              className="form-control"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option value="">-- Select Asset Type --</option>
              {assetTypes.map((type) => (
                <option key={type.asset_type_id} value={type.asset_type_id}>
                  {type.asset_type_code} : {type.asset_type_name}
                  {/* {type.asset_type_id === preselectedAssetTypeId ? ' (Selected)' : ''} */}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label>Asset SubType Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Code (eg. FCH-0)"
              value={code}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                if (value === '' || /^[A-Z]*-?0?$/.test(value)) {
                  setCode(value)
                }
              }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Asset SubType Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Name"
              value={name}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setName(value)
              }}
            />
          </div>
          {/* <div className="form-group mb-3">
            <label>Asset SubType Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div> */}

          {!isViewMode && (<button className="btn btn-primary" onClick={handleAddAssetSubType}>ADD</button>)}
        </div>

        <ListAssetSubTypes refresh={refreshList} />
      </div>
    </MainLayout>
  );
};

export default AddAssetSubType;
