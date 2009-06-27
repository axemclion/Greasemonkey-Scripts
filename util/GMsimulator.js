
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.1
*/

if(typeof YAHOO=="undefined"){var YAHOO={};}
YAHOO.namespace=function(){var a=arguments,o=null,i,j,d;for(i=0;i<a.length;i=i+1){d=a[i].split(".");o=YAHOO;for(j=(d[0]=="YAHOO")?1:0;j<d.length;j=j+1){o[d[j]]=o[d[j]]||{};o=o[d[j]];}}
return o;};YAHOO.log=function(msg,cat,src){var l=YAHOO.widget.Logger;if(l&&l.log){return l.log(msg,cat,src);}else{return false;}};YAHOO.init=function(){this.namespace("util","widget","example");if(typeof YAHOO_config!="undefined"){var l=YAHOO_config.listener,ls=YAHOO.env.listeners,unique=true,i;if(l){for(i=0;i<ls.length;i=i+1){if(ls[i]==l){unique=false;break;}}
if(unique){ls.push(l);}}}};YAHOO.register=function(name,mainClass,data){var mods=YAHOO.env.modules;if(!mods[name]){mods[name]={versions:[],builds:[]};}
var m=mods[name],v=data.version,b=data.build,ls=YAHOO.env.listeners;m.name=name;m.version=v;m.build=b;m.versions.push(v);m.builds.push(b);m.mainClass=mainClass;for(var i=0;i<ls.length;i=i+1){ls[i](m);}
if(mainClass){mainClass.VERSION=v;mainClass.BUILD=b;}else{YAHOO.log("mainClass is undefined for module "+name,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[],getVersion:function(name){return YAHOO.env.modules[name]||null;}};YAHOO.lang={isArray:function(obj){if(obj&&obj.constructor&&obj.constructor.toString().indexOf('Array')>-1){return true;}else{return YAHOO.lang.isObject(obj)&&obj.constructor==Array;}},isBoolean:function(obj){return typeof obj=='boolean';},isFunction:function(obj){return typeof obj=='function';},isNull:function(obj){return obj===null;},isNumber:function(obj){return typeof obj=='number'&&isFinite(obj);},isObject:function(obj){return obj&&(typeof obj=='object'||YAHOO.lang.isFunction(obj));},isString:function(obj){return typeof obj=='string';},isUndefined:function(obj){return typeof obj=='undefined';},hasOwnProperty:function(obj,prop){if(Object.prototype.hasOwnProperty){return obj.hasOwnProperty(prop);}
return!YAHOO.lang.isUndefined(obj[prop])&&obj.constructor.prototype[prop]!==obj[prop];},extend:function(subc,superc,overrides){if(!superc||!subc){throw new Error("YAHOO.lang.extend failed, please check that "+"all dependencies are included.");}
var F=function(){};F.prototype=superc.prototype;subc.prototype=new F();subc.prototype.constructor=subc;subc.superclass=superc.prototype;if(superc.prototype.constructor==Object.prototype.constructor){superc.prototype.constructor=superc;}
if(overrides){for(var i in overrides){subc.prototype[i]=overrides[i];}}},augment:function(r,s){if(!s||!r){throw new Error("YAHOO.lang.augment failed, please check that "+"all dependencies are included.");}
var rp=r.prototype,sp=s.prototype,a=arguments,i,p;if(a[2]){for(i=2;i<a.length;i=i+1){rp[a[i]]=sp[a[i]];}}else{for(p in sp){if(!rp[p]){rp[p]=sp[p];}}}}};YAHOO.init();YAHOO.util.Lang=YAHOO.lang;YAHOO.augment=YAHOO.lang.augment;YAHOO.extend=YAHOO.lang.extend;YAHOO.register("yahoo",YAHOO,{version:"2.2.1",build:"193"});

YAHOO.util.CustomEvent=function(type,oScope,silent,signature){this.type=type;this.scope=oScope||window;this.silent=silent;this.signature=signature||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}
var onsubscribeType="_YUICEOnSubscribe";if(type!==onsubscribeType){this.subscribeEvent=new YAHOO.util.CustomEvent(onsubscribeType,this,true);}};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(fn,obj,override){if(!fn){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}
if(this.subscribeEvent){this.subscribeEvent.fire(fn,obj,override);}
this.subscribers.push(new YAHOO.util.Subscriber(fn,obj,override));},unsubscribe:function(fn,obj){if(!fn){return this.unsubscribeAll();}
var found=false;for(var i=0,len=this.subscribers.length;i<len;++i){var s=this.subscribers[i];if(s&&s.contains(fn,obj)){this._delete(i);found=true;}}
return found;},fire:function(){var len=this.subscribers.length;if(!len&&this.silent){return true;}
var args=[],ret=true,i;for(i=0;i<arguments.length;++i){args.push(arguments[i]);}
var argslength=args.length;if(!this.silent){}
for(i=0;i<len;++i){var s=this.subscribers[i];if(s){if(!this.silent){}
var scope=s.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var param=null;if(args.length>0){param=args[0];}
ret=s.fn.call(scope,param,s.obj);}else{ret=s.fn.call(scope,this.type,args,s.obj);}
if(false===ret){if(!this.silent){}
return false;}}}
return true;},unsubscribeAll:function(){for(var i=0,len=this.subscribers.length;i<len;++i){this._delete(len-1-i);}
return i;},_delete:function(index){var s=this.subscribers[index];if(s){delete s.fn;delete s.obj;}
this.subscribers.splice(index,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"scope: "+this.scope;}};YAHOO.util.Subscriber=function(fn,obj,override){this.fn=fn;this.obj=obj||null;this.override=override;};YAHOO.util.Subscriber.prototype.getScope=function(defaultScope){if(this.override){if(this.override===true){return this.obj;}else{return this.override;}}
return defaultScope;};YAHOO.util.Subscriber.prototype.contains=function(fn,obj){if(obj){return(this.fn==fn&&this.obj==obj);}else{return(this.fn==fn);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+(this.obj||"")+", override: "+(this.override||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var loadComplete=false;var DOMReady=false;var listeners=[];var unloadListeners=[];var legacyEvents=[];var legacyHandlers=[];var retryCount=0;var onAvailStack=[];var legacyMap=[];var counter=0;var lastError=null;return{POLL_RETRYS:200,POLL_INTERVAL:10,EL:0,TYPE:1,FN:2,WFN:3,OBJ:3,ADJ_SCOPE:4,isSafari:(/KHTML/gi).test(navigator.userAgent),webkit:function(){var v=navigator.userAgent.match(/AppleWebKit\/([^ ]*)/);if(v&&v[1]){return v[1];}
return null;}(),isIE:(!this.webkit&&!navigator.userAgent.match(/opera/gi)&&navigator.userAgent.match(/msie/gi)),_interval:null,startInterval:function(){if(!this._interval){var self=this;var callback=function(){self._tryPreloadAttach();};this._interval=setInterval(callback,this.POLL_INTERVAL);}},onAvailable:function(p_id,p_fn,p_obj,p_override){onAvailStack.push({id:p_id,fn:p_fn,obj:p_obj,override:p_override,checkReady:false});retryCount=this.POLL_RETRYS;this.startInterval();},onDOMReady:function(p_fn,p_obj,p_override){this.DOMReadyEvent.subscribe(p_fn,p_obj,p_override);},onContentReady:function(p_id,p_fn,p_obj,p_override){onAvailStack.push({id:p_id,fn:p_fn,obj:p_obj,override:p_override,checkReady:true});retryCount=this.POLL_RETRYS;this.startInterval();},addListener:function(el,sType,fn,obj,override){if(!fn||!fn.call){return false;}
if(this._isValidCollection(el)){var ok=true;for(var i=0,len=el.length;i<len;++i){ok=this.on(el[i],sType,fn,obj,override)&&ok;}
return ok;}else if(typeof el=="string"){var oEl=this.getEl(el);if(oEl){el=oEl;}else{this.onAvailable(el,function(){YAHOO.util.Event.on(el,sType,fn,obj,override);});return true;}}
if(!el){return false;}
if("unload"==sType&&obj!==this){unloadListeners[unloadListeners.length]=[el,sType,fn,obj,override];return true;}
var scope=el;if(override){if(override===true){scope=obj;}else{scope=override;}}
var wrappedFn=function(e){return fn.call(scope,YAHOO.util.Event.getEvent(e),obj);};var li=[el,sType,fn,wrappedFn,scope];var index=listeners.length;listeners[index]=li;if(this.useLegacyEvent(el,sType)){var legacyIndex=this.getLegacyIndex(el,sType);if(legacyIndex==-1||el!=legacyEvents[legacyIndex][0]){legacyIndex=legacyEvents.length;legacyMap[el.id+sType]=legacyIndex;legacyEvents[legacyIndex]=[el,sType,el["on"+sType]];legacyHandlers[legacyIndex]=[];el["on"+sType]=function(e){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(e),legacyIndex);};}
legacyHandlers[legacyIndex].push(li);}else{try{this._simpleAdd(el,sType,wrappedFn,false);}catch(ex){this.lastError=ex;this.removeListener(el,sType,fn);return false;}}
return true;},fireLegacyEvent:function(e,legacyIndex){var ok=true,le,lh,li,scope,ret;lh=legacyHandlers[legacyIndex];for(var i=0,len=lh.length;i<len;++i){li=lh[i];if(li&&li[this.WFN]){scope=li[this.ADJ_SCOPE];ret=li[this.WFN].call(scope,e);ok=(ok&&ret);}}
le=legacyEvents[legacyIndex];if(le&&le[2]){le[2](e);}
return ok;},getLegacyIndex:function(el,sType){var key=this.generateId(el)+sType;if(typeof legacyMap[key]=="undefined"){return-1;}else{return legacyMap[key];}},useLegacyEvent:function(el,sType){if(this.webkit&&("click"==sType||"dblclick"==sType)){var v=parseInt(this.webkit,10);if(!isNaN(v)&&v<418){return true;}}
return false;},removeListener:function(el,sType,fn){var i,len;if(typeof el=="string"){el=this.getEl(el);}else if(this._isValidCollection(el)){var ok=true;for(i=0,len=el.length;i<len;++i){ok=(this.removeListener(el[i],sType,fn)&&ok);}
return ok;}
if(!fn||!fn.call){return this.purgeElement(el,false,sType);}
if("unload"==sType){for(i=0,len=unloadListeners.length;i<len;i++){var li=unloadListeners[i];if(li&&li[0]==el&&li[1]==sType&&li[2]==fn){unloadListeners.splice(i,1);return true;}}
return false;}
var cacheItem=null;var index=arguments[3];if("undefined"==typeof index){index=this._getCacheIndex(el,sType,fn);}
if(index>=0){cacheItem=listeners[index];}
if(!el||!cacheItem){return false;}
if(this.useLegacyEvent(el,sType)){var legacyIndex=this.getLegacyIndex(el,sType);var llist=legacyHandlers[legacyIndex];if(llist){for(i=0,len=llist.length;i<len;++i){li=llist[i];if(li&&li[this.EL]==el&&li[this.TYPE]==sType&&li[this.FN]==fn){llist.splice(i,1);break;}}}}else{try{this._simpleRemove(el,sType,cacheItem[this.WFN],false);}catch(ex){this.lastError=ex;return false;}}
delete listeners[index][this.WFN];delete listeners[index][this.FN];listeners.splice(index,1);return true;},getTarget:function(ev,resolveTextNode){var t=ev.target||ev.srcElement;return this.resolveTextNode(t);},resolveTextNode:function(node){if(node&&3==node.nodeType){return node.parentNode;}else{return node;}},getPageX:function(ev){var x=ev.pageX;if(!x&&0!==x){x=ev.clientX||0;if(this.isIE){x+=this._getScrollLeft();}}
return x;},getPageY:function(ev){var y=ev.pageY;if(!y&&0!==y){y=ev.clientY||0;if(this.isIE){y+=this._getScrollTop();}}
return y;},getXY:function(ev){return[this.getPageX(ev),this.getPageY(ev)];},getRelatedTarget:function(ev){var t=ev.relatedTarget;if(!t){if(ev.type=="mouseout"){t=ev.toElement;}else if(ev.type=="mouseover"){t=ev.fromElement;}}
return this.resolveTextNode(t);},getTime:function(ev){if(!ev.time){var t=new Date().getTime();try{ev.time=t;}catch(ex){this.lastError=ex;return t;}}
return ev.time;},stopEvent:function(ev){this.stopPropagation(ev);this.preventDefault(ev);},stopPropagation:function(ev){if(ev.stopPropagation){ev.stopPropagation();}else{ev.cancelBubble=true;}},preventDefault:function(ev){if(ev.preventDefault){ev.preventDefault();}else{ev.returnValue=false;}},getEvent:function(e){var ev=e||window.event;if(!ev){var c=this.getEvent.caller;while(c){ev=c.arguments[0];if(ev&&Event==ev.constructor){break;}
c=c.caller;}}
return ev;},getCharCode:function(ev){return ev.charCode||ev.keyCode||0;},_getCacheIndex:function(el,sType,fn){for(var i=0,len=listeners.length;i<len;++i){var li=listeners[i];if(li&&li[this.FN]==fn&&li[this.EL]==el&&li[this.TYPE]==sType){return i;}}
return-1;},generateId:function(el){var id=el.id;if(!id){id="yuievtautoid-"+counter;++counter;el.id=id;}
return id;},_isValidCollection:function(o){return(o&&o.length&&typeof o!="string"&&!o.tagName&&!o.alert&&typeof o[0]!="undefined");},elCache:{},getEl:function(id){return document.getElementById(id);},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(e){if(!loadComplete){loadComplete=true;var EU=YAHOO.util.Event;EU._ready();if(this.isIE){EU._simpleRemove(window,"load",EU._load);}}},_ready:function(e){if(!DOMReady){DOMReady=true;var EU=YAHOO.util.Event;EU.DOMReadyEvent.fire();EU._simpleRemove(document,"DOMContentLoaded",EU._ready);}},_tryPreloadAttach:function(){if(this.locked){return false;}
if(this.isIE&&!DOMReady){return false;}
this.locked=true;var tryAgain=!loadComplete;if(!tryAgain){tryAgain=(retryCount>0);}
var notAvail=[];var executeItem=function(el,item){var scope=el;if(item.override){if(item.override===true){scope=item.obj;}else{scope=item.override;}}
item.fn.call(scope,item.obj);};var i,len,item,el;for(i=0,len=onAvailStack.length;i<len;++i){item=onAvailStack[i];if(item&&!item.checkReady){el=this.getEl(item.id);if(el){executeItem(el,item);onAvailStack[i]=null;}else{notAvail.push(item);}}}
for(i=0,len=onAvailStack.length;i<len;++i){item=onAvailStack[i];if(item&&item.checkReady){el=this.getEl(item.id);if(el){if(loadComplete||el.nextSibling){executeItem(el,item);onAvailStack[i]=null;}}else{notAvail.push(item);}}}
retryCount=(notAvail.length===0)?0:retryCount-1;if(tryAgain){this.startInterval();}else{clearInterval(this._interval);this._interval=null;}
this.locked=false;return true;},purgeElement:function(el,recurse,sType){var elListeners=this.getListeners(el,sType);if(elListeners){for(var i=0,len=elListeners.length;i<len;++i){var l=elListeners[i];this.removeListener(el,l.type,l.fn);}}
if(recurse&&el&&el.childNodes){for(i=0,len=el.childNodes.length;i<len;++i){this.purgeElement(el.childNodes[i],recurse,sType);}}},getListeners:function(el,sType){var results=[],searchLists;if(!sType){searchLists=[listeners,unloadListeners];}else if(sType=="unload"){searchLists=[unloadListeners];}else{searchLists=[listeners];}
for(var j=0;j<searchLists.length;++j){var searchList=searchLists[j];if(searchList&&searchList.length>0){for(var i=0,len=searchList.length;i<len;++i){var l=searchList[i];if(l&&l[this.EL]===el&&(!sType||sType===l[this.TYPE])){results.push({type:l[this.TYPE],fn:l[this.FN],obj:l[this.OBJ],adjust:l[this.ADJ_SCOPE],index:i});}}}}
return(results.length)?results:null;},_unload:function(e){var EU=YAHOO.util.Event,i,j,l,len,index;for(i=0,len=unloadListeners.length;i<len;++i){l=unloadListeners[i];if(l){var scope=window;if(l[EU.ADJ_SCOPE]){if(l[EU.ADJ_SCOPE]===true){scope=l[EU.OBJ];}else{scope=l[EU.ADJ_SCOPE];}}
l[EU.FN].call(scope,EU.getEvent(e),l[EU.OBJ]);unloadListeners[i]=null;l=null;scope=null;}}
unloadListeners=null;if(listeners&&listeners.length>0){j=listeners.length;while(j){index=j-1;l=listeners[index];if(l){EU.removeListener(l[EU.EL],l[EU.TYPE],l[EU.FN],index);}
j=j-1;}
l=null;EU.clearCache();}
for(i=0,len=legacyEvents.length;i<len;++i){legacyEvents[i][0]=null;legacyEvents[i]=null;}
legacyEvents=null;EU._simpleRemove(window,"unload",EU._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var dd=document.documentElement,db=document.body;if(dd&&(dd.scrollTop||dd.scrollLeft)){return[dd.scrollTop,dd.scrollLeft];}else if(db){return[db.scrollTop,db.scrollLeft];}else{return[0,0];}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(el,sType,fn,capture){el.addEventListener(sType,fn,(capture));};}else if(window.attachEvent){return function(el,sType,fn,capture){el.attachEvent("on"+sType,fn);};}else{return function(){};}}(),_simpleRemove:function(){if(window.removeEventListener){return function(el,sType,fn,capture){el.removeEventListener(sType,fn,(capture));};}else if(window.detachEvent){return function(el,sType,fn){el.detachEvent("on"+sType,fn);};}else{return function(){};}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;if(EU.isIE){document.write('<scr'+'ipt id="_yui_eu_dr" defer="true" src="//:"></script>');var el=document.getElementById("_yui_eu_dr");el.onreadystatechange=function(){if("complete"==this.readyState){this.parentNode.removeChild(this);YAHOO.util.Event._ready();}};el=null;YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);}else if(EU.webkit){EU._drwatch=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._drwatch);EU._drwatch=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}
EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}
YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(p_type,p_fn,p_obj,p_override){this.__yui_events=this.__yui_events||{};var ce=this.__yui_events[p_type];if(ce){ce.subscribe(p_fn,p_obj,p_override);}else{this.__yui_subscribers=this.__yui_subscribers||{};var subs=this.__yui_subscribers;if(!subs[p_type]){subs[p_type]=[];}
subs[p_type].push({fn:p_fn,obj:p_obj,override:p_override});}},unsubscribe:function(p_type,p_fn,p_obj){this.__yui_events=this.__yui_events||{};var ce=this.__yui_events[p_type];if(ce){return ce.unsubscribe(p_fn,p_obj);}else{return false;}},unsubscribeAll:function(p_type){return this.unsubscribe(p_type);},createEvent:function(p_type,p_config){this.__yui_events=this.__yui_events||{};var opts=p_config||{};var events=this.__yui_events;if(events[p_type]){}else{var scope=opts.scope||this;var silent=opts.silent||null;var ce=new YAHOO.util.CustomEvent(p_type,scope,silent,YAHOO.util.CustomEvent.FLAT);events[p_type]=ce;if(opts.onSubscribeCallback){ce.subscribeEvent.subscribe(opts.onSubscribeCallback);}
this.__yui_subscribers=this.__yui_subscribers||{};var qs=this.__yui_subscribers[p_type];if(qs){for(var i=0;i<qs.length;++i){ce.subscribe(qs[i].fn,qs[i].obj,qs[i].override);}}}
return events[p_type];},fireEvent:function(p_type,arg1,arg2,etc){this.__yui_events=this.__yui_events||{};var ce=this.__yui_events[p_type];if(ce){var args=[];for(var i=1;i<arguments.length;++i){args.push(arguments[i]);}
return ce.fire.apply(ce,args);}else{return null;}},hasEvent:function(type){if(this.__yui_events){if(this.__yui_events[type]){return true;}}
return false;}};YAHOO.util.KeyListener=function(attachTo,keyData,handler,event){if(!attachTo){}else if(!keyData){}else if(!handler){}
if(!event){event=YAHOO.util.KeyListener.KEYDOWN;}
var keyEvent=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(typeof attachTo=='string'){attachTo=document.getElementById(attachTo);}
if(typeof handler=='function'){keyEvent.subscribe(handler);}else{keyEvent.subscribe(handler.fn,handler.scope,handler.correctScope);}
function handleKeyPress(e,obj){if(!keyData.shift){keyData.shift=false;}
if(!keyData.alt){keyData.alt=false;}
if(!keyData.ctrl){keyData.ctrl=false;}
if(e.shiftKey==keyData.shift&&e.altKey==keyData.alt&&e.ctrlKey==keyData.ctrl){var dataItem;var keyPressed;if(keyData.keys instanceof Array){for(var i=0;i<keyData.keys.length;i++){dataItem=keyData.keys[i];if(dataItem==e.charCode){keyEvent.fire(e.charCode,e);break;}else if(dataItem==e.keyCode){keyEvent.fire(e.keyCode,e);break;}}}else{dataItem=keyData.keys;if(dataItem==e.charCode){keyEvent.fire(e.charCode,e);}else if(dataItem==e.keyCode){keyEvent.fire(e.keyCode,e);}}}}
this.enable=function(){if(!this.enabled){YAHOO.util.Event.addListener(attachTo,event,handleKeyPress);this.enabledEvent.fire(keyData);}
this.enabled=true;};this.disable=function(){if(this.enabled){YAHOO.util.Event.removeListener(attachTo,event,handleKeyPress);this.disabledEvent.fire(keyData);}
this.enabled=false;};this.toString=function(){return"KeyListener ["+keyData.keys+"] "+attachTo.tagName+
(attachTo.id?"["+attachTo.id+"]":"");};};YAHOO.util.KeyListener.KEYDOWN="keydown";YAHOO.util.KeyListener.KEYUP="keyup";YAHOO.register("event",YAHOO.util.Event,{version:"2.2.1",build:"193"});

(function(){var Y=YAHOO.util,getStyle,setStyle,id_counter=0,propertyCache={};var ua=navigator.userAgent.toLowerCase(),isOpera=(ua.indexOf('opera')>-1),isSafari=(ua.indexOf('safari')>-1),isGecko=(!isOpera&&!isSafari&&ua.indexOf('gecko')>-1),isIE=(!isOpera&&ua.indexOf('msie')>-1);var patterns={HYPHEN:/(-[a-z])/i,ROOT_TAG:/body|html/i};var toCamel=function(property){if(!patterns.HYPHEN.test(property)){return property;}
if(propertyCache[property]){return propertyCache[property];}
var converted=property;while(patterns.HYPHEN.exec(converted)){converted=converted.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());}
propertyCache[property]=converted;return converted;};if(document.defaultView&&document.defaultView.getComputedStyle){getStyle=function(el,property){var value=null;if(property=='float'){property='cssFloat';}
var computed=document.defaultView.getComputedStyle(el,'');if(computed){value=computed[toCamel(property)];}
return el.style[property]||value;};}else if(document.documentElement.currentStyle&&isIE){getStyle=function(el,property){switch(toCamel(property)){case'opacity':var val=100;try{val=el.filters['DXImageTransform.Microsoft.Alpha'].opacity;}catch(e){try{val=el.filters('alpha').opacity;}catch(e){}}
return val/100;break;case'float':property='styleFloat';default:var value=el.currentStyle?el.currentStyle[property]:null;return(el.style[property]||value);}};}else{getStyle=function(el,property){return el.style[property];};}
if(isIE){setStyle=function(el,property,val){switch(property){case'opacity':if(YAHOO.lang.isString(el.style.filter)){el.style.filter='alpha(opacity='+val*100+')';if(!el.currentStyle||!el.currentStyle.hasLayout){el.style.zoom=1;}}
break;case'float':property='styleFloat';default:el.style[property]=val;}};}else{setStyle=function(el,property,val){if(property=='float'){property='cssFloat';}
el.style[property]=val;};}
YAHOO.util.Dom={get:function(el){if(YAHOO.lang.isString(el)){return document.getElementById(el);}
if(YAHOO.lang.isArray(el)){var c=[];for(var i=0,len=el.length;i<len;++i){c[c.length]=Y.Dom.get(el[i]);}
return c;}
if(el){return el;}
return null;},getStyle:function(el,property){property=toCamel(property);var f=function(element){return getStyle(element,property);};return Y.Dom.batch(el,f,Y.Dom,true);},setStyle:function(el,property,val){property=toCamel(property);var f=function(element){setStyle(element,property,val);};Y.Dom.batch(el,f,Y.Dom,true);},getXY:function(el){var f=function(el){if((el.parentNode===null||el.offsetParent===null||this.getStyle(el,'display')=='none')&&el!=document.body){return false;}
var parentNode=null;var pos=[];var box;if(el.getBoundingClientRect){box=el.getBoundingClientRect();var doc=document;if(!this.inDocument(el)&&parent.document!=document){doc=parent.document;if(!this.isAncestor(doc.documentElement,el)){return false;}}
var scrollTop=Math.max(doc.documentElement.scrollTop,doc.body.scrollTop);var scrollLeft=Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft);return[box.left+scrollLeft,box.top+scrollTop];}
else{pos=[el.offsetLeft,el.offsetTop];parentNode=el.offsetParent;var hasAbs=this.getStyle(el,'position')=='absolute';if(parentNode!=el){while(parentNode){pos[0]+=parentNode.offsetLeft;pos[1]+=parentNode.offsetTop;if(isSafari&&!hasAbs&&this.getStyle(parentNode,'position')=='absolute'){hasAbs=true;}
parentNode=parentNode.offsetParent;}}
if(isSafari&&hasAbs){pos[0]-=document.body.offsetLeft;pos[1]-=document.body.offsetTop;}}
parentNode=el.parentNode;while(parentNode.tagName&&!patterns.ROOT_TAG.test(parentNode.tagName))
{if(isOpera&&Y.Dom.getStyle(parentNode,'display')!='inline'){pos[0]-=parentNode.scrollLeft;pos[1]-=parentNode.scrollTop;}
parentNode=parentNode.parentNode;}
return pos;};return Y.Dom.batch(el,f,Y.Dom,true);},getX:function(el){var f=function(el){return Y.Dom.getXY(el)[0];};return Y.Dom.batch(el,f,Y.Dom,true);},getY:function(el){var f=function(el){return Y.Dom.getXY(el)[1];};return Y.Dom.batch(el,f,Y.Dom,true);},setXY:function(el,pos,noRetry){var f=function(el){var style_pos=this.getStyle(el,'position');if(style_pos=='static'){this.setStyle(el,'position','relative');style_pos='relative';}
var pageXY=this.getXY(el);if(pageXY===false){return false;}
var delta=[parseInt(this.getStyle(el,'left'),10),parseInt(this.getStyle(el,'top'),10)];if(isNaN(delta[0])){delta[0]=(style_pos=='relative')?0:el.offsetLeft;}
if(isNaN(delta[1])){delta[1]=(style_pos=='relative')?0:el.offsetTop;}
if(pos[0]!==null){el.style.left=pos[0]-pageXY[0]+delta[0]+'px';}
if(pos[1]!==null){el.style.top=pos[1]-pageXY[1]+delta[1]+'px';}
if(!noRetry){var newXY=this.getXY(el);if((pos[0]!==null&&newXY[0]!=pos[0])||(pos[1]!==null&&newXY[1]!=pos[1])){this.setXY(el,pos,true);}}};Y.Dom.batch(el,f,Y.Dom,true);},setX:function(el,x){Y.Dom.setXY(el,[x,null]);},setY:function(el,y){Y.Dom.setXY(el,[null,y]);},getRegion:function(el){var f=function(el){var region=new Y.Region.getRegion(el);return region;};return Y.Dom.batch(el,f,Y.Dom,true);},getClientWidth:function(){return Y.Dom.getViewportWidth();},getClientHeight:function(){return Y.Dom.getViewportHeight();},getElementsByClassName:function(className,tag,root){var method=function(el){return Y.Dom.hasClass(el,className);};return Y.Dom.getElementsBy(method,tag,root);},hasClass:function(el,className){var re=new RegExp('(?:^|\\s+)'+className+'(?:\\s+|$)');var f=function(el){return re.test(el.className);};return Y.Dom.batch(el,f,Y.Dom,true);},addClass:function(el,className){var f=function(el){if(this.hasClass(el,className)){return;}
el.className=[el.className,className].join(' ');};Y.Dom.batch(el,f,Y.Dom,true);},removeClass:function(el,className){var re=new RegExp('(?:^|\\s+)'+className+'(?:\\s+|$)','g');var f=function(el){if(!this.hasClass(el,className)){return;}
var c=el.className;el.className=c.replace(re,' ');if(this.hasClass(el,className)){this.removeClass(el,className);}};Y.Dom.batch(el,f,Y.Dom,true);},replaceClass:function(el,oldClassName,newClassName){if(oldClassName===newClassName){return false;}
var re=new RegExp('(?:^|\\s+)'+oldClassName+'(?:\\s+|$)','g');var f=function(el){if(!this.hasClass(el,oldClassName)){this.addClass(el,newClassName);return;}
el.className=el.className.replace(re,' '+newClassName+' ');if(this.hasClass(el,oldClassName)){this.replaceClass(el,oldClassName,newClassName);}};Y.Dom.batch(el,f,Y.Dom,true);},generateId:function(el,prefix){prefix=prefix||'yui-gen';el=el||{};var f=function(el){if(el){el=Y.Dom.get(el);}else{el={};}
if(!el.id){el.id=prefix+id_counter++;}
return el.id;};return Y.Dom.batch(el,f,Y.Dom,true);},isAncestor:function(haystack,needle){haystack=Y.Dom.get(haystack);if(!haystack||!needle){return false;}
var f=function(needle){if(haystack.contains&&!isSafari){return haystack.contains(needle);}
else if(haystack.compareDocumentPosition){return!!(haystack.compareDocumentPosition(needle)&16);}
else{var parent=needle.parentNode;while(parent){if(parent==haystack){return true;}
else if(!parent.tagName||parent.tagName.toUpperCase()=='HTML'){return false;}
parent=parent.parentNode;}
return false;}};return Y.Dom.batch(needle,f,Y.Dom,true);},inDocument:function(el){var f=function(el){return this.isAncestor(document.documentElement,el);};return Y.Dom.batch(el,f,Y.Dom,true);},getElementsBy:function(method,tag,root){tag=tag||'*';var nodes=[];if(root){root=Y.Dom.get(root);if(!root){return nodes;}}else{root=document;}
var elements=root.getElementsByTagName(tag);if(!elements.length&&(tag=='*'&&root.all)){elements=root.all;}
for(var i=0,len=elements.length;i<len;++i){if(method(elements[i])){nodes[nodes.length]=elements[i];}}
return nodes;},batch:function(el,method,o,override){var id=el;el=Y.Dom.get(el);var scope=(override)?o:window;if(!el||el.tagName||!el.length){if(!el){return false;}
return method.call(scope,el,o);}
var collection=[];for(var i=0,len=el.length;i<len;++i){if(!el[i]){id=el[i];}
collection[collection.length]=method.call(scope,el[i],o);}
return collection;},getDocumentHeight:function(){var scrollHeight=(document.compatMode!='CSS1Compat')?document.body.scrollHeight:document.documentElement.scrollHeight;var h=Math.max(scrollHeight,Y.Dom.getViewportHeight());return h;},getDocumentWidth:function(){var scrollWidth=(document.compatMode!='CSS1Compat')?document.body.scrollWidth:document.documentElement.scrollWidth;var w=Math.max(scrollWidth,Y.Dom.getViewportWidth());return w;},getViewportHeight:function(){var height=self.innerHeight;var mode=document.compatMode;if((mode||isIE)&&!isOpera){height=(mode=='CSS1Compat')?document.documentElement.clientHeight:document.body.clientHeight;}
return height;},getViewportWidth:function(){var width=self.innerWidth;var mode=document.compatMode;if(mode||isIE){width=(mode=='CSS1Compat')?document.documentElement.clientWidth:document.body.clientWidth;}
return width;}};})();YAHOO.util.Region=function(t,r,b,l){this.top=t;this[1]=t;this.right=r;this.bottom=b;this.left=l;this[0]=l;};YAHOO.util.Region.prototype.contains=function(region){return(region.left>=this.left&&region.right<=this.right&&region.top>=this.top&&region.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(region){var t=Math.max(this.top,region.top);var r=Math.min(this.right,region.right);var b=Math.min(this.bottom,region.bottom);var l=Math.max(this.left,region.left);if(b>=t&&r>=l){return new YAHOO.util.Region(t,r,b,l);}else{return null;}};YAHOO.util.Region.prototype.union=function(region){var t=Math.min(this.top,region.top);var r=Math.max(this.right,region.right);var b=Math.max(this.bottom,region.bottom);var l=Math.min(this.left,region.left);return new YAHOO.util.Region(t,r,b,l);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+"}");};YAHOO.util.Region.getRegion=function(el){var p=YAHOO.util.Dom.getXY(el);var t=p[1];var r=p[0]+el.offsetWidth;var b=p[1]+el.offsetHeight;var l=p[0];return new YAHOO.util.Region(t,r,b,l);};YAHOO.util.Point=function(x,y){if(x instanceof Array){y=x[1];x=x[0];}
this.x=this.right=this.left=this[0]=x;this.y=this.top=this.bottom=this[1]=y;};YAHOO.util.Point.prototype=new YAHOO.util.Region();YAHOO.register("dom",YAHOO.util.Dom,{version:"2.2.1",build:"193"});

if(!YAHOO.util.DragDropMgr){YAHOO.util.DragDropMgr=function(){var Event=YAHOO.util.Event;return{ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initalized:false,locked:false,interactionInfo:null,init:function(){this.initialized=true;},POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(sMethod,args){for(var i in this.ids){for(var j in this.ids[i]){var oDD=this.ids[i][j];if(!this.isTypeOfDD(oDD)){continue;}
oDD[sMethod].apply(oDD,args);}}},_onLoad:function(){this.init();Event.on(document,"mouseup",this.handleMouseUp,this,true);Event.on(document,"mousemove",this.handleMouseMove,this,true);Event.on(window,"unload",this._onUnload,this,true);Event.on(window,"resize",this._onResize,this,true);},_onResize:function(e){this._execOnAll("resetConstraints",[]);},lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isLocked:function(){return this.locked;},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,regDragDrop:function(oDD,sGroup){if(!this.initialized){this.init();}
if(!this.ids[sGroup]){this.ids[sGroup]={};}
this.ids[sGroup][oDD.id]=oDD;},removeDDFromGroup:function(oDD,sGroup){if(!this.ids[sGroup]){this.ids[sGroup]={};}
var obj=this.ids[sGroup];if(obj&&obj[oDD.id]){delete obj[oDD.id];}},_remove:function(oDD){for(var g in oDD.groups){if(g&&this.ids[g][oDD.id]){delete this.ids[g][oDD.id];}}
delete this.handleIds[oDD.id];},regHandle:function(sDDId,sHandleId){if(!this.handleIds[sDDId]){this.handleIds[sDDId]={};}
this.handleIds[sDDId][sHandleId]=sHandleId;},isDragDrop:function(id){return(this.getDDById(id))?true:false;},getRelated:function(p_oDD,bTargetsOnly){var oDDs=[];for(var i in p_oDD.groups){for(j in this.ids[i]){var dd=this.ids[i][j];if(!this.isTypeOfDD(dd)){continue;}
if(!bTargetsOnly||dd.isTarget){oDDs[oDDs.length]=dd;}}}
return oDDs;},isLegalTarget:function(oDD,oTargetDD){var targets=this.getRelated(oDD,true);for(var i=0,len=targets.length;i<len;++i){if(targets[i].id==oTargetDD.id){return true;}}
return false;},isTypeOfDD:function(oDD){return(oDD&&oDD.__ygDragDrop);},isHandle:function(sDDId,sHandleId){return(this.handleIds[sDDId]&&this.handleIds[sDDId][sHandleId]);},getDDById:function(id){for(var i in this.ids){if(this.ids[i][id]){return this.ids[i][id];}}
return null;},handleMouseDown:function(e,oDD){this.currentTarget=YAHOO.util.Event.getTarget(e);this.dragCurrent=oDD;var el=oDD.getEl();this.startX=YAHOO.util.Event.getPageX(e);this.startY=YAHOO.util.Event.getPageY(e);this.deltaX=this.startX-el.offsetLeft;this.deltaY=this.startY-el.offsetTop;this.dragThreshMet=false;this.clickTimeout=setTimeout(function(){var DDM=YAHOO.util.DDM;DDM.startDrag(DDM.startX,DDM.startY);},this.clickTimeThresh);},startDrag:function(x,y){clearTimeout(this.clickTimeout);if(this.dragCurrent){this.dragCurrent.b4StartDrag(x,y);this.dragCurrent.startDrag(x,y);}
this.dragThreshMet=true;},handleMouseUp:function(e){if(!this.dragCurrent){return;}
clearTimeout(this.clickTimeout);if(this.dragThreshMet){this.fireEvents(e,true);}else{}
this.stopDrag(e);this.stopEvent(e);},stopEvent:function(e){if(this.stopPropagation){YAHOO.util.Event.stopPropagation(e);}
if(this.preventDefault){YAHOO.util.Event.preventDefault(e);}},stopDrag:function(e){if(this.dragCurrent){if(this.dragThreshMet){this.dragCurrent.b4EndDrag(e);this.dragCurrent.endDrag(e);}
this.dragCurrent.onMouseUp(e);}
this.dragCurrent=null;this.dragOvers={};},handleMouseMove:function(e){if(!this.dragCurrent){return true;}
if(YAHOO.util.Event.isIE&&!e.button){this.stopEvent(e);return this.handleMouseUp(e);}
if(!this.dragThreshMet){var diffX=Math.abs(this.startX-YAHOO.util.Event.getPageX(e));var diffY=Math.abs(this.startY-YAHOO.util.Event.getPageY(e));if(diffX>this.clickPixelThresh||diffY>this.clickPixelThresh){this.startDrag(this.startX,this.startY);}}
if(this.dragThreshMet){this.dragCurrent.b4Drag(e);this.dragCurrent.onDrag(e);this.fireEvents(e,false);}
this.stopEvent(e);return true;},fireEvents:function(e,isDrop){var dc=this.dragCurrent;if(!dc||dc.isLocked()){return;}
var x=YAHOO.util.Event.getPageX(e);var y=YAHOO.util.Event.getPageY(e);var pt=new YAHOO.util.Point(x,y);var pos=dc.getTargetCoord(pt.x,pt.y);var el=dc.getDragEl();curRegion=new YAHOO.util.Region(pos.y,pos.x+el.offsetWidth,pos.y+el.offsetHeight,pos.x);var oldOvers=[];var outEvts=[];var overEvts=[];var dropEvts=[];var enterEvts=[];for(var i in this.dragOvers){var ddo=this.dragOvers[i];if(!this.isTypeOfDD(ddo)){continue;}
if(!this.isOverTarget(pt,ddo,this.mode,curRegion)){outEvts.push(ddo);}
oldOvers[i]=true;delete this.dragOvers[i];}
for(var sGroup in dc.groups){if("string"!=typeof sGroup){continue;}
for(i in this.ids[sGroup]){var oDD=this.ids[sGroup][i];if(!this.isTypeOfDD(oDD)){continue;}
if(oDD.isTarget&&!oDD.isLocked()&&oDD!=dc){if(this.isOverTarget(pt,oDD,this.mode,curRegion)){if(isDrop){dropEvts.push(oDD);}else{if(!oldOvers[oDD.id]){enterEvts.push(oDD);}else{overEvts.push(oDD);}
this.dragOvers[oDD.id]=oDD;}}}}}
this.interactionInfo={out:outEvts,enter:enterEvts,over:overEvts,drop:dropEvts,point:pt,draggedRegion:curRegion,sourceRegion:this.locationCache[dc.id],validDrop:isDrop};if(isDrop&&!dropEvts.length){this.interactionInfo.validDrop=false;dc.onInvalidDrop(e);}
if(this.mode){if(outEvts.length){dc.b4DragOut(e,outEvts);dc.onDragOut(e,outEvts);}
if(enterEvts.length){dc.onDragEnter(e,enterEvts);}
if(overEvts.length){dc.b4DragOver(e,overEvts);dc.onDragOver(e,overEvts);}
if(dropEvts.length){dc.b4DragDrop(e,dropEvts);dc.onDragDrop(e,dropEvts);}}else{var len=0;for(i=0,len=outEvts.length;i<len;++i){dc.b4DragOut(e,outEvts[i].id);dc.onDragOut(e,outEvts[i].id);}
for(i=0,len=enterEvts.length;i<len;++i){dc.onDragEnter(e,enterEvts[i].id);}
for(i=0,len=overEvts.length;i<len;++i){dc.b4DragOver(e,overEvts[i].id);dc.onDragOver(e,overEvts[i].id);}
for(i=0,len=dropEvts.length;i<len;++i){dc.b4DragDrop(e,dropEvts[i].id);dc.onDragDrop(e,dropEvts[i].id);}}},getBestMatch:function(dds){var winner=null;var len=dds.length;if(len==1){winner=dds[0];}else{for(var i=0;i<len;++i){var dd=dds[i];if(this.mode==this.INTERSECT&&dd.cursorIsOver){winner=dd;break;}else{if(!winner||!winner.overlap||(dd.overlap&&winner.overlap.getArea()<dd.overlap.getArea())){winner=dd;}}}}
return winner;},refreshCache:function(groups){var g=groups||this.ids;for(var sGroup in g){if("string"!=typeof sGroup){continue;}
for(var i in this.ids[sGroup]){var oDD=this.ids[sGroup][i];if(this.isTypeOfDD(oDD)){var loc=this.getLocation(oDD);if(loc){this.locationCache[oDD.id]=loc;}else{delete this.locationCache[oDD.id];}}}}},verifyEl:function(el){try{if(el){var parent=el.offsetParent;if(parent){return true;}}}catch(e){}
return false;},getLocation:function(oDD){if(!this.isTypeOfDD(oDD)){return null;}
var el=oDD.getEl(),pos,x1,x2,y1,y2,t,r,b,l;try{pos=YAHOO.util.Dom.getXY(el);}catch(e){}
if(!pos){return null;}
x1=pos[0];x2=x1+el.offsetWidth;y1=pos[1];y2=y1+el.offsetHeight;t=y1-oDD.padding[0];r=x2+oDD.padding[1];b=y2+oDD.padding[2];l=x1-oDD.padding[3];return new YAHOO.util.Region(t,r,b,l);},isOverTarget:function(pt,oTarget,intersect,curRegion){var loc=this.locationCache[oTarget.id];if(!loc||!this.useCache){loc=this.getLocation(oTarget);this.locationCache[oTarget.id]=loc;}
if(!loc){return false;}
oTarget.cursorIsOver=loc.contains(pt);var dc=this.dragCurrent;if(!dc||(!intersect&&!dc.constrainX&&!dc.constrainY)){return oTarget.cursorIsOver;}
oTarget.overlap=null;if(!curRegion){var pos=dc.getTargetCoord(pt.x,pt.y);var el=dc.getDragEl();curRegion=new YAHOO.util.Region(pos.y,pos.x+el.offsetWidth,pos.y+el.offsetHeight,pos.x);}
var overlap=curRegion.intersect(loc);if(overlap){oTarget.overlap=overlap;return(intersect)?true:oTarget.cursorIsOver;}else{return false;}},_onUnload:function(e,me){this.unregAll();},unregAll:function(){if(this.dragCurrent){this.stopDrag();this.dragCurrent=null;}
this._execOnAll("unreg",[]);for(i in this.elementCache){delete this.elementCache[i];}
this.elementCache={};this.ids={};},elementCache:{},getElWrapper:function(id){var oWrapper=this.elementCache[id];if(!oWrapper||!oWrapper.el){oWrapper=this.elementCache[id]=new this.ElementWrapper(YAHOO.util.Dom.get(id));}
return oWrapper;},getElement:function(id){return YAHOO.util.Dom.get(id);},getCss:function(id){var el=YAHOO.util.Dom.get(id);return(el)?el.style:null;},ElementWrapper:function(el){this.el=el||null;this.id=this.el&&el.id;this.css=this.el&&el.style;},getPosX:function(el){return YAHOO.util.Dom.getX(el);},getPosY:function(el){return YAHOO.util.Dom.getY(el);},swapNode:function(n1,n2){if(n1.swapNode){n1.swapNode(n2);}else{var p=n2.parentNode;var s=n2.nextSibling;if(s==n1){p.insertBefore(n1,n2);}else if(n2==n1.nextSibling){p.insertBefore(n2,n1);}else{n1.parentNode.replaceChild(n2,n1);p.insertBefore(n1,s);}}},getScroll:function(){var t,l,dde=document.documentElement,db=document.body;if(dde&&(dde.scrollTop||dde.scrollLeft)){t=dde.scrollTop;l=dde.scrollLeft;}else if(db){t=db.scrollTop;l=db.scrollLeft;}else{}
return{top:t,left:l};},getStyle:function(el,styleProp){return YAHOO.util.Dom.getStyle(el,styleProp);},getScrollTop:function(){return this.getScroll().top;},getScrollLeft:function(){return this.getScroll().left;},moveToEl:function(moveEl,targetEl){var aCoord=YAHOO.util.Dom.getXY(targetEl);YAHOO.util.Dom.setXY(moveEl,aCoord);},getClientHeight:function(){return YAHOO.util.Dom.getViewportHeight();},getClientWidth:function(){return YAHOO.util.Dom.getViewportWidth();},numericSort:function(a,b){return(a-b);},_timeoutCount:0,_addListeners:function(){var DDM=YAHOO.util.DDM;if(YAHOO.util.Event&&document){DDM._onLoad();}else{if(DDM._timeoutCount>2000){}else{setTimeout(DDM._addListeners,10);if(document&&document.body){DDM._timeoutCount+=1;}}}},handleWasClicked:function(node,id){if(this.isHandle(id,node.id)){return true;}else{var p=node.parentNode;while(p){if(this.isHandle(id,p.id)){return true;}else{p=p.parentNode;}}}
return false;}};}();YAHOO.util.DDM=YAHOO.util.DragDropMgr;YAHOO.util.DDM._addListeners();}
(function(){var Event=YAHOO.util.Event;var Dom=YAHOO.util.Dom;YAHOO.util.DragDrop=function(id,sGroup,config){if(id){this.init(id,sGroup,config);}};YAHOO.util.DragDrop.prototype={id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isTarget:true,padding:null,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,deltaX:0,deltaY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,b4StartDrag:function(x,y){},startDrag:function(x,y){},b4Drag:function(e){},onDrag:function(e){},onDragEnter:function(e,id){},b4DragOver:function(e){},onDragOver:function(e,id){},b4DragOut:function(e){},onDragOut:function(e,id){},b4DragDrop:function(e){},onDragDrop:function(e,id){},onInvalidDrop:function(e){},b4EndDrag:function(e){},endDrag:function(e){},b4MouseDown:function(e){},onMouseDown:function(e){},onMouseUp:function(e){},onAvailable:function(){},getEl:function(){if(!this._domRef){this._domRef=Dom.get(this.id);}
return this._domRef;},getDragEl:function(){return Dom.get(this.dragElId);},init:function(id,sGroup,config){this.initTarget(id,sGroup,config);Event.on(this.id,"mousedown",this.handleMouseDown,this,true);},initTarget:function(id,sGroup,config){this.config=config||{};this.DDM=YAHOO.util.DDM;this.groups={};if(typeof id!=="string"){id=Dom.generateId(id);}
this.id=id;this.addToGroup((sGroup)?sGroup:"default");this.handleElId=id;Event.onAvailable(id,this.handleOnAvailable,this,true);this.setDragElId(id);this.invalidHandleTypes={A:"A"};this.invalidHandleIds={};this.invalidHandleClasses=[];this.applyConfig();},applyConfig:function(){this.padding=this.config.padding||[0,0,0,0];this.isTarget=(this.config.isTarget!==false);this.maintainOffset=(this.config.maintainOffset);this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);},handleOnAvailable:function(){this.available=true;this.resetConstraints();this.onAvailable();},setPadding:function(iTop,iRight,iBot,iLeft){if(!iRight&&0!==iRight){this.padding=[iTop,iTop,iTop,iTop];}else if(!iBot&&0!==iBot){this.padding=[iTop,iRight,iTop,iRight];}else{this.padding=[iTop,iRight,iBot,iLeft];}},setInitPosition:function(diffX,diffY){var el=this.getEl();if(!this.DDM.verifyEl(el)){return;}
var dx=diffX||0;var dy=diffY||0;var p=Dom.getXY(el);this.initPageX=p[0]-dx;this.initPageY=p[1]-dy;this.lastPageX=p[0];this.lastPageY=p[1];this.setStartPosition(p);},setStartPosition:function(pos){var p=pos||Dom.getXY(this.getEl());this.deltaSetXY=null;this.startPageX=p[0];this.startPageY=p[1];},addToGroup:function(sGroup){this.groups[sGroup]=true;this.DDM.regDragDrop(this,sGroup);},removeFromGroup:function(sGroup){if(this.groups[sGroup]){delete this.groups[sGroup];}
this.DDM.removeDDFromGroup(this,sGroup);},setDragElId:function(id){this.dragElId=id;},setHandleElId:function(id){if(typeof id!=="string"){id=Dom.generateId(id);}
this.handleElId=id;this.DDM.regHandle(this.id,id);},setOuterHandleElId:function(id){if(typeof id!=="string"){id=Dom.generateId(id);}
Event.on(id,"mousedown",this.handleMouseDown,this,true);this.setHandleElId(id);this.hasOuterHandles=true;},unreg:function(){Event.removeListener(this.id,"mousedown",this.handleMouseDown);this._domRef=null;this.DDM._remove(this);},isLocked:function(){return(this.DDM.isLocked()||this.locked);},handleMouseDown:function(e,oDD){var button=e.which||e.button;if(this.primaryButtonOnly&&button>1){return;}
if(this.isLocked()){return;}
this.b4MouseDown(e);this.onMouseDown(e);this.DDM.refreshCache(this.groups);var pt=new YAHOO.util.Point(Event.getPageX(e),Event.getPageY(e));if(!this.hasOuterHandles&&!this.DDM.isOverTarget(pt,this)){}else{if(this.clickValidator(e)){this.setStartPosition();this.DDM.handleMouseDown(e,this);this.DDM.stopEvent(e);}else{}}},clickValidator:function(e){var target=Event.getTarget(e);return(this.isValidHandleChild(target)&&(this.id==this.handleElId||this.DDM.handleWasClicked(target,this.id)));},getTargetCoord:function(iPageX,iPageY){var x=iPageX-this.deltaX;var y=iPageY-this.deltaY;if(this.constrainX){if(x<this.minX){x=this.minX;}
if(x>this.maxX){x=this.maxX;}}
if(this.constrainY){if(y<this.minY){y=this.minY;}
if(y>this.maxY){y=this.maxY;}}
x=this.getTick(x,this.xTicks);y=this.getTick(y,this.yTicks);return{x:x,y:y};},addInvalidHandleType:function(tagName){var type=tagName.toUpperCase();this.invalidHandleTypes[type]=type;},addInvalidHandleId:function(id){if(typeof id!=="string"){id=Dom.generateId(id);}
this.invalidHandleIds[id]=id;},addInvalidHandleClass:function(cssClass){this.invalidHandleClasses.push(cssClass);},removeInvalidHandleType:function(tagName){var type=tagName.toUpperCase();delete this.invalidHandleTypes[type];},removeInvalidHandleId:function(id){if(typeof id!=="string"){id=Dom.generateId(id);}
delete this.invalidHandleIds[id];},removeInvalidHandleClass:function(cssClass){for(var i=0,len=this.invalidHandleClasses.length;i<len;++i){if(this.invalidHandleClasses[i]==cssClass){delete this.invalidHandleClasses[i];}}},isValidHandleChild:function(node){var valid=true;var nodeName;try{nodeName=node.nodeName.toUpperCase();}catch(e){nodeName=node.nodeName;}
valid=valid&&!this.invalidHandleTypes[nodeName];valid=valid&&!this.invalidHandleIds[node.id];for(var i=0,len=this.invalidHandleClasses.length;valid&&i<len;++i){valid=!Dom.hasClass(node,this.invalidHandleClasses[i]);}
return valid;},setXTicks:function(iStartX,iTickSize){this.xTicks=[];this.xTickSize=iTickSize;var tickMap={};for(var i=this.initPageX;i>=this.minX;i=i-iTickSize){if(!tickMap[i]){this.xTicks[this.xTicks.length]=i;tickMap[i]=true;}}
for(i=this.initPageX;i<=this.maxX;i=i+iTickSize){if(!tickMap[i]){this.xTicks[this.xTicks.length]=i;tickMap[i]=true;}}
this.xTicks.sort(this.DDM.numericSort);},setYTicks:function(iStartY,iTickSize){this.yTicks=[];this.yTickSize=iTickSize;var tickMap={};for(var i=this.initPageY;i>=this.minY;i=i-iTickSize){if(!tickMap[i]){this.yTicks[this.yTicks.length]=i;tickMap[i]=true;}}
for(i=this.initPageY;i<=this.maxY;i=i+iTickSize){if(!tickMap[i]){this.yTicks[this.yTicks.length]=i;tickMap[i]=true;}}
this.yTicks.sort(this.DDM.numericSort);},setXConstraint:function(iLeft,iRight,iTickSize){this.leftConstraint=parseInt(iLeft,10);this.rightConstraint=parseInt(iRight,10);this.minX=this.initPageX-this.leftConstraint;this.maxX=this.initPageX+this.rightConstraint;if(iTickSize){this.setXTicks(this.initPageX,iTickSize);}
this.constrainX=true;},clearConstraints:function(){this.constrainX=false;this.constrainY=false;this.clearTicks();},clearTicks:function(){this.xTicks=null;this.yTicks=null;this.xTickSize=0;this.yTickSize=0;},setYConstraint:function(iUp,iDown,iTickSize){this.topConstraint=parseInt(iUp,10);this.bottomConstraint=parseInt(iDown,10);this.minY=this.initPageY-this.topConstraint;this.maxY=this.initPageY+this.bottomConstraint;if(iTickSize){this.setYTicks(this.initPageY,iTickSize);}
this.constrainY=true;},resetConstraints:function(){if(this.initPageX||this.initPageX===0){var dx=(this.maintainOffset)?this.lastPageX-this.initPageX:0;var dy=(this.maintainOffset)?this.lastPageY-this.initPageY:0;this.setInitPosition(dx,dy);}else{this.setInitPosition();}
if(this.constrainX){this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);}
if(this.constrainY){this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);}},getTick:function(val,tickArray){if(!tickArray){return val;}else if(tickArray[0]>=val){return tickArray[0];}else{for(var i=0,len=tickArray.length;i<len;++i){var next=i+1;if(tickArray[next]&&tickArray[next]>=val){var diff1=val-tickArray[i];var diff2=tickArray[next]-val;return(diff2>diff1)?tickArray[i]:tickArray[next];}}
return tickArray[tickArray.length-1];}},toString:function(){return("DragDrop "+this.id);}};})();YAHOO.util.DD=function(id,sGroup,config){if(id){this.init(id,sGroup,config);}};YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(iPageX,iPageY){var x=iPageX-this.startPageX;var y=iPageY-this.startPageY;this.setDelta(x,y);},setDelta:function(iDeltaX,iDeltaY){this.deltaX=iDeltaX;this.deltaY=iDeltaY;},setDragElPos:function(iPageX,iPageY){var el=this.getDragEl();this.alignElWithMouse(el,iPageX,iPageY);},alignElWithMouse:function(el,iPageX,iPageY){var oCoord=this.getTargetCoord(iPageX,iPageY);if(!this.deltaSetXY){var aCoord=[oCoord.x,oCoord.y];YAHOO.util.Dom.setXY(el,aCoord);var newLeft=parseInt(YAHOO.util.Dom.getStyle(el,"left"),10);var newTop=parseInt(YAHOO.util.Dom.getStyle(el,"top"),10);this.deltaSetXY=[newLeft-oCoord.x,newTop-oCoord.y];}else{YAHOO.util.Dom.setStyle(el,"left",(oCoord.x+this.deltaSetXY[0])+"px");YAHOO.util.Dom.setStyle(el,"top",(oCoord.y+this.deltaSetXY[1])+"px");}
this.cachePosition(oCoord.x,oCoord.y);this.autoScroll(oCoord.x,oCoord.y,el.offsetHeight,el.offsetWidth);},cachePosition:function(iPageX,iPageY){if(iPageX){this.lastPageX=iPageX;this.lastPageY=iPageY;}else{var aCoord=YAHOO.util.Dom.getXY(this.getEl());this.lastPageX=aCoord[0];this.lastPageY=aCoord[1];}},autoScroll:function(x,y,h,w){if(this.scroll){var clientH=this.DDM.getClientHeight();var clientW=this.DDM.getClientWidth();var st=this.DDM.getScrollTop();var sl=this.DDM.getScrollLeft();var bot=h+y;var right=w+x;var toBot=(clientH+st-y-this.deltaY);var toRight=(clientW+sl-x-this.deltaX);var thresh=40;var scrAmt=(document.all)?80:30;if(bot>clientH&&toBot<thresh){window.scrollTo(sl,st+scrAmt);}
if(y<st&&st>0&&y-st<thresh){window.scrollTo(sl,st-scrAmt);}
if(right>clientW&&toRight<thresh){window.scrollTo(sl+scrAmt,st);}
if(x<sl&&sl>0&&x-sl<thresh){window.scrollTo(sl-scrAmt,st);}}},applyConfig:function(){YAHOO.util.DD.superclass.applyConfig.call(this);this.scroll=(this.config.scroll!==false);},b4MouseDown:function(e){this.setStartPosition();this.autoOffset(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));},b4Drag:function(e){this.setDragElPos(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));},toString:function(){return("DD "+this.id);}});YAHOO.util.DDProxy=function(id,sGroup,config){if(id){this.init(id,sGroup,config);this.initFrame();}};YAHOO.util.DDProxy.dragElId="ygddfdiv";YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){var self=this;var body=document.body;if(!body||!body.firstChild){setTimeout(function(){self.createFrame();},50);return;}
var div=this.getDragEl();if(!div){div=document.createElement("div");div.id=this.dragElId;var s=div.style;s.position="absolute";s.visibility="hidden";s.cursor="move";s.border="2px solid #aaa";s.zIndex=999;body.insertBefore(div,body.firstChild);}},initFrame:function(){this.createFrame();},applyConfig:function(){YAHOO.util.DDProxy.superclass.applyConfig.call(this);this.resizeFrame=(this.config.resizeFrame!==false);this.centerFrame=(this.config.centerFrame);this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);},showFrame:function(iPageX,iPageY){var el=this.getEl();var dragEl=this.getDragEl();var s=dragEl.style;this._resizeProxy();if(this.centerFrame){this.setDelta(Math.round(parseInt(s.width,10)/2),Math.round(parseInt(s.height,10)/2));}
this.setDragElPos(iPageX,iPageY);YAHOO.util.Dom.setStyle(dragEl,"visibility","visible");},_resizeProxy:function(){if(this.resizeFrame){var DOM=YAHOO.util.Dom;var el=this.getEl();var dragEl=this.getDragEl();var bt=parseInt(DOM.getStyle(dragEl,"borderTopWidth"),10);var br=parseInt(DOM.getStyle(dragEl,"borderRightWidth"),10);var bb=parseInt(DOM.getStyle(dragEl,"borderBottomWidth"),10);var bl=parseInt(DOM.getStyle(dragEl,"borderLeftWidth"),10);if(isNaN(bt)){bt=0;}
if(isNaN(br)){br=0;}
if(isNaN(bb)){bb=0;}
if(isNaN(bl)){bl=0;}
var newWidth=Math.max(0,el.offsetWidth-br-bl);var newHeight=Math.max(0,el.offsetHeight-bt-bb);DOM.setStyle(dragEl,"width",newWidth+"px");DOM.setStyle(dragEl,"height",newHeight+"px");}},b4MouseDown:function(e){this.setStartPosition();var x=YAHOO.util.Event.getPageX(e);var y=YAHOO.util.Event.getPageY(e);this.autoOffset(x,y);this.setDragElPos(x,y);},b4StartDrag:function(x,y){this.showFrame(x,y);},b4EndDrag:function(e){YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");},endDrag:function(e){var DOM=YAHOO.util.Dom;var lel=this.getEl();var del=this.getDragEl();DOM.setStyle(del,"visibility","");DOM.setStyle(lel,"visibility","hidden");YAHOO.util.DDM.moveToEl(lel,del);DOM.setStyle(del,"visibility","hidden");DOM.setStyle(lel,"visibility","");},toString:function(){return("DDProxy "+this.id);}});YAHOO.util.DDTarget=function(id,sGroup,config){if(id){this.initTarget(id,sGroup,config);}};YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){return("DDTarget "+this.id);}});YAHOO.register("dragdrop",YAHOO.util.DragDropMgr,{version:"2.2.1",build:"193"});





/**
 * Grease Monkey Simulator. Allows testing grease monkey scripts, by assigning dummy values to 
 * all the grease monkey scripts
 * 
 */

var GMSim = 
{
	/**
	 * Writes data to firebug
	 */
	writeToFirebug : function(message)
	{
		if (console && console.log)
		{
			console.log(message);
		}		
	},

	/**
	 * Responsible for changing the default M Behaviour
	 */
	initializeGMFunctions : function()
	{
		unsafeWindow = window;
		GM_log = GMSim.log;
		GM_registerMenuCommand = GMSim.registerMenuCommand;
		GM_setValue = GMSim.setValue;
		GM_getValue = GMSim.getValue;
		GM_xmlhttpRequest = GMSim.xmlhttpRequest;
	},
	
	/**
	 * Equvivalent of GM_log
	 */
	log : function(message)
	{
		GMSim.writeToFirebug("GM_log > " + message);		
	},
	
	/**
	 * Sets the value of stuff in the Store
	 */
	setValue : function(key, data)
	{
		GMSim.writeToFirebug("GM_setValue > " + key + " = " + data);
		GMSim.setCookie(key,data);
	},
	
	/**
	 * Gets a value of something from the store
	 */
	getValue : function(key)
	{
		GMSim.writeToFirebug("GM_getValue > " + key);
		return GMSim.readCookie(key);
	},
	
	/**
	 * Register a command in the Tools > GM > User Scripts
	 */
	registerMenuCommand : function (menuText , callbackFunction)
	{
		var gmMenu = document.getElementById("_gmSimulator_Menu");
		if (gmMenu == null)
		{
			// this is the first time the menu is getting created. So create the document element 
			var gmMenu = document.createElement('div');
			gmMenu.id = "_gmSimulator_Menu";
			gmMenu.style.backgroundColor = "#ECEEF6";
			gmMenu.style.border = "SOLID #6678B8 1px";
			gmMenu.style.padding = "4px";
			gmMenu.style.fontFamily = "verdana";
			gmMenu.style.fontSize = "11px";
			
			document.getElementById("_gmSimulator_console").appendChild(gmMenu);
		}
		// Now adding the actual menu item
		var newMenuItem = document.createElement("DIV");
		newMenuItem.style.cursor = "pointer"
		newMenuItem.innerHTML = menuText;

		newMenuItem.addEventListener("mouseover",function(e){e.target.style.backgroundColor = "#C9D0E6"}, true );
		newMenuItem.addEventListener("mouseout",function(e){e.target.style.backgroundColor = "#ECEEF6"}, true );
		
		gmMenu.appendChild(newMenuItem);

		if (typeof(callbackFunction) == "function")
		{
			newMenuItem.addEventListener("click", callbackFunction, true);
		}
		
		GMSim.writeToFirebug("GM_registerMenuCommand > " + menuText);
	},
	
	/**
	 * Imitation of the XMLHTTP request. Limitation with the simulator is that 
	 * only same site http requests are possible
	 */
	xmlhttpRequest : function(xmlObj)
	{
		GMSim.writeToFirebug("GM_xmlhttpRequest > " +  xmlObj.url + " " + xmlObj.method);
		// calling the onReturn function
		var xhReq = new XMLHttpRequest();
		xhReq.open(xmlObj.method, xmlObj.url, true);
		// setting the XML headers
		for (headerFields in xmlObj.headers)
		{
			xhReq.setRequestHeader(headerFields, xmlObj.headers[headerFields]);
		}
			
		xhReq.onreadystatechange = 
						function()
						{
							if (xhReq.readyState == 4 && typeof(xmlObj.onload) == "function")
							{
								xmlObj.onload.call(this,xhReq);
							}
						}
		xhReq.send(null);
	},
	
	/**
	 * Responsible for setting a cookie
	 */
	setCookie : function(name,value)
	{
		var days = 100;
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
		document.cookie = name+"="+ value +expires+"; path=/";
	},
	
	/**
	 * Gets the value of a cookie
	 */
	readCookie : function(name) 
	{
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) 
		{
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) 
				return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	
	/**
 	* Deletes all the cookies 
	*/
	deleteCookies : function()
	{
		C=document.cookie.split("; ");
		for(d="."+location.host;d;d=(""+d).substr(1).match(/..*$/))
			for(sl=0;sl<2;++sl)
				for(p="/"+location.pathname;p;p=p.substring(0,p.lastIndexOf('/')))
					for(i in C)if(c=C[i])
					{
							document.cookie=c+"; domain="+d.slice(sl)+"; path="+p.slice(1)+"/"+"; expires="+new Date((new Date).getTime()-1e11).toGMTString()
					}
		GMSim.writeToFirebug("Cookies Deleted");
		GMSim.toggleCookies(false);
	},
	
	toggleCookies : function(state)
	{
		var cookieString = document.cookie;
		if (cookieString == "")
		{
			cookieString = "No Cookies Found"
		}
		var cookieDiv = document.getElementById("_gmSimulator_CookieView");
		
		if (typeof(state) != "undefined")
		{
			if (state == false)
			{
				cookieDiv.style.display = "";	
			}
			else 
			{
				cookieDiv.style.display = "none";
			}
		}
		
		// adding HTML to the cookie
		var newString = "";
		while (newString != cookieString)
		{
			newString = cookieString;
			cookieString = cookieString.replace("=","</td><td>");
			cookieString = cookieString.replace(";","</td></tr><tr><td>");
		}
		
		cookieDiv.innerHTML = '<table style = "border : SOLID 1px #BA9968; padding : 4 px; font-size:10;font-family: verdana;"><tr><td>'
		+ cookieString + "</td></tr></table>";
		
		var cookieLink = document.getElementById("_gmSimulator_CookieLink");
		if (cookieDiv.style.display == "none")
		{
			cookieDiv.style.display = ""
			cookieLink.innerHTML = "Hide";
		}
		else 
		{
			cookieDiv.style.display = "none"
			cookieLink.innerHTML = "Show";
		}
	},
	
	/**
	 * Initialises the Simulator
	 */
	init : function()
	{
		GMSim.initializeGMFunctions();
		GMSim.createPanel();
	},

	/**
	 * Responsible for creating the Grease Monkey Control Panel
	 */
	createPanel : function()
	{
		// Creating the control Panel
		var newDiv = document.createElement('div');
		newDiv.id = "_gmSimulator_console";
		newDiv.style.position = 'absolute';
		newDiv.style.backgroundColor = "#E0EDFE";
		newDiv.style.border = "SOLID #6678B8 3px";
		newDiv.style.padding = "5px";
		newDiv.style.width = window.innerWidth / 3;
		newDiv.style.overflow = "hidden";
		
		newDiv.innerHTML =  '<DIV id = "_gmSimulator_console_handle" style="background-color: #C3D9FF; font-size:14;font-family: verdana; padding: 4px; border-bottom: SOLID 1px #6678B8; border-right: SOLID 1px #6678B8;">' +
					'<CENTER>:: GM Simulator ::<CENTER></DIV>' +
					'<DIV style=\"font-family: verdana; font-size : 12; padding : 2px\">' +
					'GM Store : ' +
					'<A HREF = "javascript:GMSim.deleteCookies()"> Delete </A>' +
					'&nbsp;&nbsp;|&nbsp;&nbsp; ' + 
					'<A HREF = "javascript:GMSim.toggleCookies()" id = "_gmSimulator_CookieLink"> Show </A>' +
					'</DIV>' +
					'<DIV id = "_gmSimulator_CookieView" style = "border : #C3D9FF 1px Solid ; display:none; overflow: auto; width : 100%" ></DIV>' +
					'<HR>';
		
		document.body.appendChild(newDiv);
		console.gmSimulatorDiv = newDiv;
		var dd = new YAHOO.util.DD(newDiv);
		dd.setHandleElId("_gmSimulator_console_handle");
		
	}
}


GMSim.init()