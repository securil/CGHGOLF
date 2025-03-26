import React from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SchedulePage from './pages/SchedulePage';
import GalleryPage from './pages/GalleryPage';
import MembersPage from './pages/MembersPage';
import ResultsPage from './pages/ResultsPage';
import NotFoundPage from './pages/NotFoundPage';

const routes = [
  {
    path: '/',
    element: <HomePage />,
    exact: true,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/schedule',
    element: <SchedulePage />,
  },
  {
    path: '/gallery',
    element: <GalleryPage />,
  },
  {
    path: '/members',
    element: <MembersPage />,
  },
  {
    path: '/results',
    element: <ResultsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;