/**
 * $.aming_ajaxloadpage
 * @extends jquery.1.7.1
 * @fileOverview html5无刷新加载页面
 * @author 阿命
 * @email y2443@163.com
 * @site wwww.y2443.com
 * @version 1.0.0.0
 * @date 2013-12-17
 * Copyright (c) 2013-2013 AMing
 * @example
 *     $('html').aming_ajaxloadpage({
 *          target:'.content',
 *          loads:function(){
 *              $('#loading').show();
 *          },
 *          loaded:function(){
 *              $('#loading').hide();
 *          }*
 *      });
 */

(function(window, document, $, undefined) {
    $.extend($.fn, {
        version: '1.0.0.0',
        aming_ajaxloadpage_ajax: null,
        aming_ajaxloadpage: function(setting) { //默认值
            if (!(window.history && history.pushState)) {
                return this;
            }

            var sdata = $.extend({
                target: 'div',
                loads: function(obj) {},
                loaded: function(obj) {}
            }, setting);

            var ajax;
            var currentState;
            var obj = this;
            var thisobj = {
                title: null,
                url: null,
                loadpage: function(url) {
                    thisobj.url = url;
                    sdata.loads(thisobj);
                    ajax = $.ajax({
                        url: url,
                        // type: 'GET',
                        success: function(data) {
                            data = '<div>' + data + '</div>'
                            var html = $(data).find(sdata.target).html();
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
                            $(obj).aming_ajaxloadpage(sdata);
                            sdata.loaded(thisobj);
                        }
                    });
                }
            };

            $(obj).find('a').bind('click', function() {
                var url = $(this).attr('href');
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