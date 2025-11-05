import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Transactions from "./Transactions";

import Contacts from "./Contacts";

import Goals from "./Goals";

import Reports from "./Reports";

import Analytics from "./Analytics";

import MEI from "./MEI";

import Planning from "./Planning";

import Profile from "./Profile";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Transactions: Transactions,
    
    Contacts: Contacts,
    
    Goals: Goals,
    
    Reports: Reports,
    
    Analytics: Analytics,
    
    MEI: MEI,
    
    Planning: Planning,
    
    Profile: Profile,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Transactions" element={<Transactions />} />
                
                <Route path="/Contacts" element={<Contacts />} />
                
                <Route path="/Goals" element={<Goals />} />
                
                <Route path="/Reports" element={<Reports />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/MEI" element={<MEI />} />
                
                <Route path="/Planning" element={<Planning />} />
                
                <Route path="/Profile" element={<Profile />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}