/*
Description: Replace existing single select form with multi-selection options. Namespace specifically written to be placed on a BBIS page containing a donations for with the predefined designations.
Author: Mitchell Katayama
PreReqs: Jquery

*/

; MonthlyGiving = {
        formId: 'PC1523',
        setformId: function () {
            var formname = $("table[id$='_tblAmount']")[0].id.split("_");
            formId = formname[0];
        },
        addDollarSigns: function () {
            /* Add dollar signs to labels */

            //Label Ids and text
            var labeltxt = new Array;
            labeltxt['10'] = '= 1 Goat a Year';
            labeltxt['20'] = '= 12 Flocks of Chicken a Year';
            labeltxt['30'] = '= 3 Sheep a Year ';
            labeltxt['30_1'] = '= 3 Goats a Year ';
            labeltxt['42'] = '= 1 Heifer a Year ';
            labeltxt['50'] = '= 5 Pigs a Year ';
            labeltxt['50_1'] = '= 5 Sheep a Year ';
            labeltxt['152'] = '= Barnyard of Animals';

            var c30 = 0;
            var c50 = 0;
            var thisamt2;

            //Select each label in the Amount Table and Add a dollar sign
            $("table[id$='_tblAmount'] label").not(":contains('Other')").each(function (n) {

                var thisamt = $(this).text();

                $(this).prepend('$').append('.00');

                thisamt2 = thisamt;
                if (thisamt == "30") {
                    if (c30 == 0) {
                        c30++;
                        thisamt2 = '30';
                    } else {
                        thisamt2 = '30_1';
                    }
                }
                if (thisamt == "50") {
                    if (c50 == 0) {
                        c50++;
                        thisamt2 = '50';
                    } else {
                        thisamt2 = '50_1';
                    }
                }
                if (labeltxt[thisamt2]) {
                    $(this).attr('rel', thisamt2);
                    $(this).parent().parent().next().html(labeltxt[thisamt2]);
                } else {
                    $(this).attr('rel', thisamt2);
                    $(this).parent().parent().next().html("");
                }
            });

        },
        addCheckBoxes: function () {

            /* Designations array 
            Format: designations['AMOUNT'] = designation dropdown value;
            */
            var designations = new Array;
            designations['10'] = '134';
            designations['20'] = '135';
            designations['30'] = '136';
            designations['30_1'] = '141';
            designations['42'] = '137';
            designations['50'] = '138';
            designations['50_1'] = '142';
            designations['152'] = '140';
            designations['Other'] = '139';

            //Select the "Other" radio button
            $("input[id='" + formId + "_txtAmount']").attr('value', OtherAmt);


            //Select all of the giving level radio buttons
            $("input[name$='givingLevels']").each(function () {

                //Check to see if the current Giving Level radio button is "Other"
                var isOther = ($(this).context.value.indexOf("Other") != -1);

                if (isOther) {
                    var vIndex = '-1';
                    var thisamt = 'Other';
                } else {
                    var val_index = $(this).context.value.split("_");
                    var vIndex = val_index[1];

                    var thisamt = $("label[for='" + formId + "_rdo_" + vIndex + "_8']").attr('rel');
                }

                //Creates a new checkbox to be displayed instead of a radio button
                var newCheck = $(document.createElement("input")).attr({
                    id: "C" + $(this).context.id
                    , name: $(this).context.name
                    , value: $(this).context.value
                    , type: 'checkbox'
                    , checked: amountChecked[thisamt]
                }).click(function () {
                    //onClick Function for the Checkbox

                    //Change the cursor
                    $("body").css("cursor", "wait");

                    //Set the checked array value of the current amount
                    amountChecked[thisamt] = $(this).context.checked;

                    //If your checking the checkbox                        
                    if ($(this).context.checked == true) {

                        //Select the designation dropdown
                        $("select[name$='ddlDesignations'] option[value='" + designations[thisamt] + "']").attr('selected', true);

                        //set the array for keeping track of the Cart Item Id's
                        multiChecked[curCheckedLocation].did = thisamt
                        curCheckedLocation++;

                        //if not the Other Checkbox.
                        if (!isOther) {
                            $("input[id='" + formId + "_rdo_" + vIndex + "_8']").click();
                            WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(formId + "$btnAddToCart", "", true, formId + "_TB_pnlDonation", "", false, true));
                        } else {
                            $("body").css("cursor", "auto");
                            $("input[id='" + formId + "_txtAmount']").removeAttr('disabled');
                        }

                    } else {

                        //Reset the Other Amount
                        if (isOther) {
                            OtherAmt = '';
                        }

                        //removes the item
                        for (var i = 0; i < multiChecked.length; i++) {

                            if (multiChecked[i].did == thisamt) {
                                //set the RemovedIndex, tells the app that an items has been removed
                                removedIndex = i;
                                __doPostBack(formId + '$dgCart$ctl' + multiChecked[i].cid + '$btnRemove', '');

                            }
                        }
                    }
                });

                //Adds the new checkbox to the page.
                $("span[itemindex=" + vIndex + "]").prepend(newCheck);

                //Checks the new checkbox - because IE does not allow modification to an input until it's been added to the DOM
                $("input[id$=" + "C" + $(this).context.id + "]").attr("checked", amountChecked[thisamt]);

                //hides the current radio button
                $(this).attr("style", "display:none");

            });

            //Changes the Designation Dropdown.
            $("input[name$='givingLevels']").click(function () {
                var thisamt = $(this).next().attr('rel');
                $("select[name$='ddlDesignations'] option[value='" + designations[thisamt] + "']").attr('selected', true);
            });

        },
        resetMultiChecked: function () {

            if (removedIndex != undefined) {

                //Clear the current Designation ID
                multiChecked[removedIndex].did = '';
                curCheckedLocation = removedIndex;

                //Shifts values up the array. 
                for (var j = removedIndex; j < multiChecked.length; j++) {

                    if (j != (multiChecked.length - 1) && multiChecked[j + 1].did != '') {
                        multiChecked[j].did = multiChecked[j + 1].did;
                        curCheckedLocation = j + 1;
                    } else {
                        multiChecked[j].did = '';
                    }
                }
            }

            //Resets the removed index
            removedIndex = undefined;
        },
        hideExtraRowsAddContButton: function () {

            var _d = new Date().getDate(); // gets current day of month

            //Defaults the designation dropdown
            $("select[name$='ddlDesignations'] option[value='139']").attr('selected', true);
            $('option:contains("Day ' + _d + ' of every month")').attr('selected', 'selected');

            //Hides Extra Rows
            $('span[id*=lblAdditInformation]').parent().parent().parent().css('display', 'none');
            $('tr[id$=_trDesignation]').parent().css('display', 'none');

            $('tr[id$=PC1523_trAddToCart]').css('display', 'none');
            $('tr[id$=PC1523_trCart]').css('display', 'none');

            //Hide the Title Dropdown
            $('label[id$=PC1523_DonationCapture1_lblTitle1]').parent().parent().css('display', 'none');

            //Reduce the cellspacing
            $("table[id$='PC1523_tblAmount']").attr("cellspacing", "0");

            //Creates a Continue button
            var contCheckOut = $(document.createElement("input")).attr({
                id: 'btnContinueCheckout'
                            , name: 'btnContinueCheckout'
                            , type: 'button'
                            , text: 'Continue'
                            , value: 'Continue'
            }).click(function () {
                //Shows the Billing and Donor Information
                $('tbody[class$="BBFormTable DonationCaptureFormTable"]').css('display', '');
                $('tbody[id$="PC1523_DonationCapture1_tbdyPaymentInfo"]').css('display', '');
                $('td[class$="BBFormButtonCell DonationButtonCell"]').css('display', '');

                showBilling = true;
            });

            //Adds the continue button to the page
            var newTR = $(document.createElement("tr"));

            newTR.append($(document.createElement("td")).addClass("BBFieldCaption DonationFieldCaption"));
            newTR.append($(document.createElement("td")).append(contCheckOut));

            $("tbody[id$=_tbdCart]").append(newTR);
        },
        updateOtherTextBoxAmount: function () {
            //Updates the textbox thats in the cart
            for (var i = 0; i < multiChecked.length; i++) {

                if (multiChecked[i].did == 'Other') {

                    $('input[id="PC1523_dgCart_ctl' + multiChecked[i].cid + '_txtDesAmount"]').val(OtherAmt);
                    __doPostBack(formId + '$dgCart$ctl' + multiChecked[i].cid + '$txtDesAmount', '');

                }
            }

        },
        bindChangeEvent: function () {

            //Binds the onchange event of the textbox
            $("input[id='" + formId + "_txtAmount']").change(function () {

                $("body").css("cursor", "wait");

                OtherTbChanged = true;

                if (OtherAmt == '') {
                    $("input[id='" + formId + "_rdoOther']").click();
                    WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(formId + "$btnAddToCart", "", true, formId + "_TB_pnlDonation", "", false, true));
                } else {
                    OtherAmt = $(this).context.value;
                    MonthlyGiving.updateOtherTextBoxAmount();
                }

                OtherAmt = $(this).context.value;
            });
        },
        calcTotal: function () {

            //get the current total.
            var curTotal = $("span[id$='_lblDesTotal']").html();
            var spanTotal = $(document.createElement('span')).append(curTotal + " a month");

            var subDisplay = $(document.createElement('span')).html("Total");

            //Create a new table
            //var $tbl = $('<table>').attr('id', 'subtotalTbl');

            //Create a new table row
            var newTR = $(document.createElement("tr")).css("font-weight", "bold");

            var newsubTD = $(document.createElement("td")).addClass("BBFieldControlCell DonationFieldControlCell").css("border-top", "1px solid gray").append(subDisplay);
            var newtotalTD = $(document.createElement("td")).addClass("wsNowrap BBFieldControlCell DonationFieldControlCell").css("border-top", "1px solid gray").append(spanTotal);

            //newTR.append($(document.createElement("td")).addClass("BBFieldControlCell DonationFieldControlCell").append(subDisplay).css("border-top", "1px solid gray"));
            //newTR.append($(document.createElement("td")).addClass("wsNowrap BBFieldControlCell DonationFieldControlCell").append(spanTotal).css("border-top", "1px solid gray"));

            newTR.append(newsubTD);
            newTR.append(newtotalTD);

            $("table[id$='PC1523_tblAmount'] tbody:first").append(newTR);


        }
    }


    /*  GLOBAL VALUES */
    var OtherAmt = '';
    var OtherTbChanged = false;

    var amountChecked = new Array;
    amountChecked['10'] = false;
    amountChecked['20'] = false;
    amountChecked['30'] = false;
    amountChecked['30_1'] = false;
    amountChecked['42'] = false;
    amountChecked['50'] = false;
    amountChecked['50_1'] = false;
    amountChecked['152'] = false;
    amountChecked['Other'] = false;

    var curCheckedLocation = 0;
    var removedIndex;
    var multiChecked = new Array;
    multiChecked[0] = { cid: '02', did: '' };
    multiChecked[1] = { cid: '03', did: '' };
    multiChecked[2] = { cid: '04', did: '' };
    multiChecked[3] = { cid: '05', did: '' };
    multiChecked[4] = { cid: '06', did: '' };
    multiChecked[5] = { cid: '07', did: '' };
    multiChecked[6] = { cid: '08', did: '' };
    multiChecked[7] = { cid: '09', did: '' };
    multiChecked[8] = { cid: '10', did: '' };

    var showBilling = false;

    //JQuery on Document Ready
    $(document).ready(function () {

        MonthlyGiving.hideExtraRowsAddContButton();
        MonthlyGiving.setformId();
        MonthlyGiving.addDollarSigns();
        MonthlyGiving.addCheckBoxes();
        MonthlyGiving.bindChangeEvent();

    });

    Sys.Application.add_init(appl_init);

    function appl_init() {
        var pgRegMgr = Sys.WebForms.PageRequestManager.getInstance();
        pgRegMgr.add_endRequest(EndHandler);
    }

    function EndHandler() {
        MonthlyGiving.hideExtraRowsAddContButton();
        MonthlyGiving.setformId();
        MonthlyGiving.addDollarSigns();
        MonthlyGiving.addCheckBoxes();
        MonthlyGiving.resetMultiChecked();
        MonthlyGiving.bindChangeEvent();

        if (!showBilling) {
            $('tbody[class$="BBFormTable DonationCaptureFormTable"]').css('display', 'none');
            $('tbody[id$="PC1523_DonationCapture1_tbdyPaymentInfo"]').css('display', 'none');
            $('td[class$="BBFormButtonCell DonationButtonCell"]').css('display', 'none');
        }

        MonthlyGiving.calcTotal();

        OtherTbChanged = false;

        //Change the cursor back
        $("body").css("cursor", "auto");
    }

