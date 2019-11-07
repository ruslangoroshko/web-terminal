FROM monfex/web-app-hosting:latest
WORKDIR /app
COPY . /app
ENTRYPOINT ["dotnet", "WebAppHosting.dll"]
