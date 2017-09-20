function getbaseList(){
	SYS.Model.loading(); //加载框提示
	SYS.Ajax.doRequest("pageForm",path +'/path/findByPage',null,function(data){
		 $("#table tbody").empty();
    		 var obj=data.obj;
        	 var list=obj.list;
        	 var results=list.results;
         	 var pageNum=list.pageNum,pageSize=list.pageSize,totalRecord=list.totalRecord;
         
        	 var html="";
    		 if(results!=null&&results.length>0){			
        		 var leng=(pageNum-1)*pageSize;//计算序号
        		 for(var i = 0;i<results.length;i++){
            		 var l=results[i];
            		 html+="<tr>";
            		 html+="<td class='center'>"+SYS.Object.notEmpty(l.departmentCode)+"</td>";
            		 html+="<td class='center'>"+SYS.Object.notEmpty(l.interfaceCnt)+"</td>";
            		 html+="<td class='center'>"+SYS.Object.notEmpty(l.dataCnt)+"</td>"; 
            		 html+="</tr>";		 
            	 } 
        		 $("#table tbody").append(html);
        		 SYS.Page.setPage("pageForm","pageId",pageSize,pageNum,totalRecord,"getbaseList");
        		 
        	 }else{
        		html+="<tr><td colspan='7' class='center'>没有相关数据</td></tr>";
        		$("#table tbody").append(html);
        		$("#pageId ul").empty();//清空分页
        	 }	 	        	 
    	 SYS.Model.loadingClose(); //关闭加载框
	});
}


Page:{//跳转分页
		jump:function(formId,num,JpFun){$("#"+formId+" .pageNum").val(num);eval(JpFun+"()");},
		//设置分页单个显示数量
		setSize:function(formId,size,JpFun){$("#"+formId+" .pageNum").val(1);$("#"+formId+" .pageSize").val(size);eval(JpFun+"()");},
		/*自定义跳转分页*/
		jumpCustom:function(formId,pageId,leng,JpFun){var choseJPage=$("#"+pageId+" .choseJPage").val();if(typeof(choseJPage) == "undefined")return;else if(choseJPage==0)choseJPage=1;else if(choseJPage>leng)choseJPage=leng;$("#"+formId+" .pageNum").val(choseJPage);eval(JpFun+"()");},
		/*设置分页方法,formId 分页参数Form的Id,pageId 分页位置Id,pagesize 分页显示数量,pagenum 页码,totalCount 数据总数,fun 获得数据方法名*/
		setPage:function(formId,pageId,pagesize,pagenum,totalCount,fun){
			if(totalCount>0){
				var pageul = $("#"+pageId+" ul"),html="";
				pageul.empty();
				var leng = parseInt((totalCount - 1)/pagesize)+1;
				if(pagenum - 1 >= 1){html+="<li class='prev'><a onclick='SYS.Page.jump(&apos;"+formId+"&apos;,1,&apos;"+fun+"&apos;)' href='#'>首页</a></li>";html+="<li class='prev'><a onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+(pagenum - 1)+",&apos;"+fun+"&apos;)' href='#'>上页</a></li>";}
				else{html+="<li class='prev disabled'><a href='##'>首页</a></li>";html+="<li class='prev disabled'><a href='##'>上页</a></li>";}
				var all = leng>2?2:leng;//总显示个数,正常为all+1条,现在设2，显示为3条
				var start = 1;
				//all/2取整后的页数减去当前页数，判断是否为大于0
				var before = pagenum - parseInt(all/2);
				if(before > 1)start = before;
				var end = start + all;
				if(end > leng){end = leng;start = leng > all ? (leng - all) : 1;}
				//现在设2,和显示对应
				if(pagenum>2&&leng>3){html+="<li class='' ><a href='#' onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+(pagenum-2)+",&apos;"+fun+"&apos;)' >..</a></li>";}
				for(var ii = start ; ii <= end; ii++){
					var page = (parseInt(ii));
					if(pagenum==page){html+="<li class='active' ><a href='#'>"+page+"</a></li>";}
					else{html+="<li><a onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+ii+",&apos;"+fun+"&apos;)' href='#'>"+page+"</a></li>";}
				}
				if(pagenum<=(leng-2)&&leng>3){html+="<li class='' ><a href='#' onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+(pagenum+2)+",&apos;"+fun+"&apos;)' >..</a></li>";}
				if(pagenum + 1 <= leng){html+="<li class='next'><a onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+(pagenum + 1)+",&apos;"+fun+"&apos;)' href='#'>下页</a></li>";html+="<li class='next'><a onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+leng+",&apos;"+fun+"&apos;)' href='#'>尾页</a></li>";}
				else{html+="<li class='next disabled'><a href='##'>下页</a></li>";html+="<li class='next disabled'><a href='##'>尾页</i></a></li>";}
				html+="<li class='disabled'><a href='##'>共"+leng+"页<font color='red'>"+totalCount+"</font>条</a></li>";
				html+="<li class='next'><input onkeyup='this.value=this.value.replace(/\D/g,&apos;&apos;)' type='number' min='1' max='"+leng+"'  placeholder='页码' class='choseJPage' ></li>";
				html+="<li ><a class='btn btn-mini btn-success' onclick='SYS.Page.jumpCustom(&apos;"+formId+"&apos;,&apos;"+pageId+"&apos;,"+leng+",&apos;"+fun+"&apos;);' href='##'>跳转</a></li>";
				html+="<li class='disabled'><select onchange='SYS.Page.setSize(&apos;"+formId+"&apos;,this.value,&apos;"+fun+"&apos;)' style='width:55px;float:left;height:24px;' title='显示条数'>"+"<option value='5'  "+((pagesize==5)?"selected='selected'":"")+" >5</option>"
				+"<option value='10' "+((pagesize==10)?"selected='selected'":"")+" >10</option>"
				+"<option value='15' "+((pagesize==15)?"selected='selected'":"")+" >15</option>"
				+"<option value='20' "+((pagesize==20)?"selected='selected'":"")+" >20</option>"
				+"<option value='30' "+((pagesize==30)?"selected='selected'":"")+" >30</option>"
				+"<option value='50' "+((pagesize==50)?"selected='selected'":"")+" >50</option>"+"</li>";
				pageul.append(html);
			}
		},
		/*简化版,设置分页方法,formId 分页参数Form的Id,pageId 分页位置Id,pagesize 分页显示数量,pagenum 页码,totalCount 数据总数,fun 获得数据方法名*/
		setSimPage:function(formId,pageId,pagesize,pagenum,totalCount,fun){
			if(totalCount>0){
				var pageul = $("#"+pageId+" ul"),html="";
				pageul.empty();
				var leng = parseInt((totalCount - 1)/pagesize)+1;
				if(pagenum - 1 >= 1){html+="<li class='prev'><a onclick='SYS.Page.jump(&apos;"+formId+"&apos;,1,&apos;"+fun+"&apos;)' href='#'>首</a></li>";}
				else{html+="<li class='prev disabled'><a href='##'>首</a></li>";}
				var all = leng>2?2:leng;//总显示个数,正常为all+1条,现在设2，显示为3条
				var start = 1;
				//all/2取整后的页数减去当前页数，判断是否为大于0
				var before = pagenum - parseInt(all/2);
				if(before > 1)start = before;
				var end = start + all;
				if(end > leng){end = leng;start = leng > all ? (leng - all) : 1;}
				//现在设2,和显示对应
				if(pagenum>2&&leng>3){html+="<li class='' ><a href='#' onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+(pagenum-2)+",&apos;"+fun+"&apos;)' >..</a></li>";}
				for(var ii = start ; ii <= end; ii++){
					var page = (parseInt(ii));
					if(pagenum==page){html+="<li class='active' ><a href='#'>"+page+"</a></li>";}
					else{html+="<li><a onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+ii+",&apos;"+fun+"&apos;)' href='#'>"+page+"</a></li>";}
				}
				if(pagenum<=(leng-2)&&leng>3){html+="<li class='' ><a href='#' onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+(pagenum+2)+",&apos;"+fun+"&apos;)' >..</a></li>";}
				if(pagenum + 1 <= leng){html+="<li class='next'><a onclick='SYS.Page.jump(&apos;"+formId+"&apos;,"+leng+",&apos;"+fun+"&apos;)' href='#'>尾</a></li>";}
				else{html+="<li class='next disabled'><a href='##'>尾</i></a></li>";}
				html+="<li class='disabled'><a href='##'>共"+leng+"页</a></li>";
				pageul.append(html);
			}
		}
	},
		
		
		Ajax:{//异步请求, form表单ID,url请求路径,param参数对象,如：{a:'test',b:2},fn回调函数
		doRequest:function(form,url,param,fn,isContinue)
		{
			var params = form || param || {};
			if (typeof form == 'string')
			{
				params = $.extend(param || {},SYS.Object.serialize($("#" + form)),{menu:SYS.Url.getParam("menu")},{"isContinue":isContinue});
			}
			$.ajax({type:'POST',url:url,data:params,dataType:'json',success:function(data, textStatus){
				if(data.res==1){
					if (typeof(fn)=='function'){
						fn.call(this, data);}
				}else if((isContinue==null||isContinue==undefined)&&data.res==2){
				  SYS.Model.confirm(data.resMsg,function(){SYS.Ajax.doRequest(form,url,param,fn,true)});
				}else{
					if(SYS.Object.notNull(data.resMsg))
						SYS.Model.error(data.resMsg);
				}
			},error:function(){
				return;
			},beforeSend:function(){},
				complete:function(){

				}
			});
		}, req:function(form,url,param,fn)
		{
			var params = form || param || {};
			if (typeof form == 'string'){
				params = $.extend(param || {},SYS.Object.serialize($("#" + form)),{menu:SYS.Url.getParam("menu")});
			}
			$.ajax({type:'POST',url:url,data:params,dataType:'json',success:function(data, textStatus) {
				if (typeof(fn)=='function'){
					fn.call(this, data);
				}
			},error:function(){
				return;
			}
				,beforeSend:function(){}
				,complete:function(){}
			});
		}}};

