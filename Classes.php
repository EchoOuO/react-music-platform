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

?>