/*****************************************************************
 * ZP.tpl-0.2
 * ZP前端模板引擎,基于underscore.template()
 * 最后更新时间：2017-09-14
 * 最后更新人：Zp
 *****************************************************************/

(function(global){
    //注册ZP空间
    window.ZP = window.ZP || {};

    //注册模板池
    var tplPool = {};

    //（内部方法）模板编译方法
    //参数：str 模板字符串，tplName 模板名称
    //返回：Function 模板渲染方法
    function compileTpl(str,tplName){
        var tpl = null;
        try{
            tpl = tplPool[tplName] = _.template(str,null,null,tplName);
        }catch(e){
            tpl = "";
            if(console && console.error){
                console.error("ZP: template compile error, \""+tplName+"\".");
            }else{
                throw e;
            }
        }
        return tpl;
    }

    //Dom模板加载方法
    //参数：tplName 模板名称
    //返回：Function 模板渲染方法
    ZP.loadDomTpl = function(tplName){
        var doms = $("*[tmplName="+tplName+"]");
        if(doms.length>0){
            var tdom = doms.eq(doms.length - 1);
            return compileTpl(tdom.html(),tplName);
        }
        return null;
    }

    //文件模板加载方法
    //参数：tplName 模板名称
    //返回：Function 模板渲染方法
    ZP.loadFileTpl = function(tplName){
        var tpl = null;
        $.ajax({
            type: "post",
            url: "/template/getTemplate",
            async: false,
            data: {tplPath: tplName},
            success: function (ar) {
                tpl = compileTpl(ar[tplName],tplName);
            }
        });
        return tpl;
    }

    //模板渲染主方法
    //参数：tplName 模板名称， data 渲染数据
    //返回值：String 模板渲染html字符串
    ZP.tpl = function(tplName, data){
        if(!tplName){
            ZP.tplAllTag(data);
            return;
        }else if (typeof(tplName) != "string"){
            ZP.tplTag(tplName, data);
            return;
        }
        data = data || {};
        if(tplPool[tplName]){
            return tplPool[tplName](data);
        }else{
            var tpl = ZP.loadDomTpl(tplName);
            if(tpl){
                return tpl(data);
            }else{
                tpl = ZP.loadFileTpl(tplName);
                if(tpl){
                    return tpl(data);
                }
            }
            if(tpl !== null && console && console.error){
                console.error("ZP: template is not exist, \""+tplName+"\".");
            }
            return "";
        }
    }

    ZP.tplAllTag = function(data){
        var tags = $(window.document).find("tdom");
        if(tags.length){
            for(var i = 0; i < tags.length; i++){
                ZP.tplTag(tags[i],data);
            }
        }
    }
    ZP.tplTag = function(obj,data){
        var t = obj instanceof jQuery ? obj[0] : obj;
        if(t.attributes && t.attributes.tpl){
            var tdata = {};
            for(var i = 0; i < t.attributes.length; i++){
                tdata[t.attributes[i].name] = t.attributes[i].value;
            }
            tdata = $.extend(true,{}, tdata, data);
            var $nt = $(ZP.tpl(t.attributes.tpl.value, tdata));
            for(key in tdata){
                if(typeof(tdata[key]) !== "undefined"){
                    if(key == "class"){
                        $nt.attr(key,tdata[key] +" "+ $nt.attr(key));
                    }else if(key == "style"){
                        $nt.attr(key,tdata[key] +";"+ $nt.attr(key));
                    }else{
                        $nt.attr(key,tdata[key]);
                    }
                }
            }
            $(t).replaceWith($nt);
        }
    }
})(this);
