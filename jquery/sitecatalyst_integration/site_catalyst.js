<!-- 

    Description: Initialize Adobe Site Catalyst objects. Populate and call functions intended for basic pagecode and revenue tracking. 

-->
<script language="JavaScript" type="text/javascript" src="https://158fc6497e5a64559e1f-d14ef12e680aa00597bdffb57368cf92.ssl.cf2.rackcdn.com/js/ga_mgive.js"></script>
<script type="text/javascript">
//Production
var s_account='hpiprod,hpiglobalprod';
</script>
<script language="JavaScript" type="text/javascript" src="https://158fc6497e5a64559e1f-d14ef12e680aa00597bdffb57368cf92.ssl.cf2.rackcdn.com/js/adobe_s_code_new.js"></script>
<script type="text/javascript">// <![CDATA[

    //Assume Jquery noConflict is needed. 
    var jQnC = jQuery.noConflict();


    //Adobe basic pagecode.
    function initAdobe(){
        
        var urlString = location.pathname,
            urlSplitArray,
            urlArray = [],
            i = 0;


        urlString = urlString.substring(1).replace(/\.[^/.]+$/, "");
        urlSplitArray = urlString.split("/");

        //ADOBE PROPERTY: Page Name. 
        s.pageName = "/" + urlString;

        while ( i < 5 ) {

            if ( i === 0 ) {
                urlArray.push( urlSplitArray[ i ] );
            } else if ( urlSplitArray[ i ] === undefined ) {
                urlArray.push( urlArray[ i - 1] );
            } else {
                urlArray.push( urlArray[ i - 1] + "/" + urlSplitArray[ i ] );
            }

            i += 1;
        }

        //ADOBE PROPERTY: Site Sections
        s.prop1 = "/" + urlArray[0];
        s.prop2 = "/" + urlArray[1];
        s.prop3 = "/" + urlArray[2];
        s.prop4 = "/" + urlArray[3];
        s.prop5 = "/" + urlArray[4];

        //ADOBE PROPERTY: Page Type. CHANGE based on campaign
        s.channel = "DRTV Campaign";
        //ADOBE PROPERTY: Product View Event
        s.events = "prodView";
        //ADOBE PROPERTY: Id of product. CHANGE based on product
        s.products = ";616";

        /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
        var s_code=s.t();if(s_code)document.write(s_code);
        /**** End SiteCatalyst code version: H.26.1 ***/
    }


    // Check if checkbox is checked
    function isChecked(optionId){

        //Assumes jQuery in noConflict mode.
        if(jQnC('#' + optionId).attr("checked")){
            return true;
        }    
        return false;
    }

    //Adobe Donate or Update button Click
    function adobeDonateUpdate(){

        var seralized = readCookie('VisitorGuid')
            ,scOpen = "scOpen:" + seralized
            ,scAdd = "scAdd:" + seralized
            ,scCheckout = 'scCheckout' + seralized
            ,event8 = "event8:" + seralized
            ,event9 = "event9:" + seralized
            ,share = ''
            ,full = ''
            ,products
            ,concatProducts;

        concatProducts = share + full;
        //Attempting to remove the trailing comma
        products = concatProducts.replace(/(^,)|(,$)/g, "");

        //if the donate button turns into an update button
        if(jQnC('.donate-wrapper a').html() == 'Update Total'){
            //ADOBE PROPERTIES: CHANGE s.products to ID of product
            s.linkTrackVars='products,events';
            s.linkTrackEvents='event16';
            s.events='event16';
            s.products=';616';
            s.tl(this,'o','cart update');
        }else{
            //ADOBE PROPERTIES
            s.linkTrackVars='products,events,eVar15,eVar12';
            s.linkTrackEvents='scOpen,scAdd,scCheckout,event8,event9';
            s.events = scOpen + ',scAdd,'+ scCheckout + ',' + event8 + ',' + event9;
            s.products = products;
            s.eVar12 = 'cc';
            s.tl(this,'o','adding to cart and showing checkout steps');
        }
    }


    Sys.Application.add_init(appl_init);

    function appl_init() {
        //Append handler/conversion code to asyncronous postback event. 
        var pgRegMgr = Sys.WebForms.PageRequestManager.getInstance();
        pgRegMgr.add_endRequest(EndHandler);
    }

    function strip(html)
    {
       var tmp = document.createElement("DIV");
       tmp.innerHTML = html;
       return tmp.textContent||tmp.innerText;
    }

    //Adobe Conversion function
    function EndHandler() {

        var products
            ,opt_out = '';
        
        //Email opt in events
        if(!jQnC('#optInHeifer').is(':checked')){
            opt_out = ',event20';  
        }

        s.events = "purchase" + opt_out;

        //Only call if donation amount exists
        if(jQnC('.DonationAmount span').length != 0){

            //grab the value from the amount textbox. 
            products = jQnC('.DonationAmount span').html();
            products = strip(products.replace("$", ""));
            
            //Lets create an orderID
            var _date = new Date().getTime();
            var _rand = Math.floor((Math.random()*10000)+1);
            var _orderId = _date + _rand;

            //ADOBE PROPERTIES
            s.events = "purchase";
            s.linkTrackVars='products,events,purchaseID,zip,state,eVar16,eVar11,eVar15';
            s.linkTrackEvents='purchase,event20';
            s.products = ';616;1;'+products.trim()+';;evar15=';
            //s.purchaseID = jQnC('.order > span + span').html();
            s.purchaseID = _orderId;
            s.eVar11 = s.purchaseID;
            s.zip = jQnC('.zip span').html();
            s.state = jQnC('.state span').html();
            s.eVar16 = jQnC('.country span').html();

            s.tl(this,'o','purchase confirmation');
        }
    }
        
    jQnC(document).ready(function () {
        //Initialize Adobe Page code. 
        initAdobe();
    });
            
// ]]>
</script>