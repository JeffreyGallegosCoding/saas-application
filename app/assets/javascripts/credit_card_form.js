// functions listed display steps in which you would like js to function for sign up
// a lot of code for this comes from the stripe documentation and other online resources
// can use these as bases when creating future applications

// 1.function to get params from url - generic(can use this to get mostly any parameter from url)
function GetURLParameter(sParam) {
    // grab the url and return it
    var sPageUrl = window.location.search.substring(1);
    // split it by the & and this will return an array sURLVariables
    var sURLVariables = sPageUrl.split('&');
    // iterate through the array
    for (var i=0; i < sURLVariables.length; i++) {
        // and split the array based on the =
        // this will give you both values on each side of the equals
        var sParameterName = sURLVariables[i].split('=');
        // 0 will be 'plan' and 1 will be 'the plan type' (going on how you would list values in an array ex: [0, 1, 2, etc.])
        if (sParameterName[0] == sParam) {
            // so if parameter name == plan (sParam is listed below in step 6) then it will return the plan name
            return sParameterName[1];
        }
    }
}


$(document).ready(function () {

    var show_error, stripeResponseHandler, submitHandler;

// 2.function to handle the submit of the form and intercept the default event (submitHandler)
    submitHandler = function(event) {
        // reference what has triggered this (use the target method)
      var $form = $(event.target);
        // find and disable the submit button so it doesn't get hit multiple times upon submission
      $form.find("input[type=submit]").prop("disabled", true);
        // stripe documentation code that if the info was created correctly it will create a token, otherwise throw an error
      if(Stripe) {
          Stripe.card.createToken($form, stripeResponseHandler);
      } else {
          show_error("Failed to load credit card processing functionality. Please reload the page")
      }
        // prevent the default action from happening (submit form, create account, etc.)
      return false
    };

// 3.initiate submit handler listener for any form with class "cc_form"
    $(".cc_form").on('submit', submitHandler);

// 4.handle event of plan drop down changing
    var handlePlanChange = function(plan_type, form) {
        // assign to string form
        var $form = $(form);

        if(plan_type == undefined) {
            // whatever selected plan in the id tenant_plan is will be the set plan if the plan type that is passed in is undefined
            plan_type == $('#tenant_plan :selected').val()
        }

        if(plan_type == 'premium') {
            // since it is a paid plan we need to require stripe
            $('[data-stripe]').prop('required', true);
            // remove event handlers that are attached to the method
            // off will remove currently attached event handlers then turn it back on and call the submitHandler
            $form.off('submit');
            $form.on('submit', submitHandler);
            $('[data-stripe]').show();
        } else {
            // hide stripe data b/c we do not need since it's a free plan
            $('[data-stripe]').hide();
            $form.off('submit');
            // make sure stripe data is not required
            $('[data-stripe]').removeProp('required');
        }
    };

// 5.set up plan change event listener #tenant_plan id in the forms for class cc_form
    $("#tenant_plan").on('change', function (event) {
        // calling handlePlanChange method and inputting the selected plan type and cc_form as the parameters
       handlePlanChange($('#tenant_plan :selected').val(), ".cc_form");
    });

// 6.call plan change handler so that the plan is set directly in the drop down when the page loads
    handlePlanChange(GetURLParameter('plan'), ".cc_form");

// 7.function to handle the token received from stripe and remove credit card fields so they don't hit database
    stripeResponseHandler = function (status, response) {
        var token, $form;

        $form = $('.cc_form');

        // log the error, show the error, and enable the button
        if(response.error) {
            console.log(response.error.message);
            show_error(response.error.message);
            $form.find("input[type=submit]").prop("disabled", false);
        } else {
            token = response.id;
            // set form and append info to it - code from stripe
            $form.append($("<input type=\"hidden\" name=\"payment[token]\" />").val(token));
            // remove the info from the credit card so it doesn't hit db
            $("[data-stripe=number]").remove();
            $("[data-stripe=cvv]").remove();
            $("[data-stripe=year]").remove();
            $("[data-stripe=month]").remove();
            $("[data-stripe=label]").remove();
            // then submit the form
            $form.get(0).submit();
        }
        return false;
    };

// 8.function to show errors when Stripe functionality returns an error
    show_error = function (message) {
        if($("flash-messages").size() < 1) {
            $('div.container.main div:first').prepend("<div id='flash-messages'></div>")
        }
        $("flash-messages").html('<div class="alert alert-warning"><a class="close" data-dismiss="alert"></a><div id="flash-alert"></div>' + message + '</div></div>');
        $('.alert').delay(5000).fadeout(3000);
        return false;
    }


});

