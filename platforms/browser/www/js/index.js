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
        siteStored = getStoredSite();
        
        jQuery.getJSON("http://afmtest.integratedfm.com.au/sisfm-mobile/sisfm-urls.json", function(msg){
            var res = msg;
			var site, site_id;
			var lil= $("#sites");
			console.log('Got UL: ');
			var t='<li   id="SITEID" onclick="onSiteClick(SITEID)" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><img border="0" alt="SITENAME Icon" src="SITEIMAGESRC" class="ui-li-thumb"> SITENAME</a></li>';
			//t='<li id="SITEID"><a href="#nav-page" onclick="onSiteClick(SITEID)">SITENAME</a></li>';
			var el;
			var sites=msg.sites;
			console.log('Got sites: ');
			
            for(var k=0; k<res.sites.length; k++){
				site = sites[k];
				site_id=site.id;
				sites_map[site_id]=site;
				image = site.image;
				
				
				el = t.replace('SITEID', site_id)
					.replace('SITEID', "'"+site_id+"'")
					.replace("SITEIMAGESRC", site.image)
					.replace("SITENAME", site.name)
					.replace("SITENAME", site.name);
					
				lil.append(el);
                lil.append("<li/>")

             }
			
			 if (siteStored=="" || siteStored==null ){
            
            	window.location.href="#map-mobile-home-page";
            
			}else {
				//setToSiteCampus();
                onSiteClick(siteStored);
				window.location.href="#nav-page";
			}
        });
        
       
        
    },
	
	/* saves selected campus id within site and navigates to  the sisfm of the campus
	 * id is campus id, 
	 * url is sisfm url
	*/
    openCampusSisfm: function(url, id){
		var campuses = $("#campuses");
		var site_id = window.localStorage.getItem("site_id");
		
		window.localStorage.setItem("campus_id", id);				
		
        cordova.InAppBrowser.open(url, '_system');
    }
};

function getStoredSite(){
    var siteId = window.localStorage.getItem("site_id");
    return siteId;
};

/*gets campuses for the selected site and add them to the list view of the campuses
*It hides all but the one stored in window local storage
*/
function setToSiteCampus(){
	var campus_id =  window.localStorage.getItem("campus_id");
	var site_id = window.localStorage.getItem("site_id");
	
	var site = sites_map[site_id];
	var campuses = site.campuses;

	
	
	var lil= $("#campuses");
	var t='<li id="CAMPUSID" hidden=true onclick="app.openCampusSisfm(SISFM-URL,CAMPUS-ID)"><img border="0" alt="CAMPUS Icon" src="CAMPUSIMAGESRC" width="50" height="50"><label>CAMPUSNAME</label></li>';
    t='<li data-inset="true" id="CAMPUSID" onclick="app.openCampusSisfm(SISFM-URL,CAMPUS-ID)"><a href="#" ><img border="0" alt="CAMPUS Icon" src="CAMPUSIMAGESRC" width="50" height="50">CAMPUSNAME</a></li>';
	var k, el, campus, image, campus_name, sisfm_url;
	
	lil.empty();
	
	for(k=0; k<campuses.length; k++){
		campus= campuses[k];
		image = campus.image;
		campus_name = campus.campus_name;
		sisfm_url = campus['sisfm-url'];
				
		el = t.replace('CAMPUSID', campus_name)
			.replace('SISFM-URL', "'"+sisfm_url+"'")
			.replace('CAMPUS-ID', "'"+campus_name+"'")
			.replace("CAMPUSIMAGESRC", image)
			.replace("CAMPUS", campus_name)
			.replace("CAMPUSNAME", campus_name);
		if ( campus_name == campus_id){
			el =el.replace("hidden=true", "hidden=false");
		}
		
		lil.append(el);
    }

	
}

/*
* gets campuses for the selected site and add them to the list view of the campuses
*/

function onSiteClick(site_id) {
        //alert("Inside method, page =" + ev);
	var site = sites_map[site_id];
	var campuses = site.campuses;
	window.localStorage.setItem("site_id", site_id);
	
	
	var lil= $("#campuses");
	var t='<li data-inset="true" id="CAMPUSID" onclick="app.openCampusSisfm(SISFM-URL,CAMPUS-ID)" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><img border="0" alt="CAMPUS Icon" src="CAMPUSIMAGESRC"  class="ui-li-thumb">CAMPUSNAME</a></li>';
	var k, el, campus, image, campus_name, sisfm_url;
	
	lil.empty();
	
	for(k=0; k<campuses.length; k++){
		campus= campuses[k];
		image = campus.image;
		campus_name = campus.campus_name;
		sisfm_url = campus['sisfm-url'];
				
		el = t.replace('CAMPUSID', campus_name)
			.replace('SISFM-URL', "'"+sisfm_url+"'")
			.replace('CAMPUS-ID', "'"+campus_name+"'")
			.replace("CAMPUSIMAGESRC", image)
			.replace("CAMPUS", campus_name)
			.replace("CAMPUSNAME", campus_name);
		
		lil.append(el);
    }
	window.location.href="#nav-page";
	
				        
};

function goToHomePage(){
	window.location.href="#map-mobile-home-page";
};


