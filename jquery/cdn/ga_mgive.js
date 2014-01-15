/*********************************************************/
    // Sticky cookie and GA JS Code
    /*functions: createCookie
                readCookie
                eraseCookie
                getQueryVariable
                stickyMsourceCookie
                track_nav
                track_banner
                track_link
                track_button
                track_video
                track_pdf
      Description: code associated with reading and creating the msource code. 
                Code associated with Google Analytics
      History: created 12/3/2012 - MRK
    */
/*********************************************************/


//Create a cookie
function createCookie(name, value, minutes) {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    //var domain = location.hostname.replace('www', '');

    var parsedDomain = location.hostname.split('.');
    var lastIndex = parsedDomain.length - 1;
    var domain = '.' + parsedDomain[lastIndex - 1] + '.' + parsedDomain[lastIndex];
    cookieStr = name + "=" + value + expires + "; path=/; domain=" + domain;
    document.cookie = cookieStr;

}

//Read Cookies
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

//Delete a cookie
function eraseCookie(name) {
    var d = new Date();
    document.cookie = name + "=1;expires=" + d.toGMTString() + ";" + ";";
}

//Get the querystring from the URL
function getQueryVariable(variable) { var query = window.location.search.substring(1); var vars = query.split("&"); for (var i = 0; i < vars.length; i++) { var pair = vars[i].split("="); if (pair[0] == variable) { return pair[1]; } } return '' }

//Search for items in an array.
function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

//Sticks the msource cookie to links and forms
function stickyMsourceCookie() {
    //Read the msource from the cookie.
    var msource = readCookie('msource');
    //If available...
    if (msource) {
        //Splitting the msource using regex
        //Delimeters  = , | %2C
        var splitMsource = msource.split(/,|%2C/);
        var lastIndex = splitMsource.length - 1;
        msource = splitMsource[lastIndex];

        //get the current domain
        var parsedDomain = location.hostname.split('.');
        var endIndex = parsedDomain.length - 1;
        var domain = '.' + parsedDomain[endIndex - 1] + '.' + parsedDomain[endIndex];

        //Append msource to links
        var links = document.links;
        for (var i = 0; i < links.length; i++) {
            if (links[i]) {
                var link = links[i].href;
                if (link.indexOf('mailto:') == -1 && link.indexOf('javascript:') == -1 && unescape(link).indexOf('return false') == -1 && link.indexOf('#') == -1) {
                    if (link.indexOf(domain) > -1 || link.indexOf('http://') != 0 && link.indexOf('mailto:') > 0) {
                        var s = new Array;
                        var newLink = link;
                        if (link.indexOf('?') > -1) {
                            var d = link.substring(0, link.indexOf('?'));
                            var l = link.substring(link.indexOf('?') + 1, link.length);
                            var s = l.split('&');
                            for (j = 0; j < s.length; j++) {
                                if (s[j].indexOf('msource') > -1) {
                                    s[j] = 'msource=' + msource;
                                    var changed = 1;
                                }
                            }
                            if (changed != 1) {
                                s[s.length] = 'msource=' + msource;
                            }
                            newLink = d + '?' + s.join('&');
                            changed = 0;
                            delete changed;
                            delete s;
                            delete j;
                        } else {
                            newLink = link + '?msource=' + msource;
                        }
                        links[i].href = newLink;
                    }
                }
            }
        }

        //Append the msource to form actions
        var forms = document.forms;
        for (var i = 0; i < forms.length; i++) {
            if (forms[i]) {
                var link = forms[i].action;
                if (link.indexOf('mailto:') == -1 && link.indexOf('javascript:') == -1 && unescape(link).indexOf('return false') == -1) {
                    var s = new Array;
                    var newLink = link;
                    var newLink = link;
                    if (link.indexOf('?') > -1) {
                        var d = link.substring(0, link.indexOf('?'));
                        var l = link.substring(link.indexOf('?') + 1, link.length);
                        var s = l.split('&');
                        for (j = 0; j < s.length; j++) {
                            if (s[j].indexOf('msource') > -1) {
                                s[j] = 'msource=' + msource;
                                var changed = 1;
                            }
                        }
                        if (changed != 1) {
                            s[s.length] = 'msource=' + msource;
                        }
                        newLink = d + '?' + s.join('&');
                        changed = 0;
                        delete changed;
                        delete s;
                        delete j;
                    } else {
                        newLink = link + '?msource=' + msource;
                    }
                    forms[i].action = newLink;
                }
            }
        }

    }
}

//Gets the last recorded msource and pushes its to GA
function getFinalMsourceGa() {
    
    var msource = readCookie('msource');
    
    if (msource) {
        //Commented out 11/30/2012
        //splitMsource = msource.split(',');
        //Splitting the msource using regex
        //Delimeters  = , | %2CD
        var splitMsource = msource.split(/,|%2C/);
        var lastIndex = splitMsource.length - 1;
        var finalgaMsource = splitMsource[lastIndex];

        //Push the last msource to GA
        _gaq.push(['_setCustomVar', 2, 'msource2', finalgaMsource, 2]);

    }

}



/*********************************************************/
// Monthly Giving Google Analytics
/*********************************************************/

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-438828-9']);
_gaq.push(['_setDomainName', location.hostname.replace('www', '')]);
_gaq.push(['_setAllowLinker', true]);
_gaq.push(['_setAllowHash', false]);

//Get the msource from the querystring.
var msource = getQueryVariable('msource');

//If the msource exists in the querystring
if (msource) {
    //read the msource from the URL
    var currentVal = (readCookie('msource') !== null) ? readCookie('msource') : msource;
    
    //split the msource on proper comma and html encoded comma
    currentVal = (typeof (currentVal) !== null) ? currentVal.split(/,|%2C/) : msource;
    
    //Append the msources together
    if (typeof (currentVal) !== null && !inArray(msource, currentVal)) {
        msource = currentVal + ',' + msource;
    } else {
        msource = currentVal;
    }
    // Setting for 20 mins
    if (typeof (currentVal) !== null) {
        createCookie('msource', msource, 43200);
    }

    //Split the msource again, for extra measure
    var splitMsource = msource[0].split(/,|%2C/);
    var gaMsource = splitMsource[0];

    //Push the first msource to GA
    _gaq.push(['_setCustomVar', 1, 'msource1', gaMsource, 2]);

}

_gaq.push(['_trackPageview']);
	
	  
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//Track Navigation clickage
function track_nav(title, type)
{
	if(type == '' || type == undefined){ 
	_gaq.push(['_trackEvent', 'Navigation', 'Click', title]);
										}
    else { 
	_gaq.push(['_trackEvent', 'Navigation', type, title]); 
         }
}

//Track Banner clickage
function track_banner(title, type)
{
	if(type == '' || type == undefined){ 
	_gaq.push(['_trackEvent', 'Banner', 'Click', title]);
                						}
    else { 
	_gaq.push(['_trackEvent', 'Banner', type, title]); 
         }
}

//Track Link clickage
function track_link(title, type)
{
	if(type == '' || type == undefined){ 
	_gaq.push(['_trackEvent', 'Link', 'Click', title]);
										}
    else	{ 
	_gaq.push(['_trackEvent', 'Link', type, title]); 
			}
}

//Track Button clickage
function track_button(title, type)
{
	if(type == '' || type == undefined)	{
	_gaq.push(['_trackEvent', 'Button', 'Click', title]); 
										}
    else	{
	_gaq.push(['_trackEvent', 'Button', type, title]);
			}
}

//Track Video downloadage
function track_video(title)
{
	if(type == '' || type == undefined)	{
	_gaq.push(['_trackEvent', 'Video', 'Download', title]); 
										}
    else	{
	_gaq.push(['_trackEvent', 'Video', type, title]);
			}
}

//Track PDF downloadage
function track_pdf(title)
{
	if(type == '' || type == undefined)	{
	_gaq.push(['_trackEvent', 'PDF', 'Download', title]); 
										}
    else	{
	_gaq.push(['_trackEvent', 'PDF', type, title]);
			}
}

/*********************************************************/
// END Monthly Giving Google Analytics
/*********************************************************/
jQuery(document).ready(function () {
    //Run the sticky cookie code.
    stickyMsourceCookie();
});
