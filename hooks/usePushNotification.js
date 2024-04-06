import { useContext } from "react";
import PushNotificationContext from "../context/PushNotificationProvider";

const usePushNotification = () => {
    return useContext(PushNotificationContext);
}

export default usePushNotification;