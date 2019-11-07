FROM ${DOCKER_IMAGE_WEB_APP_HOSTING}:1
WORKDIR /app
COPY . /app
ENTRYPOINT ["dotnet", "WebAppHosting.dll"]
