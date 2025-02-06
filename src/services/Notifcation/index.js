import { Subject } from "rxjs";

const subject = new Subject();
const DefaultErrorMessage =
  "An unexpected error has occurred. Please try again.";

export const NotificationService = {
  sendMessage: (message, type, heading, autoDismiss) =>
    subject.next({
      message,
      type,
      heading,
      autoDismiss,
    }),
  clearMessages: () => subject.next(null),
  getMessage: () => subject.asObservable(),
  sendErrorMessage: (message = DefaultErrorMessage) =>
    subject.next({ message, type: "danger", heading: "Error" }),
  sendSuccessMessage: (message) =>
    subject.next({ message, type: "success", heading: "Success" }),
  sendInfoMessage: (message) =>
    subject.next({ message, type: "info", heading: "Info" }),
  sendWarningMessage: (message) =>
    subject.next({ message, type: "warning", heading: "Warning" }),
};
