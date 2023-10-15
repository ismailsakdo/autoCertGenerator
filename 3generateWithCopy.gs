//GoogleDocsId: 1GD-HXXXXXX
//FolderId:1y7fCiAFAtvtghHDCXKwyZbm1I4F-pupZ

function onFormSubmit(e) {
  var responses = e.values; // Form responses
  var templateFileId = '1GD-HXXXXX'; // Replace with the template file ID from your Google Drive
  var folderId = '1y7fXXX'; // Replace with the destination folder ID in your Google Drive
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
  GmailApp.sendEmail(recipientEmail, subject, message, {
    attachments: [pdfFile],
  });

  // Optionally, you can delete the temporary copy of the template if needed
  DriveApp.getFileById(newDocId).setTrashed(true);
}

