(function($){var cname='advads_procfp';var cname_vc='advanced_ads_ad_clicks';var PATH=null;var DOMAIN=null;function jsonDecode(str){try{var res=JSON.parse(str);return res}catch(Ex){return null}}
$(document).on('advads-passive-cb-conditions',function(e,cbs){cbs.conditions.ad_clicks='check_ad_clicks';cbs.check_ad_clicks=function(options,ad){if(advads.cookie_exists(cname_vc+'_'+ad.id)){var C_vc=advads.get_cookie(cname_vc+'_'+ad.id);C_vc=jsonDecode(C_vc)}
if(C_vc){var now=parseInt(new Date().getTime()/1000);for(var i in C_vc){if('_'+options.expiration==i){if(C_vc[i].ttl>=now&&C_vc[i].count>=parseInt(options.limit)){return!1}}}}
return!0}});var cfpTracker=function(){this.$elements={};this.currentIFrame=!1;this.focusLost=!1;this.init()}
cfpTracker.prototype={constructor:cfpTracker,init:function(){var that=this;$(document).on('click','a[data-cfpa]',function(){that.onClick(parseInt($(this).attr('data-cfpa')))});$(window).on('blur',function(){if(!1!==that.currentIFrame){that.onClick(that.currentIFrame);that.currentIFrame=!1;that.focusLost=!0}});$(document).on('mouseenter','div[data-cfpa]',function(){var id=parseInt($(this).attr('data-cfpa'));that.addElement(id)})},addElement:function($el){if(!1===$el instanceof jQuery){$el=$('div[data-cfpa="'+$el+'"]').first()}
var hasIframe=$el.find('iframe').length?!0:!1;if(!hasIframe){if(!$el.find('a').length){return}}
var adID=parseInt($el.attr('data-cfpa'));this.$elements[adID]=$el;$el.removeAttr('data-cfpa');if(hasIframe){$el.find('iframe').first().attr({'data-cfpa':adID,})
if($el.attr('data-cfph')){$el.find('iframe').first().attr({'data-cfph':$el.attr('data-cfph'),})}}else{$el.find('a').not('.advads-edit-button').first().attr({'data-cfpa':adID,})
if($el.attr('data-cfph')){$el.find('a').not('.advads-edit-button').first().attr({'data-cfph':$el.attr('data-cfph'),})}}
$el.removeAttr('data-cfph');if(advads.cookie_exists(cname_vc+'_'+adID)){var C_vc=advads.get_cookie(cname_vc+'_'+adID);C_vc=jsonDecode(C_vc);if(C_vc){var now=parseInt(new Date().getTime()/1000),cookie_modified=!1;for(var i in C_vc){if(!C_vc.hasOwnProperty(i))continue;if('exp'==i)continue;if(C_vc[i].ttl<now){var period=parseFloat(i.substr(1));var newTTL=C_vc[i].ttl;while(newTTL<now){newTTL+=period*60*60}
C_vc[i].ttl=newTTL;C_vc[i].count=0;cookie_modified=!0}}
if(cookie_modified){var expTime=new Date(C_vc.exp);advads.set_cookie_sec(cname_vc+'_'+adID,JSON.stringify(C_vc,'false',!1),parseInt(expTime.getTime()/1000),PATH,DOMAIN)}}}},_banVisitor:function(){var now=new Date();var d=new Date();d.setTime(d.getTime()+(advadsCfpBan*24*60*60*1000));var ban=(d.getTime()-now.getTime())/1000;advads.set_cookie_sec('advads_pro_cfp_ban',1,ban,PATH,DOMAIN);jQuery('[data-cfptl]').remove()},onClick:function(ID){var C=!1,C_vc=!1,that=this;if($('[data-cfpa="'+ID+'"]').attr('data-cfph')){if(advads.cookie_exists(cname_vc+'_'+ID)){C_vc=advads.get_cookie(cname_vc+'_'+ID);C_vc=jsonDecode(C_vc)}
if(C_vc){for(var h in C_vc){if(!C_vc.hasOwnProperty(h))continue;if('exp'==h)continue;var count=parseInt(C_vc[h].count);C_vc[h].count=count+1}
var now=new Date();var expiry=new Date(C_vc.exp);var expirySecs=parseInt((expiry.getTime()-now.getTime())/1000);advads.set_cookie_sec(cname_vc+'_'+ID,JSON.stringify(C_vc,'false',!1),expirySecs,PATH,DOMAIN)}else{var H=$('[data-cfpa="'+ID+'"]').attr('data-cfph').split('_');var cval={},maxHValue=0;var d=new Date();var now=new Date();for(var h in H){if(parseFloat(H[h])>maxHValue){maxHValue=parseFloat(H[h])}
cval['_'+H[h]]={count:1,ttl:parseInt(((now.getTime()/1000)+(parseFloat(H[h])*3600))),}}
d.setTime(d.getTime()+(maxHValue*60*60*1000));var expires="expires="+d.toUTCString();var expirySecs=parseInt((d.getTime()-now.getTime())/1000);cval.exp=expires;advads.set_cookie_sec(cname_vc+'_'+ID,JSON.stringify(cval,'false',!1),expirySecs,PATH,DOMAIN)}}
if(advads.cookie_exists(cname+'_'+ID)){C=advads.get_cookie(cname+'_'+ID);C=jsonDecode(C)}
if(C){var count=parseInt(C.count);C.count=count+1;var now=new Date();var expiry=new Date(C.exp);var expirySecs=(expiry.getTime()-now.getTime())/1000;advads.set_cookie_sec(cname+'_'+ID,JSON.stringify(C,'false',!1),expirySecs,PATH,DOMAIN);if(advadsCfpClickLimit<=C.count&&'undefined'!=typeof advadsCfpBan){that._banVisitor()}}else{var d=new Date();var now=new Date();d.setTime(d.getTime()+(advadsCfpExpHours*60*60*1000));var expires="expires="+d.toUTCString();var expirySecs=(d.getTime()-now.getTime())/1000;advads.set_cookie_sec(cname+'_'+ID,'{"count":1,"exp":"'+expires+'"}',expirySecs,PATH,DOMAIN);if(advadsCfpClickLimit===1&&'undefined'!=typeof advadsCfpBan){that._banVisitor()}}},}
$(function(){window.advadsProCfp=new cfpTracker();$(document).on('mouseenter','iframe[data-cfpa]',function(){var ID=parseInt($(this).attr('data-cfpa'));advadsProCfp.currentIFrame=ID}).on('mouseleave','[data-cfpa]',function(){advadsProCfp.currentIFrame=!1;if(advadsProCfp.focusLost){advadsProCfp.focusLost=!1;$(window).trigger('focus')}});for(var i in advadsCfpQueue){if(advadsCfpQueue.hasOwnProperty(i)){advadsProCfp.addElement(advadsCfpQueue[i])}}
advadsCfpQueue=[];if('undefined'==typeof window.advadsCfpPath)return;if(''!=advadsCfpPath){PATH=advadsCfpPath}
if(''!=advadsCfpDomain){DOMAIN=advadsCfpDomain}})})(window.jQuery)