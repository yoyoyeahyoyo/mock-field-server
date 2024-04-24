// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const nodeCache = require('node-cache');
const myCache = new nodeCache({deleteOnExpire : false,useClones:false});
dotenv.config();

const app = express();
app.use(express.json()) // for parsing application/json
const port = process.env.PORT;
const boundaries = { 
"start_date": "2024-02-08",
    "end_date": "2024-02-08",
    "fields": [
        {
            "client_field_id": "Field 1",
            "aoi": {
                "type": "Point",
                "coordinates": [9.078826904296875, 55.06421406528486]
            },
            "area": 0.0
        },
        {
            "client_field_id": "Field 2",
            "aoi": {
                "type": "Point",
                "coordinates": [9.210662841796875, 54.95238569063361]
            }
        }
    ]
};

const bulk_boundary_response = {
    "request_id": "54ccfd97-ddc6-4206-b8e7-f5551bf2ccf4",
    "status": "Pending",
    "created_at": "2022-04-01 12:15:46.734228",
    "updated_at": "2022-04-01 12:15:46.734228",
    "start_date": "2022-01-01",
    "end_date": "2022-03-01",
    "fields": [
        {"id": "72baf839-5ad9-4847-afac-cdbf4987c335"},
        {"id": "0e8d4330-dfbb-4eb4-ad5c-7c944f0f7af6"},
    ]
};
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
function generateIds(features) {
    const ids = [];  
    for (const feature of features) {
        if (feature.aoi.point == "Point"){
            ids.push({id:uuidv4()});
        }
    }
    return ids;
}
function buildBoundaries(features) {
    const ids = [];  
    for (const feature of features) {
        if (feature.aoi.point == "Point"){
            ids.push({id:uuidv4()});
        }
    }
    return ids;
}
function emptyResponse() {
    return {
        request_id: "9b5b032d-df40-4df6-9453-674710a7a2c7",
        status: "Completed",
        created_at: "2023-12-01T11:27:11.818771+00:00",
        updated_at: "2023-12-01T11:27:11.991837+00:00",
        start_date: "2022-12-01",
        end_date: "2023-12-01",
        field: {
            id: "729a8800-fde4-47fb-920c-d45ce7fee07a",
            client_field_id: "<customer's own field id/name>",
            boundary: {
                type: "Polygon",
                coordinates: [
                    [
                        [-1.207011863, 51.636298128],
                        [-1.206437704, 51.636199432],
                        [-1.206448342, 51.635929818],
                        [-1.206163038, 51.635835534],
                        [-1.205483488, 51.634746044],
                        [-1.205916752, 51.634752667],
                        [-1.208111416, 51.634066785],
                        [-1.208914196, 51.635697691],
                        [-1.208480922, 51.635691079],
                        [-1.208033477, 51.636043951],
                        [-1.207011863, 51.636298128]
                    ]
                ]
            },
            area: 3.495,
        }

    }
}
function boundaryDetect(payload) {
    //validate
    if (!(payload.client_field_id &&  payload.aoi && payload.aoi.type)) {
        return {code:500,message:'invalid'};
    }
    var response = emptyResponse();
    response.field.boundary.coordinates = [[
        [payload.aoi.coordinates[0]-.005,payload.aoi.coordinates[1]-.005],
        [payload.aoi.coordinates[0]-.005,payload.aoi.coordinates[1]+.005],
        [payload.aoi.coordinates[0]+.005,payload.aoi.coordinates[1]+.005],
        [payload.aoi.coordinates[0]+.005,payload.aoi.coordinates[1]-.005],
        [payload.aoi.coordinates[0]-.005,payload.aoi.coordinates[1]-.005],
    ] ];
    return response;
}


app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.post('/v1/fields/detection/bulk/_preview',(req,res) => {
    console.log(req.body);
    myCache.set('boundary_request',req);
    res.send(bulk_boundary_response);

});
app.post('/v1/fields/detection/_preview',(req,res) => {
    console.log(req.body);
    //myCache.set('boundary_request',req);
    res.json(boundaryDetect(req.body));

});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
