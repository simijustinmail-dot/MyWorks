<?php

class Asset {

    function __construct() {
        global $asset_connObj;
        $this->conObj = $asset_connObj;
    }

	public function addAssetType($code, $name, $desc, $assetclass, $userid) {
        try {
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");

            $sql = "INSERT INTO public.assettype
                    (asset_type_code, asset_type_name, asset_type_desc, asset_class, created_by, created_date, last_updated_by, last_updated_date)
                    VALUES($1, $2, $3, $4, $5, now(), $5, now())"; 

            $prepared = pg_prepare($this->conObj->c_link, "add_asset_type", $sql); 
            if ($prepared === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            $res = pg_execute($this->conObj->c_link, "add_asset_type", array($code, $name, $desc, $assetclass, $userid));
            if ($res === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            return ['success' => true, 'message' => 'Assettype added successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
 function checkAssetType($assetTypeCode, $assetTypeName){
        try{
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");
            $sql = "SELECT * from public.assettype where asset_type_code = $1 or asset_type_name=$2 ";
            $prepared = pg_prepare($this->conObj->c_link, "check_assettype", $sql);
            if ($prepared === false) {
                $error = pg_last_error($this->conObj->c_link);
                echo "<br> Error preparing statement: " . $error;
                return false; // Exit if the statement preparation fails
            }
            $res = pg_execute($this->conObj->c_link, "check_assettype", array($assetTypeCode, $assetTypeName));
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
		public function addAssetSubType($code, $name, $assettype, $userid) {
        try {
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");

            $sql = "INSERT INTO public.assetsubtype
                    (asset_subtype_code, asset_subtype_name, asset_type_id, created_by, created_date, last_updated_by, last_updated_date)
                    VALUES($1, $2, $3, $4, now(), $4, now())"; 

            $prepared = pg_prepare($this->conObj->c_link, "add_asset_subtype", $sql); 
            if ($prepared === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            $res = pg_execute($this->conObj->c_link, "add_asset_subtype", array($code, $name, $assettype, $userid));
            if ($res === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            return ['success' => true, 'message' => 'Asset subtype added successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
 function checkAssetSubType($assetSubTypeCode, $assetSubTypeName){
        try{
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");
            $sql = "SELECT * from public.assetsubtype where asset_subtype_code = $1 or asset_subtype_name=$2 ";
            $prepared = pg_prepare($this->conObj->c_link, "check_assetsubtype", $sql);
            if ($prepared === false) {
                $error = pg_last_error($this->conObj->c_link);
                echo "<br> Error preparing statement: " . $error;
                return false; // Exit if the statement preparation fails
            }
            $res = pg_execute($this->conObj->c_link, "check_assetsubtype", array($assetSubTypeCode, $assetSubTypeName));
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
	public function addAssetSubTypeEntity($code, $name, $assetsubtype, $userid) {
        try {
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");

            $sql = "INSERT INTO public.assetsubtypeentity
                    (asset_subtype_entity_code, asset_subtype_entity_name, asset_subtype_id, created_by, created_date, last_updated_by, last_updated_date)
                    VALUES($1, $2, $3, $4, now(), $4, now())";

            $prepared = pg_prepare($this->conObj->c_link, "add_asset_subtype_entity", $sql); 
            if ($prepared === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            $res = pg_execute($this->conObj->c_link, "add_asset_subtype_entity", array($code, $name, $assetsubtype, $userid));
            if ($res === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            return ['success' => true, 'message' => 'Asset subtype entity added successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
 function checkAssetSubTypeEntity($code, $name){
        try{
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");
            $sql = "SELECT * from public.assetsubtypeentity where asset_subtype_entity_code = $1 or asset_subtype_entity_name=$2 ";
            $prepared = pg_prepare($this->conObj->c_link, "check_assetsubtypeentity", $sql);
            if ($prepared === false) {
                $error = pg_last_error($this->conObj->c_link);
                echo "<br> Error preparing statement: " . $error;
                return false; // Exit if the statement preparation fails
            }
            $res = pg_execute($this->conObj->c_link, "check_assetsubtypeentity", array($code, $name));
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
	public function addAssetSubTypeEntityNode($code, $name, $assetsubtypeentity, $userid) {
        try {
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");

            $sql = "INSERT INTO public.assetsubtypeentitynode
                    (asset_subtype_entitynode_code, asset_subtype_entitynode_name, asset_subtype_entity_id, created_by, created_date, last_updated_by, last_updated_date)
                    VALUES($1, $2, $3, $4, now(), $4, now())"; 
            $prepared = pg_prepare($this->conObj->c_link, "add_asset_subtype_entitynode", $sql); 
            if ($prepared === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            $res = pg_execute($this->conObj->c_link, "add_asset_subtype_entitynode", array($code, $name, $assetsubtypeentity, $userid));
            if ($res === false) {
                return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
            }
            return ['success' => true, 'message' => 'Asset subtype entity node added successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
 function checkAssetSubTypeEntityNode($code, $name){
        try{
            pg_query($this->conObj->c_link, "DEALLOCATE ALL");
            $sql = "SELECT * from public.assetsubtypeentitynode where asset_subtype_entitynode_code = $1 or asset_subtype_entitynode_name=$2 ";
            $prepared = pg_prepare($this->conObj->c_link, "check_assetsubtypeentitynode", $sql);
            if ($prepared === false) {
                $error = pg_last_error($this->conObj->c_link);
                echo "<br> Error preparing statement: " . $error;
                return false; // Exit if the statement preparation fails
            }
            $res = pg_execute($this->conObj->c_link, "check_assetsubtypeentitynode", array($code, $name));
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
 function saveAsset($asset_id, $asset_unique_code, $asset_kuhs_code, $asset_serial_no, $asset_model_no, $asset_name, 
 $asset_type_id, $asset_type_name, $asset_subtype_id, $asset_subtype_name, $asset_subtype_entity_id, $asset_subtype_entity_name, 
 $asset_subtype_entitynode_id, $asset_subtype_entitynode_name, $campus_id, $campus_name, $land_id, $land_name, $building_id, $building_name, 
 $floor_id, $floor_name,$room_id, $room_name, $section_id, $section_name,$seat_id, $seat_name,$gst_applicable,$amc_applicable,$warranty_applicable,$depreciation_applicable,
 $admin_sanction_no, $admin_sanction_date, $technical_sanction_no,$technical_sanction_date,$work_order_no, $work_order_date, $source_of_fund, 
 $purchase_code, $purchase_date, $vendor_name, $vendor_address_gst, $invoice_no, $cost_excl_gst, $gst_charged, $customs_duties, $other_costs, $other_costs_desc, $total_cost
 ,$capitalization_date, $itc_adjustment, $subsidy_adjustment, $duties_rebates_adjustment, $other_adjustments, $cost_after_adjustments,
 $initial_valuation_date, $initial_valuation_value, $revaluation_date, $revaluation_value,$estimated_life_years, $estimated_residual_value, $carrying_cost_begin, 
 $years_expired,$years_remaining, $life_over_or_5_percent, $depreciation_rate, $accumulated_depreciation,$adjustments_this_year, $carrying_cost_end,$sale_date, 
 $sale_invoice_no, $sale_value_excl_gst,$purchaser_name, $purchaser_address,$profit_loss_sale, $profit_loss_revaluation, $impairment_loss,$custom_fields,$userid,$asset_status,$verification_comment,$is_verified,
 $gst_percentage,$discount){
        try { 
		pg_query($this->conObj->c_link, "BEGIN");

        // Generate asset code if new record
        if ($asset_id == 0) { 
			$asset_unique_code = $this->generateAssetCode($this->conObj);
            if (empty($asset_unique_code)) {
                throw new Exception("Failed to generate asset code");
            }
        }

        //pg_query($this->conObj->c_link, "DEALLOCATE ALL");
        // If asset_id > 0, do UPDATE
         if ($asset_id > 0) { 
            $sql = "UPDATE asset SET
            asset_kuhs_code = $1,
            asset_serial_no = $2,
            asset_model_no = $3,
            asset_name = $4,
            asset_type_id = $5,
            asset_type_name = $6,
            asset_subtype_id = $7,
            asset_subtype_name = $8,
            asset_subtype_entity_id = $9,
            asset_subtype_entity_name = $10,
            asset_subtype_entitynode_id = $11,
            asset_subtype_entitynode_name = $12,
            campus_id = $13,
            campus_name = $14,
            land_id = $15,
            land_name = $16,
            building_id = $17,
            building_name = $18,
            floor_id = $19,
            floor_name = $20,
            room_id = $21,
            room_name = $22,
            section_id = $23,
            section_name = $24,
            seat_id = $25,
            seat_name = $26,
            gst_applicable = $27,
            amc_applicable = $28,
            warranty_applicable = $29,
            depreciation_applicable = $30,
            admin_sanction_no = $31,
            admin_sanction_date = $32,
            technical_sanction_no = $33,
            technical_sanction_date = $34,
            work_order_no = $35,
            work_order_date = $36,
            source_of_fund = $37,
            purchase_code = $38,
            purchase_date = $39,
            vendor_name = $40,
            vendor_address_gst = $41,
            invoice_no = $42,
            cost_excl_gst = $43,
            gst_charged = $44,
            customs_duties = $45,
            other_costs = $46,
            other_costs_desc = $47,
            total_cost = $48,
            capitalization_date = $49,
            itc_adjustment = $50,
            subsidy_adjustment = $51,
            duties_rebates_adjustment = $52,
            other_adjustments = $53,
            cost_after_adjustments = $54,
            initial_valuation_date = $55,
            initial_valuation_value = $56,
            revaluation_date = $57,
            revaluation_value = $58,
            estimated_life_years = $59,
            estimated_residual_value = $60,
            carrying_cost_begin = $61,
            years_expired = $62,
            years_remaining = $63,
            life_over_or_5_percent = $64,
            depreciation_rate = $65,
            accumulated_depreciation = $66,
            adjustments_this_year = $67,
            carrying_cost_end = $68,
            sale_date = $69,
            sale_invoice_no = $70,
            sale_value_excl_gst = $71,
            purchaser_name = $72,
            purchaser_address = $73,
            profit_loss_on_sale = $74,
            profit_loss_on_revaluation = $75,
            impairment_loss = $76,
            custom_fields = $77,
            last_updated_by = $78,
            last_updated_date = now(),
            asset_status = $79,
            verification_comment = $80,
            is_verified = $81,
			gst_percentage = $83,
			discount = $84
        WHERE asset_id = $82";

        $stmtName = "update_asset";
        $params = [
            $asset_kuhs_code, $asset_serial_no, $asset_model_no, $asset_name,
            $asset_type_id, $asset_type_name, $asset_subtype_id, $asset_subtype_name,
            $asset_subtype_entity_id, $asset_subtype_entity_name, $asset_subtype_entitynode_id, $asset_subtype_entitynode_name,
            $campus_id, $campus_name, $land_id, $land_name, $building_id, $building_name,
            $floor_id, $floor_name, $room_id, $room_name, $section_id, $section_name,
            $seat_id, $seat_name,
            $gst_applicable, $amc_applicable, $warranty_applicable, $depreciation_applicable,
            $admin_sanction_no, $admin_sanction_date, $technical_sanction_no, $technical_sanction_date,
            $work_order_no, $work_order_date, $source_of_fund, $purchase_code, $purchase_date,
            $vendor_name, $vendor_address_gst, $invoice_no, $cost_excl_gst, $gst_charged, $customs_duties, 
            $other_costs, $other_costs_desc, $total_cost, $capitalization_date, $itc_adjustment, 
            $subsidy_adjustment, $duties_rebates_adjustment, $other_adjustments, $cost_after_adjustments,
            $initial_valuation_date, $initial_valuation_value, $revaluation_date, $revaluation_value,
            $estimated_life_years, $estimated_residual_value, $carrying_cost_begin, $years_expired,
            $years_remaining, $life_over_or_5_percent, $depreciation_rate, $accumulated_depreciation,
            $adjustments_this_year, $carrying_cost_end,
            $sale_date, $sale_invoice_no, $sale_value_excl_gst, $purchaser_name, $purchaser_address,
            $profit_loss_on_sale, $profit_loss_on_revaluation, $impairment_loss,
            $custom_fields, $userid,
            $asset_status, $verification_comment, $is_verified, $asset_id,$gst_percentage,$discount
        ];
        } else {
             $sql = "INSERT INTO asset (
			asset_unique_code, asset_kuhs_code, asset_serial_no, asset_model_no, asset_name,
			asset_type_id, asset_type_name, asset_subtype_id, asset_subtype_name,
			asset_subtype_entity_id, asset_subtype_entity_name, asset_subtype_entitynode_id, asset_subtype_entitynode_name,
			campus_id, campus_name, land_id, land_name, building_id, building_name,
			floor_id, floor_name, room_id, room_name, section_id, section_name,
			seat_id, seat_name,
			gst_applicable, amc_applicable, warranty_applicable, depreciation_applicable,
			admin_sanction_no, admin_sanction_date, technical_sanction_no, technical_sanction_date,
			work_order_no, work_order_date, source_of_fund, purchase_code, purchase_date, vendor_name,
			vendor_address_gst, invoice_no, cost_excl_gst, gst_charged, customs_duties, other_costs, other_costs_desc,
			total_cost, capitalization_date, itc_adjustment, subsidy_adjustment, duties_rebates_adjustment, other_adjustments,
			cost_after_adjustments,
			initial_valuation_date, initial_valuation_value, revaluation_date, revaluation_value,
			estimated_life_years, estimated_residual_value, carrying_cost_begin, years_expired, years_remaining,
			life_over_or_5_percent, depreciation_rate, accumulated_depreciation, adjustments_this_year, carrying_cost_end,
			sale_date, sale_invoice_no, sale_value_excl_gst, purchaser_name, purchaser_address,
			profit_loss_on_sale, profit_loss_on_revaluation, impairment_loss, custom_fields,
			created_by, created_date, last_updated_by, last_updated_date, gst_percentage, discount
			) VALUES (
			$1, $2, $3, $4, $5,
			$6, $7, $8, $9,
			$10, $11, $12, $13,
			$14, $15, $16, $17, $18, $19,
			$20, $21, $22, $23, $24, $25,
			$26, $27,
			$28, $29, $30, $31,
			$32, $33, $34, $35,
			$36, $37, $38, $39, $40, $41,
			$42, $43, $44, $45, $46, $47, $48, $49, $50,
			$51, $52, $53, $54, $55,
			$56, $57, $58, $59, $60,
			$61, $62, $63, $64, $65,
			$66, $67, $68, $69, $70,
			$71, $72, $73, $74, $75,
			$76, $77, $78, 
			$79, now(), $80, now(), $81, $82
			)";

		$stmtName = "insert_asset";
		$params = [
			$asset_unique_code, $asset_kuhs_code, $asset_serial_no, $asset_model_no, $asset_name,
			$asset_type_id, $asset_type_name, $asset_subtype_id, $asset_subtype_name,
			$asset_subtype_entity_id, $asset_subtype_entity_name, $asset_subtype_entitynode_id, $asset_subtype_entitynode_name,
			$campus_id, $campus_name, $land_id, $land_name, $building_id, $building_name,
			$floor_id, $floor_name, $room_id, $room_name, $section_id, $section_name,
			$seat_id, $seat_name,
			$gst_applicable, $amc_applicable, $warranty_applicable, $depreciation_applicable,
			$admin_sanction_no, $admin_sanction_date, $technical_sanction_no, $technical_sanction_date,
			$work_order_no, $work_order_date, $source_of_fund, $purchase_code, $purchase_date,
			$vendor_name, $vendor_address_gst, $invoice_no, $cost_excl_gst, $gst_charged, $customs_duties, 
			$other_costs, $other_costs_desc, $total_cost,
			$capitalization_date, $itc_adjustment, $subsidy_adjustment, $duties_rebates_adjustment, $other_adjustments,
			$cost_after_adjustments, $initial_valuation_date, $initial_valuation_value, $revaluation_date, $revaluation_value,
			$estimated_life_years, $estimated_residual_value, $carrying_cost_begin, $years_expired, $years_remaining,
			$life_over_or_5_percent, $depreciation_rate, $accumulated_depreciation, $adjustments_this_year, $carrying_cost_end,
			$sale_date, $sale_invoice_no, $sale_value_excl_gst, $purchaser_name, $purchaser_address,
			$profit_loss_on_sale, $profit_loss_on_revaluation, $impairment_loss, $custom_fields,
			$userid, $userid, $gst_percentage, $discount
			];
        }

        $prepared = pg_prepare($this->conObj->c_link, $stmtName, $sql);
        if ($prepared === false) {
			throw new Exception(pg_last_error($this->conObj->c_link));
            //return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        $res = pg_execute($this->conObj->c_link, $stmtName, $params);

        if ($res === false) {
			throw new Exception(pg_last_error($this->conObj->c_link));
            //return ['success' => false, 'message' => pg_last_error($this->conObj->c_link)];
        }

        return ['success' => true, 'message' => 'Asset saved successfully', 'asset_code' => $asset_unique_code];
    } catch (Exception $e) { echo($e);
		pg_query($this->conObj->c_link, "ROLLBACK");
		pg_query($this->conObj->c_link, "DEALLOCATE ALL");
        return ['success' => false, 'message' => $e->getMessage()];
    }
    }
	
	function generateAssetCode($connObj) {
    try {
        // Begin transaction
        //$this->conObj->db_query($this->conObj->c_link, "BEGIN");

        // Lock the row to prevent duplicates during concurrent inserts
        $sql = "SELECT prefix, last_number FROM asset_code_sequence WHERE id = 1 FOR UPDATE";
        $result = pg_query($connObj->c_link, $sql);
        $row = pg_fetch_assoc($result);

        if (!$row) {
            throw new Exception("No sequence row found in asset_code_sequence table.");
        }

        $prefix = $row['prefix'];
        $lastNumber = (int)$row['last_number'];

        // Increment number
        $nextNumber = $lastNumber + 1;

        // Roll over after 9,999,999
        if ($nextNumber > 9999999) {
            $nextNumber = 1;
            $prefix = chr(ord($prefix) + 1);

            if ($prefix > 'Z') {
                throw new Exception("Asset code limit reached (Z-9999999)!");
            }
        }

        // Generate formatted asset code like AST-A0198330
        $assetCode = sprintf("AST-%s%07d", $prefix, $nextNumber);

        // Update the sequence table
        $updateSql = "UPDATE asset_code_sequence SET prefix = '$prefix', last_number = $nextNumber WHERE id = 1";
        $res = pg_query($connObj->c_link, $updateSql); 
        if (!$res) {
            throw new Exception(pg_last_error($connObj->c_link));
        }
        // Commit changes
        //$conn->db_query($conn->c_link, "COMMIT");

        return $assetCode;

    } catch (Exception $e) {
        // Rollback in case of error
     //   $this->conObj->db_query($this->conObj->c_link, "ROLLBACK");
        throw $e;
    }
}
function checkKuhsCodeDuplication($asset_id,$asset_kuhs_code) { 
		pg_query($this->conObj->c_link, "DEALLOCATE ALL");
		$sql = "SELECT 1 FROM public.asset WHERE asset_id != $1 AND asset_kuhs_code = $2";
		$prepared = pg_prepare($this->conObj->c_link, "check_assetkuhscode", $sql);
		if ($prepared === false) return false;

		return pg_execute($this->conObj->c_link, "check_assetkuhscode", array($asset_id, $asset_kuhs_code));
	}	
}
?>