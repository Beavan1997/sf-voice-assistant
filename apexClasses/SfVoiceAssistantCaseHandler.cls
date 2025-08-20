@RestResource(urlmapping='/SfVoiceAssistantCaseHandler/*')
global with sharing class SfVoiceAssistantCaseHandler {
    
    @HttpPatch
    global static String updateCase(String caseNumber, String status) {
        Case c = [SELECT Id, Status FROM Case WHERE CaseNumber =: caseNumber.substring(1) LIMIT 1];
        c.Status = status;
        try{
            update c;
        } catch(DmlException e){
            RestContext.response.statusCode = 400;
            return e.getMessage();
        }
        return 'Case Updated';
    }
}