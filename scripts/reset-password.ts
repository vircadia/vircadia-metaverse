#!/usr/bin/env bun
/**
 * Password Reset Script
 * 
 * Usage: bun scripts/reset-password.ts <username-or-email> <new-password>
 * 
 * Example:
 *   bun scripts/reset-password.ts vircadia newpassword123
 *   bun scripts/reset-password.ts hello@ua92.ac.uk newpassword123
 */

import crypto from 'crypto';
import { MongoClient } from 'mongodb';

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
    console.log('Usage: bun scripts/reset-password.ts <username-or-email> <new-password>');
    console.log('');
    console.log('Examples:');
    console.log('  bun scripts/reset-password.ts vircadia newpassword123');
    console.log('  bun scripts/reset-password.ts hello@ua92.ac.uk newpassword123');
    process.exit(1);
}

const usernameOrEmail = args[0];
const newPassword = args[1];

// Password hashing functions (same as in src/utils/Misc.ts)
function genRandomString(len: number): string {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .slice(0, len);
}

function hashPasswordSalt(password: string, salt: string): string {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
}

async function resetPassword() {
    // MongoDB connection string - adjust if needed
    const mongoUrl = process.env.DB_URL || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'vircadia';
    
    console.log(`Connecting to MongoDB at ${mongoUrl}...`);
    
    const client = new MongoClient(mongoUrl);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db(dbName);
        const accounts = db.collection('accounts');
        
        // Find account by username or email (case-insensitive)
        const account = await accounts.findOne({
            $or: [
                { username: { $regex: new RegExp(`^${usernameOrEmail}$`, 'i') } },
                { email: { $regex: new RegExp(`^${usernameOrEmail}$`, 'i') } }
            ]
        });
        
        if (!account) {
            console.error(`❌ No account found matching: ${usernameOrEmail}`);
            process.exit(1);
        }
        
        console.log(`Found account:`);
        console.log(`  ID: ${account.id}`);
        console.log(`  Username: ${account.username}`);
        console.log(`  Email: ${account.email}`);
        
        // Generate new salt and hash
        const newSalt = genRandomString(16);
        const newHash = hashPasswordSalt(newPassword, newSalt);
        
        // Update the account
        const result = await accounts.updateOne(
            { id: account.id },
            {
                $set: {
                    passwordSalt: newSalt,
                    passwordHash: newHash
                }
            }
        );
        
        if (result.modifiedCount === 1) {
            console.log('');
            console.log('✅ Password reset successfully!');
            console.log(`   You can now login with username "${account.username}" and your new password.`);
        } else {
            console.error('❌ Failed to update password - no document modified');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

resetPassword();
