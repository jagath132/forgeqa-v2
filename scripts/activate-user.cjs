const { MongoClient } = require('mongodb');
const crypto = require('crypto');

async function run() {
  const targetEmail = process.argv[2] ? process.argv[2].toLowerCase().trim() : null;
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('forgeqa');

  const query = targetEmail ? { email: targetEmail } : {};
  const pendingUsers = await db.collection('pending_registrations').find(query).toArray();

  if (pendingUsers.length === 0) {
    console.log(targetEmail ? `No pending registration found for ${targetEmail}` : 'No pending registrations found.');
    await client.close();
    return;
  }

  for (const pending of pendingUsers) {
    console.log(`Processing: ${pending.email} (current status: ${pending.status})`);
    const existing = await db.collection('users').findOne({ email: pending.email });
    let userId = existing?._id?.toString();

    if (!existing) {
      const userCount = await db.collection('users').countDocuments();
      const role = userCount === 0 ? 'Admin' : 'Member';
      const userDoc = {
        email: pending.email,
        passwordHash: pending.passwordHash,
        salt: pending.salt,
        iterations: 210000,
        name: pending.name || pending.email.split('@')[0],
        role,
        subscriptionTier: pending.plan || 'free',
        subscriptionStatus: 'active',
        subscriptionEndsAt: null,
        createdAt: new Date().toISOString(),
        has_seen_welcome: false
      };
      const res = await db.collection('users').insertOne(userDoc);
      userId = res.insertedId.toString();
      console.log(`  -> Created user document with id: ${userId} (Role: ${role})`);
    } else {
      console.log(`  -> User document already exists with id: ${userId}`);
    }

    // Ensure claimed product key exists
    let keyDoc = await db.collection('product_keys').findOne({ registeredEmail: pending.email });
    if (!keyDoc) {
      const KEY_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      function randGrp() {
        let s = '';
        for (let i = 0; i < 5; i++) s += KEY_CHARS[crypto.randomInt(KEY_CHARS.length)];
        return s;
      }
      const key = [randGrp(), randGrp(), randGrp(), randGrp(), randGrp()].join('-');
      await db.collection('product_keys').insertOne({
        key,
        plan: pending.plan || 'free',
        status: 'used',
        usedBy: userId,
        usedAt: new Date().toISOString(),
        registeredEmail: pending.email,
        customerEmail: pending.email,
        customerName: pending.name || pending.email.split('@')[0],
        createdAt: new Date().toISOString()
      });
      keyDoc = { key };
      console.log(`  -> Generated and claimed product key: ${key}`);
    }

    await db.collection('pending_registrations').updateOne(
      { email: pending.email },
      { $set: { status: 'completed', productKey: keyDoc.key, completedAt: new Date().toISOString() } }
    );
    console.log(`  -> Marked pending registration as completed.`);
  }

  console.log('\nAll targeted users are now active and ready to log in on http://127.0.0.1:5173/auth!');
  await client.close();
}

run().catch(console.error);
