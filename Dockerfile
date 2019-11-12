FROM monfex/web-app-hosting:1
WORKDIR /app
COPY wwwroot /app
ENTRYPOINT ["dotnet", "WebAppHosting.dll"]
