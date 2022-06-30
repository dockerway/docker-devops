import {createSettings, updateSettings, findSettingsByKey} from "@dracul/settings-backend"


const settings = [
    //{key:'',value: '',label: {en: '', es:'', pt:''} },
    //Utilizo \\ en el value de la regex para que se guarde bien en mongo
    {
        key: 'regexPaths',
        value: '^\\/(storage|logs|localdata){1}(\\/{1}[a-z\\_\\.\\-0-9]+)*$',
        type: 'string',
        label: {en: 'Paths regular expression', es: 'Expresión regular de rutas', pt: 'Expressão regular de rotas'}
    },
    {
        key: 'regexPathsFiles',
        value: '^\\/(storage){1}(\\/{1}[a-z\\_\\.\\-0-9]+)*$',
        type: 'string',
        label: {en: 'File Paths regular expression', es: 'Archivo Expresión regular de rutas', pt: 'Archivo Expressão regular de rotas'}
    },
    {
        key: 'regexFileName',
        value: '^[a-zA-Z0-9\\.\\_]+$',
        type: 'string',
        label: {en: 'File name regular expression', es: 'Nombre del archivo Expresión regular de rutas', pt: 'Nombre del archivo Expressão regular de rotas'}
    }
]

export const initSettings = async function () {

    for (let i in settings) {
        let setting = await findSettingsByKey(settings[i].key)
        if (!setting) {
            await createSettings(null, settings[i])
        } else{
            setting.type =  settings[i].type ? settings[i].type : 'string'
            setting.options =  settings[i].options ? settings[i].options : []
            await updateSettings(null, setting.id,setting)
        }
    }


}
