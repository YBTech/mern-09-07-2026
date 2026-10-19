# Post-mortem: Bluetooth pairing drops after firmware 2.4.0 (INC-2026-Q3-011)

## Summary

Firmware 2.4.0 for the Aria 500 shipped on 28 July 2026. From 1 August, customers reported that Bluetooth connections dropped within minutes of pairing. The incident was declared on 3 August as INC-2026-Q3-011 and closed on 14 August when firmware 2.4.1 finished rolling out. About 41,000 devices ran 2.4.0 at the peak.

## Detection

The incident commander posted a status update every four hours in the internal channel and in the status page draft. The incident commander posted a status update every four hours in the internal channel and in the status page draft. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly.

Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. The incident commander posted a status update every four hours in the internal channel and in the status page draft. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average.

The incident commander posted a status update every four hours in the internal channel and in the status page draft. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. The incident commander posted a status update every four hours in the internal channel and in the status page draft. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.

A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat.

The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. The incident commander posted a status update every four hours in the internal channel and in the status page draft. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average.

The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. The incident commander posted a status update every four hours in the internal channel and in the status page draft. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly.

## Timeline

- 2026-08-01 20:38 Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.
- 2026-08-01 21:39 Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat.
- 2026-08-01 13:51 Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.
- 2026-08-01 09:51 The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones.
- 2026-08-02 07:16 Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.
- 2026-08-02 10:41 The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones.
- 2026-08-02 13:00 Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.
- 2026-08-03 18:50 Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.
- 2026-08-03 14:20 The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average.
- 2026-08-03 08:47 Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat.
- 2026-08-04 17:20 Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly.
- 2026-08-04 12:29 Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange.
- 2026-08-04 20:17 Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.
- 2026-08-05 15:55 The incident commander posted a status update every four hours in the internal channel and in the status page draft.
- 2026-08-05 09:34 Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly.
- 2026-08-05 13:23 Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.
- 2026-08-06 11:15 Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange.
- 2026-08-06 12:47 The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average.
- 2026-08-06 18:19 Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat.
- 2026-08-06 07:25 A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.
- 2026-08-07 17:22 Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat.
- 2026-08-07 13:30 Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange.
- 2026-08-07 21:30 Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.
- 2026-08-08 09:59 Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.
- 2026-08-08 16:50 A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.
- 2026-08-08 09:18 Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.
- 2026-08-09 17:25 A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.
- 2026-08-09 20:08 Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.
- 2026-08-09 07:27 The incident commander posted a status update every four hours in the internal channel and in the status page draft.
- 2026-08-10 09:12 A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.
- 2026-08-10 20:33 Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.
- 2026-08-10 08:05 The incident commander posted a status update every four hours in the internal channel and in the status page draft.
- 2026-08-11 10:32 The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average.
- 2026-08-11 11:31 A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.
- 2026-08-11 19:43 The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years.
- 2026-08-11 18:11 The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones.
- 2026-08-12 09:01 Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.
- 2026-08-12 09:15 The incident commander posted a status update every four hours in the internal channel and in the status page draft.
- 2026-08-12 08:43 Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.
- 2026-08-13 14:51 Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.

## Root cause analysis

The pairing module waits 200 ms for the phone to finish the key exchange. Phones with slower Bluetooth stacks need between 250 and 400 ms. When the wait expires, the module drops the link and retries, and the retry hits the same limit, so the connection drops again within minutes. The timeout had been shortened from 500 ms to 200 ms in a cleanup change. The root cause was a timing error in the pairing module, not the radio hardware.

The incident commander posted a status update every four hours in the internal channel and in the status page draft. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.

The incident commander posted a status update every four hours in the internal channel and in the status page draft. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly. The incident commander posted a status update every four hours in the internal channel and in the status page draft. Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier. Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.

Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. The incident commander posted a status update every four hours in the internal channel and in the status page draft. The incident commander posted a status update every four hours in the internal channel and in the status page draft. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.

Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. The incident commander posted a status update every four hours in the internal channel and in the status page draft. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange.

Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years.

## Mitigation

The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. The incident commander posted a status update every four hours in the internal channel and in the status page draft.

Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.

The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. The incident commander posted a status update every four hours in the internal channel and in the status page draft. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly.

Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.

A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.

## Fix in firmware 2.4.1

Firmware 2.4.1 restores the 500 ms key exchange timeout and retries with backoff. It was released on 14 August 2026. A pairing test against five slow reference phones is now part of every release checklist.

A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. The incident commander posted a status update every four hours in the internal channel and in the status page draft. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones.

The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.

The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier. Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones.

The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. The incident commander posted a status update every four hours in the internal channel and in the status page draft.

## Lessons learned

A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. The incident commander posted a status update every four hours in the internal channel and in the status page draft. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.

Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones.

A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly.

A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.

Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat. The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange. Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat.

Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier. Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix. The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones. A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.

## Action items

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Build 2.4.0 passed every automated check, because the automated pairin | Connectivity | 2026-09-20 |
| 2 | Build 2.4.0 passed every automated check, because the automated pairin | QA | 2026-09-23 |
| 3 | Build 2.4.0 passed every automated check, because the automated pairin | Release | 2026-09-23 |
| 4 | The release checklist covered unit tests for the audio pipeline, a bat | Release | 2026-09-11 |
| 5 | Telemetry records the firmware version, the phone model family, and th | Connectivity | 2026-09-14 |
| 6 | The on-call engineer for the connectivity team is paged when the daily | QA | 2026-09-06 |
| 7 | Firmware updates roll out in waves, starting with five percent of devi | QA | 2026-09-23 |
| 8 | The release checklist covered unit tests for the audio pipeline, a bat | QA | 2026-09-13 |
| 9 | Review of the pairing module history showed that the key exchange time | Connectivity | 2026-09-26 |
| 10 | Review of the pairing module history showed that the key exchange time | Connectivity | 2026-09-22 |
| 11 | Build 2.4.0 passed every automated check, because the automated pairin | Release | 2026-09-25 |
| 12 | A rollback was considered, but devices that already updated cannot be  | Release | 2026-09-11 |
| 13 | Reports from the community forum were collected into a spreadsheet by  | QA | 2026-09-24 |
| 14 | Build 2.4.0 passed every automated check, because the automated pairin | Connectivity | 2026-09-28 |
| 15 | A rollback was considered, but devices that already updated cannot be  | QA | 2026-09-11 |
| 16 | Reports from the community forum were collected into a spreadsheet by  | Connectivity | 2026-09-12 |
| 17 | Firmware updates roll out in waves, starting with five percent of devi | Connectivity | 2026-09-27 |
| 18 | Review of the pairing module history showed that the key exchange time | Connectivity | 2026-09-06 |
| 19 | Reports from the community forum were collected into a spreadsheet by  | QA | 2026-09-21 |
| 20 | Review of the pairing module history showed that the key exchange time | QA | 2026-09-15 |
| 21 | The on-call engineer for the connectivity team is paged when the daily | Connectivity | 2026-09-06 |
| 22 | Review of the pairing module history showed that the key exchange time | Release | 2026-09-07 |
| 23 | The incident commander posted a status update every four hours in the  | Release | 2026-09-17 |
| 24 | Build 2.4.0 passed every automated check, because the automated pairin | Release | 2026-09-19 |
| 25 | The release checklist covered unit tests for the audio pipeline, a bat | Firmware | 2026-09-20 |
| 26 | A rollback was considered, but devices that already updated cannot be  | Release | 2026-09-24 |
| 27 | A rollback was considered, but devices that already updated cannot be  | QA | 2026-09-05 |
| 28 | Firmware updates roll out in waves, starting with five percent of devi | QA | 2026-09-06 |
| 29 | Build 2.4.0 passed every automated check, because the automated pairin | QA | 2026-09-14 |
| 30 | Reports from the community forum were collected into a spreadsheet by  | QA | 2026-09-12 |

## Appendix A: pairing service logs

2026-08-07T11:15:03Z pairing device=ARIA500-4222 fw=2.4.0 event=key_exchange_slow rtt_ms=140
2026-08-10T03:19:31Z pairing device=ARIA500-3568 fw=2.4.0 event=key_exchange_slow rtt_ms=269
2026-08-06T19:40:17Z pairing device=ARIA500-7314 fw=2.4.0 event=handshake_ok rtt_ms=94
2026-08-07T05:51:57Z pairing device=ARIA500-3171 fw=2.4.0 event=retry_scheduled rtt_ms=332
2026-08-09T08:25:52Z pairing device=ARIA500-8474 fw=2.4.0 event=handshake_timeout rtt_ms=489
2026-08-08T09:54:18Z pairing device=ARIA500-4761 fw=2.4.0 event=key_exchange_slow rtt_ms=106
2026-08-07T05:00:07Z pairing device=ARIA500-9646 fw=2.4.0 event=handshake_timeout rtt_ms=429
2026-08-02T15:58:14Z pairing device=ARIA500-2098 fw=2.4.0 event=handshake_timeout rtt_ms=273
2026-08-01T11:47:37Z pairing device=ARIA500-1870 fw=2.4.0 event=handshake_ok rtt_ms=225
2026-08-01T06:53:47Z pairing device=ARIA500-4353 fw=2.4.0 event=key_exchange_slow rtt_ms=235
2026-08-12T16:11:08Z pairing device=ARIA500-3025 fw=2.4.0 event=handshake_timeout rtt_ms=138
2026-08-01T13:46:49Z pairing device=ARIA500-8202 fw=2.4.0 event=handshake_ok rtt_ms=334
2026-08-04T19:17:27Z pairing device=ARIA500-4696 fw=2.4.0 event=handshake_ok rtt_ms=299
2026-08-09T12:04:25Z pairing device=ARIA500-2141 fw=2.4.0 event=handshake_timeout rtt_ms=239
2026-08-09T03:21:19Z pairing device=ARIA500-9014 fw=2.4.0 event=retry_scheduled rtt_ms=419
2026-08-13T03:11:19Z pairing device=ARIA500-1359 fw=2.4.0 event=retry_scheduled rtt_ms=450
2026-08-03T12:13:23Z pairing device=ARIA500-3641 fw=2.4.0 event=key_exchange_slow rtt_ms=330
2026-08-12T13:08:21Z pairing device=ARIA500-6953 fw=2.4.0 event=retry_scheduled rtt_ms=134
2026-08-05T15:44:50Z pairing device=ARIA500-6220 fw=2.4.0 event=retry_scheduled rtt_ms=213
2026-08-02T19:21:42Z pairing device=ARIA500-8399 fw=2.4.0 event=link_dropped rtt_ms=298
2026-08-08T09:19:38Z pairing device=ARIA500-9596 fw=2.4.0 event=handshake_timeout rtt_ms=114
2026-08-08T06:25:43Z pairing device=ARIA500-9372 fw=2.4.0 event=handshake_ok rtt_ms=142
2026-08-08T21:21:10Z pairing device=ARIA500-8545 fw=2.4.0 event=handshake_ok rtt_ms=289
2026-08-12T02:44:55Z pairing device=ARIA500-4925 fw=2.4.0 event=link_dropped rtt_ms=123
2026-08-03T08:27:11Z pairing device=ARIA500-1139 fw=2.4.0 event=link_dropped rtt_ms=425
2026-08-06T16:16:11Z pairing device=ARIA500-2927 fw=2.4.0 event=handshake_timeout rtt_ms=378
2026-08-07T21:31:37Z pairing device=ARIA500-2046 fw=2.4.0 event=handshake_timeout rtt_ms=427
2026-08-06T17:35:43Z pairing device=ARIA500-4945 fw=2.4.0 event=link_dropped rtt_ms=188
2026-08-01T08:45:02Z pairing device=ARIA500-8317 fw=2.4.0 event=handshake_timeout rtt_ms=469
2026-08-12T04:42:41Z pairing device=ARIA500-2396 fw=2.4.0 event=key_exchange_slow rtt_ms=325
2026-08-09T19:33:18Z pairing device=ARIA500-5697 fw=2.4.0 event=handshake_ok rtt_ms=88
2026-08-13T08:19:03Z pairing device=ARIA500-9059 fw=2.4.0 event=key_exchange_slow rtt_ms=487
2026-08-06T13:38:24Z pairing device=ARIA500-8873 fw=2.4.0 event=handshake_timeout rtt_ms=449
2026-08-08T09:17:25Z pairing device=ARIA500-3895 fw=2.4.0 event=handshake_ok rtt_ms=186
2026-08-03T10:10:11Z pairing device=ARIA500-1783 fw=2.4.0 event=retry_scheduled rtt_ms=426
2026-08-03T02:23:40Z pairing device=ARIA500-2666 fw=2.4.0 event=key_exchange_slow rtt_ms=272
2026-08-05T00:24:03Z pairing device=ARIA500-4988 fw=2.4.0 event=handshake_timeout rtt_ms=497
2026-08-12T20:36:20Z pairing device=ARIA500-6744 fw=2.4.0 event=key_exchange_slow rtt_ms=464
2026-08-05T16:48:25Z pairing device=ARIA500-3219 fw=2.4.0 event=retry_scheduled rtt_ms=263
2026-08-07T00:55:09Z pairing device=ARIA500-4150 fw=2.4.0 event=handshake_ok rtt_ms=435
2026-08-03T15:34:14Z pairing device=ARIA500-2216 fw=2.4.0 event=handshake_ok rtt_ms=96
2026-08-06T10:10:48Z pairing device=ARIA500-7108 fw=2.4.0 event=retry_scheduled rtt_ms=458
2026-08-12T07:34:11Z pairing device=ARIA500-8309 fw=2.4.0 event=retry_scheduled rtt_ms=99
2026-08-11T21:51:07Z pairing device=ARIA500-2110 fw=2.4.0 event=handshake_ok rtt_ms=437
2026-08-13T10:49:18Z pairing device=ARIA500-4986 fw=2.4.0 event=key_exchange_slow rtt_ms=221
2026-08-04T23:57:17Z pairing device=ARIA500-4062 fw=2.4.0 event=handshake_timeout rtt_ms=185
2026-08-14T14:42:58Z pairing device=ARIA500-1881 fw=2.4.0 event=handshake_timeout rtt_ms=233
2026-08-13T15:15:10Z pairing device=ARIA500-3461 fw=2.4.0 event=link_dropped rtt_ms=286
2026-08-14T14:04:11Z pairing device=ARIA500-1996 fw=2.4.0 event=handshake_ok rtt_ms=313
2026-08-05T05:45:04Z pairing device=ARIA500-9944 fw=2.4.0 event=retry_scheduled rtt_ms=352
2026-08-12T23:56:31Z pairing device=ARIA500-3941 fw=2.4.0 event=handshake_ok rtt_ms=407
2026-08-12T08:27:12Z pairing device=ARIA500-3071 fw=2.4.0 event=key_exchange_slow rtt_ms=372
2026-08-09T03:46:11Z pairing device=ARIA500-1070 fw=2.4.0 event=key_exchange_slow rtt_ms=127
2026-08-07T02:27:36Z pairing device=ARIA500-6375 fw=2.4.0 event=handshake_timeout rtt_ms=345
2026-08-09T14:24:07Z pairing device=ARIA500-5660 fw=2.4.0 event=handshake_ok rtt_ms=297
2026-08-04T11:58:49Z pairing device=ARIA500-4090 fw=2.4.0 event=key_exchange_slow rtt_ms=467
2026-08-12T07:44:29Z pairing device=ARIA500-3741 fw=2.4.0 event=link_dropped rtt_ms=505
2026-08-10T09:06:13Z pairing device=ARIA500-8530 fw=2.4.0 event=handshake_timeout rtt_ms=285
2026-08-14T19:20:42Z pairing device=ARIA500-6457 fw=2.4.0 event=retry_scheduled rtt_ms=351
2026-08-06T13:58:16Z pairing device=ARIA500-2713 fw=2.4.0 event=retry_scheduled rtt_ms=238
2026-08-14T12:24:20Z pairing device=ARIA500-5992 fw=2.4.0 event=handshake_ok rtt_ms=371
2026-08-11T01:08:15Z pairing device=ARIA500-7548 fw=2.4.0 event=link_dropped rtt_ms=109
2026-08-02T12:41:52Z pairing device=ARIA500-8021 fw=2.4.0 event=handshake_timeout rtt_ms=175
2026-08-08T17:24:48Z pairing device=ARIA500-5427 fw=2.4.0 event=handshake_timeout rtt_ms=291
2026-08-04T11:16:42Z pairing device=ARIA500-4508 fw=2.4.0 event=link_dropped rtt_ms=452
2026-08-04T07:00:33Z pairing device=ARIA500-3895 fw=2.4.0 event=key_exchange_slow rtt_ms=294
2026-08-11T22:55:09Z pairing device=ARIA500-9758 fw=2.4.0 event=handshake_timeout rtt_ms=442
2026-08-08T22:14:27Z pairing device=ARIA500-5284 fw=2.4.0 event=handshake_ok rtt_ms=330
2026-08-05T05:32:03Z pairing device=ARIA500-4351 fw=2.4.0 event=key_exchange_slow rtt_ms=121
2026-08-10T07:36:58Z pairing device=ARIA500-7361 fw=2.4.0 event=handshake_timeout rtt_ms=410
2026-08-03T15:40:46Z pairing device=ARIA500-7961 fw=2.4.0 event=handshake_timeout rtt_ms=363
2026-08-10T22:47:50Z pairing device=ARIA500-5779 fw=2.4.0 event=handshake_timeout rtt_ms=240
2026-08-01T15:56:55Z pairing device=ARIA500-6728 fw=2.4.0 event=handshake_ok rtt_ms=455
2026-08-06T18:50:59Z pairing device=ARIA500-6591 fw=2.4.0 event=handshake_timeout rtt_ms=455
2026-08-02T14:27:00Z pairing device=ARIA500-5940 fw=2.4.0 event=retry_scheduled rtt_ms=490
2026-08-02T00:01:47Z pairing device=ARIA500-5124 fw=2.4.0 event=handshake_timeout rtt_ms=383
2026-08-01T07:41:58Z pairing device=ARIA500-3889 fw=2.4.0 event=link_dropped rtt_ms=400
2026-08-14T06:11:54Z pairing device=ARIA500-9910 fw=2.4.0 event=handshake_ok rtt_ms=439
2026-08-06T01:32:26Z pairing device=ARIA500-8689 fw=2.4.0 event=key_exchange_slow rtt_ms=456
2026-08-11T01:49:06Z pairing device=ARIA500-1196 fw=2.4.0 event=retry_scheduled rtt_ms=146
2026-08-10T11:44:50Z pairing device=ARIA500-5465 fw=2.4.0 event=link_dropped rtt_ms=146
2026-08-10T00:36:55Z pairing device=ARIA500-1005 fw=2.4.0 event=handshake_timeout rtt_ms=217
2026-08-14T13:41:44Z pairing device=ARIA500-1138 fw=2.4.0 event=handshake_ok rtt_ms=233
2026-08-01T12:58:49Z pairing device=ARIA500-4859 fw=2.4.0 event=retry_scheduled rtt_ms=109
2026-08-08T21:41:57Z pairing device=ARIA500-2352 fw=2.4.0 event=handshake_ok rtt_ms=215
2026-08-01T07:32:50Z pairing device=ARIA500-9675 fw=2.4.0 event=retry_scheduled rtt_ms=196
2026-08-10T12:39:13Z pairing device=ARIA500-1336 fw=2.4.0 event=handshake_timeout rtt_ms=480
2026-08-01T17:25:13Z pairing device=ARIA500-1377 fw=2.4.0 event=retry_scheduled rtt_ms=240
2026-08-08T07:51:47Z pairing device=ARIA500-2832 fw=2.4.0 event=link_dropped rtt_ms=106
2026-08-02T14:34:01Z pairing device=ARIA500-5118 fw=2.4.0 event=retry_scheduled rtt_ms=219
2026-08-08T00:39:02Z pairing device=ARIA500-5173 fw=2.4.0 event=link_dropped rtt_ms=83
2026-08-05T18:03:04Z pairing device=ARIA500-7985 fw=2.4.0 event=key_exchange_slow rtt_ms=430
2026-08-05T08:36:49Z pairing device=ARIA500-2661 fw=2.4.0 event=link_dropped rtt_ms=137
2026-08-13T04:01:04Z pairing device=ARIA500-5307 fw=2.4.0 event=handshake_timeout rtt_ms=349
2026-08-07T17:09:21Z pairing device=ARIA500-3029 fw=2.4.0 event=handshake_ok rtt_ms=351
2026-08-01T06:06:57Z pairing device=ARIA500-6573 fw=2.4.0 event=retry_scheduled rtt_ms=432
2026-08-04T08:28:29Z pairing device=ARIA500-3971 fw=2.4.0 event=link_dropped rtt_ms=275
2026-08-10T05:51:15Z pairing device=ARIA500-6143 fw=2.4.0 event=key_exchange_slow rtt_ms=336
2026-08-06T09:38:34Z pairing device=ARIA500-9706 fw=2.4.0 event=retry_scheduled rtt_ms=105
2026-08-05T11:13:53Z pairing device=ARIA500-1344 fw=2.4.0 event=key_exchange_slow rtt_ms=372
2026-08-02T21:14:14Z pairing device=ARIA500-6069 fw=2.4.0 event=handshake_timeout rtt_ms=138
2026-08-13T15:28:39Z pairing device=ARIA500-3414 fw=2.4.0 event=link_dropped rtt_ms=150
2026-08-03T03:50:01Z pairing device=ARIA500-4373 fw=2.4.0 event=retry_scheduled rtt_ms=496
2026-08-10T21:32:28Z pairing device=ARIA500-9160 fw=2.4.0 event=handshake_timeout rtt_ms=231
2026-08-13T05:51:22Z pairing device=ARIA500-7183 fw=2.4.0 event=handshake_timeout rtt_ms=392
2026-08-02T11:47:52Z pairing device=ARIA500-2592 fw=2.4.0 event=retry_scheduled rtt_ms=443
2026-08-13T23:43:50Z pairing device=ARIA500-6979 fw=2.4.0 event=key_exchange_slow rtt_ms=251
2026-08-08T19:58:52Z pairing device=ARIA500-8072 fw=2.4.0 event=retry_scheduled rtt_ms=415
2026-08-09T01:06:52Z pairing device=ARIA500-4148 fw=2.4.0 event=retry_scheduled rtt_ms=500
2026-08-09T05:43:56Z pairing device=ARIA500-9106 fw=2.4.0 event=handshake_timeout rtt_ms=186
2026-08-01T21:01:51Z pairing device=ARIA500-2698 fw=2.4.0 event=link_dropped rtt_ms=364
2026-08-11T19:01:53Z pairing device=ARIA500-3094 fw=2.4.0 event=handshake_ok rtt_ms=478
2026-08-06T19:44:55Z pairing device=ARIA500-9572 fw=2.4.0 event=retry_scheduled rtt_ms=112
2026-08-12T21:05:08Z pairing device=ARIA500-3098 fw=2.4.0 event=handshake_timeout rtt_ms=278
2026-08-13T07:43:36Z pairing device=ARIA500-9046 fw=2.4.0 event=handshake_timeout rtt_ms=467
2026-08-05T18:53:14Z pairing device=ARIA500-9537 fw=2.4.0 event=handshake_ok rtt_ms=276
2026-08-05T17:34:21Z pairing device=ARIA500-2894 fw=2.4.0 event=link_dropped rtt_ms=116
2026-08-14T10:34:57Z pairing device=ARIA500-1763 fw=2.4.0 event=key_exchange_slow rtt_ms=453
2026-08-06T05:47:19Z pairing device=ARIA500-8014 fw=2.4.0 event=key_exchange_slow rtt_ms=221
2026-08-02T01:46:05Z pairing device=ARIA500-5355 fw=2.4.0 event=key_exchange_slow rtt_ms=471
2026-08-13T15:55:20Z pairing device=ARIA500-5369 fw=2.4.0 event=retry_scheduled rtt_ms=243
2026-08-11T12:40:55Z pairing device=ARIA500-6970 fw=2.4.0 event=link_dropped rtt_ms=165
2026-08-06T16:25:37Z pairing device=ARIA500-9119 fw=2.4.0 event=key_exchange_slow rtt_ms=315
2026-08-05T12:10:12Z pairing device=ARIA500-9975 fw=2.4.0 event=link_dropped rtt_ms=143
2026-08-12T19:18:33Z pairing device=ARIA500-5487 fw=2.4.0 event=link_dropped rtt_ms=271
2026-08-12T01:45:26Z pairing device=ARIA500-8909 fw=2.4.0 event=handshake_timeout rtt_ms=135
2026-08-03T15:40:12Z pairing device=ARIA500-9451 fw=2.4.0 event=link_dropped rtt_ms=336
2026-08-05T11:40:29Z pairing device=ARIA500-2094 fw=2.4.0 event=handshake_ok rtt_ms=291
2026-08-07T03:14:03Z pairing device=ARIA500-8253 fw=2.4.0 event=link_dropped rtt_ms=390
2026-08-08T13:31:37Z pairing device=ARIA500-9593 fw=2.4.0 event=handshake_timeout rtt_ms=171
2026-08-03T23:26:14Z pairing device=ARIA500-2263 fw=2.4.0 event=key_exchange_slow rtt_ms=102
2026-08-03T00:58:08Z pairing device=ARIA500-8654 fw=2.4.0 event=key_exchange_slow rtt_ms=224
2026-08-13T01:25:55Z pairing device=ARIA500-2164 fw=2.4.0 event=handshake_ok rtt_ms=313
2026-08-04T21:03:02Z pairing device=ARIA500-4848 fw=2.4.0 event=key_exchange_slow rtt_ms=455
2026-08-14T13:22:08Z pairing device=ARIA500-7219 fw=2.4.0 event=link_dropped rtt_ms=415
2026-08-02T00:20:21Z pairing device=ARIA500-8043 fw=2.4.0 event=key_exchange_slow rtt_ms=178
2026-08-12T02:56:13Z pairing device=ARIA500-7833 fw=2.4.0 event=retry_scheduled rtt_ms=491
2026-08-09T21:02:16Z pairing device=ARIA500-5113 fw=2.4.0 event=handshake_ok rtt_ms=501
2026-08-03T00:12:09Z pairing device=ARIA500-1657 fw=2.4.0 event=key_exchange_slow rtt_ms=504
2026-08-06T22:42:10Z pairing device=ARIA500-6336 fw=2.4.0 event=link_dropped rtt_ms=467
2026-08-04T15:10:59Z pairing device=ARIA500-2462 fw=2.4.0 event=retry_scheduled rtt_ms=98
2026-08-05T00:02:36Z pairing device=ARIA500-9703 fw=2.4.0 event=retry_scheduled rtt_ms=162
2026-08-05T20:21:02Z pairing device=ARIA500-5655 fw=2.4.0 event=handshake_ok rtt_ms=439
2026-08-08T07:20:50Z pairing device=ARIA500-2422 fw=2.4.0 event=link_dropped rtt_ms=190
2026-08-02T00:40:39Z pairing device=ARIA500-2531 fw=2.4.0 event=key_exchange_slow rtt_ms=214
2026-08-04T18:15:57Z pairing device=ARIA500-7241 fw=2.4.0 event=link_dropped rtt_ms=402
2026-08-11T08:18:16Z pairing device=ARIA500-7389 fw=2.4.0 event=retry_scheduled rtt_ms=98
2026-08-08T11:00:46Z pairing device=ARIA500-1411 fw=2.4.0 event=link_dropped rtt_ms=410
2026-08-12T00:58:25Z pairing device=ARIA500-7436 fw=2.4.0 event=link_dropped rtt_ms=207
2026-08-02T11:07:53Z pairing device=ARIA500-5328 fw=2.4.0 event=handshake_ok rtt_ms=155
2026-08-03T23:23:14Z pairing device=ARIA500-6355 fw=2.4.0 event=retry_scheduled rtt_ms=459
2026-08-12T11:36:21Z pairing device=ARIA500-7726 fw=2.4.0 event=retry_scheduled rtt_ms=268
2026-08-05T14:55:20Z pairing device=ARIA500-6660 fw=2.4.0 event=handshake_timeout rtt_ms=371
2026-08-09T21:24:34Z pairing device=ARIA500-6433 fw=2.4.0 event=key_exchange_slow rtt_ms=122
2026-08-07T15:52:00Z pairing device=ARIA500-8602 fw=2.4.0 event=handshake_timeout rtt_ms=165
2026-08-01T18:54:35Z pairing device=ARIA500-7562 fw=2.4.0 event=retry_scheduled rtt_ms=373
2026-08-06T11:18:34Z pairing device=ARIA500-5299 fw=2.4.0 event=key_exchange_slow rtt_ms=114
2026-08-05T10:09:41Z pairing device=ARIA500-5347 fw=2.4.0 event=retry_scheduled rtt_ms=346
2026-08-07T07:55:21Z pairing device=ARIA500-6951 fw=2.4.0 event=link_dropped rtt_ms=298
2026-08-05T17:33:16Z pairing device=ARIA500-1962 fw=2.4.0 event=handshake_timeout rtt_ms=438

## Appendix B: device telemetry

| device | fw | phone family | disconnects/hour |
|---|---|---|---|
| ARIA500-5267 | 2.4.0 | Galaxy 15 | 5 |
| ARIA500-2326 | 2.4.0 | iPhone 12 | 7 |
| ARIA500-7488 | 2.4.0 | iPhone 9 | 7 |
| ARIA500-6480 | 2.4.0 | iPhone 15 | 0 |
| ARIA500-1060 | 2.4.0 | Pixel 8 | 13 |
| ARIA500-7886 | 2.4.0 | Galaxy 8 | 4 |
| ARIA500-4924 | 2.4.0 | Galaxy 14 | 0 |
| ARIA500-9030 | 2.4.0 | iPhone 9 | 1 |
| ARIA500-2683 | 2.4.0 | Pixel 9 | 13 |
| ARIA500-4581 | 2.4.0 | Galaxy 12 | 11 |
| ARIA500-5839 | 2.4.0 | Xperia 9 | 10 |
| ARIA500-6900 | 2.4.0 | Galaxy 14 | 9 |
| ARIA500-4409 | 2.4.0 | Pixel 10 | 13 |
| ARIA500-6911 | 2.4.0 | Pixel 12 | 6 |
| ARIA500-3669 | 2.4.0 | Xperia 8 | 5 |
| ARIA500-3684 | 2.4.0 | Pixel 11 | 8 |
| ARIA500-6967 | 2.4.0 | iPhone 9 | 13 |
| ARIA500-1703 | 2.4.0 | iPhone 8 | 13 |
| ARIA500-1660 | 2.4.0 | Xperia 10 | 5 |
| ARIA500-8038 | 2.4.0 | Xperia 9 | 1 |
| ARIA500-4570 | 2.4.0 | iPhone 10 | 1 |
| ARIA500-3315 | 2.4.0 | Pixel 15 | 4 |
| ARIA500-4424 | 2.4.0 | Xperia 13 | 7 |
| ARIA500-8403 | 2.4.0 | Pixel 13 | 14 |
| ARIA500-1994 | 2.4.0 | Xperia 15 | 2 |
| ARIA500-3103 | 2.4.0 | Xperia 11 | 14 |
| ARIA500-9997 | 2.4.0 | iPhone 8 | 7 |
| ARIA500-9177 | 2.4.0 | Galaxy 14 | 11 |
| ARIA500-9803 | 2.4.0 | Pixel 13 | 14 |
| ARIA500-4652 | 2.4.0 | Pixel 8 | 1 |
| ARIA500-9785 | 2.4.0 | Xperia 8 | 1 |
| ARIA500-6101 | 2.4.0 | Pixel 8 | 4 |
| ARIA500-8960 | 2.4.0 | Xperia 14 | 0 |
| ARIA500-3207 | 2.4.0 | iPhone 10 | 6 |
| ARIA500-1579 | 2.4.0 | Xperia 15 | 3 |
| ARIA500-3773 | 2.4.0 | Galaxy 9 | 10 |
| ARIA500-2591 | 2.4.0 | Pixel 15 | 7 |
| ARIA500-7933 | 2.4.0 | iPhone 9 | 13 |
| ARIA500-2694 | 2.4.0 | Galaxy 14 | 11 |
| ARIA500-5860 | 2.4.0 | iPhone 13 | 3 |
| ARIA500-5565 | 2.4.0 | Galaxy 10 | 9 |
| ARIA500-7274 | 2.4.0 | Galaxy 14 | 7 |
| ARIA500-8279 | 2.4.0 | Pixel 11 | 6 |
| ARIA500-8616 | 2.4.0 | Pixel 8 | 5 |
| ARIA500-9621 | 2.4.0 | iPhone 11 | 5 |
| ARIA500-9846 | 2.4.0 | iPhone 9 | 4 |
| ARIA500-6892 | 2.4.0 | Galaxy 9 | 3 |
| ARIA500-8465 | 2.4.0 | Galaxy 12 | 4 |
| ARIA500-5559 | 2.4.0 | iPhone 14 | 13 |
| ARIA500-8203 | 2.4.0 | Galaxy 10 | 9 |
| ARIA500-4619 | 2.4.0 | Pixel 14 | 10 |
| ARIA500-6090 | 2.4.0 | Galaxy 14 | 2 |
| ARIA500-7724 | 2.4.0 | Galaxy 11 | 9 |
| ARIA500-4570 | 2.4.0 | Xperia 14 | 3 |
| ARIA500-8327 | 2.4.0 | iPhone 12 | 13 |
| ARIA500-4711 | 2.4.0 | Xperia 11 | 0 |
| ARIA500-9887 | 2.4.0 | Galaxy 9 | 14 |
| ARIA500-6691 | 2.4.0 | Xperia 13 | 0 |
| ARIA500-4162 | 2.4.0 | iPhone 9 | 4 |
| ARIA500-5968 | 2.4.0 | iPhone 8 | 14 |
| ARIA500-4855 | 2.4.0 | Pixel 14 | 6 |
| ARIA500-5025 | 2.4.0 | Pixel 12 | 7 |
| ARIA500-8541 | 2.4.0 | Pixel 14 | 11 |
| ARIA500-6772 | 2.4.0 | Galaxy 15 | 11 |
| ARIA500-8843 | 2.4.0 | Pixel 11 | 14 |
| ARIA500-1410 | 2.4.0 | Galaxy 8 | 5 |
| ARIA500-9302 | 2.4.0 | Xperia 9 | 1 |
| ARIA500-3957 | 2.4.0 | Galaxy 14 | 2 |
| ARIA500-9457 | 2.4.0 | Xperia 11 | 14 |
| ARIA500-2677 | 2.4.0 | Xperia 13 | 11 |
| ARIA500-5118 | 2.4.0 | Galaxy 10 | 1 |
| ARIA500-2703 | 2.4.0 | Xperia 15 | 7 |
| ARIA500-5951 | 2.4.0 | iPhone 10 | 0 |
| ARIA500-6586 | 2.4.0 | iPhone 10 | 7 |
| ARIA500-9311 | 2.4.0 | Galaxy 10 | 3 |
| ARIA500-1112 | 2.4.0 | iPhone 11 | 2 |
| ARIA500-1304 | 2.4.0 | iPhone 12 | 2 |
| ARIA500-5126 | 2.4.0 | Galaxy 12 | 9 |
| ARIA500-9028 | 2.4.0 | Xperia 12 | 2 |
| ARIA500-1941 | 2.4.0 | Xperia 10 | 4 |
