# Page snapshot

```yaml
- generic [active]:
  - alert [ref=e1]
  - dialog "Server Error" [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - navigation [ref=e8]:
          - button "previous" [disabled] [ref=e9]:
            - img "previous" [ref=e10]
          - button "next" [disabled] [ref=e12]:
            - img "next" [ref=e13]
          - generic [ref=e15]: 1 of 1 error
        - heading "Server Error" [level=1] [ref=e16]
        - paragraph [ref=e17]: "Error: Cannot find module './vendor-chunks/@formatjs.js' Require stack: - C:\\Users\\Roalla\\RoallaWebsite\\.next\\server\\webpack-runtime.js - C:\\Users\\Roalla\\RoallaWebsite\\.next\\server\\app\\[locale]\\page.js - C:\\Users\\Roalla\\RoallaWebsite\\node_modules\\next\\dist\\server\\require.js - C:\\Users\\Roalla\\RoallaWebsite\\node_modules\\next\\dist\\server\\load-components.js - C:\\Users\\Roalla\\RoallaWebsite\\node_modules\\next\\dist\\build\\utils.js - C:\\Users\\Roalla\\RoallaWebsite\\node_modules\\next\\dist\\server\\dev\\static-paths-worker.js - C:\\Users\\Roalla\\RoallaWebsite\\node_modules\\next\\dist\\compiled\\jest-worker\\processChild.js"
        - generic [ref=e18]: This error happened while generating the page. Any console logs will be displayed in the terminal window.
      - generic [ref=e19]:
        - heading "Call Stack" [level=2] [ref=e20]
        - group [ref=e21]:
          - generic "Next.js" [ref=e22] [cursor=pointer]:
            - img [ref=e23]
            - img [ref=e25]
            - text: Next.js
        - generic [ref=e30]:
          - heading "TracingChannel.traceSync" [level=3] [ref=e31]
          - generic [ref=e33]: node:diagnostics_channel (322:14)
        - group [ref=e34]:
          - generic "Next.js" [ref=e35] [cursor=pointer]:
            - img [ref=e36]
            - img [ref=e38]
            - text: Next.js
```