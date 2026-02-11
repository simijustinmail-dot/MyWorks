<?php

class common {

    function __construct() {
        //error_reporting(-1);
        global $asset_connObj;
        $this->conObj = $asset_connObj;
    }


    function getCampusDetails(){
        $strsql = "select * from public.campus"; 
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	
	public function deleteCampusById($id) {
		$id = intval($id); 
		$strsql = "DELETE FROM public.campus WHERE campus_id = $id";
		return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getLandDetails(){
        $strsql = "select * from public.land l 
				   JOIN public.campus c on l.campus_id = c.campus_id 
				   order by land_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	function getLandDetailsOnCampus($id){
        $strsql = "select * from public.land l 
				   where l.campus_id = $id
				   order by land_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	public function deleteLandById($id) {
		$id = intval($id); 
		$strsql = "DELETE FROM public.land WHERE land_id = $id";
		return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getBuildingDetails(){
        $strsql = "select * from public.building l 
				   JOIN public.land c on l.land_id = c.land_id 
				   order by building_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	function getBuildingDetailsOnland($id){
        $strsql = "select * from public.building l 
				   where l.land_id = $id
				   order by building_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	public function deleteBuildingById($id) {
		$id = intval($id); 
		$strsql = "DELETE FROM public.building WHERE building_id = $id";
		return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getFloorDetails() {
    $strsql = "SELECT f.*, b.building_name
               FROM public.floor f
               JOIN public.building b ON f.building_id = b.building_id
               ORDER BY b.building_name, f.floor_no";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getFloorDetailsOnBuilding($id) {
    $strsql = "SELECT *
               FROM public.floor f
               WHERE f.building_id = $id
               ORDER BY f.floor_id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function deleteFloorById($id) {
    $id = intval($id);
    $strsql = "DELETE FROM public.floor WHERE floor_id = $id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getRoomDetails() {
    $strsql = "SELECT r.*, b.building_name , f.floor_name
               FROM public.room r
			   JOIN public.floor f on f.floor_id = r.floor_id
               JOIN public.building b ON f.building_id = b.building_id
               ORDER BY b.building_name, f.floor_no, r.room_no";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getRoomDetailsOnFloor($id) {
    $strsql = "SELECT *
               FROM public.room r
               WHERE r.floor_id = $id
               ORDER BY r.room_id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function deleteRoomById($id) {
    $id = intval($id);
    $strsql = "DELETE FROM public.room WHERE room_id = $id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	
	function getSectionDetails() {
    $strsql = "SELECT *
               FROM public.section 
               ORDER BY section_name";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	
	function deleteSectionById($id) {
    $id = intval($id);
    $strsql = "DELETE FROM public.section WHERE section_id = $id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getSeatDetails() {
    $strsql = "SELECT *
               FROM public.seat 
               ORDER BY seat_id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getSeatDetailsOnSection($section_id) {
    $strsql = "SELECT *
               FROM public.seat 
			   WHERE (section_id = $section_id
               OR section_id IS NULL)
               ORDER BY seat_id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getSeatRoleDetails() {
    $strsql = "SELECT *
               FROM public.seatrole 
               ORDER BY role_id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function deleteSeatById($id) {
    $id = intval($id);
    $strsql = "DELETE FROM public.seat WHERE seat_id = $id";
    return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getAssetTypeDetails(){
        $strsql = "select * from public.assettype";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	
	public function deleteAssetTypeById($id) {
		$id = intval($id);
		$strsql = "DELETE FROM public.assettype WHERE asset_type_id = $id";
		return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getAssetSubTypeDetails(){
        $strsql = "select * from public.assetsubtype s 
				   JOIN public.assettype t on s.asset_type_id = t.asset_type_id 
				   order by s.asset_type_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	public function deleteAssetSubTypeById($id) {
		$id = intval($id);
		$strsql = "DELETE FROM public.assetsubtype WHERE asset_subtype_id = $id"; 
		return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	
	function getAssetSubTypeEntityDetails(){
        $strsql = "select * from public.assetsubtypeentity e 
		           JOIN public.assetsubtype s on e.asset_subtype_id = s.asset_subtype_id 
				   order by e.asset_subtype_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	public function deleteAssetSubTypeEntityById($id) {
		$id = intval($id);
		$strsql = "DELETE FROM public.assetsubtypeentity WHERE asset_subtype_entity_id = $id"; 
		return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	public function getAssetSubTypeEntityByCode($code) { 
		$strsql = "SELECT * FROM public.assetsubtypeentity WHERE asset_subtype_entity_code = '$code'"; 
		return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	
	function getAssetSubTypeEntityNodeDetails(){
        $strsql = "select * from public.assetsubtypeentitynode n 
		           JOIN public.assetsubtypeentity e on n.asset_subtype_entity_id = e.asset_subtype_entity_id 
				   order by n.asset_subtype_entity_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	public function deleteAssetSubTypeEntityNodeById($id) {
		$id = intval($id);
		$strsql = "DELETE FROM public.assetsubtypeentitynode WHERE asset_subtype_entitynode_id = $id";
		return $this->conObj->db_query($this->conObj->c_link, $strsql);
	}
	function getNextAssetSubTypeEntityNodeCode($prefix) {
		$query = "SELECT asset_subtype_entitynode_code 
				  FROM public.assetsubtypeentitynode 
				  WHERE asset_subtype_entitynode_code LIKE $1 
				  ORDER BY LENGTH(asset_subtype_entitynode_code) DESC, asset_subtype_entitynode_code DESC 
				  LIMIT 1";

		$likePattern = $prefix . '%';
		$res = pg_query_params($this->conObj->c_link, $query, array($likePattern));

		$nextNumber = 1;
		if ($row = pg_fetch_assoc($res)) {
			$lastCode = $row['asset_subtype_entitynode_code']; // e.g., NPMFA-2-14
			$parts = explode('-', $lastCode);
			$lastNumber = intval(end($parts)); // Extract last numeric part
			$nextNumber = $lastNumber + 1;
		}

		return $prefix ."-". $nextNumber; // e.g., NPMFA-2-15
	}
	function getAssetSubTypesOnType($Id){ 
        $strsql = "select * from public.assetsubtype where asset_type_id = $Id 
				   order by asset_subtype_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	function getAssetSubTypeEntityOnSubType($Id){ 
        $strsql = "select * from public.assetsubtypeentity where asset_subtype_id = $Id 
				   order by asset_subtype_entity_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	function getAssetSubTypeEntityNodesOnEntity($Id){ 
        $strsql = "select * from public.assetsubtypeentitynode where asset_subtype_entity_id = $Id 
				   order by asset_subtype_entitynode_id";
        $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
        return $res;
    }
	function getRoleBasedSectionCondition($userrole,$usersection, $alias = "")
	{
		$prefix = $alias ? $alias . "." : "";
		$condition = "";

		// Only apply section filter if user is a SectionUser
		if ($userrole === 'SectionAdmin' && !empty($usersection)) {
			$condition .= " AND {$prefix}section_id = " . intval($usersection);
		}
		return $condition;
	}
	function getRoleBasedAssetTypeCondition($userrole, $typeId, $alias = "")
	{
    // Handle alias prefix (add a dot if needed)
    $prefix = $alias ? $alias . "." : "";

    $roleTypeMap = [
        'WorksAdminMEP' => [30], //
        'WorksAdminCivil'      => [31, 20, 21, 18], // "A-4";"Land" "A-5";"Buildings" "A-11";"Water supply & Sanitary Fittings" "A-2";"Machinery"
        'PurchaseAdmin'        => [23, 18], // "A-7";"Furniture and Fixture" "A-2";"Machinery"
        'ITAdmin'              => [25, 26], // "A-9T";"Other Non-financial Assets(Tangible)" "A-9I";"Other Non-financial Assets(Intangible)"
        'VehiclesAdmin'  => [17], // "A-1";"Motor Vehicles"
    ];

    $condition = "";

    if (isset($roleTypeMap[$userrole])) {
        $allowedTypes = $roleTypeMap[$userrole];

        if ($typeId == 0) {
            $condition .= " AND {$prefix}asset_type_id IN (" . implode(",", $allowedTypes) . ")";
        } elseif (in_array($typeId, $allowedTypes)) {
            $condition .= " AND {$prefix}asset_type_id = $typeId";
        } else {
            $condition .= " AND 1=0";
        }
    } else {
        if ($typeId) $condition .= " AND {$prefix}asset_type_id = $typeId";
    }

    return $condition;
	}
	function getAssignedCondition($assigned, $alias = "")
	{
		$prefix = $alias ? $alias . "." : "";
		$condition = "";
		if ($assigned === "1") { // considered as assigned if section is assigned for asset
			$condition .= " AND {$prefix}section_id IS NOT NULL";
		} elseif ($assigned === "0") {
			$condition .= " AND {$prefix}section_id IS NULL";
		}
		return $condition;
	}
	function getVerifiedCondition($verified, $alias = "")
	{
		$prefix = $alias ? $alias . "." : "";
		$condition = "";
		if ($verified === "1") { // Considered as verified is is_verified is 't'
			$condition .= " AND {$prefix}is_verified = 't'";
		} elseif ($verified === "0") {
			$condition .= " AND ({$prefix}is_verified = 'f' OR {$prefix}is_verified IS NULL)";
		}
		return $condition;
	}
	function getSearchCondition($search, $alias = "")
	{
		$prefix = $alias ? $alias . "." : "";
		$condition = "";

		if (trim($search) !== '') {
			$search = pg_escape_string($search);

			$condition .= " AND (
				{$prefix}asset_name ILIKE '%{$search}%' OR
				{$prefix}asset_unique_code ILIKE '%{$search}%' OR
				{$prefix}asset_kuhs_code ILIKE '%{$search}%' OR
				{$prefix}asset_model_no ILIKE '%{$search}%' OR
				{$prefix}asset_serial_no ILIKE '%{$search}%'
			)";
		}

		return $condition;
	}
	function getAssets($typeId = 0, $subTypeId = 0, $entityId = 0, $nodeId = 0, $campusId = 0, $landId =0, $buildingId =0, $floorId=0, $roomId=0, $sectionId=0, $seatId=0, $limit=20, $offset=0, $userrole="",$usersection="",$assigned = "",$verified = "",$search="") {
    $where = "WHERE 1=1";  
	if($userrole == "SectionAdmin")
	{
		$where .= $this->getRoleBasedSectionCondition($userrole,$usersection, "a");
	}
	else{
		$where .= $this->getRoleBasedAssetTypeCondition($userrole, $typeId,"a");
	}
	//if ($typeId) $where .= " AND a.asset_type_id = $typeId";
    if ($subTypeId) $where .= " AND a.asset_subtype_id = $subTypeId";
    if ($entityId) $where .= " AND a.asset_subtype_entity_id = $entityId";
    if ($nodeId) $where .= " AND a.asset_subtype_entitynode_id = $nodeId";
	if ($campusId) $where .= " AND a.campus_id = $campusId";
	if ($landId) $where .= " AND a.land_id = $landId";
	if ($buildingId) $where .= " AND a.building_id = $buildingId";
	if ($floorId) $where .= " AND a.floor_id = $floorId";
	if ($roomId) $where .= " AND a.room_id = $roomId";
	if ($sectionId) $where .= " AND a.section_id = $sectionId";
	if ($seatId) $where .= " AND a.seat_id = $seatId";
	
	$where .= $this->getAssignedCondition($assigned, "a");
	$where .= $this->getVerifiedCondition($verified, "a");
	$where .= $this->getSearchCondition($search, "a");

    /*$strsql = "SELECT 
                    a.asset_id,
                    a.asset_name,
                    a.asset_unique_code,
                    a.asset_kuhs_code,
                    a.asset_model_no,
                    a.current_location,
                    at.asset_type_name,
                    ast.asset_subtype_name,
                    ase.asset_subtype_entity_name,
                    asn.asset_subtype_entitynode_name
               FROM public.asset a
               LEFT JOIN public.assettype at ON a.asset_type_id = at.asset_type_id
               LEFT JOIN public.assetsubtype ast ON a.asset_subtype_id = ast.asset_subtype_id
               LEFT JOIN public.assetsubtypeentity ase ON a.asset_subtype_entity_id = ase.asset_subtype_entity_id
               LEFT JOIN public.assetsubtypeentitynode asn ON a.asset_subtype_entitynode_id = asn.asset_subtype_entitynode_id
               $where
               ORDER BY a.asset_id DESC";*/
	   $strsql = "SELECT 
                    *
               FROM public.asset a
               $where
			   ORDER BY a.asset_unique_code DESC  LIMIT $limit OFFSET $offset";  //echo($strsql); exit();
               //ORDER BY a.asset_id,a.asset_kuhs_code DESC LIMIT 7000";

    return $this->conObj->db_query($this->conObj->c_link, $strsql);
}

	function getAssetsCount($typeId = 0, $subTypeId = 0, $entityId = 0, $nodeId = 0, $campusId = 0, $landId =0, $buildingId =0, $floorId=0, $roomId=0, $sectionId=0, $seatId=0,$userrole = "",$usersection="",$assigned = "",$verified = "",$search="") {
		$where = "WHERE 1=1"; 
		if($userrole == "SectionAdmin")
		{
			$where .= $this->getRoleBasedSectionCondition($userrole,$usersection);
		}
		else{
			$where .= $this->getRoleBasedAssetTypeCondition($userrole, $typeId);
		}
		//if ($typeId) $where .= " AND asset_type_id = $typeId";
		if ($subTypeId) $where .= " AND asset_subtype_id = $subTypeId";
		if ($entityId) $where .= " AND asset_subtype_entity_id = $entityId";
		if ($nodeId) $where .= " AND asset_subtype_entitynode_id = $nodeId";
		if ($campusId) $where .= " AND campus_id = $campusId";
		if ($landId) $where .= " AND land_id = $landId";
		if ($buildingId) $where .= " AND building_id = $buildingId";
		if ($floorId) $where .= " AND floor_id = $floorId";
		if ($roomId) $where .= " AND room_id = $roomId";
		if ($sectionId) $where .= " AND section_id = $sectionId";
		if ($seatId) $where .= " AND seat_id = $seatId";
		
		$where .= $this->getAssignedCondition($assigned);
		$where .= $this->getVerifiedCondition($verified);
		$where .= $this->getSearchCondition($search);
		if (trim($search) !== '') {
        $search = pg_escape_string($search);
        $where .= " AND (
            asset_name ILIKE '%$search%' OR
            asset_unique_code ILIKE '%$search%' OR
            asset_kuhs_code ILIKE '%$search%' OR
            asset_model_no ILIKE '%$search%' OR
			asset_serial_no ILIKE '%$search%'
        )";
		}

		$sql = "SELECT COUNT(*) AS total,
					   SUM(CASE WHEN is_verified = 't' THEN 1 ELSE 0 END) AS verified, 
					   SUM(CASE WHEN section_id IS NOT NULL THEN 1 ELSE 0 END) AS assigned
					   FROM public.asset $where"; //echo($sql); exit();
		$res = $this->conObj->db_query($this->conObj->c_link, $sql);
		$row = $this->conObj->db_fetch_array($res);

		return [
			'total' => $row['total'],
			'verified' => $row['verified'],
			'assigned' => $row['assigned']
		];
	}
	
	function getAssetFieldSettings($assetTypeId = null) {
    if (empty($assetTypeId)) {
        return false; // or return an empty array
    }

    $strsql = "
        SELECT *
        FROM public.asset_field_settings
        WHERE asset_type_id = " . intval($assetTypeId) . "
        ORDER BY asset_type_id, display_order
    ";

    $res = $this->conObj->db_query($this->conObj->c_link, $strsql);
    return $res;
}

}

?>
