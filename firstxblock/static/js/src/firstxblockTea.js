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
    
    function changesoloInput(result)
    {
        alert("change solo success");

        $('.soloinput', element).val(result.count);
    }

    var handlerUrl = runtime.handlerUrl(element, 'changesolo');
    window.handlerUrl = handlerUrl;
    console.log(handlerUrl);

    $('.changesolob', element).click(
        function(eventObject) 
        {
            console.log("testing state solo ")


            $.ajax
            (
                {
                    type: "POST",
                    url: handlerUrl,
                    data: JSON.stringify({"hello": "world"}),
                    success: changesoloInput
                }
            );
        }
    );

    function changesumInput(result)
    {
        alert("change sum success");
        $('.suminput', element).val(result.count);
    }

    var handlerUrl = runtime.handlerUrl(element, 'changesum');
    window.handlerUrl = handlerUrl;
    console.log(handlerUrl);

    $('.changesumb', element).click(
        function(eventObject) 
        {
            console.log("testing state sum works")


            $.ajax
            (
                {
                    type: "POST",
                    url: handlerUrl,
                    data: JSON.stringify({"hello": "world"}),
                    success: changesumInput
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


                    success: function(result)
                    {
                        alert(321);
                    }
                }
            )
        }
    );








    $(function ($) {
        /* Here's where you'd do things on page load. */
    });


}
