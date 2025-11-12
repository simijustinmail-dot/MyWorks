<?php
session_start();
//require '../../login/session_middleware.php';
include_once ("../../common/cors.php");
//require '../../login/session_middleware.php';
header("Content-Type: application/json"); 
// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
//include_once ("../../common/auth.php");
include_once("misc.class.php"); 
include_once("../asset/asset.class.php");
include_once("../../connection.php");
include_once("../../class/common.class.php");
$objcommon = new common();
$misObj = new Misc();
$assetObj = new Asset();
$data = json_decode(file_get_contents("php://input"), true);
$type = isset($_GET['type']) ? $_GET['type'] : (isset($data['type']) ? $data['type'] : ''); // to handle get and post cases 
$userid = isset($data['created_by']) ? $data['created_by'] : 0; //echo("user".$_SESSION['user_id']);  exit();

switch($type){
    case 'addCampus': 
        $campusname = isset($data['campusname']) ? $data['campusname'] : '';
		$campusdesc = isset($data['campusdesc']) ? $data['campusdesc'] : '';
		$created_by = isset($data['created_by']) ? $data['created_by'] : 0;
		if ($campusname === '') {
			echo json_encode(['status' => 'error', 'message' => 'Campus name is required']);
			exit;
		}
        $res = $misObj->checkCampus($campusname);
        $numRows=0;
        $numRows = pg_num_rows($res);
        if ($numRows > 0){
            echo json_encode(['status' => 'error', 'message' => 'Campus Already Exits']);
        }
        else{
            $res = $misObj->addCampus($campusname, $campusdesc, $created_by);
            if($res){
                $asset_connObj->db_query($asset_connObj->c_link, 'COMMIT');
                echo json_encode(['status' => 'success', 'message' => 'Campus Added Successfully']);
                
            }
            else{
                $asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
                echo json_encode(['status' => 'error', 'message' => '"Error Occured while adding Campus. Please Contact IT Admin!!!"']);
            }
        }
        
        break;
		
	case 'deleteCampus': 
		$id = isset($data["id"])?$data["id"]:"";
		$result = $objcommon->deleteCampusById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Campus Deleted Successfully']);
		} else {
			echo json_encode(['status' => 'error', 'message' => '"Error Occured while deleting Campus. Please Contact IT Admin!!!"']);
		}
	    break;
        
     case 'getCampuses': 
		$res = $objcommon->getCampusDetails();
		$campuses = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $campuses[] = $row;
		}
		echo json_encode(['status' => 'success', 'campuses' => $campuses]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No campus found.']);
		}  
	    break;
		
	case 'addLand': 

        $landName = isset($data['landName']) ? $data['landName'] : '';
		$landDesc = isset($data['landDesc']) ? $data['landDesc'] : '';
		$surveyNo = isset($data['surveyNo']) ? $data['surveyNo'] : '';
		$village = isset($data['village']) ? $data['village'] : '';
		$areaOfLand = (isset($data['area']) && $data['area'] !== '') ? $data['area'] : null;
		$areaUnit = isset($data['areaUnit']) ? $data['areaUnit'] : '';
		$location = isset($data['location']) ? $data['location'] : '';
		$boundaries = isset($data['boundaries']) ? $data['boundaries'] : '';
		$acquisitionType = isset($data['acquisitionType']) ? $data['acquisitionType'] : '';
		$ownerName = isset($data['ownerName']) ? $data['ownerName'] : '';
		$registrationDetails = isset($data['registrationDetails']) ? $data['registrationDetails'] : '';
		$created_by = isset($data['created_by']) ? $data['created_by'] : 0;
		$campus = isset($data['campus']) ? $data['campus'] : 0;

		if ($landName === '') {
			echo json_encode(['status' => 'error', 'message' => 'Land Name is required']);
			exit;
		}

		$res = $misObj->checkLand($landName);
		$numRows = pg_num_rows($res);

		if ($numRows > 0) {
			echo json_encode(['status' => 'error', 'message' => 'Land Name Already Exists']);
		} else {
			$res = $misObj->addLand(
				$landName, $landDesc, $surveyNo, $village, $areaOfLand, $areaUnit,
				$location, $boundaries, $acquisitionType, $ownerName,
				$registrationDetails, $campus, $created_by
			);
				//---- save in to assetsubtypeentitynode
				$prefix = 'NPMFA-2';
				$code = $objcommon->getNextAssetSubTypeEntityNodeCode($prefix);
				$result = $objcommon->getAssetSubTypeEntityByCode($prefix);
				$entityrow = $asset_connObj->db_fetch_array($result);
				$entityId = $entityrow['asset_subtype_entity_id'];
				$res = $assetObj->addAssetSubTypeEntityNode($code, $landName, $entityId,  $created_by);
				
			if ($res) {				
				$asset_connObj->db_query($asset_connObj->c_link, 'COMMIT');
				echo json_encode(['status' => 'success', 'message' => 'Land Added Successfully']);
			} else {
				$asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
				echo json_encode(['status' => 'error', 'message' => 'Error occurred while adding Land. Please contact IT Admin!!!']);
			}
		}  
        break;
		
	case 'deleteLand': 
		$id = isset($data["id"])?$data["id"]:"";
		$result = $objcommon->deleteLandById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Land Deleted Successfully']);;
		} else {
			echo json_encode(['status' => 'error', 'message' => '"Error Occured while deleting Land. Please Contact IT Admin!!!"']);
		}
	    break;
		
	case 'getLands': 
		$res = $objcommon->getLandDetails();
		$data = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $data[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $data]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No lands found.']);
		}  
	    break;
		
	case 'getLandsOnCampus': 
		$id = isset($_GET["campus_id"])?$_GET["campus_id"]:"";
		$res = $objcommon->getLandDetailsOnCampus($id);
		$data = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $data[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $data]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No lands found.']);
		}  
	    break;
		   
   case 'addBuilding': 
        $buildingName = isset($data['buildingName']) ? trim($data['buildingName']) : '';
		$buildingDesc = isset($data['buildingDesc']) ? $data['buildingDesc'] : '';
		$landId = isset($data['landId']) ? $data['landId'] : null;
		$numberOfStories = isset($data['numberOfStories']) ? $data['numberOfStories'] : '';
		$wallType = isset($data['wallType']) ? $data['wallType'] : '';
		$roofType = isset($data['roofType']) ? $data['roofType'] : '';
		$created_by = isset($data['created_by']) ? $data['created_by'] : 0;

		if ($buildingName === '' || !$landId) {
			echo json_encode(['status' => 'error', 'message' => 'Building Name and Land are required']);
			exit;
		}

		// Check if a building with same name exists under the same land
		$res = $misObj->checkBuildingExists($buildingName, $landId);
		if (pg_num_rows($res) > 0) {
			echo json_encode(['status' => 'error', 'message' => 'Building with this name already exists on the selected land.']);
			exit;
		}

		// Insert into building table
		$res = $misObj->addBuilding($buildingName, $buildingDesc, $landId, $numberOfStories, $wallType, $roofType, $created_by);

		if ($res) {
			// Add AssetSubTypeEntityNode entry
			$prefix = 'BLDG-1';
			$code = $objcommon->getNextAssetSubTypeEntityNodeCode($prefix);
			$result = $objcommon->getAssetSubTypeEntityByCode($prefix);
			$entityrow = $asset_connObj->db_fetch_array($result);
			$entityId = $entityrow['asset_subtype_entity_id'];

			$resNode = $assetObj->addAssetSubTypeEntityNode($code, $buildingName, $entityId, $created_by);

			if ($resNode) {
				$asset_connObj->db_query($asset_connObj->c_link, 'COMMIT');
				echo json_encode(['status' => 'success', 'message' => 'Building added successfully']);
			} else {
				$asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
				echo json_encode(['status' => 'error', 'message' => 'Error occurred while adding building node.']);
			}
		} else {
			$asset_connObj->db_query($asset_connObj->c_link, 'ROLLBACK');
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while adding building.']);
		}
        break;
		
	case 'deleteBuilding': 
		$id = isset($data["id"])?$data["id"]:"";
		$result = $objcommon->deleteBuildingById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Building Deleted Successfully']);;
		} else {
			echo json_encode(['status' => 'error', 'message' => '"Error Occured while deleting Building. Please Contact IT Admin!!!"']);
		}
	    break;
		
	case 'getBuildings': 
		$res = $objcommon->getBuildingDetails();
		$data = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $data[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $data]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No buildings found.']);
		}  
	    break;
	case 'getBuildingsOnLand': 
		$id = isset($_GET["land_id"])?$_GET["land_id"]:"";
		$res = $objcommon->getBuildingDetailsOnland($id);
		$data = [];
		if ($res) {
		while ($row = $asset_connObj->db_fetch_array($res)) {
        $data[] = $row;
		}
		echo json_encode(['status' => 'success', 'data' => $data]);
		} 
		else {
		echo json_encode(['status' => 'error', 'message' => 'No buildings found.']);
		}  
	    break;
	case 'addFloor':
		$buildingId = isset($data['buildingId']) ? trim($data['buildingId']) : null;
		$floorNumber = isset($data['floorNumber']) ? trim($data['floorNumber']) : null;
		$floorName = isset($data['floorName']) ? trim($data['floorName']) : '';
		$floorArea = isset($data['floorArea']) ? trim($data['floorArea']) : null;//echo($data['floorArea']); exit();
		$floorType = isset($data['floorType']) ? trim($data['floorType']) : '';
		$created_by = isset($data['created_by']) ? $data['created_by'] : 0;

		if ($buildingId === '' || $floorNumber === null || $floorName === '') {
			echo json_encode(['status' => 'error', 'message' => 'Building, Floor Number, and Floor Name are required.']);
			exit;
		}

		// Check for existing floor with same number under the same building
		$res = $misObj->checkFloorExists($buildingId, $floorNumber);
		if (pg_num_rows($res) > 0) {
			echo json_encode(['status' => 'error', 'message' => 'This floor already exists for the selected building.']);
			exit;
		}

		// Insert floor
		$res = $misObj->addFloor($buildingId, $floorNumber, $floorName, $floorArea, $floorType, $created_by);

		if ($res) {
			echo json_encode(['status' => 'success', 'message' => 'Floor added successfully.']);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while adding floor.']);
		}
		break;
	case 'getFloors':
		$res = $objcommon->getFloorDetails(); 
		$data = [];
		if ($res) {
			while ($row = $asset_connObj->db_fetch_array($res)) {
				$data[] = $row;
			}
			echo json_encode(['status' => 'success', 'data' => $data]);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'No floors found.']);
		}
		break;
	case 'getFloorOnBuilding':
		$id = isset($_GET["building_id"])?$_GET["building_id"]:"";
		$res = $objcommon->getFloorDetailsOnBuilding($id); 
		$data = [];
		if ($res) {
			while ($row = $asset_connObj->db_fetch_array($res)) {
				$data[] = $row;
			}
			echo json_encode(['status' => 'success', 'data' => $data]);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'No floors found.']);
		}
		break;
	case 'deleteFloor':
		$id = isset($data["id"]) ? $data["id"] : "";
		$result = $objcommon->deleteFloorById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Floor Deleted Successfully']);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while deleting Floor. Please contact IT Admin.']);
		}
		break;
	case 'addRoom':
		$floorId = isset($data['floorId']) ? trim($data['floorId']) : null;
		$roomNumber = isset($data['roomNumber']) ? trim($data['roomNumber']) : null;
		$roomName = isset($data['roomName']) ? trim($data['roomName']) : '';
		$created_by = isset($data['created_by']) ? $data['created_by'] : 0;

		if ($floorId === '' || $roomNumber === null || $roomName === '') {
			echo json_encode(['status' => 'error', 'message' => 'Floor, Room Number, and Room Name are required.']);
			exit;
		}

		// Check for existing room with same number under the same building and floor
		$res = $misObj->checkRoomExists($floorId, $roomNumber);
		if (pg_num_rows($res) > 0) {
			echo json_encode(['status' => 'error', 'message' => 'This room already exists for the selected floor.']);
			exit;
		}

		// Insert room
		$res = $misObj->addRoom($floorId, $roomNumber, $roomName, $created_by);

		if ($res) {
			echo json_encode(['status' => 'success', 'message' => 'Room added successfully.']);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while adding room.']);
		}
		break;
	case 'getRooms':
		$res = $objcommon->getRoomDetails(); 
		$data = [];
		if ($res) {
			while ($row = $asset_connObj->db_fetch_array($res)) {
				$data[] = $row;
			}
			echo json_encode(['status' => 'success', 'data' => $data]);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'No rooms found.']);
		}
		break;
	case 'getRoomOnFloor':
		$id = isset($_GET["floor_id"])?$_GET["floor_id"]:"";
		$res = $objcommon->getRoomDetailsOnFloor($id); 
		$data = [];
		if ($res) {
			while ($row = $asset_connObj->db_fetch_array($res)) {
				$data[] = $row;
			}
			echo json_encode(['status' => 'success', 'data' => $data]);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'No rooms found.']);
		}
		break;
	case 'deleteRoom':
		$id = isset($data["id"]) ? $data["id"] : "";
		$result = $objcommon->deleteRoomById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Room Deleted Successfully']);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while deleting Room. Please contact IT Admin.']);
		}
		break;
	case 'addSection': 
		$sectionName = isset($data['sectionName']) ? trim($data['sectionName']) : '';
		$sectionDesc = isset($data['sectionDescription']) ? trim($data['sectionDescription']) : '';
		$created_by = isset($data['created_by']) ? $data['created_by'] : 0;
		if ($sectionName === '') {
			echo json_encode(['status' => 'error', 'message' => 'Section Name are required.']);
			exit;
		}

		// Check for existing room with same number under the same building and floor
		$res = $misObj->checkSectionExists($sectionName);
		if (pg_num_rows($res) > 0) {
			echo json_encode(['status' => 'error', 'message' => 'This section already exists for the selected floor.']);
			exit;
		}

		// Insert room
		$res = $misObj->addSection($sectionName, $sectionDesc, $created_by);

		if ($res) {
			echo json_encode(['status' => 'success', 'message' => 'Section added successfully.']);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while adding section.']);
		}
		break;
	case 'getSections':
		$res = $objcommon->getSectionDetails(); 
		$data = [];
		if ($res) {
			while ($row = $asset_connObj->db_fetch_array($res)) {
				$data[] = $row;
			}
			echo json_encode(['status' => 'success', 'data' => $data]);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'No sections found.']);
		}
		break;
	case 'deleteSection':
		$id = isset($data["id"]) ? $data["id"] : "";
		$result = $objcommon->deleteSectionById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Section Deleted Successfully']);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while deleting Section. Please contact IT Admin.']);
		}
		break;
	case 'addSeat': 
		$seatName = isset($data['seat_name']) ? trim($data['seat_name']) : null;
		$seatDesc = isset($data['seat_desc']) ? trim($data['seat_desc']) : null;
		$sectionId = isset($data['section_id']) ? trim($data['section_id']) : null;
		$sectionName = isset($data['section_name']) ? trim($data['section_name']) : null;
		$seatRoleId = isset($data['seat_role_id']) ? trim($data['seat_role_id']) : null;
		$seatRoleName = isset($data['seat_role_name']) ? trim($data['seat_role_name']) : null;
		$seatRoleLevel = isset($data['seat_role_level']) ? trim($data['seat_role_level']) : null;
		$reportsToSeatId = isset($data['reports_to_seat_id']) ? trim($data['reports_to_seat_id']) : null;
		$reportsToSeatName = isset($data['reports_to_seat_name']) ? trim($data['reports_to_seat_name']) : null;	
		$created_by = isset($data['created_by']) ? $data['created_by'] : 0;
		if ($seatName === null || $seatRoleId === null) {
			echo json_encode(['status' => 'error', 'message' => 'Please fill data.']);
			exit;
		}

		// Check for existing seat with same name 
		$res = $misObj->checkSeatExists($seatName);
		if (pg_num_rows($res) > 0) {
			echo json_encode(['status' => 'error', 'message' => 'This seat already exists.']);
			exit;
		}

		// Insert seat
		$res = $misObj->addSeat($seatName, $seatDesc, $sectionId, $sectionName, $seatRoleId, $seatRoleName, $seatRoleLevel, $reportsToSeatId, $reportsToSeatName, $created_by);

		if ($res) {
			echo json_encode(['status' => 'success', 'message' => 'Seat added successfully.']);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while adding seat.']);
		}
		break;
	case 'deleteSeat':
		$id = isset($data["id"]) ? $data["id"] : "";
		$result = $objcommon->deleteSeatById($id);
		if ($result) {
			echo json_encode(['status' => 'success', 'message' => 'Seat Deleted Successfully']);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'Error occurred while deleting Seat. Please contact IT Admin.']);
		}
		break;
	case 'getSeats':
		$res = $objcommon->getSeatDetails(); 
		$data = [];
		if ($res) {
			while ($row = $asset_connObj->db_fetch_array($res)) {
				$data[] = $row;
			}
			echo json_encode(['status' => 'success', 'data' => $data]);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'No seats found.']);
		}
		break;
	case 'getSeatRoles':
		$res = $objcommon->getSeatRoleDetails(); 
		$data = [];
		if ($res) {
			while ($row = $asset_connObj->db_fetch_array($res)) {
				$data[] = $row;
			}
			echo json_encode(['status' => 'success', 'data' => $data]);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'No seat roles found.']);
		}
		break;
		   
   default : break;
    
}

