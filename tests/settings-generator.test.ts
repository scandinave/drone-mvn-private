import { SettingsGenerator } from "../settings-generator.ts";
import { assertEquals } from "https://deno.land/std@0.76.0/testing/asserts.ts";

Deno.test("It should generate correct settings.xml", () => {
  const generator = new SettingsGenerator(
    "http://example.com",
    "http://example.com/releases",
    "http://example.com/snapshots",
    "foo",
    "bar",
  );
  const result = generator.generate();

  assertEquals(
    result.replaceAll(" ", "").replaceAll("\n", ""),
    `
        <?xml version="1.0" encoding="UTF-8"?>
        <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
            <localRepository>${Deno.env.get('PWD')}</localRepository>
            <servers>
                <server>
                    <id>releases</id>
                    <username>foo</username>
                    <password>bar</password>
                </server>
                <server>
                    <id>snapshots</id>
                    <username>foo</username>
                    <password>bar</password>
                </server>
            </servers>
            <profiles>
                <profile>
                    <id>CI</id>
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
                            <url>http://example.com</url>
                            <layout>default</layout>
                        </repository>
                    </repositories>
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
                            <url>http://example.com</url>
                            <layout>default</layout>
                        </pluginRepository>
                    </pluginRepositories>
                    <properties>
                        <altSnapshotDeploymentRepository>snapshots::default::http://example.com/snapshots</altSnapshotDeploymentRepository>
                        <altReleaseDeploymentRepository>releases::default::http://example.com/releases</altReleaseDeploymentRepository>
                    </properties>
                </profile>
            </profiles>
            <activeProfiles>
                <activeProfile>CI</activeProfile>
            </activeProfiles>
        </settings>
    `.replaceAll(" ", "").replaceAll("\n", ""),
  );
});
