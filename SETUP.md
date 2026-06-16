# TaskPilot 개발 환경 셋업 가이드

## 1. PostgreSQL 셋업 (Docker)

### 1.1 docker-compose.yml 생성

프로젝트 루트에 `docker-compose.yml` 생성:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: taskpilot-db
    environment:
      POSTGRES_USER: taskpilot
      POSTGRES_PASSWORD: taskpilot_dev_password
      POSTGRES_DB: taskpilot
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db-schema.sql:/docker-entrypoint-initdb.d/schema.sql
    networks:
      - taskpilot-network

networks:
  taskpilot-network:
    driver: bridge

volumes:
  postgres_data:
```

### 1.2 PostgreSQL 실행

```bash
docker-compose up -d
```

**확인:**
```bash
docker-compose logs postgres
```

데이터베이스 접속 테스트:
```bash
docker exec -it taskpilot-db psql -U taskpilot -d taskpilot -c "SELECT version();"
```

---

## 2. Spring Boot 프로젝트 셋업

### 2.1 프로젝트 구조

```
TaskPilot/
├── backend/                          # Spring Boot 프로젝트
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskpilot/
│   │   │   │   ├── TaskPilotApplication.java    # 진입점
│   │   │   │   ├── controller/                  # REST API
│   │   │   │   ├── service/                     # 비즈니스 로직
│   │   │   │   ├── repository/                  # JPA Repository
│   │   │   │   ├── entity/                      # JPA Entity (DB 모델)
│   │   │   │   ├── dto/                         # Request/Response DTO
│   │   │   │   ├── util/                        # 유틸리티 (텍스트 분석, AI 등)
│   │   │   │   └── config/                      # 설정 (DB, 보안 등)
│   │   │   └── resources/
│   │   │       ├── application.yml              # 설정파일
│   │   │       └── application-dev.yml          # 개발 환경 설정
│   │   └── test/
│   ├── pom.xml                       # Maven 의존성
│   └── .gitignore
├── front/                            # Next.js 프로젝트 (이미 있음)
├── db-schema.sql                     # DB 스키마
├── docker-compose.yml                # Docker 설정
└── spec.md                           # MVP 스펙
```

### 2.2 Spring Boot 프로젝트 생성

**방법 1: Spring Boot CLI 사용**
```bash
spring boot new --name=backend --package-name=com.taskpilot --build=maven
```

**방법 2: Spring Initializr (https://start.spring.io/)**
- Project: Maven Project
- Language: Java
- Spring Boot: 3.2.x (최신)
- Dependencies:
  - Spring Web
  - Spring Data JPA
  - PostgreSQL Driver
  - Validation
  - Lombok (선택)

### 2.3 pom.xml (주요 의존성)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.taskpilot</groupId>
    <artifactId>taskpilot-backend</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>TaskPilot Backend</name>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.7.1</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Lombok (선택) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.4 application.yml 설정

`src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/taskpilot
    username: taskpilot
    password: taskpilot_dev_password
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate # 자동 생성 비활성화 (스키마는 이미 생성됨)
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: false

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    root: INFO
    com.taskpilot: DEBUG
```

---

## 3. 프로젝트 구조 세부사항

### 3.1 Entity 클래스 예시

`src/main/java/com/taskpilot/entity/User.java`:

```java
package com.taskpilot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", schema = "taskpilot")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    // ... (나머지 getter/setter)
}
```

### 3.2 Repository 예시

`src/main/java/com/taskpilot/repository/UserRepository.java`:

```java
package com.taskpilot.repository;

import com.taskpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

### 3.3 Controller 예시

`src/main/java/com/taskpilot/controller/UserController.java`:

```java
package com.taskpilot.controller;

import com.taskpilot.entity.User;
import com.taskpilot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
```

---

## 4. 실행 및 테스트

### 4.1 Spring Boot 실행

```bash
cd backend
mvn spring-boot:run
```

또는:
```bash
mvn clean install
java -jar target/taskpilot-backend-1.0.0-SNAPSHOT.jar
```

**확인:** http://localhost:8080/api 접속 (404 정상)

### 4.2 API 테스트

```bash
# User 생성 테스트
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "passwordHash": "hash_example"
  }'
```

---

## 5. Frontend (Next.js) 셋업

### 5.1 기존 Next.js 프로젝트 활용

```bash
cd front
npm install
npm run dev
```

**확인:** http://localhost:3000 접속

### 5.2 API 통신 설정

`front/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 6. 개발 워크플로우

### 6.1 동시 실행

**터미널 1: PostgreSQL**
```bash
docker-compose up
```

**터미널 2: Spring Boot**
```bash
cd backend
mvn spring-boot:run
```

**터미널 3: Next.js**
```bash
cd front
npm run dev
```

---

## 7. 다음 단계

✅ DB 스키마 완성  
✅ 개발 환경 셋업 가이드 작성  
⬜ Spring Boot Entity/Repository/Service 구현 (Week 1)  
⬜ REST API 엔드포인트 개발 (User, Task CRUD)  
⬜ Next.js 페이지 & 컴포넌트 개발  
⬜ 텍스트 분석 모듈 연동

