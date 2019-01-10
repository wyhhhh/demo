<?php
namespace Mode;

use Mode\dbs;

 class dbRedis implements dbs
 {

    protected static $_dbh;
    protected $server = '127.0.0.1';
    protected $db = '6379';
    protected $data = ''; 
    protected $_limit0 = null;
    protected $_limit1 = null;
    protected $_clear = 0;
    protected $_key = null;
    protected $right = 0;
    protected $expire = null;

    public function __construct(){$this->_connect();}

    /** 
    * 自增
    * @return this 
    */
    public function incr($str) 
    {
        return self::$_dbh->incr($str);
    } 

    /** 
    * 设置缓存时间
    * @return this 
    */
    public function expire($time) 
    {
        $this->expire = $time;
        return $this;
    }     

    /** 
    * 清除缓存
    * @return this 
    */
    protected function _clear() 
    {
        $this->data = '';
        $this->_limit0 = null;
        $this->_limit1 = null;
        $this->_clear = 0;
        $this->_key = null; 
        $this->right = 0;
        $this->expire = null;

    }   

    /** 
    * 选择数据类型
    * @param string $string 
    * @return this 
    */
    public function data($string) 
    {
        if ($this->_clear>0) $this->_clear();
        switch ($string) 
        {
            case 'string':
                $this->data = 1;
                break;
            case 'list':
                $this->data = 2;
                break;
            case 'hash':
                $this->data = 3;
                break;
            case 'set':
                $this->data = 4;
                break;
            case 'zset':
                $this->data = 5;
                break;            
            default:
                die('Connection failed: 数据类型错误');
                break;
        }
        return $this;
    }   

    /** 
    * 使用短链接方式连接Redis
    * @return this 
    */
    public function _connect(){
        try { 
            $dbh = NEW \Redis();
            $dbh->connect($this->server,$this->db);
        } catch (Exception $e) 
        { 
            die('Connection failed: ' . $e->getMessage());
        }
        self::$_dbh = $dbh;
    }

    /** 
    * 缓存key条件
    * @param string $str
    * @return this 
    */
    protected function key($str) 
    {
        if ($this->_clear>0) $this->_clear();
        $this->_key = $key;
        return $this;
    }

    /** 
    * 缓存limit条件
    * @param int $page int $pages 
    * @return this 
    */
    public function limit($page,$pages=null) 
    {
        if ($this->_clear>0) $this->_clear();
        if ($pages===null) 
        {
            $this->_limit0 = $page;
        }
        else {
            $this->_limit0 = $page;
            $this->_limit1 = $pags;
        }
        return $this;
    }

    /** 
    * 查询/多项查询
    * @param string array $data 
    * @return string 
    */
    public function select($data)
    {
        switch ($this->data) 
        {
            case '1'://字符串
                if (count($data) == 1) 
                {
                    $re = self::$_dbh->get($data);
                    $this->_key = $data;
                }
                else
                {
                    $re = self::$_dbh->mget($data);
                }
                break;
            case '2'://队列
                $this->_key = $data;
                if ($this->_limit1===null&&$this->_limit0!=null) 
                {
                    $re = self::$_dbh->lindex($this->_key,$this->_limit0);
                }
                elseif ($this->_limit0!=null) 
                {
                    $re = self::$_dbh->lrange($this->_key,$this->_limit0,$this->_limit1);
                }
                else
                {
                    $re = die('Connection failed: 队列未选择范围');
                }
                break;
            case '3'://哈希
                if ($this->_key===null) 
                    {die('Connection failed: 哈希未选择key');}
                if (count($data) == 1) 
                {
                    if ($data=='all') 
                    {
                        $re = self::$_dbh->hscan($this->_key);
                    }
                    $re = self::$_dbh->hget($this->_key,$data);
                }
                else
                {
                    $re = self::$_dbh->hmget($this->_key,$data);
                }
                break;
            case '4'://集合
                # code...
                break;
            case '5'://有序集合
                # code...
                break;
            default:
                die('Connection failed: 数据类型未选择');
                break;
        }
        if ($re&&$this->expire!=null&&(count($data) == 1||$this->data != 1)) 
        {
            self::$_dbh->expire($this->_key,$this->expire+rand(0,5));
        }
        $this->_clear = 1;
        $this->_clear();
        return $re;
    }

    /** 
    * right尾修改
    * @return this 
    */    
    protected function right(){
        $this->right = 1;
        return $this;
    }   
    /** 
    * 数据添加
    * @param array $array
    * @return string 
    */ 

    public function insert($data,$string='')
    {
        switch ($this->data) 
        {
            case '1'://字符串
                if (count($data) == 1) 
                {
                    $key = array_keys($data);
                    $this->_key = $key[0];
                    $re = self::$_dbh->set($this->_key,$data[$key[0]]);
                }else{
                    $re = self::$_dbh->mset($data);
                }
                break;
            case '2'://队列
                if ($this->right) 
                {
                    $re = self::$_dbh->rpushx($this->_key,$data);
                }else{
                    $re = self::$_dbh->lpushx($this->_key,$data);
                }
                break;
            case '3'://哈希
                if (count($data) == 1) 
                {
                    $key = array_keys($data);
                    $re = self::$_dbh->hset($this->_key,$key[0],$data[$key[0]]);
                }else{
                    $re = self::$_dbh->hmset($this->_key,$data);
                }
                break;
            case '4'://集合
                # code...
                break;
            case '5'://有序集合
                # code...
                break;
            default:
                die('Connection failed: 数据类型未选择');
                break;
        }
        if ($this->expire!=null) 
        {
            self::$_dbh->expire($this->_key,$this->expire+rand(0,5));
        }
        $this->_clear = 1;
        $this->_clear();
        return $re;
    }

    /** 
    * 数据修改
    * @param array $array
    * @return string 
    */   
    public function update($data,$string='')
    {
        switch ($this->data) 
        {
            case '1'://字符串
                $key = array_keys($data);
                $this->_clear = 1;
                return self::$_dbh->getset($key[0],$data[$key[0]]);
                break;
            case '2'://队列
                $key = array_keys($data);
                if (self::$_dbh->lset($this->_key,$key[0],$data[$key[0]]))
                {
                    $this->_clear = 1;
                    return 1;
                }
                break;
            case '3'://哈希
                if (count($data) == 1) 
                {
                    $key = array_keys($data);
                    $this->_clear = 1;
                    if (self::$_dbh->hset($this->_key,$key[0],$data[$key[0]])) 
                        {return 1;}
                }else{
                    $this->_clear = 1;
                    if (self::$_dbh->hmset($this->_key,$data)) 
                        {return 1;}
                }
                break;
            case '4'://集合
                # code...
                break;
            case '5'://有序集合
                # code...
                break;
            default:
                die('Connection failed: 数据类型未选择');
                break;
        }
        return 0;
    }
    public function delect($string,$array){

    }

    /** 
    * 过滤数据
    * @param string $value 
    * @return string 
    */
    public function filter($value){}
}

?>