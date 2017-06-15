/* Javascript for FirstXBlock. */
function FirstXBlock(runtime, element) {

    //select the file
    $('.changeName', element).click
    (
        function() 
        {

            var userInputfileName  = $('.currentFileName', element)[0].value;
            alert(userInputfileName);

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
                        alert(1234);
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
