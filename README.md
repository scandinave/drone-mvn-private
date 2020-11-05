# drone-mvn-private

Drone plugin for generating the `settings.xml` with the server authentication for a Maven private repository.

This plugin is for repositories( public, snapshot, release ) managed by the same credential like in Sonata Nexus.
You currently can't define user/password by repository.
## Configuration

The following parameters are used to configure the plugin:

- `username`: the server username credential
- `password`: the server password credential
- `url`: the maven repository from where dependencies are download
- `url_snapshots`: the maven repository where the snapshot are push
- `url_releases`: the maven repository where the releases are push
- `debug`: If true, display the generated settings.xml in the console.


### Drone configuration example

```yaml
pipeline:

  auth: 
    image: scandinave/drone-mvn-private
    pull: true
    settings:
      username:
        from_secret: nexus_username
      password:
        from_secret: nexue_password
      url: http://example.com/maven-public
      url_snapshots: http://example.com/maven_snapshots
      url_releases: http://example.com/maven_releases

  deploy:
    image: maven:3-alpine
    commands:
      - mvn clean deploy -s settings.xml
```

## License

MIT
