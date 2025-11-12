import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../Toast';
import { useNavigate } from 'react-router-dom';

const ListAssetSubTypes = ({ refresh }) => {
  const [subtypes, setSubtypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const fetchSubTypes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
        {
          params: { type: 'getAssetSubTypes' },
          withCredentials: true,
        }
      );
      setSubtypes(res.data.data || []);
    } catch (err) {
      console.error('Error loading subtypes:', err);
      setToast({ message: 'Failed to load asset sub types.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub type?")) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
        {
          id,
          type: 'deleteAssetSubType'

        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.data.status) {
        setToast({ message: 'Deleted successfully!', type: 'warning' });
        await fetchSubTypes();
      } else {
        setToast({ message: res.data.message || 'Deletion failed', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting:', err);
      setToast({ message: 'Server error while deleting.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchSubTypes();
  }, [refresh]);

  return (
    <div className="mt-5">
      <h4 className="text-center mb-3">View Asset SubTypes</h4>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      {loading ? (
        <div className="text-center">Loading sub types...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="bg-primary text-white">
              <tr>
                <th>SL. NO.</th>
                <th>Asset SubType Code</th>
                <th>Asset SubType Name</th>
                {/* <th>Description</th> */}
                <th>Linked Asset Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subtypes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No subtypes found.</td>
                </tr>
              ) : (
                subtypes.map((st, idx) => (
                  <tr key={st.asset_subtype_id}>
                    <td>{idx + 1}</td>
                    <td>{st.asset_subtype_code}</td>
                    <td>{st.asset_subtype_name}</td>
                    {/* <td>{st.desc}</td> */}
                    <td>{st.asset_type_code} : {st.asset_type_name}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() =>
                          navigate('/assets/add-assetsubtypeentity', {
                            state: {
                              selectedAssetSubTypeId: st.asset_subtype_id,
                              selectedAssetSubTypeCode: st.asset_subtype_code,
                              selectedAssetSubTypeName: st.asset_subtype_name
                            }
                          })
                        }
                      >
                        Add SubType Entity
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(st.asset_subtype_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListAssetSubTypes;
