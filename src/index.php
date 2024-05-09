<?php
// Allow requests from any origin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
header('Access-Control-Allow-Credentials: true');

// Respond to preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Should return HTTP 200 status code
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

require("./Classes.php");
require("./Function.php");

// Check connection to database
$db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
$db->connect();
$db->db_close();

try {
    $sid;
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Invalid request method!", 405);
    }
    $post_sid = json_decode(file_get_contents("php://input"), true);
    // print_r($post_sid);
    // 這邊沒東西QQ  ?????
    if (isset($post_sid["sid"])) {
        Session_Handler($post_sid["sid"]);
    }
    switch ($_SERVER["PATH_INFO"]) {
        case "/":
            // keys = bid?, exception: can't get key
            // return user data to frontend 
            $db->connect();
            $db_select_result = $db->select(["*"], "user_tb", null);
            // print_r($db_select_result);
            $output = [];
            while ($row = $db_select_result->fetch_assoc()) {
                array_push($output, $row);
            }
            $db->db_close();
            echo json_encode($output);

            break;
            
            case "/reg": // In Postman, sholud use raw not form-data to test
                // keys = uname, email, password, usertype, exception: can't get key
                // print_r($_POST);
                $data = json_decode(file_get_contents("php://input"), true);
                // print_r($data);
                check_key(["uname", "email", "pass", "image", "user", "artist", "admin"], $data);

                 // PHP + Database! Get data from database
                $dbObj = new DB(DB_SERVER_NAME,DB_USER,DB_PASSWORD,DB_NAME); // the order depends on the order in class
                $dbCon = $dbObj -> connect();
                // SELECT col_names or * from user WHERE condition
                $selectCmd = "SELECT email FROM user_tb WHERE email = '".$data["email"]."'";
                $result = $dbCon->query($selectCmd);  // must use variable
                if($result->num_rows > 0){
                    $dbObj->db_close();
                    Audit_generator("Registration","Failure","User email already exist.",$data["email"]);
                    throw new Exception("Registration Failed!", 406);
                }
                $pass = password_hash($data["pass"],PASSWORD_BCRYPT,["cost"=>10]);

            $insertCmd = $dbCon->prepare("INSERT INTO user_tb (uname, email, password, image, user, artist, admin) VALUES (?,?,?,?,?,?,?)");
            $insertCmd->bind_param("ssssiii", $data["uname"], $data["email"], $pass, $data["image"], $data["user"], $data["artist"], $data["admin"]); // define datatype, s = string ; i = integer ; d decimal ; b = blob ...
            $insertCmd->execute();

                $dbObj->db_close();
                Audit_generator("Registration","Success","User registered.",$data["email"]);
                sendHttp_Code(201,"User added!");
            break;

        case "/login":
            // session_start();

            $data = json_decode(file_get_contents("php://input"), true);
            // print_r($data);

                try {
                    check_key(["email", "password"], $data);
                    $db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
                    $db->connect();
    
                    $userObj = new User($data["email"], $db);
                    if ($sid = $userObj->authenticate($data["password"])) {
                        // Session_Handler($sid);
                        // echo $sid;
                        sendHttp_Code(200,$sid);
                    } else {
                        sendHttp_Code(200,"Login failed!");
                    }
                } catch (Exception $e) {
                    echo "Error: " . $e->getMessage();
                }
                // $db->db_close();
            break;

            // 這邊還有問題，為啥事回傳 music data = =..... ?????
            // case "/loginid":
            //     print_r($_SESSION);
            //     echo session_id();
            // break;

        case "/allmusic":
            // keys = bid?, exception: can't get key
            $db->connect();
            $db_select_result = $db->select(["*"], "music_tb", null);
            // print_r($db_select_result);
            $output = [];
            while ($row = $db_select_result->fetch_assoc()) {
                array_push($output, $row);
            }
            $db->db_close();
            echo json_encode($output);
            break;

        case "/allartist":
            // keys = aid?, exception: can't get key
            $db->connect();
            $db_select_result = $db->select(["*"], "artist_tb", null);
            // print_r($db_select_result);
            $output = [];
            while ($row = $db_select_result->fetch_assoc()) {
                array_push($output, $row);
            }
            $db->db_close();
            echo json_encode($output);
            break;

        case "/adminpage":
            // keys = sid or check session_status(), exception: can't get key, forbiden request
            // if(session_status()===PHP_SESSION_NONE) throw new Exception("Forbiden request.",401);
            break;

        case "/userpage":
            // if(session_status()===PHP_SESSION_NONE) throw new Exception("Forbiden request.",401);
            break;

        case "/artistpage":
            // if(session_status()===PHP_SESSION_NONE) throw new Exception("Forbiden request.",401);
            break;

        case "/upload":
            // if(session_status()===PHP_SESSION_NONE) throw new Exception("Forbiden request.",401);
            break;

        case "/admin/addMusic":
            if (session_status() === PHP_SESSION_NONE) throw new Exception("Forbiden request.", 401);
            $isAdmin = $_SESSION["admin"];
            if (!$isAdmin) throw new Exception("Forbiden request.", 401);
            $data = json_decode(file_get_contents("php://input"), true);
            // print_r($data);
            check_key(["mname", "artist", "album", "description", "address", "image"], $data);

            $db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
            $db->connect();
            $insertCmd = $db->prepare("INSERT INTO music_tb (mname, album, description, address, image) VALUES (?,?,?,?,?)");
            $insertCmd->bind_param("sssss", $data["mname"], $data["album"], $data["description"], $data["address"], $data["image"]);
            $insertCmd->execute();
            $db->db_close();
            sendHttp_Code(201, "Music added!");
            break;

        case "/admin/removeMusic":
            // keys = mid, exception: can't get key
            if (session_status() === PHP_SESSION_NONE) throw new Exception("Forbiden request.", 401);
            $isAdmin = $_SESSION["admin"];
            if (!$isAdmin) throw new Exception("Forbiden request.", 401);
            $data = json_decode(file_get_contents("php://input"), true);
            // print_r($data);
            check_key(["mid"], $data);

            $db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
            $db->connect();
            $deleteCmd = $db->prepare("DELETE FROM music_tb WHERE mid = ?");
            $deleteCmd->bind_param("i", $data["mid"]);
            $deleteCmd->execute();
            $db->db_close();
            sendHttp_Code(200, "Music removed!");
            break;

        case "/admin/modifyMusic":
            if (session_status() === PHP_SESSION_NONE) throw new Exception("Forbiden request.", 401);
            $isAdmin = $_SESSION["admin"];
            if (!$isAdmin) throw new Exception("Forbiden request.", 401);
            $data = json_decode(file_get_contents("php://input"), true);
            // print_r($data);
            check_key(["mid", "mname", "artist", "album", "description", "address", "image"], $data);

            $db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
            $db->connect();
            $updateCmd = $db->prepare("UPDATE music_tb SET mname = ?, artist = ?, album = ?, description = ?, address = ?, image = ?,  WHERE mid = ?");
            $updateCmd->bind_param("ssssss", $data["mname"], $data["artist"], $data["album"], $data["description"], $data["address"], $data["image"]);
            $updateCmd->execute();
            $db->db_close();
            sendHttp_Code(200, "Music modified!");
            break;

            case "/audit":
                
            break;

        default:
            throw new Exception("Invalid path", 400);
    }
} catch (Exception $err) {
    sentHttpCode($err->getCode(), $err->getMessage());
}
