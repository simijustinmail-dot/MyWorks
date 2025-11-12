import React, { useState } from 'react';
import MainLayout from '../../layouts/Mainlayout';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const AddAsset = () => {
    const [formData, setFormData] = useState({
        assetName: '',
        assetType: '',
        campus: '',
        location: '',
        purchaseDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Save logic here
        alert('Basic asset saved. Now you can edit full details.');
    };

    return (
        <MainLayout>
            <Container fluid className="p-4">
                <h2 className="mb-4">Add New Asset</h2>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Asset Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetName"
                                        value={formData.assetName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Asset Type</Form.Label>
                                    <Form.Select name="assetType" value={formData.assetType} onChange={handleChange}>
                                        <option>Select Type</option>
                                        <option>Computer</option>
                                        <option>Furniture</option>
                                        <option>Vehicle</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Campus</Form.Label>
                                    <Form.Select name="campus" value={formData.campus} onChange={handleChange}>
                                        <option>Select Campus</option>
                                        <option>Headquarters</option>
                                        <option>Campus A</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Purchase Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="purchaseDate"
                                        value={formData.purchaseDate}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Row className="mt-4">
                    <Col className="text-center">
                        <Button variant="success" onClick={handleSave}>Save & Continue</Button>
                    </Col>
                </Row>
            </Container>
        </MainLayout>
    );
};

export default AddAsset;
