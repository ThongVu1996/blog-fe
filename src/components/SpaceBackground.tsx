import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const SpaceBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles id="tsparticles" options={{
      background: { color: { value: "transparent" } }, fpsLimit: 60, interactivity: {
        events: { onHover: { enable: true, mode: "grab" }, }, modes: { grab: { distance: 140, links: { opacity: 0.5 } }, },
      },
      particles: {
        color: { value: "#00D1FF" }, links: {
          color: "#00D1FF", distance: 150, enable: true, opacity: 0.2,
          width: 1,
        }, move: { enable: true, speed: 1, direction: "none", outModes: { default: "out" }, }, number: {
          density: {
            enable: true, area: 800
          }, value: 80,
        }, opacity: { value: 0.3 }, shape: { type: "circle" }, size: {
          value: {
            min: 1,
            max: 3
          }
        },
      }, detectRetina: true,
    }} style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      zIndex: -1,
    }} />
  );
};

export default SpaceBackground;
