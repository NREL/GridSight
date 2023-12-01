export { default } from 'next-auth/middleware';
export const config = {
  matcher: ['/', "/api/geo/:me*", '/api/timeseries/:me*'],
}