// import React, { useState, useEffect } from "react";
// import { Image, TouchableOpacity } from "react-native";
// import { MQTTClient } from "sp-react-native-mqtt";

// export let isConnected = false;

// export default function MqttService() {
// 	const [client, setClient] = useState(null);
// 	const [pressed, setPresses] = useState(false);

// 	useEffect(() => {
// 		const createClient = async () => {
// 			try {
// 				const client = new MQTTClient({
// 					serverUri: "mqtt://your_mqtt_broker_address",
// 					clientId: "your_client_id",
// 				});

// 				await client.connect(); // Wait for connection before setting state
// 				setClient(client);

// 				client.on("connect", () => {
// 					setIsConnected(true);
// 					console.log("Connected to MQTT broker");
// 				});

// 				client.on("disconnect", () => {
// 					setIsConnected(false);
// 					console.log("Disconnected from MQTT broker");
// 				});

// 				client.on("message", (message) => {
// 					console.log("Received message:", message.topic, message.payloadString);
// 				});
// 			} catch (error) {
// 				console.error("Error connecting to MQTT broker:", error);
// 			}
// 		};

// 		createClient();

// 		return () => {
// 			if (client) {
// 				client.disconnect();
// 			}
// 		};
// 	}, []);

// 	const publishMessage = (message) => {
// 		if (client) {
// 			client.publish("your_topic", message);
// 		}
// 	};

// 	return (
		// <TouchableOpacity
		// 	onPress={() => {
		// 		const message = pressed ? "off" : "on";
		// 		publishMessage(message);
		// 		setPresses((pressed) => !pressed);
		// 	}}
		// 	className="flex-1 border-2 border-[#1a1a1b] rounded-full "
		// 	activeOpacity={0.5}
		// >
		// 	{pressed ? (
		// 		<Image
		// 			source={require("../assets/images/on.png")}
		// 			style={{ width: 80, height: 80, borderColor: "black" }}
		// 		/>
		// 	) : (
		// 		<Image
		// 			source={require("../assets/images/off.png")}
		// 			style={{ width: 80, height: 80 }}
		// 		/>
		// 	)}
		// </TouchableOpacity>
// 	);
// }
