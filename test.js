const dialogflow = require('dialogflow')
const {
    struct
} = require('pb-util');
const config = require("./config.js")
// Clase para manejar la interaccion con Dialog FLow
class DialogFlowV2 {
    constructor() {
        this.proyectoId = config["DialogFlow"]["proyectId"]
        this.sessionClient = new dialogflow.SessionsClient({
            credentials: config["DialogFlow"]["credentials"]
        });
        this.languageCode = config["DialogFlow"]["languageCode"]
    }
    processText(id, text) {
        const _this = this
        return new Promise(async (resolve, reject) => {
            const sessionPath = _this.sessionClient.sessionPath(_this.proyectoId, id);
            // Armando los parametros para enviar al DialogFlow
            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: text,
                        languageCode: _this.languageCode,
                    },
                }
            }
            const response = await _this.sessionClient.detectIntent(request)
            // Agregando las entidades a la respuesta
            const rs = {
                entities: struct.decode(response[0]['queryResult']["parameters"])
            }
            // Recorriendo resultado para obtener mensajes para la respuesta
            response[0]['queryResult']["fulfillmentMessages"].forEach((item) => {
                rs.data = struct.decode(item.payload)
            })
            resolve(rs)
        })
    }
}
module.exports = DialogFlowV2