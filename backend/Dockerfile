# ══════════════════════════════════════════════════════════════
# PayTrack Pro — Backend Dockerfile
# Location: paytrack-pro/backend/Dockerfile
# ══════════════════════════════════════════════════════════════

# ── Stage 1: Build ────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first — Docker caches this layer
# Only re-downloads dependencies if pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build JAR (skip tests — tests run in CI)
COPY src ./src
RUN mvn package -DskipTests -B

# ── Stage 2: Runtime (smaller image — no Maven) ───────────────
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user for security (Railway best practice)
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy only the JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Own the file as appuser
RUN chown appuser:appgroup app.jar
USER appuser

# Railway injects PORT env var — must listen on 0.0.0.0
EXPOSE 8080

# ── Key fix: use exec form not shell form ─────────────────────
# Shell form: ENTRYPOINT ["sh", "-c", "java ..."] — signal handling broken
# Exec form: ENTRYPOINT ["java", ...] — signals handled correctly
ENTRYPOINT ["java", \
  "-Dserver.port=${PORT:-8080}", \
  "-Dspring.profiles.active=prod", \
  "-jar", "app.jar"]
