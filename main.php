<?php
include_once  "conifer.php";
if ($_SESSION['id']=="") {
    include "view/login.html";//登录页面
}else{
    include "view/main.html";//主页面
}


?>