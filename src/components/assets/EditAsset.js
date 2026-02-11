import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../layouts/Mainlayout';
import axios from 'axios';
import { Tabs, Tab, Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import { UserContext } from '../../context/UserContext';


const EditAsset = () => {
    const { user } = useContext(UserContext); // Access user from context 
    const isViewMode = user.role === "ViewOnly";
    const [toast, setToast] = useState({ message: '', type: '' });
    const location = useLocation();
    const navigate = useNavigate();
    const [userChangedType, setUserChangedType] = useState(false);
    const incomingAsset = location.state?.asset || null;
    const [key, setKey] = useState('identity');
    const [assetTypes, setAssetTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);
    const [entities, setEntities] = useState([]);
    const [nodes, setNodes] = useState([]);
    const assetId = incomingAsset?.asset_id || '';
    const action = location.state?.action || 'add';
    const isAdd = action === 'add';
    const isEdit = action === 'edit';
    const isVerify = action === 'verify';
    const isDisabled = isEdit || isVerify;
    const isDisabledForSectionUser = (isEdit || isVerify) && user.role === "SectionAdmin";
    const [uniqueCode, setUniqueCode] = useState(incomingAsset?.asset_unique_code || '');
    const [kuhsCode, setKuhsCode] = useState(incomingAsset?.asset_kuhs_code || '');
    const [serialNo, setSerialNo] = useState(incomingAsset?.asset_serial_no || '');
    const [modelNo, setModelNo] = useState(incomingAsset?.asset_model_no || '');
    const [assetName, setAssetName] = useState(incomingAsset?.asset_name || '');

    const [selectedType, setSelectedType] = useState(incomingAsset?.asset_type_id || '');
    const [selectedSubType, setSelectedSubType] = useState(incomingAsset?.asset_subtype_id || '');
    const [selectedEntity, setSelectedEntity] = useState(incomingAsset?.asset_subtype_entity_id || '');
    const [selectedNode, setSelectedNode] = useState(incomingAsset?.asset_subtype_entitynode_id || '');
    const [campuses, setCampuses] = useState([]);
    const [lands, setLands] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [sections, setSections] = useState([]);
    const [seats, setSeats] = useState([]);

    const [selectedCampus, setSelectedCampus] = useState(incomingAsset?.campus_id || '');
    const [selectedLand, setSelectedLand] = useState(incomingAsset?.land_id || '');
    const [selectedBuilding, setSelectedBuilding] = useState(incomingAsset?.building_id || '');
    const [selectedFloor, setSelectedFloor] = useState(incomingAsset?.floor_id || '');
    const [selectedRoom, setSelectedRoom] = useState(incomingAsset?.room_id || '');
    const [selectedSection, setSelectedSection] = useState(incomingAsset?.section_id || '');
    const [selectedSeat, setSelectedSeat] = useState(incomingAsset?.seat_id || '');

    const [warrantyApplicable, setWarrantyApplicable] = useState(incomingAsset?.warranty_applicable === 't');
    const [amcApplicable, setAmcApplicable] = useState(incomingAsset?.amc_applicable === 't');
    const [gstApplicable, setGstApplicable] = useState(incomingAsset?.gst_applicable === 't');
    const [depreciationApplicable, setDepreciationApplicable] = useState(incomingAsset?.depreciation_applicable === 't');

    const [adminSanctionNo, setAdminSanctionNo] = useState(incomingAsset?.admin_sanction_no || '');
    const [adminSanctionDate, setAdminSanctionDate] = useState(incomingAsset?.admin_sanction_date || '');
    const [technicalSanctionNo, setTechnicalSanctionNo] = useState(incomingAsset?.technical_sanction_no || '');
    const [technicalSanctionDate, setTechnicalSanctionDate] = useState(incomingAsset?.technical_sanction_date || '');
    const [workOrderNo, setWorkOrderNo] = useState(incomingAsset?.work_order_no || '');
    const [workOrderDate, setWorkOrderDate] = useState(incomingAsset?.work_order_date || '');
    const [supplyOrderNo, setSupplyOrderNo] = useState(incomingAsset?.supply_order_no || '');
    const [supplyOrderDate, setSupplyOrderDate] = useState(incomingAsset?.supply_order_date || '');

    const [sourceOfFund, setSourceOfFund] = useState(incomingAsset?.source_of_fund || '');
    const [purchaseCode, setPurchaseCode] = useState(incomingAsset?.purchase_code || '');
    const [purchaseDate, setPurchaseDate] = useState(incomingAsset?.purchase_date || '');
    const [vendorName, setVendorName] = useState(incomingAsset?.vendor_name || '');
    const [vendorAddressGst, setVendorAddressGst] = useState(incomingAsset?.vendor_address_gst || '');
    const [invoiceNo, setInvoiceNo] = useState(incomingAsset?.invoice_no || '');

    const [purchaseCost, setPurchaseCost] = useState(incomingAsset?.cost_excl_gst || ''); //exclu gst
    const [gstCharged, setGstCharged] = useState(incomingAsset?.gst_charged || '');
    const [gstPercentage, setGstPercentage] = useState(incomingAsset?.gst_percentage || '');
    const [customDuties, setCustomDuties] = useState(incomingAsset?.customs_duties || '');
    const [otherCosts, setOtherCosts] = useState(incomingAsset?.other_costs || '');
    const [otherCostsDesc, setOtherCostsDesc] = useState(incomingAsset?.other_costs_desc || '');
    const [discount, setDiscount] = useState(incomingAsset?.discount || '');
    const [totalCost, setTotalCost] = useState(incomingAsset?.total_cost || '');

    const [capitalizationDate, setCapitalizationDate] = useState(incomingAsset?.capitalization_date || '');
    const [itcAdjustment, setItcAdjustment] = useState(incomingAsset?.itc_adjustment || '');
    const [subsidyAdjustment, setSubsidyAdjustment] = useState(incomingAsset?.subsidy_adjustment || '');
    const [dutiesRebatesAdjustment, setDutiesRebatesAdjustment] = useState(incomingAsset?.duties_rebates_adjustment || '');
    const [otherAdjustments, setOtherAdjustments] = useState(incomingAsset?.other_adjustments || '');
    const [costAfterAdjustments, setCostAfterAdjustments] = useState(incomingAsset?.cost_after_adjustments || '');

    // Depreciation states
    const [initialValuationDate, setInitialValuationDate] = useState(incomingAsset?.initial_valuation_date || '');
    const [initialValuationValue, setInitialValuationValue] = useState(incomingAsset?.initial_valuation_value || '');
    const [revaluationDate, setRevaluationDate] = useState(incomingAsset?.revaluation_date || '');
    const [revaluationValue, setRevaluationValue] = useState(incomingAsset?.revaluation_value || '');
    const [estimatedLifeYears, setEstimatedLife] = useState(incomingAsset?.estimated_life_years || '');
    const [residualValue, setResidualValue] = useState(incomingAsset?.estimated_residual_value || '');
    const [carryingCostBegin, setCarryingCostBegin] = useState(incomingAsset?.carrying_cost_begin || '');
    const [yearsExpired, setYearsExpired] = useState(incomingAsset?.years_expired || '');
    const [yearsRemaining, setYearsRemaining] = useState(incomingAsset?.years_remaining || '');
    const [isLifeOverOr5Percent, setIsLifeOverOr5Percent] = useState(incomingAsset?.life_over_or_5_percent === 't');
    const [depreciationRate, setDepreciationRate] = useState(incomingAsset?.depreciation_rate || '');
    const [accumulatedDepreciation, setAccumulatedDepreciation] = useState(incomingAsset?.accumulated_depreciation || '');
    const [adjustmentsThisYear, setAdjustmentsThisYear] = useState(incomingAsset?.adjustments_this_year || '');
    const [carryingCostEnd, setCarryingCostEnd] = useState(incomingAsset?.carrying_cost_end || '');

    // Disposal states
    const [saleDate, setSaleDate] = useState(incomingAsset?.sale_date || '');
    const [saleInvoiceNo, setSaleInvoiceNo] = useState(incomingAsset?.sale_invoice_no || '');
    const [saleValueExclGst, setSaleValueExclGst] = useState(incomingAsset?.sale_value_excl_gst || '');
    const [purchaserName, setPurchaserName] = useState(incomingAsset?.purchaser_name || '');
    const [purchaserAddress, setPurchaserAddress] = useState(incomingAsset?.purchaser_address || '');
    const [profitLossOnSale, setProfitLossOnSale] = useState(incomingAsset?.profit_loss_on_sale || '');
    const [profitLossOnRevaluation, setProfitLossOnRevaluation] = useState(incomingAsset?.profit_loss_on_revaluation || '');
    const [impairmentLoss, setImpairmentLoss] = useState(incomingAsset?.impairment_loss || '');

    const [dynamicFields, setDynamicFields] = useState(incomingAsset?.dynamic_fields || []);
    const [loadingFields, setLoadingFields] = useState(false);
    const [assetFieldSettings, setAssetFieldSettings] = useState([]); // settings from DB
    const [assetStatus, setAssetStatus] = useState(incomingAsset?.asset_status || (isVerify ? "Fully Functional" : null));
    const [verificationComment, setVerificationComment] = useState(incomingAsset?.verification_comment || '');

    const handleSave = () => {
        let errors = [];

        //if (!uniqueCode) errors.push("Asset Unique Code is required.");
        //if (!kuhsCode) errors.push("Asset Code (KUHS) is required.");
        if (!assetName) errors.push("Asset Name is required.");
        if (!selectedType) errors.push("Asset Type is required.");
        if (!selectedSubType) errors.push("Asset SubType is required.");
        if (!selectedEntity) errors.push("Asset SubType Entity is required.");
        if (!selectedNode) errors.push("Asset SubType Entity Node is required.");

        // If errors exist, show them in a single toast and stop execution
        if (errors.length > 0) {
            setToast({
                message: "Please fix the following:\n" + errors.join("\n"),
                type: "error"
            });
            return;
        }
        const selectedAssetType = assetTypes.find(type => type.asset_type_id === selectedType);
        const asset_type_name = selectedAssetType
            ? `${selectedAssetType.asset_type_code} : ${selectedAssetType.asset_type_name}`
            : '';
        const selectedAssetSubType = subTypes.find(type => type.asset_subtype_id === selectedSubType);
        const asset_subtype_name = selectedAssetSubType
            ? `${selectedAssetSubType.asset_subtype_code} : ${selectedAssetSubType.asset_subtype_name}`
            : '';
        const selectedAssetSubTypeEntity = entities.find(type => type.asset_subtype_entity_id === selectedEntity);
        const asset_subtype_entity_name = selectedAssetSubTypeEntity
            ? `${selectedAssetSubTypeEntity.asset_subtype_entity_code} : ${selectedAssetSubTypeEntity.asset_subtype_entity_name}`
            : '';
        const selectedAssetSubTypeEntityNode = nodes.find(type => type.asset_subtype_entitynode_id === selectedNode);
        const asset_subtype_entitynode_name = selectedAssetSubTypeEntityNode
            ? `${selectedAssetSubTypeEntityNode.asset_subtype_entitynode_code} : ${selectedAssetSubTypeEntityNode.asset_subtype_entitynode_name}`
            : '';
        const selectedCampusItem = campuses.find(type => type.campus_id === selectedCampus);
        const campus_name = selectedCampusItem
            ? `${selectedCampusItem.campus_name}`
            : '';
        const selectedLandItem = lands.find(type => type.land_id === selectedLand);
        const land_name = selectedLandItem
            ? `${selectedLandItem.land_name}`
            : '';
        const selectedBuildingItem = buildings.find(type => type.building_id === selectedBuilding);
        const building_name = selectedBuildingItem
            ? `${selectedBuildingItem.building_name}`
            : '';
        const selectedFloorItem = floors.find(type => type.floor_id === selectedFloor);
        const floor_name = selectedFloorItem
            ? `${selectedFloorItem.floor_name}`
            : '';
        const selectedRoomItem = rooms.find(type => type.room_id === selectedRoom);
        const room_name = selectedRoomItem
            ? `${selectedRoomItem.room_no}`
            : '';
        const selectedSectionItem = sections.find(type => type.section_id === selectedSection);
        const section_name = selectedSectionItem
            ? `${selectedSectionItem.section_name}`
            : '';
        const selectedSeatItem = seats.find(type => type.seat_id === selectedSeat);
        const seat_name = selectedSeatItem
            ? `${selectedSeatItem.seat_name}`
            : '';


        const assetPayload = {
            action: action,
            asset_id: assetId,
            asset_unique_code: uniqueCode,
            asset_kuhs_code: kuhsCode,
            asset_serial_no: serialNo,
            asset_model_no: modelNo,
            asset_name: assetName,
            asset_type_id: selectedType,
            asset_type_name: asset_type_name,
            asset_subtype_id: selectedSubType,
            asset_subtype_name: asset_subtype_name,
            asset_subtype_entity_id: selectedEntity,
            asset_subtype_entity_name: asset_subtype_entity_name,
            asset_subtype_entitynode_id: selectedNode,
            asset_subtype_entitynode_name: asset_subtype_entitynode_name,
            campus_id: selectedCampus,
            campus_name: campus_name,
            land_id: selectedLand,
            land_name: land_name,
            building_id: selectedBuilding,
            building_name: building_name,
            floor_id: selectedFloor,
            floor_name: floor_name,
            room_id: selectedRoom,
            room_name: room_name,
            section_id: selectedSection,
            section_name: section_name,
            seat_id: selectedSeat,
            seat_name: seat_name,
            warranty_applicable: warrantyApplicable ? 't' : 'f',
            amc_applicable: amcApplicable ? 't' : 'f',
            gst_applicable: gstApplicable ? 't' : 'f',
            depreciation_applicable: depreciationApplicable ? 't' : 'f',
            admin_sanction_no: adminSanctionNo,
            admin_sanction_date: adminSanctionDate,
            technical_sanction_no: technicalSanctionNo,
            technical_sanction_date: technicalSanctionDate,
            work_order_no: workOrderNo,
            work_order_date: workOrderDate,
            supply_order_no: supplyOrderNo,
            supply_order_date: supplyOrderDate,
            source_of_fund: sourceOfFund,
            purchase_code: purchaseCode,
            purchase_date: purchaseDate,
            vendor_name: vendorName,
            vendor_address_gst: vendorAddressGst,
            invoice_no: invoiceNo,
            cost_excl_gst: purchaseCost,
            gst_charged: gstCharged,
            gst_percentage: gstPercentage,
            customs_duties: customDuties,
            other_costs: otherCosts,
            other_costs_desc: otherCostsDesc,
            discount: discount,
            total_cost: totalCost,
            capitalization_date: capitalizationDate,
            itc_adjustment: itcAdjustment,
            subsidy_adjustment: subsidyAdjustment,
            duties_rebates_adjustment: dutiesRebatesAdjustment,
            other_adjustments: otherAdjustments,
            cost_after_adjustments: costAfterAdjustments,

            initial_valuation_date: initialValuationDate,
            initial_valuation_value: initialValuationValue,
            revaluation_date: revaluationDate,
            revaluation_value: revaluationValue,
            estimated_life_years: estimatedLifeYears,
            estimated_residual_value: residualValue,
            carrying_cost_begin: carryingCostBegin,
            years_expired: yearsExpired,
            years_remaining: yearsRemaining,
            life_over_or_5_percent: isLifeOverOr5Percent ? 't' : 'f',
            depreciation_rate: depreciationRate,
            accumulated_depreciation: accumulatedDepreciation,
            adjustments_this_year: adjustmentsThisYear,
            carrying_cost_end: carryingCostEnd,

            sale_date: saleDate,
            sale_invoice_no: saleInvoiceNo,
            sale_value_excl_gst: saleValueExclGst,
            purchaser_name: purchaserName,
            purchaser_address: purchaserAddress,
            profit_loss_on_sale: profitLossOnSale,
            profit_loss_on_revaluation: profitLossOnRevaluation,
            impairment_loss: impairmentLoss,
            asset_status: isVerify ? (assetStatus || 'Fully Functional') : assetStatus || incomingAsset?.asset_status || null,
            verification_comment: isVerify ? (verificationComment || '') : verificationComment || incomingAsset?.verification_comment || null,
            is_verified: isVerify ? 't' : incomingAsset?.is_verified || null,
            dynamic_fields: dynamicFields, // array of { name, value }
            custom_fields: dynamicFields.reduce((acc, f) => {
                acc[f.name] = f.value;
                return acc;
            }, {})
        };

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, assetPayload, {
            params: { type: 'saveAsset' },
            withCredentials: true
        }).then((res) => {
            if (res.data.status === 'success') {
                setToast({ message: "Asset details saved successfully.", type: "success" });
                navigate(-1);
            } else {
                setToast({ message: res.data.message || "Save failed.", type: "error" });
            }
        }).catch(err => {
            console.error("Error saving asset:", err);
            setToast({ message: "An error occurred while saving the asset.", type: "error" });
        });
    };
    // useEffect(() => {
    //     if (incomingAsset?.custom_fields) {
    //         try {
    //             const parsed = JSON.parse(incomingAsset.custom_fields);
    //             if (parsed.type === "fields") {
    //                 const arr = Object.entries(parsed)
    //                     .filter(([k]) => k !== "type")
    //                     .map(([name, value]) => ({ name, value }));
    //                 setDynamicFields(arr);
    //             }
    //         } catch (e) {
    //             console.error("Invalid custom_fields JSON", e);
    //         }
    //     }
    // }, [incomingAsset]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
            params: { type: 'getAssetTypes' },
            withCredentials: true
        }).then(res => {
            setAssetTypes(res.data.data || [])
            //setAssetTypes(types);

            // if incomingAsset exists, seed selectedType (and let downstream effects pick up)
            if (incomingAsset?.asset_type_id) {
                setSelectedType(incomingAsset?.asset_type_id);
            }
        });
    }, [incomingAsset?.asset_type_id]);

    useEffect(() => {
        if (!selectedType) return;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
            params: { type: 'getAssetSubTypesOnType', asset_type: selectedType },
            withCredentials: true
        }).then(res => {
            setSubTypes(res.data.data || []);
            if (
                !userChangedType &&
                incomingAsset?.asset_subtype_id //&& !selectedSubType
            ) {
                setSelectedSubType(incomingAsset?.asset_subtype_id);
            }
        });
        setSelectedSubType('');
        setEntities([]);
        setSelectedEntity('');
        setNodes([]);
        setSelectedNode('');
    }, [selectedType, incomingAsset?.asset_subtype_id, userChangedType]);

    useEffect(() => {
        if (!selectedSubType) return;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
            params: { type: 'getAssetSubTypeEntityOnSubType', asset_subtype: selectedSubType },
            withCredentials: true
        }).then(res => {
            setEntities(res.data.data || [])
            if (
                !userChangedType &&
                incomingAsset?.asset_subtype_entity_id //&& !selectedSubTypeEntity
            ) {
                setSelectedEntity(incomingAsset.asset_subtype_entity_id);
            }
        });
        setSelectedEntity('');
        setNodes([]);
        setSelectedNode('');
    }, [selectedSubType, incomingAsset?.asset_subtype_entity_id, userChangedType]);

    useEffect(() => {
        if (!selectedEntity) return;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
            params: { type: 'getAssetSubTypeEntityNodesOnEntity', entity_id: selectedEntity },
            withCredentials: true
        }).then(res => {
            setNodes(res.data.data || [])
            if (
                !userChangedType &&
                incomingAsset?.asset_subtype_entitynode_id //&& !selectedNode
            ) {
                setSelectedNode(incomingAsset?.asset_subtype_entitynode_id);
            }
        });
        setSelectedNode('');
    }, [selectedEntity, incomingAsset?.asset_subtype_entitynode_id, userChangedType]);
    useEffect(() => {
        if (!selectedType) return;
        setLoadingFields(true);

        axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/pages/asset/asset.ajax.php`, {
                params: { type: "getAssetFieldSettings", asset_type_id: selectedType },
                withCredentials: true,
            })
            .then((res) => {
                if (res.data.status === "success") {
                    //const defs = res.data.data.flatMap((r) => r.dynamic_fields || []);
                    //setDynamicFields(defs);
                    setAssetFieldSettings(res.data.data);
                }
            })
            .catch((err) => console.error("Error loading dynamic field settings:", err))
            .finally(() => setLoadingFields(false));
    }, [selectedType]);

    // 🔹 Once asset & settings are available, merge in existing values
    useEffect(() => {
        if (!assetFieldSettings.length) {
            setDynamicFields([]);
            return; // wait for settings
        }

        let customFieldValues = {};
        if (incomingAsset) { //edit/verify
            // Prefer dynamicfields if provided
            if (incomingAsset.dynamic_fields?.length) {
                customFieldValues = incomingAsset.dynamic_fields;
            }
            // Otherwise fall back to JSON-based fields
            else if (incomingAsset?.custom_fields) {
                try {
                    const parsed = JSON.parse(incomingAsset.custom_fields);
                    if (parsed.type === "fields") {
                        customFieldValues = Object.entries(parsed)
                            .filter(([k]) => k !== "type")
                            .map(([name, value]) => ({ name, value }));
                    }
                } catch (e) {
                    console.error("Invalid custom_fields JSON", e);
                }
            }
        }
        if (!Array.isArray(customFieldValues)) customFieldValues = [];
        // Filter fields by asset type and map to values (empty if no incomingAsset)
        // Merge field settings with incoming values
        const merged = assetFieldSettings
            .filter(f => f.asset_type_id === incomingAsset?.asset_type_id || !incomingAsset)
            .map(f => {
                const match = customFieldValues.find(v => v.name === f.label);
                return {
                    name: f.label,
                    value: match ? match.value : "",
                    type: f.field_type
                };
            });


        setDynamicFields(merged);
    }, [assetFieldSettings, incomingAsset]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/misc/misc.ajax.php`, {
            params: { type: 'getCampuses' },
            withCredentials: true
        }).then(res => {
            setCampuses(res.data.campuses || [])
            //setAssetTypes(types);

            // if incomingAsset exists, seed selectedType (and let downstream effects pick up)
            if (incomingAsset?.campus_id) {
                setSelectedCampus(incomingAsset?.campus_id);
            }
        });
    }, [incomingAsset?.campus_id]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/misc/misc.ajax.php`, {
            params: { type: 'getSections' },
            withCredentials: true
        }).then(res => {
            setSections(res.data.data || []);
            if (
                !userChangedType &&
                incomingAsset?.section_id
            ) {
                setSelectedSection(incomingAsset?.section_id);
            }
        });
        // setSelectedSubType('');
        // setEntities([]);
        // setSelectedEntity('');
        // setNodes([]);
        // setSelectedNode('');
    }, [selectedType, incomingAsset?.section_id, userChangedType]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL} /pages/misc/misc.ajax.php`, {
            params: { type: 'getSeats' },
            withCredentials: true
        }).then(res => {
            setSeats(res.data.data || []);
            if (
                !userChangedType &&
                incomingAsset?.seat_id
            ) {
                setSelectedSeat(incomingAsset?.seat_id);
            }
        });
        // setSelectedSubType('');
        // setEntities([]);
        // setSelectedEntity('');
        // setNodes([]);
        // setSelectedNode('');
    }, [selectedType, incomingAsset?.seat_id, userChangedType]);
    useEffect(() => {
        if (!selectedCampus) return;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
            params: { type: 'getLandsOnCampus', campus_id: selectedCampus },
            withCredentials: true
        })
            .then(res => {
                setLands(res.data.data || [])
                if (
                    !userChangedType &&
                    incomingAsset?.land_id_id
                ) {
                    setLands(incomingAsset?.land_id_id);
                }
            });
    }, [selectedCampus, incomingAsset?.land_id_id, userChangedType]);

    useEffect(() => {
        if (!selectedLand) return;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
            params: { type: 'getBuildingsOnLand', land_id: selectedLand },
            withCredentials: true
        })
            .then(res => {
                setBuildings(res.data.data || [])
                if (
                    !userChangedType &&
                    incomingAsset?.building_id
                ) {
                    setSelectedBuilding(incomingAsset?.building_id);
                }
            });
    }, [selectedLand, incomingAsset?.building_id, userChangedType]);
    useEffect(() => {
        if (!selectedBuilding) return;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
            params: { type: 'getFloorOnBuilding', building_id: selectedBuilding },
            withCredentials: true
        })
            .then(res => {
                setFloors(res.data.data || [])
                if (
                    !userChangedType &&
                    incomingAsset?.floor_id
                ) {
                    setSelectedFloor(incomingAsset?.floor_id);
                }
            });
    }, [selectedBuilding, incomingAsset?.floor_id, userChangedType]);
    useEffect(() => {
        if (!selectedFloor) return;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`, {
            params: { type: 'getRoomOnFloor', floor_id: selectedFloor },
            withCredentials: true
        })
            .then(res => {
                setRooms(res.data.data || [])
                if (
                    !userChangedType &&
                    incomingAsset?.room_id
                ) {
                    setSelectedRoom(incomingAsset?.room_id);
                }
            });
    }, [selectedFloor, incomingAsset?.room_id, userChangedType]);
    // useEffect(() => {
    //     const total =
    //         (parseFloat(purchaseCost) || 0) +
    //         (parseFloat(gstCharged) || 0) +
    //         (parseFloat(customDuties) || 0) +
    //         (parseFloat(otherCosts) || 0);

    //     setTotalCost(total.toFixed(2));
    // }, [purchaseCost, gstCharged, customDuties, otherCosts]);
    return (
        <MainLayout>
            <Container fluid className="p-4">
                <h2 className="mb-4">Asset Details</h2>
                {toast.message && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ message: '', type: '' })}
                    />
                )}
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="asset-tabs" className="mb-3">

                    <Tab eventKey="identity" title="Asset Identity">
                        <Card className="mb-4">
                            <Card.Header>Asset Identification</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3}><Form.Group><Form.Label>Asset Unique Code</Form.Label><Form.Control type="text" value={isAdd ? uniqueCode || 'Will be auto-generated' : uniqueCode || ''} readOnly plaintext onChange={e => setUniqueCode(e.target.value)} /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Asset Code (KUHS)</Form.Label><Form.Control type="text" placeholder="Enter KUHS asset code" value={kuhsCode} onChange={e => setKuhsCode(e.target.value)} /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Serial No</Form.Label><Form.Control type="text" placeholder="Enter serial number" value={serialNo} onChange={e => setSerialNo(e.target.value)} /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Model No</Form.Label><Form.Control type="text" placeholder="Enter model number" value={modelNo} onChange={e => setModelNo(e.target.value)} /></Form.Group></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card className="mb-4">
                            <Card.Header>Initial Asset Categorization</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}><Form.Group><Form.Label>Asset Name</Form.Label><Form.Control type="text" placeholder="Enter asset name" value={assetName} onChange={e => setAssetName(e.target.value)} /></Form.Group></Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Asset Type</Form.Label>
                                            <Form.Select disabled={isDisabled} value={selectedType} onChange={(e) => {
                                                setSelectedType(e.target.value); setUserChangedType(true); // user has intervened, so downstream should reset
                                                setSelectedSubType('');
                                                setEntities([]);
                                                setSelectedEntity('');
                                                setNodes([]);
                                                setSelectedNode('');
                                            }}>
                                                <option value="">Select Asset Type</option>
                                                {assetTypes.map(type => (
                                                    <option key={type.asset_type_id} value={type.asset_type_id}>{type.asset_type_code} : {type.asset_type_name}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Asset SubType</Form.Label>
                                            <Form.Select disabled={isDisabled} value={selectedSubType} onChange={(e) => setSelectedSubType(e.target.value)}>
                                                <option value="">Select SubType</option>
                                                {subTypes.map(sub => (
                                                    <option key={sub.asset_subtype_id} value={sub.asset_subtype_id}>{sub.asset_subtype_code} : {sub.asset_subtype_name}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Asset SubType Entity</Form.Label>
                                            <Form.Select disabled={isDisabled} value={selectedEntity} onChange={(e) => setSelectedEntity(e.target.value)}>
                                                <option value="">Select Entity</option>
                                                {entities.map(ent => (
                                                    <option key={ent.asset_subtype_enity_id} value={ent.asset_subtype_entity_id}>{ent.asset_subtype_entity_code} : {ent.asset_subtype_entity_name}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Asset SubType Entity Node</Form.Label>
                                            <Form.Select disabled={isDisabled} value={selectedNode} onChange={(e) => setSelectedNode(e.target.value)}>
                                                <option value="">Select Node</option>
                                                {nodes.map(node => (
                                                    <option key={node.asset_subtype_entitynode_id} value={node.asset_subtype_entitynode_id}>{node.asset_subtype_entitynode_code} : {node.asset_subtype_entitynode_name}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* <Card className="mb-4">
                            <Card.Header>Location Tracking</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}><Form.Group><Form.Label>Campus</Form.Label> <Form.Select
                                        value={selectedCampus}
                                        onChange={(e) => setSelectedCampus(e.target.value)}
                                    >
                                        <option value="">Select Campus</option>
                                        {campuses.map(c => (
                                            <option key={c.campus_id} value={c.campus_id}>
                                                {c.campus_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Land</Form.Label><Form.Select
                                        value={selectedLand}
                                        onChange={(e) => setSelectedLand(e.target.value)}
                                    >
                                        <option value="">Select Land</option>
                                        {lands.map(l => (
                                            <option key={l.land_id} value={l.land_id}>
                                                {l.land_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Building</Form.Label><Form.Select
                                        value={selectedBuilding}
                                        onChange={(e) => setSelectedBuilding(e.target.value)}
                                    >
                                        <option value="">Select Building</option>
                                        {buildings.map(b => (
                                            <option key={b.building_id} value={b.building_id}>
                                                {b.building_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Floor</Form.Label><Form.Select
                                        value={selectedFloor}
                                        onChange={(e) => setSelectedFloor(e.target.value)}
                                    >
                                        <option value="">Select Floor</option>
                                        {floors.map(f => (
                                            <option key={f.floor_id} value={f.floor_id}>
                                                {f.floor_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Room</Form.Label><Form.Select
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        <option value="">Select Room</option>
                                        {rooms.map(f => (
                                            <option key={f.room_id} value={f.room_id}>
                                                {f.room_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Seat</Form.Label><Form.Select><option>Select Seat</option></Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Section</Form.Label><Form.Select
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        disabled={!sections.length}
                                    >
                                        <option value="">Select Section</option>
                                        {sections.map(section => (
                                            <option key={section.section_id} value={section.section_id}>
                                                {section.section_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Current Location</Form.Label><Form.Control type="text" placeholder="Enter location" /></Form.Group></Col>
                                </Row>
                            </Card.Body>
                        </Card> */}
                        <Card className="mb-4">
                            <Card.Header>Applicability Settings</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3}><Form.Group><Form.Label>Warranty Applicable</Form.Label><Form.Select value={warrantyApplicable ? 'Yes' : 'No'} onChange={(e) => setWarrantyApplicable(e.target.value === 'Yes')}><option>No</option><option>Yes</option></Form.Select></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>AMC Applicable</Form.Label><Form.Select value={amcApplicable ? 'Yes' : 'No'} onChange={(e) => setAmcApplicable(e.target.value === 'Yes')}><option>No</option><option>Yes</option></Form.Select></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Depreciation Applicable</Form.Label><Form.Select value={depreciationApplicable ? 'Yes' : 'No'} onChange={(e) => setDepreciationApplicable(e.target.value === 'Yes')}><option>No</option><option>Yes</option></Form.Select></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>GST Applicable</Form.Label><Form.Select value={gstApplicable ? 'Yes' : 'No'} onChange={(e) => setGstApplicable(e.target.value === 'Yes')}><option>No</option><option>Yes</option></Form.Select></Form.Group></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Tab>

                    <Tab disabled={isDisabledForSectionUser} eventKey="admin" title="Administrative">
                        <Row>
                            <Col md={3}><Form.Group><Form.Label>Administrative Sanction Number</Form.Label><Form.Control type="text" value={adminSanctionNo} onChange={(e) => setAdminSanctionNo(e.target.value)} placeholder="Enter sanction number" /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Administrative Sanction Date</Form.Label><Form.Control type="date" value={adminSanctionDate} onChange={(e) => setAdminSanctionDate(e.target.value)} /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Technical Sanction Number</Form.Label><Form.Control type="text" value={technicalSanctionNo} onChange={(e) => setTechnicalSanctionNo(e.target.value)} placeholder="Enter technical sanction number" /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Technical Sanction Date</Form.Label><Form.Control type="date" value={technicalSanctionDate} onChange={(e) => setTechnicalSanctionDate(e.target.value)} /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Work Order Number</Form.Label><Form.Control type="text" value={workOrderNo} onChange={(e) => setWorkOrderNo(e.target.value)} placeholder="Enter work order number" /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Work Order Date</Form.Label><Form.Control type="date" value={workOrderDate} onChange={(e) => setWorkOrderDate(e.target.value)} /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Supply Order Number</Form.Label><Form.Control type="text" value={supplyOrderNo} onChange={(e) => setSupplyOrderNo(e.target.value)} placeholder="Enter supply order number" /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Supply Order Date</Form.Label><Form.Control type="date" value={supplyOrderDate} onChange={(e) => setSupplyOrderDate(e.target.value)} /></Form.Group></Col>
                        </Row>
                    </Tab>

                    <Tab disabled={isDisabledForSectionUser} eventKey="purchase" title="Purchase Info">
                        <Row>
                            <Col md={4}><Form.Group><Form.Label>Source of Fund</Form.Label><Form.Select value={sourceOfFund} onChange={(e) => setSourceOfFund(e.target.value)}>
                                <option value="">Select Source</option>
                                <option value="Plan (Govt)">Plan (Govt)</option>
                                <option value="Plan (Own)">Plan (Own)</option>
                                <option value="Project Internal">Project Internal</option>
                                <option value="Project External">Project External</option>
                                <option value="CSR">CSR</option>
                            </Form.Select></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Purchase Code</Form.Label><Form.Control type="text" value={purchaseCode} onChange={(e) => setPurchaseCode(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Purchase Date</Form.Label><Form.Control type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Vendor Name</Form.Label><Form.Control type="text" value={vendorName} onChange={(e) => setVendorName(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Address with GST No</Form.Label><Form.Control type="text" value={vendorAddressGst} onChange={(e) => setVendorAddressGst(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Invoice No</Form.Label><Form.Control type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} /></Form.Group></Col>
                        </Row>
                    </Tab>

                    <Tab disabled={isDisabledForSectionUser} eventKey="cost" title="Cost Details">
                        <Row>
                            <Col md={4}><Form.Group><Form.Label>Purchase Cost (excl. GST & Duties)</Form.Label><Form.Control type="number" value={purchaseCost} onChange={(e) => setPurchaseCost(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>GST Charged in Invoice</Form.Label><Form.Control type="number" value={gstCharged} onChange={(e) => setGstCharged(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>GST %</Form.Label><Form.Control type="number" value={gstPercentage} onChange={(e) => setGstPercentage(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Customs Other Duties</Form.Label><Form.Control type="number" value={customDuties} onChange={(e) => setCustomDuties(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Other Costs</Form.Label><Form.Control type="number" value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Description of Other Costs added</Form.Label><Form.Control as="textarea" rows={2} value={otherCostsDesc} onChange={(e) => setOtherCostsDesc(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label >Discount</Form.Label><Form.Control type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label >Total Cost</Form.Label><Form.Control type="number" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} /></Form.Group></Col>
                        </Row>
                    </Tab>



                    <Tab disabled={isDisabledForSectionUser} eventKey="disposal" title="Disposal">
                        <Row>
                            <Col md={4}><Form.Group><Form.Label>Date of Sale</Form.Label><Form.Control type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Sale Invoice No</Form.Label><Form.Control type="text" value={saleInvoiceNo} onChange={e => setSaleInvoiceNo(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Sale Value (Excl. GST)</Form.Label><Form.Control type="number" value={saleValueExclGst} onChange={e => setSaleValueExclGst(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Purchaser Name</Form.Label><Form.Control type="text" value={purchaserName} onChange={e => setPurchaserName(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Purchaser Address</Form.Label><Form.Control type="text" value={purchaserAddress} onChange={e => setPurchaserAddress(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Profit/Loss on Sale</Form.Label><Form.Control type="number" value={profitLossOnSale} onChange={e => setProfitLossOnSale(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Profit/Loss on Revaluation</Form.Label><Form.Control type="number" value={profitLossOnRevaluation} onChange={e => setProfitLossOnRevaluation(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Impairment Loss</Form.Label><Form.Control type="number" value={impairmentLoss} onChange={e => setImpairmentLoss(e.target.value)} /></Form.Group></Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="location" title="Location Mapping">
                        <Card className="mb-4">
                            <Card.Header>Location Tracking</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}><Form.Group><Form.Label>Campus</Form.Label> <Form.Select
                                        value={selectedCampus}
                                        onChange={(e) => setSelectedCampus(e.target.value)}
                                    >
                                        <option value="">Select Campus</option>
                                        {campuses.map(c => (
                                            <option key={c.campus_id} value={c.campus_id}>
                                                {c.campus_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Land</Form.Label><Form.Select
                                        value={selectedLand}
                                        onChange={(e) => setSelectedLand(e.target.value)}
                                    >
                                        <option value="">Select Land</option>
                                        {lands.map(l => (
                                            <option key={l.land_id} value={l.land_id}>
                                                {l.land_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Building</Form.Label><Form.Select
                                        value={selectedBuilding}
                                        onChange={(e) => setSelectedBuilding(e.target.value)}
                                    >
                                        <option value="">Select Building</option>
                                        {buildings.map(b => (
                                            <option key={b.building_id} value={b.building_id}>
                                                {b.building_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Floor</Form.Label><Form.Select
                                        value={selectedFloor}
                                        onChange={(e) => setSelectedFloor(e.target.value)}
                                    >
                                        <option value="">Select Floor</option>
                                        {floors.map(f => (
                                            <option key={f.floor_id} value={f.floor_id}>
                                                {f.floor_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Room</Form.Label><Form.Select
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        <option value="">Select Room</option>
                                        {rooms.map(f => (
                                            <option key={f.room_id} value={f.room_id}>
                                                {f.room_no}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Current Location</Form.Label><Form.Control type="text" placeholder="Enter location" /></Form.Group></Col>

                                    <Col md={4}><Form.Group><Form.Label>Section</Form.Label><Form.Select
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                    >
                                        <option value="">Select Section</option>
                                        {sections.map(section => (
                                            <option key={section.section_id} value={section.section_id}>
                                                {section.section_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Seat</Form.Label><Form.Select
                                        value={selectedSeat}
                                        onChange={(e) => setSelectedSeat(e.target.value)}
                                    >
                                        <option value="">Select Seat</option>
                                        {seats.map(seat => (
                                            <option key={seat.seat_id} value={seat.seat_id}>
                                                {seat.seat_name}
                                            </option>
                                        ))}
                                    </Form.Select></Form.Group></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Tab>
                    <Tab disabled={isDisabledForSectionUser} eventKey="characteristics" title="Asset Specific Characteristics">
                        <Card className="mb-4">
                            <Card.Header>Dynamic Characteristics</Card.Header>
                            <Card.Body>
                                {/* Placeholder for dynamic characteristics based on Asset SubType Entity */}
                                {/*<p>This section will dynamically load asset-specific fields based on the Asset SubType Entity from database settings.</p>*/}
                                <Card.Body>
                                    <Row>
                                        {loadingFields ? (
                                            <p>Loading fields...</p>
                                        ) : (dynamicFields.map((field, idx) => (
                                            <Col md={4} key={idx}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>{field.name}</Form.Label>
                                                    <Form.Control
                                                        type={field.type}
                                                        value={field.value || ""}
                                                        onChange={(e) => {
                                                            const updated = [...dynamicFields];
                                                            updated[idx].value = e.target.value;
                                                            setDynamicFields(updated);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )))}
                                    </Row>
                                </Card.Body>
                            </Card.Body>
                        </Card>
                    </Tab>
                    <Tab disabled={isDisabled} eventKey="adjustments" title="Adjustments">
                        <Row>
                            <Col md={4}><Form.Group><Form.Label>Capitalization Date</Form.Label><Form.Control type="date" value={capitalizationDate} onChange={(e) => setCapitalizationDate(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>ITC Adjustment</Form.Label><Form.Control type="number" value={itcAdjustment} onChange={(e) => setItcAdjustment(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Subsidy Adjustment</Form.Label><Form.Control type="number" value={subsidyAdjustment} onChange={(e) => setSubsidyAdjustment(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Duties/Rebates Adjustment</Form.Label><Form.Control type="number" value={dutiesRebatesAdjustment} onChange={(e) => setDutiesRebatesAdjustment(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Other Adjustments</Form.Label><Form.Control type="number" value={otherAdjustments} onChange={(e) => setOtherAdjustments(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Cost after Adjustments</Form.Label><Form.Control type="number" value={costAfterAdjustments} onChange={(e) => setCostAfterAdjustments(e.target.value)} /></Form.Group></Col>
                        </Row>
                    </Tab>

                    <Tab disabled={isDisabled} eventKey="depreciation" title="Depreciation">
                        <Row>
                            <Col md={4}><Form.Group><Form.Label>Initial Valuation Date</Form.Label><Form.Control type="date" value={initialValuationDate} onChange={e => setInitialValuationDate(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Value at Initial Valuation</Form.Label><Form.Control type="number" value={initialValuationValue} onChange={e => setInitialValuationValue(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Revaluation Date</Form.Label><Form.Control type="date" value={revaluationDate} onChange={e => setRevaluationDate(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Value at Revaluation</Form.Label><Form.Control type="number" value={revaluationValue} onChange={e => setRevaluationValue(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Estimated Life (Years)</Form.Label><Form.Control type="number" value={estimatedLifeYears} onChange={e => setEstimatedLife(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Estimated Residual Value</Form.Label><Form.Control type="number" value={residualValue} onChange={e => setResidualValue(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Carrying Cost (Beginning)</Form.Label><Form.Control type="number" value={carryingCostBegin} onChange={e => setCarryingCostBegin(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Years Expired(should we make it date?)</Form.Label><Form.Control type="number" value={yearsExpired} onChange={e => setYearsExpired(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Years Remaining(should we make it date?)</Form.Label><Form.Control type="number" value={yearsRemaining} onChange={e => setYearsRemaining(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Is Life Over or 5% Reached?</Form.Label><Form.Select value={isLifeOverOr5Percent ? 'Yes' : 'No'} onChange={(e) => setIsLifeOverOr5Percent(e.target.value === 'Yes')}><option value="No">No</option><option value="Yes">Yes</option></Form.Select></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Depreciation Rate (%)</Form.Label><Form.Control type="number" value={depreciationRate} onChange={e => setDepreciationRate(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Accumulated Depreciation</Form.Label><Form.Control type="number" value={accumulatedDepreciation} onChange={e => setAccumulatedDepreciation(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Adjustments This Year</Form.Label><Form.Control type="number" value={adjustmentsThisYear} onChange={e => setAdjustmentsThisYear(e.target.value)} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Carrying Cost (End)</Form.Label><Form.Control type="number" value={carryingCostEnd} onChange={e => setCarryingCostEnd(e.target.value)} /></Form.Group></Col>
                        </Row>
                    </Tab>
                    {isVerify && (<Tab eventKey="verification" title="Verification">
                        <Card className="mb-4">
                            <Card.Header>Asset Verification</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Asset Status</Form.Label>
                                            <Form.Select
                                                value={assetStatus}
                                                onChange={(e) => setAssetStatus(e.target.value)}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Fully Functional">Fully Functional</option>
                                                <option value="Partially Functional">Partially Functional</option>
                                                <option value="Under Maintenance">Under Maintenance</option>
                                                <option value="Decommissioned">Decommissioned</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Verification Comment</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                placeholder="Enter verification notes"
                                                value={verificationComment}
                                                onChange={(e) => setVerificationComment(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Tab>)}
                </Tabs>

                <Row className="mt-4">
                    <Col className="text-center">
                        {!isViewMode && (<Button variant="primary" onClick={handleSave}>{isVerify ? 'Verify Asset Details' : 'Save Details'}</Button>)}
                    </Col>
                </Row>
            </Container>
        </MainLayout>
    );
};

export default EditAsset;