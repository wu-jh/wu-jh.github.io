---
title: MYSQL笔记
teaser: 个人使用笔记，并不规范，仅供参考！
category: mysql
---

## 注释

--  单行注释

\# 单行注释

/*  多行注释 */

一般单行注释与注释内容之间至少保留一个空格

## 链接数据库

cmd链接命令:

​		mysql  -h 主机名  -u   用户名    -p    密码

## 数据库操作

DDL:涵盖建库,建表,修改表结构等操作

DML:涵盖增,删,改等日常操作

DQL:频率最高的查询操作

## 基本语法

所有的mysql命令均以分号作为结束符

### 设置密码:

set password = password('密码')

退出:                exit

### 查看所有的数据库:

show databases

### 创建数据库:   

create  database  if  not exists 库名  default  charset  utf8

### 删除数据库:    

drop  database  表名

### 选择数据库:   

 use   库名

### 查看所有的数据表:  

show  tables

### 创建数据表:  

​    create table if  not  exists表名(

​			字段名	字段类型 	字段属性	

​			字段名	字段类型		字段属性
​			......
​		)engine=引擎 charset = utf8

### 删除数据表:  

drop  table   表名

### 查看表结构:   

desc   表名

### 查看建表语句:  

show  create  table  表名

### 修改表结构: 

update   表名  set   修改的字段     where    条件

### 查看表

#### 基本函数:  

select   now()		获取当前格式时间		格式(Y-m-d  H:i:s)

select   unix_timestamp()	获取当前时间戳

select   version    获取当前版本

select    md5()	md5加密

#### 基本运算

\+  - \*  /   %     div(商取整)

#### 基本查询

查询所有用户的所有字段:	select  *  from   表名

查询所有用户的部分字段:	select   字段   from  表名

统计:	select  count(字段)   from   表名

平均	select  avg(字段)   from   表名

总和:	select   sum(字段)   from   表名

拼接:	select    concat(格式)	from   表名

条件查询: 	select  字段    from   表名    where    条件

分组: 	select    字段    from   表名   group   by   要分组的字段

先分组,再筛选	select   字段    from   表名    group    by    分组字段     having     筛选条件

排序:	select  字段   from   表名   order   by   排序字段  asc	asc升序      desc降序

 查询前3条:	select   字段    from    表名   limit 3

从下标为2的地方开始,连续向后查询3条	select    字段    from    表名    limit 2,3

别名:	select    字段  from  表名  as   别名
		select    字段   as   别名    from    表格

取消重复:	select    distinct  字段   from    表名

比较运算符:+	-  *    /    %     div(商取整)

区间:
	查询 年龄  18~28之间的name:	select   name   from   表名   where   age   between  18  and 28

in操作:	select   字段    from    表名     where    字段    in(条件)

is null操作:	select    字段   from   表名    where    字段   is  null

like 包含指定字符: 	select    字段	from    表名    where   name   like   '%字符串%':
	%表示0个或多个字符
	_表示一个字符

#### 嵌套查询又称子查询

简单理解:将一条sql的结果作为另一条sql的条件或数据来使用

例如:    SELECT name, age FROM user WHERE age = (SELECT MAX(age) FROM user);

常用子查询关键字:
	in
	any   可以与= 组合来使用,代表等于any中的任意一个数据即可,还可以与< <= > >= !=  <> 来组合使用

​	some    any的别名   效果与any一致

​	all	可以与=组合使用,代表等于all中所有的数据即可,还可以与< <= > >= !=  <> 来组合使用

子查询 mysql5.7版本不支持除in any all  some以外的关键字

#### 多表联查

简单理解:	为了降低数据的冗余,分别存入多张表中,后期需要使用时,多表联合查询

​	一对一:	一个用户只能有一个name,age,tel,pwd ....

​	一对多:	一个用户可以有多个收货地址,收货人,收货电话等,只能将收货地址,收货人,收货电话存入新的表中,新表需要保留一个字段,与用户表发生关联.

注意:
	多表联查时,必须声明表与表之间的关系
	多表相同的字段,必须声明表名	格式:   表名.字段

