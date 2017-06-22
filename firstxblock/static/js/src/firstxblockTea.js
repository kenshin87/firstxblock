/* Javascript for FirstXBlock. */
function FirstXBlock(runtime, element) {

    var global = {};
        global.baseUrl = "http://127.0.0.1:8000/filecms/image/";



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
                        initiatePage();
                    }
                }
            );
        }

        function initiatePage()
        {
            alert("initiating")
            function setPage(response)
            {
                $('.currentPage', element).val(1);
                console.log($('.currentPage', element));
                window.cur = $('.currentPage', element);
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

                var page       = 0;
                var totalPages = response["pages"];
                var jsonData = JSON.stringify({"page": page, "totalPages": totalPages});

                $.ajax
                (
                    {
                        type: "POST",
                        url: postUrl,
                        data: jsonData,
                        success: function(response)
                        {
                            console.log(response["result"]);

                        }
                    }
                );
            }       

            function getPageQuantity(response)
            {
                console.log(src);

                if (typeof(response) != "string")
                {
                    response = JSON.stringify(response);
                }
                
                response = JSON.parse(response)["result"];

                // only execute consequential codes when result.pages > 0; 
                if (response["pages"] > 0 )
                {
                    alert(src);
                    var localSrc = src;

                    console.log(src);
                    console.log(src);
                    console.log(src);
                    console.log(src);
                    setTotalPage(response);
                    initializePage(response);
                    setPage();
                    //$('img', element)[0].src = localSrc;
                }
            }

            //     What we want to do is firstly get the number of jpgs. But the issue here is that all the files are stored inside the teacher's server, 
            // so we cannot use a post method, what we can do is just use a get method to visit teacher's server.
            //             
            var name       = $('.systemGeneratedRandomName', element).text();

            var baseUrl    = global.baseUrl;
            var getUrl     = baseUrl + "getimagesquantity/";
            var src        = baseUrl + "getimages/" + name + "?page=0";
            var jsonData   = {"imageFolder": name};
            console.log(src);


            $.ajax
            (
                {
                    type: "GET",
                    url: getUrl,
                    data:jsonData,
                    success: getPageQuantity,
                }
            );
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



    $(function ($) {
        /* Here"s where you"d do things on page load. */
    });


}
