<?php

class Login {

    function __construct() {

        global $asset_connObj;
        $this->conObj = $asset_connObj;
    }

    function getUserData($uid, $pwd) {
    	
    	$strsql = "SELECT *
        from public.portaluser WHERE username=rtrim($1) and password=rtrim($2) and is_active=($3)";
        pg_prepare($this->conObj->c_link, "my_query", $strsql);
        return pg_execute($this->conObj->c_link, "my_query", array($uid, $pwd, 'Y'));      
        
    }
    
}

?>