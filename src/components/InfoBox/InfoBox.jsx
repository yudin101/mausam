import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./InfoBox.module.css";

function InfoBox({icon = "NA", text = "NA", value = "NA"}) {
	return (
		<div className={styles.infoBox}>
			<FontAwesomeIcon className={styles.infoIcon} icon={icon} />

			<div className={styles.infoTextBox}>
				<h5>{text}</h5>
				<h2 className={styles.infoValue}>{value}</h2>
			</div>
		</div>
	);
}

export default InfoBox;