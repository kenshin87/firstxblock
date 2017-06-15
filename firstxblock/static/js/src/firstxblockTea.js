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
    
    
    
    //select the file
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
                    success: function(result)
                    {
                        console.log("name successfully updated.");
                        $('.fileNameInInfo', element).text(result.fileName);
                    }
                }
            );
        }
    );



    $(".ajaxFileServer").click
    (
        function()
        {
            var formDataInstance = new FormData();
            formDataInstance.append("fileByFormData", $('#fileInput')[0].files[0]);
            
            var postUrl = "/helper/xblock/upload";
            
            $.ajax
            (
                {
                    type: 'POST',
                    url: postUrl,
                    data: formDataInstance,
                    cache: false,
                    contentType: false,
                    processData: false,


                    success: function(result)
                    {
                        alert("success");
                    }
                }
            )
        }
    );









    $(function ($) {
        /* Here's where you'd do things on page load. */
    });


}
