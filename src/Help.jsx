import React from 'react';
import './Help.css';

export default function Help() {
    return (
        <div className='main-content'>
            <h3>Salesforce Assistant Chrome Extension - Help Manual</h3>

            <section class="how-to-use">
                <h4>How to Use:</h4>
                <ol>
                    {<li>
                        Login using your Salesforce credentials in the Settings section:
                        <ul>
                            <li><b>User Id:</b> Salesforce User Id</li>
                            <li><b>API Token:</b> You Salesforce User Name appended with Security token. You can get information of how to generate your token <a href="https://help.salesforce.com/s/articleView?id=xcloud.user_security_token.htm&type=5" target="_blank">here</a>.</li>
                            <li><b>Client Id:</b> Your Salesforce Connected App Client Id. If you do not have one, please reach out to your Admin</li>
                            <li><b>Client Secret:</b> Your Salesforce Connected App Client Id. If you do not have one, please reach out to your Admin</li>
                        </ul>
                    </li>}
                    <li>
                        Grant Permissions:
                        <ul>
                            <li>In Chrome extension site settings, Provide access to microphone for the extension</li>
                            <li>Granting these permissions is necessary for the extension to function properly.</li>
                        </ul>
                    </li>
                    <li>
                        Classes Required in your Salesforce org:
                        <ul>
                            <li>In your Salesforce org, upload the two Apex classes available <a href="https://github.com/Beavan1997/sf-voice-assistant/tree/main/apexClasses" target="_blank">here</a></li>
                        </ul>
                    </li>
                    <li>
                        Use Voice Commands:
                        <ul>
                            <li>The extension utilizes voice recognition to understand your commands.</li>
                            <li>Here are the specific phrases you can use for each action:</li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section>
                <h4>Supported Actions:</h4>
                <ul class="supported-actions">
                    <li><b>Update Case Status:</b> Updates the Status on the Case Record.</li>
                    <li><b>Add Case Comment:</b> Adds a new comment on the Case Record.</li>
                </ul>
            </section>

            <section class="voice-commands">
                <h4>Voice Commands:</h4>
                <ul>
                    <li><b>Update Case Status:</b> On Case Number {'<'}CASE NUMBER{'>'} <i>Update</i> status to {'<'}STATUS{'>'}</li>
                    <li><b>Add Case Comment:</b> On Case Number {'<'}CASE NUMBER{'>'} <i>Add</i> comment {'<'}COMMENT{'>'}</li>
                </ul>
                <h4>Alternate Keywords:</h4>
                <h6>The below keywords can be used in place of <i>Keywords</i> above as alternatives to perform the mentioned operations</h6>
                <ul>
                    <li><b>Update Case Status:</b> Update, Set, Change, Alter, Modify, Edit, Correct, Make</li>
                    <li><b>Add Case Comment:</b> Create, Insert, Add, Implement, Generate, Compose, Form, Formulate, Setup</li>
                </ul>
            </section>
        </div>
    );
}
