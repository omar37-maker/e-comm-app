

export default () => ({
    app: {
    port: process.env.PORT ?? 3000,
    nodeEnv: process.env.NODE_ENV ?? "dev",
  },

  database: {
    MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/social_app",
  },

  encryption: {
    ENCRYPTION_KEY: process.env.ENC_KEY?? "c50fbab25815764e774ee85e9e705c65071892f0e6fab102c99226fac4cb5df2",
    IV_LENGTH: process.env.ENC_IV_LENGTH ?? "16",
  },
  jwt: {
    user: {
      accessSignature: process.env.JWT_ACCESS_SECRET_USER ?? "user_access_test",
      accessExpiration: process.env.JWT_ACCESS_EXP_USER,

      refreshSignature: process.env.JWT_REFRESH_SECRET_USER ?? "user_refresh_test",
      refreshExpiration: process.env.JWT_REFRESH_EXP_USER,
    },
    admin: {
      accessSignature: process.env.JWT_ACCESS_SECRET_ADMIN ?? "admin_access_test",
      accessExpiration: process.env.JWT_ACCESS_EXP_ADMIN,

      refreshSignature: process.env.JWT_REFRESH_SECRET_ADMIN ?? "admin_refresh_test",
      refreshExpiration: process.env.JWT_REFRESH_EXP_ADMIN,
    },
  },
  cors: {
    whiteListedOrigins: process.env.CORS_WHITELISTED_ORIGINS?.split(","),
  },
  gcp: {
    webClientId: process.env.GCP_CLIENT_ID,
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  emails: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
    s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
        region: process.env.AWS_REGION ?? "",
        bucketName: process.env.AWS_BUCKET_NAME ?? ""
    }
})