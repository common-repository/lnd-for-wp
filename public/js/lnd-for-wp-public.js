(function( $ ) {
	'use strict';

$( window ).load(function() {

	$(".lnd-for-wp .btn-invoice-request").click(function(){

		var invoice_instance = $(this).closest('.lnd-for-wp');
		var invoice_selector = $(invoice_instance).find('.lightning-invoice');
		var invoice_amount = $(invoice_instance).find('.invoice-amount').val();
		var invoice_memo = $(invoice_instance).find('.invoice-memo').val();
		var amount_field = $(invoice_instance).find('.amount-field');
		var invoice_field = $(invoice_instance).find('.invoice-field');
		var funded_field = $(invoice_instance).find('.funded-field');
		var invoice_qr = $(invoice_instance).find('.lnd-wp-invoice-qr');
		var wallet_link = $(invoice_instance).find('.wallet-link');
		var request_btn = $(this);

		if(isNaN(invoice_amount)||invoice_amount<1){
			alert('Please enter a valid invoice amount');
			return false;
		}

	    var data = {
	        'action': 'request_lightning_invoice_ajax',
	        'amount': invoice_amount,
	        'memo': invoice_memo
	    };

	    $.post(ajax_object.ajax_url, data, function(response) {

		    if(response && response != "Host Unreachable"){

				var json_data = JSON.parse(response);

				$(request_btn).slideUp();
				$(invoice_selector).text(json_data.payment_request);
				$(invoice_qr).html(json_data.qr);
				$(wallet_link).attr("href", "lightning:" + json_data.payment_request);
				$(amount_field).slideUp();
				$(invoice_field).slideDown();

				poll_invoice_funded(funded_field,invoice_field,json_data.r_hash);
		    }else{
			    alert('unable to fetch invoice');
		    }
	    });

	});

});

function poll_invoice_funded(funded_field,invoice_field,r_hash){

	//console.log('polling invoice...');

	var paid = false;
	var payment_hash = r_hash;

    var data = {
        'action': 'is_lightning_invoice_paid_ajax',
        'payment_hash': payment_hash
    };

    $.post(ajax_object.ajax_url, data, function(response) {
		//console.log('response: ' + response);
		if(response == "true"){
			$(funded_field).slideDown();
			$(invoice_field).slideUp();
		}else{
			setTimeout(poll_invoice_funded,5000, funded_field, invoice_field);
		}
    });

}


})( jQuery );
