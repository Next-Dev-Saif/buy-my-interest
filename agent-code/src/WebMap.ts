export const WebMap = {
  routes: [
    {
      path: '/',
      description: 'The landing page or home page of the website.',
      allowedRoles: ['buyer', 'seller', 'guest']
    },
    {
      path: '/agent',
      description: 'The dedicated full-screen AI Agent interface for chatting.',
      allowedRoles: ['buyer', 'seller']
    },
    {
      path: '/explore-interests/[userId]',
      description: 'The dashboard where users can see their automated matches and search results. If navigating here, replace [userId] with the user\'s email.',
      allowedRoles: ['buyer', 'seller']
    },
    {
      path: '/checkout',
      description: 'The checkout or payment page.',
      allowedRoles: ['buyer']
    },
    {
      path: '/profile',
      description: 'The user profile and settings page.',
      allowedRoles: ['buyer', 'seller']
    },
    {
      path: '/seller',
      description: 'The dashboard for sellers to manage their listings.',
      allowedRoles: ['seller']
    },
    {
      path: '/auth/login',
      description: 'The login and registration page.',
      allowedRoles: ['guest', 'buyer', 'seller']
    }
  ]
};
