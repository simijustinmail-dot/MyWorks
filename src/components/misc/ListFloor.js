import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';
import { UserContext } from '../../context/UserContext';

const ListFloor = ({ refresh }) => {
    const { user } = useContext(UserContext);
    const isViewMode = user.role === "ViewOnly";
    const [floors, setFloors] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);

    const fetchFloors = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                params: { type: 'getFloors' },
                withCredentials: true,
            });
            setFloors(response.data.data || []);
        } catch (error) {
            console.error("Error fetching floors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this floor?')) return;

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                type: 'deleteFloor',
                id
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.status) {
                setToast({ message: 'Floor deleted successfully.', type: 'warning' });
                fetchFloors();
            } else {
                setToast({ message: response.data.message || 'Failed to delete floor.', type: 'error' });
            }
        } catch (error) {
            console.error("Error deleting floor:", error);
            setToast({ message: 'Server error while deleting floor.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchFloors();
    }, [refresh]);

    return (
        <div className="mt-5">
            <h4 className="text-center mb-3">View Floors</h4>

            {toast.message && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
            )}

            {loading ? (
                <div className="text-center">Loading floor records...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>SL. NO.</th>
                                <th>Floor Number</th>
                                <th>Floor Name</th>
                                <th>Building</th>
                                <th>Floor Area (sq m)</th>
                                <th>Floor Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {floors.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No floor record found.</td>
                                </tr>
                            ) : (
                                floors.map((floor, index) => (
                                    <tr key={floor.floor_id}>
                                        <td>{index + 1}</td>
                                        <td>{floor.floor_no}</td>
                                        <td>{floor.floor_name}</td>
                                        <td>{floor.building_name || 'N/A'}</td>
                                        <td>{floor.floor_area}</td>
                                        <td>{floor.floor_type}</td>
                                        <td>
                                            {!isViewMode && (<button className="btn btn-danger btn-sm" onClick={() => handleDelete(floor.floor_id)}>Delete</button>)}
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

export default ListFloor;
