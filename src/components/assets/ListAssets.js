// ListAssets.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Table, Card, Button } from 'react-bootstrap';
import MainLayout from '../../layouts/Mainlayout';
import Toast from '../../components/Toast';
import ListAssetRow from './ListAssetRow';
import { useNavigate } from 'react-router-dom';

const ListAssets = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [total, setTotal] = useState(0);
  //const [assetCount, setAssetCount] = useState(0);
  const [assetTypes, setAssetTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [entities, setEntities] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const [selectedType, setSelectedType] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedNode, setSelectedNode] = useState('');

  const [campuses, setCampuses] = useState([]);
  const [lands, setLands] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [sections, setSections] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedLand, setSelectedLand] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSeat, setSelectedSeat] = useState('');




  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/misc/misc.ajax.php`, {
      params: { type: 'getCampuses' },
      withCredentials: true
    })
      .then(res => setCampuses(res.data.campuses || []))
      .catch(() => setToast({ message: 'Failed to load campus.', type: 'error' }));
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getLandsOnCampus', campus_id: selectedCampus },
      withCredentials: true
    })
      .then(res => setLands(res.data.data || []));
  }, [selectedCampus]);

  useEffect(() => {
    if (!selectedLand) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getBuildingsOnLand', land_id: selectedLand },
      withCredentials: true
    })
      .then(res => setBuildings(res.data.data || []));
  }, [selectedLand]);

  useEffect(() => {
    if (!selectedBuilding) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getFloorOnBuilding', building_id: selectedBuilding },
      withCredentials: true
    })
      .then(res => setFloors(res.data.data || []));
  }, [selectedBuilding]);

  useEffect(() => {
    if (!selectedFloor) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
      params: { type: 'getRoomOnFloor', floor_id: selectedFloor },
      withCredentials: true
    })
      .then(res => setRooms(res.data.data || []));
  }, [selectedFloor]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/misc/misc.ajax.php`, {
      params: { type: 'getSections' },
      withCredentials: true
    })
      .then(res => setSections(res.data.data || []))
      .catch(() => setToast({ message: 'Failed to load sections.', type: 'error' }));
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/misc/misc.ajax.php`, {
      params: { type: 'getSeats' },
      withCredentials: true
    })
      .then(res => setSeats(res.data.data || []))
      .catch(() => setToast({ message: 'Failed to load seat.', type: 'error' }));
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/asset/asset.ajax.php`, {
      params: { type: 'getAssetTypes' },
      withCredentials: true
    })
      .then(res => setAssetTypes(res.data.data || []))
      .catch(() => setToast({ message: 'Failed to load asset types.', type: 'error' }));
  }, []);

  useEffect(() => {
    if (!selectedType) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
      params: { type: 'getAssetSubTypesOnType', asset_type: selectedType },
      withCredentials: true
    })
      .then(res => setSubTypes(res.data.data || []));
  }, [selectedType]);

  useEffect(() => {
    if (!selectedSubType) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
      params: { type: 'getAssetSubTypeEntityOnSubType', asset_subtype: selectedSubType },
      withCredentials: true
    })
      .then(res => setEntities(res.data.data || []));
  }, [selectedSubType]);

  useEffect(() => {
    if (!selectedEntity) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
      params: { type: 'getAssetSubTypeEntityNodesOnEntity', entity_id: selectedEntity },
      withCredentials: true
    })
      .then(res => setNodes(res.data.data || []));
  }, [selectedEntity]);

  //const handleFetchAssets = useCallback(async () => {
  const handleFetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
        params: {
          type: 'getAssets',
          page,
          limit,
          asset_type_id: selectedType,
          asset_subtype_id: selectedSubType,
          entity_id: selectedEntity,
          node_id: selectedNode,
          campus_id: selectedCampus,
          land_id: selectedLand,
          building_id: selectedBuilding,
          floor_id: selectedFloor,
          room_id: selectedRoom,
          section_id: selectedSection,
          seat_id: selectedSeat,
        },
        withCredentials: true, // if you use cookies for auth
      });
      const assets = Array.isArray(res.data.data) ? res.data.data : [];
      setAssetData(assets);
      //setAssetCount(assets.length);
      setTotal(res.data.total || 0);
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
  }, [page, limit]);

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
              <Col md={2}><Form.Group><Form.Label>Asset Type</Form.Label><Form.Select value={selectedType} onChange={e => { setSelectedType(e.target.value); setSelectedSubType(''); setEntities([]); setNodes([]); }}><option value="">Select Type</option>{assetTypes.map(t => <option key={t.asset_type_id} value={t.asset_type_id}>{t.asset_type_code} : {t.asset_type_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Sub Type</Form.Label><Form.Select value={selectedSubType} onChange={e => { setSelectedSubType(e.target.value); setEntities([]); setNodes([]); }}><option value="">Select SubType</option>{subTypes.map(t => <option key={t.asset_subtype_id} value={t.asset_subtype_id}>{t.asset_subtype_code} : {t.asset_subtype_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Entity</Form.Label><Form.Select value={selectedEntity} onChange={e => { setSelectedEntity(e.target.value); setNodes([]); }}><option value="">Select Entity</option>{entities.map(e => <option key={e.asset_subtype_entity_id} value={e.asset_subtype_entity_id}>{e.asset_subtype_entity_code} : {e.asset_subtype_entity_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Node</Form.Label><Form.Select value={selectedNode} onChange={e => setSelectedNode(e.target.value)}><option value="">Select Node</option>{nodes.map(n => <option key={n.asset_subtype_entitynode_id} value={n.asset_subtype_entitynode_id}>{n.asset_subtype_entitynode_code} : {n.asset_subtype_entitynode_name}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Row className="g-2 mb-2">
              <Col md={2}><Form.Group><Form.Label>Campus</Form.Label><Form.Select value={selectedCampus} onChange={e => { setSelectedCampus(e.target.value); setSelectedLand(''); setSelectedBuilding(''); setSelectedFloor(''); }}><option value="">Select Campus</option>{campuses.map(c => <option key={c.campus_id} value={c.campus_id}>{c.campus_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Land</Form.Label><Form.Select value={selectedLand} onChange={e => { setSelectedLand(e.target.value); setSelectedBuilding(''); setSelectedFloor(''); }}><option value="">Select Land</option>{lands.map(l => <option key={l.land_id} value={l.land_id}>{l.land_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Building</Form.Label><Form.Select value={selectedBuilding} onChange={e => { setSelectedBuilding(e.target.value); setSelectedFloor(''); }}><option value="">Select Building</option>{buildings.map(l => <option key={l.building_id} value={l.building_id}>{l.building_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Floor</Form.Label><Form.Select value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)}><option value="">Select Floor</option>{floors.map(l => <option key={l.floor_id} value={l.floor_id}>{l.floor_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Room</Form.Label><Form.Select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}><option value="">Select Room</option>{rooms.map(l => <option key={l.room_id} value={l.room_id}>{l.room_no}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Row className="g-2 mb-2">
              <Col md={2}><Form.Group><Form.Label>Section</Form.Label><Form.Select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}><option value="">Select Section</option>{sections.map(l => <option key={l.section_id} value={l.section_id}>{l.section_name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Seat</Form.Label><Form.Select value={selectedSeat} onChange={e => setSelectedSeat(e.target.value)}><option value="">Select Seat</option>{seats.map(l => <option key={l.seat_id} value={l.seat_id}>{l.seat_name}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Row><Col className="text-end"><Button onClick={handleFetchAssets}>Go</Button></Col></Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Assets</span>
            <span className="badge bg-success">{total} found</span>
          </Card.Header>
          <Card.Body>
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
                                navigate('/assets/add-asset', { state: { asset , action: 'verify' } });
                              }}
                            >
                              Verify
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/assets/add-asset', { state: { asset, action: 'edit' } });
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant={expandedRow === asset.asset_id ? 'info' : 'warning'}
                              size="sm"
                              onClick={() => toggleRow(asset.asset_id)}
                            >
                              {expandedRow === asset.asset_id ? 'Hide' : 'Expand'}
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
          {assetData.length > 0 && (
            <Card.Footer>
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  {total > 0 && (
                    <small className="text-muted">
                      Showing {Math.min((page - 1) * limit + 1, total)} –
                      {Math.min(page * limit, total)} of {total} assets
                    </small>
                  )}
                </div>
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
              </div>
            </Card.Footer>
          )}
        </Card>
      </Container>
    </MainLayout>
  );
};

export default ListAssets;
