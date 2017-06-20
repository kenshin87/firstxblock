/* Javascript for FirstXBlock. */
function FirstXBlock(runtime, element) {

    function updateCount(response) {
        $(".count", element).text(response.count);
    }

    var handlerUrl = runtime.handlerUrl(element, "increment_count");

    $(".testing", element).click(
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
    
    //This is just for testing, can detele it.
    $(".changeName", element).click
    (
        function() 
        {

            var userInputfileName  = $(".currentFileName", element)[0].value;

            var postUrl = runtime.handlerUrl(element, "checkFile");
            var jsonData = JSON.stringify({"fileName": userInputfileName});

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(response)
                    {
                        $(".fileNameInInfo", element).text(response.fileName);
                    }
                }
            );
        }
    );


        // Argument response here is just a string of " {"result": {"file_url": "asdasdasd.pdf"}} "
        function changeName(response) 
        {
            alert("was successful, now we begin to change the name;");
            var jsonParsedResponse = JSON.parse(response);
            var systemGeneratedRandomName  = jsonParsedResponse["result"]["file_url"];

            var postUrl = runtime.handlerUrl(element, "renewFile");
            var preSystemGeneratedRandomName = systemGeneratedRandomName.replace(".pdf", "");

            var jsonData = JSON.stringify({"systemGeneratedRandomName": preSystemGeneratedRandomName});


            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        $(".systemGeneratedRandomName", element).val(preSystemGeneratedRandomName);
                        window.location.reload();
                    }
                }
            );
        }

    // By posting a formdata instance including a file to the server, it get the randomized file name 

    // require:
    //     <input class = "systemGeneratedRandomName" value = {self.systemGeneratedRandomName}    
    //     <input class = "file-upload" name  = "file-upload"   >
    //     <input class = "ajaxFileServer">
    // return:
    //     randomized file name of the pdf file, aka "32498753958234958.pdf"


    $(".ajaxFileServer", element).click
    (
        function(eventObject)
        {
            if ( $(".file-upload", element)[0].files.length == 0 )
            {
                eventObject.preventDefault();
                $(".noUploadWarning", element).css("background-color", "#f11")
                $(".noUploadWarning", element).text("请先点击“选择文件”按钮选择一个pdf文件");
            }
            else
            {
                var formDataInstance = new FormData();
                formDataInstance.append("file-upload", $(".file-upload", element)[0].files[0]);

                $.ajax
                (
                    {
                        type : "POST",
                        url  : "/filecms/upload/",
                        data : formDataInstance,
                        cache: false,
                        contentType: false,
                        processData: false,

                        success: function(response)
                        {
                            alert("The post is successful!");
                            if (typeof(response) != "string")
                            {
                                response = JSON.stringify(response);
                            }
                            changeName(response);
                        }
                    }
                )
            }
        }
    );



    $(function ($) {
        /* Here"s where you"d do things on page load. */
    });


}
