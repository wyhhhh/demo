<?php
namespace ajax;

include_once  "../conifer.php";
use Mode\dbMySQL;
use Mode\dbRedis;

if (isset($_POST['name'])&&isset($_POST['password'])) {

    $mysql = new dbMySQL();
	$redis = new dbRedis();

	$session_id=session_id();
	$id_num = $redis->data('string')->select($session_id);

	if ($id_num > 3) {echo "错误次数太多，账户冻结3分钟";}//请求次数过多
	
    $pwd = crypt($_POST['password'], 'hhh');
	$res = $mysql-> field(array('id','password','type','attest'))
	             -> where(array('name' => $_POST['name']))
	             -> select('t_user_login');
    if ($res[0]['password'] == $pwd&&$res[0]['attest']!="0") {
        $_SESSION['id'] = $res[0]['id'];
        $_SESSION['type'] = $res[0]['type'];
        echo "1";
    }
    else
    {
    	if ($id_num) 
    	{
    		$redis->incr($session_id);
    	}else{
    		$redis->data("string")->insert(array($session_id=>1));
    		$redis->expire($session_id,60*3); //缓存3分钟内错误次数
    	}
    
        echo "账户或密码错误";
    }
}
?>