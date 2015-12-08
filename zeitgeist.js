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
        
        
        

})(window.Zg = window.Zg || {}, jQuery);

