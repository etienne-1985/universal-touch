# mobile-friendly-controls
## Description
Base for developing mobile friendly PWAs `pwa-base`, `pwa-essentials`, `universal-controls`

or let `chatgpt` provide a definition for it:

![](./project-desc.png)

Feats: 
- fullscreen mode, mobile installation
- mobile UI design elements
- touch device controls

Demos:
- GameControls (as used in `three-mobile-fps-demo`)
- RovControls (as used in `mobile-rov-controls`)

## Code
Touch controls are split in two parts:
- logic side: `controls/TouchControls.ts`
- UI side: `ui/TouchControls.tsx` (for react based implementation)
