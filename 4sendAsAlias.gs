function sendEmailWithAlias(recipientEmail, subject, message) {
  // Set the "from" address to your alias or "Send mail as" address
  var aliasEmail = 'alias@example.com'; // Replace with your alias email address

  // Send the email using the specified alias
  GmailApp.sendEmail(recipientEmail, subject, message, {
    from: aliasEmail,
  });
}

function onFormSubmit(e) {
  var responses = e.values; // Form responses
  var templateFileId = 'YOUR_TEMPLATE_DOC_ID'; // Replace with the template file ID from your Google Drive
  var folderId = 'YOUR_FOLDER_ID'; // Replace with the destination folder ID in your Google Drive
  var recipientEmail = responses[1]; // Assuming the email is in the 2nd column
  var name = responses[2]; // Assuming the name is in the 3rd column

  // Create a new Google Docs document based on the template
  var newDoc = DriveApp.getFileById(templateFileId).makeCopy(name + ' Certificate', DriveApp.getFolderById(folderId));
  var newDocId = newDoc.getId();
  var newDocFile = DriveApp.getFileById(newDocId);
  var newDocBody = DocumentApp.openById(newDocId).getBody();

  // Replace placeholders in the new document with form responses
  var courseTitle = responses[3]; // Assuming the course title is in the 4th column
  newDocBody.replaceText('<<Name>>', name);
  newDocBody.replaceText('<<CourseTitle>>', courseTitle);

  // Save and close the new document
  DocumentApp.openById(newDocId).saveAndClose();

  // Create a PDF version of the new document
  var pdfFile = newDocFile.getAs('application/pdf');

  // Send the email with the PDF certificate as an attachment
  var subject = 'Your Certificate for ' + courseTitle;
  var message = 'Dear ' + name + ',\n\nPlease find your certificate attached.';
  sendEmailWithAlias(recipientEmail, subject, message); // Send the email using the alias

  // Optionally, you can delete the temporary copy of the template if needed
  DriveApp.getFileById(newDocId).setTrashed(true);
}
