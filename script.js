let client;

window.onload = () => {

  client = new Paho.MQTT.Client(
    "broker.hivemq.com",
    8884,
    "dashboard-" + Math.random()
  );

  client.onConnectionLost = () => {
    document.getElementById("mqtt").innerText = "MQTT Disconnected";
  };

  client.onMessageArrived = (message) => {
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
    onSuccess: () => {
      document.getElementById("mqtt").innerText = "MQTT Connected";
      client.subscribe("monitor/relay");
    },
    onFailure: () => {
      document.getElementById("mqtt").innerText = "MQTT Failed";
    }
  });
};

function relayON() {
  if (client && client.isConnected()) {
    client.send("kontrol/relay", "ON");
  }
}

function relayOFF() {
  if (client && client.isConnected()) {
    client.send("kontrol/relay", "OFF");
  }
}
