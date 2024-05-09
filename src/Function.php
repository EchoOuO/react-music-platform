<?php 
    // require("./config.php");

    function Session_Handler($sid){
        session_id($sid);
        session_start();
        // print_r($_SESSION);
        if(isset($_SESSION["time_out"]) && $_SESSION["time_out"] > time()){
            $_SESSION["time_out"] = time() + TIME_OUT;
        }else{
            session_unset();
            session_destroy();
            throw new Exception("Session timed out! / doesn't exist",408);
        }
    }

    function sentHttpCode($code,$msg,$die_flag=false){
        http_response_code($code);
        if($die_flag){
            die($msg);
        }else{
            echo($msg);
        }
    }

    function check_key($keys,$sourceData){
        foreach($keys as $key){
            if(!array_key_exists($key,$sourceData)){
                throw new Exception("Invalid keys",400);
            }
        }
    }

    function sendHttp_Code($code,$msg,$die_flag = false){
        http_response_code($code);
        if($die_flag){
            die($msg);
        }else{
            echo($msg);
        }
    }

    function Audit_generator($eventType, $outcome, $detail, $userEmail="") {
        $aduit_column = ["detail","date","email","ip","type","outcome"];
        $aduit_value = ["'".$detail."'", "'".date("Y-m-d H:i:s ", $_SERVER["REQUEST_TIME"])."'", "'".$userEmail."'", "'".$_SERVER["REMOTE_ADDR"] . ":" . $_SERVER["REMOTE_PORT"]."'", "'".$eventType."'", "'".$outcome."'"];
        
        // $audit = date("Y-m-d H:i:s ", $_SERVER["REQUEST_TIME"]) . $_SERVER["REMOTE_ADDR"] . ":" . $_SERVER["REMOTE_PORT"] . " $userEmail $eventType $outcome $detail \n";
        
        $db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
        $db->connect();
        $db->insert("audit_tb", $aduit_value, $aduit_column);
    }
?>