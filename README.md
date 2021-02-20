# About
Japanese station search application built with Flask and React.

# Requirements
This web application has been tested in environment with
the following configuration:
- Python 3.7.3
- Node.js v12.20.1
- Nginx v1.14.2

# Installation
1. Clone this repo
2. Clone the submodule repository

   ```bash
   $ git submodule update --init --recursive
   ```

3. Create Python virtual environment for Flask backend

   ```bash
   $ cd api
   $ python3 -m venv venv
   $ source venv/bin/activate
   ```

4. Install required packages for Flask backend

   ```bash
   $ pip3 install .
   ```

5. Perform DB migration

```bash
   flask db upgrade
```

6. Seed DB

   Execute the following commands to import CSV data taken from
   [ekidata.jp](http://ekidata.jp/)

   ```bash
      $ flask seed company CSV_PATH
      $ flask seed connecting-station CSV_PATH
      $ flask seed line CSV_PATH
      $ flask seed prefecture CSV_PATH
      $ flask seed station CSV_PATH

      $ flask seed-mongo stations STATION_CSV_PATH LINE_CSV_PATH PREFECTURE_CSV_PATH
   ```

   Where `CSV_PATH` is the file path for CSV file containing data for
   corresponding table name

7. Build React app

   ```bash
   $ cd .. && npm build
   ```

8. Create systemd service

    ```bash
    $ sudo touch /etc/systemctl/system/ekidata.service
    ```

9. Add the following into ekidata.service file.

   ```
   [Unit]
   Description=ekidata
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/ekidata-react/api
   ExecStart=/home/ubuntu/ekidata-react/api/venv/bin/gunicorn -b 127.0.0.1:5000 "app:create_app()"
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

10. Configure Nginx

   Edit `etc/nginx/sites-enabled/default`

   ```
   server {
       listen 80;

       location /ekidata {
           alias /home/ubuntu/ekidata-react/build;
           index index.html;
           try_files $uri $uri/ /ekidata/index.html;
       }

       location /ekidata/api {
           include proxy_params;
           proxy_pass http://localhost:5000;
       }
   }
   ```

11. Reload systemd and start `ekidata` service

    ```bash
    $ sudo systemctl daemon-reload
    $ sudo systemctl start ekidata
    ```

12. (Optional) Verify that `ekidata` service is running

    ```bash
    $ sudo systemctl status ekidata
    ```

13. Reload nginx

    ```bash
    $ sudo systemctl reload nginx
    ```

14. Verify that the web app is running by visiting `<IP or Host Name>/ekidata`
