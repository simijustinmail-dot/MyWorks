import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';

const ListBuilding = ({ refresh }) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
        {
          params: { type: 'getBuildings' },
          withCredentials: true
        }
      );
      setBuildings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this building?")) return;

    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${BASE_URL}/pages/misc/misc.ajax.php`,
        { 
          type :'deleteBuilding',
          id
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.data.status) {
        setToast({ message: 'Building deleted successfully.', type: 'warning' });
        fetchBuildings();
      } else {
        setToast({ message: response.data.message || 'Failed to delete building.', type: 'error' });
      }
    } catch (error) {
      console.error("Error deleting building:", error);
      setToast({ message: 'Server error while deleting building.', type: 'error' });
    }
  };

  return (
    <div className="mt-5">
      <h4 className="text-center mb-3">View Buildings</h4>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      {loading ? (
        <div className="text-center">Loading building records...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="bg-primary text-white">
              <tr>
                <th>SL. NO.</th>
                <th>Building Name</th>
                <th>Description</th>
                <th>Land</th>
                <th>Stories</th>
                <th>Wall Type</th>
                <th>Roof Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buildings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No building record found.</td>
                </tr>
              ) : (
                buildings.map((bldg, index) => (
                  <tr key={bldg.building_id}>
                    <td>{index + 1}</td>
                    <td>{bldg.building_name}</td>
                    <td>{bldg.building_desc}</td>
                    <td>{bldg.land_name || 'N/A'}</td>
                    <td>{bldg.number_of_stories}</td>
                    <td>{bldg.wall_type}</td>
                    <td>{bldg.roof_type}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(bldg.building_id)}
                      >
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

export default ListBuilding;
