# wipi-car

This project is for a RC car controlled by a Raspberry Pi.  The Pi controls the car by connecting GPIOs into the buttons on the RC remote.  The Pi hosts a webserver which provides buttons for the user to press to drive the car.

# Setup
* Install node on the raspberry pi 
  * See NVM page to install NVM
  * `nvm install v16.13.1`
  * `npm install`
  * `node webserver.js`

## Camera Setup

NOTE: As of Dec 27, 2021, the ov5647 driver is broken and will not flip/rotate images. See https://forums.raspberrypi.com/viewtopic.php?t=324204

* Setup /etc/fstab to mount a RAMDISK to /var/tmp
* `mkdir -p /var/tmp/mjpg`
* Stream the camera to a file - `libcamera-still --timelapse=100 -t 999999 --width 640 --height 480 -o /var/tmp/mjpeg/tmp.jpg -n -q 50 &> /dev/null`
* Serve the image - `./mjpg_streamer -i 'input_file.so -f /var/tmp/mjpg -r -d 100' -o 'output_http.so -p 8081'`
* Open `http://HOST_IP:8081/?action=stream`
* Change the ip address in public/index.html to the HOST_IP to enable streaming to the client page

## This project uses FontAwesome see below!

https://github.com/FortAwesome/Font-Awesome
