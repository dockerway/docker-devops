import winston from "winston";
import {findCustomization,createCustomization, initCustomization} from '@dracul/customize-backend'

export const customizationInit = async function () {

    let customDoc = await findCustomization()

    if (!customDoc) {
        customDoc = await createCustomization({
            lightTheme: {
                primary: '#3F51B5',
                onPrimary: '#FFFFFF',
                secondary: '#1565C0',
                onSecondary: '#FFFFFF',
                background: "#F5F5F5",
                appBar: "#D6D6D6",
                onAppBar: "#3F51B5",
            },
            darkTheme: {
                primary: '#71DDC7',
                onPrimary: '#000000',
                secondary: '#E57FFB',
                onSecondary: '#010101',
                background: "#121212",
                appBar: "#000000",
                onAppBar: "#71DDC7",
        
            },
            logo: {
                mode: 'Round',
                title: 'APP',
                filename: 'logo.png',
                url: process.env.APP_API_URL + '/media/logo/logo.png'
            },
            language: 'es'
        })
        winston.info("Customization created: " + customDoc.id)
    } else {
        winston.debug("Customization found: " + customDoc.id)
    }
    await initCustomization(customDoc)
}