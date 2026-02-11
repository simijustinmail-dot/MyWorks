import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';
import ListSection from './ListSection';
import MainLayout from '../../layouts/Mainlayout';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const AddSection = () => {
    const [sectionData, setSectionData] = useState({ sectionName: '', sectionDescription: '' });
    const [toast, setToast] = useState({ message: '', type: '' });
    const [refreshList, setRefreshList] = useState(false);
    const { user } = useContext(UserContext);
    const isViewMode = user.role === "ViewOnly";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSectionData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSection = async () => {
        const { sectionName, sectionDescription } = sectionData;

        if (!sectionName || !sectionDescription) {
            setToast({ message: 'Section Name and Description are required.', type: 'error' });
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                type: 'addSection',
                ...sectionData,
                created_by: user.id,
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (response.data.status) {
                setToast({ message: 'Section added successfully!', type: 'success' });
                setSectionData({ sectionName: '', sectionDescription: '' });
                setRefreshList(prev => !prev);
            } else {
                setToast({ message: response.data.message || 'Failed to add section.', type: 'error' });
            }
        } catch (error) {
            console.error("Error adding section:", error);
            setToast({ message: "Server error while adding section.", type: "error" });
        }
    };

    return (
        <MainLayout>
            <div className="container mt-4">
                <h2 className="text-center mb-4">Add Section</h2>

                {toast.message && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
                )}

                <div className="card p-4 shadow-sm">
                    <div className="row">
                        {[
                            { label: 'Section Name', name: 'sectionName', type: 'text' },
                            { label: 'Section Description', name: 'sectionDescription', type: 'text' }
                        ].map(field => (
                            <div className="form-group mb-3 col-md-6" key={field.name}>
                                <label>{field.label}</label>
                                <input
                                    type={field.type}
                                    className="form-control"
                                    name={field.name}
                                    value={sectionData[field.name]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field.label}`}
                                />
                            </div>
                        ))}
                    </div>

                    {!isViewMode && (<button className="btn btn-primary mt-3" onClick={handleAddSection}>ADD SECTION</button>)}
                </div>

                <ListSection refresh={refreshList} />
            </div>
        </MainLayout>
    );
};

export default AddSection;
