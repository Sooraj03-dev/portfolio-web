import { useState, useEffect } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';
import { supabase } from '../../lib/supabase';

const DEFAULT_ROLES = [
  "BUILDING ASTRA AI",
  "FULL STACK ENGINEER", 
  "ML ENGINEER",
  "ESP32 & ROS2 HACKER",
  "NIGHT CITY RESIDENT"
];

export default function RoleTypewriter() {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('hero_roles').eq('id', 1).single();
      if (!error && data && data.hero_roles) {
        setRoles(data.hero_roles.split(',').map(r => r.trim()));
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchRoles();
    const handleSync = () => fetchRoles();
    window.addEventListener('profile-sync-pulse', handleSync);
    return () => window.removeEventListener('profile-sync-pulse', handleSync);
  }, []);

  const currentText = useTypewriter(roles, 60, 30, 2000);

  return (
    <div className="hero-role mt-2 font-jetbrains text-[12px]">
      <span className="text-neon-cyan mr-2">&gt;</span>
      <span style={{ color: '#3A9A7A' }}>{currentText}</span>
      <span className="inline-block w-1.5 h-3 ml-1 bg-[#3A9A7A] animate-flicker align-middle" />
    </div>
  );
}
