<?php
namespace Mode;

use Mode\dbs;

 class  dbMySQL implements dbs
 {

    protected static $_dbh;
    protected $server = '127.0.0.1';
    protected $user = 'root';
    protected $pwd = 'root';
    protected $dbName = 'test';
    protected $_pconnect = true;
    protected $_sql = false;
    protected $_clear = 0;
    protected $_where = '';
    protected $_order = '';
    protected $_limit = '';
    protected $_field = '*';

    /** 
    * 使用mysqli连接方式连接mysql
    * @return this 
    */
    public function __construct()
    {
        try 
        { 
            $dbh = mysqli_connect($this->server, $this->user, $this->pwd,$this->dbName);
        } catch (Exception $e) 
        { 
            die('Connection failed: ' . "连接MySQL失败：" .mysqli_connect_error());
        }
        $dbh->query("set names 'utf8';");
        self::$_dbh = $dbh;
    }

    /** 
    * 过滤数据
    * @param string $value 
    * @return string 
    */
    public function filter($value)
    {
        $value = strtr($value, ' ', '');
        $value = addslashes($value);
        return $value;
    }

    /** 
    * 添加字段表在缓存中
    * @param string $field 
    * @return this 
    */
    public function field($field)
    {
        if ($this->_clear>0) $this->_clear();
        if (is_string($field)) 
        {
            $field = explode(',', $field);
        }
        $nField = array_map(array($this,'_addChar'), $field);
        $this->_field = implode(',', $nField);
        return $this;
    }

    /** 
    * 缓存where的条件
    * @param string $option 
    * @return this 
    */
    public function where($option)
    {
        if ($this->_clear>0) $this->_clear();
        $this->_where = ' where ';
        $logic = 'and';
        if (is_string($option)) 
        {
            $this->_where .= $option;
        }
        elseif (is_array($option)) 
        {
            foreach($option as $k=>$v) 
            {
                if (is_array($v)) 
                {
                    $relative = isset($v[1]) ? $v[1] : '=';
                    $logic    = isset($v[2]) ? $v[2] : 'and';
                    $condition = ' ('.$this->_addChar($k).' '.$relative.' '.$v[0].') ';
                }
                else {
                    $logic = 'and';
                    $condition = ' ('.$this->_addChar($k).'='.$v.') ';
                }
                $this->_where .= isset($mark) ? $logic.$condition : $condition;
                $mark = 1;
            }
        }
        return $this;
    }

    /** 
    * 缓存排序的条件
    * @param string $option 
    * @return this 
    */
    public function order($option)
    {
      if ($this->_clear>0) $this->_clear();
        $this->_order = ' order by ';
        if (is_string($option)) 
        {
            $this->_order .= $option;
        }
        elseif (is_array($option)) 
        {
            foreach($option as $k=>$v){
                $order = $this->_addChar($k).' '.$v;
                $this->_order .= isset($mark) ? ','.$order : $order;
                $mark = 1;
            }
        }
        return $this;
    }

    /** 
    * 缓存limit条件
    * @param int $page int $pageSize 
    * @return this 
    */
    public function limit($page,$pageSize=null) 
    {
        if ($this->_clear>0) $this->_clear();
        if ($pageSize===null) 
        {
            $this->_limit = "limit ".$page;
        }
        else {
            $pageval = intval( ($page - 1) * $pageSize);
            $this->_limit = "limit ".$pageval.",".$pageSize;
        }
        return $this;
    }

    /** 
    * 字段和表名添加 `符号
    * 保证指令中使用关键字不出错 针对mysql 
    * @param string $value 
    * @return value 
    */
    protected function _addChar($value) 
    { 
        if ('*'==$value || false!==strpos($value,'(') || false!==strpos($value,'.') || false!==strpos($value,'`')) 
        { 
            //如果包含* 或者 使用了sql方法 则不作处理 
        } elseif (false === strpos($value,'`') ) 
        { 
            $value = '`'.trim($value).'`';
        } 
        return $value; 
    }

    /**
    * 执行查询 主要针对 SELECT, SHOW 等指令
    * @param string $sql sql指令 
    * @return mixed 
    */
    protected function _doQuery($sql='') 
    {
        $this->_sql = $sql;
        $result = mysqli_query(self::$_dbh,$this->_sql); //prepare或者query 返回一个查询数据
        if ($result == false) {
            return $result;
        }else{
            mysqli_fetch_all($result,MYSQLI_ASSOC); 
        }
        // $pdostmt->execute();
        // $result = $pdostmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
     
    /** 
    * 执行语句 针对 INSERT, UPDATE 以及DELETE,exec结果返回受影响的行数
    * @param string $sql sql指令 
    * @return integer 
    */
    protected function _doExec($sql='') 
    {
        $this->_sql = $sql;
        return mysqli_query(self::$_dbh, $this->_sql);
    }

    /**
     * 查询函数
     * @param string $tbName 操作的数据表名
     * @return array 结果集
     */
    public function select($tbName='')
    {
        $sql = "select ".trim($this->_field)." from ".$tbName." ".trim($this->_where)." ".trim($this->_order)." ".trim($this->_limit);
        $this->_clear = 1;
        $re = $this->_doQuery(trim($sql));
        $this->_clear();
        return $re;
    }

    /** 
    * 执行sql语句，自动判断进行查询或者执行操作 
    * @param string $sql SQL指令 
    * @return mixed 
    */
    public function doSql($sql='') 
    {
        $queryIps = 'INSERT|UPDATE|DELETE|REPLACE|CREATE|DROP|LOAD DATA|SELECT .* INTO|COPY|ALTER|GRANT|REVOKE|LOCK|UNLOCK'; 
        if (preg_match('/^\s*"?(' . $queryIps . ')\s+/i', $sql)) 
        { 
            return $this->_doExec($sql);
        }
        else {
            //查询操作
            return $this->_doQuery($sql);
        }
    }

    /** 
    * 取得数据表的字段信息 
    * @param string $tbName 表名
    * @return array 
    */
    protected function _tbFields($tbName) 
    {
        $sql = 'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME="'.$tbName.'" AND TABLE_SCHEMA="'.$this->_dbName.'"';
        $stmt = self::$_dbh->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $ret = array();
        foreach ($result as $key=>$value) 
        {
            $ret[$value['COLUMN_NAME']] = 1;
        }
        return $ret;
    }

    /** 
    * 过滤并格式化数据表字段
    * @param string $tbName 数据表名 
    * @param array $data POST提交数据 
    * @return array $newdata 
    */
    protected function _dataFormat($tbName,$data) 
    {
        if (!is_array($data)) return array();
        $table_column = $this->_tbFields($tbName);
        $ret=array();
        foreach ($data as $key=>$val) 
        {
            if (!is_scalar($val)) continue; //值不是标量则跳过
            if (array_key_exists($key,$table_column)) 
            {
                $key = $this->_addChar($key);
                if (is_int($val)) 
                { 
                    $val = intval($val); 
                } elseif (is_float($val)) 
                { 
                    $val = floatval($val); 
                } elseif (preg_match('/^\(\w*(\+|\-|\*|\/)?\w*\)$/i', $val)) 
                {
                    // 支持在字段的值里面直接使用其它字段 ,例如 (score+1) (name) 必须包含括号
                    $val = $val;
                } elseif (is_string($val)) 
                { 
                    $val = '"'.addslashes($val).'"';
                }
                $ret[$key] = $val;
            }
        }
        return $ret;
    }

    /**
     * 添加函数
     * @param string $tbName 操作的数据表名
     * @param array $data 操作的数据
     * @return array 结果集
     */
    public function insert($tbName,$data)
    {
        $data = $this->_dataFormat($tbName,$data);//过滤数据与字段
        if (!$data) return;
        $sql = "insert into ".$tbName."(".implode(',',array_keys($data)).") values(".implode(',',array_values($data)).")";
        return $this->_doExec($sql);
    }

    /**
     * 修改函数
     * @param string $tbName 操作的数据表名
     * @param array $data 操作的数据
     * @return array 结果集
     */
    public function update($tbName,$data)
    {

        $data = $this->_dataFormat($tbName,$data);
        if (!$data) return;
        $valArr = '';
        foreach($data as $k=>$v){
            $valArr[] = $k.'='.$v;
        }
        $valStr = implode(',', $valArr);
        $sql = "update ".trim($tbName)." set ".trim($valStr)." ".trim($this->_where);
        return $this->_doExec($sql);
    }

    /**
     * 删除函数
     * @param string $tbName 操作的数据表名
     * @return array 结果集
     */
    public function delect($tbName,$data)
    {

    } 

    protected function _clear() 
    {
        $this->_where = '';
        $this->_order = '';
        $this->_limit = '';
        $this->_field = '*';
        $this->_clear = 0;
    }
}
?>