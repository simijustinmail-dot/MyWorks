import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';
import { UserContext } from '../../context/UserContext';

const ListSeat = ({ refresh }) => {
    const { user } = useContext(UserContext);
    const isViewMode = user.role === "ViewOnly";
    const [seats, setSeats] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);

    const fetchSeats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                params: { type: 'getSeats' },
                withCredentials: true,
            });
            setSeats(response.data.data || []);
        } catch (error) {
            console.error("Error fetching seats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this seat?')) return;

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                type: 'deleteSeat',
                id
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.status) {
                setToast({ message: 'Seat deleted successfully.', type: 'warning' });
                fetchSeats();
            } else {
                setToast({ message: response.data.message || 'Failed to delete seat.', type: 'error' });
            }
        } catch (error) {
            console.error("Error deleting seat:", error);
            setToast({ message: 'Server error while deleting seat.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchSeats();
    }, [refresh]);

    return (
        <div className="mt-5">
            <h4 className="text-center mb-3">View Seats</h4>

            {toast.message && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
            )}

            {loading ? (
                <div className="text-center">Loading seat records...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>SL. NO.</th>
                                <th>Seat Name</th>
                                <th>Seat Description</th>
                                <th>Seat Role</th>
                                <th>Section</th>
                                <th>Reports To</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seats.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No seat record found.</td>
                                </tr>
                            ) : (
                                seats.map((seat, index) => (
                                    <tr key={seat.seat_id}>
                                        <td>{index + 1}</td>
                                        <td>{seat.seat_name}</td>
                                        <td>{seat.seat_desc}</td>
                                        <td>{seat.seat_role_name}</td>
                                        <td>{seat.section_name}</td>     
                                        <td>{seat.reports_to_seat_name}</td>
                                        <td>
                                            {!isViewMode && (<button className="btn btn-danger btn-sm" onClick={() => handleDelete(seat.seat_id)}>Delete</button>)}
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

export default ListSeat;