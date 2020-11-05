export class SettingsGenerator {
  private readonly url: string;
  private readonly urlSnapshots: string;
  private readonly urlReleases: string;
  private readonly username: string;
  private readonly password: string;

  /**
     * Initialize a generator
     * @param url The private maven server url from where lib are download
     * @param url The private maven server url where releases are pushed
     * @param url The private maven server url where snapshot are pushed
     * @param username The private maven server username
     * @param password The private maven server password
     */
  constructor(url: string, urlReleases: string, urlSnapshots: string, username: string, password: string) {
    this.url = url;
    this.urlSnapshots = urlSnapshots;
    this.urlReleases = urlReleases;
    this.username = username;
    this.password = password;
  }

  generate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <localRepository>/drone/src/.m2</localRepository>
  ${this.generateServer().replaceAll(" ", "").replaceAll("\\n", "")}
  ${this.generateProfile().replaceAll(" ", "").replaceAll("\\n", "")}
  ${this.generateActiveProfile().replaceAll(" ", "").replaceAll("\\n", "")}
</settings>
    `;
  }

  private generateServer(): string {
    return `
      <servers>
        <server>
          <id>releases</id>
          <username>${this.username}</username>
          <password>${this.password}</password>
        </server>
        <server>
          <id>snapshots</id>
          <username>${this.username}</username>
          <password>${this.password}</password>
        </server>
      </servers>
    `;
  }

  private generateRepository(): string {
    return `
      <repositories>
        <repository>
          <id>private</id>
          <name>Private Repo</name>
          <releases>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
          </releases>
          <snapshots>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
          </snapshots>
          <url>${this.url}</url>
          <layout>default</layout>
        </repository>
      </repositories>
    `;
  }

  private generatePluginRepository() {
    return `
      <pluginRepositories>
        <pluginRepository>
          <id>private</id>
          <name>Private Repo</name>
          <releases>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
          </releases>
          <snapshots>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
          </snapshots>
          <url>${this.url}</url>
          <layout>default</layout>
        </pluginRepository>
      </pluginRepositories>
    `;
  }

  private generateProfile(): string {
    return `
      <profiles>
        <profile>
          <id>CI</id>
          ${this.generateRepository()}
          ${this.generatePluginRepository()}
          ${this.generateDeploymentRepository()}
        </profile>
      </profiles>
    `;
  }

  private generateActiveProfile(): string {
    return `
      <activeProfiles>
          <activeProfile>CI</activeProfile>
      </activeProfiles>
    `;
  }

  generateDeploymentRepository() {
    return `
      <properties>
        <altSnapshotDeploymentRepository>snapshots::${this.urlSnapshots}</altSnapshotDeploymentRepository>
        <altReleaseDeploymentRepository>releases::${this.urlReleases}</altReleaseDeploymentRepository>
      </properties>
    `;
  }
}
