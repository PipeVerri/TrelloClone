/**
 * Base URL of the API the web app should talk to.
 *
 * It reads NEXT_PUBLIC_API_URL from the environment. In the future this could
 * be extended to return a different URL for development or test.
 */
export function getApiLink() {
    return process.env.NEXT_PUBLIC_API_URL;
}
