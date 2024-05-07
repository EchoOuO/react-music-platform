<?php 
    // require("./config.php");

    function Session_Handler($sid){
        session_id($sid);
        session_start();
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
?>