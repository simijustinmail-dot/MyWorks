<?php

class Logger {

    private $conObj;

    function __construct($conn) {
        $this->conObj = $conn;
    }

    public function autoLog($userId, $sql, $params = [], $tableName = null, $recordIds = null,$action=null) {

        $actionType = $this->getActionType($sql);
        $ipAddress  = $this->getClientIp();

        // Normalize SQL template
        $cleanSql = preg_replace('/\s+/', ' ', trim($sql));

        $queryData = [
            "query"  => $cleanSql,
            "params" => $params
        ];

        // Encode JSON
        $jsonData = json_encode($queryData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

        $query = "
            INSERT INTO public.user_action_log (
                user_id,
                action_type,
                action_table,
                record_ids,
                ip_address,
                action_time,
                query_data,
				action_desc
            ) VALUES (
                $1, $2, $3, $4, $5, NOW(), $6::json,$7
            )
        ";

        $result = pg_query_params(
            $this->conObj,
            $query,
            [
                $userId,
                $actionType,
                $tableName,
                $recordIds,
                $ipAddress,
                $jsonData,
				$action
            ]
        );

       return $result;
    }

    private function getActionType($sql) {
        $sql = trim(strtoupper($sql));
        if (strpos($sql, 'INSERT') === 0) return 'INSERT';
        if (strpos($sql, 'UPDATE') === 0) return 'UPDATE';
        if (strpos($sql, 'DELETE') === 0) return 'DELETE';
        return 'QUERY';
    }

    private function getClientIp() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];//explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        } else {
            return $_SERVER['REMOTE_ADDR'];
        }
    }
}

?>
