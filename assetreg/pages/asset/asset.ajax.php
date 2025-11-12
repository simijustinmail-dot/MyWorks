<?php
session_start();
include_once ("../../common/cors.php");
//require '../../login/session_middleware.php';
header("Content-Type: application/json");
// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
//include_once ("../../common/auth.php");
include_once("asset.class.php"); 
include_once("../../connection.php"); 
include_once("../../class/common.class.php"); 
$objcommon = new common();
$assetObj = new Asset(); 
$data = json_decode(file_get_contents("php://input"), true);
$type = isset($_GET['type']) ? $_GET['type'] : (isset($data['type']) ? $data['type'] : ''); // to handle get and post cases
$userid = isset($data['created_by']) ? $data['created_by'] : 0; //echo($_SESSION['user_id']); 

switch($type){
    case 'addAssetType': 
        $asset_connObj->db_query($asset_connObj->c_link, 'BEGIN');
		$assetTypeCode = isset($data["code"])?$data["code"]:"";
        $assetTypeName = isset($data["name"])?$data["name"]:"";
        $assetTypeDesc = isset($data['desc'])?$data['desc']:"";
        $assetClass = isset($data['assetclass'])?$data['assetclass']:"";
		$userid = isset($data['created_by'])?$data['created_by']:0;
        $res = $assetObj->checkAssetType($assetTypeCode, $assetTypeName);
        $numRows=0;
        $numRows = pg_num_rows($res);
        if ($numRows > 0){
            echo json_encode(['status' => 'error', 'message' => 'Asset Type Already Exits']);;
        }
        else{
            $res = $assetObj->addAssetType($assetTypeCode, $assetTypeName, $assetTypeDesc, $assetClass,  $userid);
            if($res){
                $asset_connObj->db_query($asset_connObj->c_link, 'COMMIT');
                echo json_encode(['status' => 'success', 'message' => 'Asset Type Added Successfully']);;
                
            }
            else{
                $asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
                echo json_encode(['status' => 'error', 'message' => '"Error Occured while adding Asset Type. Please Contact IT Admin!!!"']);
            }
        }
        
        break;
		
	case 'deleteAssetType': 
		$id = isset($data["id"])?$data["id"]:"";
		$result = $objcommon->deleteAssetTypeById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Asset Type Deleted Successfully']);;
		} else {
			echo json_encode(['status' => 'error', 'message' => '"Error Occured while deleting Asset Type. Please Contact IT Admin!!!"']);
		}
	    break;
        
      case 'getAssetTypes': 
		$res = $objcommon->getAssetTypeDetails();
		$assettypes = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $assettypes[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $assettypes]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No asset types found.']);
		}  
	    break;
		
   case 'getAssetSubTypes': 
		$res = $objcommon->getAssetSubTypeDetails();
		$assetsubtypes = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $assetsubtypes[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $assetsubtypes]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No asset sub types found.']);
		}  
	    break;
		
    case 'addAssetSubType': 
        $asset_connObj->db_query($asset_connObj->c_link, 'BEGIN');
		$assetSubTypeCode = isset($data["code"])?$data["code"]:"";
        $assetSubTypeName = isset($data["name"])?$data["name"]:"";
        $assetType = isset($data['assetType'])?$data['assetType']:0;
		$userid = isset($data['created_by'])?$data['created_by']:0;
        $res = $assetObj->checkAssetSubType($assetTypeCode, $assetTypeName);
        $numRows=0;
        $numRows = pg_num_rows($res);
        if ($numRows > 0){
            echo json_encode(['status' => 'error', 'message' => 'Asset Sub Type Already Exits']);;
        }
        else{
            $res = $assetObj->addAssetSubType($assetSubTypeCode, $assetSubTypeName, $assetType,  $userid);
            if($res){
                $asset_connObj->db_query($asset_connObj->c_link, 'COMMIT');
                echo json_encode(['status' => 'success', 'message' => 'Asset Sub Type Added Successfully']);;
                
            }
            else{
                $asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
                echo json_encode(['status' => 'error', 'message' => '"Error Occured while adding Asset Sub Type. Please Contact IT Admin!!!"']);
            }
        }
        
        break;
		
	case 'deleteAssetSubType': 
		$id = isset($data["id"])?$data["id"]:"";
		$result = $objcommon->deleteAssetSubTypeById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Asset SubType Deleted Successfully']);
		} else {
			echo json_encode(['status' => 'error', 'message' => '"Error Occured while deleting Asset SubType. Please Contact IT Admin!!!"']);
		}
	    break;
	case 'getAssetSubTypeEntity': 
		$res = $objcommon->getAssetSubTypeEntityDetails();
		$assetsubtypeentity = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $assetsubtypeentity[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $assetsubtypeentity]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No asset sub type entity found.']);
		}  
	    break;
    case 'addAssetSubTypeEntity': 
        $asset_connObj->db_query($asset_connObj->c_link, 'BEGIN');
		$code = isset($data["code"])?$data["code"]:"";
        $name = isset($data["name"])?$data["name"]:"";
        $assetSubType = isset($data['assetSubType'])?$data['assetSubType']:0;
		$userid = isset($data['created_by'])?$data['created_by']:0;
        $res = $assetObj->checkAssetSubTypeEntity($assetTypeCode, $assetTypeName);
        $numRows=0;
        $numRows = pg_num_rows($res);
        if ($numRows > 0){
            echo json_encode(['status' => 'error', 'message' => 'Asset Sub Type Entity Already Exits']);;
        }
        else{
            $res = $assetObj->addAssetSubTypeEntity($code, $name, $assetSubType,  $userid);
            if($res){
                $asset_connObj->db_query($asset_connObj->c_link, 'COMMIT');
                echo json_encode(['status' => 'success', 'message' => 'Asset Sub Type Entity Added Successfully']);;
                
            }
            else{
                $asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
                echo json_encode(['status' => 'error', 'message' => '"Error Occured while adding Asset Sub Type Entity. Please Contact IT Admin!!!"']);
            }
        }
        
        break;
		
	case 'deleteAssetSubTypeEntity': 
		$id = isset($data["id"])?$data["id"]:"";
		$result = $objcommon->deleteAssetSubTypeEntityById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Asset SubType Entity Deleted Successfully']);
		} else {
			echo json_encode(['status' => 'error', 'message' => '"Error Occured while deleting Asset SubType Entity. Please Contact IT Admin!!!"']);
		}
	    break;
	case 'getAssetSubTypeEntityNodes': 
		$res = $objcommon->getAssetSubTypeEntityNodeDetails();
		$assetsubtypeentitynode = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $assetsubtypeentitynode[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $assetsubtypeentitynode]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No asset sub type entity node found.']);
		}  
	    break;
    case 'addAssetSubTypeEntityNode': 
        $asset_connObj->db_query($asset_connObj->c_link, 'BEGIN');
		$code = isset($data["code"])?$data["code"]:"";
        $name = isset($data["name"])?$data["name"]:"";
        $assetSubType = isset($data['assetSubTypeEntity'])?$data['assetSubTypeEntity']:0;
		$userid = isset($data['created_by'])?$data['created_by']:0;
        $res = $assetObj->checkAssetSubTypeEntityNode($assetTypeCode, $assetTypeName);
        $numRows=0;
        $numRows = pg_num_rows($res);
        if ($numRows > 0){
            echo json_encode(['status' => 'error', 'message' => 'Asset Sub Type Entity Node Already Exits']);;
        }
        else{
            $res = $assetObj->addAssetSubTypeEntityNode($code, $name, $assetSubType,  $userid);
            if($res){
                $asset_connObj->db_query($asset_connObj->c_link, 'COMMIT');
                echo json_encode(['status' => 'success', 'message' => 'Asset Sub Type Entity Node Added Successfully']);;
                
            }
            else{
                $asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
                echo json_encode(['status' => 'error', 'message' => '"Error Occured while adding Asset Sub Type Entity Node. Please Contact IT Admin!!!"']);
            }
        }
        
        break;
		
	case 'deleteAssetSubTypeEntityNode': 
		$id = isset($data["id"])?$data["id"]:"";
		$result = $objcommon->deleteAssetSubTypeEntityNodeById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Asset SubType Entity Node Deleted Successfully']);
		} else {
			echo json_encode(['status' => 'error', 'message' => '"Error Occured while deleting Asset SubType Entity Node. Please Contact IT Admin!!!"']);
		}
	    break;
   
   case 'getAssetSubTypesOnType': 
		$id = isset($_GET["asset_type"])?$_GET["asset_type"]:0;
		$res = $objcommon->getAssetSubTypesOnType($id);
		$data = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $data[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $data]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No asset sub type found.']);
		}  
	    break;
		
	case 'getAssetSubTypeEntityOnSubType': 
		$id = isset($_GET["asset_subtype"])?$_GET["asset_subtype"]:0;
		$res = $objcommon->getAssetSubTypeEntityOnSubType($id);
		$data = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $data[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $data]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No asset sub type entity found.']);
		}  
	    break;
		
	case 'getAssetSubTypeEntityNodesOnEntity': 
		$id = isset($_GET["entity_id"])?$_GET["entity_id"]:0;
		$res = $objcommon->getAssetSubTypeEntityNodesOnEntity($id);
		$data = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $data[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $data]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No asset sub type entity node found.']);
		}  
	    break;
		
	case 'getAssets': 
    $typeId = isset($_GET['asset_type_id']) ? intval($_GET['asset_type_id']) : 0;
    $subTypeId = isset($_GET['asset_subtype_id']) ? intval($_GET['asset_subtype_id']) : 0; 
    $entityId = isset($_GET['entity_id']) ? intval($_GET['entity_id']) : 0;
    $nodeId = isset($_GET['node_id']) ? intval($_GET['node_id']) : 0;
	$campusId = isset($_GET['campus_id']) ? intval($_GET['campus_id']) : 0;
	$landId = isset($_GET['land_id']) ? intval($_GET['land_id']) : 0;
	$buildingId = isset($_GET['building_id']) ? intval($_GET['building_id']) : 0;
	$floorId = isset($_GET['floor_id']) ? intval($_GET['floor_id']) : 0;
	$sectionId = isset($_GET['section_id']) ? intval($_GET['section_id']) : 0;
	$seatId = isset($_GET['seat_id']) ? intval($_GET['seat_id']) : 0;

	$page  = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 20; // default 20 rows
    $offset = ($page - 1) * $limit;

	$userrole = isset($_SESSION['user_type']) ? $_SESSION['user_type'] : "ITSuper"; 
	$usersection = isset($_SESSION['user_section']) ? $_SESSION['user_section'] : ""; 
	//fetch asset
    $res = $objcommon->getAssets($typeId, $subTypeId, $entityId, $nodeId,$campusId, $landId,$buildingId,$floorId,$roomId,$sectionId,$seatId,$limit,$offset,$userrole,$usersection);

	// Fetch total count
    $totalCount = $objcommon->getAssetsCount($typeId, $subTypeId, $entityId, $nodeId, $campusId, $landId, $buildingId, $floorId, $roomId, $sectionId,$SeatId,$userrole,$usersection);

    $data = [];
	
    if ($res) {
        while ($row = $asset_connObj->db_fetch_array($res)) {
			// Decode the custom_fields JSON if present
            $dynamic_fields = []; 
            if (!empty($row['custom_fields'])) { 
                $custom = json_decode($row['custom_fields'], true); 
                if (json_last_error() === JSON_ERROR_NONE) {
                    if ($custom['type'] === 'reference' && isset($custom['extra'])) {
                        foreach ($custom['extra'] as $key => $value) {
                            $dynamic_fields[] = ['name' => $key, 'value' => $value];
                        }
                    } elseif ($custom['type'] === 'fields') {
                        foreach ($custom as $key => $value) {
                            if ($key !== 'type') {
                                $dynamic_fields[] = ['name' => $key, 'value' => $value];
                            }
                        }
                    }
                }
            }
			$row['dynamic_fields'] = $dynamic_fields;
            $data[] = $row; 	
        } 
        echo json_encode([
            'status' => 'success', 
            'data' => $data, 
            'total' => $totalCount,
            'page' => $page,
            'limit' => $limit
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No assets found.']);
    }
    break;
	case 'saveAsset': 
	$asset_id = isset($data['asset_id']) ? intval($data['asset_id']) : 0;
	$asset_unique_code = (isset($data['asset_unique_code']) && trim($data['asset_unique_code']) !== '') ? $data['asset_unique_code'] : null;
	$asset_kuhs_code = (isset($data['asset_kuhs_code']) && trim($data['asset_kuhs_code']) !== '') ? $data['asset_kuhs_code'] : null;
	$asset_serial_no = (isset($data['asset_serial_no']) && trim($data['asset_serial_no']) !== '') ? $data['asset_serial_no'] : null;
	$asset_model_no = (isset($data['asset_model_no']) && trim($data['asset_model_no']) !== '') ? $data['asset_model_no'] : null;
	$asset_name = (isset($data['asset_name']) && trim($data['asset_name']) !== '') ? $data['asset_name'] : null;
	
	if($asset_kuhs_code != null)
	{
		// Check for duplication in kuhs code
		$res = $assetObj->checkKuhsCodeDuplication($asset_id,$asset_kuhs_code);
		if (pg_num_rows($res) > 0) { 
			echo json_encode(['status' => 'error', 'message' => 'Asset Code (KUHS) already exists. Please use a unique code.']);
			exit;
		}
	}
	$asset_type_id = (isset($data['asset_type_id']) && $data['asset_type_id'] !== '') ? intval($data['asset_type_id']) : null;
	$asset_type_name = (isset($data['asset_type_name']) && trim($data['asset_type_name']) !== '') ? $data['asset_type_name'] : null;
	$asset_subtype_id = (isset($data['asset_subtype_id']) && $data['asset_subtype_id'] !== '') ? intval($data['asset_subtype_id']) : null;
	$asset_subtype_name = (isset($data['asset_subtype_name']) && trim($data['asset_subtype_name']) !== '') ? $data['asset_subtype_name'] : null;
	$asset_subtype_entity_id = (isset($data['asset_subtype_entity_id']) && $data['asset_subtype_entity_id'] !== '') ? intval($data['asset_subtype_entity_id']) : null;
	$asset_subtype_entity_name = (isset($data['asset_subtype_entity_name']) && trim($data['asset_subtype_entity_name']) !== '') ? $data['asset_subtype_entity_name'] : null;
	$asset_subtype_entitynode_id = (isset($data['asset_subtype_entitynode_id']) && $data['asset_subtype_entitynode_id'] !== '') ? intval($data['asset_subtype_entitynode_id']) : null;
	$asset_subtype_entitynode_name = (isset($data['asset_subtype_entitynode_name']) && trim($data['asset_subtype_entitynode_name']) !== '') ? $data['asset_subtype_entitynode_name'] : null;
	
	if ($asset_type_id === null || $asset_subtype_id === null || $asset_subtype_entity_id === null || $asset_subtype_entitynode_id === null) {
			echo json_encode(['status' => 'error', 'message' => 'Please fill asset categorization fields']);
			exit;
		}
	$campus_id = (isset($data['campus_id']) && $data['campus_id'] !== '') ? intval($data['campus_id']) : null;
	$campus_name = (isset($data['campus_name']) && trim($data['campus_name']) !== '') ? $data['campus_name'] : null;
	$land_id = (isset($data['land_id']) && $data['land_id'] !== '') ? intval($data['land_id']) : null;
	$land_name = (isset($data['land_name']) && trim($data['land_name']) !== '') ? $data['land_name'] : null;
	$building_id = (isset($data['building_id']) && $data['building_id'] !== '') ? intval($data['building_id']) : null;
	$building_name = (isset($data['building_name']) && trim($data['building_name']) !== '') ? $data['building_name'] : null;
	$floor_id = (isset($data['floor_id']) && $data['floor_id'] !== '') ? intval($data['floor_id']) : null;
	$floor_name = (isset($data['floor_name']) && trim($data['floor_name']) !== '') ? $data['floor_name'] : null;
	$room_id = (isset($data['room_id']) && $data['room_id'] !== '') ? intval($data['room_id']) : null;
	$room_name = (isset($data['room_name']) && trim($data['room_name']) !== '') ? $data['room_name'] : null;
	$section_id = (isset($data['section_id']) && $data['section_id'] !== '') ? intval($data['section_id']) : null;
	$section_name = (isset($data['section_name']) && trim($data['section_name']) !== '') ? $data['section_name'] : null;
	$seat_id = (isset($data['seat_id']) && $data['seat_id'] !== '') ? intval($data['seat_id']) : null;
	$seat_name = (isset($data['seat_name']) && trim($data['seat_name']) !== '') ? $data['seat_name'] : null;

	$gst_applicable = isset($data['gst_applicable']) ? $data['gst_applicable'] : 'f';
	$amc_applicable = isset($data['amc_applicable']) ? $data['amc_applicable'] : 'f';
	$warranty_applicable = isset($data['warranty_applicable']) ? $data['warranty_applicable'] : 'f';
	$depreciation_applicable = isset($data['depreciation_applicable']) ? $data['depreciation_applicable'] : 'f';

	$admin_sanction_no = (isset($data['admin_sanction_no']) && trim($data['admin_sanction_no']) !== '') ? $data['admin_sanction_no'] : null;
	$admin_sanction_date = !empty($data['admin_sanction_date']) ? $data['admin_sanction_date'] : null;
	$technical_sanction_no = (isset($data['technical_sanction_no']) && trim($data['technical_sanction_no']) !== '') ? $data['technical_sanction_no'] : null;
	$technical_sanction_date = !empty($data['technical_sanction_date']) ? $data['technical_sanction_date'] : null;
	$work_order_no = (isset($data['work_order_no']) && trim($data['work_order_no']) !== '') ? $data['work_order_no'] : null;
	$work_order_date = !empty($data['work_order_date']) ? $data['work_order_date'] : null;
	$source_of_fund = (isset($data['source_of_fund']) && trim($data['source_of_fund']) !== '') ? $data['source_of_fund'] : null;
	$purchase_code = (isset($data['purchase_code']) && trim($data['purchase_code']) !== '') ? $data['purchase_code'] : null;
	$purchase_date = !empty($data['purchase_date']) ? $data['purchase_date'] : null;
	$vendor_name = (isset($data['vendor_name']) && trim($data['vendor_name']) !== '') ? $data['vendor_name'] : null;
	$vendor_address_gst = (isset($data['vendor_address_gst']) && trim($data['vendor_address_gst']) !== '') ? $data['vendor_address_gst'] : null;
	$invoice_no = (isset($data['invoice_no']) && trim($data['invoice_no']) !== '') ? $data['invoice_no'] : null;
	$cost_excl_gst = (isset($data['cost_excl_gst']) && $data['cost_excl_gst'] !== '') ? floatval($data['cost_excl_gst']) : null;
	$gst_charged = (isset($data['gst_charged']) && $data['gst_charged'] !== '') ? floatval($data['gst_charged']) : null;
	$gst_percentage = (isset($data['gst_percentage']) && $data['gst_percentage'] !== '') ? floatval($data['gst_percentage']) : null;
	$customs_duties = (isset($data['customs_duties']) && $data['customs_duties'] !== '') ? floatval($data['customs_duties']) : null;
	$other_costs = (isset($data['other_costs']) && $data['other_costs'] !== '') ? floatval($data['other_costs']) : null;
	$other_costs_desc = (isset($data['other_costs_desc']) && trim($data['other_costs_desc']) !== '') ? $data['other_costs_desc'] : null;
	$discount = (isset($data['discount']) && $data['discount'] !== '') ? floatval($data['discount']) : null;
	$total_cost = (isset($data['total_cost']) && $data['total_cost'] !== '') ? floatval($data['total_cost']) : null;
	
	$capitalization_date = !empty($data['capitalization_date']) ? $data['capitalization_date'] : null;
	$itc_adjustment = (isset($data['itc_adjustment']) && $data['itc_adjustment'] !== '') ? floatval($data['itc_adjustment']) : null;
	$subsidy_adjustment = (isset($data['subsidy_adjustment']) && $data['subsidy_adjustment'] !== '') ? floatval($data['subsidy_adjustment']) : null;
	$duties_rebates_adjustment = (isset($data['duties_rebates_adjustment']) && $data['duties_rebates_adjustment'] !== '') ? floatval($data['duties_rebates_adjustment']) : null;
	$other_adjustments = (isset($data['other_adjustments']) && $data['other_adjustments'] !== '') ? floatval($data['other_adjustments']) : null;
	$cost_after_adjustments = (isset($data['cost_after_adjustments']) && $data['cost_after_adjustments'] !== '') ? floatval($data['cost_after_adjustments']) : null;
	
	$initial_valuation_date = !empty($data['initial_valuation_date']) ? $data['initial_valuation_date'] : null;
	$initial_valuation_value = (isset($data['initial_valuation_value']) && $data['initial_valuation_value'] !== '') ? floatval($data['initial_valuation_value']) : null;
	$revaluation_date = !empty($data['revaluation_date']) ? $data['revaluation_date'] : null;
	$revaluation_value = (isset($data['revaluation_value']) && $data['revaluation_value'] !== '') ? floatval($data['revaluation_value']) : null;
	
	
	$life_over_or_5_percent = isset($data['life_over_or_5_percent']) ? $data['life_over_or_5_percent'] : 'f';
	$depreciation_rate = (isset($data['depreciation_rate']) && $data['depreciation_rate'] !== '') ? floatval($data['depreciation_rate']) : null;
	$accumulated_depreciation = (isset($data['accumulated_depreciation']) && $data['accumulated_depreciation'] !== '') ? floatval($data['accumulated_depreciation']) : null;
	$adjustments_this_year = (isset($data['adjustments_this_year']) && $data['adjustments_this_year'] !== '') ? floatval($data['adjustments_this_year']) : null;
	$carrying_cost_end = (isset($data['carrying_cost_end']) && $data['carrying_cost_end'] !== '') ? floatval($data['carrying_cost_end']) : null;
	$sale_date = !empty($data['sale_date']) ? $data['sale_date'] : null;
	$sale_invoice_no = (isset($data['sale_invoice_no']) && trim($data['sale_invoice_no']) !== '') ? $data['sale_invoice_no'] : null;
	$sale_value_excl_gst = (isset($data['sale_value_excl_gst']) && trim($data['sale_value_excl_gst']) !== '') ? $data['sale_value_excl_gst'] : null;
	$purchaser_name = (isset($data['purchaser_name']) && trim($data['purchaser_name']) !== '') ? $data['purchaser_name'] : null;
	$purchaser_address = (isset($data['purchaser_address']) && trim($data['purchaser_address']) !== '') ? $data['purchaser_address'] : null;
	$profit_loss_on_sale = (isset($data['profit_loss_on_sale']) && $data['profit_loss_on_sale'] !== '') ? floatval($data['profit_loss_on_sale']) : null;
	$profit_loss_on_revaluation = (isset($data['profit_loss_on_revaluation']) && $data['profit_loss_on_revaluation'] !== '') ? floatval($data['profit_loss_on_revaluation']) : null;
	$impairment_loss = (isset($data['impairment_loss']) && $data['impairment_loss'] !== '') ? floatval($data['impairment_loss']) : null;
	
	$custom_fields_json = null;

	if (!empty($data['custom_fields'])) {
		if ($asset_type_name === 'A-4 : Land' || $asset_type_name === 'A-5 : Buildings') {
			$referenceTable = ($asset_type_name === 'A-4 : Land') ? 'land' : 'building';
			$referenceId    = ($asset_type_name === 'A-4 : Land') ? intval($land_id) : intval($building_id);

			$custom_fields = [
				'type'  => 'reference',
				'table' => $referenceTable,
				'id'    => $referenceId,
				'extra' => $data['custom_fields']   // already array
			];
		} else {
			$fields = isset($data['custom_fields']) ? (array)$data['custom_fields'] : [];
			$custom_fields = ['type' => 'fields'] + $fields;
		}
	}
		// Encode to proper JSON once before saving
		$custom_fields_json = json_encode($custom_fields, JSON_UNESCAPED_UNICODE);
		//echo($custom_fields_json); exit();
    $is_verified = isset($data['is_verified']) ? $data['is_verified'] : 'f';
	$verification_comment = (isset($data['verification_comment']) && trim($data['verification_comment']) !== '') ? $data['verification_comment'] : null;
	$asset_status = (isset($data['asset_status']) && trim($data['asset_status']) !== '') ? $data['asset_status'] : null;

	$userid = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;
	
	$res = $assetObj->saveAsset($asset_id, $asset_unique_code, $asset_kuhs_code, $asset_serial_no, $asset_model_no, $asset_name,
								$asset_type_id, $asset_type_name, $asset_subtype_id, $asset_subtype_name, $asset_subtype_entity_id,
								$asset_subtype_entity_name, $asset_subtype_entitynode_id, $asset_subtype_entitynode_name, $campus_id,
								$campus_name, $land_id, $land_name, $building_id, $building_name, $floor_id, $floor_name, $room_id,
								$room_name, $section_id, $section_name,$seat_id, $seat_name, $gst_applicable, $amc_applicable, $warranty_applicable, 
								$depreciation_applicable,$admin_sanction_no, $admin_sanction_date, $technical_sanction_no, 
								$technical_sanction_date,$work_order_no, $work_order_date, $source_of_fund, $purchase_code, 
								$purchase_date, $vendor_name, $vendor_address_gst, $invoice_no, $cost_excl_gst, $gst_charged, 
								$customs_duties, $other_costs, $other_costs_desc,$total_cost,$capitalization_date, $itc_adjustment, 
								$subsidy_adjustment, $duties_rebates_adjustment, $other_adjustments, $cost_after_adjustments,
								$initial_valuation_date, $initial_valuation_value, $revaluation_date, $revaluation_value,
								$estimated_life_years, $estimated_residual_value, $carrying_cost_begin, $years_expired,
								$years_remaining, $life_over_or_5_percent, $depreciation_rate, $accumulated_depreciation,
								$adjustments_this_year, $carrying_cost_end,$sale_date, $sale_invoice_no, $sale_value_excl_gst, 
								$purchaser_name, $purchaser_address,$profit_loss_on_sale, $profit_loss_on_revaluation, $impairment_loss,
								$custom_fields_json,$userid,$asset_status,$verification_comment,$is_verified,$gst_percentage,$discount);
   if($res){
                $asset_connObj->db_query($asset_connObj->c_link, 'COMMIT');
                echo json_encode(['status' => 'success', 'message' => 'Asset Saved Successfully']);;
                
            }
            else{
                $asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
                echo json_encode(['status' => 'error', 'message' => '"Error Occured while saving Asset. Please Contact IT Admin!!!"']);
            }
   
    break;
	
	case 'getAssetFieldSettings':
    $assetTypeId = isset($_GET['asset_type_id']) ? $_GET['asset_type_id'] : null;

    $res = $objcommon->getAssetFieldSettings($assetTypeId);
    $settings = [];

    if ($res) {
        while ($row = $asset_connObj->db_fetch_array($res)) {

            // Decode JSON fields (if you store field metadata as JSON)
            //$dynamic_fields = [];
           // if (!empty($row['field_json'])) { // assuming column name
           //     $decoded = json_decode($row['field_json'], true);
           //     if (json_last_error() === JSON_ERROR_NONE) {
           //         foreach ($decoded as $key => $value) {
           //             $dynamic_fields[] = ['name' => $key, 'value' => $value];
            //        }
            //    }
           // }
            //$row['dynamic_fields'] = $dynamic_fields;
            $settings[] = $row;
        }

        echo json_encode(['status' => 'success', 'data' => $settings]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No asset field settings found.']);
    }
    break;
	
		
	default : break;
    
}

