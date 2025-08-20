@RestResource(urlmapping='/SfVoiceAssistantCaseCommentHandler/*')
global with sharing class SfVoiceAssistantCaseCommentHandler {
    @HttpPost
    global static String createCaseComment(String caseNumber, String caseComment){
        
        Case c = [SELECT Id, Status FROM Case WHERE CaseNumber =: caseNumber.substring(1) LIMIT 1];
        CaseComment cComment = new CaseComment();
        cComment.CommentBody = caseComment;
        cComment.ParentId = c.Id;
        try{
            insert cComment;
        } catch(DmlException e){
            RestContext.response.statusCode = 400;
            return e.getMessage();
        }
        return 'Case Comment Created';
    }
}