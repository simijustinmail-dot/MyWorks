// ListAssets.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Table, Card, Button } from 'react-bootstrap';
import MainLayout from '../../layouts/Mainlayout';
import Toast from '../../components/Toast';
import ListAssetRow from './ListAssetRow';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { AssetFilterContext } from '../../context/AssetFilterContext';


const ListAssets = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [total, setTotal] = useState(0);
  const [verified, setVerified] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const [applyFiltersTrigger, setApplyFiltersTrigger] = useState(0);
  //const [assetCount, setAssetCount] = useState(0);
  const [assetTypes, setAssetTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [entities, setEntities] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const { filters, setFilters } = useContext(AssetFilterContext);
  // const [selectedType, setSelectedType] = useState('');
  // const [selectedSubType, setSelectedSubType] = useState('');
  // const [selectedEntity, setSelectedEntity] = useState('');
  // const [selectedNode, setSelectedNode] = useState('');

  const [campuses, setCampuses] = useState([]);
  const [lands, setLands] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [sections, setSections] = useState([]);
  const [seats, setSeats] = useState([]);
  // const [selectedCampus, setSelectedCampus] = useState('');
  // const [selectedLand, setSelectedLand] = useState('');
  // const [selectedBuilding, setSelectedBuilding] = useState('');
  // const [selectedFloor, setSelectedFloor] = useState('');
  // const [selectedRoom, setSelectedRoom] = useState('');
  // const [selectedSection, setSelectedSection] = useState('');
  // const [selectedSeat, setSelectedSeat] = useState('');

  /* const [filters, setFilters] = useState({
    selectedType: '',
    selectedSubType: '',
    selectedEntity: '',
    selectedNode: '',
    selectedCampus: '',
    selectedLand: '',
    selectedBuilding: '',
    selectedFloor: '',
    selectedRoom: '',
    selectedSection: '',
    selectedSeat: ''
  });
 */

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getCampuses' },
      withCredentials: true
    })
      .then(res => setCampuses(res.data.campuses || []))
      .catch(() => setToast({ message: 'Failed to load campus.', type: 'error' }));
  }, []);

  useEffect(() => {
    if (!filters.selectedCampus) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getLandsOnCampus', campus_id: filters.selectedCampus },
      withCredentials: true
    })
      .then(res => setLands(res.data.data || []));
  }, [filters.selectedCampus]);

  useEffect(() => {
    if (!filters.selectedLand) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getBuildingsOnLand', land_id: filters.selectedLand },
      withCredentials: true
    })
      .then(res => setBuildings(res.data.data || []));
  }, [filters.selectedLand]);

  useEffect(() => {
    if (!filters.selectedBuilding) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getFloorOnBuilding', building_id: filters.selectedBuilding },
      withCredentials: true
    })
      .then(res => setFloors(res.data.data || []));
  }, [filters.selectedBuilding]);

  useEffect(() => {
    if (!filters.selectedFloor) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getRoomOnFloor', floor_id: filters.selectedFloor },
      withCredentials: true
    })
      .then(res => setRooms(res.data.data || []));
  }, [filters.selectedFloor]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getSections' },
      withCredentials: true
    })
      .then(res => setSections(res.data.data || []))
      .catch(() => setToast({ message: 'Failed to load sections.', type: 'error' }));
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getSeatsOnSection', section_id: filters.selectedSection },
      withCredentials: true
    })
      .then(res => setSeats(res.data.data || []))
      .catch(() => setToast({ message: 'Failed to load seat.', type: 'error' }));
  }, [filters.selectedSection]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
      params: { type: 'getAssetTypes' },
      withCredentials: true
    })
      .then(res => setAssetTypes(res.data.data || []))
      .catch(() => setToast({ message: 'Failed to load asset types.', type: 'error' }));
  }, []);

  useEffect(() => {
    if (!filters.selectedType) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
      params: { type: 'getAssetSubTypesOnType', asset_type: filters.selectedType },
      withCredentials: true
    })
      .then(res => setSubTypes(res.data.data || []));
  }, [filters.selectedType]);

  useEffect(() => {
    if (!filters.selectedSubType) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
      params: { type: 'getAssetSubTypeEntityOnSubType', asset_subtype: filters.selectedSubType },
      withCredentials: true
    })
      .then(res => setEntities(res.data.data || []));
  }, [filters.selectedSubType]);

  useEffect(() => {
    if (!filters.selectedEntity) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
      params: { type: 'getAssetSubTypeEntityNodesOnEntity', entity_id: filters.selectedEntity },
      withCredentials: true
    })
      .then(res => setNodes(res.data.data || []));
  }, [filters.selectedEntity]);

  //const handleFetchAssets = useCallback(async () => {
  const handleFetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
        params: {
          type: 'getAssets',
          page,
          limit,
          asset_type_id: filters.selectedType,
          asset_subtype_id: filters.selectedSubType,
          asset_subtype_entity_id: filters.selectedEntity,
          asset_subtype_entitynode_id: filters.selectedNode,
          campus_id: filters.selectedCampus,
          land_id: filters.selectedLand,
          building_id: filters.selectedBuilding,
          floor_id: filters.selectedFloor,
          room_id: filters.selectedRoom,
          section_id: filters.selectedSection,
          seat_id: filters.selectedSeat,
          assigned: filters.assigned,
          verified: filters.verified,
          search: filters.searchText,
        },
        withCredentials: true, // if you use cookies for auth
      });
      const assets = Array.isArray(res.data.data) ? res.data.data : [];
      setAssetData(assets);
      //setAssetCount(assets.length);
      setTotal(res.data.total || 0);
      setVerified(res.data.verified || 0);
      setAssigned(res.data.assigned || 0);
    } catch (err) {
      console.error("Error fetching assets:", err);
    } finally {
      setLoading(false);
    }
  };
  //, [
  //  page, limit,
  //  selectedType, selectedSubType, selectedEntity, selectedNode,
  //  selectedCampus, selectedLand, selectedBuilding, selectedFloor, selectedSection
  //]);

  // Only re-fetch when `page,limit` changes, and on page load
  useEffect(() => {
    handleFetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, applyFiltersTrigger]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <MainLayout>
      <Container fluid className="p-4">
        <h2>Asset Listing</h2>

        {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}

        <Card className="mb-4">
          <Card.Body>
            <Row className="g-2 mb-2">
              <Col md={2}><Form.Group><Form.Label>Asset Type</Form.Label><Form.Select value={filters.selectedType}
                onChange={(e) => {
                  setFilters((f) => ({
                    ...f,
                    selectedType: e.target.value,
                    selectedSubType: "",
                    selectedEntity: "",
                    selectedNode: "",
                  }));
                  setSubTypes([]);
                  setEntities([]);
                  setNodes([]);
                }}><option value="">Select Type</option>{assetTypes.map(t => <option key={t.asset_type_id} value={t.asset_type_id}>{t.asset_type_code} : {t.asset_type_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Sub Type</Form.Label><Form.Select value={filters.selectedSubType}
                onChange={(e) => {
                  setFilters(f => ({
                    ...f,
                    selectedSubType: e.target.value,
                    selectedEntity: '',
                    selectedNode: ''
                  }));
                  setEntities([]);
                  setNodes([]);
                }}><option value="">Select SubType</option>{subTypes.map(t => <option key={t.asset_subtype_id} value={t.asset_subtype_id}>{t.asset_subtype_code} : {t.asset_subtype_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Entity</Form.Label><Form.Select value={filters.selectedEntity}
                onChange={(e) => {
                  setFilters(f => ({
                    ...f,
                    selectedEntity: e.target.value,
                    selectedNode: ''
                  }));
                  setNodes([]);
                }}><option value="">Select Entity</option>{entities.map(e => <option key={e.asset_subtype_entity_id} value={e.asset_subtype_entity_id}>{e.asset_subtype_entity_code} : {e.asset_subtype_entity_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Node</Form.Label><Form.Select value={filters.selectedNode} onChange={(e) =>
                setFilters(f => ({
                  ...f,
                  selectedNode: e.target.value,
                }))
              }><option value="">Select Node</option>{nodes.map(n => <option key={n.asset_subtype_entitynode_id} value={n.asset_subtype_entitynode_id}>{n.asset_subtype_entitynode_code} : {n.asset_subtype_entitynode_name}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Row className="g-2 mb-2">
              <Col md={2}><Form.Group><Form.Label>Campus</Form.Label><Form.Select value={filters.selectedCampus}
                onChange={(e) => {
                  setFilters(f => ({
                    ...f,
                    selectedCampus: e.target.value,
                    selectedLand: '',
                    selectedBuilding: '',
                    selectedFloor: '',
                    selectedRoom: ''
                  }));
                  setLands([]);
                  setBuildings([]);
                  setFloors([]);
                  setRooms([]);
                }}><option value="">Select Campus</option>{campuses.map(c => <option key={c.campus_id} value={c.campus_id}>{c.campus_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Land</Form.Label><Form.Select value={filters.selectedLand}
                onChange={(e) => {
                  setFilters(f => ({
                    ...f,
                    selectedLand: e.target.value,
                    selectedBuilding: '',
                    selectedFloor: '',
                    selectedRoom: ''
                  }));
                  setBuildings([]);
                  setFloors([]);
                  setRooms([]);
                }}><option value="">Select Land</option>{lands.map(l => <option key={l.land_id} value={l.land_id}>{l.land_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Building</Form.Label><Form.Select value={filters.selectedBuilding}
                onChange={(e) => {
                  setFilters(f => ({
                    ...f,
                    selectedBuilding: e.target.value,
                    selectedFloor: '',
                    selectedRoom: ''
                  }));
                  setFloors([]);
                  setRooms([]);
                }}><option value="">Select Building</option>{buildings.map(l => <option key={l.building_id} value={l.building_id}>{l.building_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Floor</Form.Label><Form.Select value={filters.selectedFloor}
                onChange={(e) => {
                  setFilters(f => ({
                    ...f,
                    selectedFloor: e.target.value,
                    selectedRoom: ''
                  }));
                  setRooms([]);
                }}><option value="">Select Floor</option>{floors.map(l => <option key={l.floor_id} value={l.floor_id}>{l.floor_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Room</Form.Label><Form.Select value={filters.selectedRoom} onChange={(e) =>
                setFilters(f => ({
                  ...f,
                  selectedRoom: e.target.value
                }))
              }><option value="">Select Room</option>{rooms.map(l => <option key={l.room_id} value={l.room_id}>{l.room_no}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Row className="g-2 mb-2">
              <Col md={2}><Form.Group><Form.Label>Section</Form.Label><Form.Select value={filters.selectedSection} onChange={(e) =>
                setFilters(f => ({
                  ...f,
                  selectedSection: e.target.value,
                  selectedSeat: ''
                }))
              }><option value="">Select Section</option>{sections.map(l => <option key={l.section_id} value={l.section_id}>{l.section_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Seat</Form.Label><Form.Select value={filters.selectedSeat} onChange={(e) =>
                setFilters(f => ({
                  ...f,
                  selectedSeat: e.target.value
                }))
              }><option value="">Select Seat</option>{seats.map(l => <option key={l.seat_id} value={l.seat_id}>{l.seat_name}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Row className="g-2 mb-2">
              <Col md={2}><Form.Group><Form.Label>Assigned to Section</Form.Label><Form.Select value={filters.assigned} onChange={e => setFilters(f => ({ ...f, assigned: e.target.value }))}>
                <option value="">All</option>
                <option value="1">Assigned</option>
                <option value="0">Not Assigned</option></Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Verified</Form.Label><Form.Select value={filters.verified} onChange={e => setFilters(f => ({ ...f, verified: e.target.value }))}>
                <option value="">All</option>
                <option value="1">Verified</option>
                <option value="0">Not Verified</option></Form.Select></Form.Group></Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col md={6}>
                <label className="form-label mb-0">Search</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Enter asset name or assetcode or kuhscode or model no or serial no"
                  value={filters.searchText}
                  onChange={(e) =>
                    setFilters(f => ({
                      ...f,
                      searchText: e.target.value
                    }))
                  }
                />
              </Col>
            </Row>
            <Row><Col className="text-end"><Button onClick={() => { setPage(1); setApplyFiltersTrigger(v => v + 1); }}>Apply Filters</Button></Col></Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Assets</span>
            {/* <span className="badge bg-success">{total} found</span> */}
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning fs-6">{total} total</span><span className="badge bg-secondary fs-6">{assigned} assigned</span><span className="badge bg-success fs-6">{verified} verified</span>
            </div>
          </Card.Header>
          <Card.Body>
            {assetData.length > 0 && (
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
              <p>Loading...</p>
            ) : assetData.length > 0 ? (
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th style={{ minWidth: "125px", whiteSpace: "nowrap" }}>Asset Code</th>
                    <th>Asset KUHS Code</th>
                    {/* <th>Model</th> */}
                    <th>Location</th>
                    <th>Asset Type</th>
                    <th>Asset SubType</th>
                    <th>Asset SubType Entity</th>
                    <th>Asset SubType Entity Node</th>
                    <th>Action</th>
                    <th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {assetData.map((asset, idx) => (
                    <React.Fragment key={asset.asset_id}>
                      <tr onClick={() => toggleRow(asset.asset_id)} style={{ cursor: 'pointer' }}>
                        <td>{idx + 1}</td>
                        <td className="text-truncate" style={{ maxWidth: '250px' }} title={asset.asset_name}>{asset.asset_name}</td>
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
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/assets/add-asset', { state: { asset, action: 'verify' } });
                              }}
                            >
                              Verify Info
                            </Button>
                            {user.role !== 'SectionAdmin' && (<Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/assets/add-asset', { state: { asset, action: 'edit' } });
                              }}
                            >
                              Edit Info
                            </Button>)}
                            <Button
                              variant={expandedRow === asset.asset_id ? 'info' : 'warning'}
                              size="sm"
                              onClick={() => toggleRow(asset.asset_id)}
                            >
                              {expandedRow === asset.asset_id ? 'Hide Info' : 'View Info'}
                            </Button>
                          </div>
                        </td>
                        <td>{asset.is_verified === 't' ? "✅" : "❌"}</td>
                      </tr>
                      {expandedRow === asset.asset_id && (
                        <tr>
                          <td colSpan="12">
                            <ListAssetRow asset={asset} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No assets found.</p>
            )}

          </Card.Body>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default ListAssets;
