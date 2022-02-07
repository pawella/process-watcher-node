const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const app = new express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

class Storage {

    constructor() {
        this.items = [];
        this.version = '1.0.2'
        console.log('start', this.version);
    }

    addItemByInstance(instance, item) {

        if (item && item.id) {
            let items =  this.remove(instance, item);
            items.push(item);
            this.setItemsByInstance(instance, items);
        }
        // console.log(instance, item, this);
        return this;
    }

    setItemsByInstance(instance, items) {
        this.items[instance] = items;
        return this;
    }

    getItemsByInstance(instance) {
        if (this.items[instance] !== undefined) {
            return this.items[instance];
        }
        return [];
    }

    remove(instance, item) {

        let items = this.getItemsByInstance(instance);

        if (item && item.id) {
            items.forEach((v, i) => {
                // console.log(item.id,  v.id);
                if (v.id && item.id === v.id) {
                    items.splice(i, 1);
                }
            });
            this.setItemsByInstance(instance, items);
        }
        return items;
    }

}

let serverStopPath = config.get('app.stopPath');
let serverPort = config.get('app.port');


// const api = new apiHub();
const api = new Storage();


app
    .get('/', (req, res) => {
        return res.json({version: api.version});
    })
    .get('/:instance', (req, res) => {
        return res.json({version: api.version, instance: req.params.instance});
    })
    .post('/api/:instance/item', (req, res) => {
        api.addItemByInstance(req.params.instance, req.body);
        return res.json(true);
    })
    .delete('/api/:instance/item', (req, res) => {
        api.remove(req.params.instance, req.body);
        return res.json(true);
    })
    .get('/api/:instance/items', (req, res) => {
        let items = api.getItemsByInstance(req.params.instance);
        return res.json(items);
    })
    .get(serverStopPath, (req, res) => {
        setTimeout(() => process.kill(process.pid, 'SIGTERM'), 200);
        // process.send("STOP");
        ;
        return res.json(true);
    })
;

const server = app.listen(serverPort, () => {
    console.log('Server is running')
    console.info('Call GET http://localhost:'+ serverPort + serverStopPath + ' to stop this server');
});

process.on("SIGTERM", function(){
    server.close(() => console.log('Process terminated'));
})