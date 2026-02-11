import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Toast from '../Toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';


const ListAssetTypes = ({ refresh }) => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const [assetList, setAssetList] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const fetchAssetTypes = async () => {
    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      // const response = await axios.get(`${BASE_URL}/pages/asset/view_assettypes.php`, {
      //   headers: { 'Content-Type': 'application/json' },
      //   withCredentials: true,
      // });
      const response = await axios.get(`${BASE_URL}/pages/asset/asset.ajax.php`,
        {
          params: { type: 'getAssetTypes' },
          withCredentials: true,
        });

      if (response.data.status === 'success') {
        setAssetList(response.data.data || []);
      } else {
        console.warn("Error fetching data:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchAssetTypes();
  }, [refresh]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Asset Type?")) return;

    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.post(
        `${BASE_URL}/pages/asset/asset.ajax.php`,
        {
          id,
          type: 'deleteAssetType'
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setToast({ message: 'Asset Type deleted successfully!', type: 'warning' });
        await fetchAssetTypes(); // Refresh the list after delete
      } else {
        setToast({ message: res.data.message || 'Failed to delete Asset Type.', type: 'error' });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setToast({ message: 'Server error while deleting.', type: 'error' });
    }
  };
  return (
    <div className="mt-4">
      <h4 className="text-center mb-3">View Asset Types</h4>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Sl. No</th>
            <th>Code</th>
            <th>Asset Type</th>
            <th>Description</th>
            <th>Asset Class</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assetList.length > 0 ? (
            assetList.map((item, index) => (
              <tr key={item.asset_type_id || index}>
                <td>{index + 1}</td>
                <td>{item.asset_type_code}</td>
                <td>{item.asset_type_name}</td>
                <td>{item.asset_type_desc}</td>
                <td>{item.asset_class === 'T' ? 'Tangible' : 'Intangible'}</td>
                <td className="d-flex gap-2">
                  {!isViewMode && (<button
                    className="btn btn-sm btn-success me-2"
                    onClick={() =>
                      navigate('/assets/add-assetsubtype', {
                        state: {
                          selectedAssetTypeId: item.asset_type_id,
                          selectedAssetTypeCode: item.asset_type_code,
                          selectedAssetTypeName: item.asset_type_name
                        }
                      })
                    }
                  >
                    Add Subtype
                  </button>)}
                  {!isViewMode && (<button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.asset_type_id)}
                  >
                    Delete
                  </button>)}
                  {isViewMode && <span className="text-muted">View only</span>}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No Asset Types Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListAssetTypes;
