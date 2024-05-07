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
$db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
$db->connect();
$db->db_close();



try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Invalid request method!", 405);
    }
    if (isset($_POST["sid"])) {
        Session_Handler($_POST["sid"]);
    }
    switch ($_SERVER["PATH_INFO"]) {
        case "/":
            // retrieve data from database (music / artist), exception: can't get data
            break;

        case "/reg":
            // keys = uname, email, password, usertype, exception: can't get key
            check_key(["uname", "email", "pass"], $_POST);

            // PHP + Database! Get data from database
            $dbObj = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME); // the order depends on the order in class
            $dbCon = $dbObj->connect();
            // SELECT col_names or * from user WHERE condition
            $selectCmd = "SELECT email FROM user_tb WHERE email = '" . $_POST["email"] . "'";
            $result = $dbCon->query($selectCmd);  // must use variable
            if ($result->num_rows > 0) {
                $dbObj->db_close();
                // Audit_generator("registeration","failed","User email already exists",$_POST["email"]);
                sendHttp_Code(500, "Server problem!");
                throw new Exception("Registration Failed", 406);
            }
            $pass = password_hash($_POST["pass"], PASSWORD_BCRYPT, ["cost" => 10]);

            $insertCmd = $dbCon->prepare("INSERT INTO user_tb (uname, email, password, image, user, artist, admin) VALUES (?,?,?,?,?,?,?)");
            $insertCmd->bind_param("ssssiii", $_POST["uname"], $_POST["email"], $pass, $_POST["img"], $_POST["user"], $_POST["artist"], $_POST["admin"]); // define datatype, s = string ; i = integer ; d decimal ; b = blob ...
            $insertCmd->execute();

            $dbObj->db_close();
            // Audit_generator("Registration","Success","User Registered",$_POST["email"]);
            sendHttp_Code(201, "users added");
            break;


        case "/login":
            try {
                check_key(["email", "password"], $_POST);
                $db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
                $db->connect();

                $userObj = new User($_POST["email"], $db);
                if ($userObj->authenticate($_POST["password"])) {
                    echo "Login successful!";
                } else {
                    echo "Login failed";
                }
            } catch (Exception $e) {
                echo "Error: " . $e->getMessage();
            }
            $db->db_close();
            break;

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

        case "/upload":
            if (!isset($_FILES['jsonfile'])) {
                echo json_encode(["status" => "error", "message" => "No file uploaded"]);
                exit;
            }
            $file = $_FILES['jsonfile'];
            $jsonFileName = $file['name'];
            $tmpName = $file['tmp_name'];
            $destinationPath = "./data/" . $jsonFileName;

            if (!move_uploaded_file($tmpName, $destinationPath)) {
                echo json_encode(["Failed to move uploaded file."]);
                exit;
            }


            $jsonUploader = new jsonUpload("./data");

            try {
                switch ($jsonFileName) {
                    case "music.json":
                        $jsonUploader->music($jsonFileName);
                        break;
                    case "artist.json":
                        $jsonUploader->artist($jsonFileName);
                        break;
                    case "user.json":
                        $jsonUploader->user($jsonFileName);
                        break;
                    default:
                        throw new Exception("Unsupported file type", 400);
                }

                echo json_encode(["Data uploaded successfully"]);
            } catch (Exception $e) {
                http_response_code($e->getCode());
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
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
            throw new Exception("Invalid path", 400);
    }
} catch (Exception $err) {
    sentHttpCode($err->getCode(), $err->getMessage());
}
