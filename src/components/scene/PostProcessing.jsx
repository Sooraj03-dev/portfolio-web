import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
  BrightnessContrast,
  ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={2.2}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.9}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0018, 0.0018]}
      />
      <Vignette offset={0.2} darkness={0.75} eskil={false} />
      <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.03} />
      <BrightnessContrast brightness={0.02} contrast={0.18} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
