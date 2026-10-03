import React from 'react';
import { createRoot } from 'react-dom/client';
import StoreHeader from './components/StoreHeader.jsx';

const mount = document.getElementById('shared-header');
if (mount) createRoot(mount).render(<React.StrictMode><StoreHeader active={mount.dataset.active} /></React.StrictMode>);
