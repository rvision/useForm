const config = {
	env: process.env.NODE_ENV.toLowerCase(),
	isDevelopment: process.env.NODE_ENV.toLowerCase() === 'development',
	secureUrl: process.env.SECURE_URL,
	accountsUrl: process.env.ACCOUNTS_URL, // in use
	// fetchCredentials: 'include',
	// apimBaseUrl: 'https://#{BaseURL-API-Base}',
	// hcmBaseUrl: '#{BaseURL-HCM}',
	apimKey: process.env.APIM_KEY,
	environment: process.env.ENVIRONMENT,
	appName: process.env.APP_NAME,
};

export default config;
