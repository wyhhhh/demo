<?php
namespace ajax;

use Mode\dbMySQL;

$mysql = new dbMySQL();
if($_POST){
	$mysql = new dbMySQL();
	$date=$_POST;
    //封装mysql调用
    // SELECT id FROM t_user_login WHERE name='name' AND password='pwd'
    $date['id']=substr(date("Ymdhis"),2).rand(10,99);
    $date['attest']=0;
	$res = $mysql->insert('t_user_login',$date);
    if ($res) {
        return 1;
    }else{
        return 0;
    }
}
?>