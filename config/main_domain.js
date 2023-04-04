const MAIN_DOMAIN = process.env.NODE_ENV === 'development' ? 'localhost:3000' : window.location.host;

export default MAIN_DOMAIN;