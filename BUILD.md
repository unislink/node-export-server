docker build -t chart-service-engine:0.0.1 .

RUN:
docker run -p 7801:7801 chart-service-engine:0.0.1

docker tag chart-service-engine:0.0.1 us-west1-docker.pkg.dev/unis-labs/unislink-gcr/chart-service-engine:0.0.1
docker tag chart-service-engine:0.0.1 us-west1-docker.pkg.dev/unis-labs/unislink-gcr/chart-service-engine:latest

TAG:
docker tag chart-service-engine:0.0.1 unislink.azurecr.io/chart-service-engine:0.0.1
docker tag chart-service-engine:0.0.1 unislink.azurecr.io/chart-service-engine:latest

PUSH:
docker push unislink.azurecr.io/chart-service-engine:latest
