/* Javascript for FirstXBlock. */
function FirstXBlock(runtime, element) {

    function updateCount(result) {
        $('.count', element).text(result.count);
    }

    var handlerUrl = runtime.handlerUrl(element, 'increment_count');
    window.handlerUrl = handlerUrl;
    console.log(handlerUrl);

    $('.testing', element).click(
        function(eventObject) 
        {



            $.ajax
            (
                {
                    type: "POST",
                    url: handlerUrl,
                    data: JSON.stringify({"hello": "world"}),
                    success: updateCount
                }
            );
        }
    );


    // PagePara is the value that is shown on client's screen. So need to be changed.
    // Return value of this function is the real zeroIndex index of the desired page.
    function getZeroIndexPage(pagePara, totalPagesPara) //totalPagesPara here is shown in web page
    {
        if       (pagePara <= 1              ) {return 0;                }
        else if  (pagePara >= totalPagesPara ) {return totalPagesPara -1;}
        else                                   {return pagePara - 1;     }
    }
    // After acquiring the zero index value, then we need to add or subtract, 
    // so we still need another validation function in order for it not to become overflow. 
    function checkValidZeroIndexPage(pagePara, totalPagesPara)  // totalPagesPara here is the same as above
    {    
        if       (pagePara < 0                  ) {return 0;                }
        else if  (pagePara >= totalPagesPara - 1) {return totalPagesPara -1;}
        else                                      {return pagePara;         }
    }

    // This will be the basic address that we can send ajax request.
    var baseUrl = "http://192.168.2.5/document/document-";

    // postUrl here is for posting the message to the xblock special handle function.
    var postUrl = runtime.handlerUrl(element, 'get_page');

    // initiate the img pictures

/*
    // origin of show
    $('.show', element).click
    (
        function()
        {
            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);

            var jsonData = JSON.stringify({"page": page});
            var src = baseUrl + page + ".jpg";

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("initial");
                        updateCount(result);
                        updatePage(result);
                        $('img', element)[0].src = src;
                    }
                }
            );
        }
    );

*/

    // This will be the basic address that we can send ajax request.
    var baseUrl = "/filecms/image/";

    // postUrl here is for posting the message to the xblock special handle function.
    var postUrl = runtime.handlerUrl(element, 'get_page');

    $('.show', element).click
    (
        function()
        {

            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);

            var name       = $('.systemGeneratedRandomName', element).text();
                console.log(name);

            var jsonData = JSON.stringify({"page": page});
            var src = baseUrl + "getimg/" + name  + "?page=" + page;
            console.log(src);

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("initial");
                        updateCount(result);
                        updatePage(result);
                        $('img', element)[0].src = src;
                    }
                }
            );
        }
    );

    
    $('.printSystemGeneratedRandomName', element).click
    (
        function()
        {
            var postUrl = runtime.handlerUrl(element, 'updateFile');
            var jsonData = JSON.stringify({"systemGeneratedRandomName": "systemGeneratedRandomName"});
           
            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {


                        console.log(result);
                        console.log(result["systemGeneratedRandomName"]);
                    }
                }
            );
        }
    );
    
    
    
    
    // Need to initialize the img when the client start to load the page.
/*
    (
        function()
        {
            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);

            var jsonData = JSON.stringify({"page": page});
            var src = baseUrl + page + ".jpg";

            $.ajax
            (
                {
                    type: "POST",
                    url: getUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("initial");
                        updateCount(result);
                        updatePage(result);
                        $('img', element)[0].src = src;
                    }
                }
            );
        }
    )();
*/



    // Reduce the page
    $('.buttonsetname', element).click
    (
        function(eventObject) 
        {

            var postUrl = runtime.handlerUrl(element, 'renewFile');


            var key   = "systemGeneratedRandomName";

            var value = $('.inputsetname')[0].value;

            var jsonData = JSON.stringify({[key]: value});

            console.log(jsonData);
            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(response)
                    {
                        console.log("renew");
                        $(".systemGeneratedRandomName").text(response["systemGeneratedRandomName"]);


                    }
                }
            );
        }
    );


    // update count and page number
    function updateCount(result) 
    {
        $('.count', element).text(result.count);
    }
    function updatePage(result)
    {
        $('.currentPage')[0].value = result.page + 1;            
    }




    // Reduce the page
    $('.left', element).click
    (
        function(eventObject) 
        {
            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);
                page      -= 1; 
                page       = checkValidZeroIndexPage(page, totalPages);
                page = page.toString();
                console.log(page);
            

            var jsonData = JSON.stringify({"page": page});
            var name       = $('.systemGeneratedRandomName', element).text();

            //var src  = baseUrl + page + ".jpg";
            var src = baseUrl + name + "?page=" + page; 


            console.log(src);
            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("left")
                        console.log(result.count)

                        updateCount(result);
                        updatePage(result);
                        $('img', element)[0].src = src;
                    }
                }
            );
        }
    );

    // Increase the page
    $('.right', element).click
    (
        function(eventObject) 
        {

            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);
                page      += 1; 
                page       = checkValidZeroIndexPage(page, totalPages);
                page = page.toString();
                     console.log(page);

            var name       = $('.systemGeneratedRandomName', element).text();

            var jsonData = JSON.stringify({"page": page});

            var src = baseUrl + name + "?page=" + page; 
            //var src  = baseUrl + page + ".jpg";

            console.log(src);

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log(result);
                        console.log("right");             
                        updateCount(result);
                        updatePage(result);
                        $('img', element)[0].src = src;
                    }
                }
            );
        }
    );

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
