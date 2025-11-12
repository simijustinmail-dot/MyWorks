<?php 
error_reporting(0);
include_once("class/class.pgsql.php");
include_once("conn_config.php");

date_default_timezone_set('Asia/Calcutta');

try{
    $asset_connObj    = new dbConnect($ass_db_host, $ass_db_user, $ass_db_password, $ass_db_dbname, true);
}
catch(Exception $e){
    echo $e->getMessage();
}

$client = $_SERVER["REMOTE_ADDR"]; 
$userid = isset($_SESSION['pki_user_id'])?trim($_SESSION['pki_user_id']):'NONE'; 

if (!$asset_connObj->c_link) {
    die('<strong><font color=red><center>The Connection is Down at this moment due to technical issues.
        Please check back </center></font></strong>');
}

$sqlQuery ="SET myapp.username = '".$userid."'; SET myapp.userip = '".$client."';";
$res = $asset_connObj->db_query($asset_connObj->c_link,$sqlQuery);
?>
