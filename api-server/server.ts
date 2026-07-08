import app from './app';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`  Gurukul School Backend running on port ${PORT} `);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log(`=============================================`);
});

process.on('unhandledRejection', (err: any) => {
  console.error(`Unhandled Rejection Details: ${err.message}`);
  server.close(() => process.exit(1));
});
