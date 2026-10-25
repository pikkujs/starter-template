---
type: entity
title: Signed-in user
description: Who the current visitor is, as the app reads it after sign-in.
resource: func:getSession
---

# Signed-in user

The app asks who is signed in with `getSession`: it returns the user's id, email and
name (the name may be empty). Every screen that greets the user or gates on sign-in reads
this one answer rather than keeping its own copy.
