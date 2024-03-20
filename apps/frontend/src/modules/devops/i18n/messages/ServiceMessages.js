
const messages = {
    en: {
       devops: {
          service: {
            deployed: 'Service deployed with id: ',
            name: 'Service',
            title: 'View, search, create, edit and delete services',
            deploySectionTitle: 'Deploy service',
            subtitle: 'Services CRUD',
            creating: 'Creating Service',
            created: 'Service created',
            updated: 'Service updated',
            deleted: 'Service deleted',
            editing: 'Editing Service',
            deleting: 'Deleting Service',
            showing: 'Showing Service',
            menu: 'Service',
            update: 'Update',
            labels: {
                deployMode: 'Deploy Mode',
                global: 'Global',
                main: 'Main',
                environment: 'Environment',
                serviceTemplate: 'Service Template',
                stack: 'Stack',
                volumes: 'Volumes',
                volume: 'Volume',
                files: 'Files',
                file: 'File',
                ports: 'Ports',
                port: 'Port',
                hostPort: "Host port",
                containerPort: "Container port",
                hostVolume: "Host volume",
                containerVolume: "Container volume",
                fileName: "File name",
                fileContent: "File content",
                hostPath: "Host path",
                containerPath: "Container path",
                memoryReservation:"Memory Reservation",
                memoryLimit:"Memory Limit",
                CPUReservation:"CPU Reservation",
                CPULimit:"CPU Limit",
                variable: {
                    name: "Name",
                    operation: "Operation",
                    value: "Value"
                },
                image: "Image",
                replicas: "Replicas",
                name: "Name",
                command: "Command",
                platform: "Platform",
            },
            values: {
              deployModes: {
                global: 'Global',
                replic: 'Replicated'
              }
            },
            status: 'Status',
            active: 'Active',
            inactive: 'Inactive',
            unknown: 'Unknown',
            getStatus: 'Get',
            limitsMessages: {
                memoryReservation: 'Minimum memory available on a node to run a task (set to 0 for unlimited)',
                memoryLimit: 'Maximum memory usage per task (set to 0 for unlimited)',
                CPUReservation: 'Minimum CPU available on a node to run a task',
                CPULimit: 'Maximum CPU usage per task',
            },
            deploy: 'Deploy',
            delete:{
              action: 'Delete',
              title: 'Delete deployed service'
            },
            deployErrors: {
              serviceModeChangeIsNotAllowedError: 'Changing the service mode is not allowed. To change the service mode, remove the service and deploy it again.',
            }
          },
          serviceRecords:{
            delete: "Delete service record"
          }
       }
    },
    es: {
       devops: {
          service: {
            deployed: 'Servicio desplegado con id:',
            name: 'Servicios',
            title: 'Administración de Servicios',
            deploySectionTitle: 'Desplegar servicio',
            subtitle: 'Ver, buscar, crear, editar y eliminar Servicios',
            creating: 'Creando Servicio',
            created: 'Servicio creado',
            updated: 'Servicio actualizado',
            deleted: 'Servicio eliminado',
            editing: 'Modificando Servicio',
            deleting: 'Eliminando Servicio',
            showing: 'Detalles de Servicio',
            menu: 'Servicios',
            update: 'Actualizar',
            labels: {
                deployMode: 'Modo de despliegue',
                global: 'Global',
                main: 'Principal',
                environment: 'Entorno',
                serviceTemplate: 'Plantilla de Servicio',
                stack: 'Stack',
                volumes: 'Volúmenes',
                volume: 'Volúmen',
                files: 'Archivos',
                file: 'Archivo',
                ports: 'Puertos',
                port: 'Puerto',
                hostPort: "Puerto del host",
                containerPort: "Puerto del contenedor",
                hostVolume: "Volúmen del host",
                containerVolume: "Volúmen del contenedor",
                fileName: "Nombre del archivo",
                fileContent: "Contenido del archivo",
                hostPath: "Ruta de archivo del Host",
                containerPath: "Ruta de archivo del contenedor",
                memoryReservation:"Reserva de Memoria",
                memoryLimit:"Límite de Memoria",
                CPUReservation:"Reserva de CPU",
                CPULimit:"Límite de CPU",
                variable: {
                    name: "Nombre",
                    operation: "Operación",
                    value: "Valor"
                },
                image: "Imagen",
                replicas: "Replicas",
                name: "Nombre",
                command: "Comando",
                platform: "Plataforma",
            },
            values: {
              deployModes: {
                global: 'Global',
                replic: 'Replicado'
              }
            },
            status: 'Estado',
            active: 'Activo',
            inactive: 'Inactivo',
            unknown: 'Desconocido',
            getStatus: 'Consultar',
            limitsMessages: {
                memoryReservation: 'Memoria mínima disponible en un nodo para ejecutar una tarea (establecer en 0 para ilimitado)',
                memoryLimit: 'Uso máximo de memoria por tarea (establecer en 0 para ilimitado)',
                CPUReservation: 'CPU mínima disponible en un nodo para ejecutar una tarea',
                CPULimit: 'Uso máximo de CPU por tarea',
              },
            deploy: 'Desplegar',
            delete:{
              action: 'Eliminar',
              title: 'Eliminar servicio desplegado',
              areYouSureMessage: '¿Esta seguro de que desea eliminar el servicio desplegado?'
            },
            deployErrors: {
              serviceModeChangeIsNotAllowedError: 'El cambio de modo de despliegue no es posible. Para cambiar el modo de despliegue debe remover el servicio desplegado y volver a desplegar.'
            }
          },
          serviceRecords:{
            delete: "Eliminar registro del servicio"
          }
       }
    },
    pt: {
       devops: {
          service: {
            deployed: 'Serviço implantado com id:',
            name: 'Service',
            title: 'Administração de Service',
            deploySectionTitle: 'Implantar Service',
            subtitle: 'Ver, buscar, criar, editar e usar Service',
            creating: 'Criando Service',
            created: 'Serviço criado',
            updated: 'Serviço atualizado',
            deleted: 'Serviço eliminado',
            editing: 'Edição Service',
            deleting: 'Apagando Service',
            showing: 'Detalhes do Service',
            menu: 'Service',
            update: 'Atualizar',
            labels: {
                deployMode: 'Modo de implantação',
                global: 'Global',
                main: 'Main',
                environment: 'Environment',
                serviceTemplate: 'Service',
                stack: 'Stack',
                volumes: 'Volúmenes',
                volume: 'Volúmen',
                files: 'Arquivo',
                file: 'Arquivo',
                ports: 'Puertos',
                port: 'Puerto',
                hostPort: "Host port",
                containerPort: "Container port",
                hostVolume: "Host volume",
                containerVolume: "Container volume",
                fileName: "Nome do path",
                fileContent: "Conteúdo do path",
                hostPath: "Host arquivo",
                containerPath: "Container arquivo",
                memoryReservation:"Reserva de memória",
                memoryLimit:"Limite de Memória",
                CPUReservation:"Reserva de CPU",
                CPULimit:"Limite de CPU",
                variable: {
                    name: "Name",
                    operation: "Operação",
                    value: "Value"
                },
                image: "Image",
                replicas: "Replicas",
                name: "Name",
                command: "Command",
                platform: "Plataforma",
            },
            values: {
              deployModes: {
                global: 'Global',
                replic: 'Replicado'
              }
            },
            status: 'Status',
            active: 'Activo',
            inactive: 'Inactivo',
            unknown: 'Unknown',
            getStatus: 'Consultar',
            limitsMessages: {
                memoryReservation: 'Minimum memory available on a node to run a task (set to 0 for unlimited)',
                memoryLimit: 'Maximum memory usage per task (set to 0 for unlimited)',
                CPUReservation: 'Minimum CPU available on a node to run a task',
                CPULimit: 'Maximum CPU usage per task',
            },
            deploy: 'Deploy',
            delete:{
              action: 'Delete',
              title: 'Delete deployed service',
              areYouSureMessage: 'Are you sure you want to delete this deployed service?'
            },
            deployErrors: {
              serviceModeChangeIsNotAllowedError: 'Changing the service mode is not allowed. To change the service mode, remove the service and deploy it again.'
            }          
          },
          serviceRecords:{
            delete: "Eliminar registro del servicio"
          }
       }
    }
}

export default messages
