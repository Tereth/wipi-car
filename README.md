# wipi-car

This project is for a RC car controlled by a Raspberry Pi.  The Pi controls the car by connecting GPIOs into the buttons on the RC remote.  The Pi hosts a webserver which provides buttons for the user to press to drive the car. As well as integrating a camera to stream video to the client (albeit rather latent video).

# Setup
* Install node on the raspberry pi 
  * See NVM page to install NVM
  * `nvm install v16.13.1`
  * `npm install`
  * `node webserver.js`
* If automatic headless start is desired install supervisor (configuration provided)
  * `apt-get install supervisor`
  * Copy pi_cam.conf file to `/etc/supervisor/conf.d/pi_cam.conf`
  * Enable supervisor in systemctl `systemctl enable supervisor` (if the services need restarted for whatever reason `supervisorctl restart all`)

## Camera Setup

NOTE: As of Dec 27, 2021, the ov5647 driver is broken and will not flip/rotate images. See https://forums.raspberrypi.com/viewtopic.php?t=324204

* Setup /etc/fstab to mount a RAMDISK to /var/tmp (something similar to https://www.interelectronix.com/raspberry-pi-4-ram-disk.html)
* `mkdir -p /var/tmp/mjpg`
* Stream the camera to a file - `libcamera-still --timelapse=100 -t 999999 --width 640 --height 480 -o /var/tmp/mjpeg/tmp.jpg -n -q 50 &> /dev/null`
* Serve the image - `./mjpg_streamer -i 'input_file.so -f /var/tmp/mjpg -r -d 100' -o 'output_http.so -p 8081'`
* Open `http://HOST_IP:8081/?action=stream`
* Change the ip address in public/index.html to the HOST_IP to enable streaming to the client page

## Wiring Diagram
Depending on the controller this is wired to it is recommended to have something between a 300-1k Ohm resistor inline with the control lines.

![wiring-diagram](https://user-images.githubusercontent.com/1870213/148320332-2a902663-adc6-47c3-b883-dd57f5b33c61.png)

# TODO
- [ ] Reduce video latency
- [ ] Add object recognition
- [ ] \(Optional) Add autonomous object tracking

# Credits

## This project uses FontAwesome see below!

https://github.com/FortAwesome/Font-Awesome
