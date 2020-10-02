import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { me as appbit } from "appbit";
import { BodyPresenceSensor } from "body-presence";
import { today as todayStats } from "user-activity";
import { battery } from "power";
import { charger } from "power";


// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const heartLabel = document.getElementById("heartLabel");
const caloriesLabel = document.getElementById("caloriesLabel");
const stepsLabel = document.getElementById("stepsLabel");
const activeLabel = document.getElementById("activeLabel");
const floorsLabel = document.getElementById("floorsLabel");
const distanceLabel = document.getElementById("distanceLabel");
const powerLabel = document.getElementById("powerLabel");
const batImg = document.getElementById("batImg"); 
const monthLabel = document.getElementById("monthLabel");
const dateLabel = document.getElementById("dateLabel");

// Update the <text> element every tick with the current time

clock.ontick = (evt) => {
// **********Determines if battery is charging or not**********
  if (charger.connected) {
        batImg.href = "battery-charging.png";
  } else {
   batteryLevel();
  }
  if (appbit.permissions.granted("access_activity")) {
        stepsLabel.text=`${todayStats.adjusted.steps}`;
        distanceLabel.text=`${todayStats.adjusted.distance}`;
        floorsLabel.text=`${todayStats.adjusted.elevationGain}`;
      if (todayStats.local.activeZoneMinutes !== undefined) {
          activeLabel.text=`${todayStats.adjusted.activeZoneMinutes.total}`;
      }  
      if (todayStats.local.calories !== undefined) {
          caloriesLabel.text=`${todayStats.adjusted.calories}`;
      }
    }
  showDate(evt)
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myLabel.text = `${hours}:${mins}`;
 
}


// **********Heart Rate Sensor**********



if (HeartRateSensor) {
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    // console.log(`Current heart rate: ${hrm.heartRate}`);
    heartLabel.text=`${hrm.heartRate}`;
  });
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
}

// **********Body Presence Sensor**********

if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (!body.present) {
     heartLabel.text="--"
    } else {
      
    }
  });
  body.start();
}

// **********Permissions**********


if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  const hrm = new HeartRateSensor();
  hrm.start();
}


// **********Battery Life Display**********

console.log(Math.floor(battery.chargeLevel) + "%");
powerLabel.text = `${battery.chargeLevel}%`; // initialize on startup
battery.onchange = (charger, evt) => {
  powerLabel.text = `${battery.chargeLevel}%`;
}


// Determine which battery image needs to be shown.

 function batteryLevel() {
   if (battery.chargeLevel > 98) {
    batImg.href = "battery100.png";
 } else if (battery.chargeLevel < 98 && battery.chargeLevel >= 90) {
    batImg.href = "battery-almost-full.png";
 } else if (battery.chargeLevel < 90 && battery.chargeLevel >= 65) {
    batImg.href = "battery75.png";
 } else if (battery.chargeLevel < 65 && battery.chargeLevel >= 40) {
    batImg.href = "battery50.png";
 } else if (battery.chargeLevel < 40 && battery.chargeLevel >= 25) {
    batImg.href = "battery25.png";
 } else if (battery.chargeLevel < 25 && battery.chargeLevel >= 5) {
    batImg.href = "battery-almost-dead.png";
 } else {
    batImg.href = "battery00.png";
 }
 }


// **********Month and Date**********


function showDate(evt) {
  let today = evt.date;
  let monthnum = today.getMonth();
  let day = today.getDate();
  var month = new Array ();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "April";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";
  let monthname = month[monthnum];
  monthLabel.text = `${monthname}`;
  dateLabel.text = `${day}`;
}