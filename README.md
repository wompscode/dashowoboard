# dashowoboard
Simple and modular dashboard intended for usage on a Raspberry Pi.  
  
# Installation
1. `npm i` in cloned repo directory.
2. Configure in `config.json`.
3. `node server.js`, and check if running at `localhost:<port: default = 3000>`
4. *(optional)* Reverse proxy under nginx.
  
# Libraries
dashowoboard uses the following libraries:
- express.js  
- ejs  
- socket.io  

The included sys_info module uses the following libraries:
- chart.js  
- systeminformation  
- pretty-ms  
  
# Creating your own modules
There is an example module in the modules folder and module partial in the views/partials folder. Check them out to find out how to put together your own modules.
  
  
dashowoboard is not perfect, and was originally intended for usage on _just my_ Raspberry Pi.  
Modules load and work independently from one another, so only an affected module is impacted in any way. Some modules may take longer to init or be polled compared to others. This is normal.