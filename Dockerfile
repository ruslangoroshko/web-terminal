FROM ${DOCKER_IMAGE_WEB_APP_HOSTING}:latest
WORKDIR /app
COPY . /app
ENTRYPOINT ["dotnet", "WebAppHosting.dll"]
