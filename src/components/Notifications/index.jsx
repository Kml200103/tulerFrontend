// Notification.js
import { toast, ToastContainer } from "react-toastify";

import React, { useEffect, Fragment } from "react";
import { NotificationService } from "../../services/Notifcation";

const Notification = () => {
  useEffect(() => {
    const subscription = NotificationService.getMessage().subscribe(
      (message) => {
        if (message) {
          if (message.type === "success") {
            toast.success(message.message);
          } else if (message.type === "danger") {
            toast.error(message.message);
          } else if (message.type === "warning") {
            toast.warning(message.message);
          } else {
            toast.info(message.message);
          }
        }
      }
    );

    // Clean up function that runs when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Add an empty dependency array to run this effect only once

  return (
    <Fragment>
      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Fragment>
  );
};

export default Notification;
