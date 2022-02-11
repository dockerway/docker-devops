export default [
    {
        icon: 'home',
        text: 'base.home',
        link: {name: "home"},
        galleryHide: true
    },
    {
        icon: 'visibility',
        text: 'menu.sauron',
        link: {name: "SauronPage"},
        panel: false,
        permission: 'ENVIRONMENTSERVICE_MENU'
    },
    {
        icon: 'list_alt',
        text: 'menu.cruds',
        panel: false,
        children: [
            {
                icon: 'space_dashboard',
                text: 'menu.platform',
                link: {name: "PlatformPage"},
                panel: false,
                permission: 'PLATFORM_MENU'
            },
            {
                icon: 'design_services',
                text: 'menu.service',
                link: {name: "ServicePage"},
                panel: false,
                permission: 'SERVICE_MENU'
            },
            {
                icon: 'tune',
                text: 'menu.environment',
                link: {name: "EnvironmentPage"},
                panel: false,
                permission: 'ENVIRONMENT_MENU'
            },
            {
                icon: 'tune',
                text: 'menu.environmentService',
                link: {name: "EnvironmentServicePage"},
                panel: false,
                permission: 'ENVIRONMENTSERVICE_MENU'
            },
        ]
    },


    {
        icon: 'person',
        text: 'menu.administration',
        panel: false,
        permission: 'SECURITY_ADMIN_MENU',
        children: [
            {
                icon: 'assignment_ind',
                text: 'menu.userdashboard',
                link: {name: "userDashboard"},
                panel: false,
                permission: 'SECURITY_DASHBOARD_SHOW'
            },
            {
                icon: 'settings_applications',
                text: 'menu.customization',
                link: {name: "customization"},
                panel: false,
                permission: 'CUSTOMIZATION_SHOW'
            },
            {
                icon: 'assignment_ind',
                text: 'user.title',
                link: {name: "userManagement"},
                panel: false,
                permission: 'SECURITY_USER_SHOW'
            },
            {
                icon: 'verified_user',
                text: 'role.title',
                link: {name: "roleManagement"},
                panel: false,
                permission: 'SECURITY_ROLE_SHOW'
            },
            {
                icon: 'group',
                text: 'group.title',
                link: {name: "groupManagement"},
                panel: false,
                permission: 'SECURITY_GROUP_SHOW'
            },

        ]
    },
    {
        icon: 'perm_phone_msg',
        text: 'base.about',
        link: {name: "about"},
        panel: false,
    },


]
