import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Table,
    Button,
    Spinner
} from 'react-bootstrap';
import MainLayout from '../../layouts/Mainlayout';
import Toast from '../Toast';
import ListAssetRow from './ListAssetRow';
import { UserContext } from '../../context/UserContext';

const BulkUpdateAssets = () => {
    const { user } = useContext(UserContext);
    const isViewMode = user.role === "ViewOnly";
    /* =========================
       Pagination & counts
    ========================= */
    const [page, setPage] = useState(1);
    //const limit = 50;
    const [limit, setLimit] = useState(100);
    const [total, setTotal] = useState(0);
    //const [verifiedCount, setVerifiedCount] = useState(0);
    const [assignedCount, setAssignedCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [expandedRow, setExpandedRow] = useState(null);

    /* =========================
       Assets & selection
    ========================= */
    const [assets, setAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState(new Set());

    /* =========================
       Filters
    ========================= */
    const [draftFilters, setDraftFilters] = useState({
        asset_type_id: '',
        asset_subtype_id: '',
        asset_subtype_entity_id: '',
        asset_subtype_entitynode_id: '',
        campus_id: '',
        land_id: '',
        building_id: '',
        floor_id: '',
        room_id: '',
        assigned: '',
        verified: '',
        search: ''
    });
    const [appliedFilters, setAppliedFilters] = useState(draftFilters);
    /* =========================
       Masters
    ========================= */
    const [assetTypes, setAssetTypes] = useState([]);
    const [assetSubTypes, setAssetSubTypes] = useState([]);
    const [assetSubTypeEntities, setAssetSubTypeEntities] = useState([]);
    const [assetSubTypeEntityNodes, setAssetSubTypeEntityNodes] = useState([]);

    const [campuses, setCampuses] = useState([]);
    const [lands, setLands] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [sections, setSections] = useState([]);
    const [seats, setSeats] = useState([]);

    const [assignLands, setAssignLands] = useState([]);
    const [assignBuildings, setAssignBuildings] = useState([]);
    const [assignFloors, setAssignFloors] = useState([]);
    const [assignRooms, setAssignRooms] = useState([]);
    const [assignseats, setAssignSeats] = useState([]);

    /* =========================
       Bulk updation data
    ========================= */
    const [bulkData, setBulkData] = useState({
        campus_id: '',
        land_id: '',
        building_id: '',
        floor_id: '',
        room_id: '',
        section_id: '',
        seat_id: '',
        admin_sanction_no: '',
        admin_sanction_date: '',
        technical_sanction_no: '',
        technical_sanction_date: '',
        work_order_no: '',
        work_order_date: '',
        supply_order_no: '',
        supply_order_date: '',
        total_cost: ''
    });

    /* =========================
       Load base masters
    ========================= */
    useEffect(() => {
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
            { params: { type: 'getAssetTypes' }, withCredentials: true }
        ).then(res => setAssetTypes(res.data.data || []));

        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            { params: { type: 'getCampuses' }, withCredentials: true }
        ).then(res => setCampuses(res.data.campuses || []));

        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            { params: { type: 'getSections' }, withCredentials: true }
        ).then(res => setSections(res.data.data || []));
    }, []);

    /* =========================
       Cascades (filters)
    ========================= */
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/misc/misc.ajax.php`, {
            params: { type: 'getSeatsOnSection', section_id: draftFilters.section_id },
            withCredentials: true
        })
            .then(res => setSeats(res.data.data || []))
            .catch(() => setToast({ message: 'Failed to load seat.', type: 'error' }));
    }, [draftFilters.section_id]);
    useEffect(() => {
        if (!draftFilters.asset_type_id) {
            setAssetSubTypes([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
            {
                params: {
                    type: 'getAssetSubTypesOnType',
                    asset_type: draftFilters.asset_type_id
                },
                withCredentials: true
            }
        ).then(res => setAssetSubTypes(res.data.data || []));
    }, [draftFilters.asset_type_id]);
    useEffect(() => {
        if (!draftFilters.asset_subtype_id) {
            setAssetSubTypeEntities([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
            {
                params: {
                    type: 'getAssetSubTypeEntityOnSubType',
                    asset_subtype: draftFilters.asset_subtype_id
                },
                withCredentials: true
            }
        ).then(res => setAssetSubTypeEntities(res.data.data || []));
    }, [draftFilters.asset_subtype_id]);
    useEffect(() => {
        if (!draftFilters.asset_subtype_entity_id) {
            setAssetSubTypeEntityNodes([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
            {
                params: {
                    type: 'getAssetSubTypeEntityNodesOnEntity',
                    entity_id: draftFilters.asset_subtype_entity_id
                },
                withCredentials: true
            }
        ).then(res => setAssetSubTypeEntityNodes(res.data.data || []));
    }, [draftFilters.asset_subtype_entity_id]);
    useEffect(() => {
        if (!draftFilters.campus_id) {
            setLands([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            {
                params: { type: 'getLandsOnCampus', campus_id: draftFilters.campus_id },
                withCredentials: true
            }
        ).then(res => setLands(res.data.data || []));
    }, [draftFilters.campus_id]);

    useEffect(() => {
        if (!draftFilters.land_id) {
            setBuildings([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            {
                params: { type: 'getBuildingsOnLand', land_id: draftFilters.land_id },
                withCredentials: true
            }
        ).then(res => setBuildings(res.data.data || []));
    }, [draftFilters.land_id]);

    useEffect(() => {
        if (!draftFilters.building_id) {
            setFloors([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            {
                params: { type: 'getFloorOnBuilding', building_id: draftFilters.building_id },
                withCredentials: true
            }
        ).then(res => setFloors(res.data.data || []));
    }, [draftFilters.building_id]);

    useEffect(() => {
        if (!draftFilters.floor_id) {
            setRooms([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            {
                params: { type: 'getRoomOnFloor', floor_id: draftFilters.floor_id },
                withCredentials: true
            }
        ).then(res => setRooms(res.data.data || []));
    }, [draftFilters.floor_id]);

    /* =========================
       Fetch assets
    ========================= */
    const fetchAssets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`,
                {
                    params: {
                        type: 'getAssets',
                        page,
                        limit,
                        ...appliedFilters
                    },
                    withCredentials: true
                }
            );

            setAssets(res.data.data || []);
            setTotal(res.data.total || 0);
            //setVerifiedCount(res.data.verified || 0);
            setAssignedCount(res.data.assigned || 0);
        } finally {
            setLoading(false);
        }
    }, [page, limit, appliedFilters]);

    useEffect(() => {
        fetchAssets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAssets]);

    /* =========================
       Selection helpers
    ========================= */
    const toggleSelect = id => {
        setSelectedAssets(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = checked => {
        setSelectedAssets(prev => {
            const next = new Set(prev);
            assets.forEach(a =>
                checked ? next.add(a.asset_id) : next.delete(a.asset_id)
            );
            return next;
        });
    };
    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };


    useEffect(() => {
        if (!bulkData.campus_id) {
            setLands([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            {
                params: { type: 'getLandsOnCampus', campus_id: bulkData.campus_id },
                withCredentials: true
            }
        ).then(res => setAssignLands(res.data.data || []));
    }, [bulkData.campus_id]);

    useEffect(() => {
        if (!bulkData.land_id) {
            setBuildings([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            {
                params: { type: 'getBuildingsOnLand', land_id: bulkData.land_id },
                withCredentials: true
            }
        ).then(res => setAssignBuildings(res.data.data || []));
    }, [bulkData.land_id]);

    useEffect(() => {
        if (!bulkData.building_id) {
            setFloors([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            {
                params: { type: 'getFloorOnBuilding', building_id: bulkData.building_id },
                withCredentials: true
            }
        ).then(res => setAssignFloors(res.data.data || []));
    }, [bulkData.building_id]);

    useEffect(() => {
        if (!bulkData.floor_id) {
            //setRooms([]);
            return;
        }
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
            {
                params: { type: 'getRoomOnFloor', floor_id: bulkData.floor_id },
                withCredentials: true
            }
        ).then(res => setAssignRooms(res.data.data || []));
    }, [bulkData.floor_id]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/misc/misc.ajax.php`, {
            params: { type: 'getSeatsOnSection', section_id: bulkData.section_id },
            withCredentials: true
        })
            .then(res => setAssignSeats(res.data.data || []))
            .catch(() => setToast({ message: 'Failed to load seat.', type: 'error' }));
    }, [bulkData.section_id]);

    /* =========================
       Bulk apply
    ========================= */
    const handleBulkApply = async () => {
        if (!selectedAssets.size) {
                setToast({ message: "No assets selected.", type: "error" });
                return;
            }
        if (
            window.confirm(
                `You are about to apply bulk updates to ${selectedAssets.size} assets.\nThis action cannot be undone.\n\nProceed?`
            )
        ) {
            
            const campus = campuses.find(
                c => String(c.campus_id) === String(bulkData.campus_id)
            );

            const land = assignLands.find(
                l => String(l.land_id) === String(bulkData.land_id)
            );

            const building = assignBuildings.find(
                b => String(b.building_id) === String(bulkData.building_id)
            );

            const floor = assignFloors.find(
                f => String(f.floor_id) === String(bulkData.floor_id)
            );

            const room = assignRooms.find(
                r => String(r.room_id) === String(bulkData.room_id)
            );

            const section = sections.find(
                s => String(s.section_id) === String(bulkData.section_id)
            );
            const seat = assignseats.find(
                s => String(s.seat_id) === String(bulkData.seat_id)
            );
            const payload = {
                asset_ids: Array.from(selectedAssets),
                ...bulkData,
                campus_name: campus?.campus_name || '',
                land_name: land?.land_name || '',
                building_name: building?.building_name || '',
                floor_name: floor?.floor_name || '',
                room_name: room?.room_no || '',
                section_name: section?.section_name || '',
                seat_name: seat?.seat_name || ''
            };
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php?type=bulkUpdateAsset`,
                payload,
                { withCredentials: true }
            ).then(() => { setToast({ message: 'Successfully Updated.', type: 'success' }); setSelectedAssets(new Set()); fetchAssets(); })
                .catch(() => setToast({ message: 'Failed bulk update.', type: 'error' }));
        }
    };

    /* =========================
       Render
    ========================= */
    return (
        <MainLayout>
            <Container fluid className="p-4">
                <h3>Asset Bulk Updation</h3>
                {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}
                {/* FILTER AREA */}
                <Card className="mb-3">
                    <Card.Body>
                        <Row className="g-2 mb-2">
                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.asset_type_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({
                                            ...f,
                                            asset_type_id: e.target.value,
                                            asset_subtype_id: ''
                                        }))
                                    }
                                >
                                    <option value="">Asset Type</option>
                                    {assetTypes.map(t => (
                                        <option key={t.asset_type_id} value={t.asset_type_id}>
                                            {t.asset_type_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.asset_subtype_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({
                                            ...f,
                                            asset_subtype_id: e.target.value
                                        }))
                                    }
                                >
                                    <option value="">Asset Subtype</option>
                                    {assetSubTypes.map(s => (
                                        <option key={s.asset_subtype_id} value={s.asset_subtype_id}>
                                            {s.asset_subtype_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.asset_subtype_entity_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({
                                            ...f,
                                            asset_subtype_entity_id: e.target.value
                                        }))
                                    }
                                >
                                    <option value="">Asset Subtype Entity</option>
                                    {assetSubTypeEntities.map(s => (
                                        <option key={s.asset_subtype_entity_id} value={s.asset_subtype_entity_id}>
                                            {s.asset_subtype_entity_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.asset_subtype_entitynode_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({
                                            ...f,
                                            asset_subtype_entitynode_id: e.target.value
                                        }))
                                    }
                                >
                                    <option value="">Asset Subtype Entitynode</option>
                                    {assetSubTypeEntityNodes.map(s => (
                                        <option key={s.asset_subtype_entitynode_id} value={s.asset_subtype_entitynode_id}>
                                            {s.asset_subtype_entitynode_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className="g-2 mb-2">
                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.campus_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({
                                            ...f,
                                            campus_id: e.target.value,
                                            land_id: '',
                                            building_id: '',
                                            floor_id: '',
                                            room_id: ''
                                        }))
                                    }
                                >
                                    <option value="">Campus</option>
                                    {campuses.map(c => (
                                        <option key={c.campus_id} value={c.campus_id}>
                                            {c.campus_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.land_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({
                                            ...f,
                                            land_id: e.target.value,
                                            building_id: '',
                                            floor_id: '',
                                            room_id: ''
                                        }))
                                    }
                                >
                                    <option value="">Land</option>
                                    {lands.map(l => (
                                        <option key={l.land_id} value={l.land_id}>
                                            {l.land_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.building_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({
                                            ...f,
                                            building_id: e.target.value,
                                            floor_id: '',
                                            room_id: ''
                                        }))
                                    }
                                >
                                    <option value="">Building</option>
                                    {buildings.map(b => (
                                        <option key={b.building_id} value={b.building_id}>
                                            {b.building_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.floor_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({
                                            ...f,
                                            floor_id: e.target.value,
                                            room_id: ''
                                        }))
                                    }
                                >
                                    <option value="">Floor</option>
                                    {floors.map(f => (
                                        <option key={f.floor_id} value={f.floor_id}>
                                            {f.floor_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.room_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({ ...f, room_id: e.target.value }))
                                    }
                                >
                                    <option value="">Room</option>
                                    {rooms.map(r => (
                                        <option key={r.room_id} value={r.room_id}>
                                            {r.room_no}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className="g-2 mb-2">
                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.section_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({ ...f, section_id: e.target.value }))
                                    }
                                >
                                    <option value="">Section</option>
                                    {sections.map(r => (
                                        <option key={r.section_id} value={r.section_id}>
                                            {r.section_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.seat_id}
                                    onChange={e =>
                                        setDraftFilters(f => ({ ...f, seat_id: e.target.value }))
                                    }
                                >
                                    <option value="">Seat</option>
                                    {seats.map(r => (
                                        <option key={r.seat_id} value={r.seat_id}>
                                            {r.seat_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.assigned}
                                    onChange={e =>
                                        setDraftFilters(f => ({ ...f, assigned: e.target.value }))
                                    }
                                >
                                    <option value="">Assigned?</option>
                                    <option value="1">Assigned</option>
                                    <option value="0">Not Assigned</option>
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    value={draftFilters.verified}
                                    onChange={e =>
                                        setDraftFilters(f => ({ ...f, verified: e.target.value }))
                                    }
                                >
                                    <option value="">Verified?</option>
                                    <option value="1">Verified</option>
                                    <option value="0">Not Verified</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className="g-2 mb-2">
                            <Col md={6}>
                                <Form.Control
                                    placeholder="Enter asset name or assetcode or kuhscode model no or serial no"
                                    value={draftFilters.search}
                                    onChange={e =>
                                        setDraftFilters(f => ({ ...f, search: e.target.value }))
                                    }
                                />
                            </Col>
                        </Row>
                        <Row><Col className="text-end"><Button onClick={() => {
                            setPage(1); setPage(1);
                            setAppliedFilters(draftFilters);
                        }}>Apply Filters</Button></Col></Row>
                    </Card.Body>
                </Card>

                {/* BULK ASSIGNMENT */}
                <fieldset className="border border-info border-3 rounded p-2 mb-3">
                    <legend className="float-none w-auto px-3 text-info fw-bold">
                        Bulk Updation Area
                    </legend>
                    <Card >
                        <Card.Body>
                            <Row className="g-2 mb-2">
                                <Col md={2}>
                                    <Form.Select
                                        value={bulkData.campus_id}
                                        onChange={e =>
                                            setBulkData(b => ({
                                                ...b,
                                                campus_id: e.target.value,
                                                land_id: '',
                                                building_id: '',
                                                floor_id: '',
                                                room_id: ''
                                            }))
                                        }
                                    >
                                        <option value="">Assign Campus</option>
                                        {campuses.map(c => (
                                            <option key={c.campus_id} value={c.campus_id}>
                                                {c.campus_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                <Col md={2}>
                                    <Form.Select
                                        value={bulkData.land_id}
                                        onChange={e =>
                                            setBulkData(b => ({
                                                ...b,
                                                land_id: e.target.value,
                                                building_id: '',
                                                floor_id: '',
                                                room_id: ''
                                            }))
                                        }
                                    >
                                        <option value="">Assign Land</option>
                                        {assignLands.map(l => (
                                            <option key={l.land_id} value={l.land_id}>
                                                {l.land_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                <Col md={2}>
                                    <Form.Select
                                        value={bulkData.building_id}
                                        onChange={e =>
                                            setBulkData(b => ({
                                                ...b,
                                                building_id: e.target.value,
                                                floor_id: '',
                                                room_id: ''
                                            }))
                                        }
                                    >
                                        <option value="">Assign Building</option>
                                        {assignBuildings.map(b => (
                                            <option key={b.building_id} value={b.building_id}>
                                                {b.building_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                <Col md={2}>
                                    <Form.Select
                                        value={bulkData.floor_id}
                                        onChange={e =>
                                            setBulkData(b => ({
                                                ...b,
                                                floor_id: e.target.value,
                                                room_id: ''
                                            }))
                                        }
                                    >
                                        <option value="">Assign Floor</option>
                                        {assignFloors.map(f => (
                                            <option key={f.floor_id} value={f.floor_id}>
                                                {f.floor_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                <Col md={2}>
                                    <Form.Select
                                        value={bulkData.room_id}
                                        onChange={e =>
                                            setBulkData(b => ({ ...b, room_id: e.target.value }))
                                        }
                                    >
                                        <option value="">Assign Room</option>
                                        {assignRooms.map(r => (
                                            <option key={r.room_id} value={r.room_id}>
                                                {r.room_no}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="g-2 mb-2">
                                <Col md={2}>
                                    <Form.Select
                                        value={bulkData.section_id}
                                        onChange={e =>
                                            setBulkData(b => ({ ...b, section_id: e.target.value }))
                                        }
                                    >
                                        <option value="">Assign Section</option>
                                        {sections.map(s => (
                                            <option key={s.section_id} value={s.section_id}>
                                                {s.section_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={2}>
                                    <Form.Select
                                        value={bulkData.seat_id}
                                        onChange={e =>
                                            setBulkData(b => ({ ...b, seat_id: e.target.value }))
                                        }
                                    >
                                        <option value="">Assign Seat</option>
                                        {assignseats.map(s => (
                                            <option key={s.seat_id} value={s.seat_id}>
                                                {s.seat_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="g-2 mb-2">
                                <Col md={2}><Form.Control type="text" value={bulkData.admin_sanction_no || ""} onChange={(e) => setBulkData(b => ({ ...b, admin_sanction_no: e.target.value }))} placeholder="Enter admin sanction number" /></Col>
                                <Col md={2}><Form.Control type="date" value={bulkData.admin_sanction_date || ""} onChange={(e) => setBulkData(b => ({ ...b, admin_sanction_date: e.target.value }))} /></Col>
                                <Col md={2}><Form.Control type="text" value={bulkData.technical_sanction_no || ""} onChange={(e) => setBulkData(b => ({ ...b, technical_sanction_no: e.target.value }))} placeholder="Enter technical sanction number" /></Col>
                                <Col md={2}><Form.Control type="date" value={bulkData.technical_sanction_date || ""} onChange={(e) => setBulkData(b => ({ ...b, technical_sanction_date: e.target.value }))} /></Col>
                                <Col md={2}><Form.Control type="text" value={bulkData.work_order_no || ""} onChange={(e) => setBulkData(b => ({ ...b, work_order_no: e.target.value }))} placeholder="Enter work order number" /></Col>
                                <Col md={2}><Form.Control type="date" value={bulkData.work_order_date || ""} onChange={(e) => setBulkData(b => ({ ...b, work_order_date: e.target.value }))} /></Col>
                                <Col md={2}><Form.Control type="text" value={bulkData.supply_order_no || ""} onChange={(e) => setBulkData(b => ({ ...b, supply_order_no: e.target.value }))} placeholder="Enter supply order number" /></Col>
                                <Col md={2}><Form.Control type="date" value={bulkData.supply_order_date || ""} onChange={(e) => setBulkData(b => ({ ...b, supply_order_date: e.target.value }))} /></Col>
                                <Col md={4}><Form.Control type="number" value={bulkData.total_cost || ""} onChange={(e) => setBulkData(b => ({ ...b, total_cost: e.target.value }))} placeholder="Enter total cost" /></Col>
                            </Row>

                            <div className="mt-3 d-flex justify-content-between">
                                <div>
                                    Selected assets: <b>{selectedAssets.size}</b>
                                </div>
                                <Button variant="danger" onClick={handleBulkApply}>
                                    Apply Bulk Updation
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </fieldset>
                {/* ASSET GRID */}
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <span>Assets</span>
                        <div className="d-flex gap-2">
                            <span className="badge bg-warning fs-6">{total} total</span>
                            <span className="badge bg-secondary fs-6">{assignedCount} assigned</span>
                            {/* <span className="badge bg-success fs-6">{verifiedCount} verified</span> */}
                        </div>
                    </Card.Header>

                    <Card.Body>
                        {assets.length > 0 && (
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="d-flex gap-2 align-items-center">
                                    <Form.Select
                                        size="sm"
                                        value={limit}
                                        onChange={(e) => {
                                            setLimit(Number(e.target.value));
                                            setPage(1); // reset to first page when limit changes
                                        }}
                                        style={{ width: "100px" }}
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={200}>200</option>
                                        <option value={300}>300</option>
                                        <option value={400}>400</option>
                                        <option value={500}>500</option>
                                    </Form.Select>
                                    <Button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        Prev
                                    </Button>
                                    <span>
                                        Page {page} of {Math.ceil(total / limit) || 1}
                                    </span>
                                    <Button
                                        disabled={page >= Math.ceil(total / limit)}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                                <div>
                                    {total > 0 && (
                                        <small className="text-muted">
                                            Showing {Math.min((page - 1) * limit + 1, total)} –
                                            {Math.min(page * limit, total)} of {total} assets
                                        </small>
                                    )}
                                </div>
                            </div>
                        )}
                        {loading ? (
                            <Spinner />
                        ) : (
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>
                                            <Form.Check disabled={isViewMode}
                                                checked={
                                                    assets.length > 0 &&
                                                    assets.every(a => selectedAssets.has(a.asset_id))
                                                }
                                                onChange={e =>{if (isViewMode) return; toggleSelectAll(e.target.checked)}}
                                            />
                                        </th>
                                        <th>Name</th>
                                        <th>Asset Code</th>
                                        <th>Asset KUHS Code</th>
                                        <th>Location</th>
                                        <th>Asset Type</th>
                                        <th>Asset SubType</th>
                                        <th>Asset SubType Entity</th>
                                        <th>Asset SubType Entity Node</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {assets.map(asset => (
                                        <React.Fragment key={asset.asset_id}>
                                            <tr key={asset.asset_id}>
                                                <td>
                                                    <Form.Check disabled={isViewMode}
                                                        checked={selectedAssets.has(asset.asset_id)}
                                                        onChange={() => { if (isViewMode) return; toggleSelect(asset.asset_id)}}
                                                    />
                                                </td>
                                                <td>{asset.asset_name}</td>
                                                <td>{asset.asset_unique_code}</td>
                                                <td>{asset.asset_kuhs_code}</td>
                                                {/* <td>{asset.asset_model_no}</td> */}
                                                <td>{asset.floor_name || asset.building_name || asset.land_name || asset.campus_name ? (
                                                    <>
                                                        {asset.seat_name && <div>{asset.seat_name}</div>}
                                                        {asset.section_name && <div>{asset.section_name}</div>}
                                                        {asset.room_name && <div>{asset.room_name}</div>}
                                                        {asset.floor_name && <div>{asset.floor_name}</div>}
                                                        {asset.building_name && <div>{asset.building_name}</div>}
                                                        {asset.land_name && <div>{asset.land_name}</div>}
                                                        {asset.campus_name && <div>{asset.campus_name}</div>}
                                                    </>
                                                ) : (
                                                    <div>{asset.current_location}</div>
                                                )}</td>
                                                <td>{asset.asset_type_name}</td>
                                                <td>{asset.asset_subtype_name}</td>
                                                <td>{asset.asset_subtype_entity_name}</td>
                                                <td>{asset.asset_subtype_entitynode_name}</td>
                                                <td><Button
                                                    variant={expandedRow === asset.asset_id ? 'info' : 'warning'}
                                                    size="sm"
                                                    onClick={() => toggleRow(asset.asset_id)}
                                                >
                                                    {expandedRow === asset.asset_id ? 'Hide Info' : 'View Info'}
                                                </Button></td>
                                            </tr>
                                            {expandedRow === asset.asset_id && (
                                                <tr>
                                                    <td colSpan="10">
                                                        <ListAssetRow asset={asset} />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        )}

                        {/* <div className="d-flex justify-content-between mt-2">
                            <Button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Prev
                            </Button>
                            <span>
                                Page {page} / {Math.ceil(total / limit) || 1}
                            </span>
                            <Button
                                disabled={page >= Math.ceil(total / limit)}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div> */}
                    </Card.Body>
                </Card>
            </Container>
        </MainLayout>
    );
};

export default BulkUpdateAssets;
