FROM monfex/web-app-hosting:1
WORKDIR /app
COPY . /app
ENTRYPOINT ["dotnet", "WebAppHosting.dll"]
