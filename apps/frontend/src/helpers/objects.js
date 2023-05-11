export const serviceTemplateObject = {
    "id": "645969d694196768f91c800f",
    "name": "httpd",
    "description": null,
    "image": "httpd",
    "repository": null,
    "platform": {
        "id": "64587f9e94196768f91bdd34",
        "name": "infratest"
    },
    "volumes": [
        "/storage"
    ],
    "files": [
        {
            "fileName": "testFile.txt",
            "fileContent": "this is a test file!",
            "containerPath": "/storage"
        }
    ],
    "ports": [
        6666
    ],
    "envs": [
        {
            "name": "CONTROL_VERSION",
            "defaultValue": ""
        }
    ],
    "constraints": [
        {
            "name": "node.role",
            "operation": "==",
            "defaultValue": "worker"
        }
    ],
    "limits": {
        "memoryReservation": 0,
        "memoryLimit": 0,
        "CPUReservation": 0,
        "CPULimit": 0
    },
    "preferences": []
}


export const serviceObject = {
    "id": "645969d794196768f91c802a",
    "name": "test",
    "environment": {
        "id": "64587f8394196768f91bd4c2",
        "name": "DEV",
        "type": "DEV"
    },
    "service": {
        "id": "645969d694196768f91c800f",
        "name": "httpd",
        "image": "httpd"
    },
    "stack": {
        "id": "64587f9f94196768f91bdd4c",
        "name": "infratest"
    },
    "image": "httpd:httpd",
    "replicas": 1,
    "ports": [
        {
            "hostPort": 8888,
            "containerPort": 6666
        },
        {
            "hostPort": 8888,
            "containerPort": 8796
        }
    ],
    "volumes": [
        {
            "hostVolume": "/storage",
            "containerVolume": "/storage"
        }
    ],
    "files": [
        {
            "fileName": "testFile.txt",
            "fileContent": "another file",
            "hostPath": "/storage/test",
            "containerPath": "/storage"
        }
    ],
    "envs": [
        {
            "name": "CONTROL_VERSION",
            "value": "34268194"
        }
    ],
    "labels": [],
    "constraints": [
        {
            "name": "node.role",
            "operation": "==",
            "value": null
        }
    ],
    "limits": {
        "memoryReservation": null,
        "memoryLimit": null,
        "CPUReservation": null,
        "CPULimit": null
    },
    "preferences": [],
    "command": null
}

export const anotherServiceTemplateObject = {
    "id": "645969d694196768f91c800f",
    "name": "httpd",
    "description": null,
    "image": "httpd",
    "repository": null,
    "platform": {
        "id": "64587f9e94196768f91bdd34",
        "name": "infratest"
    },
    "volumes": [
        "/storage"
    ],
    "files": [
        {
            "fileName": "testFile.txt",
            "fileContent": "this is a test file!",
            "containerPath": "/storage"
        }
    ],
    "ports": [
        6666
    ],
    "envs": [
        {
            "name": "CONTROL_VERSION",
            "defaultValue": ""
        },
        {
            "name": "API_KEY",
            "defaultValue": ""
        }
    ],
    "constraints": [
        {
            "name": "node.role",
            "operation": "==",
            "defaultValue": "worker"
        }
    ],
    "limits": {
        "memoryReservation": 0,
        "memoryLimit": 0,
        "CPUReservation": 0,
        "CPULimit": 0
    },
    "preferences": []
}

export const anotherServiceObject = {
    "id": "645969d794196768f91c802a",
    "name": "test",
    "environment": {
        "id": "64587f8394196768f91bd4c2",
        "name": "DEV",
        "type": "DEV"
    },
    "service": {
        "id": "645969d694196768f91c800f",
        "name": "httpd",
        "image": "httpd"
    },
    "stack": {
        "id": "64587f9f94196768f91bdd4c",
        "name": "infratest"
    },
    "image": "httpd:httpd",
    "replicas": 1,
    "ports": [
        {
            "hostPort": 8888,
            "containerPort": 66
        }
    ],
    "volumes": [
        {
            "hostVolume": "/storage",
            "containerVolume": "/asda"
        }
    ],
    "files": [
        {
            "fileName": "testFile.txt",
            "fileContent": "another file",
            "hostPath": "/storage/test",
            "containerPath": "/storage"
        }
    ],
    "envs": [
        {
            "name": "CONTROL_VERSION",
            "value": "34268194"
        }
    ],
    "labels": [],
    "constraints": [
        {
            "name": "node.role",
            "operation": "==",
            "value": null
        }
    ],
    "limits": {
        "memoryReservation": null,
        "memoryLimit": null,
        "CPUReservation": null,
        "CPULimit": null
    },
    "preferences": [],
    "command": null
}

export const unorderedServiceTemplateObject = {
    "id": "645969d694196768f91c800f",
    "name": "httpd",
    "description": null,
    "image": "httpd",
    "repository": null,
    "platform": {
        "id": "64587f9e94196768f91bdd34",
        "name": "infratest"
    },
    "volumes": [
        "/storage"
    ],
    "files": [
        {
            "fileName": "testFile.txt",
            "fileContent": "this is a test file!",
            "containerPath": "/storage"
        }
    ],
    "ports": [
        6666,
        8796
    ],
    "envs": [
        {
            "name": "CONTROL_VERSION",
            "defaultValue": ""
        }
    ],
    "constraints": [
        {
            "name": "node.role",
            "operation": "==",
            "defaultValue": "worker"
        }
    ],
    "limits": {
        "memoryReservation": 0,
        "memoryLimit": 0,
        "CPUReservation": 0,
        "CPULimit": 0
    },
    "preferences": []
}


export const unorderedServiceObject = {
    "id": "645969d794196768f91c802a",
    "name": "test",
    "environment": {
        "id": "64587f8394196768f91bd4c2",
        "name": "DEV",
        "type": "DEV"
    },
    "service": {
        "id": "645969d694196768f91c800f",
        "name": "httpd",
        "image": "httpd"
    },
    "stack": {
        "id": "64587f9f94196768f91bdd4c",
        "name": "infratest"
    },
    "image": "httpd:httpd",
    "replicas": 1,
    "ports": [

        {
            "hostPort": 8888,
            "containerPort": 8796
        },

        {
            "hostPort": 8888,
            "containerPort": 6666
        },

        {
            "hostPort": 8888,
            "containerPort": 8888
        },
    ],
    "volumes": [
        {
            "hostVolume": "/storage",
            "containerVolume": "/storage"
        }
    ],
    "files": [
        {
            "fileName": "testFile.txt",
            "fileContent": "another file",
            "hostPath": "/storage/test",
            "containerPath": "/storage"
        }
    ],
    "envs": [
        {
            "name": "CONTROL_VERSION",
            "value": "34268194"
        }
    ],
    "labels": [],
    "constraints": [
        {
            "name": "node.role",
            "operation": "==",
            "value": null
        }
    ],
    "limits": {
        "memoryReservation": null,
        "memoryLimit": null,
        "CPUReservation": null,
        "CPULimit": null
    },
    "preferences": [],
    "command": null
}