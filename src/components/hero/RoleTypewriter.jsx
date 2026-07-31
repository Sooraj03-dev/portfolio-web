import { useTypewriter } from '../../hooks/useTypewriter';

const ROLES = [
  "BUILDING ASTRA AI",
  "FULL STACK ENGINEER", 
  "ML ENGINEER",
  "ESP32 & ROS2 HACKER",
  "NIGHT CITY RESIDENT"
];

export default function RoleTypewriter() {
  const currentText = useTypewriter(ROLES, 60, 30, 2000);

  return (
    <div className="hero-role mt-2 font-jetbrains text-[12px]">
      <span className="text-neon-cyan mr-2">&gt;</span>
      <span style={{ color: '#3A9A7A' }}>{currentText}</span>
      <span className="inline-block w-1.5 h-3 ml-1 bg-[#3A9A7A] animate-flicker align-middle" />
    </div>
  );
}
