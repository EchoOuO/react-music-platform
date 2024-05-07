<?php 

require("./Classes.php");

function check_key ($keys, $sourceData) {  
    foreach($keys as $key) {
        if (!array_key_exists($key, $sourceData)){
            return false;
        }
    }
    return true;
}

function sendHttpCode($code, $msg){
    http_response_code($code);
    echo ($msg);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // key = fname, lname, email, pass
    if (check_key(["fname"],$_POST) && check_key(["lname"],$_POST) && check_key(["email"],$_POST) && check_key(["pass"],$_POST)){
        $addr = "./data/user.json";

        // generate unique id for users
        $id = time();
        $userData = (['id'=>$id,'fname'=>$_POST['fname'],'lname'=>$_POST['lname'],'email'=>$_POST['email'],'pass'=>$_POST['pass']]);

        // create or over-write file 
        if(file_exists($addr)){
            $file = fopen($addr,"r");
            $data = json_decode(fread($file, filesize($addr)));
            fclose($file);
            array_push($data, $userData);
        }else {
            $data = array($userData);
        }
        $file = fopen($addr,"w");
        fwrite($file, json_encode($data));
        fclose($file);
        $msg = "Add user data succeed!";
        echo ($msg);
    }else {
        sendHttpCode(400,"Required keys don't exist.");
    }
}else{
    sendHttpCode(405,"Not allowed method");
}

?>