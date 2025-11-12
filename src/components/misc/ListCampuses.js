
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../Toast';

const ListCampuses = ({ refresh }) => {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchCampuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
        {
          params: { type: 'getCampuses' },
          withCredentials: true,
        }
      );
      setCampuses(response.data.campuses || []);
    } catch (error) {
      console.error('Error fetching campuses:', error);
      setCampuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, [refresh]); // Re-fetch when `refresh` changes
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campus?")) return;

    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.post(
        `${BASE_URL}/pages/misc/misc.ajax.php`,
        {
          id,
          type: 'deleteCampus'
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.status) {
        setToast({ message: 'Campus deleted successfully!', type: 'warning' });
        fetchCampuses(); // Refresh the list after delete
      } else {
        setToast({ message: res.data.message || 'Failed to delete campus.', type: 'error' });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setToast({ message: 'Server error while deleting.', type: 'error' });
    }
  };
  return (
    <div>
      <h4 className="text-center mb-3">View Campuses</h4>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
      {loading ? (
        <div className="text-center">Loading campuses...</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="bg-primary text-white">
            <tr>
              <th>SL. NO.</th>
              <th>CAMPUS NAME</th>
              <th>CAMPUS DESCRIPTION</th>
              {/* <th>CREATED BY</th>
              <th>CREATED DATE</th> */}
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {campuses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No campus found.</td>
              </tr>
            ) : (
              campuses.map((campus, index) => (
                <tr key={campus.campus_id || index}>
                  <td>{index + 1}</td>
                  <td>{campus.campus_name}</td>
                  <td>{campus.campus_desc}</td>
                  {/* <td>{campus.created_by}</td>
                  <td>{campus.created_date}</td> */}
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(campus.campus_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListCampuses;
