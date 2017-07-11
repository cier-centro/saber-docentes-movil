# saber-estudiantes-movil
Saber estudiantes movil

instalar la version de ionci 2.0.0:
```
npm install -g ionic@2.0.0
```

instalar el plugin de cordova que genera error:

```
cordova plugin add cordova-plugin-splashscreen
```

instalar los dos plugins 
```
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-android-permissions
```

seguir las instrucciones en 
```
https://developer.android.com/studio/run/managing-avds.html?hl=es-419
```

para hacer una maquina virtual con targen en android 4.4 (kitkat)

cd al interior del directorio del repo

```
cd saber-estudiantes-movil
```

ejecutar el comando 

```
ionic run android
```

ejecutar el comando en una ventana de cmd paralela, esto con el fin de ver los errores que se presenten al emular la aplicacion.

```
adb logcat
```


instalar el jdk de presentar errores. Recordar que se debe descargar la imagen de la version de android.

```

cordova-pdf-generator 1.1.1 "PDFGenerator"
cordova-plugin-android-permissions 0.11.0 "Permissions"
cordova-plugin-compat 1.1.0 "Compat"
cordova-plugin-console 1.0.3 "Console"
cordova-plugin-device 1.1.2 "Device"
cordova-plugin-file 4.3.4-dev "File"
cordova-plugin-splashscreen 3.2.2 "Splashscreen"
cordova-plugin-statusbar 2.1.3 "StatusBar"
cordova-plugin-whitelist 1.2.2 "Whitelist"
cordova-plugin-winstore-jscompat 0.0.1 "Windows Compatibility"
ionic-plugin-keyboard 2.2.1 "Keyboard"

```
