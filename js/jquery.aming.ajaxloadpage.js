/**
 * $.aming_ajaxloadpage
 * @extends jquery.1.7.1
 * @fileOverview html5无刷新加载页面
 * @author 阿命
 * @email y2443@163.com
 * @site wwww.y2443.com , wwww.moepet.net
 * @version 1.0.0.3
 * @create date 2013-12-17
 * @update date 2013-12-19
 * Copyright (c) 2013-2013 AMing
 * @github https://github.com/AMMing/aming.ajaxloadpage/
 * @example
 *     $('.content').aming_ajaxloadpage({
 *          target:'.content',
 *          loads:function(){
 *              $('#loading').show();
 *          },
 *          loaded:function(){
 *              $('#loading').hide();
 *          }
 *      });
 * 
 *
 *
 *@refer http://www.clanfei.com/2012/09/1646.html
 */

(function(window, document, $, undefined) {
    $.extend($.fn, {
        version: '1.0.0.3',
        aming_ajaxloadpage: function(setting) { //默认值
            //检测浏览器是否支持history和history.pushState
            if (!(window.history && history.pushState)) {
                return this;
            }

            var sdata = $.extend({
                target: 'div',
                enable_javascript: true,
                loads: function(obj) {},
                loaded: function(obj) {}
            }, setting);

            var ajax;
            var currentState;
            var obj = this;
            var thisobj = {
                title: null,
                url: null,
                oldurl: null,
                loadpage: function(url) {
                    thisobj.oldurl = thisobj.url;
                    thisobj.url = url;
                    sdata.loads(thisobj);
                    ajax = $.ajax({
                        url: url,
                        dataType: 'html',
                        cache: false,
                        // type: 'GET',
                        success: function(data) {
                            data = '<div>' + data + '</div>'
                            if (sdata.enable_javascript) {
                                data = data.replace(new RegExp("<script", "g"), "<temp_script_temp");
                                data = data.replace(new RegExp("</script>", "g"), "</temp_script_temp>");
                            }
                            var html = $(data).find(sdata.target).html();
                            if (sdata.enable_javascript) {
                                html = html.replace(new RegExp("<temp_script_temp", "g"), "<script");
                                html = html.replace(new RegExp("</temp_script_temp>", "g"), "</script>");
                            }
                            thisobj.title = data.substr(data.indexOf('<title>') + 7);
                            thisobj.title = thisobj.title.substr(0, thisobj.title.indexOf('</title>'));
                            var state = {
                                url: thisobj.url,
                                title: thisobj.title,
                                html: html
                            };
                            history.pushState(state, thisobj.title, thisobj.url);
                            document.title = thisobj.title;
                            $(sdata.target).html(html);
                            // $(obj).aming_ajaxloadpage(sdata);
                            thisobj.bindEvent();

                            sdata.loaded(thisobj);
                        }
                    });
                },
                bindEvent: function() {
                    $(obj).find('a').bind('click', function() {
                        var isajax = $(this).data('isajax');
                        var url = $(this).attr('href');
                        if (isajax == false || url.indexOf('javascript:') >= 0) {
                            return true;
                        }
                        if (ajax == null) {
                            currentState = {
                                url: document.location.href,
                                title: document.title,
                                html: $(sdata.target).html()
                            };
                        } else {
                            ajax.abort();
                        }
                        thisobj.loadpage(url);

                        return false;
                    });
                }
            };
            obj.ajaxdata = thisobj;
            thisobj.url = document.location.href;

            thisobj.bindEvent();

            window.onpopstate = function(event) {
                if (ajax == null) {
                    return;
                } else if (event && event.state) {
                    document.title = event.state.title;
                    $(sdata.target).html(event.state.html);
                } else {
                    document.title = currentState.title;
                    $(sdata.target).html(currentState.html);
                }
            };

            return this;
        }
    });


})(window, document, jQuery);