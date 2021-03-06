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
        ajaxUpload
    );

        function ajaxUpload (eventObject)
        {
            console.log("enter ajax upload");

            // make sure a file is selectd
            if ( $(".file-upload", element)[0].files.length == 0 )
            {
                eventObject.preventDefault();
                $(".noUploadWarning", element).css("background-color", "#f11")
                $(".noUploadWarning", element).text("请先点击“选择文件”按钮选择一个pdf文件");
            }

            // when there is a file
            else 
            {    
                var nameList = $(".file-upload", element)[0].files[0].name.split("."); 
                if (  nameList.length != 2 || nameList[1].toLowerCase() != "pdf" )
                {
                    eventObject.preventDefault();
                    $(".noUploadWarning", element).css("background-color", "#f11")
                    $(".noUploadWarning", element).text("只支持pdf文件的上传！");
                }
                else
                {
                    // ajaxing the file.
                    //    0: change name both in the xblock and html;
                    //    1: alert error.
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
                                if (typeof(response) != "string")
                                {
                                    response = JSON.stringify(response);
                                }
                                runtime.notify('save', {state: 'end'});
                                changeName(response);
                            }, 

                            error: function(response)
                            {
                                alert("The upload fails!");
                                alert(response);
                                runtime.notify('error', {msg: "文件上传失败，请联系网站管理员。"})
                            }
                        }
                    )
                }
            }
        }

        // Argument response here is just a string of " {"result": {"file_url": "asdasdasd.pdf"}} "
        function changeName(response) 
        {
            // renew the systemGeneratedRandomName and displayName inside xblock;
            // response here is string:
            //       '{systemGeneratedRandomName: "1498633479623217", "displayName":"加密pdf"}'

            console.log("enter changeName");
            runtime.notify('save', {state: 'start'});
            var jsonParsedResponse = JSON.parse(response);
            var systemGeneratedRandomName  = jsonParsedResponse["result"]["file_url"];

            var postUrl = runtime.handlerUrl(element, "renewFile");

            var preSystemGeneratedRandomName = systemGeneratedRandomName.replace(".pdf", "");
            var firstXBlockTeaDisplayName    = $(".firstXBlockTeaDisplayName", element).val();


            var jsonData = JSON.stringify(
                    {
                        "systemGeneratedRandomName": preSystemGeneratedRandomName, 
                        "displayName": firstXBlockTeaDisplayName,
                    }
                );

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(response)
                    {
                        // if successful, means that the names inside xblock is updated. Now what we need to do is just update the page.
                        $(".systemGeneratedRandomNameTea", element).val(preSystemGeneratedRandomName);
                        $(".firstXBlockTeaDisplayName", element).val(firstXBlockTeaDisplayName);
                        runtime.notify('save', {state: 'end'});
                        initiatePage();
                    },
                    error: function(response)
                    {
                        alert("The changeName fails!");
                        alert(response);
                        runtime.notify('error', {msg: "更改文件新名字失败，请联系网站管理员。"})
                    }                    
                }
            );
        }



        function initiatePage()
        {
            console.log("enter initiatePage");
            // At this point we've upload the pdf, update both html and xblock name.
            // What we want to do is first get the number of jpgs. In order to avoid cors, we just store all the variable.    

            runtime.notify('save', {state: 'start'});
   
            var name       = $('.systemGeneratedRandomNameTea', element).val();
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
                    error: function(response) 
                    {
                        runtime.notify('error', {msg: "更新新页面信息失败，请联系网站管理员。"})
                    }
                }
            );

            function getPageQuantity(response)
            {
                /*
                    // response here is string:
                    `  
                        {
                            result: 
                            {
                                page : 16 
                            }
                        }
                    `
                */
                if (typeof(response) != "string")
                {
                    response = JSON.stringify(response);
                }
             
                response = JSON.parse(response)["result"];

                if (response["pages"] <= 0 )
                {
                    console.log("nothing");
                }

                // only execute consequential codes when result.pages > 0; 
                else if ( response["pages"] > 0 )
                {
                    // When page > 0, then we again need to update page inside xblock and page inside the html.
                    updateTotalPage(response);

                    function updateTotalPage(response)
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
                                    runtime.notify('save', {state: 'end'});
                                    window.location.reload();
                                }
                            }
                        );
                    }                           
                }
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
