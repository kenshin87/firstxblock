/* Javascript for FirstXBlock. */
function FirstXBlock(runtime, element) {

    var global = {};
        global.baseUrl = "/filecms/image/";


    // By posting a formdata instance including a file to the server, it get the randomized file name 

    // require:
    //     <input class = "systemGeneratedRandomName" value = {self.systemGeneratedRandomName}    
    //     <input class = "file-upload" name  = "file-upload"   >
    //     <input class = "ajaxFileServer">
    // return:
    //     randomized file name of the pdf file, aka "32498753958234958.pdf"

    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });

    $(element).find('.save-button').bind
    (
        'click', 
        ajaxSaving
    );

    // The logic here is that:
    /*
            1. check whether the user has choose the file, return relative resposne;
            2. if so, then begin to do the following:
                a. upload the file using FormData instance
                b. get the returned string of the random fileName, save the name to an input box.
                c. update the relative variables inside student_view. We don't expect them to start to change only inside student view is that, 
            we want the teacher to preview the change once him finish uploading the file.

    */
        function ajaxSaving (eventObject)
        {
            if ( $(".file-upload", element)[0].files.length == 0 )
            {
                eventObject.preventDefault();
                $(".noUploadWarning", element).css("background-color", "#f11")
                $(".noUploadWarning", element).text("请先点击“选择文件”按钮选择一个pdf文件");
            }
            else
            {
                runtime.notify('save', {state: 'start'});
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
                                },
                        error: function(response)
                                {
                                    console.log(response);
                                    runtime.notify('error', {msg: "cannot upload file"});
                                }
                    }
                )

            }
        }

        // Argument response here is just a string of " {"result": {"file_url": "asdasdasd.pdf"}}"
        function changeName(response) 
        {
            var jsonParsedResponse = JSON.parse(response);
            var systemGeneratedRandomName  = jsonParsedResponse["result"]["file_url"];

            var preSystemGeneratedRandomName = systemGeneratedRandomName.replace(".pdf", "");
            var displayName = $(".firstXBlockDisplayName", element).val();
            

            var jsonData = JSON.stringify(
                    {
                        "systemGeneratedRandomName": preSystemGeneratedRandomName,
                        "displayName", displayName
                    }
                );
     
            var postUrl = runtime.handlerUrl(element, "renewFile");


            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(response)
                    {
                        $(".systemGeneratedRandomName", element).val(preSystemGeneratedRandomName);
                        initiatePage();
                    }
                }
            );
        }



        function initiatePage()
        {
            // At this point we've upload the pdf.
            // What we want to do is firstly get the number of jpgs. In order to avoid cors, we just store all the variable.       

            var name       = $('.systemGeneratedRandomName', element).val();

            var baseUrl    = global.baseUrl;
            var getUrl     = baseUrl + "getimagesquantity/";
            var jsonData   = {"imageFolder": name};

            $.ajax
            (
                {
                    type: "GET",
                    url: getUrl,
                    data:jsonData,
                    success: getPageQuantity,
                    error: function() { runtime.notify('error', {msg: response.message})}
                }
            );

            function getPageQuantity(response)
            {
                if (typeof(response) != "string")
                {
                    response = JSON.stringify(response);
                }
                
                response = JSON.parse(response)["result"];

                // only execute consequential codes when result.pages > 0; 
                if (response["pages"] > 0 )
                {
                    console.log("end");
                    setTotalPage(response);
                    initializePage(response);
                    //setPage();
                    //window.location.reload();
                }
            }


            function setPage(response)
            {
                $('.currentPage', element).val(1);
                console.log($('.currentPage', element));
            }

            function setTotalPage(response)
            {
                $('.totalPages', element).val(response["pages"]);
                console.log( $('.totalPages', element).val);
            }            

            function initializePage(response)
            {
                // postUrl here is for posting the message to the xblock special handle function.
                var postUrl = runtime.handlerUrl(element, 'set_page');

                var totalPages = response["pages"];

                var jsonData = JSON.stringify({"totalPages": totalPages});

                $.ajax
                (
                    {
                        type: "POST",
                        url: postUrl,
                        data: jsonData,
                        success: function(response)
                        {
                            console.log(response["result"]);
                            runtime.notify('save', {state: 'end'});
                        }
                    }
                );
            }       
        }

    // Following are testing code, can delete

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
    $(function ($) {
        /* Here"s where you"d do things on page load. */
    });
}
