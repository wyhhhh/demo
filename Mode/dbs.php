<?php
namespace Mode;

interface dbs{
    public function __construct();
    public function select($string);
    public function insert($string,$array);
    public function update($string,$array);
    public function delect($string,$array);
    public function filter($value);
}
?>