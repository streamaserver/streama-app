Streama App
==============

Get it in the play store now: 

[
![Get in in the google play store](https://play.google.com/intl/en_us/badges/images/badge_new.png)](https://play.google.com/store/apps/details?id=dularion.streama)

![Dashboard view](https://gallery.mailchimp.com/fffb1c6bc696ea2d4c3a7a393/images/ab0ce808-c4c5-43c0-bd6e-ed446d868b2b.png)

![Player view](https://gallery.mailchimp.com/fffb1c6bc696ea2d4c3a7a393/images/01eb29ff-14cc-41ee-942a-64adcd0a6c89.png)

This app requires a running streama service with a public url. Connect to it in the setup, login, and enjoy all the features from the website but with a smooth mobile UI.




## Developing on this project

We recommend using the [Ionic CLI](https://github.com/ionic-team/ionic-cli) to create new Ionic projects that are based on this project but use a ready-made starter template.

For example, to start a new Ionic project with the default tabs interface, make sure the `ionic` utility is installed:

```bash
$ npm install -g ionic cordova
```

Then run:

```bash
$ ionic start myProject tabs --type=ionic1
```

More info on this can be found on the Ionic [Getting Started](https://ionicframework.com/getting-started) page and the [Ionic CLI](https://github.com/ionic-team/ionic-cli) repo.

## Issues

Issues have been disabled on this repo. If you do find an issue or have a question, consider posting it on the [Ionic Forum](https://forum.ionicframework.com/). If there is truly an error, follow our guidelines for [submitting an issue](https://ionicframework.com/submit-issue/) to the main Ionic repository.


## Build release
- update version in config.xml, last digit set to 1
- run `cordova build android --release`
- run `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk alias_name`
- run `cd platforms/android/build/outputs/apk`
- rn (& replace version first) `~/Library/Android/sdk/build-tools/26.0.2/zipalign -v 4 android-x86-release-unsigned.apk streama_x86_0.1.10.1.apk`
- upload to google play console
- change version in config.xml again, increasing the last digit to 2
- open new terminal in root of streama-app
- run `cordova build android --release`
- run again `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk alias_name `
- run again `cd platforms/android/build/outputs/apk`
- run again (& replace version) `~/Library/Android/sdk/build-tools/26.0.2/zipalign -v 4 android-armv7-release-unsigned.apk streama_armv7_0.1.10.1.apk`