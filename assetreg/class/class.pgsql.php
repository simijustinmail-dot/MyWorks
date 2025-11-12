<?php
	//if (class_exists('dbLayer'))
	//{
	    class dbConnect
	    {
	        var $c_link;
			function __construct($sqlserver, $sqluser, $sqlpassword, $database, $persistency = true)
			{
				$this->persistency = $persistency;
				$this->user = $sqluser;
				$this->password = $sqlpassword;
				$this->server = $sqlserver;
				$this->dbname = $database;
				$this->c_link = ($this->persistency) ? $this->db_connect($this->server, $this->user, $this->password,$this->dbname ) : $this->db_connect($this->server, $this->user, $this->password, $this->dbname );
			}
			
			function get_connection_string($host,$user,$password,$database)
	        {
	            $str = '';
	            $port = false;
	             
	            if ($host)
	            {
	                if (strpos($host,':') !== false) {
	                    $bits = explode(':',$host);
	                    $host = array_shift($bits);
	                    $port = abs((integer) array_shift($bits));
	                }
	                $str .= "host = '".addslashes($host)."' ";
	                 
	                if ($port) {
	                    $str .= 'port = '.$port.' ';
	                }
	            }
	            if ($user) {
	                $str .= "user = '".addslashes($user)."' ";
	            }
	            if ($password) {
	                $str .= "password = '".addslashes($password)."' ";
	            }
	            if ($database) {
	                $str .= "dbname = '".addslashes($database)."' ";
	            }
				return $str;
	        }
	         
	        function db_connect($host,$user,$password,$database)
	        {
	            if (!function_exists('pg_connect')) {
	                throw new Exception('PHP PostgreSQL functions are not available');
	            }
	             
	            $str = $this->get_connection_string($host,$user,$password,$database);
	            if (($this->c_link = @pg_connect($str)) === false) {
	                throw new Exception('Unable to connect to database');
	            }
	            return $this->c_link;
	        }
	         
	        function db_pconnect($host,$user,$password,$database)
	        {
	            if (!function_exists('pg_pconnect')) {
	                throw new Exception('PHP PostgreSQL functions are not available');
	            }
	             
	            $str = $this->get_connection_string($host,$user,$password,$database);
	             
	            if (($this->c_link = @pg_pconnect($str)) === false) {
	                throw new Exception('Unable to connect to database');
	            }
	             
	            return $this->c_link;
	        }
	         
	        function db_close($handle)
	        {
	            if (is_resource($handle)) {
	                pg_close($handle);
	            }
	        }
	         
	        function db_version($handle)
	        {
	            if (is_resource($handle))
	            {
	                return pg_parameter_status($handle,'server_version');
	            }
	            return null;
	        }
	         
	        function db_query($handle,$query)
	        {
				if (is_resource($handle))
	            {
	                $res = @pg_query($handle,$query);					
	                if ($res === false) {
	                    $e = new Exception($this->db_last_error($handle));
	                    $e->sql = $query;
	                    throw $e;
	                }
                return $res;
	            }
	        }
	        
			function db_execute_prepared($handle, $stmt_name, $sql, $params) {
				
				if (is_resource($handle)) {
					// Prepare the statement
					try{
						if (!function_exists('pg_prepare'))
							throw new Exception('PHP PostgreSQL functions are not available');	
						$stmt = @pg_prepare($handle, $stmt_name, $sql);
						if (!$stmt) {
							throw new Exception("Error preparing statement: " . pg_last_error($handle));
						}
						$result = @pg_execute($handle, $stmt_name, $params);

						if (!$result) {
							$error_message = "Error executing statement: " . pg_last_error($handle);
							pg_free_result($result); // Free result if exists
							throw new Exception($error_message);
						}
					}
					catch(Exception $e) {
						echo 'Message: ' .$e->getMessage();
					}
				}
				return $result;
			}
	        function db_exec($handle,$query)
	        {
	            return $this->db_query($handle,$query);
	        }
	         
	        function db_num_fields($res)
	        {
	            if (is_resource($res)) {
	                return pg_num_fields($res);
	            }
	            return 0;
	        }
	         
	        function db_num_rows($res)
	        {
	            if (is_resource($res)) {
					return pg_num_rows($res);
	            }
	            return 0;
	        }
	         
	        function db_field_name($res,$position)
	        {
	            if (is_resource($res)) {
	                return pg_field_name($res,$position);
	            }
	        }
	         
	        function db_field_type($res,$position)
	        {
	            if (is_resource($res)) {
	                return pg_field_type($res,$position);
	            }
	        }
	         
	        function db_fetch_assoc($res)
	        {
    	            if (is_resource($res)) {
	                return pg_fetch_assoc($res);
	            }
	        }
			
			function db_fetch_array($res)
	        {
	            if (is_resource($res)) {
	                return pg_fetch_array($res);
	            }
	        }	
			
			function db_fetch_row($res)
	        {
	            if (is_resource($res)) {
	                return pg_fetch_row($res);
	            }
	        }		
			         
	        function db_result_seek($res,$row)
	        {
	            if (is_resource($res)) {
	                return pg_result_seek($res,(int) $row);
	            }
	            return false;
	        }
	         
         	function db_changes($handle,$res)
	        {
	            if (is_resource($handle) && is_resource($res)) {
	                return pg_affected_rows($res);
	            }
	        }
	         
	        function db_last_error($handle)
	        {
	            if (is_resource($handle)) {
	                return pg_last_error($handle);
	            }
	            return false;
	        }
	         
	        function db_escape_string($str,$handle=null)
	        {
	            return pg_escape_string($str);
	        }
	         
	        function db_write_lock($table)
	        {
	            $this->execute('BEGIN');
	            $this->execute('LOCK TABLE '.$this->escapeSystem($table).' IN EXCLUSIVE MODE');
	        }
	         
	        function db_unlock()
	        {
	            $this->execute('END');
	        }
	         
	        function vacuum($table)
	        {
	            $this->execute('VACUUM FULL '.$this->escapeSystem($table));
	        }
	         
	        function dateFormat($field,$pattern)
	        {
	            $rep = array(
	                '%d' => 'DD',
	                '%H' => 'HH24',
	                '%M' => 'MI',
	                '%m' => 'MM',
	                '%S' => 'SS',
	                '%Y' => 'YYYY'
	            );
	             
	            $pattern = str_replace(array_keys($rep),array_values($rep),$pattern);
	             
	            return 'TO_CHAR('.$field.','."'".$this->escape($pattern)."') ";
	        }
							 
	        /**
	        * Function call
	        *
	        * Calls a PostgreSQL function and returns the result as a {@link record}.
	        * After <var>$name</var>, you can add any parameters you want to append
	        * them to the PostgreSQL function. You don't need to escape string in
	        * arguments.
	        *
	        * @param string $name   Function name
	        * @return   record
	        */
	        function callFunction($name)
	        {
	            $data = func_get_args();
	            array_shift($data);
	             
	            foreach ($data as $k => $v)
	            {
	                if (is_null($v)) {
	                    $data[$k] = 'NULL';
	                } elseif (is_string($v)) {
	                    $data[$k] = "'".$this->escape($v)."'";
	                } elseif (is_array($v)) {
	                    $data[$k] = $v[0];
	                } else {
	                    $data[$k] = $v;
	                }
	            }
	             
	            $req =
	            'SELECT '.$name."(\n".
	            implode(",\n",array_values($data)).
	            "\n) ";
	             
	            return $this->select($req);
	        }
	    }
	//}
?>