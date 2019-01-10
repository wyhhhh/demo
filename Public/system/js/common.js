//判断为空
function empty(str) {
	str = $.trim(str);
	return (str == "" || str == 'undefined' || str == "null" || str == null || typeof(str) == undefined);
}


//确认操作
$(function(){
	$('.J_confirmDelete').bind('click',
	function() {
		confirmurl(this);
	});
});

$(function(){
	//弹窗表单
	$('.J_showdialog').bind('click',
	function() {
		showDialog(this);
	});
});

function showDialog(e) {
	var self = $(e),
	dtitle = self.attr('data-title'),
	did = self.attr('data-id'),
	duri = self.attr('data-uri'),
	dwidth = parseInt(self.attr('data-width')),
	dheight = parseInt(self.attr('data-height')),
	dpadding = (self.attr('data-padding') != undefined) ? self.attr('data-padding') : '',
	dcallback = self.attr('data-callback'),
	full = self.attr('data-full');
	if (empty(dtitle)) {
		dtitle = " ";
	}
	//全屏时显示全屏
	if (full == "1") {
		var index = layer.open({
			type: 2,
			title: dtitle,
			content: duri,
			fix: true,
			maxmin: false
		});
		layer.full(index);
	}
	else {
		//var index = layer_show(dtitle, duri, dwidth ? dwidth : 'auto', dheight ? dheight : 'auto');
		//layer.full(index);全屏
		var windowHight = ($(window).height() - 50);
		if (dheight > windowHight) {
			dheight = windowHight;
		}
		var windowWidth = ($(window).width() - 50);
		if (dwidth > windowWidth) {
			dwidth = windowWidth;
		}
		var index = layer.open({
			type: 2,
			area: [dwidth + 'px', dheight + 'px'],
			fix: true,
			//固定,
			maxmin: false,
			shade: 0.4,
			title: dtitle,
			content: duri
		});
	}
	return false;
}

function confirmDelete(e) {
	var self = $(e),
	uri = self.attr('data-uri'),
	acttype = self.attr('data-acttype'),
	title = (self.attr('data-title') != undefined) ? self.attr('data-title') : "",
	msg = self.attr('data-msg'),
	ids = self.attr('data-id');

	swal({
		title: msg,
		text: "删除后将无法恢复，请谨慎操作！",
		type: "",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "删除",
		cancelButtonText: "不删除",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function(isConfirm) {
		if (isConfirm) {

			index = layer.load(2);
			$.post(uri, {
				id: ids
			},
			function(result) {
				layer.close(index);
				if (result.status == 1) {
					swal({
						title: "操作成功",
						type: "success",
						timer: 1000
					});
					if(!empty(searchSubmit)){
						searchSubmit();
					}
					else if ($('#tablelist').length > 0) {
						//重新加载数据
						$('button[name="refresh"]').trigger("click");
					}
				} else {
					swal({
						title: result.msg,
						timer: 1000,
						showConfirmButton: false,
						type: "error"
					});
				}
			});
		} 
		else {
			swal.close();
		}
	});
}
$(function() {
	//批量刪除确认操作
	$('.J_batchDelete').bind('click',
	function() {
		batchDelete(this);
	});
});

function batchDelete(e) {
	var me = $(e);
	var tableid = me.attr('data-tableid');
	if (empty(tableid)) {
		tableid = "tablelist";
	}
	var list = $('#' + tableid).bootstrapTable('getAllSelections');
	var length = list.length;
	if(length == 0){
		swal({
			title: "请至少选择一行",
			timer: 1000,
			showConfirmButton: false,
			type: "error"
		});
		return;
	}
	var ids = "";
	//獲取選中行id
	for (i = 0;i < list.length;i++) {
		var item = list[i];
		ids += "," + item['id'];
	}
	var ids = ids.substr(1,ids.length - 1);
	//获取地址
	var uri = me.attr('data-uri');
	//执行删除
	swal({
		title: "确认要删除选中行数据吗？",
		text: "删除后将无法恢复，请谨慎操作！",
		type: "",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "删除",
		cancelButtonText: "不删除",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function(isConfirm) {
		if (isConfirm) {
			index = layer.load(2);
			$.post(uri, {
				id: ids
			},
			function(result) {
				layer.close(index);
				if (result.status == 1) {
					swal({
						title: "操作成功",
						type: "success",
						timer: 1000
					});
					if(!empty(searchSubmit)){
						searchSubmit();
					}
					else if ($('#tablelist').length > 0) {
						//重新加载数据
						$('button[name="refresh"]').trigger("click");
					}
				} else {
					swal({
						title: result.msg,
						timer: 1000,
						showConfirmButton: false,
						type: "error"
					});
				}
			});
		} 
		else {
			swal.close();
		}
	});
}
//全部发送接口
$(function() {
	//批量修改确认操作
	$('.J_allsends').bind('click',
	function() {
		allsends(this);
	});
});
function allsends(e) {
	var me = $(e);
	var tableid = me.attr('data-tableid');
	if (empty(tableid)) {
		tableid = "tablelist";
	}
	var list = $('#' + tableid).bootstrapTable('getAllSelections');
	var length = list.length;
	var ids = "";
	//獲取選中行id
	for (i = 0;i < list.length;i++) {
		var item = list[i];
		ids += "," + item['id'];
	}
	var ids = ids.substr(1,ids.length - 1);
	//获取地址
	var uri = me.attr('data-uri');
	//执行删除
	swal({
		title: "确认要向所以未缴费用户发送催款通知吗？",
		text: "确认后将无法撤回！",
		type: "",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function(isConfirm) {
		if (isConfirm) {
			index = layer.load(2);
			$.post(uri, {
				id: ids
			},
			function(result) {
				layer.close(index);
				if (result.status == 1) {
					swal({
						title: "操作成功",
						type: "success",
						timer: 1000
					});
					if(!empty(searchSubmit)){
						searchSubmit();
					}
					else if ($('#tablelist').length > 0) {
						//重新加载数据
						$('button[name="refresh"]').trigger("click");
					}
				} else {
					swal({
						title: result.msg,
						timer: 1000,
						showConfirmButton: false,
						type: "error"
					});
				}
			});
		} 
		else {
			swal.close();
		}
	});
}

//批量发送接口
$(function() {
	//批量修改确认操作
	$('.J_sends').bind('click',
	function() {
		sends(this);
	});
});
function sends(e) {
	var me = $(e);
	var tableid = me.attr('data-tableid');
	if (empty(tableid)) {
		tableid = "tablelist";
	}
	var list = $('#' + tableid).bootstrapTable('getAllSelections');
	var length = list.length;
	if(length == 0){
		swal({
			title: "请至少选择一行",
			timer: 1000,
			showConfirmButton: false,
			type: "error"
		});
		return;
	}
	var ids = "";
	//獲取選中行id
	for (i = 0;i < list.length;i++) {
		var item = list[i];
		if (item['addtimes']=="未交费") {ids += "," + item['id'];};
	}
	if(ids == 0){
		swal({
			title: "请至少选择一行未交费的",
			timer: 1000,
			showConfirmButton: false,
			type: "error"
		});
		return;
	}
	var ids = ids.substr(1,ids.length - 1);
	//获取地址
	var uri = me.attr('data-uri');
	//执行删除
	swal({
		title: "确认要向选中用户发送催款通知吗？",
		text: "确认后将无法撤回！",
		type: "",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function(isConfirm) {
		if (isConfirm) {
			index = layer.load(2);
			$.post(uri, {
				id: ids
			},
			function(result) {
				layer.close(index);
				if (result.status == 1) {
					swal({
						title: "操作成功",
						type: "success",
						timer: 1000
					});
					if(!empty(searchSubmit)){
						searchSubmit();
					}
					else if ($('#tablelist').length > 0) {
						//重新加载数据
						$('button[name="refresh"]').trigger("click");
					}
				} else {
					swal({
						title: result.msg,
						timer: 1000,
						showConfirmButton: false,
						type: "error"
					});
				}
			});
		} 
		else {
			swal.close();
		}
	});
}


//批量修改确认操作
$(function() {
	//批量修改确认操作
	$('.J_bat').bind('click',
	function() {
		overs(this);
	});
});
function overs(e) {
	var me = $(e);
	var tableid = me.attr('data-tableid');
	if (empty(tableid)) {
		tableid = "tablelist";
	}
	var list = $('#' + tableid).bootstrapTable('getAllSelections');
	var length = list.length;
	if(length == 0){
		swal({
			title: "请至少选择一行",
			timer: 1000,
			showConfirmButton: false,
			type: "error"
		});
		return;
	}
	var ids = "";
	//獲取選中行id
	for (i = 0;i < list.length;i++) {
		var item = list[i];
		ids += "," + item['id'];
	}
	var ids = ids.substr(1,ids.length - 1);
	//获取地址
	var uri = me.attr('data-uri');
	//执行删除
	swal({
		title: "确认要修改选中行数据吗？",
		text: "修改后将无法恢复！",
		type: "",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "修改",
		cancelButtonText: "不修改",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function(isConfirm) {
		if (isConfirm) {
			index = layer.load(2);
			$.post(uri, {
				id: ids,value: nums,name: names
			},
			function(result) {
				layer.close(index);
				if (result.status == 1) {
					swal({
						title: "操作成功",
						type: "success",
						timer: 1000
					});
					if(!empty(searchSubmit)){
						searchSubmit();
					}
					else if ($('#tablelist').length > 0) {
						//重新加载数据
						$('button[name="refresh"]').trigger("click");
					}
				} else {
					swal({
						title: result.msg,
						timer: 1000,
						showConfirmButton: false,
						type: "error"
					});
				}
			});
		} 
		else {
			swal.close();
		}
	});
}
//修改状态
$(function (){
	$("J_batchUpdateField").click(function (){
		batchUpdateField(this);
	});
});

//修改状态
function batchUpdateField(e)
{
	var me = $(e);
	var uri = me.attr('data-uri'); 
	var val = me.attr('data-val');
	var msg = me.attr('data-msg');
	var id = me.attr('data-id');
	//执行修改
	swal({
		title: msg,
		type: "",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function(isConfirm) {
		if (isConfirm) {
			index = layer.load(2);
			$.post(uri, {
				ids: id,
				val: val
			},
			function(result) {
				layer.close(index);
				if (result.status == 1) {
					swal({
						title: "操作成功",
						type: "success",
						timer: 1000
					});
					if(!empty(searchSubmit)){
						searchSubmit();
					}
					else if ($('#tablelist').length > 0) {
						//重新加载数据
						$('button[name="refresh"]').trigger("click");
					}
				}
				else {
					swal({
						title: result.msg,
						timer: 1000,
						showConfirmButton: false,
						type: "error"
					});
				}
			});
		}
		else {
			swal.close();
		}
	});
}



//批量修改状态
$(function (){
	$("J_updateField").click(function (){
		updateField(this);
	});
});

//修改状态
function updateField(e)
{
	var me = $(e);
	var ifs = 0;
	var ifs = me.attr('data-ifs'); 
	var uri = me.attr('data-uri'); 
	var val = me.attr('data-val');
	var msg = me.attr('data-msg');
	var id = me.attr('data-id');
	
	var me = $(e);
	var tableid = me.attr('data-tableid');
	if (empty(tableid)) {
		tableid = "tablelist";
	}
	var list = $('#' + tableid).bootstrapTable('getAllSelections');
	var length = list.length;
	if(ifs==0){
	if(length == 0){
		swal({
			title: "请至少选择一行",
			timer: 1000,
			showConfirmButton: false,
			type: "error"
		});
		return;
	}
	}
	var ids = "";
	//獲取選中行id
	for (i = 0;i < list.length;i++) {
		var item = list[i];
		ids += "," + item['id'];
	}
	var ids = ids.substr(1,ids.length - 1);
	//执行修改
	swal({
		title: msg,
		type: "",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function(isConfirm) {
		if (isConfirm) {
			index = layer.load(2);
			$.post(uri, {
				ids: id,
				val: val,
				ifs: ifs
			},
			function(result) {
				layer.close(index);
				if (result.status == 1) {
					swal({
						title: "操作成功",
						type: "success",
						timer: 1000
					});
					if(!empty(searchSubmit)){
						searchSubmit();
					}
					else if ($('#tablelist').length > 0) {
						//重新加载数据
						$('button[name="refresh"]').trigger("click");
					}
				}
				else {
					swal({
						title: result.msg,
						timer: 1000,
						showConfirmButton: false,
						type: "error"
					});
				}
			});
		}
		else {
			swal.close();
		}
	});
}

function upd(e)
{
	var me = $(e);
	var ifs = 0;
	var ifs = me.attr('data-ifs'); 
	var uri = me.attr('data-uri'); 
	var val = me.attr('data-val');
	var msg = me.attr('data-msg');
	var id = me.attr('data-id');
	
	var me = $(e);
	var tableid = me.attr('data-tableid');
	if (empty(tableid)) {
		tableid = "tablelist";
	}
	var list = $('#' + tableid).bootstrapTable('getAllSelections');
	var length = list.length;
	if(ifs==0){
	if(length == 0){
		swal({
			title: "请至少选择一行",
			timer: 1000,
			showConfirmButton: false,
			type: "error"
		});
		return;
	}
	}
	var ids = "";
	//獲取選中行id
	for (i = 0;i < list.length;i++) {
		var item = list[i];
		ids += "," + item['id'];
	}
	var ids = ids.substr(1,ids.length - 1);
	//执行修改
	swal({
		title: msg,
		type: "",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function(isConfirm) {
		if (isConfirm) {
			index = layer.load(2);
			$.post(uri, {
				id: id,
			},
			function(result) {
				layer.close(index);
				if (result.status == 1) {
					swal({
						title: "发送成功",
						type: "success",
						timer: 1000
					});
					if(!empty(searchSubmit)){
						searchSubmit();
					}
					else if ($('#tablelist').length > 0) {
						//重新加载数据
						$('button[name="refresh"]').trigger("click");
					}
				}
				else {
					swal({
						title: "发送失败",
						timer: 1000,
						showConfirmButton: false,
						type: "error"
					});
				}
			});
		}
		else {
			swal.close();
		}
	});
}

//嗯
$(function(){
	document.onkeydown = function(e){ 
	    var ev = document.all ? window.event : e;
	    if(ev.keyCode==13) {
	    	var btn = $("#search_btn");
	    	if(btn.length > 0){
	    		btn.click();
	    	}
	    }
	}
});

/*将时间戳转换为时间
* time 时间戳
* format 格式化,年:y,月:m,日:d,时:h,分:i,秒s,如:(y年m-d h:i:s);
* 返回格式化好的时间
*/
function UnixTimeToDate(time, format) {
    var v = time;
    if (/^(-)?\d{1,10}$/.test(v)) {
        v = v * 1000;
    } else if (/^(-)?\d{1,13}$/.test(v)) {
        v = v * 1;
    } else {
        return '-';
    }
    var dateObj = new Date(v);
    // if (dateObj.format('yyyy') == "NaN") { /*alert("时间戳格式不正确");*/return; }
    var y = dateObj.getFullYear();
    var m = (dateObj.getMonth() + 1);
    if (m < 10) {
        m = "0" + m;
    }
    var d = dateObj.getDate();
    if (d < 10) {
        d = "0" + d;
    }
    var h = dateObj.getHours();
    if (h < 10) {
        h = "0" + h;
    }
    var i = dateObj.getMinutes();
    if (i < 10) {
        i = "0" + i;
    }
    var s = dateObj.getSeconds();
    if (s < 10) {
        s = "0" + s;
    }
    format = format.replace('y', y);//替换年-小写
    format = format.replace('Y', y);//替换年-大写
    format = format.replace('m', m);//替换月-小写
    format = format.replace('M', m);//替换月-大写
    format = format.replace('d', d);//替换日-小写
    format = format.replace('D', d);//替换日-小写
    format = format.replace('h', h);//替换时-小写
    format = format.replace('H', h);//替换时-小写
    format = format.replace('i', i);//替换分-小写
    format = format.replace('I', i);//替换分-小写
    format = format.replace('s', s);//替换秒-小写
    format = format.replace('S', s);//替换秒-小写
    //var UnixTimeToDate = dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();
    return format;
}
