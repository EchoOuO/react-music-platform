<?php
require("./config.php");

class DB{
    private $db_hostName;
    private $db_userName;
    private $db_password;
    private $db_name;
    private $db_connect;
    function __construct($db_hostName,$db_userName,$db_password,$db_name)
    {
        $this->db_hostName = $db_hostName;
        $this->db_name = $db_name;
        $this->db_password = $db_password;
        $this->db_userName = $db_userName;
    }
    function connect(){
        $dbCon = new mysqli($this->db_hostName, $this->db_userName, $this->db_password, $this->db_name);
        if($dbCon -> connect_error){
            throw new Exception("Connection failed: ".$dbCon->connect_error, 500);
        }
        // echo("connected!");
        $this->db_connect = $dbCon;
        return $dbCon;
    }
    function db_close(){
        $this->db_connect->close();
    }
    function insert($table_name, $values_array, $columns_array = null){
        if($columns_array != null){
            $columns_part = "(".implode(",",$columns_array).")";
        }else{
            $columns_part = '';
        }
        $values_part = "(".implode(",",$values_array).")";

        $insertCmd = "INSERT INTO $table_name $columns_part VALUES $values_part";

        // echo "<br>".$insertCmd."<br>";

        if($this->db_connect->query($insertCmd) === TRUE){
            return true;
        }
        throw new Exception("Insert Data Error", 500);
    }
    function select($columns_array, $table_name, $condition){  

        if($columns_array != null && count($columns_array) > 1){
            $columns_part = "(".implode(",",$columns_array).")";
        }else{
            $columns_part = implode(",",$columns_array);
        }
        
        if($condition){
            $condition_part = "'".$condition."'";
            $selectCmd = "SELECT $columns_part FROM $table_name WHERE $condition_part";
        }else{
            $selectCmd = "SELECT $columns_part FROM $table_name";
        }

        // print_r($selectCmd);

        if($this->db_connect->query($selectCmd)){
            $result = $this->db_connect->query($selectCmd);
            return $result;
        }else{
            throw new Exception("Server problem!",500);
        }
    }


    public function prepare($query) {
        if ($this->db_connect) {
            return $this->db_connect->prepare($query);
        }
        throw new Exception("Database connection not established.");
    }
}
class fileUplaod{
    private $srcFile; // user's request, $_FILES["file1"], just lije $_POST["key1"]
    private $destAddr;
    private $sizeCap;
    function __construct($srcFile,$destAddr,$sizeCap)
    {
        $this->srcFile = $srcFile;
        $this->destAddr = $destAddr."/".$this->srcFile["name"];
        $this->sizeCap = $sizeCap;
    }
    private function fileSize(){
        if($this->srcFile["size"] > $this->sizeCap){  // if file doesn't oversize
            throw new Exception("File size is larger than ".$this->sizeCap,413);
        }
    }
    private function ext_Chk(){
        $contType = substr($this->srcFile["type"],0,stripos($this->srcFile["type"],"/")); // get file type before "/" ; Validates the file extension against a set of allowed extensions based on the file's MIME type. Extracts the general type (e.g., image, application) from the MIME type of the file.
        // MIME???
        $extArray = null;
        switch($contType){
            case "image":
                $extArray = ["jpeg","jpg","png","bmp"];
            break;
            case "application":
                $extArray = ["json"];
            break;
            default:
                throw new Exception("Invalid file type", 403);
        }
        $finfo = new finfo(FILEINFO_MIME_TYPE);  // 為啥?????
        // FILEINFO_MIME_TYPE constant tells the object to return the MIME type of the file, which is useful for validating file types securely, rather than relying on the extension alone. MIME = type/subtype
        // print_r(basename($finfo->file($_FILES["file1"]["tmp_name"])));
        
        // get data (basename will get the name after /)
        // basename() is then used to extract the base component of the pathname, which should return the extension derived from the MIME type analysis. 
        // The file() method of the finfo class is used to read the MIME type directly from the file. 
        // "tmp_name"????
        $realExt = basename($finfo->file($this->srcFile["tmp_name"]));

        // Checking if the Extracted MIME Type is in the Allowed Extensions Array
        if(!(false === array_search($realExt, $extArray))){
            return true;
        }
        throw new Exception("Invalid file type",403);
    }
    function commitUpload(){
        $this->fileSize();
        $this->ext_Chk();
        if(!move_uploaded_file($this->srcFile["tmp_name"],$this->destAddr)){
            throw new Exception("Failed to upload",500);
        }
        // echo $this->srcFile["name"]." Uploaded!";

        // get address like this
        // http://127.0.0.1/webdev/0422_assignment/library_system (1)_db/library_system/data/userFiles/book1.png
        // $_SERVER["REQUEST_SCHEME"] --> http
        // $_SERVER["SERVER_ADDR"] --> 127.0.0.1
        // $_SERVER["SCRIPT_NAME"] --> /webdev/0422_assignment/library_system (1)_db/library_system/index.php
        // destAddr --> ./data/userFiles
        // .substr($this->destAddr,2) --> ignore ./ --> data/userFiles
        $destAddr = $_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_ADDR"].substr($_SERVER["SCRIPT_NAME"],0,stripos($_SERVER["SCRIPT_NAME"],"index.php")).substr($this->destAddr,2);
        return $destAddr;
    }
}


class User {
    private $id;
    private $db;
    private $uname;
    private $email;

    public function __construct($email, $db) {
        $this->email = $email;
        $this->db = $db;
    }
    
    function authenticate($pass) {

        $dbObj = new DB(DB_SERVER_NAME,DB_USER,DB_PASSWORD,DB_NAME);
        $dbCon = $dbObj->connect();

        if (!isset($_SESSION['attempt_count'])) {
            $_SESSION['attempt_count'] = 0;
            $_SESSION['last_attempt_time'] = time();  
        }

        // print_r($this);

        if ($_SESSION['attempt_count'] >= ATTEMPT_LIMIT) {
            if ((time() - $_SESSION['last_attempt_time']) < 300) {
                Audit_generator("Login", "Failed", "Too many attempts", $this->email);
                throw new Exception("Login failed due to too many attempts. Please try again later.");
            } else {
                $_SESSION['attempt_count'] = 0;
                $_SESSION['last_attempt_time'] = time();
            }
        }

        $query = "SELECT * FROM user_tb WHERE email = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("s", $this->email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result -> fetch_assoc();
        // print_r($result);

        if($result->num_rows > 0) {  
             // fetch_assoc() return one row as associated array, access value by keys
            // print_r($row);
            $attempt = $row['attempt'];
            if($row['attempt'] == 0){
                Audit_generator("login","failed","User account locked.",$this->email);
                throw new Exception("There is a problem logging in, please contact the system admin.",401);
            }
            if(password_verify($pass,$row['password'])){
                $loginFlag = true;
                $attempt = 5;
                $this->uname = $row['uname'];
                $this->email = $row['email'];
                $this->id = $row['uid'];
                session_start();
                $_SESSION["login_user"] = $this;
                $_SESSION["admin"] = $row['admin'];
                $_SESSION["time_out"] = time() + TIME_OUT;
                // $_SESSION["session_id"] = session_id();
                // print_r($_SESSION);
                Audit_generator("Login","Success","User log in via correct email and password.",$this->email);
            }else{
                $attempt -= 1;
                $loginFlag = "pass";
                sendHttp_Code(401,"Username/Password Wrong. ");
                Audit_generator("Login","Failure","User log in with wrong email or password.",$this->email);
            }
            // UPDATE [table_name] SET [col_name] = new value, [col_name2] = new value2, .... WHERE condition
            $updateCmd = "UPDATE user_tb SET attempt = $attempt WHERE uid=".$row['uid'];
            $dbCon->query($updateCmd); // use $dbCon for query
            $dbObj->db_close(); // $dbObj is main source of connect, so use $dbOjb to close main source of connection
        }else {
            $loginFlag = "email"; // 會觸發下面的 exception
        }

        if(!$loginFlag){ // if $loginFlag is not "true", which means user log in succeed
            switch($loginFlag){
                case "email":
                    Audit_generator("login","failed","Invalid email address.",$this->email);
                    throw new Exception("Username/Password Wrong. ",401);
                    break;
                case "pass":
                    Audit_generator("login","failed","Invalid password. Attempts(".$attempt.")",$this->email);
                    throw new Exception("Username/Password Wrong. ",401);
                break;
            } 
        }
        // return session_id();

        // Remove password from the retuned user VINICIUS
        unset($row['password']);
        return [
            //key => value
            "sessionId"=>session_id(),
            "loggedUser"=>$row
        ];
    }
}

class jsonUpload{
    private $src_addr;
    private $file_addr;
    function __construct($src_addr)
    {
        $this->src_addr = $src_addr;    
    }
    function music($file_name){
        $this->file_addr = $this->src_addr."/$file_name";
        $file = fopen($this->file_addr,"r") or die("unable to open the file.");
        $data = fread($file, filesize($this->file_addr));
        $data = json_decode($data);

        $db = new mysqli(DB_SERVER_NAME,DB_USER,DB_PASSWORD,DB_NAME);
        if ($db->connect_error){  //connect_error, return error string or null
            die("Connection error.");
        }
        foreach($data as $item){
            $insertCmd = $db->prepare("INSERT INTO music_tb (mid, mname, artist, album, description, address, image) VALUES (?,?,?,?,?,?,?)");
            $insertCmd->bind_param("issssss",$item->mid,$item->mname,$item->artist,$item->album,$item->description,$item->address,$item->image);
            $insertCmd->execute();
        }
        echo("uploaded!");
        $db->close();
    }

    function artist($file_name){
        $this->file_addr = $this->src_addr."/$file_name";
        $file = fopen($this->file_addr,"r") or die("unable to open the file.");
        $data = fread($file, filesize($this->file_addr));
        $data = json_decode($data);

        $db = new mysqli(DB_SERVER_NAME,DB_USER,DB_PASSWORD,DB_NAME);
        if ($db->connect_error){  //connect_error, return error string or null
            die("Connection error.");
        }
        foreach($data as $item){
            $insertCmd = $db->prepare("INSERT INTO artist_tb (aid, aname, description, image) VALUES (?,?,?,?)");
            $insertCmd->bind_param("isss",$item->aid,$item->artist,$item->description,$item->image);
            $insertCmd->execute();
        }
        echo("uploaded!");
        $db->close();
    }

    function user($file_name){
        $this->file_addr = $this->src_addr."/$file_name";
        $file = fopen($this->file_addr,"r") or die("unable to open the file.");
        $data = fread($file, filesize($this->file_addr));
        $data = json_decode($data);

        $db = new mysqli(DB_SERVER_NAME,DB_USER,DB_PASSWORD,DB_NAME);
        if ($db->connect_error){  //connect_error, return error string or null
            die("Connection error.");
        }
        foreach($data as $item){
            $insertCmd = $db->prepare("INSERT INTO user_tb (uid, uname, email, password, image, user, artist, admin) VALUES (?,?,?,?,?,?,?,?)");
            $insertCmd->bind_param("issssiii",$item->uid,$item->uname,$item->email,$item->password,$item->image,$item->user,$item->artist,$item->admin);
            $insertCmd->execute();
        }
        echo("uploaded!");
        $db->close();
    }
}
class PlaylistManage{
    private $db;
   
  
    public function __construct() {
        $this->db = new DB(DB_SERVER_NAME, DB_USER, DB_PASSWORD, DB_NAME);
        $this->db->connect();
    }

 
    public function addMusicToPlaylist($uid, $mid) {
        try {
            $addPli = $this->db->prepare("INSERT INTO playlist_tb (uid, mid) VALUES (?, ?)");
           $addPli->execute([$uid,$mid]);
           echo "Music added to playlist";
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }
    public function getPlaylistByUserId($uid) {
        $query = "SELECT music_tb.* FROM playlist_tb JOIN music_tb ON playlist_tb.mid = music_tb.mid WHERE playlist_tb.uid = ?";
        $getPli = $this->db->prepare($query);
        $getPli->bind_param("i",$uid);
        $getPli->execute();
        $result=$getPli->get_result();
        $playlist=[];

        while($row=$result->fetch_assoc()){
            $playlist[]=$row;
        }
        return $playlist;
    }
    public function removeMusicFromPlaylist($uid,$mid){
        $query = "DELETE FROM playlist_tb WHERE uid = ? AND mid = ?";
        $removepli = $this->db->prepare($query);
        $removepli->bind_param("ii", $uid, $mid); 
        if ($removepli->execute()) {
            echo "Music removed successfully from playlist.";
        } else {
            echo "Error";
        }
    }
}
   
?>