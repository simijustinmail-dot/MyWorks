import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Toast from '../Toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const ListAssetSubTypeEntity = ({ refresh }) => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const [subtypeEntity, setSubtypeentitiy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const fetchSubTypeEntity = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
        {
          params: { type: 'getAssetSubTypeEntity' },
          withCredentials: true,
        }
      );
      setSubtypeentitiy(res.data.data || []);
    } catch (err) {
      console.error('Error loading subtypes:', err);
      setToast({ message: 'Failed to load asset sub types entity.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub type entity?")) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
        {
          id,
          type: 'deleteAssetSubTypeEntity'

        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.data.status) {
        setToast({ message: 'Deleted successfully!', type: 'warning' });
        await fetchSubTypeEntity();
      } else {
        setToast({ message: res.data.message || 'Deletion failed', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting:', err);
      setToast({ message: 'Server error while deleting.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchSubTypeEntity();
  }, [refresh]);

  return (
    <div className="mt-5">
      <h4 className="text-center mb-3">View Asset SubType Entity</h4>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      {loading ? (
        <div className="text-center">Loading sub type entity...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="bg-primary text-white">
              <tr>
                <th>SL. NO.</th>
                <th>Asset SubType Entity Code</th>
                <th>Asset SubType Entity Name</th>
                {/* <th>Description</th> */}
                <th>Linked Asset SubType</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subtypeEntity.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No subtype entity found.</td>
                </tr>
              ) : (
                subtypeEntity.map((st, idx) => (
                  <tr key={st.asset_subtype_entity_id}>
                    <td>{idx + 1}</td>
                    <td>{st.asset_subtype_entity_code}</td>
                    <td>{st.asset_subtype_entity_name}</td>
                    {/* <td>{st.desc}</td> */}
                    <td>{st.asset_subtype_code} : {st.asset_subtype_name}</td>
                    <td className="d-flex gap-2">
                      {!isViewMode && (<button
                        className="btn btn-sm btn-success me-2"
                        onClick={() =>
                          navigate('/assets/add-assetsubtypeentitynode', {
                            state: {
                              selectedAssetSubTypeEntityId: st.asset_subtype_entity_id,
                              selectedAssetSubTypeEntityCode: st.asset_subtype_entity_code,
                              selectedAssetSubTypeEntityName: st.asset_subtype_entity_name
                            }
                          })
                        }
                      >
                        Add SubType Entity Node
                      </button>)}
                      {!isViewMode && (<button className="btn btn-danger btn-sm" onClick={() => handleDelete(st.asset_subtype_entity_id)}>
                        Delete
                      </button>)}
                      {isViewMode && <span className="text-muted">View only</span>}
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

export default ListAssetSubTypeEntity;
