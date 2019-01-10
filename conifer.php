<?php
//抑制所有错误信息
//error_reporting(0); 
//语言强制
@header("content-Type: text/html; charset=utf-8"); 
//定义当前的目录绝对路径
define('DIR', dirname(__FILE__));
//加载这个文件
require DIR . '/conifer/conifer.php';
//采用`命名空间`的方式注册。php 5.3 加入的
//也必须是得是static静态方法调用，然后就像加载namespace的方式调用，注意：不能使用use
spl_autoload_register("\\conifer\\loading::autoload"); 
?>