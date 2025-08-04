# Setting up the Collector and Observability Storage
This repository includes 5 servers housed in Docker Containers. These will handle your app's metrics, logs, and traces. 
  The otel server is our collector. All telemetry will be sent from your app to the collector, which will then process and export the data to the appropriate storage server. 
  The Prometheus server collects and stores metrics
  The Loki server collects and stores logs
  The Tempo server collects and stores traces. 
  The Grafana server is used to query each of the telemetry storage servers, and to visualize the telemetry. 

## Starting the servers
Prerequisites
-You'll need a local installation of Docker and Docker Compose and to have docker desktop open. 

1. Git clone this repository outside your application. 
2. To emit enriched logs to the collector, you'll need to store your logs in a file in your application. 
    Then you'll need to mount the path to that file within the collector.
    See "Setting things up in Consumer App" for more details 
3. In the top level of the Collector directory, add a .env file containing the following:
    `LOG_PATH=<Path to your logs file here, remove brackets>`
  Example path:
    `LOG_PATH=../../toy-app/logs`
4. Next, we'll start the backend storage servers (Prometheus, Loki, Tempo) and Grafana server from containers:
  Do not move to this step until you've set up your log path and logging file. 
5. From the terminal, navigate to the `collector` directory
6. Enter the following:
  `docker compose up`
  Note: This currently spins them up locally. 
  Note: This will raise an error if you haven't set up your logging yet. 

## Generate the Grafana Service Account Token
1. After starting your servers, we'll navigate to the Grafana dashboard. 
2. If you've spun up the servers locally, navigate to the Grafana Dashboard at localhost://3002 in your browser.
3. On the left side panel, click the "Administration" tab
4. Then click "Users and Access"
5. Click "Service Accounts"
6. Enter a display name and select the role "Admin", then submit.
7. This will take you to the account page. Click "Add Service Account Token" on the right side of the page. 
8. Set the expiration as you like and submit. 
9. Copy the token to your clipboard
10. Navigate back to the Feature Flag Manager Frontend directory
11. Add the token to the .env file, assigned to the variable `VITE_GRAFANA_TOKEN`, noted in the steps for setting up the feature flag manager.