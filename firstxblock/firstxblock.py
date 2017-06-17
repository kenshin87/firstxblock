"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment

"""
The aim of this method is to display some images.
actually we can just store the relative infomations inside the field
, which will greatly reduce the workload.
We can store:
    1. the number of the total pages
    2. the current page
"""

class FirstXBlock(XBlock):

    fileName= String(
        default = "no file", scope = Scope.settings,
        help = "name of the pdf file"
    )

    systemGeneratedRandomName = String(
        default = "no file", scope = Scope.settings,
        help = "name of the pdf file"
    )



    href = String(display_name="href",
                  default="http://www.upv.es/miw/infoweb/vcamp/info/plano-upv-es.pdf",
                  scope=Scope.content,
                  help="PDF file that will be shown in the XBlock")

    display_name = String(display_name="Display Name",
                          default="firstxblock",
                          scope=Scope.settings,
                          help="Name of the component in the edxplatform")



    count = Integer(
        default= 0, scope=Scope.settings,
        help="total pages",
    )



    totalPages = Integer(
        default= 10, scope=Scope.user_state,
        help="total pages",
    )
    page       = Integer(
        default= 0, scope=Scope.user_state,
        help="the current page",
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.

    
    def student_view(self, context=None):
        """
        The primary view of the FirstXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/firstxblockStu.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/firstxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/firstxblockStu.js"))
        frag.initialize_js('FirstXBlock')
        return frag
    
    
    def studio_view(self, context=None):
    #def student_view(self, context=None):
        """
        The primary view of the paellaXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/firstxblockTea.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/firstxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/firstxblockTea.js"))
        frag.initialize_js('FirstXBlock')
        return frag


    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        print "see"
        assert data['hello'] == 'world'

        self.count += 1
        return {"count": self.count}



    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def get_page(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        newPage = int(data["page"])
        print newPage
        print type(data['page'])
        # Just to show data coming in...
        if newPage >= 0 and newPage < self.totalPages:
            self.page = newPage

        self.count += 1
        #return {"count": self.count, "page":page}
        print self.page
        return {"count": self.count, "page": self.page}


    @XBlock.json_handler
    def initiatePage(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """

        print 123466

        assert data["fileName"] == "document"


        # Here need to check how many file are there inside the server
        pages = 15
        self.totalPages = pages
        return { "page": pages}

    @XBlock.json_handler
    def checkFile(self, data, suffix=''):
        assert 1 == 1
        self.systemGeneratedRandomName = data["systemGeneratedRandomName"]
        # Here need to check how many file are there inside the server
        return { "systemGeneratedRandomName": self.systemGeneratedRandomName}





    @XBlock.json_handler
    def updateFile(self, data, suffix=''):
        return { "systemGeneratedRandomName": self.systemGeneratedRandomName}






    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("FirstXBlock",
             """<firstxblock/>
             """),
            ("Multiple FirstXBlock",
             """<vertical_demo>
                <firstxblock/>
                <firstxblock/>
                <firstxblock/>
                </vertical_demo>
             """),
        ]
