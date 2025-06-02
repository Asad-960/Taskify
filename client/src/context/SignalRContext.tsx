import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";


interface SignalRContextType {
    connection: signalR.HubConnection | null;
    isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextType | null>(null);


export const SignalRProvider = ({children} : {children: React.ReactNode}) => 
{
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
    }, []);

    useEffect(() => {
        const connect = async () => {
            if (connectionRef.current)  return;

            const connection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5001/reminders", {
                    accessTokenFactory: () => localStorage.getItem("token") || ""
                })
                .withAutomaticReconnect()
                .build();
            connection.on("ReceiveReminder", (message: any) => {
                console.log("Message received from SignalR:", message);
                if (Notification.permission === "granted") {
                    new Notification("⏰ Task Reminder", {
                        body: `${message.title} is due in 1 hour!`,
                    });
                }
            });
            try {
                await connection.start();
                console.log("SignalR connected");
                connectionRef.current = connection;
                setIsConnected(true);
            } catch (error) {
                console.error("SignalR connection error:", error);     
            }

        };
        connect();
        return () => {
            connectionRef.current?.stop()
            connectionRef.current = null;
        };
    }, []);

    return (
        <SignalRContext.Provider value={{ connection: connectionRef.current, isConnected }}>
            {children}
        </SignalRContext.Provider>
    )
};

export const useSignalR = () => useContext(SignalRContext);