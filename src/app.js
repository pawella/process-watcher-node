const express = require('express');
const bodyParser = require('body-parser');

const app = new express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

class Storage {

    version = '1.0.1';
    items = [];

    constructor() {
        console.log('start', this.version);
    }

    addItemByInstance(instance, item) {

        if (item && item.id) {
            this.remove(instance, item);
            let items = this.getItemsByInstance(instance, item);
            items.push(item);
            this.setItemsByInstance(instance, items);
        }
        console.log(instance, item, this);
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
;

app.listen(8822, () => console.log('Server is running'));