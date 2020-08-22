const OpenTrack = require('opentrack')
const client = new OpenTrack.Client('127.0.0.1', 4243)
const msp = require("@betaflight/msp");


(async () => {
    const portsList = await msp.ports();

    console.log(portsList);

    const port = portsList[0];

    await msp.open(port, () => {
        console.log("onClosed");
    });
    console.log(msp.apiVersion(port));

    var current_rot = { x: 0.00, y: 0.00, z: 0.00 };

    // Called every time data is sent
    client.onUpdate((transform, delta) => {
        // The modified transform will be sent on the next update
        transform.rotation.x = current_rot.z;
        transform.rotation.y = current_rot.x;
        transform.rotation.z = -current_rot.y;
    });

    while (true) {
        const MSP_ATTITUDE = 108;
        const data = await msp.execute(port, { code: MSP_ATTITUDE });
        current_rot.x = data.read16() / 10.0;
        current_rot.y = data.read16() / 10.0;
        current_rot.z = data.read16();
    }
    await msp.close(port)
})();