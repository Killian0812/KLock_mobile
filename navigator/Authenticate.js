import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export default function Authenticate({ navigation }) {
    const { auth } = useAuth();

    useEffect(() => {
        console.log("Authenticating...");
        if (auth?.accessToken)
            navigation.navigate("Main");
        else
            navigation.navigate("Login");
    }, []);
}
