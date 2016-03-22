/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />


namespace Hybrid{
    export namespace Core {
        export namespace Utils {
            
            export function Requestsync(url:string,method:string,data?:any,contentType?:any){
                var variable={};
                var a:JQueryAjaxSettings = {
                    async:false,
                    url:url,
                    data:data,
                    contentType:contentType,
                    method:method,
                    success:function(data){
                        variable=data;
                    }    
                }
                $.ajax(a);
                return variable;
            };
            
            export function RequestAsync(url:string,method:string,data?:any,contentType?:any){
                var a:JQueryAjaxSettings = {
                    url:url,
                    data:data,
                    contentType:contentType,
                    method:method
                }
                return $.ajax(a);
            };
            
            export function GetRequestAsync(url:string)
            {
                return RequestAsync(url,"GET",null);
            }
            
            export function PostRequestAsync(url:string,data?:any,contentType?:any)
            {
                return RequestAsync(url,"POST",data);
            }
            export function GetJsonRequest(url,formatter)
            {
                var dfd = jQuery.Deferred();
                
                    $.getJSON(url,function(data){
                        var items=[];
                        for(var i=0,lenght=data.rows;i<lenght;i++)
                        {
                            items.push(formatter(data.data[i]));    
                        }
                        dfd.resolve(items);                        
                    });
                    
                return dfd.promise();
            }
          
            export interface Crud {
                create(obj: any): any;
                select(obj: any): any;
                update(obj: any): any;
                delete(obj: any): any;
            }
        
        }
        
        export namespace Knockout{
                
            export class JQueryRestApi implements Utils.Crud {

                create(obj:Entity): any {
                    return Hybrid.Core.Utils.PostRequestAsync(obj.urlApi() + "/",obj.toEntity(),"application/json");
                }

                select(obj:Entity): any {
                    if (obj != undefined) {
                        return $.ajax({
                            type: "GET",
                            url: obj.urlApi() + "/" + obj.id()
                        });
                    } else {
                        $.ajax({
                            type: "GET",
                            url: obj.urlApi() + "/"
                        });
                    }
                }

                update(obj:Entity): any {
                    return Hybrid.Core.Utils.RequestAsync(obj.urlApi() + "/" + obj.id(),"PUT",obj.toEntity(),"application/json");
                }

                delete(obj: Entity): any {
                    return Hybrid.Core.Utils.RequestAsync(obj.urlApi() + "/" + obj.id(),"DELETE");
                }
            }
                
            export class Model extends JQueryRestApi{
                
                public container = ko.observable<string>();
                
                constructor(container:string){
                    super();
                    this.container(container);
                }
                public Action():void{
                    
                }
                public init():boolean{
                    try{
                        this.Action();
                        ko.applyBindings(this,$(this.container())[0]);
                        return true;    
                    }catch(e){
                        console.log(e);
                        return false;
                    }
                }
            }
                
            export class Entity  {
                public id = ko.observable<Number>();
                public urlApi = ko.observable<string>();

                constructor(Id: number) {
                    this.id(Id);
                }

                public toEntity(): any {
                    var item = {};
                    for (var property in this) {
                        if (ko.isObservable(this[property])) {
                            if (property !== "urlApi") {
                                item[property] = this[property]();
                            }
                        }
                    }
                    return item;
                }
            }    
        }
    }
}