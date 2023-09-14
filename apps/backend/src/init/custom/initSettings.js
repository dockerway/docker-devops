import {createSettings, updateSettings, findSettingsByKey, createOrUpdateSettings} from "@dracul/settings-backend"


const settings = [
    //{key:'',value: '',label: {en: '', es:'', pt:''} },
    //Utilizo \\ en el value de la regex para que se guarde bien en mongo
    {
        key: 'regexPaths',
        value: '^\\/(storage|logs|localdata){1}(\\/{1}[a-z\\_\\.\\-0-9]+)*$',
        type: 'string',
        group: 'Devops',
        label: {en: 'Regex for Host Volumes', es: 'Regex para volúmenes del host', pt: 'Regex para volúmenes del host'}
    },
    {
        key: 'regexPathsFiles',
        value: '^\\/(storage){1}(\\/{1}[a-z\\_\\.\\-0-9]+)*$',
        type: 'string',
        group: 'Devops',
        label: {en: 'File Paths regular expression', es: 'Archivo Expresión regular de rutas', pt: 'Archivo Expressão regular de rotas'}
    },
    {
        key: 'regexFileName',
        value: '^[a-zA-Z0-9\\.\\_]+$',
        type: 'string',
        group: 'Devops',
        label: {en: 'File name regular expression', es: 'Nombre del archivo Expresión regular de rutas', pt: 'Nombre del archivo Expressão regular de rotas'}
    },
    {
        key: 'regexFileAbsolutePath',
        value: '^\/(?:[\w.-]+\/)*[\w.-]+$',
        type: 'string',
        group: 'Devops',
        label: {en: 'Regex for Container Volumes', es: 'Regex para volúmenes del contenedor', pt: 'Regex para volúmenes del contenedor'}
    }
]

export const initSettings = async function () {

    for (let i in settings) {
        createOrUpdateSettings(null, settings[i])
    }


}
