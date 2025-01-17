import { spawnSync, spawn, ChildProcessWithoutNullStreams } from 'child_process';

export const runCommand = (command: string) => {
  console.log(`Running command:\n${command}`);
  return spawnSync(command, {
    shell: true,
  }).stdout.toString();
};

export const runCommandInBackground = (command: string) => {
  console.log(`Running background command:\n${command}`);
  return spawn(command, {
    detached: true,
    shell: true,
  });
};

export const killBackgroundProcess = (processToKill: ChildProcessWithoutNullStreams) => {
  // Only the following reliably kills the Airnode process. See:
  // https://azimi.me/2014/12/31/kill-child_process-node-js.html
  //
  // We need to gracefully kill the Airnode docker otherwise it remains running on background
  process.kill(-processToKill.pid!);
};
