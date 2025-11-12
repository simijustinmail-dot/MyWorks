import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../Toast';

const ListAssetSubTypeEntityNodes = ({ refresh }) => {
  const [subtypeEntityNodes, setSubtypeentitiyNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchSubTypeEntityNodes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
        {
          params: { type: 'getAssetSubTypeEntityNodes' },
          withCredentials: true,
        }
      );
      setSubtypeentitiyNodes(res.data.data || []);
    } catch (err) {
      console.error('Error loading subtypes:', err);
      setToast({ message: 'Failed to load asset sub types entity node.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub type entity node?")) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
        {
          id,
          type: 'deleteAssetSubTypeEntityNode'

        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.data.status ) {
        setToast({ message: 'Deleted successfully!', type: 'warning' });
        await fetchSubTypeEntityNodes();
      } else {
        setToast({ message: res.data.message || 'Deletion failed', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting:', err);
      setToast({ message: 'Server error while deleting.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchSubTypeEntityNodes();
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
                <th>Linked Asset SubType Entity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subtypeEntityNodes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No subtype entity found.</td>
                </tr>
              ) : (
                subtypeEntityNodes.map((st, idx) => (
                  <tr key={st.asset_subtype_entitynode_id}>
                    <td>{idx + 1}</td>
                    <td>{st.asset_subtype_entitynode_code}</td>
                    <td>{st.asset_subtype_entitynode_name}</td>
                    {/* <td>{st.desc}</td> */}
                    <td>{st.asset_subtype_entity_code} : {st.asset_subtype_entity_name}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(st.asset_subtype_entitynode_id)}>
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

export default ListAssetSubTypeEntityNodes;
