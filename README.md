# Setting up the Collector and Observability Storage
This repository includes 4 servers housed in Docker Containers. These will handle your app's metrics, logs, and traces. 
- The Prometheus server collects and stores metrics
- The Loki server collects and stores logs
- The Tempo server collects and stores traces. 
- The Grafana server is used to query each of the telemetry storage servers, and to visualize the telemetry. 

## Starting the servers
Prerequisites
- You'll need a local installation of Docker and Docker Compose and to have docker desktop open. 

1. Git clone this repository outside your application. 
2. Now, we'll start the backend storage servers (Prometheus, Loki, Tempo) and Grafana server from containers.
3. From the terminal, navigate to the `observability-backend` directory
4. Enter the following:
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

## Distributed Deployment
If you are deploying the observability backend on a machine separate from your collector, you will need to change the `target` in the `prom-config.yml` file. Replace `otel-collector:8889` with `<<IP Address of your machine>>:8889`.

# Deploy on AWS

## Prerequisites 
  An AWS account
  A command line interface (CLI)
  Install the Elastic Beanstalk CLI and then configure it.
  A local installation of Docker and Docker Compose and to have docker desktop open. 
  You can test that the application works locally by following the local set up steps. 

## Deploy your Docker Compose application with the EB CLI
  Elastic Beanstalk lets you deploy web applications into the AWS Cloud on a variety of supported platforms. Elastic Beanstalk provisions Amazon EC2 instances, configures load balancing, sets up health monitoring, and dynamically scales your environment.

## Create an environment and deploy your Docker Compose application
  From the terminal, navigate to the collector directory of the SDK:
  Initialize your EB CLI repository with the eb init command.
    Note: Use the appropriate AWS region for you. 
    Example: `eb init -p docker lightfoot-collector --region us-east-2`
  This command creates an application named lightfoot-collector and configures your local repository to create environments with the latest Docker platform version.
  (Optional) Run eb init again to configure a default key pair so that you can use SSH to connect to the EC2 instance running your  application.
  Select a key pair if you have one already, or follow the prompts to create one. If you don't see the prompt or need to change your settings later, run `eb init -i`
  Create an environment and deploy your application to it with eb create.
  Elastic Beanstalk automatically detects your docker-compose.yml file and deploys your multi-container application.
    `eb create lightfoot-collector`
  Once deployed, you can go to your AWS account and configure your instance, security groups, cloudwatch and the privacy of your instance IP. 
