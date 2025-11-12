<?php

class Misc {

    function __construct() {
        global $asset_connObj;
        $this->conObj = $asset_connObj;
    }

	public function addCampus($campusname, $campusdesc, $userid) {
        try {
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");

            $sql = "INSERT INTO public.campus
                    (campus_name, campus_desc, created_by, created_date, last_updated_by, last_updated_date)
                    VALUES($1, $2, $3, now(), $3, now())"; 

            $prepared = pg_prepare($this->conObj->c_link, "add_campus", $sql);
            if ($prepared === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            $res = pg_execute($this->conObj->c_link, "add_campus", array($campusname, $campusdesc, $userid));
            if ($res === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            return ['success' => true, 'message' => 'Campus added successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
	function checkCampus($campusname){
			try{
				pg_query($this->conObj->c_link, "DEALLOCATE ALL");
				$sql = "SELECT * from public.campus where campus_name = $1";
				$prepared = pg_prepare($this->conObj->c_link, "check_campus", $sql);
				if ($prepared === false) {
					$error = pg_last_error($this->conObj->c_link);
					echo "<br> Error preparing statement: " . $error;
					return false; // Exit if the statement preparation fails
				}
				$res = pg_execute($this->conObj->c_link, "check_campus", array($campusname));
				if ($res == false){
					$error = pg_last_error($this->conObj->c_link);
					echo "<br>Error executing query: " . $error;
				}
				return $res;
			}
			catch(Exception $e){
				echo $e->getMessage();
			}
		}
function addLand($landName, $landDesc, $surveyNo, $village, $areaOfLand, $areaUnit,
				$location, $boundaries, $acquisitionType, $ownerName,
				$registrationDetails, $campus, $created_by) {
		try {
			pg_query($this->conObj->c_link, "DEALLOCATE ALL");

			$sql = "INSERT INTO public.land (
						land_name, land_desc, survey_no, village, area_of_land, area_unit,
						location_des, boundaries, acquisition_type, owner_name,
						registration_details,campus_id, created_by, created_date,
						last_updated_by, last_updated_date
					)
					VALUES (
						$1, $2, $3, $4, $5, $6,
						$7, $8, $9, $10,
						$11, $12, $13, now(),
						$13, now()
					)";

			$prepared = pg_prepare($this->conObj->c_link, "add_land", $sql); 
			if ($prepared === false) {
				return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
			}

			$res = pg_execute($this->conObj->c_link, "add_land", array(
				$landName, $landDesc, $surveyNo, $village, $areaOfLand, $areaUnit,
				$location, $boundaries, $acquisitionType, $ownerName,
				$registrationDetails, $campus, $created_by
			));

			if ($res === false) {
				return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
			}

			return ['success' => true, 'message' => 'Land added successfully'];
		} catch (Exception $e) { 
			return ['success' => false, 'message' => $e->getMessage()];
		}
	}	
	
	function checkLand($landName) {
		try {
			pg_query($this->conObj->c_link, "DEALLOCATE ALL");
			$sql = "SELECT 1 FROM public.land WHERE land_name = $1";
			$prepared = pg_prepare($this->conObj->c_link, "check_land", $sql);
			if ($prepared === false) {
				$error = pg_last_error($this->conObj->c_link);
				echo "<br> Error preparing statement: " . $error;
				return false;
			}

			$res = pg_execute($this->conObj->c_link, "check_land", array($landName));
			if ($res === false) {
				$error = pg_last_error($this->conObj->c_link);
				echo "<br> Error executing query: " . $error;
			}

			return $res;
		} catch (Exception $e) {
			echo $e->getMessage();
		}
	}
	function addBuilding($buildingName, $buildingDesc, $landId, $numberOfStories, $wallType, $roofType, $created_by) {
		try {
			pg_query($this->conObj->c_link, "DEALLOCATE ALL");

			$sql = "INSERT INTO public.building (
						building_name, building_desc, land_id, number_of_stories, wall_type, roof_type,
						created_by, created_date, last_updated_by, last_updated_date
					)
					VALUES (
						$1, $2, $3, $4, $5, $6,
						$7, now(), $7, now()
					)";

			$prepared = pg_prepare($this->conObj->c_link, "add_building", $sql);
			if ($prepared === false) {
				return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
			}

			$res = pg_execute($this->conObj->c_link, "add_building", array(
				$buildingName, $buildingDesc, $landId, $numberOfStories, $wallType, $roofType, $created_by
			));

			if ($res === false) {
				return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
			}

			return ['success' => true, 'message' => 'Building added successfully'];
		} catch (Exception $e) {
			return ['success' => false, 'message' => $e->getMessage()];
		}
	}
	function checkBuildingExists($buildingName, $landId) {
	try {
		pg_query($this->conObj->c_link, "DEALLOCATE ALL"); 
		$sql = "SELECT 1 FROM public.building WHERE building_name = $1 AND land_id = $2"; 
		$prepared = pg_prepare($this->conObj->c_link, "check_building", $sql);
		if ($prepared === false) {
			$error = pg_last_error($this->conObj->c_link);
			echo "<br> Error preparing statement: " . $error;
			return false;
		}

		$res = pg_execute($this->conObj->c_link, "check_building", array($buildingName, $landId));
		if ($res === false) {
			$error = pg_last_error($this->conObj->c_link);
			echo "<br> Error executing query: " . $error;
		}

		return $res;
	} catch (Exception $e) {
		echo $e->getMessage();
	}
	}
	function addFloor($buildingId, $floorNumber, $floorName, $floorArea, $floorType, $created_by) {
    try {
        pg_query($this->conObj->c_link, "DEALLOCATE ALL");

        $sql = "INSERT INTO public.floor (
                    building_id, floor_no, floor_name, floor_area, floor_type,
                    created_by, created_date, last_updated_by, last_updated_date
                )
                VALUES (
                    $1, $2, $3, $4, $5,
                    $6, now(), $6, now()
                )"; 

        $prepared = pg_prepare($this->conObj->c_link, "add_floor", $sql);
        if ($prepared === false) {
            return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }
        $res = pg_execute($this->conObj->c_link, "add_floor", array(
            $buildingId, $floorNumber, $floorName, $floorArea, $floorType, $created_by
        ));

        if ($res === false) {
			//throw new Exception(pg_last_error($this->conObj->c_link));
            return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        return ['success' => true, 'message' => 'Floor added successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
	}
	function checkFloorExists($buildingId, $floorNumber) { 
		pg_query($this->conObj->c_link, "DEALLOCATE ALL");
		$sql = "SELECT 1 FROM public.floor WHERE building_id = $1 AND floor_no = $2";
		$prepared = pg_prepare($this->conObj->c_link, "check_floor", $sql);
		if ($prepared === false) return false;

		return pg_execute($this->conObj->c_link, "check_floor", array($buildingId, $floorNumber));
	}
	function addRoom($floorId, $roomNumber, $roomName, $created_by) {
    try {
        pg_query($this->conObj->c_link, "DEALLOCATE ALL");

        $sql = "INSERT INTO public.room (
                    floor_id, room_no, room_name, 
                    created_by, created_date, last_updated_by, last_updated_date
                )
                VALUES (
                    $1, $2, $3,
                    $4, now(), $4, now()
                )";

        $prepared = pg_prepare($this->conObj->c_link, "add_floor", $sql);
        if ($prepared === false) {
            return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        $res = pg_execute($this->conObj->c_link, "add_floor", array(
            $floorId, $roomNumber, $roomName, $created_by
        ));

        if ($res === false) {
            return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        return ['success' => true, 'message' => 'Room added successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
	}
	function checkRoomExists($floorId, $roomNumber) { 
		pg_query($this->conObj->c_link, "DEALLOCATE ALL");
		$sql = "SELECT 1 FROM public.room WHERE building_id = $1 AND floor_no = $2";
		$prepared = pg_prepare($this->conObj->c_link, "check_floor", $sql);
		if ($prepared === false) return false;

		return pg_execute($this->conObj->c_link, "check_floor", array($floorId, $roomNumber));
	}
	function addSection($sectionName, $sectionDesc, $created_by) {
    try {
        pg_query($this->conObj->c_link, "DEALLOCATE ALL");

        $sql = "INSERT INTO public.section (
                    section_name, section_desc, 
                    created_by, created_date, last_updated_by, last_updated_date
                )
                VALUES (
                    $1, $2,
                    $3, now(), $3, now()
                )";
        $prepared = pg_prepare($this->conObj->c_link, "add_section", $sql);
        if ($prepared === false) {
            return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        $res = pg_execute($this->conObj->c_link, "add_section", array(
            $sectionName, $sectionDesc, $created_by
        ));

        if ($res === false) {
            return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        return ['success' => true, 'message' => 'Section added successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
	}
	function checkSectionExists($sectionName) {
		pg_query($this->conObj->c_link, "DEALLOCATE ALL");
		$sql = "SELECT 1 FROM public.section WHERE section_name = $1";
		$prepared = pg_prepare($this->conObj->c_link, "check_section", $sql); 
		if ($prepared === false) return false;

		return pg_execute($this->conObj->c_link, "check_section", array($sectionName));
	}
	function addSeat($seatName, $seatDesc, $sectionId, $sectionName, $seatRoleId, $seatRoleName, $seatRoleLevel, $reportsToSeatId, $reportsToSeatName, $created_by) {
    try {

        pg_query($this->conObj->c_link, "DEALLOCATE ALL");

        $sql = "INSERT INTO public.seat (
                    seat_name, seat_desc, section_id, section_name, seat_role_id, 
					seat_role_name, seat_role_level, reports_to_seat_id, reports_to_seat_name,created_by, created_date, last_updated_by, last_updated_date
                )
                VALUES (
                    $1, $2,
                    $3, $4, $5, $6, $7, $8, $9, $10, now(), $10, now()
                )";
        $prepared = pg_prepare($this->conObj->c_link, "add_seat", $sql); 
        if ($prepared === false) {
            return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        $res = pg_execute($this->conObj->c_link, "add_seat", array(
            $seatName, $seatDesc, $sectionId, $sectionName, $seatRoleId, $seatRoleName, $seatRoleLevel, $reportsToSeatId, $reportsToSeatName, $created_by
        ));

        if ($res === false) {
            return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        return ['success' => true, 'message' => 'Section added successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
	}
	function checkSeatExists($seatName) {
		pg_query($this->conObj->  c_link, "DEALLOCATE ALL");
		$sql = "SELECT 1 FROM public.seat WHERE seat_name = $1";
		$prepared = pg_prepare($this->conObj->c_link, "check_seat", $sql); 
		if ($prepared === false) return false;

		return pg_execute($this->conObj->c_link, "check_seat", array($seatName));
	}

}
?>