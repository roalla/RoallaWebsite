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
        - paragraph [ref=e17]: "Error: ENOENT: no such file or directory, open 'C:\\Users\\Roalla\\RoallaWebsite\\.next\\build-manifest.json'"
        - generic [ref=e18]: This error happened while generating the page. Any console logs will be displayed in the terminal window.
      - generic [ref=e19]:
        - heading "Call Stack" [level=2] [ref=e20]
        - generic [ref=e21]:
          - heading "readFileSync" [level=3] [ref=e22]
          - generic [ref=e24]: node:fs (442:20)
        - group [ref=e25]:
          - generic "Next.js" [ref=e26] [cursor=pointer]:
            - img [ref=e27]
            - img [ref=e29]
            - text: Next.js
```