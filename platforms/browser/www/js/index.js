/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var sites_map={};
var siteStored=null;
var stored_org_index=0;
var stored_campus_id=null;
var stored_msg;



var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //document.addEventListener('pagebeforeshow', this.onPagebeforeshow, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:none;');

        console.log('Received Event: ' + id);
        siteStored = window.localStorage.getItem("site_id");
		stored_campus_id = window.localStorage.getItem("campus_name");
		
		
        $.getJSON("http://afm.integratedfm.com.au/sisfm-mobile/sisfm-urls.json", function(msg){
            var res = msg;
            stored_msg=msg;
			var site, site_id, t, k;
			var lil= $("#sites");
            var org_page_title = msg.org_page_header;
            var org_page_image = msg.org_page_image;
			            
            var el;
			var sites=msg.sites;
			
            $("#org_page_header").text(org_page_title);
			
            $("#org-page-image-place-holder")[0].src=msg.org_page_image;
			
            lil.empty();///empty menu list
			
            t='<option id="OPTIONID" value="VALUE" >OPTIONTEXT</option>';
			console.log('Got sites: ');
			
            for(k=0; k<res.sites.length; k++){
				site = sites[k];
				site_id=site.id;
				sites_map[site_id]=site;
				image = site.image;
								
				el = t.replace('OPTIONID', site_id)					
					.replace("VALUE", site_id)
					.replace("OPTIONTEXT", site.name)
										
				lil.append(el);                

             }
			
            window.screen.orientation.lock("portrait");
			
			
			 if (siteStored !="" && siteStored !=null && stored_campus_id !=null 
				 &&siteStored !="null" && stored_campus_id !="null" ){
				onSiteClick(siteStored);//goto stored site of the stored org
				window.location.href="#nav-page";
                return;				             
			}else {
				
				stored_org_index=0;
				goToHomePage();
                return;

			}
			
        }).fail( function() {alert("Connection to server failed. Please Try again Later.");})
		.isRejected(function() {alert("Connection to server is Rejected. Please Try again Later.");});
                
    },
    //configures onclick parameters of the Select Button to sisfm url of the selected campus
     goToSisfmSite: function(){
        var sbt = $("#goto-sisfm-button");
        var osel= $("#campuses")[0];
        var selOption=null;
         if (osel.selectedIndex <0){
            osel.selectedIndex = window.localStorage.getItem("selected_index");
            if (osel.selectedIndex ==null || osel.selectedIndex <0 ){
                alert("Please select one of the options from the menu");
                return;
            } 
         }

        selOption= osel[osel.selectedIndex];
        window.localStorage.setItem("selected_index", osel.selectedIndex);
        window.localStorage.setItem("campus_name", selOption.id);

		 stored_campus_id = selOption.id;
		 
        siteStored=window.localStorage.getItem("site_id");
        cordova.InAppBrowser.open(selOption.getAttribute("sisfm_url"), '_system');
        window.location.href="#nav-page";
      
    }

};

function onOrgSelected(){
    var org_selector_index;
    var org_soption;
    var site_id=null;
    org_selector_index = parseInt($("#sites")[0].selectedIndex);//get selected option index
    stored_org_index = org_selector_index;
    org_soption = $("#sites")[0].options[org_selector_index];
    site_id = org_soption.id;
    onSiteClick(site_id);
};

/*
* gets Sites for the selected Org and add them to the menu of the campuses
*/

function onSiteClick(site_id) {
        //alert("Inside method, page =" + ev);
    
	var site = sites_map[site_id];
	var image_sz= site.image_size;
	var page_color=site.screen_color;
	var campuses = site.campuses;
	var cur_site_id =  window.localStorage.getItem("site_id");
	var cur_sel_id=null;
    var k, el, campus, image, campus_name, sisfm_url, t, org_soption, org_selector_index;
    
    org_selector_index = parseInt($("#sites")[0].selectedIndex);//get selected option index
    
    window.localStorage.setItem("org_selector_index", org_selector_index);//store selected index 
    
    org_soption = $("#sites")[0].options[org_selector_index];
    
    var lil= $("#campuses");
    var selected_index=null;
	var soption=null;
    var osel=null;
    var campus_menu=null;
	var org_image;
	
	window.localStorage.setItem("site_id", site_id);
			
	t='<option id="CAMPUSID" sisfm_url="SISURL" value="VALUE" >OPTIONTEXT</option>';
		
	lil.empty();
   
	for(k=0; k<campuses.length; k++){
		campus= campuses[k];
		image = campus.image;
		campus_name = campus.campus_name;
		sisfm_url = campus['sisfm-url'];
		
		el = t.replace('CAMPUSID', campus_name)						
			.replace("VALUE", campus_name)
			.replace("SISURL", sisfm_url)
			.replace("OPTIONTEXT", campus_name);
		
		lil.append(el);
    }
    selected_index = 0;
	if (cur_site_id == site_id){
		selected_index =  window.localStorage.getItem("selected_index");   
        if (selected_index ==null){
            selected_index = 0;
        }
	}
    if (selected_index !=null){
            osel = lil[0];
           soption= osel.options[selected_index];
            campus_menu = lil.selectmenu();
            campus_menu.ready();
            //campus_menu.selectmenu('refresh');
            $("#campuses option[value='"+soption.value+"']").attr('selected', 'selected');
            
            lil.selectmenu('refresh');
                        
    }
	$("#campuses-page-header").text(site.org_header_title);
    $("#campuses-page-footer").text(site.org_footer_title);
    $("#campus-page-image-place-holder")[0].src=site.image_url;//campuses_page_image_style
	//$("#campus-page-image-place-holder")[0].style=stored_msg.campuses_page_image_style;
	
	window.location.href="#nav-page";
	alignCampusesPageImage(image_sz);	
	$(".page-sisfm-campuses").css("background-color",site.screen_color);
				        
};
function goToHomePage(){
    var org_index=stored_org_index;//window.localStorage.getItem("org_selector_index");
    var lil= $("#sites");
    var osel=null;
    var soption, org_menu;
    if (org_index ==null || org_index <0){
        org_index=0;
    }
    osel=lil[0];
    soption= osel.options[org_index];
    $("#sites option[value='"+soption.value+"']").attr('selected', 'selected');
            
    lil.selectmenu('refresh');
            
    window.localStorage.setItem("site_id", null);
	window.localStorage.setItem("campus_name", null);
	//org-page-image-place-holder
		
	window.location.href="#map-mobile-home-page";
	alignOrgPageImage(stored_msg.image_size);
};

function getRealContentHeight() {
    var screen = $.mobile.getScreenHeight(),
    header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
    footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
    contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
    content_height = screen - header - footer - contentCurrent;
    return content_height;
};

function alignOrgPageImage(sz){
	var org_page_image=null;
	org_page_image=$("#org-page-image-place-holder")[0];
	if (org_page_image==null){
		return;
	}
	
	var image_left = $.mobile.window.width() / 2 - sz/2;//org_page_image.width/2;
	$(".image-custom").css('left', image_left);
	$(".page-sisfm-org").css("background-color",stored_msg.screen_color);
	
};

function alignCampusesPageImage(sz){	
	var campuses_image=null;
	campuses_image=$("#campus-page-image-place-holder")[0];
	if(campuses_image==null){
		return;
	}
	var campuses_image_left = $.mobile.window.width() / 2 - sz/2;//campuses_image.width/2;	
	$(".image-custom").css('left', campuses_image_left);
	
};
