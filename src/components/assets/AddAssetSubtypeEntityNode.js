import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../layouts/Mainlayout';
import axios from 'axios';
import Toast from '../Toast';
import { UserContext } from '../../context/UserContext';
import ListAssetSubTypeEntityNodes from './ListAssetTypeEntityNodes'
import { useLocation } from 'react-router-dom';

const AddAssetSubTypeEntityNode = () => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
    const location = useLocation();
  const preselectedAssetSubTypeEntityId = location.state?.selectedAssetSubTypeEntityId || '';
  const [assetSubTypeEntity, setAssetSubTypeEntity] = useState(preselectedAssetSubTypeEntityId);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [refreshList, setRefreshList] = useState(false);
  const [assetSubTypeEntities, setAssetSubTypeEntities] = useState([]);
  useEffect(() => {
    const fetchAssetSubTypeEntities = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
          {
            params: { type: 'getAssetSubTypeEntity' },
            withCredentials: true,
          }
        );
        setAssetSubTypeEntities(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch asset subtype entities:', error);
        setToast({ message: 'Error fetching asset subtype entities', type: 'error' });
      }
    };

    fetchAssetSubTypeEntities();
  }, []);
  const handleAddAssetSubTypeEntityNode = () => {
    if (!code || !name || !assetSubTypeEntity) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    axios.post(`${BASE_URL}/pages/asset/asset.ajax.php`, {
      type: 'addAssetSubTypeEntityNode',
      code,
      name,
      desc,
      assetSubTypeEntity,
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
          setAssetSubTypeEntity('');

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
        <h2 className="text-center mb-4">Add Asset SubType Entity Node</h2>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        )}

        <div className="card mb-4 p-4 shadow-sm">
          <div className="form-group mb-3">
            <label>Linked Asset SubType Entity</label>
            <select
              className="form-control"
              value={assetSubTypeEntity}
              onChange={(e) => setAssetSubTypeEntity(e.target.value)}
            >
              <option value="">-- Select Asset SubType Entity --</option>
              {assetSubTypeEntities.map((type) => (
                <option key={type.asset_subtype_entity_id} value={type.asset_subtype_entity_id}>
                  {type.asset_subtype_entity_code} : {type.asset_subtype_entity_name}
                  {/* {type.asset_subtype_entity_id === preselectedAssetSubTypeEntityId ? ' (Selected)' : ''} */}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label>Asset SubType EntityNode Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Code (eg. FFCH-1-1)"
              value={code}
               onChange={(e) => 
                {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                setCode(value)
                }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Asset SubType EntityNode Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Name (eg. Steel almirah with glass door)"
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

          {!isViewMode && (<button className="btn btn-primary" onClick={handleAddAssetSubTypeEntityNode}>ADD</button>)}
        </div>

        <ListAssetSubTypeEntityNodes refresh={refreshList} />
      </div>
    </MainLayout>
  );
};

export default AddAssetSubTypeEntityNode;
