<?php
class validate {

    function validate() {
        error_reporting(E_ALL ^ E_NOTICE);
        global $conObj;
        $this->conObj = $conObj;
        global $CFYear;
        $this->CFYear = $CFYear;
        global $db_schema_ac;
        $this->db_schema = $db_schema_ac;
        date_default_timezone_set('Asia/Calcutta');
        $this->last_updated = date("Y-m-d H:i:s");
    }

    function mmddyyyy($dtstr) {
        $ymd = array();
        $ymd[0] = substr($dtstr, 0, 2);
        $ymd[1] = substr($dtstr, 3, 2);
        $ymd[2] = substr($dtstr, 6, 4);
        $strdt = $ymd[1] . '/' . $ymd[0] . '/' . $ymd[2];
        return $strdt;
    }

    function sqlInject($input) {
        $input = $this->stripQuotes($input);
        $input = " " . $input . " ";
        $known_bad = array("DECLARE", "CAST", "EXEC", " select ", " insert ", " update ", " delete ", " drop ", " script ", "--", ";", "xp_", "<", ">", "/*", "*/", "1=1", "%0D", "%0A", "%0D%0A", "\r", "\n", "\r\n");
        $known_bad1 = array(" DECLAR_E ", " CAS_T ", " EXE_C ", " Selec_t ", " Inser_t ", " Updat_e ", " Delet_e ", " Dro_p ", " Scrip_t ");
        $z = sizeof($known_bad);
        for ($i = 0; $i < $z; $i++) {
            if ($i < 6)
                $input = str_replace($known_bad[$i], $known_bad1[$i], $input);
            else
                $input = str_replace($known_bad[$i], " ", $input);
        }
        $input = pg_escape_string($input);
        return rtrim(ltrim($input));
    }

    function sqlInjectDate($input) {
        $input = $this->stripQuotes($input);
        $input = " " . $input . " ";
        $known_bad = array("DECLARE", "CAST", "EXEC", " select ", " insert ", " update ", " delete ", " drop ", " script ", "--", ";", "xp_", "<", ">", "1=1");
        $known_bad1 = array(" DECLAR_E ", " CAS_T ", " EXE_C ", " Selec_t ", " Inser_t ", " Updat_e ", " Delet_e ", " Dro_p ", " Scrip_t ");
        $z = sizeof($known_bad);
        for ($i = 0; $i < $z; $i++) {
            if ($i < 6)
                $input = str_replace($known_bad[$i], $known_bad1[$i], $input);
            else
                $input = str_replace($known_bad[$i], " ", $input);
        }
        return rtrim(ltrim($input));
    }

    function stripQuotes($input) {
        $input = str_replace("'", " ", $input);
        $input = str_replace("\"", " ", $input);
        return $input;
    }

    function yyyymmdd($dt) {
        if ($dt != "") {
            $dtstr = $dt;
            $ymd = explode("/", $dtstr);
            if (isset($ymd))
                $strdt = $ymd[2] . '-' . $ymd[1] . '-' . $ymd[0];
        } else
            $strdt = "0000-00-00";
        return $strdt;
    }

    function Ymmdd($dt) {
        $dtstr = $dt;
        $ymd = explode("-", $dtstr);
        $strdt = $ymd[2] . '-' . $ymd[1] . '-' . $ymd[0];
        return $strdt;
    }

    function Ymm($dt) {
        $dtstr = $dt;
        $ymd = explode("-", $dtstr);
        $strdt = $ymd[0] . '-' . $ymd[1];
        return $strdt;
    }

    function mmY($dt) {
        $dtstr = $dt;
        $ymd = explode("-", $dtstr);
        $strdt = $ymd[1] . '-' . $ymd[0];
        return $strdt;
    }

    function ddmmyyyy($dt) {
        if ($dt != "") {
            $dtstr = $dt;
            $ymd = explode("-", $dtstr);
            $strdt = $ymd[2] . '/' . $ymd[1] . '/' . $ymd[0];
        } else
            $strdt = "00/00/0000";
        return $strdt;
    }

    function dateyyyymmdd($dt) {
        $date = $dt;
        $day = substr($date, 0, 2);
        $month = substr($date, 3, 2);
        $year = substr($date, 6);
        $newdate = date("Y.m.d", mktime(0, 0, 0, $month, $day, $year));
        return $newdate;
    }

    function dmyhhmmss($dt) {
        $date = $dt;
        $year = substr($date, 0, 4);
        $month = substr($date, 5, 2);
        $day = substr($date, 8, 2);
        $hh = substr($date, 11, 2);
        $mm = substr($date, 14, 2);
        $ss = substr($date, 17);
        $newdate = date("d/m/Y H:i:s", mktime($hh, $mm, $ss, $month, $day, $year));
        return $newdate;
    }

    function dmyt($tdates) {
        $pieces = explode(" ", $tdates);
        $reqdt = ddmmyyyy($pieces[0]);
        $reqdt = $reqdt . " " . $pieces[1];
        return $reqdt;
    }

    function dmy($tdates) {
        $pieces = explode(" ", $tdates);
        $reqdt = ddmmyyyy($pieces[0]);
        return $reqdt;
    }

    function unicode($var) {
        $num = $this->utf8_to_unicode($var);
        $actual = $this->unicode_to_entities($num);
        return $actual;
    }

    function utf8_to_unicode($str) {
        $unicode = array();
        $values = array();
        $lookingFor = 1;
        // echo $str;
        for ($i = 0; $i < strlen($str); $i++) {

            $thisValue = ord($str[$i]);

            if ($thisValue < 128)
                $unicode[] = $thisValue;
            else {

                if (count($values) == 0)
                    $lookingFor = ( $thisValue < 224 ) ? 2 : 3;

                $values[] = $thisValue;

                if (count($values) == $lookingFor) {

                    $number = ( $lookingFor == 3 ) ?
                            ( ( $values[0] % 16 ) * 4096 ) + ( ( $values[1] % 64 ) * 64 ) + ( $values[2] % 64 ) :
                            ( ( $values[0] % 32 ) * 64 ) + ( $values[1] % 64 );

                    //echo $number;   
                    $unicode[] = $number;
                    $values = array();
                    $lookingFor = 1;
                } // if
            } // if
        } // for	
        return $unicode;
    }

    function unicode_to_entities($unicode) {
        $entities = '';
        foreach ($unicode as $value)
            $entities .= '&#' . $value . ';';
        return $entities;
    }

    //----------end of  utf-8 to unicode --------------
    function chkint($str) {
        $len = strlen($str);
        $valid = "0123456789";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid integer");
                throw $e;
            }
        }
        return true;
    }

    function chkDecimal($str) {
        $len = strlen($str);
        $valid = "0123456789.";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid decimal");
                throw $e;
            }
        }
        return true;
    }

    function chksplcharald($str) {
        $len = strlen($str);
        $valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+_.?@$%/&*,;:'(){}[]`~!^| \t\r\n";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function chkvalidchar($str) {
        $len = strlen($str);
        $valid = "-+_,./&:()[] ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function chkchar($str) {
        $len = strlen($str);
        $valid = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function chkblank($fieldname, $str) {
        $str = trim($str);
        $len = strlen($str);
        $valid = " ";

        if ($str === "") {
            $e = new Exception($fieldname . " - is blank");
            throw $e;
        }

        return true;
    }

    function chkalphanum($str) {
        $len = strlen($str);
        $valid = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,_";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function chkalphanummail($str) {
        $len = strlen($str);
        $valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._@";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function chkmailFirstpart($str) {
        $len = strlen($str);
        $valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function chkalphanumstrict($str) {
        //echo $str;
        $query = "";
        $len = strlen($str);
        $valid = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function chkSpecial($str) {
        //echo $str;
        $query = "";
        $len = strlen($str);
        $valid = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+_.?@$%/&*,;:'(){}[]`~!^| \t\r\n";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function add_date($givendate, $day, $mth, $yr) {
        $cd = strtotime($givendate);
        $newdate = date('Y-m-d h:i:s', mktime(date('h', $cd), date('i', $cd), date('s', $cd), date('m', $cd) + $mth, date('d', $cd) + $day, date('Y', $cd) + $yr));
        return $newdate;
    }

    function chkhashComma($str) {
        $len = strlen($str);
        $valid = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,.#_?/=&";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($str . " Contains invalid characters");
                throw $e;
            }
        }
        return true;
    }

    function chknum($fieldname,$str) {
        $len = strlen($str);
        $valid = "0123456789";
        for ($i = 0; $i < $len; $i++) {
            $chchar = substr($str, $i, 1);
            $pos = strpos($valid, $chchar);
            if ($pos === false) {
                $e = new Exception($fieldname . " Contains invalid integer");
                throw $e;
            }
        }
        return true;
    }

}

?>
