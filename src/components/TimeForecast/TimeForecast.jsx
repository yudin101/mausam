import styles from "./TimeForecast.module.css";

function TimeForecast({time = "NA", img = "00", temp = "NA"}) {
	const src = `/mausam/weatherImages/${img}.svg`;

	return (
		<div className={styles.forecastBox}>
			<p className={styles.fbTime}>{time}</p>
			<img src={src} />
			<p className={styles.fbTemp}>{temp}</p>	
		</div>
	);
}

export default TimeForecast;