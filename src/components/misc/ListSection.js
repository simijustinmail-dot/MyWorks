import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../../components/Toast';

const ListSection = ({ refresh }) => {
    const [sections, setSections] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);

    const fetchSections = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                params: { type: 'getSections' },
                withCredentials: true,
            });
            setSections(response.data.data || []);
        } catch (error) {
            console.error("Error fetching sections:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
                type: 'deleteSection',
                id
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.status) {
                setToast({ message: 'Section deleted successfully.', type: 'warning' });
                fetchSections();
            } else {
                setToast({ message: response.data.message || 'Failed to delete section.', type: 'error' });
            }
        } catch (error) {
            console.error("Error deleting section:", error);
            setToast({ message: 'Server error while deleting section.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchSections();
    }, [refresh]);

    return (
        <div className="mt-5">
            <h4 className="text-center mb-3">View Sections</h4>

            {toast.message && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
            )}

            {loading ? (
                <div className="text-center">Loading section records...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>SL. NO.</th>
                                <th>Section Name</th>
                                <th>Section Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">No section record found.</td>
                                </tr>
                            ) : (
                                sections.map((sec, index) => (
                                    <tr key={sec.section_id}>
                                        <td>{index + 1}</td>
                                        <td>{sec.section_name}</td>
                                        <td>{sec.section_desc}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sec.section_id)}>Delete</button>
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

export default ListSection;