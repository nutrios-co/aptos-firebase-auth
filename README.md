# aptos-firebase-auth
As-is, buyer beware, for demo purposes only......

This is stripped out of a larger repo that we will make pulic soon. Intent is to share the Aptos wallet/Firebase auth process with anyone currently working on an Aptos wallet.

Some comments from Discord:
https://discord.com/channels/945856774056083548/946123778793029683/967528773698326588

>As promised - here is the repo demonstrating authenticating to Google Cloud, specifically via Firebase auth, with an Aptos wallet.  A few disclaimers:
>
>1) This was quickly stripped out of a larger repo that we'll be making public soon, so 'buyer beware', 'all sales final', 'caveat emptor', etc.
>
>2) We're not in the wallet business, so we've substituted code to function as a 'stub wallet'.  It just implements a connect and sign message function that most would expect a basic crypto wallet extension to provide.
>
>Repo is here: https://github.com/nutrios-co/aptos-firebase-auth
>
>I'll be writing a full tutorial on this in the near future as part of our coming "Build in Public" series as it relates to Aptos and our startup Nutrios (still in semi-stealth; reveal soon).  If you have glanced at my blog, there are now three threads: 1) The Aptos base tutorial episodes (e.g. "Episode 2: Sell Things"); 2) Leadership in Crypto (e.g. "Develop the Situation"); 3) and the soon to be released/soon to be titled Nutrios build in public series.  That last one is where this tutorial will land.
>
>Finally, in relation to this repo, here's the basic rundown: 
>1) There are two pieces: client - which runs in the browser, and server which runs on Google Firebase Cloud Functions.
>2) Client makes a call to server to getNonce which returns a randomized string of characters in the response as a JSON object but also as a secured HTTP only cookie.
>3) Client takes the nonce and signs a message with the nonce with the Aptos wallet private key. Sends the signed message back to server along with wallet address.
>4) Server receives signed message from client and verifies signature against public key associated with address and nonce value from cookie.
>5) If signature valid - returns custom auth token to client.
>6) Client receives auth token and sets global state uid.
>
>That's enough for all you good folks working on wallets to track what I'm doing in the code.  This is also why I've been going on about key rotation.  A lot of developers on other chains use this kind of local signing capability to authenticate against an address. That get's real tricky when the key pair changes but the address remains the same. We've persisted the public key in a table tied to the address (as uid in the Firebase auth), but we've got to have a way to know when the key pair changes. That's why I'm pressing for an on chain solution to address persisting when keys rotate. The method I've suggest in issue #566 solves this for us as we can check for a key rotation in the event the signature does not match in our login process. 
>Again - a full tutorial will be coming on this soon for anyone who has a deeper interest but needs more info than my very brief 6 points above
