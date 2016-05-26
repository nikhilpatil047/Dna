'use strict';

var Constants = function() {
	this.RESPONSE_SUCCESS = "200";
	this.RESPONSE_ERROR = "500";
	this.RESPONSE_PAGE_NOT_FOUND = "404";	
	this.ACTIVATION_CODE = "001";
	this.REGISTRATION_SUCCESS_RESP = "User registration is successful.";
	this.LOGOUT_SUCCESSFUL = "User logged out successfully.";
	this.STATUS_SUCCESS = "SUCCESS";
	this.STATUS_ERROR = "ERROR";
	this.STATUS_WARNING = "WARNING";
	this.USER_DELETED = "Sorry to see you go! Your account has been deleted successfully.";
	this.USER_REMOVED = "Removed Users successfully.";
	this.ASSIGN_MEMBER = "Invites sent successfully.";
	this.NEW_EMAIL_ACTIVATION = "Thanks! Your account is verified successfully. You can now login to your account.";
	this.NEW_EMAIL_VERIFICATION = "Profile updated successfully.New Email Id verification link has been sent to your email id."
	this.VERIFICATION = "Verification process completed.";
	//this.EMAIL_VERIFICATION_COMPLETED = "Thanks! Your account is verified successfully. You can now login to your account.";
	this.PASSWORD_UPDATION = "We've emailed you instructions to reset your password. Please check your inbox. If you're still having trouble write to support@idealyte.io."
	this.UPDATE_SUCCESSFUL = "Updation Successful.";
	this.PASSWORD_RESET_SUCCESSFUL = "Your password was updated successfully. Please login with your new password.";
	this.REGISTRATION_SUCCESS_GROUP = "User registration is successful. Please login to accept group invite. ";
	this.INVITE_ACCEPT = "You are added to new group.";
	this.INVITE_DECLINE = "You have rejected invitation.";
	this.PROJECT_INVITATION_MESSAGE = "New Project Invitation.";
	this.PROJECT_CREATED_SUCCESSFULLY = "Project created successfully and email has been sent to all project members."
	this.PROJECT_INVITE_ACCEPT ="You are added to new Project.";
	this.DOCUMENT_DELETED = "Media file(s) deleted successfully.";
	this.DOCUMENT_UPLOADED = "Document is uploaded successfully.";
	this.DOCUMENT_RESTORE = "Document/media successfully restored.";
	this.PROJECT_UPDATED_SUCCESSFULLY = "Project details updated successfully.";
	this.ENTRY_DELETED = "Entry successfully deleted.";
	this.ENTRY_CREATED_SUCCESSFULLY = "Entry created successfully.";
	this.ENTRY_UPDATED_SUCCESSFULLY = "Entry updated successfully.";
	this.ENTRY_RESTORE = "Entry successfully restored.";
	this.ANNOTATION_SAVED_SUCCESSFULLY = "Annotation saved successfully.";
	this.COMMENT_DELETED = "Comment successfully deleted.";
	this.RESEND_LINK_SUCCESSFULLY = "Activation email has been resent. Please check your mailbox to continue.";
	this.ACTION_CREATED_SUCCESSFULLY = "Action created successfully.";
	this.ACTION_DELETED = "Action successfully deleted.";
	this.ACTION_UPDATED_SUCCESSFULLY = "Action updated successfully.";
	this.ACCOUNT_VERIFIED_THROUGH_GROUP_LINK = "Your account is now verified.";
	this.ACTIVITY_TYPE = {
		ENTRY : "entry",
		DOCUMENT : "document",
		MEMBER : "member",
		NDA : "nda",
		PROJECT : "project",
		GROUP : "group"
	};

	this.ACTION_TYPE = {
		ADD : "added",
		UPDATE : "updated",
		DELETE : "removed",
		RESTORE : "reverted",
		LEAVE : "leave"
	};

	this.GROUP_BUTTON_TEXT = "Join Group";
	this.PROJECT_BUTTON_TEXT = "Join Project";
	this.SIGNUP_BUTTON_TEXT = "Sign Up";
	this.SIGNIN_BUTTON_TEXT = "Verify My Account";
	this.GROUP_SIGNUP_INVITATION_MESSAGE = "You've been invited to join the group.Click the link below to Sign up to Idealyte & get started.";
	this.GROUP_EMAIL_WELCOME_MESSAGE = " ";
	this.GROUP_INVITATION_MESSAGE = "You've been invited to join the group.Click the link below to join the group.";
	this.PROJECT_EMAIL_WELCOME_MESSAGE = " ";
	this.PROJECT_INVITATION_MESSAGE = "You've been invited to join the project.Click the link below to join the project.";
	this.SIGNUP_EMAIL_WELCOME_MESSAGE = "Thanks for signing-up and welcome to Idealyte! You're just a click away from getting started.";
	this.SIGNUP_INVITATION_MESSAGE = "This email includes a verification link to activate your account. Click on the "+'"'+"Verify My Account"+'" '+"button below.";
	this.EMAIL_VERIFICATION_WELCOME_MESSAGE =" ";
	this.EMAIL_VERIFICATION_MESSAGE = "You recently submitted a request to change your registered email address. Please click on the Verify Email action below to proceed.";
	this.PASSWORD_RESET_WELCOME_MESSAGE = "";
	this.PASSWORD_RESET_MESSAGE = "Somebody recently submitted a request to reset your Idealyte password. If you've requested for this, click on the Reset Password action below to proceed.";
	this.OLD_ACCOUNT_ACTIVATION_MESSAGE = "Old account activation link.";
	this.RESET_PASSWORD_BUTTON_TEXT = "Reset Password";
	this.ACTIVE_OLD_ACCOUNT_BUTTON_TEXT = "Activate Account";
	this.EMAIL_VERIFICATION_BUTTON_TEXT ="Verify Email";
	this.SIGNUP_MESSAGE_FOR_LINK = "You can also copy-paste this link in your browser to activate your account:";
	this.SIGNUP_NOTE_MESSAGE = "Note that this link expires in 15 days. You can sign up again if the link has expired.";
	this.SIGNIN_SUBJECT_MESSAGE = "Welcome to Idealyte!";
	this.PASSWORD_RESET_SUBJECT_MESSAGE = "Idealyte: Forgot your password?";
	this.EMAIL_VERIFICATION_SUBJECT_MESSAGE = "Idealyte: Confirm change of email address.";
	this.PASSWORD_RESET_MESSAGE_FOR_LINK = "You can also copy-paste this link in your browser to proceed:";
	this.PASSWORD_RESET_NOTE_MESSAGE = "Note that this link expires in 1 day. If you haven't requested for this, you can simply ignore this email and continue using your existing password.";
	this.EMAIL_VERIFICATION_MESSAGE_FOR_LINK = "You can also copy-paste this link in your browser to proceed:";
	this.EMAIL_VERIFICATION_NOTE_MESSAGE = "Note that this link expires in 1 day. Also note that after a successful verification, you will no longer be able to login with your older email address. Please use this new email address to login. ";
	this.GROUP_INVITATION_SUBJECT_MESSAGE = "You’re invited to collaborate!";	
	this.GROUP_INVITATION_MESSAGE_FOR_LINK = "You can also copy-paste this link in your browser to proceed:";
	this.GROUP_INVITATION_NOTE_MESSAGE = "Note that this link expires in 15 days.";
	this.PROJECT_INVITATION_MESSAGE_FOR_LINK = "You can also copy-paste this link in your browser to proceed:";
	this.PROJECT_INVITATION_NOTE_MESSAGE = "Note that this link expires in 15 days.";
	this.PROJECT_INVITATION_SUBJECT_MESSAGE = "You’re invited to collaborate!";
	this.PROCESS_TYPE = {
		PROJECT : "project",
		GROUP : "group",
		ENTRY : "entry"
	};

	this.ORGANIZATION_ID = {
		MINDSTIX : "1001"
	};
	this.DOCUMENTS_LIMIT = 5;
	this.LINK_EXPIRATION_TIME = 21600;//60 * 24 * 15; //here time is in minutes.[minutes * hours * days]
	
	this.CONTENT_TYPE = {
		ENTRY : "entry",
		DOCUMENT : "document",
		ANNOTATION : "annotation",
		ACTION : "action"
	};

	this.USER_TYPE = {
		TOUCHER : "toucher",
		GRABBER : "grabber",
		HOLDER : "holder"
	};
	this.NOTIFICATION_TYPE = {
		PROJECT : "project",
		GROUP : "group",
		ENTRY : "entry",
		DOCUMENT : "document",
		ANNOTATION : "annotation",
		ACTION : "action"
	};
	this.NOTIFICATION_ACTIVITY_TYPE = {
		ADMIN : "admin",
		USER : "user",
		NAME : "name",
		GROUP : "group",
		PROJECT : "project",
		ACTION : "action",
		ANNOTATION : "annotation",
		DOCUMENT : "document",
		OVERDUE : "overdue",
		ENTRY : "entry"
 	};
 	this.NOTIFICATION_ACTION_TYPE = {
 		INVITED : "invited",
 		UPGRADED : "upgraded",
 		DOWNGRADED : "downgraded",
 		REMOVED : "removed",
 		CHANGED : "changed",
 		DELETED : "deleted",
 		REVERTED : "reverted",
 		ADDED : "added",
 		COMPLETED : "completed",
 		COMMENTED : "commented",
 		ASSIGNED : "assigned",
 		SUBMITTED : "submitted",
 		REVIEW : "review",
 		NOT_ASSIGNED : "not assigned",
 		RESPONDED : "responded",
 		UPDATED : "updated"
 	};
 	this.PRIORITY = {
 		HIGH : "high",
 		LOW : "low"
 	};
 	this.NEW_EMAIL_ACTIVATION_EXPIRATION_TIME = 1296000;//60 * 60 * 24 * 15; //here time is in seconds.

 	this.IMAGE_DIV_WIDTH = 200;
 	this.IMAGE_DIV_HEIGHT = 200;
 	this.EMAIL_VERIFICATION_PENDING = "Verification pending for new email address:";
};


// Exports module.
module.exports = new Constants();
