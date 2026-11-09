/** Authentication boundary consumed by API services without coupling them to Clerk. */
export type GetToken = () => Promise<string | null>
