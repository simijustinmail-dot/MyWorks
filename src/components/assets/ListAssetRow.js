import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const ListAssetRow = ({ asset }) => {
    if (!asset) return null;

    return (
        <Card className="mb-3">
            <Card.Body>
                {/* Basic Details */}
                <h5 className="text-primary mb-3">Basic Details</h5>
                <Row>
                    <Col md={3}><strong>Asset Name:</strong> {asset.asset_name}</Col>
                    <Col md={3}><strong>Unique Code:</strong> {asset.asset_unique_code}</Col>
                    <Col md={3}><strong>KUHS Code:</strong> {asset.asset_kuhs_code}</Col>
                    <Col md={3}><strong>Model No:</strong> {asset.asset_model_no}</Col>
                    <Col md={3}><strong>Serial No:</strong> {asset.asset_serial_no}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>Type:</strong> {asset.asset_type_name}</Col>
                    <Col md={3}><strong>SubType:</strong> {asset.asset_subtype_name}</Col>
                    <Col md={3}><strong>Entity:</strong> {asset.asset_subtype_entity_name}</Col>
                    <Col md={3}><strong>Node:</strong> {asset.asset_subtype_entitynode_name}</Col>
                </Row>
                {/* Dynamic Fields */}
                {asset.dynamic_fields && asset.dynamic_fields.length > 0 && (
                    <>
                        <h6 className="text-secondary mt-3">Additional Info</h6>
                        <Row className="mt-2">
                            {asset.dynamic_fields.map((field, index) => (
                                <Col md={3} key={index}>
                                    <strong>{field.name}:</strong> {field.value}
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
                {/* Location */}
                <h5 className="text-primary mt-4 mb-3">Location</h5>
                <Row>
                    <Col md={3}><strong>Current Location:</strong> {asset.current_location}</Col>
                    <Col md={3}><strong>Campus:</strong> {asset.campus_name}</Col>
                    <Col md={3}><strong>Land:</strong> {asset.land_name}</Col>
                    <Col md={3}><strong>Building:</strong> {asset.building_name}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>Floor:</strong> {asset.floor_name}</Col>
                    <Col md={3}><strong>Room:</strong> {asset.room_name}</Col>
                    <Col md={3}><strong>Section:</strong> {asset.section_name}</Col>
                    <Col md={3}><strong>Seat:</strong> {asset.seat_name}</Col>
                </Row>

                {/* Warranty & Compliance */}
                <h5 className="text-primary mt-4 mb-3">Warranty & Compliance</h5>
                <Row>
                    <Col md={3}><strong>Warranty:</strong> {asset.warranty_applicable  === 't'? 'Yes' : 'No'}</Col>
                    <Col md={3}><strong>AMC:</strong> {asset.amc_applicable  === 't'? 'Yes' : 'No'}</Col>
                    <Col md={3}><strong>Depreciation:</strong> {asset.depreciation_applicable  === 't'? 'Yes' : 'No'}</Col>
                    <Col md={3}><strong>GST:</strong> {asset.gst_applicable  === 't'? 'Yes' : 'No'}</Col>
                </Row>

                {/* Sanctions */}
                <h5 className="text-primary mt-4 mb-3">Administrative , Technical Sanction & Work Order</h5>
                <Row>
                    <Col md={3}><strong>Admin Sanction No:</strong> {asset.admin_sanction_no}</Col>
                    <Col md={3}><strong>Admin Date:</strong> {asset.admin_sanction_date}</Col>
                    <Col md={3}><strong>Tech Sanction No:</strong> {asset.technical_sanction_no}</Col>
                    <Col md={3}><strong>Tech Date:</strong> {asset.technical_sanction_date}</Col>
                    <Col md={3}><strong>Work Order No:</strong> {asset.work_order_no}</Col>
                    <Col md={3}><strong>Work Order Date:</strong> {asset.work_order_date}</Col>
                    <Col md={3}><strong>Supply Order No:</strong> {asset.supply_order_no}</Col>
                    <Col md={3}><strong>Supply Order Date:</strong> {asset.supply_order_date}</Col>
                </Row>

                {/* Purchase */}
                <h5 className="text-primary mt-4 mb-3">Purchase Details</h5>
                <Row>
                    <Col md={3}><strong>Purchase Source:</strong> {asset.purchase_source}</Col>
                    <Col md={3}><strong>Purchase Code:</strong> {asset.purchase_code}</Col>
                    <Col md={3}><strong>Purchase Date:</strong> {asset.purchase_date}</Col>
                    <Col md={3}><strong>Vendor:</strong> {asset.vendor_name}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>GSTIN/Address:</strong> {asset.vendor_address_gst}</Col>
                    <Col md={3}><strong>Invoice No:</strong> {asset.invoice_no}</Col>
                </Row>

                {/* Cost */}
                <h5 className="text-primary mt-4 mb-3">Cost & Adjustments</h5>
                <Row>
                    <Col md={3}><strong>Cost:</strong> ₹{asset.cost}</Col>
                    <Col md={3}><strong>GST Charged:</strong> ₹{asset.gst_charged}</Col>
                    <Col md={3}><strong>Customs Duty:</strong> ₹{asset.customs_duties}</Col>
                    <Col md={3}><strong>Other Costs:</strong> ₹{asset.other_costs}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={6}><strong>Description of Other Costs:</strong> {asset.other_costs_description}</Col>
                    <Col md={3}><strong>Total Cost:</strong> ₹{asset.total_cost}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>Capitalization Date:</strong> {asset.capitalization_date}</Col>
                    <Col md={3}><strong>ITC Adjustment:</strong> ₹{asset.itc_adjustment}</Col>
                    <Col md={3}><strong>Subsidy:</strong> ₹{asset.subsidy_adjustment}</Col>
                    <Col md={3}><strong>Duties/Rebates:</strong> ₹{asset.duties_rebates_adjustment}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>Other Adjustments:</strong> ₹{asset.other_adjustments}</Col>
                    <Col md={3}><strong>Adjusted Cost:</strong> ₹{asset.cost_after_adjustments}</Col>
                </Row>

                {/* Depreciation */}
                <h5 className="text-primary mt-4 mb-3">Depreciation</h5>
                <Row>
                    <Col md={3}><strong>Initial Valuation:</strong> ₹{asset.initial_valuation}</Col>
                    <Col md={3}><strong>Revaluation:</strong> ₹{asset.revaluation_value}</Col>
                    <Col md={3}><strong>Depreciation Rate:</strong> {asset.depreciation_rate}%</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>Estimated Life:</strong> {asset.estimated_life} yrs</Col>
                    <Col md={3}><strong>Residual Value:</strong> ₹{asset.residual_value}</Col>
                    <Col md={3}><strong>Carrying Cost (Start):</strong> ₹{asset.carrying_cost_start}</Col>
                    <Col md={3}><strong>Carrying Cost (End):</strong> ₹{asset.carrying_cost_end}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>Years Expired:</strong> {asset.years_expired}</Col>
                    <Col md={3}><strong>Years Remaining:</strong> {asset.years_remaining}</Col>
                    <Col md={3}><strong>Life Over?</strong> {asset.is_life_over ? 'Yes' : 'No'}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>Accumulated Depreciation:</strong> ₹{asset.accumulated_depreciation}</Col>
                    <Col md={3}><strong>Adjustments This Year:</strong> ₹{asset.adjustments_this_year}</Col>
                </Row>

                {/* Disposal */}
                <h5 className="text-primary mt-4 mb-3">Disposal Details</h5>
                <Row>
                    <Col md={3}><strong>Disposal Date:</strong> {asset.sale_date}</Col>
                    <Col md={3}><strong>Sale Invoice No:</strong> {asset.sale_invoice_no}</Col>
                    <Col md={3}><strong>Sale Value:</strong> ₹{asset.sale_value}</Col>
                    <Col md={3}><strong>Purchaser:</strong> {asset.purchaser_name}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={6}><strong>Address:</strong> {asset.purchaser_address}</Col>
                    <Col md={3}><strong>Profit/Loss on Sale:</strong> ₹{asset.sale_profit_loss}</Col>
                    <Col md={3}><strong>Revaluation P/L:</strong> ₹{asset.revaluation_profit_loss}</Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}><strong>Impairment Loss:</strong> ₹{asset.impairment_loss}</Col>
                </Row>
                <h5 className="text-primary mt-4 mb-3">Verification Details</h5>
                <Row className="mt-2">
                    <Col md={6}><strong>Asset Status:</strong> {asset.asset_status}</Col>
                    <Col md={3}><strong>Verification Status:</strong> {asset.is_verified === 't' ? "Verified" : "Not Verified"}</Col>
                    <Col md={3}><strong>Verification Comments:</strong> {asset.verification_comment}</Col>
                </Row>
                {/* Dynamic Fields */}
                {/* {asset.dynamic_fields?.length > 0 && (
                    <>
                        <h5 className="text-primary mt-4 mb-3">Dynamic Characteristics</h5>
                        {asset.dynamic_fields.map((field, idx) => (
                            <Row key={idx} className="mt-1">
                                <Col md={4}><strong>{field.name}:</strong> {field.value}</Col>
                            </Row>
                        ))}
                    </>
                )} */}

            </Card.Body>
        </Card>
    );
};

export default ListAssetRow;
