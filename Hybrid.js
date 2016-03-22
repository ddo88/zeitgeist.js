/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Hybrid;
(function (Hybrid) {
    var Core;
    (function (Core) {
        var Utils;
        (function (Utils) {
            function Requestsync(url, method, data, contentType) {
                var variable = {};
                var a = {
                    async: false,
                    url: url,
                    data: data,
                    contentType: contentType,
                    method: method,
                    success: function (data) {
                        variable = data;
                    }
                };
                $.ajax(a);
                return variable;
            }
            Utils.Requestsync = Requestsync;
            ;
            function RequestAsync(url, method, data, contentType) {
                var a = {
                    url: url,
                    data: data,
                    contentType: contentType,
                    method: method
                };
                return $.ajax(a);
            }
            Utils.RequestAsync = RequestAsync;
            ;
            function GetRequestAsync(url) {
                return RequestAsync(url, "GET", null);
            }
            Utils.GetRequestAsync = GetRequestAsync;
            function PostRequestAsync(url, data, contentType) {
                return RequestAsync(url, "POST", data);
            }
            Utils.PostRequestAsync = PostRequestAsync;
            function GetJsonRequest(url, formatter) {
                var dfd = jQuery.Deferred();
                $.getJSON(url, function (data) {
                    var items = [];
                    for (var i = 0, lenght = data.rows; i < lenght; i++) {
                        items.push(formatter(data.data[i]));
                    }
                    dfd.resolve(items);
                });
                return dfd.promise();
            }
            Utils.GetJsonRequest = GetJsonRequest;
        })(Utils = Core.Utils || (Core.Utils = {}));
        var Knockout;
        (function (Knockout) {
            var JQueryRestApi = (function () {
                function JQueryRestApi() {
                }
                JQueryRestApi.prototype.create = function (obj) {
                    return Hybrid.Core.Utils.PostRequestAsync(obj.urlApi() + "/", obj.toEntity(), "application/json");
                };
                JQueryRestApi.prototype.select = function (obj) {
                    if (obj != undefined) {
                        return $.ajax({
                            type: "GET",
                            url: obj.urlApi() + "/" + obj.id()
                        });
                    }
                    else {
                        $.ajax({
                            type: "GET",
                            url: obj.urlApi() + "/"
                        });
                    }
                };
                JQueryRestApi.prototype.update = function (obj) {
                    return Hybrid.Core.Utils.RequestAsync(obj.urlApi() + "/" + obj.id(), "PUT", obj.toEntity(), "application/json");
                };
                JQueryRestApi.prototype.delete = function (obj) {
                    return Hybrid.Core.Utils.RequestAsync(obj.urlApi() + "/" + obj.id(), "DELETE");
                };
                return JQueryRestApi;
            }());
            Knockout.JQueryRestApi = JQueryRestApi;
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(container) {
                    _super.call(this);
                    this.container = ko.observable();
                    this.container(container);
                }
                Model.prototype.Action = function () {
                };
                Model.prototype.init = function () {
                    try {
                        this.Action();
                        ko.applyBindings(this, $(this.container())[0]);
                        return true;
                    }
                    catch (e) {
                        console.log(e);
                        return false;
                    }
                };
                return Model;
            }(JQueryRestApi));
            Knockout.Model = Model;
            var Entity = (function () {
                function Entity(Id) {
                    this.id = ko.observable();
                    this.urlApi = ko.observable();
                    this.id(Id);
                }
                Entity.prototype.toEntity = function () {
                    var item = {};
                    for (var property in this) {
                        if (ko.isObservable(this[property])) {
                            if (property !== "urlApi") {
                                item[property] = this[property]();
                            }
                        }
                    }
                    return item;
                };
                return Entity;
            }());
            Knockout.Entity = Entity;
        })(Knockout = Core.Knockout || (Core.Knockout = {}));
    })(Core = Hybrid.Core || (Hybrid.Core = {}));
})(Hybrid || (Hybrid = {}));
