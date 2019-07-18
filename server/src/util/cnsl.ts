const { ENVIRONMENT } = process.env;

const isDev = ENVIRONMENT === "development";
// tslint:disable-next-line: no-empty
const cnsl = isDev ? console : { log: () => {} };

export default cnsl;
