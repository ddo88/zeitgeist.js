//author: Daniel Durán
//date: 2015-12-05

(function (Zg, $, undefined) {

//sometimes $.getJSON fails, this method force return json content
    Zg.getJSON= function(url) {
        return $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json;odata=verbose;",
            dataType: "json",
            headers: {
                "Accept": "application/json;odata=verbose"
            }
        });
    }
//this method add $.promise to $.each method, so you can know when finish and append some logic
    Zg.each = function (data, doCallback) {
            var dfd = jQuery.Deferred();
            setTimeout(function () {
                $.each(data, function (idx, item) {
                    try {
                        doCallback(idx, item);
                        if (idx === data.length - 1) {
                            dfd.resolve({data:data});
                        }
                    } catch (e) {
                        dfd.reject(e);
                    }
                });
            }, 0);
            return dfd.promise();
        }
//retrieve url params in object
    Zg.GetParams= function() {
            var params = {};
            if (location.search) {
                var parts = location.search.substring(1).split('&');

                for (var i = 0; i < parts.length; i++) {
                    var nv = parts[i].split('=');
                    if (!nv[0]) continue;
                    params[nv[0]] = nv[1] || true;
                }
            }
            return params;

        }    
        
        
        
        

})(window.Zg = window.Zg || {}, jQuery);

