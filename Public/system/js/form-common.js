$(function (){
    var frm = $("#mainForm");
    if (!empty(frm)) { 
        // frm.validate();
    }
});
$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function (element) {
        element.closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    errorElement: "span",
    errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            error.appendTo(element.parent().parent().parent());
        } 
        else if($(element).attr('data-file') == 1)
        {
        	error.appendTo(element.parent().parent());
        }
        else{
            error.appendTo(element.parent());
        }
    },
    errorClass: "help-block m-b-none",
//  validClass: "help-block m-b-none",
    submitHandler: function() {
        formSubmit();
    }
});
//表单提交事件
function formSubmit() {
    //开启加载
    index = layer.load(2);
	var frm = $("#mainForm"); 
    frm.ajaxSubmit({
        success: function (data) {
            layer.close(index);
            if (data.status == 1) {
                var successmsg = "操作成功！";
                if (!empty($.trim(data['msg']))) {
                    successmsg = data['msg'];
                } 
                swal({
                    title: successmsg,
                    type:"success"
                },
                function()
                {
                    var isp = frm.attr('data-isp');
                    if (isp == 0) {
                        //查看是否有successUrl
                        var successUrl = frm.attr("data-successUrl");
                        if (!empty(successUrl)) {
                            window.location = successUrl;
                            return;
                        }
                        document.location.reload();
                    }
                    else 
                    {
                    	frm[0].reset();
                      	//查询是否有列表，有的话，则重新加载列表。不刷新数据
                    	if($('#tablelist',parent.document).length > 0)
                    	{
                    		$('button[name="refresh"]',parent.document).trigger("click");
                    		var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                    		parent.layer.close(index);
                    	}
                    	else if ($('#tablelist').length > 0)
                    	{
//                  		var selector = ".pagination-load"
//                  		if($('#btn_search').length > 0){
//					            $('#btn_search').trigger("click");
//                  		}
//                  		else
//                  		{
//                  			$('#datalist').datagrid('load');
//                  		}
                    	}
                    	else
                    	{
                    		parent.document.location.reload();
                    	}
                    }
                });
            }
            else
            {
                swal({
                    title: data.msg,
                    timer: 1000,
                    showConfirmButton: false,
                    type:"error"
                });
            }
        },
        //处理完成
        resetForm: true,
        dataType: 'json'
    });
}