import { Settings, Home, Person, History, Visibility, Delete, Dashboard } from '@mui/icons-material'
const String = {
	app_name: 'Intellysis',
	api_url: 'test',
	host: 'Intellysis',
	website: 'www.intellysis.ph',
	menu: [
		{
			title: 'Dashboard',
			route: '/dashboard',
			icon: Dashboard,
		},
		{
			title: 'Main',
			route: '/main',
			icon: Home,
		},
		{
			title: 'History',
			route: '/history',
			icon: History,
		},
		{
			title: 'Profile',
			route: '/profile',
			icon: Person,
		},
	],
	loggedInMenu: [
		{
			title: 'My Profile',
			icon: Settings,
			route: '/profile',
		},
	],
	tableHeader: [
		{
			title: '',
			type: 'result',
			variable: 'url',
		},
		{
			title: 'Name',
			type: 'text',
			variable: 'name',
			style: {
				fontWeight: 'bold',
			},
		},
		{
			title: 'Size',
			type: 'text',
			variable: 'size',
		},
		{
			title: 'Classification',
			type: 'text',
			variable: 'classification',
			style: {
				fontWeight: 'bold',
			},
		},
		{
			title: 'Confidence',
			type: 'text',
			variable: 'accuracy',
		},
		{
			title: 'Actions',
			type: 'action',
			options: [
				{
					title: 'View',
					action: null,
					icon: Visibility,
				},
				{
					action: null,
					title: 'Delete',
					icon: Delete,
				},
			],
		},
	],
	predefinedWeights: [
		{
			title: 'LSC Model',
			project_name: process.env.NEXT_PUBLIC_LSC_PROJECT_NAME,
			api_key: process.env.NEXT_PUBLIC_LSC_API_KEY,
			version: process.env.NEXT_PUBLIC_LSC_VERSION,
			workspace: process.env.NEXT_PUBLIC_LSC_WORKSPACE,
			model_type: process.env.NEXT_PUBLIC_LSC_MODEL_TYPE,
		},
		{
			title: 'RPS Model',
			project_name: process.env.NEXT_PUBLIC_RPS_PROJECT_NAME,
			api_key: process.env.NEXT_PUBLIC_RPS_API_KEY,
			version: process.env.NEXT_PUBLIC_RPS_VERSION,
			workspace: process.env.NEXT_PUBLIC_RPS_WORKSPACE,
			model_type: process.env.NEXT_PUBLIC_RPS_MODEL_TYPE,
		},
		{
			title: 'Person Model',
			project_name: process.env.NEXT_PUBLIC_PERSON_PROJECT_NAME,
			api_key: process.env.NEXT_PUBLIC_PERSON_API_KEY,
			version: process.env.NEXT_PUBLIC_PERSON_VERSION,
			workspace: process.env.NEXT_PUBLIC_PERSON_WORKSPACE,
			model_type: process.env.NEXT_PUBLIC_PERSON_MODEL_TYPE,
		},
	],
}

export default String
