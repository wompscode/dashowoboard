# dashowoboard
Simple dashboard intended for usage on a Raspberry Pi.  
  
# Installation
1. `npm i` in cloned repo directory.
2. Set port in `config.json`.
3. `node server.js`, and check if running at `localhost:<port: default = 3000>`
4. *(optional)* Reverse proxy under nginx.
  
# Libraries
dashowoboard uses the following libraries:
- chart.js
- systeminformation
- pretty-ms
- express.js
- ejs
- socket.io
  
  
dashowoboard is not perfect, and was originally intended for usage on _just my_ Raspberry Pi.  
dashowoboard also may be slow when loading the page, as it is pulling a bunch of statistics about your machine for display. This is normal, and will vary from system to system.