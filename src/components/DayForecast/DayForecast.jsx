import styles from "./DayForecast.module.css";

function DayForecast({day = "NA", img = "00", desc = "NA", maxTemp = "NA", minTemp = "NA"}) {

	const src = `/mausam/weatherImages/${img}.svg`;

	return (
		<li className={styles.dayBox}>
			<p className={styles.dayName}>{day}</p>
			<div className={styles.dayDesc}>
				<img src={src} />
				<p>{desc}</p>
			</div>
			<p className={styles.dayTemp}><span>{maxTemp}</span>/{minTemp}</p>	
		</li>
	);
}

export default DayForecast;