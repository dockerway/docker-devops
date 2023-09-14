
const messages = {
    en: {
       devops: {
          service: {
            name: 'Service',
            title: 'Service management',
            subtitle: 'Services CRUD',
            creating: 'Creating Service',
            created: 'Service created',
            updated: 'Service updated',
            deleted: 'Service deleted',
            editing: 'Editing Service',
            deleting: 'Deleting Service',
            showing: 'Showing Service',
            menu: 'Service',
            labels: {
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
            status: 'Status',
            limitsMessages: {
                memoryReservation: 'Minimum memory available on a node to run a task (set to 0 for unlimited)',
                memoryLimit: 'Maximum memory usage per task (set to 0 for unlimited)',
                CPUReservation: 'Minimum CPU available on a node to run a task',
                CPULimit: 'Maximum CPU usage per task',
            }
          }
       }
    },
    es: {
       devops: {
          service: {
            name: 'Servicios',
            title: 'Administración de Servicios',
            subtitle: 'ABM de Servicios',
            creating: 'Creando Servicio',
            created: 'Servicio creado',
            updated: 'Servicio actualizado',
            deleted: 'Servicio eliminado',
            editing: 'Modificando Servicio',
            deleting: 'Eliminando Servicio',
            showing: 'Detalles de Servicio',
            menu: 'Servicios',
            labels: {
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
            status: 'Estado',
            limitsMessages: {
                memoryReservation: 'Memoria mínima disponible en un nodo para ejecutar una tarea (establecer en 0 para ilimitado)',
                memoryLimit: 'Uso máximo de memoria por tarea (establecer en 0 para ilimitado)',
                CPUReservation: 'CPU mínima disponible en un nodo para ejecutar una tarea',
                CPULimit: 'Uso máximo de CPU por tarea',
              }
          }
       }
    },
    pt: {
       devops: {
          service: {
            name: 'Service',
            title: 'Administração de Service',
            subtitle: 'Ver, buscar, criar, editar e usar Service',
            creating: 'Criando Service',
            created: 'Serviço criado',
            updated: 'Serviço atualizado',
            deleted: 'Serviço eliminado',
            editing: 'Edição Service',
            deleting: 'Apagando Service',
            showing: 'Detalhes do Service',
            menu: 'Service',
            labels: {
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
            status: 'Status',
            limitsMessages: {
                memoryReservation: 'Minimum memory available on a node to run a task (set to 0 for unlimited)',
                memoryLimit: 'Maximum memory usage per task (set to 0 for unlimited)',
                CPUReservation: 'Minimum CPU available on a node to run a task',
                CPULimit: 'Maximum CPU usage per task',
            }
          }
       }
    }
}

export default messages
