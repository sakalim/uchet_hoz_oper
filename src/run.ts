import { ShutdownServer, RunServer } from "./server";

function ExitingProcess(err: any) {
    console.log('Exiting process');

    if (err) {
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);
    }
}

process.on('unhandledRejection', async (err) => {
    console.log('Uncaught rejection');
    console.error(err);    
    ExitingProcess(await ShutdownServer(err))
});

process.on('uncaughtException', async err => {
    console.log('Uncaught exception');
    console.error(err);
    ExitingProcess(await ShutdownServer(err));
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM');
    ExitingProcess(await ShutdownServer());
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT');
    ExitingProcess(await ShutdownServer());
});

RunServer();