var globalObj = {
	t1:"",
	t2:"",
}
var working = false;
var $this;
var $state;

$('.login').on('submit', function(e)
{
	event.preventDefault();
    if (working) return;
    working = true;
    $this = $(this);
    $state = $this.find('button > .state');

    $this.addClass('loading');
    $state.html('Authenticating');
	login(event);
});

function login(event)
{
	var authdata = {
        "header":
        {},
        "payload":
        {
            "userName": $("#username")[0].value,
            "password": $("#password")[0].value
        }
    };
    $.ajax(
    {
        type: 'POST',
        url: '/login',
        data: JSON.stringify(authdata), // '{"name":"' + model.name + '"}',
        dataType: 'text',
        processData: false,
        contentType: 'application/json',
        success: successCB,
        error: errorCB,
        timeout: 5000
    });
    event.preventDefault();
};

function successCB(data, status, header)
{
    console.log(header);
    var data = JSON.parse(data);
    console.log(data.payload);
        
    if (data.payload.status == 'ERROR')
    {
        $("#errorMsg")[0].innerHTML = "<small class='redTxt'>" + data.payload.responseBody.message + "</small>";
        globalObj.t1 = $("#username")[0].value;
        globalObj.t2 = $("#password")[0].value;
        $("#username")[0].value = '';
        $("#password")[0].value = '';
        
        setTimeout(function()
	    {
	    	$this.addClass('invalid');
	        $state.html('Failed');
			setTimeout(function()
	        {
		        $state.html('Log in');
   				$this.removeClass('invalid loading');
   				working = false;
		 	}, 4000);
		}, 3000);
    }
    else
    {
        var obj = {};
        obj.sessionId = data.payload.session.sessionId;
        obj.user = data.payload.responseBody.userDetails;
        obj.user.userName = data.payload.session.username;
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 15);
        var expire = 'expires' + '=' + expireDate;
        document.cookie = 'session' + '=' + JSON.stringify(obj) + ';' + expire;

        setTimeout(function()
	    {
	    	$this.addClass('ok');
	        $state.html('Welcome');
			setTimeout(function()
	        {
        		window.location = 'application.html';		       
    			working = false;
		 	}, 4000);
		}, 3000);
    }
};

function errorCB(res, status, ex)
{
    var message;
    var myStatusErrorMap = {
        '400': "Server understood the request but request content was invalid.",
        '401': "Invalid Username or Password. Please Try Again.",
        '403': "Forbidden resouce can't be accessed.",
        '500': "Internal Server Error.",
        '503': "Service Unavailable."
    };
    if (res.status)
    {
        message = myStatusErrorMap[res.status];
        if (!message)
        {
            message = "Unknown Error " + ex;
        }
    }
    else if (ex == 'timeout')
    {
        message = "Request Timed out. Unable to contact Authentication Server.";
    }
    else if (ex == 'abort')
    {
        message = "Request was aborted by the server.";
    }
    else
    {
        message = "Invalid Username or Password " + ex + ", " + status;
    }
    //console.log(res);
    console.log(message);
    $("#errorMsg")[0].innerHTML = message;
    $("#password")[0].value = "";

    $state.html('Log in');
    $this.removeClass('ok loading');
};