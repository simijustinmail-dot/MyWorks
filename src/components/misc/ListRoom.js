import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';
import { UserContext } from '../../context/UserContext';

const ListRoom = ({ refresh }) => {
    const { user } = useContext(UserContext);
    const isViewMode = user.role === "ViewOnly";
    const [rooms, setRooms] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                params: { type: 'getRooms' },
                withCredentials: true,
            });
            setRooms(response.data.data || []);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                type: 'deleteRoom',
                id
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.status) {
                setToast({ message: 'Room deleted successfully.', type: 'warning' });
                fetchRooms();
            } else {
                setToast({ message: response.data.message || 'Failed to delete room.', type: 'error' });
            }
        } catch (error) {
            console.error("Error deleting room:", error);
            setToast({ message: 'Server error while deleting room.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [refresh]);

    return (
        <div className="mt-5">
            <h4 className="text-center mb-3">View Rooms</h4>

            {toast.message && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
            )}

            {loading ? (
                <div className="text-center">Loading room records...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>SL. NO.</th>
                                <th>Room Number</th>
                                <th>Room Name</th>
                                <th>Floor</th>
                                <th>Building</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">No room record found.</td>
                                </tr>
                            ) : (
                                rooms.map((room, index) => (
                                    <tr key={room.room_id}>
                                        <td>{index + 1}</td>
                                        <td>{room.room_no}</td>
                                        <td>{room.room_name}</td>
                                        <td>{room.floor_name}</td>
                                        <td>{room.building_name}</td>
                                        <td>
                                            {!isViewMode && (<button className="btn btn-danger btn-sm" onClick={() => handleDelete(room.room_id)}>Delete</button>)}
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

export default ListRoom;
