'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const guards = require('../src/core/install-guards');

test('reads the actual Linux NVIDIA kernel driver rather than Proton NVAPI', () => {
  const version = guards.linuxNvidiaDriverVersion({
    platform: 'linux',
    readFile: () => 'NVRM version: NVIDIA UNIX x86_64 Kernel Module  580.178.04  Wed Aug 20 00:00:00 UTC 2026\n'
  });
  assert.equal(version, '580.178.04');
});

test('does not attempt a host driver lookup off Linux or when it is unavailable', () => {
  assert.equal(guards.linuxNvidiaDriverVersion({ platform: 'win32', readFile: () => { throw new Error('unexpected'); } }), null);
  assert.equal(guards.linuxNvidiaDriverVersion({ platform: 'linux', readFile: () => { throw new Error('missing'); } }), null);
});

test('requires the Feeder minimum host driver only when one was identified', () => {
  assert.equal(guards.neuralDriverVersionSupported('580.178.04'), false);
  assert.equal(guards.neuralDriverVersionSupported('616.55'), false);
  assert.equal(guards.neuralDriverVersionSupported('616.56'), true);
  assert.equal(guards.neuralDriverVersionSupported(null), true);
});
