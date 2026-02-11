import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';
import { UserContext } from '../../context/UserContext';

const ListLand = ({ refresh }) => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchLands = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
        {
          params: { type: 'getLands' },
          withCredentials: true,
        }
      );
      setLands(response.data.data || []);
    } catch (error) {
      console.error('Error fetching lands:', error);
      setLands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this land record?")) return;

    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.post(
        `${BASE_URL}/pages/misc/misc.ajax.php`,
        {
          id,
          type: 'deleteLand'
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.status) {
        setToast({ message: 'Land record deleted successfully!', type: 'warning' });
        fetchLands();
      } else {
        setToast({ message: res.data.message || 'Failed to delete land record.', type: 'error' });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setToast({ message: 'Server error while deleting.', type: 'error' });
    }
  };

  return (
    <div>
      <h4 className="text-center mb-3">View Land Records</h4>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      {loading ? (
        <div className="text-center">Loading land records...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="bg-primary text-white">
              <tr>
                <th>SL. NO.</th>
                <th>Campus</th>
                <th>Land Name</th>
                <th>Land Description</th>
                <th>Survey No</th>
                <th>Village</th>
                <th>Area</th>
                <th>Location</th>
                <th>Boundaries</th>
                <th>Acquisition Type</th>
                <th>Owner</th>
                <th>Registration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lands.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center">No land record found.</td>
                </tr>
              ) : (
                lands.map((land, index) => (
                  <tr key={land.land_id || index}>
                    <td>{index + 1}</td>
                    <td>{land.campus_name}</td>
                    <td>{land.land_name}</td>
                    <td>{land.land_desc}</td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }} title={land.survey_no}>{land.survey_no}</td>
                    <td>{land.village}</td>
                    <td>{land.area_of_land} {land.area_unit}</td>
                    <td>{land.location_des}</td>
                    <td>{land.boundaries}</td>
                    <td>{land.acquisition_type}</td>
                    <td>{land.owner_name}</td>
                    <td>{land.registration_details}</td>
                    <td>
                      {!isViewMode && (<button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(land.land_id)}
                      >
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

export default ListLand;
