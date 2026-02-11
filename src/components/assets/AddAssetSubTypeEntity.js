import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../layouts/Mainlayout';
import axios from 'axios';
import Toast from '../Toast';
import { UserContext } from '../../context/UserContext';
import ListAssetSubTypeEntity from './ListAssetSubTypeEntity'
import { useLocation } from 'react-router-dom';

const AddAssetSubTypeEntity = () => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const location = useLocation();
  const preselectedAssetSubTypeId = location.state?.selectedAssetSubTypeId || '';
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [assetSubType, setAssetSubType] = useState(preselectedAssetSubTypeId);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [refreshList, setRefreshList] = useState(false);
  const [assetSubTypes, setAssetSubTypes] = useState([]);
  useEffect(() => {
    const fetchAssetSubTypes = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
          {
            params: { type: 'getAssetSubTypes' },
            withCredentials: true,
          }
        );
        setAssetSubTypes(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch asset subtypes:', error);
        setToast({ message: 'Error fetching asset subtypes', type: 'error' });
      }
    };

    fetchAssetSubTypes();
  }, []);
  const handleAddAssetSubTypeEntity = () => {
    if (!code || !name || !assetSubType) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    axios.post(`${BASE_URL}/pages/asset/asset.ajax.php`, {
      type: 'addAssetSubTypeEntity',
      code,
      name,
      desc,
      assetSubType,
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
          setAssetSubType('');

          // Trigger list refresh
          setRefreshList(prev => !prev);
        } else {
          setToast({ message: res.message || "Failed to add asset sub type entity", type: "error" });
        }
      })
      .catch(error => {
        console.error("Axios error:", error);
        setToast({ message: "Server error occurred while adding asset sub type entity", type: "error" });
      });
  };

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Add Asset SubType Entity</h2>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        )}

        <div className="card mb-4 p-4 shadow-sm">
          <div className="form-group mb-3">
            <label>Linked Asset SubType</label>
            <select
              className="form-control"
              value={assetSubType}
              onChange={(e) => setAssetSubType(e.target.value)}
            >
              <option value="">-- Select Asset SubType --</option>
              {assetSubTypes.map((type) => (
                <option key={type.asset_subtype_id} value={type.asset_subtype_id}>
                  {type.asset_subtype_code} : {type.asset_subtype_name}
                  {/* {type.asset_subtype_id === preselectedAssetSubTypeId ? ' (Selected)' : ''} */}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label>Asset SubType Entity Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Code (eg. FFCH-1)"
              value={code}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                setCode(value);
              }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Asset SubType Entity Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Name (eg. Almirahs)"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          {!isViewMode && (<button className="btn btn-primary" onClick={handleAddAssetSubTypeEntity}>ADD</button>)}
        </div>

        <ListAssetSubTypeEntity refresh={refreshList} />
      </div>
    </MainLayout>
  );
};

export default AddAssetSubTypeEntity;
