import {
	Image,
	ImageBackground,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
// import MqttService, { isConnected } from "../utils/mqttService";

const videoSource = require("../assets/videos/screen.mp4");

async function saveTime(value) {
	await SecureStore.setItemAsync("time", value.toString());
}

async function getSavedTime() {
	return await SecureStore.getItemAsync("time");
}

const formatTime = (ms) => {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
		2,
		"0"
	)}`;
};

export default function Index() {
	const player = useVideoPlayer(videoSource, (player) => {
		player.muted = true;
		player.loop = true;
		player.play();
	});

	const [pressed, setPressed] = useState(false);
	const [isAvailable, setisAvailable] = useState(true);
	const [canPress, setCanPress] = useState(true);
	const [time, setTime] = useState(0);
	const [intervalId, setIntervalId] = useState(null);
	const [fetchData, setFetchData] = useState([]);

	const handlePress = () => {
		if (canPress) {
			setCanPress(false);
			setPressed((prev) => !prev);
			if (pressed) {
				stopTimer();
				sendMessage("OFF");
			} else {
				sendMessage("ON");
				startTimer();
			}
		}
	};

	const sendMessage = async (message) => {
		setisAvailable(false);
		try {
			const response = await fetch(
				`https://api.thingspeak.com/update?api_key=4HG4KJLPNSO8602L&field1=${message}`
			);
			if (!response.ok) {
				console.error("Failed to send message:", response.status);
			}
		} catch (error) {
			console.error("Error sending message:", error);
		}

		setTimeout(() => {
			setisAvailable(true);
			setCanPress(true);
		}, 15000);
	};

	// Function to start the timer
	const startTimer = async () => {
		const startTime = Date.now();
		await saveTime(startTime);

		// Start interval to update time every second
		const id = setInterval(() => {
			getSavedTime().then((savedTime) => {
				if (savedTime) {
					const elapsedTime = Date.now() - parseInt(savedTime, 10);
					setTime(elapsedTime);
				}
			});
		}, 1000);

		setIntervalId(id);
	};

	// Function to stop the timer
	const stopTimer = () => {
		clearInterval(intervalId);
		setIntervalId(null);
		setTime(0);
	};

	const localtime = (timestamp) => {
		const date = new Date(timestamp);
		const options = {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		};
		const localTime = date.toLocaleTimeString("en-IN", options);

		return localTime;
	};

	useEffect(() => {
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [intervalId]);

	useEffect(() => {
		const fetchIoTData = async () => {
			const request = await fetch(
				"https://api.thingspeak.com/channels/2786015/fields/1.json?api_key=NRREBA70B63XIRJ4&results=4"
			);
			const data = await request.json();
			setFetchData(data.feeds);
			console.log("\n\n\nlast:", fetchData);
		};
		fetchIoTData();
	}, [pressed]);

	return (
		<ImageBackground
			source={require("../assets/images/metal.jpg")}
			className="flex-1 items-center"
		>
			<StatusBar barStyle="light-content" backgroundColor="#000" />

			<View className="w-full h-1/2 border-8 border-[#101010] rounded-b-[40] justify-center items-center overflow-hidden">
				<View
					style={{
						width: "100%",
						height: "100%",
						position: "relative",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<VideoView
						nativeControls={false}
						player={player}
						style={{
							width: "210%",
							height: "120%",
						}}
					/>
					<Text
						style={{
							position: "absolute",
							top: "12%",
							color: "#19191add",
							fontSize: 16,
							fontWeight: "bold",
							textAlign: "center",
						}}
					>
						Device on for:
					</Text>
					<Text
						style={{
							position: "absolute",
							top: "18%",
							color: "#19191add",
							fontSize: 80,
							fontWeight: "bold",
							textAlign: "center",
						}}
					>
						{pressed ? formatTime(time) : "00:00"}
					</Text>

					{fetchData.length > 0 ? (
						<>
							<Text
								style={{
									position: "absolute",
									top: "53%",
									color: "#19191add",
									fontSize: 16,
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								Last Activity:
							</Text>
							<Text
								style={{
									position: "absolute",
									top: "65%",
									color: "#19191add",
									fontSize: 16,
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								Device turned {fetchData && fetchData[3].field1} at{" "}
								{localtime(fetchData[3]?.created_at)}
							</Text>
							<Text
								style={{
									position: "absolute",
									top: "72%",
									textAlign: "center",
									color: "#19191add",
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Device turned {fetchData && fetchData[2].field1} at{" "}
								{localtime(fetchData[2]?.created_at)}
							</Text>
							<Text
								style={{
									position: "absolute",
									top: "79%",
									textAlign: "center",
									color: "#19191add",
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Device turned {fetchData && fetchData[1].field1} at{" "}
								{localtime(fetchData[1]?.created_at)}
							</Text>
							<Text
								style={{
									position: "absolute",
									top: "86%",
									textAlign: "center",
									color: "#19191add",
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Device turned {fetchData && fetchData[0].field1} at{" "}
								{localtime(fetchData[0]?.created_at)}
							</Text>
						</>
					) : null}
				</View>
			</View>

			<View className="bg-[#19181add] rounded-full w-80 h-80 mt-16 p-4 items-center justify-between">
				<Text className="text-white font-bold p-2">MENU</Text>

				<View className="w-full flex-row justify-between items-center p-2">
					<FontAwesome5 name="fast-backward" size={20} color="white" />

					<TouchableOpacity
						onPress={handlePress}
						className="border-2 border-[#1a1a1b] rounded-full "
						activeOpacity={0.5}
					>
						{pressed ? (
							<Image
								source={require("../assets/images/on.png")}
								style={{ width: 80, height: 80, borderColor: "black" }}
							/>
						) : (
							<Image
								source={require("../assets/images/off.png")}
								style={{ width: 80, height: 80 }}
							/>
						)}
					</TouchableOpacity>

					<FontAwesome5 name="fast-forward" size={20} color="white" />
				</View>

				<MaterialCommunityIcons name="playlist-music" size={27} color="white" />
			</View>

			<View className="flex-row w-full justify-between items-center px-8 mt-14">
				{isAvailable ? (
					<Image
						source={require("../assets/images/green.png")}
						style={{ width: 22, height: 22 }}
					/>
				) : (
					<Image
						source={require("../assets/images/grey.png")}
						style={{ width: 22, height: 22 }}
					/>
				)}
			</View>
		</ImageBackground>
	);
}
