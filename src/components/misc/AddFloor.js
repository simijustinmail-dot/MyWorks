import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';
import ListFloor from './ListFloor';
import MainLayout from '../../layouts/Mainlayout';
import { UserContext } from '../../context/UserContext';

const AddFloor = () => {
    const [buildings, setBuildings] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [refreshList, setRefreshList] = useState(false);
    const { user } = useContext(UserContext);

    const [floorData, setFloorData] = useState({
        buildingId: '',
        floorNumber: '',
        floorName: '',
        floorArea: '',
        floorType: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFloorData(prev => ({ ...prev, [name]: value }));
    };

    const fetchBuildings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                params: { type: 'getBuildings' },
                withCredentials: true,
            });
            setBuildings(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch buildings", error);
        }
    };

    const handleAddFloor = async () => {
        const { buildingId, floorNumber, floorName } = floorData;

        if (!buildingId || !floorNumber || !floorName) {
            setToast({ message: 'Building, Floor Number, and Floor Name are required.', type: 'error' });
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                type: 'addFloor',
                ...floorData,
                created_by: user.id,
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (response.data.status) {
                setToast({ message: 'Floor added successfully!', type: 'success' });
                setFloorData({ buildingId: '', floorNumber: '', floorName: '', floorArea: '', floorType: '' });
                setRefreshList(prev => !prev);
            } else {
                setToast({ message: response.data.message || 'Failed to add floor.', type: 'error' });
            }
        } catch (error) {
            console.error("Error adding floor:", error);
            setToast({ message: "Server error while adding floor.", type: "error" });
        }
    };

    useEffect(() => {
        fetchBuildings();
    }, []);

    return (
        <MainLayout>
            <div className="container mt-4">
                <h2 className="text-center mb-4">Add Floor</h2>

                {toast.message && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
                )}

                <div className="card p-4 shadow-sm">
                    <div className="row">
                        <div className="form-group mb-3 col-md-6">
                            <label>Associated Building</label>
                            <select
                                name="buildingId"
                                className="form-control"
                                value={floorData.buildingId}
                                onChange={handleChange}
                            >
                                <option value="">Select Building</option>
                                {buildings.map(b => (
                                    <option key={b.building_id} value={b.building_id}>{b.building_name}</option>
                                ))}
                            </select>
                        </div>

                        {[
                            { label: "Floor Number", name: "floorNumber" },
                            { label: "Floor Name", name: "floorName" },
                            { label: "Floor Area (sq m)", name: "floorArea" },
                            { label: "Floor Type", name: "floorType" }
                        ].map(field => (
                            <div className="form-group mb-3 col-md-6" key={field.name}>
                                <label>{field.label}</label>
                                <input
                                    type={(field.name === 'floorNumber' || field.name ==='floorArea') ? 'number' : 'text'}
                                    className="form-control"
                                    name={field.name}
                                    value={floorData[field.name]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field.label}`}
                                />
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-primary mt-3" onClick={handleAddFloor}>ADD FLOOR</button>
                </div>

                <ListFloor refresh={refreshList} />
            </div>
        </MainLayout>
    );

};

export default AddFloor;
