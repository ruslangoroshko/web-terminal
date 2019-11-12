FROM monfex/web-app-hosting:1
WORKDIR /app
COPY wwwroot /app/wwwroot
ENTRYPOINT ["dotnet", "WebAppHosting.dll"]
