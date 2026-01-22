document.addEventListener("DOMContentLoaded", function () {

  if (typeof Paho === "undefined") {
    document.getElementById("mqtt").innerText = "MQTT Library Error";
    console.error("Paho MQTT tidak terbaca");
    return;
  }

  const client = new Paho.MQTT.Client(
    "broker.hivemq.com",
    8884,
    "dashboard-" + Math.random()
  );

  client.onConnectionLost = function () {
    document.getElementById("mqtt").innerText = "MQTT Disconnected";
  };

  client.onMessageArrived = function (message) {
    if (message.destinationName === "monitor/relay") {
      const status = message.payloadString;
      const el = document.getElementById("status");

      if (status === "ON") {
        el.innerHTML = "PLTS ON";
        el.className = "status plts";
      } else {
        el.innerHTML = "PLN ON";
        el.className = "status pln";
      }
    }
  };

  client.connect({
    useSSL: true,
    onSuccess: function () {
      document.getElementById("mqtt").innerText = "MQTT Connected";
      client.subscribe("monitor/relay");
    },
    onFailure: function () {
      document.getElementById("mqtt").innerText = "MQTT Failed";
    }
  });

  window.relayON = function () {
    client.send("kontrol/relay", "ON");
  };

  window.relayOFF = function () {
    client.send("kontrol/relay", "OFF");
  };

});
