docker run -it -p 3000:3000 -v ./test-data:/usr/src/app/data -e MQTT_HOST=app0.coolescoden.de -e MQTT_PORT=8080 registry.coolescoden.de/ben/mqtt-storage 