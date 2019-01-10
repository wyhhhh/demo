var bootstrap_table = {
	datagridDefaultConfig:{
	    method: 'get',
        pagination: true,     //是否显示分页（*）
        striped: false,      //是否显示行间隔色
        cache: true,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        sortStable: true,      //是否启用排序
        pageNumber:1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        queryParamsType:'', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                            // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sidePagination: 'server', //分页方式：client客户端分页， server 服务端分页（*）
        //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        //showColumns: true, //是否显示所有的列
        showRefresh: true, //是否显示刷新按钮
        minimumCountColumns: 2, //最少允许的列数
        // clickToSelect: true //是否启用点击选中行
        // searchOnEnterKey: true, //回车自动触发搜索
	}
}
 				