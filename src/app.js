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
        this.version = '1.1.0'
        console.log('start', this.version);
    }

    addItemByInstance(instance, item) {

        if (item && item.id) {
            this.remove(instance, item);
            let items = this.getItemsByInstance(instance)
            if(item.owner === undefined && item.json) {
                if(item.json.owner) {
                    item.owner = item.json.owner;
                }
            }
            items.push(item);
            this.setItemsByInstance(instance, items);
        }
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

    getInstances() {
        if (this.items !== undefined) {
            console.log(this.items);
            return this.items;
        }
        return ['undefined'];
    }

    remove(instance, item) {

        let items = this.getItemsByInstance(instance);
        let isRemoved = false;

        if (item && item.id) {
            items.forEach((v, i) => {
                if (v.id && item.id === v.id) {
                    items.splice(i, 1);
                    isRemoved = true;
                }
            });
            if(isRemoved) {
                this.setItemsByInstance(instance, items);
            }

        }
        return isRemoved;
    }

}

let serverStopPath = config.get('app.stopPath');
let serverPort = config.get('app.port');


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
        return res.json({
            success: true
        });
    })
    .delete('/api/:instance/item', (req, res) => {
        let result = api.remove(req.params.instance, req.body);
        return res.json({
            success: result
        });
    })
    .get('/api/:instance/items', (req, res) => {

        let items = api.getItemsByInstance(req.params.instance);
        let origin = '*';

        if(req.headers.referer) {
            let tmp = req.headers.referer.replace(/^(.*)\/$/i, '$1');
            if(tmp) {
                origin = tmp;
            }
        }

        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        return res.json(items);

    })
    .get('/owner/:owner/:instance/items', (req, res) => {

        let items = api.getItemsByInstance(req.params.instance);
        let origin = '*';

        let ownerItems = [];

        items.forEach((item) => {
            if(item.owner !== undefined && item.owner === req.params.owner) {
                ownerItems.push(item);
            }
        })

        if(req.headers.referer) {
            let tmp = req.headers.referer.replace(/^(.*)\/$/i, '$1');
            if(tmp) {
                origin = tmp;
            }
        }

        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        return res.json(ownerItems);

    })
    .get('/owner/:owner/items', (req, res) => {

        let instances = api.getInstances();
        let origin = '*';
        let ownerItems = [];

        console.log(typeof instances);
        Object.entries(instances).forEach(([key, instance]) => {
            console.log(`${key}: ${instance}`, instance)
            Object.entries(instance).forEach(([a, data]) => {
                if(data.owner !== undefined && data.owner === req.params.owner) {
                    ownerItems.push(data);
                }
            });
        });

        if(req.headers.referer) {
            let tmp = req.headers.referer.replace(/^(.*)\/$/i, '$1');
            if(tmp) {
                origin = tmp;
            }
        }

        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        return res.json(ownerItems);

    })
    .get(serverStopPath, (req, res) => {

        setTimeout(() => process.kill(process.pid, 'SIGTERM'), 200);
        return res.json({
            success: true
        });

    })
;

const server = app.listen(serverPort, () => {
    console.log('Server is running')
    console.info('Call GET http://localhost:'+ serverPort + serverStopPath + ' to stop this server');
});

process.on("SIGTERM", function(){
    server.close(() => console.log('Process terminated'));
})