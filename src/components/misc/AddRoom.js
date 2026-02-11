import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';
import ListRoom from './ListRoom';
import MainLayout from '../../layouts/Mainlayout';
import { UserContext } from '../../context/UserContext';

const AddRoom = () => {
    const [floors, setFloors] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [refreshList, setRefreshList] = useState(false);
    const { user } = useContext(UserContext);
    const isViewMode = user.role === "ViewOnly";

    const [roomData, setRoomData] = useState({
        floorId: '',
        roomNumber: '',
        roomName: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData(prev => ({ ...prev, [name]: value }));
    };

    const fetchFloors = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                params: { type: 'getFloors' },
                withCredentials: true,
            });
            setFloors(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch floors", error);
        }
    };

    const handleAddRoom = async () => {
        const { floorId, roomNumber, roomName } = roomData;

        if (!floorId || !roomNumber || !roomName) {
            setToast({ message: 'Floor, Room Number, and Room Name are required.', type: 'error' });
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                type: 'addRoom',
                ...roomData,
                created_by: user.id,
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (response.data.status) {
                setToast({ message: 'Room added successfully!', type: 'success' });
                setRoomData({ floorId: '', roomNumber: '', roomName: '', roomArea: '', roomType: '' });
                setRefreshList(prev => !prev);
            } else {
                setToast({ message: response.data.message || 'Failed to add room.', type: 'error' });
            }
        } catch (error) {
            console.error("Error adding room:", error);
            setToast({ message: "Server error while adding room.", type: "error" });
        }
    };

    useEffect(() => {
        fetchFloors();
    }, []);

    return (
        <MainLayout>
            <div className="container mt-4">
                <h2 className="text-center mb-4">Add Room</h2>

                {toast.message && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
                )}

                <div className="card p-4 shadow-sm">
                    <div className="row">
                        <div className="form-group mb-3 col-md-6">
                            <label>Associated Floor</label>
                            <select
                                name="floorId"
                                className="form-control"
                                value={roomData.floorId}
                                onChange={handleChange}
                            >
                                <option value="">Select Floor</option>
                                {floors.map(f => (
                                    <option key={f.floor_id} value={f.floor_id}>
                                        {f.floor_name} (Bldg: {f.building_name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {[ 
                            { label: "Room Number", name: "roomNumber" },
                            { label: "Room Name", name: "roomName" },
                        ].map(field => (
                            <div className="form-group mb-3 col-md-6" key={field.name}>
                                <label>{field.label}</label>
                                <input
                                    type={'text'}
                                    className="form-control"
                                    name={field.name}
                                    value={roomData[field.name]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field.label}`}
                                />
                            </div>
                        ))}
                    </div>

                    {!isViewMode && (<button className="btn btn-primary mt-3" onClick={handleAddRoom}>ADD ROOM</button>)}
                </div>

                <ListRoom refresh={refreshList} />
            </div>
        </MainLayout>
    );
};

export default AddRoom;
