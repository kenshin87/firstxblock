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
            console.log("testing ajax works")


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
    
    //This is just for testing, can detele it.
    $('.changeName', element).click
    (
        function() 
        {

            var userInputfileName  = $('.currentFileName', element)[0].value;
            console.log(userInputfileName);

            var postUrl = runtime.handlerUrl(element, 'checkFile');
            var jsonData = JSON.stringify({"fileName": userInputfileName});

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(response)
                    {
                        console.log("name successfully updated.");
                        $('.fileNameInInfo', element).text(response.fileName);
                    }
                }
            );
        }
    );


        // Argument response here is just a string of ' {"result": {"file_url": "asdasdasd.pdf"}} '
        function changeName(response) 
        {
            var jsonParsedResponse = JSON.parse(response);
            var systemGeneratedRandomName  = jsonParsedResponse["result"]["file_url"];
            console.log(systemGeneratedRandomName);

            var postUrl = runtime.handlerUrl(element, 'checkFile');
            var jsonData = JSON.stringify({"systemGeneratedRandomName": systemGeneratedRandomName});

            console.log(jsonData);

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("file upload and changing name.");
                        $('.systemGeneratedRandomName', element).text(result.systemGeneratedRandomName);
                    }
                }
            );
        }

/*
for testing
        function changeName(result) 
        {

            result = JSON.parse(result);
            window.result = result;
            var systemGeneratedRandomName  = result["file_url"];
            console.log(systemGeneratedRandomName);

            var postUrl = runtime.handlerUrl(element, 'checkFile');
            var jsonData = JSON.stringify({"systemGeneratedRandomName": systemGeneratedRandomName});

            console.log(jsonData);

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("file upload and changing name.");
                        $('.systemGeneratedRandomName', element).text(result.systemGeneratedRandomName);
                    }
                }
            );
        }

            result = JSON.parse(result);
            window.result = result;
            var systemGeneratedRandomName  = result["file_url"];
            console.log(systemGeneratedRandomName);

            var postUrl = runtime.handlerUrl(element, 'checkFile');
            var jsonData = JSON.stringify({"systemGeneratedRandomName": systemGeneratedRandomName});

            console.log(jsonData);

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("file upload and changing name.");
                        $('.systemGeneratedRandomName', element).text(result.systemGeneratedRandomName);
                    }
                }
            );

*/



    $(".ajaxFileServer", element).click
    (
        function()
        {
            var formDataInstance = new FormData();
            formDataInstance.append("file-upload", $('#file-upload')[0].files[0]);
            $.ajax
            (
                {
                    type: 'POST',
                    url: '/filecms/upload/',
                    data: formDataInstance,
                    cache: false,
                    contentType: false,
                    processData: false,


                    success: function(response)
                    {   window.respp = response;
                        console.log(typeof(response));
                        //alert(response);
                        //changeName(response);
                    }
                }
            )
        }
    );








    $(function ($) {
        /* Here's where you'd do things on page load. */
    });


}
