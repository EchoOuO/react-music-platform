<?php 
    // Allow requests from any origin - not recommended for production
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
    $db = new DB(DB_SERVER_NAME,DB_USER,DB_PASSWORD,DB_NAME);
    $db->connect();
    $db->db_close();

    try{
        if($_SERVER["REQUEST_METHOD"]!="POST"){
            throw new Exception("Invalid request method!",405);
        }
        if(isset($_POST["sid"])){
            Session_Handler($_POST["sid"]);
        }
        switch($_SERVER["PATH_INFO"]){
            case "/":
                // retrieve data from database (music / artist), exception: can't get data
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
                    // Audit_generator("registeration","failed","User email already exists",$_POST["email"]);
                    throw new Exception("Registration Failed!", 406);
                }
                $pass = password_hash($data["pass"],PASSWORD_BCRYPT,["cost"=>10]);

                $insertCmd = $dbCon->prepare("INSERT INTO user_tb (uname, email, password, image, user, artist, admin) VALUES (?,?,?,?,?,?,?)");
                $insertCmd->bind_param("ssssiii", $data["uname"], $data["email"], $pass, $data["image"], $data["user"], $data["artist"], $data["admin"]); // define datatype, s = string ; i = integer ; d decimal ; b = blob ...
                $insertCmd->execute();

                $dbObj->db_close();
                // Audit_generator("Registration","Success","User Registered",$_POST["email"]);
                sendHttp_Code(201,"User added!");
            break;

            // case "/login":
                // keys = email, password, exception: can't get key
            // break;

            case "/allmusic":
                // keys = bid?, exception: can't get key
                $db->connect();
                $db_select_result = $db->select(["*"],"music_tb",null);
                // print_r($db_select_result);
                $output = [];
                while($row = $db_select_result->fetch_assoc()){
                    array_push($output,$row);
                }
                $db->db_close();
                echo json_encode($output);
            break;

            case "/allartist":
                // keys = aid?, exception: can't get key
                $db->connect();
                $db_select_result = $db->select(["*"],"artist_tb",null);
                // print_r($db_select_result);
                $output = [];
                while($row = $db_select_result->fetch_assoc()){
                    array_push($output,$row);
                }
                $db->db_close();
                echo json_encode($output);
            break;

            // case "/admin":
                // keys = sid or check session_status(), exception: can't get key, forbiden request
            // break;

            // case "/userpage":
                // keys = sid or check session_status(), exception: can't get key, forbiden request
            // break;

            // case "/artist":
                // keys = sid or check session_status(), exception: can't get key, forbiden request
            // break;

            default:
                throw new Exception("Invalid path",400);
        }
    }catch(Exception $err){
        sentHttpCode($err->getCode(),$err->getMessage());
    }
?>